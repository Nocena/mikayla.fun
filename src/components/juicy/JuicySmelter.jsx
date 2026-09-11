import React, { useState, useRef, useEffect } from "react";
import {
  Flame,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  Sparkles,
  X,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Film,
  Dice5,
  Download,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Wallet,
  ExternalLink,
} from "lucide-react";
import {
  SMELTER_DATA,
  JUICY_BURN_TIERS,
  JUICY_VIDEO_POOL,
  FULL_VIDEO_CHILDREN,
  VIDEO_PARENT_MAP,
} from "../../constants/juicy";
import {
  useWeb3Wallet,
  MIKA_TOKEN_ADDRESS,
  ROBINHOOD_CHAIN,
} from "../../hooks/useWeb3Wallet";
import { useTokenData } from "../../hooks/useTokenData";
import CountUp from "../react-bits/CountUp";

const SIGNATURE_GREEN = "#d4fc50";
const STORAGE_KEY = "juicy_claimed_videos_v3";

export default function JuicySmelter() {
  const {
    account,
    chainId,
    balance,
    rawBalance,
    hasProvider,
    isConnecting,
    isConnected,
    isCorrectNetwork,
    txState,
    connectWallet,
    disconnectWallet,
    switchToRobinhood,
    burnTokens,
    fetchBalance,
  } = useWeb3Wallet();

  const tokenData = useTokenData();
  const livePriceUsd = tokenData?.priceUsd || 0.00008641;

  // Helper to dynamically calculate token amount from on-chain live price
  const getTokensForUsd = (usd) => {
    const p = livePriceUsd > 0 ? livePriceUsd : 0.00008641;
    return Math.max(1, Math.round(usd / p));
  };

  const tokens25Usd = getTokensForUsd(25);
  const tokens10Usd = getTokensForUsd(10);
  const tokens5Usd = getTokensForUsd(5);

  // Default to $25 USD on-chain equivalent amount (automatically picked for the user!)
  const [selectedTokens, setSelectedTokens] = useState(() => Math.round(25 / 0.00008641));
  const [inputVal, setInputVal] = useState(() => Math.round(25 / 0.00008641).toLocaleString());
  const [hasManuallyEditedInput, setHasManuallyEditedInput] = useState(false);

  // Automatically update to the live on-chain $25 USD equivalent when price data arrives
  useEffect(() => {
    if (livePriceUsd && livePriceUsd > 0 && !hasManuallyEditedInput) {
      const exact25 = Math.round(25 / livePriceUsd);
      setSelectedTokens(exact25);
      setInputVal(exact25.toLocaleString());
    }
  }, [livePriceUsd, hasManuallyEditedInput]);

  const [isIncinerating, setIsIncinerating] = useState(false);
  const [burnSuccess, setBurnSuccess] = useState(null);
  const [burnError, setBurnError] = useState(null);
  const [totalBurned, setTotalBurned] = useState(SMELTER_DATA.totalTokensBurned);
  const [recentBurns, setRecentBurns] = useState(SMELTER_DATA.recentSmelts);

  // Claimed Videos State (Persisted in localStorage so claimed drops stay claimed)
  const [claimedVideoIds, setClaimedVideoIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(claimedVideoIds));
    } catch (e) {}
  }, [claimedVideoIds]);

  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [isProcessingUnlock, setIsProcessingUnlock] = useState(false);

  // Video Player Simulation State
  const [isPlayingSim, setIsPlayingSim] = useState(true);
  const [simProgress, setSimProgress] = useState(0);

  const canvasRef = useRef(null);

  // Pool Query Helpers
  const getTierPool = (tierId) => JUICY_VIDEO_POOL.filter((v) => v.tierId === tierId);

  const getClaimedInTier = (tierId) =>
    getTierPool(tierId).filter((v) => claimedVideoIds.includes(v.id));

  const getUnclaimedInTier = (tierId) =>
    getTierPool(tierId).filter((v) => !claimedVideoIds.includes(v.id));

  const ownsFullVideo = (fullVidId) => claimedVideoIds.includes(fullVidId);

  const tier1Pool = getTierPool("burn-tier-01");
  const tier1Claimed = getClaimedInTier("burn-tier-01");
  const tier1Unclaimed = getUnclaimedInTier("burn-tier-01");
  const isTier1Maxed = tier1Unclaimed.length === 0;

  const tier2Pool = getTierPool("burn-tier-02");
  const tier2Claimed = getClaimedInTier("burn-tier-02");
  const tier2Unclaimed = getUnclaimedInTier("burn-tier-02");
  const isTier2Maxed = tier2Unclaimed.length === 0;

  const tier3Pool = getTierPool("burn-tier-03");
  const tier3Claimed = getClaimedInTier("burn-tier-03");
  const tier3Unclaimed = getUnclaimedInTier("burn-tier-03");
  const isTier3Maxed = tier3Unclaimed.length === 0;

  // Reset Demo Vault
  const handleResetClaims = () => {
    setClaimedVideoIds([]);
    setActiveModalVideo(null);
    setBurnSuccess("Vault demo reset: all drops returned to uncollected pool.");
    setTimeout(() => setBurnSuccess(null), 3500);
  };

  // Claim next unique video for a tier (strictly prevents duplicate drops!)
  const claimVideoForTier = (tierId) => {
    const unclaimed = getUnclaimedInTier(tierId);
    if (unclaimed.length === 0) {
      return null;
    }

    // Always select the next uncollected video
    const pickedVideo = unclaimed[0];

    // If unlocking a Full Film ($25 tier), auto-claim all its child snippets & clips!
    const childIds = pickedVideo.childVideoIds || FULL_VIDEO_CHILDREN[pickedVideo.id] || [];
    const newlyClaimedChildren = childIds.filter((cid) => !claimedVideoIds.includes(cid));

    const updatedClaimed = Array.from(
      new Set([...claimedVideoIds, pickedVideo.id, ...childIds])
    );
    setClaimedVideoIds(updatedClaimed);

    return {
      video: pickedVideo,
      newlyClaimedChildren,
    };
  };

  // Presets dynamically calculated from live on-chain token price ($25, $10, $5 USD)
  const PRESETS = [
    {
      id: "tier3",
      label: "TIER 03",
      badge: "$25 BURN",
      sublabel: `${tokens25Usd.toLocaleString()} $MIKA`,
      value: tokens25Usd,
      reward: "Full Minutes Video",
      claimedCount: tier3Claimed.length,
      totalCount: 3,
      isMaxed: isTier3Maxed,
      poolBadge: isTier3Maxed ? "3/3 MAXED ✓" : `${tier3Claimed.length}/3 Claimed`,
      burnInfo: isTier3Maxed ? "All 3 full films collected" : "Auto-claims all child clips free",
      tierId: "burn-tier-03",
      isRecommended: true,
    },
    {
      id: "tier2",
      label: "TIER 02",
      badge: "$10 BURN",
      sublabel: `${tokens10Usd.toLocaleString()} $MIKA`,
      value: tokens10Usd,
      reward: "30-Sec Snippet",
      claimedCount: tier2Claimed.length,
      totalCount: 6,
      isMaxed: isTier2Maxed,
      poolBadge: isTier2Maxed ? "6/6 MAXED ✓" : `${tier2Claimed.length}/6 Claimed`,
      burnInfo: isTier2Maxed ? "All 6 snippets collected" : `${tier2Unclaimed.length} unique snippets left`,
      tierId: "burn-tier-02",
    },
    {
      id: "tier1",
      label: "TIER 01",
      badge: "$5 BURN",
      sublabel: `${tokens5Usd.toLocaleString()} $MIKA`,
      value: tokens5Usd,
      reward: "3-Sec Clip",
      claimedCount: tier1Claimed.length,
      totalCount: 10,
      isMaxed: isTier1Maxed,
      poolBadge: isTier1Maxed ? "10/10 MAXED ✓" : `${tier1Claimed.length}/10 Claimed`,
      burnInfo: isTier1Maxed ? "All 10 clips collected" : `${tier1Unclaimed.length} unique clips left`,
      tierId: "burn-tier-01",
    },
  ];


  // Looping Canvas Animation: Industrial Induction Crucible & Cash Embers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Particle pool for embers
    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 1200),
        y: Math.random() * (canvas.height || 800),
        size: Math.random() * 2 + 0.8,
        speedY: Math.random() * 0.7 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2,
        decay: Math.random() * 0.003 + 0.001,
      });
    }

    let frame = 0;
    const render = () => {
      frame++;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      // Industrial Induction Ring Heat Bloom
      const glowGrad = ctx.createRadialGradient(
        w / 2,
        h * 0.42,
        10,
        w / 2,
        h * 0.42,
        Math.min(w, h) * 0.45
      );
      glowGrad.addColorStop(0, "rgba(212, 252, 80, 0.07)");
      glowGrad.addColorStop(0.5, "rgba(212, 252, 80, 0.02)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // Induction Core Coil Ring
      const ringPulse = Math.sin(frame * 0.03) * 4;
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.45, 180 + ringPulse, 45, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(212, 252, 80, 0.12)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Floating Cash Ash Embers
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.alpha -= p.decay;

        if (p.y < 0 || p.alpha <= 0) {
          p.y = h + 10;
          p.x = Math.random() * w;
          p.alpha = Math.random() * 0.6 + 0.2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 252, 80, ${p.alpha})`;
        ctx.shadowColor = SIGNATURE_GREEN;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Expose burst trigger for burns
    canvas.__triggerBurst = () => {
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: canvas.width / (window.devicePixelRatio || 1) / 2 + (Math.random() - 0.5) * 160,
          y: canvas.height / (window.devicePixelRatio || 1) * 0.45,
          size: Math.random() * 3.5 + 1.5,
          speedY: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 5,
          alpha: 1.0,
          decay: Math.random() * 0.015 + 0.008,
        });
      }
    };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Web Audio Synthesizer for tactile burn furnace feedback
  const playBurnSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.5);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.8);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.4);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 1.8);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.0);
    } catch (e) {}
  };

  // Video playback timer effect when viewing simulated modal
  useEffect(() => {
    if (!activeModalVideo || !isPlayingSim) return;
    const duration = activeModalVideo.durationSec || 3;
    const intervalTime = 100;
    const increment = (intervalTime / (duration * 1000)) * 100;

    const timer = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 100) {
          return 0; // loop playback
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeModalVideo, isPlayingSim]);

  const handleSelectPreset = (val) => {
    setSelectedTokens(val);
    setInputVal(val.toLocaleString());
  };

  const handleInputChange = (e) => {
    setHasManuallyEditedInput(true);
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = parseInt(raw || "0", 10);
    setSelectedTokens(num);
    setInputVal(num > 0 ? num.toLocaleString() : "");
  };

  const handleSelectUsd = (usd) => {
    setHasManuallyEditedInput(false);
    const amt = getTokensForUsd(usd);
    setSelectedTokens(amt);
    setInputVal(amt.toLocaleString());
  };

  const handleSetMax = () => {
    setHasManuallyEditedInput(true);
    if (!isConnected) {
      connectWallet();
      return;
    }
    const cleanNum = balance.replace(/,/g, "");
    const intVal = Math.floor(parseFloat(cleanNum) || 0);
    if (intVal > 0) {
      setSelectedTokens(intVal);
      setInputVal(intVal.toLocaleString());
    } else {
      setBurnError("Your wallet has 0 $MIKA balance. Acquire or transfer $MIKA on Robinhood Chain L2 to burn.");
      setTimeout(() => setBurnError(null), 5000);
    }
  };

  const handleSetTest = (amt = 100) => {
    setHasManuallyEditedInput(true);
    setSelectedTokens(amt);
    setInputVal(amt.toLocaleString());
  };

  // Main Burn Handler in Smelter Card (Executes on-chain burn with wallet signature)
  const handleBurn = async () => {
    // 1. Check wallet connection
    if (!isConnected) {
      const connectedAcc = await connectWallet();
      if (!connectedAcc) return;
    }

    // 2. Check network
    if (!isCorrectNetwork) {
      const switched = await switchToRobinhood();
      if (!switched) return;
    }

    const amount = selectedTokens || tokens25Usd;
    if (amount <= 0 || isIncinerating) return;

    let targetTierId = null;
    // Dynamic tier matching against live on-chain token thresholds
    if (amount >= tokens25Usd || amount >= 250000) {
      targetTierId = "burn-tier-03";
    } else if (amount >= tokens10Usd || amount >= 100000) {
      targetTierId = "burn-tier-02";
    } else if (amount >= tokens5Usd || amount >= 50000) {
      targetTierId = "burn-tier-01";
    } else {
      // Test burn with smaller amount (< 5 USD): award next available Tier 1 drop so testing works seamlessly!
      if (!isTier1Maxed) targetTierId = "burn-tier-01";
      else if (!isTier2Maxed) targetTierId = "burn-tier-02";
      else if (!isTier3Maxed) targetTierId = "burn-tier-03";
    }

    if (targetTierId) {
      const unclaimed = getUnclaimedInTier(targetTierId);
      const tierInfo = JUICY_BURN_TIERS.find((t) => t.id === targetTierId);
      if (unclaimed.length === 0) {
        setBurnError(
          `All ${tierInfo?.poolCount || "available"} drops in ${tierInfo?.title || "this tier"} are already collected! You cannot burn more tokens for this tier.`
        );
        setTimeout(() => setBurnError(null), 5000);
        return;
      }
    }

    setIsIncinerating(true);
    setBurnError(null);
    setBurnSuccess(null);
    playBurnSound();

    if (canvasRef.current?.__triggerBurst) {
      canvasRef.current.__triggerBurst();
    }

    try {
      // Execute REAL ON-CHAIN BURN WITH WALLET SIGNATURE!
      const resultTx = await burnTokens(amount);

      setTotalBurned((prev) => prev + amount);

      let pickedVideo = null;
      let unlockedTierName = "Direct Incinerator Burn";

      if (targetTierId) {
        const result = claimVideoForTier(targetTierId);
        if (result && result.video) {
          pickedVideo = result.video;
          const { video, newlyClaimedChildren } = result;
          unlockedTierName = `${video.tierCode} (Drop #${video.poolIndex})`;

          let msg = `🔥 On-Chain Burn Confirmed! Burned ${amount.toLocaleString()} $MIKA! Unlocked Drop #${video.poolIndex} (${video.title}). Guaranteed unique!`;
          if (video.tierId === "burn-tier-03" && newlyClaimedChildren.length > 0) {
            msg += ` ✨ Auto-claimed ${newlyClaimedChildren.length} clips & snippets included in this full film for free!`;
          }
          setBurnSuccess(msg);
        }
      } else {
        setBurnSuccess(`🔥 On-Chain Burn Confirmed! Burned ${amount.toLocaleString()} $MIKA permanently to 0x0...dEaD!`);
      }

      if (pickedVideo) {
        setSimProgress(0);
        setIsPlayingSim(true);
        setActiveModalVideo(pickedVideo);
      }

      const newTx = {
        id: `smelt-${Date.now()}`,
        wallet: account ? `${account.slice(0, 6)}...${account.slice(-4)} (You)` : "0x7a8...1fA0 (You)",
        amount: `${amount.toLocaleString()} $MIKA`,
        tier: unlockedTierName,
        time: "Just now",
        txHash: resultTx.txHash,
        explorerUrl: resultTx.explorerUrl,
      };
      setRecentBurns((prev) => [newTx, ...prev.slice(0, 3)]);
      setTimeout(() => setBurnSuccess(null), 9000);
    } catch (err) {
      console.error("Burn error:", err);
      setBurnError(err?.message || "Burn transaction failed.");
      setTimeout(() => setBurnError(null), 6000);
    } finally {
      setIsIncinerating(false);
    }
  };

  // Direct Tier Card Burn Handler (Executes on-chain burn with wallet signature)
  const handleUnlockTier = async (tier) => {
    // 1. Check wallet connection
    if (!isConnected) {
      const connectedAcc = await connectWallet();
      if (!connectedAcc) return;
    }

    // 2. Check network
    if (!isCorrectNetwork) {
      const switched = await switchToRobinhood();
      if (!switched) return;
    }

    const unclaimed = getUnclaimedInTier(tier.id);
    if (unclaimed.length === 0) {
      setBurnError(`All ${tier.poolCount} drops in ${tier.title} are already collected! Maximum reached.`);
      setTimeout(() => setBurnError(null), 4000);
      return;
    }

    setSelectedTokens(tier.costTokens);
    setInputVal(tier.costTokens.toLocaleString());
    setIsIncinerating(true);
    setIsProcessingUnlock(true);
    setBurnError(null);
    setBurnSuccess(null);
    playBurnSound();

    if (canvasRef.current?.__triggerBurst) {
      canvasRef.current.__triggerBurst();
    }

    try {
      // Execute REAL ON-CHAIN BURN WITH WALLET SIGNATURE!
      const resultTx = await burnTokens(tier.costTokens);

      setTotalBurned((prev) => prev + tier.costTokens);

      const result = claimVideoForTier(tier.id);
      if (result && result.video) {
        const { video, newlyClaimedChildren } = result;
        setSimProgress(0);
        setIsPlayingSim(true);
        setActiveModalVideo(video);

        let msg = `🔥 On-Chain Burn Confirmed! Incinerated ${tier.costTokens.toLocaleString()} $MIKA! Unlocked Drop #${video.poolIndex} (${video.title}). Guaranteed unique!`;
        if (tier.id === "burn-tier-03" && newlyClaimedChildren.length > 0) {
          msg += ` ✨ Auto-claimed ${newlyClaimedChildren.length} clips & snippets included in this full film for free!`;
        }
        setBurnSuccess(msg);
      }

      const newTx = {
        id: `smelt-${Date.now()}`,
        wallet: account ? `${account.slice(0, 6)}...${account.slice(-4)} (You)` : "0x7a8...1fA0 (You)",
        amount: `${tier.costTokens.toLocaleString()} $MIKA`,
        tier: `${tier.costDisplay} (${tier.durationBadge})`,
        time: "Just now",
        txHash: resultTx.txHash,
        explorerUrl: resultTx.explorerUrl,
      };
      setRecentBurns((prev) => [newTx, ...prev.slice(0, 3)]);
      setTimeout(() => setBurnSuccess(null), 9000);
    } catch (err) {
      console.error("Tier burn error:", err);
      setBurnError(err?.message || "Tier burn transaction failed.");
      setTimeout(() => setBurnError(null), 6000);
    } finally {
      setIsIncinerating(false);
      setIsProcessingUnlock(false);
    }
  };

  // Watch existing unlocked tier video (opens latest claimed or specified video)
  const handleWatchUnlocked = (tier) => {
    const claimed = getClaimedInTier(tier.id);
    if (claimed.length > 0) {
      setSimProgress(0);
      setIsPlayingSim(true);
      setActiveModalVideo(claimed[claimed.length - 1]);
    }
  };

  // Cycle through claimed videos inside the modal
  const handleCycleModalVideo = (direction) => {
    if (!activeModalVideo) return;
    const claimedInTier = getClaimedInTier(activeModalVideo.tierId);
    if (claimedInTier.length <= 1) return;

    const currentIdx = claimedInTier.findIndex((v) => v.id === activeModalVideo.id);
    let nextIdx = direction === "next" ? currentIdx + 1 : currentIdx - 1;
    if (nextIdx >= claimedInTier.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = claimedInTier.length - 1;

    setSimProgress(0);
    setIsPlayingSim(true);
    setActiveModalVideo(claimedInTier[nextIdx]);
  };

  // Download video file directly to device
  const handleDownloadVideo = (video) => {
    if (!video || !video.videoUrl) return;
    const link = document.createElement("a");
    link.href = video.videoUrl;
    link.download = video.downloadFilename || `${video.title.replace(/\s+/g, "_")}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="smelter"
      className="relative py-24 sm:py-32 bg-[#060706] text-[#f4f4f2] overflow-hidden border-b border-white/10"
    >
      {/* Background Looping Induction & Ember Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_35%,transparent_20%,rgba(6,7,6,0.85)_100%)] z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060706] via-transparent to-[#060706] z-10" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-14 relative z-20">
        {/* Incinerator Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4fc50]/10 border border-[#d4fc50]/30 mb-3 font-mono text-xs uppercase tracking-widest text-[#d4fc50]">
            <Flame className="w-3.5 h-3.5 text-[#d4fc50] animate-pulse" />
            <span>THE INCINERATOR // PERMANENT SUPPLY BURN</span>
          </div>
          <h2 className="font-gta text-5xl sm:text-7xl text-white tracking-tight leading-none uppercase">
            THE INCINERATOR
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-3 max-w-xl mx-auto font-sans font-light leading-relaxed">
            Burn $JUICY tokens to permanently destroy supply on Robinhood L2 and unlock exclusive private video content. The bigger the burn, the more you unlock.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* CENTERPIECE BURNER CRUCIBLE CARD (5 / 10 / 25 USD Burns)                   */}
        {/* ========================================================================= */}
        <div className="max-w-3xl mx-auto mb-20 p-6 sm:p-9 rounded-3xl bg-[#0c0d0c]/85 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4fc50]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Big Number: Cumulative Burned */}
          <div className="text-center pb-6 mb-6 border-b border-white/10">
            <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">
              TOTAL SUPPLY INCINERATED
            </div>
            <div className="font-gta text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight flex items-baseline justify-center gap-2">
              <span className="text-[#d4fc50]">
                <CountUp from={totalBurned - 60000} to={totalBurned} separator="," duration={1.2} />
              </span>
              <span className="text-xl sm:text-2xl text-white/60 font-mono font-normal">
                $MIKA
              </span>
            </div>
            <div className="text-xs font-mono text-white/50 mt-1">
              ~$3,625 USD Destroyed · <span className="text-[#30d158]">1.48% Deflationary Contraction</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CONNECTED WEB3 WALLET & ROBINHOOD CHAIN L2 BAR                            */}
          {/* ========================================================================= */}
          <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div
                className={`p-2.5 rounded-xl border ${
                  !isConnected
                    ? "bg-white/5 border-white/10 text-white/40"
                    : !isCorrectNetwork
                    ? "bg-[#ff9500]/15 border-[#ff9500]/40 text-[#ff9500]"
                    : "bg-[#30d158]/15 border-[#30d158]/40 text-[#30d158]"
                }`}
              >
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white/50 text-[10px] uppercase font-bold tracking-wider">
                    {isConnected ? "CONNECTED WALLET" : "WALLET DISCONNECTED"}
                  </span>
                  {isConnected && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${
                        isCorrectNetwork
                          ? "bg-[#30d158]/20 text-[#30d158] border-[#30d158]/30"
                          : "bg-[#ff9500]/20 text-[#ff9500] border-[#ff9500]/40"
                      }`}
                    >
                      {isCorrectNetwork ? "ROBINHOOD L2 (4663) ✓" : "WRONG NETWORK"}
                    </span>
                  )}
                </div>
                {isConnected ? (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-white font-bold">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="text-[#d4fc50] font-bold">
                      Balance: {balance} $MIKA
                    </span>
                  </div>
                ) : (
                  <div className="text-white/60 text-[11px] mt-0.5">
                    Connect wallet with $MIKA to sign burn transactions on-chain
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {!isConnected ? (
                <button
                  type="button"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#d4fc50] hover:bg-white text-black font-bold uppercase text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(212,252,80,0.3)] flex items-center justify-center gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
                </button>
              ) : !isCorrectNetwork ? (
                <button
                  type="button"
                  onClick={switchToRobinhood}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#ff9500] hover:bg-white text-black font-bold uppercase text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(255,149,0,0.4)] animate-pulse"
                >
                  Switch to Robinhood L2
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSetMax}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d4fc50] font-bold text-[10px] uppercase border border-white/10 cursor-pointer transition-colors"
                    title="Set burn input to your maximum $MIKA balance"
                  >
                    USE MAX
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetTest(100)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 font-bold text-[10px] uppercase border border-white/10 cursor-pointer transition-colors"
                    title="Set quick test burn of 100 $MIKA"
                  >
                    TEST 100
                  </button>
                  <button
                    type="button"
                    onClick={disconnectWallet}
                    className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] uppercase cursor-pointer transition-colors"
                    title="Disconnect wallet"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live On-Chain Price & Auto-Calculated USD Equivalents Banner */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-[#d4fc50]/30 font-mono text-[11px] shadow-[0_0_15px_rgba(212,252,80,0.04)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse shrink-0" />
              <span className="text-white/60 uppercase">LIVE ON-CHAIN PRICE:</span>
              <span className="text-[#d4fc50] font-bold">
                ${livePriceUsd ? livePriceUsd.toFixed(8) : "0.00008641"} USD
              </span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span className="text-white/80 hidden sm:inline">
                $25 = <strong className="text-[#d4fc50]">{tokens25Usd.toLocaleString()}</strong> · $10 = <strong className="text-[#ff9500]">{tokens10Usd.toLocaleString()}</strong> · $5 = <strong className="text-[#30d158]">{tokens5Usd.toLocaleString()}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectUsd(25)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedTokens === tokens25Usd
                    ? "bg-[#d4fc50] text-black"
                    : "bg-[#d4fc50]/20 hover:bg-[#d4fc50]/30 text-[#d4fc50] border border-[#d4fc50]/40"
                }`}
                title="Automatically pick exact 25 USD on-chain equivalent amount"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Pick $25</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectUsd(10)}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                  selectedTokens === tokens10Usd
                    ? "bg-[#ff9500] text-black"
                    : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/10"
                }`}
                title="Automatically pick exact 10 USD on-chain equivalent amount"
              >
                <span>$10</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectUsd(5)}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                  selectedTokens === tokens5Usd
                    ? "bg-[#30d158] text-black"
                    : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/10"
                }`}
                title="Automatically pick exact 5 USD on-chain equivalent amount"
              >
                <span>$5</span>
              </button>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-white/60">
                Select Burn Batch
              </label>
              <span className="text-[10px] font-mono text-[#d4fc50]/90 font-bold">
                Auto-Priced On-Chain ↓
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESETS.map((preset) => {
                const isSelected = selectedTokens === preset.value;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.value)}
                    className={`p-3 sm:p-3.5 rounded-xl text-center font-mono transition-all cursor-pointer flex flex-col items-center justify-between relative ${
                      isSelected
                        ? "bg-[#d4fc50] text-black shadow-[0_0_20px_rgba(212,252,80,0.35)] scale-[1.02]"
                        : preset.isRecommended
                        ? "bg-white/[0.07] hover:bg-white/[0.12] text-white border border-[#d4fc50]/40"
                        : preset.isMaxed
                        ? "bg-white/[0.03] text-white/50 border border-[#30d158]/30"
                        : "bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-bold">{preset.label}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          isSelected
                            ? "bg-black/20 text-black"
                            : preset.isMaxed
                            ? "bg-[#30d158]/20 text-[#30d158]"
                            : preset.isRecommended
                            ? "bg-[#d4fc50]/20 text-[#d4fc50]"
                            : "bg-white/10 text-[#d4fc50]"
                        }`}
                      >
                        {preset.isMaxed ? "MAXED ✓" : preset.badge}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold ${isSelected ? "text-black" : "text-white/90"}`}>
                      {preset.sublabel}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded mt-1.5 border ${
                        isSelected
                          ? "bg-black text-[#d4fc50] border-black"
                          : preset.isMaxed
                          ? "bg-[#30d158]/15 text-[#30d158] border-[#30d158]/30"
                          : "bg-[#d4fc50]/15 text-[#d4fc50] border-[#d4fc50]/30"
                      }`}
                    >
                      {preset.poolBadge}
                    </span>
                    <span className={`text-[8.5px] mt-1 line-clamp-1 ${isSelected ? "text-black/80 font-medium" : "text-white/40"}`}>
                      {preset.burnInfo}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Input */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                placeholder="Custom Amount"
                className="w-full px-4 py-3.5 rounded-xl bg-black/70 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#d4fc50] transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectUsd(25)}
                  className="px-2 py-1 rounded bg-[#d4fc50]/20 hover:bg-[#d4fc50]/30 text-[#d4fc50] text-[10px] font-mono uppercase font-bold cursor-pointer border border-[#d4fc50]/40"
                  title="Auto-pick exact $25 USD on-chain equivalent"
                >
                  $25 (LIVE)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectUsd(10)}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 text-[10px] font-mono uppercase font-bold cursor-pointer"
                  title="$10 Burn"
                >
                  $10
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectUsd(5)}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 text-[10px] font-mono uppercase font-bold cursor-pointer"
                  title="$5 Burn"
                >
                  $5
                </button>
                <button
                  type="button"
                  onClick={handleSetMax}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[#30d158] text-[10px] font-mono uppercase font-bold cursor-pointer border border-white/15"
                  title="Burn full wallet balance"
                >
                  MAX
                </button>
                <span className="text-xs font-mono text-[#d4fc50] font-bold ml-1">
                  $MIKA
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Unlock / Deflation Benefit Indicator */}
          <div className="mb-6">
            {selectedTokens >= tokens25Usd ? (
              isTier3Maxed ? (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#30d158]/15 border border-[#30d158]/40 text-xs font-mono text-[#30d158] animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#30d158]" />
                  <div className="flex-1">
                    <span className="font-bold uppercase tracking-wider block">
                      ALL 3/3 FULL MASTER FILMS UNLOCKED ✓
                    </span>
                    <span className="text-[11px] text-[#30d158]/90 font-sans mt-0.5 block leading-relaxed">
                      Your vault holds all 3 complete uncut master films and all child scenes. Tier pool complete!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#d4fc50]/15 border border-[#d4fc50]/40 text-xs font-mono text-[#d4fc50] animate-fadeIn">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#d4fc50]" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider block">
                        AUTO-PICKED: $25.00 USD ON-CHAIN EQUIVALENT ({selectedTokens.toLocaleString()} $MIKA)
                      </span>
                      <span className="text-[10px] bg-[#d4fc50]/25 border border-[#d4fc50]/40 px-2 py-0.5 rounded font-bold">
                        {tier3Unclaimed.length} FULL FILMS LEFT
                      </span>
                    </div>
                    <span className="text-[11px] text-white/80 font-sans mt-0.5 block leading-relaxed">
                      Burning <strong>{selectedTokens.toLocaleString()} $MIKA</strong> (exact <strong>$25.00 USD</strong> at live on-chain price) unlocks <strong>Full Master Film #{tier3Claimed.length + 1} of 3</strong> and <strong>auto-claims all child snippets & clips for free</strong> into your vault!
                    </span>
                  </div>
                </div>
              )
            ) : selectedTokens >= tokens10Usd ? (
              isTier2Maxed ? (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#30d158]/15 border border-[#30d158]/40 text-xs font-mono text-[#30d158] animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#30d158]" />
                  <div className="flex-1">
                    <span className="font-bold uppercase tracking-wider block">
                      ALL 6/6 30-SECOND SNIPPETS UNLOCKED ✓
                    </span>
                    <span className="text-[11px] text-[#30d158]/90 font-sans mt-0.5 block leading-relaxed">
                      You have collected all 6 scene snippets in this pool. No more burns needed for this tier!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#30d158]/15 border border-[#30d158]/40 text-xs font-mono text-[#30d158] animate-fadeIn">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#30d158]" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider block">
                        UNLOCKS: NEXT UNIQUE 30S SNIPPET (DROP #{tier2Claimed.length + 1} OF 6)
                      </span>
                      <span className="text-[10px] bg-[#30d158]/25 border border-[#30d158]/40 px-2 py-0.5 rounded font-bold">
                        {tier2Unclaimed.length} LEFT IN POOL
                      </span>
                    </div>
                    <span className="text-[11px] text-[#30d158]/90 font-sans mt-0.5 block leading-relaxed">
                      You own {tier2Claimed.length} of 6 snippets. Burning $10 is guaranteed to unlock 1 of your <strong>{tier2Unclaimed.length} remaining snippets</strong> from other films — never a duplicate!
                    </span>
                  </div>
                </div>
              )
            ) : selectedTokens >= tokens5Usd ? (
              isTier1Maxed ? (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#30d158]/15 border border-[#30d158]/40 text-xs font-mono text-[#30d158] animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#30d158]" />
                  <div className="flex-1">
                    <span className="font-bold uppercase tracking-wider block">
                      ALL 10/10 3-SECOND CLIPS UNLOCKED ✓
                    </span>
                    <span className="text-[11px] text-[#30d158]/90 font-sans mt-0.5 block leading-relaxed">
                      You have collected all 10 clips in this pool. No more burns needed for this tier!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#d4fc50]/15 border border-[#d4fc50]/40 text-xs font-mono text-[#d4fc50] animate-fadeIn">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#d4fc50]" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider block">
                        UNLOCKS: NEXT UNIQUE 3S CLIP (DROP #{tier1Claimed.length + 1} OF 10)
                      </span>
                      <span className="text-[10px] bg-[#d4fc50]/25 border border-[#d4fc50]/40 px-2 py-0.5 rounded font-bold">
                        {tier1Unclaimed.length} LEFT IN POOL
                      </span>
                    </div>
                    <span className="text-[11px] text-[#d4fc50]/90 font-sans mt-0.5 block leading-relaxed">
                      You own {tier1Claimed.length} of 10 clips. Burning $5 is guaranteed to unlock 1 of your <strong>{tier1Unclaimed.length} remaining clips</strong> from other films — never a duplicate!
                    </span>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/70">
                <Flame className="w-4 h-4 shrink-0 text-[#d4fc50]" />
                <div className="flex-1">
                  <span className="font-bold uppercase tracking-wider block text-white/90">
                    DIRECT SUPPLY INCINERATOR
                  </span>
                  <span className="text-[11px] text-white/50 font-sans">
                    Tokens are sent permanently to 0x0...dEaD to squeeze circulating liquidity. Burn ≥ 50K ($5) to unlock unique video drops.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Big Action Burn Button */}
          {(() => {
            if (!isConnected) {
              return (
                <button
                  type="button"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="w-full py-4 rounded-xl font-gta text-lg uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer bg-[#d4fc50] hover:bg-white text-black font-bold shadow-[0_0_25px_rgba(212,252,80,0.35)] active:scale-[0.99]"
                >
                  <Wallet className="w-5 h-5" />
                  <span>{isConnecting ? "CONNECTING TO WALLET..." : "CONNECT WALLET TO INCINERATE"}</span>
                </button>
              );
            }

            if (!isCorrectNetwork) {
              return (
                <button
                  type="button"
                  onClick={switchToRobinhood}
                  className="w-full py-4 rounded-xl font-gta text-lg uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer bg-[#ff9500] hover:bg-white text-black font-bold shadow-[0_0_25px_rgba(255,149,0,0.4)] animate-pulse"
                >
                  <span>SWITCH NETWORK TO ROBINHOOD CHAIN L2 (4663)</span>
                </button>
              );
            }

            const currentTierMaxed =
              selectedTokens >= tokens25Usd
                ? isTier3Maxed
                : selectedTokens >= tokens10Usd
                ? isTier2Maxed
                : selectedTokens >= tokens5Usd
                ? isTier1Maxed
                : false;

            if (currentTierMaxed) {
              return (
                <button
                  disabled
                  className="w-full py-4 rounded-xl font-gta text-lg uppercase tracking-widest flex items-center justify-center gap-2.5 bg-white/10 text-white/40 cursor-not-allowed border border-white/15"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#30d158]" />
                  <span>
                    ALL DROPS CLAIMED (
                    {selectedTokens >= tokens25Usd ? "3/3" : selectedTokens >= tokens10Usd ? "6/6" : "10/10"}) · MAXIMUM REACHED
                  </span>
                </button>
              );
            }

            if (txState.status === "signing") {
              return (
                <button
                  disabled
                  className="w-full py-4 rounded-xl font-gta text-lg uppercase tracking-widest flex items-center justify-center gap-2.5 bg-[#d4fc50] text-black font-bold animate-pulse shadow-[0_0_25px_rgba(212,252,80,0.5)]"
                >
                  <Flame className="w-5 h-5 animate-spin" />
                  <span>AWAITING SIGNATURE IN WALLET... (CHECK METAMASK)</span>
                </button>
              );
            }

            if (txState.status === "confirming" || isIncinerating) {
              return (
                <button
                  disabled
                  className="w-full py-4 rounded-xl font-gta text-lg uppercase tracking-widest flex items-center justify-center gap-2.5 bg-[#ff453a] text-black font-bold animate-pulse shadow-[0_0_35px_rgba(255,69,58,0.7)]"
                >
                  <Flame className="w-5 h-5 animate-spin" />
                  <span>MINING BURN ON ROBINHOOD L2...</span>
                </button>
              );
            }

            return (
              <button
                type="button"
                onClick={handleBurn}
                className="w-full py-4 rounded-xl font-gta text-lg uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer bg-[#d4fc50] hover:bg-white text-black font-bold shadow-[0_0_25px_rgba(212,252,80,0.35)] active:scale-[0.99]"
              >
                <Flame className="w-4 h-4" />
                <span>
                  {selectedTokens >= tokens25Usd
                    ? `SIGN & BURN ${selectedTokens.toLocaleString()} $MIKA ($25 USD) · UNLOCK FULL FILM (${tier3Claimed.length + 1} OF 3)`
                    : selectedTokens >= tokens10Usd
                    ? `SIGN & BURN ${selectedTokens.toLocaleString()} $MIKA ($10 USD) · UNLOCK SNIPPET (${tier2Claimed.length + 1} OF 6)`
                    : selectedTokens >= tokens5Usd
                    ? `SIGN & BURN ${selectedTokens.toLocaleString()} $MIKA ($5 USD) · UNLOCK CLIP (${tier1Claimed.length + 1} OF 10)`
                    : `SIGN & BURN ${(selectedTokens || 0).toLocaleString()} $MIKA ON-CHAIN`}
                </span>
              </button>
            );
          })()}

          {/* Real-time Web3 Signing & Mining Notifications */}
          {txState.status === "signing" && (
            <div className="mt-4 p-4 rounded-xl bg-[#d4fc50]/15 border border-[#d4fc50]/40 text-[#d4fc50] font-mono text-xs flex items-center gap-3 animate-fadeIn">
              <div className="w-3 h-3 rounded-full bg-[#d4fc50] animate-ping shrink-0" />
              <div className="flex-1">
                <span className="font-bold uppercase tracking-wider block">Wallet Signature Requested</span>
                <span className="text-[11px] text-white/70 font-sans mt-0.5 block leading-relaxed">
                  Please confirm the <strong>burn({selectedTokens.toLocaleString()} $MIKA)</strong> transaction in your wallet (MetaMask / Rabby).
                </span>
              </div>
            </div>
          )}

          {txState.status === "confirming" && (
            <div className="mt-4 p-4 rounded-xl bg-[#ff9500]/15 border border-[#ff9500]/40 text-[#ff9500] font-mono text-xs flex items-center gap-3 animate-fadeIn">
              <div className="w-3 h-3 rounded-full bg-[#ff9500] animate-ping shrink-0" />
              <div className="flex-1">
                <span className="font-bold uppercase tracking-wider block">Transaction Broadcasted! Confirming Block...</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-white/70 font-mono truncate max-w-xs">
                    Tx: {txState.txHash}
                  </span>
                  <a
                    href={`${ROBINHOOD_CHAIN.blockExplorer}/tx/${txState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#d4fc50] hover:underline flex items-center gap-1 text-[11px] shrink-0 font-bold"
                  >
                    <span>View on Blockscout</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Success Notification */}
          {burnSuccess && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#30d158]/15 border border-[#30d158]/40 text-[#30d158] font-mono text-xs flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="leading-relaxed">{burnSuccess}</span>
            </div>
          )}

          {/* Error Notification */}
          {burnError && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#ff453a]/15 border border-[#ff453a]/40 text-[#ff453a] font-mono text-xs flex items-center justify-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{burnError}</span>
            </div>
          )}

          {/* Recent Burns Ticker */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2.5">
              <span>Recent On-Chain Burns</span>
              <span className="text-[#d4fc50]">{claimedVideoIds.length} / 19 Drops Claimed Across Vault</span>
            </div>
            <div className="space-y-1.5">
              {recentBurns.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs font-mono py-1 text-white/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
                    <span className="text-white/80">{item.wallet}</span>
                    <span className="text-white/40 hidden sm:inline">burned</span>
                    <span className="text-[#d4fc50] font-bold">{item.amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[11px] hidden md:inline">{item.tier}</span>
                    {item.txHash && item.txHash.startsWith("0x") && (
                      <a
                        href={item.explorerUrl || `${ROBINHOOD_CHAIN.blockExplorer}/tx/${item.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#d4fc50] hover:text-white flex items-center gap-0.5 text-[10.5px] underline font-bold"
                        title="View transaction on Robinhood Chain Blockscout"
                      >
                        <span>Tx ↗</span>
                      </a>
                    )}
                    <span className="text-white/30 text-[11px]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BURN REWARDS & SMART VAULT PROTECTION                                     */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-white/10">
          <div className="text-center md:text-left md:flex md:items-end md:justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4fc50]/10 border border-[#d4fc50]/30 mb-2 font-mono text-xs uppercase tracking-widest text-[#d4fc50]">
                <Film className="w-3.5 h-3.5 text-[#d4fc50]" />
                <span>BURN-TO-REVEAL // PRIVATE VIDEO POOL</span>
              </div>
              <h3 className="font-gta text-3xl sm:text-5xl text-white tracking-tight uppercase">
                BURN TIERS
              </h3>
              <p className="text-white/60 text-xs sm:text-sm mt-2 max-w-2xl font-sans font-light leading-relaxed">
                Burn tokens to permanently destroy supply and receive private video content. Guaranteed no duplicate drops: <strong>10x unique clips for $5</strong>, <strong>6x unique snippets for $10</strong>, and <strong>3x full master films for $25</strong>.
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <div className="font-mono text-xs text-white/70 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <span className="text-[#d4fc50] font-bold">{claimedVideoIds.length} / 19 Drops Owned</span>
              </div>
              {claimedVideoIds.length > 0 && (
                <button
                  onClick={handleResetClaims}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
                  title="Reset demo vault to test claiming from scratch"
                >
                  <RotateCw className="w-3 h-3 inline mr-1" /> Reset Demo
                </button>
              )}
            </div>
          </div>

          {/* Smart Vault Protection Notice */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#d4fc50]/10 via-black to-[#ffc876]/10 border border-[#d4fc50]/30 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[0_0_20px_rgba(212,252,80,0.05)]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#d4fc50]/20 text-[#d4fc50] shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>SMART VAULT PROTECTION // NO DUPLICATE BURNS & AUTO-CLAIM RULE</span>
                </div>
                <p className="text-white/70 text-xs font-sans mt-1 leading-relaxed max-w-3xl">
                  <strong>Guaranteed Unique Drops:</strong> You will always receive a new uncollected video drop on each burn. Once all drops in a tier are unlocked (10 for $5, 6 for $10, 3 for $25), burning is capped so you never waste tokens.
                  <br />
                  <strong>Full Film Auto-Claim:</strong> If you unlock a Full Minutes-Long Video ($25), all 30-second snippets and 3-second clips extracted from that film are <strong>automatically claimed for free</strong>. You only ever burn $5 or $10 to claim the remaining scenes from other films!
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-[#d4fc50] font-bold">
                {19 - claimedVideoIds.length} Drops Left to Collect
              </span>
            </div>
          </div>

          {/* 3 Pool Inventory Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8 font-mono text-xs">
            <div className="p-3.5 rounded-2xl bg-[#0a0c0a] border border-[#d4fc50]/30 flex items-center justify-between shadow-[0_0_15px_rgba(212,252,80,0.06)]">
              <div>
                <span className="text-[10px] text-white/40 uppercase block">$5 BURN TIER (10 MAX)</span>
                <span className="text-white font-bold text-sm">3-Sec Video Clips</span>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs border inline-block ${
                  isTier1Maxed
                    ? "bg-[#30d158]/20 text-[#30d158] border-[#30d158]/40"
                    : "bg-[#d4fc50]/15 text-[#d4fc50] border-[#d4fc50]/30"
                }`}>
                  {isTier1Maxed ? "10/10 MAXED ✓" : `${tier1Claimed.length}/10 Claimed`}
                </span>
                <span className="text-[10px] text-white/40 block mt-0.5">
                  {isTier1Maxed ? "Tier Pool Complete" : `${tier1Unclaimed.length} unique drops remaining`}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0a0c0a] border border-[#30d158]/30 flex items-center justify-between shadow-[0_0_15px_rgba(48,209,88,0.06)]">
              <div>
                <span className="text-[10px] text-white/40 uppercase block">$10 BURN TIER (6 MAX)</span>
                <span className="text-white font-bold text-sm">30-Sec Snippets</span>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs border inline-block ${
                  isTier2Maxed
                    ? "bg-[#30d158]/20 text-[#30d158] border-[#30d158]/40"
                    : "bg-[#30d158]/15 text-[#30d158] border-[#30d158]/30"
                }`}>
                  {isTier2Maxed ? "6/6 MAXED ✓" : `${tier2Claimed.length}/6 Claimed`}
                </span>
                <span className="text-[10px] text-white/40 block mt-0.5">
                  {isTier2Maxed ? "Tier Pool Complete" : `${tier2Unclaimed.length} unique drops remaining`}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0a0c0a] border border-[#ffc876]/30 flex items-center justify-between shadow-[0_0_15px_rgba(255,200,118,0.06)]">
              <div>
                <span className="text-[10px] text-white/40 uppercase block">$25 BURN TIER (3 MAX)</span>
                <span className="text-white font-bold text-sm">Full Minutes Videos</span>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs border inline-block ${
                  isTier3Maxed
                    ? "bg-[#30d158]/20 text-[#30d158] border-[#30d158]/40"
                    : "bg-[#ffc876]/15 text-[#ffc876] border-[#ffc876]/30"
                }`}>
                  {isTier3Maxed ? "3/3 MAXED ✓" : `${tier3Claimed.length}/3 Claimed`}
                </span>
                <span className="text-[10px] text-white/40 block mt-0.5">
                  {isTier3Maxed ? "All Master Films Complete" : `${tier3Unclaimed.length} full films remaining`}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Clean Burn Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {JUICY_BURN_TIERS.map((tier) => {
              const tierPool = getTierPool(tier.id);
              const claimed = getClaimedInTier(tier.id);
              const unclaimed = getUnclaimedInTier(tier.id);
              const isMaxed = unclaimed.length === 0;
              const isAnyUnlocked = claimed.length > 0;
              const autoClaimedFromFull = claimed.filter(
                (v) => v.parentVideoId && ownsFullVideo(v.parentVideoId)
              );

              return (
                <div
                  key={tier.id}
                  className={`rounded-3xl bg-[#090b09] border flex flex-col justify-between transition-all duration-300 relative group shadow-xl overflow-hidden ${
                    isMaxed
                      ? "border-[#30d158]/50 shadow-[0_0_35px_rgba(48,209,88,0.15)]"
                      : isAnyUnlocked
                      ? "border-[#d4fc50]/40 shadow-[0_0_25px_rgba(212,252,80,0.15)]"
                      : "border-white/15 hover:border-white/30"
                  }`}
                >
                  {/* Top Docket Strip */}
                  <div className="px-4 py-2.5 font-mono text-[10px] font-bold tracking-widest flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
                    <span className="text-[#d4fc50] uppercase tracking-wider">
                      {tier.tierCode} // {tier.costDisplay}
                    </span>
                    {isMaxed ? (
                      <span className="text-[#30d158] font-bold uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ALL {tier.poolCount}/{tier.poolCount} COLLECTED
                      </span>
                    ) : isAnyUnlocked ? (
                      <span className="text-[#d4fc50] font-bold uppercase tracking-widest flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> {claimed.length}/{tier.poolCount} UNLOCKED
                      </span>
                    ) : (
                      <span className="text-white/40 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Lock className="w-3 h-3" /> 0/{tier.poolCount} UNLOCKED
                      </span>
                    )}
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Price Header */}
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-white/50">
                            REQUIRED BURN
                          </span>
                          <span className="text-xl sm:text-2xl font-bold text-white tracking-tight font-gta uppercase">
                            {tier.costDisplay}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-[#d4fc50] bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10 inline-block">
                            {tier.tokenRequirement}
                          </span>
                          <span className={`text-[10px] font-mono font-semibold block mt-0.5 ${isMaxed ? "text-[#30d158]" : "text-[#d4fc50]"}`}>
                            {isMaxed ? "Tier Pool 100% Complete" : `${unclaimed.length} of ${tier.poolCount} Remaining to Burn`}
                          </span>
                        </div>
                      </div>

                      {/* Video Thumbnail with Length Badge */}
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3.5 bg-black border border-white/10 group-hover:border-white/25 transition-colors">
                        <img
                          src={isAnyUnlocked ? claimed[claimed.length - 1].thumbnail : tier.thumbnail}
                          alt={tier.title}
                          className={`w-full h-full object-cover transition-all duration-700 ${
                            isAnyUnlocked
                              ? "filter-none group-hover:scale-105"
                              : "blur-[6px] brightness-60 contrast-125"
                          }`}
                        />

                        {/* Top Left: Lock/Unlock Badge */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold z-10">
                          {isMaxed ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-[#30d158]" />
                              <span className="text-[#30d158]">{tier.poolCount}/{tier.poolCount} COLLECTED</span>
                            </>
                          ) : isAnyUnlocked ? (
                            <>
                              <Unlock className="w-3 h-3 text-[#d4fc50]" />
                              <span className="text-[#d4fc50]">{claimed.length}/{tier.poolCount} UNLOCKED</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-[#ff453a]" />
                              <span className="text-white/80">{tier.gateLabel}</span>
                            </>
                          )}
                        </div>

                        {/* Top Right: Duration Tag */}
                        <div className="absolute top-2.5 right-2.5 z-10">
                          <span className="px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-[#d4fc50]/40 text-[#d4fc50] text-[10px] font-mono font-black tracking-wider">
                            {tier.durationBadge}
                          </span>
                        </div>

                        {/* Bottom Left: Pool Inventory Badge */}
                        <div className="absolute bottom-2.5 left-2.5 z-10">
                          <span className="px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-white/90 text-[9px] font-mono font-bold tracking-wider">
                            {isMaxed ? "ALL DROPS OWNED" : `${claimed.length}/${tier.poolCount} DROPS UNLOCKED`}
                          </span>
                        </div>

                        {/* Center / Corner Play Icon */}
                        {isAnyUnlocked && (
                          <button
                            onClick={() => handleWatchUnlocked(tier)}
                            className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-[#d4fc50] text-black hover:bg-white font-mono transition-transform hover:scale-110 cursor-pointer shadow-lg z-10"
                            title="Watch Latest Unlocked Drop"
                          >
                            <Play className="w-4 h-4 fill-black" />
                          </button>
                        )}
                      </div>

                      {/* Drop Inventory Selector Chips */}
                      <div className="mb-4 bg-black/60 p-2.5 rounded-xl border border-white/10">
                        <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-2 uppercase font-bold">
                          <span>Pool Drops ({claimed.length}/{tier.poolCount} Claimed)</span>
                          <span className={isMaxed ? "text-[#30d158]" : "text-[#d4fc50]"}>
                            {isMaxed ? "MAX LIMIT REACHED" : `${unclaimed.length} UNCLAIMED`}
                          </span>
                        </div>
                        <div className={`grid gap-1.5 ${tier.id === "burn-tier-01" ? "grid-cols-5 sm:grid-cols-10" : tier.id === "burn-tier-02" ? "grid-cols-6" : "grid-cols-3"}`}>
                          {tierPool.map((v) => {
                            const isClaimed = claimedVideoIds.includes(v.id);
                            const isAutoFromFull = v.parentVideoId && ownsFullVideo(v.parentVideoId);

                            return (
                              <button
                                key={v.id}
                                onClick={() => isClaimed && setActiveModalVideo(v)}
                                disabled={!isClaimed}
                                className={`py-1.5 rounded text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                                  isClaimed
                                    ? "bg-[#d4fc50] text-black hover:bg-white hover:scale-105 cursor-pointer shadow-[0_0_8px_rgba(212,252,80,0.35)]"
                                    : "bg-white/5 text-white/25 border border-white/10 cursor-not-allowed"
                                }`}
                                title={
                                  isClaimed
                                    ? `Watch Drop #${v.poolIndex}: ${v.title}${isAutoFromFull ? " (Auto-Claimed from Full Film)" : ""}`
                                    : `Drop #${v.poolIndex} (Locked · Burn to claim)`
                                }
                              >
                                {isClaimed ? (
                                  <span className="flex items-center gap-0.5">
                                    #{v.poolIndex}
                                    {isAutoFromFull ? "★" : "✓"}
                                  </span>
                                ) : (
                                  `#${v.poolIndex}`
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Auto-Claimed notification tag if user owns child clips from full film */}
                      {autoClaimedFromFull.length > 0 && (
                        <div className="mb-3 p-2 rounded-lg bg-[#ffc876]/15 border border-[#ffc876]/30 text-[10.5px] font-mono text-[#ffc876] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {autoClaimedFromFull.length} drop{autoClaimedFromFull.length > 1 ? "s" : ""} auto-claimed free via Full Films in your vault!
                          </span>
                        </div>
                      )}

                      {/* Content Title & Duration */}
                      <div className="mb-3">
                        <span className="text-[11px] font-mono text-[#d4fc50] block uppercase tracking-wider mb-1 font-bold">
                          {tier.format}
                        </span>
                        <h4 className="font-gta text-2xl text-white tracking-wider uppercase mb-1.5">
                          {tier.title}
                        </h4>
                        <p className="text-xs text-white/70 font-sans font-light leading-relaxed">
                          {tier.description}
                        </p>
                      </div>

                      {/* Simple Perk List */}
                      <div className="space-y-1.5 py-3 border-t border-white/10 font-mono text-xs text-white/60 mb-5">
                        <div className="text-[9px] font-mono uppercase tracking-widest text-white/40 mb-1.5 font-bold">
                          DROP DETAILS:
                        </div>
                        {tier.perks.map((perk, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50] shrink-0 mt-1.5" />
                            <span className="text-white/85">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-4 border-t border-white/10">
                      {isMaxed ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleWatchUnlocked(tier)}
                            className="w-full py-3 rounded-xl bg-[#30d158] hover:bg-white text-black font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(48,209,88,0.3)]"
                          >
                            <Play className="w-3.5 h-3.5 fill-black" />
                            <span>WATCH UNLOCKED DROPS ({tier.poolCount}/{tier.poolCount})</span>
                          </button>
                          <div className="text-center text-[10px] font-mono text-[#30d158] font-bold">
                            ALL {tier.poolCount}/{tier.poolCount} DROPS CLAIMED · NO MORE BURNS NEEDED
                          </div>
                        </div>
                      ) : isAnyUnlocked ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleWatchUnlocked(tier)}
                              className="flex-1 py-2.5 rounded-xl bg-[#30d158]/20 border border-[#30d158] text-[#30d158] hover:bg-[#30d158] hover:text-black font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(48,209,88,0.25)]"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>WATCH LATEST (#{claimed[claimed.length - 1].poolIndex})</span>
                            </button>
                            <button
                              onClick={() => {
                                handleDownloadVideo(claimed[claimed.length - 1]);
                              }}
                              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/15"
                              title="Download Latest Unlocked Drop (.mp4)"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">DOWNLOAD</span>
                            </button>
                          </div>
                          <button
                            onClick={() => handleUnlockTier(tier)}
                            disabled={isProcessingUnlock}
                            className="w-full py-3 rounded-xl bg-[#d4fc50] hover:bg-white text-black font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,252,80,0.35)]"
                          >
                            <Flame className="w-3.5 h-3.5 text-black" />
                            <span>
                              {!isConnected
                                ? `CONNECT & BURN ${tier.costDisplay.split(" ")[0]}`
                                : !isCorrectNetwork
                                ? "SWITCH TO RH L2"
                                : isProcessingUnlock
                                ? "BURNING ON-CHAIN..."
                                : `SIGN & BURN ${tier.costDisplay.split(" ")[0]} · UNLOCK DROP #${claimed.length + 1} (${unclaimed.length} LEFT)`}
                            </span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUnlockTier(tier)}
                          disabled={isProcessingUnlock}
                          className="w-full py-3.5 rounded-xl bg-[#d4fc50] hover:bg-white text-black font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,252,80,0.35)]"
                        >
                          <Flame className="w-3.5 h-3.5 text-black" />
                          <span>
                            {!isConnected
                              ? `CONNECT & BURN ${tier.costDisplay.split(" ")[0]}`
                              : !isCorrectNetwork
                              ? "SWITCH TO RH L2"
                              : isProcessingUnlock
                              ? "BURNING ON-CHAIN..."
                              : `SIGN & BURN ${tier.costDisplay.split(" ")[0]} · UNLOCK DROP 1 OF ${tier.poolCount}`}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIDEO VIEWER MODAL (Plays Video & Provides One-Click MP4 Download)        */}
        {/* ========================================================================= */}
        {activeModalVideo && (() => {
          const claimedInThisTier = getClaimedInTier(activeModalVideo.tierId);
          const isAutoClaimed =
            activeModalVideo.parentVideoId && ownsFullVideo(activeModalVideo.parentVideoId);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
              <div className="relative max-w-2xl w-full rounded-3xl bg-[#0d0f0d] border border-white/20 p-5 sm:p-7 shadow-[0_0_80px_rgba(0,0,0,1)] text-white font-mono">
                <button
                  onClick={() => setActiveModalVideo(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                  title="Close Viewer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-2 pr-8">
                  <div className="flex items-center gap-2 text-[#30d158]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>UNLOCKED FROM PRIVATE VIDEO POOL // {activeModalVideo.tierCode}</span>
                  </div>
                  {isAutoClaimed ? (
                    <span className="px-2 py-0.5 rounded bg-[#ffc876]/20 text-[#ffc876] border border-[#ffc876]/40 font-mono text-[10px] font-bold">
                      ★ AUTO-CLAIMED WITH FULL FILM
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-[#d4fc50]/20 text-[#d4fc50] border border-[#d4fc50]/40 font-mono text-[10px]">
                      DROP {activeModalVideo.poolIndex} OF {activeModalVideo.poolTotal}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 mb-2">
                  <h3 className="font-gta text-2xl sm:text-3xl uppercase text-white truncate">
                    {activeModalVideo.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2.5 py-1 rounded bg-[#d4fc50] text-black font-mono font-black">
                      {activeModalVideo.durationLabel}
                    </span>
                    {activeModalVideo.sizeLabel && (
                      <span className="text-xs px-2.5 py-1 rounded bg-white/10 text-white/80 font-mono font-bold border border-white/10">
                        {activeModalVideo.sizeLabel}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-white/60 font-sans mb-3">
                  {activeModalVideo.caption}
                </p>

                {/* Content Relationship Callout */}
                {activeModalVideo.parentVideoId && (
                  <div className={`p-2.5 rounded-xl border text-xs mb-4 flex items-center gap-2 ${
                    isAutoClaimed
                      ? "bg-[#ffc876]/15 border-[#ffc876]/30 text-[#ffc876]"
                      : "bg-white/5 border-white/10 text-white/70"
                  }`}>
                    <Sparkles className={`w-4 h-4 shrink-0 ${isAutoClaimed ? "text-[#ffc876]" : "text-[#d4fc50]"}`} />
                    <span className="text-[11px] leading-relaxed">
                      {isAutoClaimed ? (
                        <>
                          <strong>Included in your Full Master Film ({activeModalVideo.parentFilmTitle}):</strong> You own the complete minutes-long video containing this scene!
                        </>
                      ) : (
                        <>
                          <strong>Part of {activeModalVideo.parentFilmTitle}:</strong> Burn $25 to unlock the complete minutes-long uncut master film and auto-claim all of its other scenes for free!
                        </>
                      )}
                    </span>
                  </div>
                )}

                {/* Video Player Display */}
                <div className="relative aspect-[9/16] sm:aspect-[16/10] max-h-[48vh] rounded-2xl overflow-hidden border border-white/20 mb-4 bg-black group flex items-center justify-center mx-auto">
                  {activeModalVideo.videoUrl ? (
                    <video
                      src={activeModalVideo.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    // Video simulation player with live playback bar
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={activeModalVideo.thumbnail}
                        alt={activeModalVideo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                        <button
                          onClick={() => setIsPlayingSim(!isPlayingSim)}
                          className="p-4 rounded-full bg-[#d4fc50] hover:bg-white text-black transition-transform hover:scale-110 cursor-pointer shadow-[0_0_25px_rgba(212,252,80,0.5)] mb-3"
                        >
                          {isPlayingSim ? (
                            <Pause className="w-6 h-6 fill-black" />
                          ) : (
                            <Play className="w-6 h-6 fill-black translate-x-0.5" />
                          )}
                        </button>
                        <span className="text-[11px] font-mono text-white/80 bg-black/70 px-3 py-1 rounded-full border border-white/10">
                          {isPlayingSim ? "Playing Pool Video Preview" : "Paused"}
                        </span>
                      </div>

                      {/* Scrub / Progress Bar */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-6">
                        <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mb-2">
                          <div
                            className="bg-[#d4fc50] h-full transition-all duration-100"
                            style={{ width: `${simProgress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-white/70">
                          <span>
                            {Math.floor((simProgress / 100) * activeModalVideo.durationSec)}s /{" "}
                            {activeModalVideo.durationSec}s
                          </span>
                          <span className="text-[#d4fc50] font-bold">
                            {activeModalVideo.format}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Drop Switcher (Easily switch between all your claimed drops in this tier) */}
                {claimedInThisTier.length > 1 && (
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 mb-4 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-white/50 uppercase font-bold shrink-0">
                      Your Unlocked Drops:
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                      {claimedInThisTier.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSimProgress(0);
                            setIsPlayingSim(true);
                            setActiveModalVideo(v);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                            v.id === activeModalVideo.id
                              ? "bg-[#d4fc50] text-black"
                              : "bg-white/10 text-white/70 hover:bg-white/20"
                          }`}
                        >
                          #{v.poolIndex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pool Info Bar */}
                <div className="p-3 rounded-xl bg-black/70 border border-white/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">
                      TIER: <strong className="text-white">{activeModalVideo.tierCost}</strong>
                    </span>
                    <span className="text-white/30">|</span>
                    <span className="text-[#d4fc50] font-bold">
                      Drop {activeModalVideo.poolIndex} of {activeModalVideo.poolTotal} in Pool
                    </span>
                  </div>
                  <span className="text-white/50 text-[11px]">
                    {claimedInThisTier.length} of {activeModalVideo.poolTotal} unlocked in this tier
                  </span>
                </div>

                {/* Action Buttons: Direct Download + Next Drop + Close */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <a
                    href={activeModalVideo.videoUrl}
                    download={activeModalVideo.downloadFilename || `${activeModalVideo.title}.mp4`}
                    className="flex-1 py-3.5 rounded-xl bg-[#d4fc50] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_25px_rgba(212,252,80,0.4)] active:scale-[0.99]"
                    title="Download Video Drop to Device"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD VIDEO DROP ({activeModalVideo.sizeLabel || "MP4"})</span>
                  </a>
                  {claimedInThisTier.length > 1 && (
                    <button
                      onClick={() => handleCycleModalVideo("next")}
                      className="px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 transition-colors"
                      title="View next unlocked drop in this tier"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>NEXT UNLOCKED</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveModalVideo(null)}
                    className="px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
