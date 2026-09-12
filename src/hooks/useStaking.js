import { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { STAKING_CONFIG, STAKING_ABI, ERC20_ABI } from "../constants/staking";

export function useStaking(account, signer) {
  const [activeStaked, setActiveStaked] = useState(0n);
  const [pendingUnstake, setPendingUnstake] = useState(0n);
  const [availableAtTimestamp, setAvailableAtTimestamp] = useState(0);
  const [canWithdrawNow, setCanWithdrawNow] = useState(false);
  const [cooldownRemainingSeconds, setCooldownRemainingSeconds] = useState(0);
  const [isVipActive, setIsVipActive] = useState(false);

  const [walletTokenBalance, setWalletTokenBalance] = useState(0n);
  const [allowance, setAllowance] = useState(0n);

  const [totalStakedProtocol, setTotalStakedProtocol] = useState(0n);
  const [totalActiveStakers, setTotalActiveStakers] = useState(0);

  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [txMessage, setTxMessage] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  // Ensure any previous simulation storage is completely cleared
  useEffect(() => {
    try {
      localStorage.removeItem("mika_simulated_tier");
      localStorage.removeItem("mika_simulated_cooldown");
    } catch {}
  }, []);

  // Read-only JSON-RPC provider on Robinhood Chain L2
  const getReadProvider = useCallback(() => {
    return new ethers.JsonRpcProvider(STAKING_CONFIG.rpcUrl);
  }, []);

  const refreshStakeInfo = useCallback(async () => {
    try {
      const readProvider = getReadProvider();
      const vaultContract = new ethers.Contract(
        STAKING_CONFIG.contractAddress,
        STAKING_ABI,
        readProvider
      );
      const tokenContract = new ethers.Contract(
        STAKING_CONFIG.tokenAddress,
        ERC20_ABI,
        readProvider
      );

      // 1. Fetch protocol metrics
      try {
        const [totalStaked, activeCount] = await Promise.all([
          vaultContract.totalStaked(),
          vaultContract.totalActiveStakers(),
        ]);
        setTotalStakedProtocol(totalStaked);
        setTotalActiveStakers(Number(activeCount));
      } catch (e) {
        // Fallback for pre-deployment or simulated RPC
      }

      // 2. Fetch user-specific metrics if account connected
      if (account) {
        const [stakeInfo, bal, userAllowance] = await Promise.all([
          vaultContract.getStakeInfo(account).catch(() => [0n, 0n, 0n, false, 0n]),
          tokenContract.balanceOf(account).catch(() => 0n),
          tokenContract.allowance(account, STAKING_CONFIG.contractAddress).catch(() => 0n),
        ]);

        const [staked, pending, availableAt, canWithdraw, cdRemaining] = stakeInfo;

        setActiveStaked(staked);
        setPendingUnstake(pending);
        setAvailableAtTimestamp(Number(availableAt));
        setCanWithdrawNow(Boolean(canWithdraw));
        setCooldownRemainingSeconds(Number(cdRemaining));

        const minVipRaw = BigInt(STAKING_CONFIG.minVipStakeRaw);
        setIsVipActive(staked >= minVipRaw);

        setWalletTokenBalance(bal);
        setAllowance(userAllowance);
      } else {
        setActiveStaked(0n);
        setPendingUnstake(0n);
        setIsVipActive(false);
        setWalletTokenBalance(0n);
        setAllowance(0n);
      }
    } catch (err) {
      console.warn("useStaking query error:", err);
    } finally {
      setLoading(false);
    }
  }, [account, getReadProvider]);

  // Live countdown ticker for unstaking cooldown
  useEffect(() => {
    if (cooldownRemainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setCooldownRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCanWithdrawNow(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldownRemainingSeconds]);

  // Initial and reactive refresh
  useEffect(() => {
    refreshStakeInfo();
  }, [refreshStakeInfo]);

  // 1. Approve Token
  const handleApprove = async () => {
    if (!signer) throw new Error("Wallet not connected");
    setTxLoading(true);
    setTxMessage("Approving $MIKA for staking vault...");
    setError(null);

    try {
      const tokenContract = new ethers.Contract(
        STAKING_CONFIG.tokenAddress,
        ERC20_ABI,
        signer
      );
      const tx = await tokenContract.approve(
        STAKING_CONFIG.contractAddress,
        ethers.MaxUint256
      );
      setTxHash(tx.hash);
      setTxMessage("Confirming approval on Robinhood Chain L2...");
      await tx.wait();
      await refreshStakeInfo();
      setTxMessage("Approval confirmed!");
      return tx;
    } catch (err) {
      console.error("Approval error:", err);
      setError(err.message);
      throw err;
    } finally {
      setTxLoading(false);
    }
  };

  // 2. Stake Tokens
  const handleStake = async (amountWei) => {
    if (!signer) throw new Error("Wallet not connected");
    setTxLoading(true);
    setTxMessage(`Staking ${ethers.formatUnits(amountWei, 18)} $MIKA...`);
    setError(null);

    try {
      const vaultContract = new ethers.Contract(
        STAKING_CONFIG.contractAddress,
        STAKING_ABI,
        signer
      );
      const tx = await vaultContract.stake(amountWei);
      setTxHash(tx.hash);
      setTxMessage("Confirming stake on Robinhood Chain L2...");
      await tx.wait();
      await refreshStakeInfo();
      setTxMessage("Staking successful! VIP access granted.");
      return tx;
    } catch (err) {
      console.error("Stake error:", err);
      setError(err.message);
      throw err;
    } finally {
      setTxLoading(false);
    }
  };

  // 3. Initiate 3-Day Unstake
  const handleInitiateUnstake = async (amountWei) => {
    if (!signer) throw new Error("Wallet not connected");
    setTxLoading(true);
    setTxMessage("Initiating 3-day unstaking cooldown...");
    setError(null);

    try {
      const vaultContract = new ethers.Contract(
        STAKING_CONFIG.contractAddress,
        STAKING_ABI,
        signer
      );
      const tx = await vaultContract.initiateUnstake(amountWei);
      setTxHash(tx.hash);
      setTxMessage("Confirming unstake request on Robinhood Chain L2...");
      await tx.wait();
      await refreshStakeInfo();
      setTxMessage("Unstake initiated. 3-day cooldown active.");
      return tx;
    } catch (err) {
      console.error("Initiate unstake error:", err);
      setError(err.message);
      throw err;
    } finally {
      setTxLoading(false);
    }
  };

  // 4. Cancel Unstake & Restore Active Stake
  const handleCancelUnstake = async () => {
    if (!signer) throw new Error("Wallet not connected");
    setTxLoading(true);
    setTxMessage("Cancelling unstake & restoring VIP status...");
    setError(null);

    try {
      const vaultContract = new ethers.Contract(
        STAKING_CONFIG.contractAddress,
        STAKING_ABI,
        signer
      );
      const tx = await vaultContract.cancelUnstake();
      setTxHash(tx.hash);
      setTxMessage("Confirming cancellation...");
      await tx.wait();
      await refreshStakeInfo();
      setTxMessage("Unstake cancelled! Tokens re-locked and VIP restored.");
      return tx;
    } catch (err) {
      console.error("Cancel unstake error:", err);
      setError(err.message);
      throw err;
    } finally {
      setTxLoading(false);
    }
  };

  // 5. Withdraw Unlocked Tokens
  const handleWithdraw = async () => {
    if (!signer) throw new Error("Wallet not connected");
    setTxLoading(true);
    setTxMessage("Withdrawing unstaked tokens to wallet...");
    setError(null);

    try {
      const vaultContract = new ethers.Contract(
        STAKING_CONFIG.contractAddress,
        STAKING_ABI,
        signer
      );
      const tx = await vaultContract.withdraw();
      setTxHash(tx.hash);
      setTxMessage("Confirming withdrawal...");
      await tx.wait();
      await refreshStakeInfo();
      setTxMessage("Tokens successfully withdrawn to your wallet!");
      return tx;
    } catch (err) {
      console.error("Withdraw error:", err);
      setError(err.message);
      throw err;
    } finally {
      setTxLoading(false);
    }
  };

  // Helper formatting for unbonding cooldown
  const formatCountdown = (totalSeconds) => {
    if (totalSeconds <= 0) return "0d 0h 0m 0s";
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return {
    loading,
    activeStaked,
    activeStakedFormatted: Number(ethers.formatUnits(activeStaked, 18)).toLocaleString(
      undefined,
      { maximumFractionDigits: 2 }
    ),
    pendingUnstake,
    pendingUnstakeFormatted: Number(ethers.formatUnits(pendingUnstake, 18)).toLocaleString(
      undefined,
      { maximumFractionDigits: 2 }
    ),
    availableAtTimestamp,
    canWithdrawNow,
    cooldownRemainingSeconds,
    cooldownFormatted: formatCountdown(cooldownRemainingSeconds),
    isVipActive,
    walletTokenBalance,
    walletTokenBalanceFormatted: Number(
      ethers.formatUnits(walletTokenBalance, 18)
    ).toLocaleString(undefined, { maximumFractionDigits: 2 }),
    allowance,
    isApproved: allowance > 0n,
    totalStakedProtocol,
    totalStakedProtocolFormatted: Number(
      ethers.formatUnits(totalStakedProtocol, 18)
    ).toLocaleString(undefined, { maximumFractionDigits: 0 }),
    totalActiveStakers,
    txLoading,
    txMessage,
    txHash,
    error,
    refreshStakeInfo,
    handleApprove,
    handleStake,
    handleInitiateUnstake,
    handleCancelUnstake,
    handleWithdraw,
  };
}
