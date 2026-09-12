// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

/**
 * @title MikaStakingVault
 * @notice Verifiable Onchain Staking Vault for $MIKA on Robinhood Chain L2.
 * Enforces a strict 7-day unbonding cooldown period before tokens can be withdrawn.
 * Stakers who maintain the required threshold gain VIP access to the hidden sanctuary on mikayla.fun.
 */
contract MikaStakingVault {
    IERC20 public immutable stakingToken;

    // 3 Days unbonding cooldown (259,200 seconds)
    uint256 public constant UNSTAKE_COOLDOWN = 3 days;

    // Global TVL metrics
    uint256 public totalStaked;
    uint256 public totalActiveStakers;

    // Per-user balances
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public pendingUnstakeAmount;
    mapping(address => uint256) public unstakeAvailableAt;

    // Reentrancy guard
    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    // Custom Errors
    error ZeroAmount();
    error InsufficientStakedBalance(uint256 requested, uint256 actual);
    error NoPendingUnstake();
    error CooldownNotFinished(uint256 availableAt, uint256 currentTime);
    error TransferFailed();
    error ReentrancyGuardReentrantCall();

    // Events
    event Staked(address indexed user, uint256 amount, uint256 newTotalStake);
    event UnstakeInitiated(address indexed user, uint256 amount, uint256 releaseTime);
    event UnstakeCancelled(address indexed user, uint256 restoredAmount);
    event Withdrawn(address indexed user, uint256 amount);

    modifier nonReentrant() {
        if (_status == _ENTERED) revert ReentrancyGuardReentrantCall();
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor(address _stakingToken) {
        require(_stakingToken != address(0), "Invalid token address");
        stakingToken = IERC20(_stakingToken);
        _status = _NOT_ENTERED;
    }

    /**
     * @notice Stake $MIKA into the vault.
     * @param amount The quantity of tokens (18 decimals) to stake.
     */
    function stake(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        if (stakedBalance[msg.sender] == 0) {
            totalActiveStakers++;
        }

        stakedBalance[msg.sender] += amount;
        totalStaked += amount;

        bool success = stakingToken.transferFrom(msg.sender, address(this), amount);
        if (!success) revert TransferFailed();

        emit Staked(msg.sender, amount, stakedBalance[msg.sender]);
    }

    /**
     * @notice Initiate the 7-day unbonding cooldown for a given amount.
     * During cooldown, these tokens do not count toward active VIP access.
     * @param amount The quantity to unstake.
     */
    function initiateUnstake(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        uint256 currentStake = stakedBalance[msg.sender];
        if (currentStake < amount) {
            revert InsufficientStakedBalance(amount, currentStake);
        }

        stakedBalance[msg.sender] = currentStake - amount;
        totalStaked -= amount;

        if (stakedBalance[msg.sender] == 0) {
            totalActiveStakers--;
        }

        pendingUnstakeAmount[msg.sender] += amount;
        unstakeAvailableAt[msg.sender] = block.timestamp + UNSTAKE_COOLDOWN;

        emit UnstakeInitiated(msg.sender, amount, unstakeAvailableAt[msg.sender]);
    }

    /**
     * @notice Cancel pending unstake and re-lock tokens back into active stake.
     * Restores VIP access immediately without requiring new approvals.
     */
    function cancelUnstake() external nonReentrant {
        uint256 pending = pendingUnstakeAmount[msg.sender];
        if (pending == 0) revert NoPendingUnstake();

        pendingUnstakeAmount[msg.sender] = 0;
        unstakeAvailableAt[msg.sender] = 0;

        if (stakedBalance[msg.sender] == 0) {
            totalActiveStakers++;
        }

        stakedBalance[msg.sender] += pending;
        totalStaked += pending;

        emit UnstakeCancelled(msg.sender, pending);
    }

    /**
     * @notice Withdraw tokens after the 7-day unbonding period has completed.
     */
    function withdraw() external nonReentrant {
        uint256 pending = pendingUnstakeAmount[msg.sender];
        if (pending == 0) revert NoPendingUnstake();

        uint256 availableAt = unstakeAvailableAt[msg.sender];
        if (block.timestamp < availableAt) {
            revert CooldownNotFinished(availableAt, block.timestamp);
        }

        pendingUnstakeAmount[msg.sender] = 0;
        unstakeAvailableAt[msg.sender] = 0;

        bool success = stakingToken.transfer(msg.sender, pending);
        if (!success) revert TransferFailed();

        emit Withdrawn(msg.sender, pending);
    }

    // =========================================================================
    // VIEW FUNCTIONS FOR FRONTEND VALIDATION
    // =========================================================================

    /**
     * @notice Check whether an address has enough active staked tokens for VIP access.
     */
    function isVipActive(address user, uint256 minRequired) external view returns (bool) {
        return stakedBalance[user] >= minRequired;
    }

    /**
     * @notice Retrieve full staking breakdown for a user.
     */
    function getStakeInfo(address user)
        external
        view
        returns (
            uint256 activeStaked,
            uint256 pendingUnstake,
            uint256 availableAtTimestamp,
            bool canWithdrawNow,
            uint256 cooldownRemainingSeconds
        )
    {
        activeStaked = stakedBalance[user];
        pendingUnstake = pendingUnstakeAmount[user];
        availableAtTimestamp = unstakeAvailableAt[user];

        if (pendingUnstake > 0 && block.timestamp >= availableAtTimestamp) {
            canWithdrawNow = true;
            cooldownRemainingSeconds = 0;
        } else if (pendingUnstake > 0) {
            canWithdrawNow = false;
            cooldownRemainingSeconds = availableAtTimestamp - block.timestamp;
        } else {
            canWithdrawNow = false;
            cooldownRemainingSeconds = 0;
        }
    }
}
