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

  // Simulated Staking state (for interactive testing without gas/wallet tokens)
  const [simulatedTier, setSimulatedTier] = useState(() => {
    try {
      return localStorage.getItem("mika_simulated_tier") || null;
    } catch {
      return null;
    }
  });
  const [simulatedCooldown, setSimulatedCooldown] = useState(() => {
    try {
      const saved = localStorage.getItem("mika_simulated_cooldown");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const timerRef = useRef(null);

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

  // 3. Initiate 7-Day Unstake
  const handleInitiateUnstake = async (amountWei) => {
    if (!signer) throw new Error("Wallet not connected");
    setTxLoading(true);
    setTxMessage("Initiating 7-day unstaking cooldown...");
    setError(null);

    try {
      const vaultContract = new ethers.Contract(
        STAKING_CONFIG.contractAddress,
        STAKING_ABI,
        signer
      );
      const tx = await vaultContract.initiateUnstake(amountWei);
      setTxHash(tx.hash);
      setTxMessage("Confirming unstake request...");
      await tx.wait();
      await refreshStakeInfo();
      setTxMessage("Unstake initiated. 7-day cooldown active.");
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

  // Live countdown ticker for simulated cooldown
  useEffect(() => {
    if (simulatedCooldown > 0) {
      const cdInterval = setInterval(() => {
        setSimulatedCooldown((prev) => {
          const nextVal = prev <= 1 ? 0 : prev - 1;
          try {
            if (nextVal === 0) localStorage.removeItem("mika_simulated_cooldown");
            else localStorage.setItem("mika_simulated_cooldown", String(nextVal));
          } catch {}
          return nextVal;
        });
      }, 1000);
      return () => clearInterval(cdInterval);
    }
  }, [simulatedCooldown]);

  // Simulation controls for interactive demonstration & testing
  const simulateStake = useCallback((tier) => {
    if (!tier) {
      resetSimulation();
      return;
    }
    try {
      localStorage.setItem("mika_simulated_tier", tier);
      localStorage.removeItem("mika_simulated_cooldown");
    } catch {}
    setSimulatedTier(tier);
    setSimulatedCooldown(0);
    const tierName = STAKING_CONFIG.tiers[tier]?.name || tier.toUpperCase();
    setTxMessage(`⚡ Demo Mode: Simulated ${tierName} Activated!`);
    setTimeout(() => setTxMessage(null), 3500);
  }, []);

  const simulateInitiateUnstake = useCallback(() => {
    const cdSeconds = 259200; // 3 days
    try {
      localStorage.setItem("mika_simulated_cooldown", String(cdSeconds));
    } catch {}
    setSimulatedCooldown(cdSeconds);
    setTxMessage("⚡ Demo Mode: 3-Day Unbonding Cooldown Triggered (259,200s)");
    setTimeout(() => setTxMessage(null), 3500);
  }, []);

  const resetSimulation = useCallback(() => {
    try {
      localStorage.removeItem("mika_simulated_tier");
      localStorage.removeItem("mika_simulated_cooldown");
    } catch {}
    setSimulatedTier(null);
    setSimulatedCooldown(0);
    setTxMessage("⚡ Demo Mode: Simulation Cleared (Reverted to Live Wallet)");
    setTimeout(() => setTxMessage(null), 3000);
  }, []);

  // Compute effective balances based on live onchain vs simulated mode
  const isSimulated = Boolean(simulatedTier);

  let effectiveStaked = activeStaked;
  let effectivePending = pendingUnstake;
  let effectiveCooldown = cooldownRemainingSeconds;

  if (isSimulated) {
    const tierRaw = BigInt(STAKING_CONFIG.tiers[simulatedTier]?.tokenAmountRaw || "0");
    if (simulatedCooldown > 0) {
      effectivePending = tierRaw;
      effectiveStaked = 0n;
      effectiveCooldown = simulatedCooldown;
    } else {
      effectiveStaked = tierRaw;
      effectivePending = 0n;
      effectiveCooldown = 0;
    }
  }

  const effectiveIsVip = isSimulated
    ? effectiveStaked >= BigInt(STAKING_CONFIG.minVipStakeRaw)
    : isVipActive;

  // Helper formatting
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
    activeStaked: effectiveStaked,
    activeStakedFormatted: Number(ethers.formatUnits(effectiveStaked, 18)).toLocaleString(
      undefined,
      { maximumFractionDigits: 2 }
    ),
    pendingUnstake: effectivePending,
    pendingUnstakeFormatted: Number(ethers.formatUnits(effectivePending, 18)).toLocaleString(
      undefined,
      { maximumFractionDigits: 2 }
    ),
    availableAtTimestamp,
    canWithdrawNow: isSimulated ? simulatedCooldown === 0 && effectivePending > 0n : canWithdrawNow,
    cooldownRemainingSeconds: effectiveCooldown,
    cooldownFormatted: formatCountdown(effectiveCooldown),
    isVipActive: effectiveIsVip,
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
    // Simulated staking exports
    isSimulated,
    simulatedTier,
    simulateStake,
    simulateInitiateUnstake,
    resetSimulation,
  };
}
