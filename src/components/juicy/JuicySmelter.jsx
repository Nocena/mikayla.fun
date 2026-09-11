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
  ArrowUpRight,
} from "lucide-react";
import { SMELTER_DATA, JUICY_CONFIG, JUICY_VAULT_TIERS } from "../../constants/juicy";
import CountUp from "../react-bits/CountUp";

const SIGNATURE_GREEN = "#d4fc50";

const ALTAR_TABS = [
  { id: "01", label: "ALL DOSSIERS" },
  { id: "02", label: "35MM NEGATIVES" },
  { id: "03", label: "4K MASTERS" },
  { id: "04", label: "PHYSICAL ARCHIVE" },
];

export default function JuicySmelter() {
  // Default to Tier 02 baseline burn amount (180,000 $JUICY = $15)
  const [selectedTokens, setSelectedTokens] = useState(180000);
  const [inputVal, setInputVal] = useState("180,000");
  const [isIncinerating, setIsIncinerating] = useState(false);
  const [burnSuccess, setBurnSuccess] = useState(null);
  const [totalBurned, setTotalBurned] = useState(SMELTER_DATA.totalTokensBurned);
  const [recentBurns, setRecentBurns] = useState(SMELTER_DATA.recentSmelts);

  // Contraband Tier Unlock State at Altar
  const [selectedTab, setSelectedTab] = useState("01");
  const [unlockedTiers, setUnlockedTiers] = useState({});
  const [activeModalTier, setActiveModalTier] = useState(null);
  const [isProcessingUnlock, setIsProcessingUnlock] = useState(false);

  const canvasRef = useRef(null);

  // Presets directly matching the on-site burn tiers and supply sinks
  const PRESETS = [
    {
      id: "tier2",
      label: "TIER 02",
      badge: "$15 BURN",
      sublabel: "180K $JUICY",
      value: 180000,
      unlocks: "Case File #081-B (18-Min 4K Master Film)",
    },
    {
      id: "tier3",
      label: "TIER 03",
      badge: "$50 VIP",
      sublabel: "600K $JUICY",
      value: 600000,
      unlocks: "Case File #081-C (Cartel Hotline + Wax Print)",
    },
    {
      id: "furnace",
      label: "FURNACE",
      badge: "HEAVY BURN",
      sublabel: "1M $JUICY",
      value: 1000000,
      unlocks: "Permanent Supply Squeeze",
    },
    {
      id: "empire",
      label: "EMPIRE",
      badge: "WHALE BURN",
      sublabel: "5M $JUICY",
      value: 5000000,
      unlocks: "Max Deflationary Meltdown",
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

  const handleSelectPreset = (val) => {
    setSelectedTokens(val);
    setInputVal(val.toLocaleString());
  };

  const handleInputChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = parseInt(raw || "0", 10);
    setSelectedTokens(num);
    setInputVal(num > 0 ? num.toLocaleString() : "");
  };

  // Main Burn Handler in Smelter Card
  const handleBurn = () => {
    const amount = selectedTokens || 180000;
    if (amount <= 0 || isIncinerating) return;

    setIsIncinerating(true);
    playBurnSound();

    if (canvasRef.current?.__triggerBurst) {
      canvasRef.current.__triggerBurst();
    }

    setTimeout(() => {
      setIsIncinerating(false);
      setTotalBurned((prev) => prev + amount);

      // Check tier qualification
      let unlockedTierName = "Direct Incinerator Burn";
      if (amount >= 600000) {
        setUnlockedTiers((prev) => ({ ...prev, "vault-01": true, "vault-02": true, "vault-03": true }));
        unlockedTierName = "Tier 03 (Cartel Master Key)";
        setActiveModalTier(JUICY_VAULT_TIERS[2]);
        setBurnSuccess(`Burned ${amount.toLocaleString()} $JUICY! Case File #081-C (Cartel Boss VIP) Decrypted.`);
      } else if (amount >= 180000) {
        setUnlockedTiers((prev) => ({ ...prev, "vault-01": true, "vault-02": true }));
        unlockedTierName = "Tier 02 (The Black Bag Incinerator)";
        setActiveModalTier(JUICY_VAULT_TIERS[1]);
        setBurnSuccess(`Burned ${amount.toLocaleString()} $JUICY! Case File #081-B (4K Master Film) Decrypted.`);
      } else {
        setBurnSuccess(`Burned ${amount.toLocaleString()} $JUICY permanently to 0x0...dEaD!`);
      }

      const newTx = {
        id: `smelt-${Date.now()}`,
        wallet: "0x7a8...1fA0 (You)",
        amount: `${amount.toLocaleString()} $JUICY`,
        tier: unlockedTierName,
        time: "Just now",
        txHash: "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      };
      setRecentBurns([newTx, ...recentBurns.slice(0, 2)]);
      setTimeout(() => setBurnSuccess(null), 5000);
    }, 1800);
  };

  // Burn-to-Unlock handler for Contraband Dossier cards at the Altar
  const handleUnlockTier = (tier) => {
    if (tier.isBurn) {
      const burnAmount = tier.costTokens || 180000;
      setSelectedTokens(burnAmount);
      setInputVal(burnAmount.toLocaleString());
      setIsIncinerating(true);
      setIsProcessingUnlock(true);
      playBurnSound();

      if (canvasRef.current?.__triggerBurst) {
        canvasRef.current.__triggerBurst();
      }

      setTimeout(() => {
        setIsIncinerating(false);
        setIsProcessingUnlock(false);
        setTotalBurned((prev) => prev + burnAmount);
        setUnlockedTiers((prev) => ({ ...prev, [tier.id]: true }));
        setActiveModalTier(tier);

        const newTx = {
          id: `smelt-${Date.now()}`,
          wallet: "0x7a8...1fA0 (You)",
          amount: `${burnAmount.toLocaleString()} $JUICY`,
          tier: `${tier.title} Decrypt`,
          time: "Just now",
          txHash: "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        };
        setRecentBurns([newTx, ...recentBurns.slice(0, 2)]);
        setBurnSuccess(`Incinerator torched ${burnAmount.toLocaleString()} $JUICY! ${tier.title} Decrypted.`);
        setTimeout(() => setBurnSuccess(null), 5000);
      }, 1600);
    } else {
      // Passive holder tier
      setIsProcessingUnlock(true);
      setTimeout(() => {
        setIsProcessingUnlock(false);
        setUnlockedTiers((prev) => ({ ...prev, [tier.id]: true }));
        setActiveModalTier(tier);
        setBurnSuccess(`Holder balance confirmed (≥ $50)! ${tier.title} Decrypted.`);
        setTimeout(() => setBurnSuccess(null), 4000);
      }, 900);
    }
  };

  // Filter tiers according to selected category tab
  const filteredTiers = JUICY_VAULT_TIERS.filter((tier, idx) => {
    if (selectedTab === "01") return true;
    if (selectedTab === "02") return idx === 0;
    if (selectedTab === "03") return idx === 1;
    if (selectedTab === "04") return idx === 2;
    return true;
  });

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
            <span>THE INCINERATOR // PERMANENT EVIDENCE TORCH</span>
          </div>
          <h2 className="font-gta text-5xl sm:text-7xl text-white tracking-tight leading-none uppercase">
            THE INCINERATOR
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-3 max-w-xl mx-auto font-sans font-light leading-relaxed">
            Every platform dollar incinerates $JUICY supply forever on Robinhood L2. Feed dirty paper into the incinerator to torch circulating supply and decrypt classified syndicate dossiers.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* CENTERPIECE BURNER CRUCIBLE CARD (Deflationary Engine & Tier Selector)    */}
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
                <CountUp from={totalBurned - 180000} to={totalBurned} separator="," duration={1.2} />
              </span>
              <span className="text-xl sm:text-2xl text-white/60 font-mono font-normal">
                $JUICY
              </span>
            </div>
            <div className="text-xs font-mono text-white/50 mt-1">
              ~$3,625 USD Destroyed · <span className="text-[#30d158]">1.48% Deflationary Contraction</span>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-white/60">
                Select Burn Batch
              </label>
              <span className="text-[10px] font-mono text-[#d4fc50]/90 font-bold">
                Matches Tiers Below ↓
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESETS.map((preset) => {
                const isSelected = selectedTokens === preset.value;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.value)}
                    className={`p-3 rounded-xl text-center font-mono transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-[#d4fc50] text-black shadow-[0_0_18px_rgba(212,252,80,0.35)]"
                        : "bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-bold">{preset.label}</span>
                      <span className={`text-[9px] px-1 py-0.5 rounded font-bold ${
                        isSelected ? "bg-black/20 text-black" : "bg-white/10 text-[#d4fc50]"
                      }`}>
                        {preset.badge}
                      </span>
                    </div>
                    <span className={`text-[10px] ${isSelected ? "text-black/80 font-bold" : "text-white/40"}`}>
                      {preset.sublabel}
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
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPreset(600000)}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 text-[10px] font-mono uppercase font-bold"
                  title="Select Tier 03 VIP"
                >
                  TIER 03
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset(1000000)}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 text-[10px] font-mono uppercase font-bold"
                >
                  MAX
                </button>
                <span className="text-xs font-mono text-[#d4fc50] font-bold">
                  $JUICY
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Unlock / Deflation Benefit Indicator */}
          <div className="mb-6">
            {selectedTokens >= 600000 ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#ff453a]/10 border border-[#ff453a]/30 text-xs font-mono text-[#ff453a] animate-fadeIn">
                <Sparkles className="w-4 h-4 shrink-0 text-[#ff453a]" />
                <div className="flex-1">
                  <span className="font-bold uppercase tracking-wider block">
                    ON-CHAIN UNLOCK: TIER 03 (CARTEL BOSS VIP) + TIER 02
                  </span>
                  <span className="text-[11px] text-[#ff453a]/80 font-sans">
                    Includes direct encrypted 1-on-1 hotline with Juicy, signed physical wax-sealed print, and 4K film.
                  </span>
                </div>
              </div>
            ) : selectedTokens >= 180000 ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#d4fc50]/10 border border-[#d4fc50]/30 text-xs font-mono text-[#d4fc50] animate-fadeIn">
                <Sparkles className="w-4 h-4 shrink-0 text-[#d4fc50]" />
                <div className="flex-1">
                  <span className="font-bold uppercase tracking-wider block">
                    ON-CHAIN UNLOCK: TIER 02 (THE BLACK BAG INCINERATOR)
                  </span>
                  <span className="text-[11px] text-[#d4fc50]/80 font-sans">
                    Includes unrated 18-minute ProRes 4K 60fps cinematic master film and uncut commentary audio.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/70">
                <Flame className="w-4 h-4 shrink-0 text-[#d4fc50]" />
                <div className="flex-1">
                  <span className="font-bold uppercase tracking-wider block text-white/90">
                    DIRECT SUPPLY INCINERATOR
                  </span>
                  <span className="text-[11px] text-white/50 font-sans">
                    Tokens are sent permanently to 0x0...dEaD to squeeze circulating liquidity. (Burn ≥ 180K to decrypt Tier 02).
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Big Action Burn Button */}
          <button
            onClick={handleBurn}
            disabled={isIncinerating}
            className={`w-full py-4 rounded-xl font-gta text-lg uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              isIncinerating
                ? "bg-[#ff453a] text-black animate-pulse shadow-[0_0_35px_rgba(255,69,58,0.7)]"
                : "bg-[#d4fc50] hover:bg-white text-black font-bold shadow-[0_0_25px_rgba(212,252,80,0.35)] active:scale-[0.99]"
            }`}
          >
            <Flame className="w-4 h-4 text-black" />
            <span>
              {isIncinerating
                ? "INCINERATING ON-CHAIN..."
                : selectedTokens >= 600000
                ? "INCINERATE 600K $JUICY & UNLOCK TIER 03"
                : selectedTokens >= 180000
                ? "INCINERATE 180K $JUICY & UNLOCK TIER 02"
                : `INCINERATE ${(selectedTokens || 0).toLocaleString()} $JUICY`}
            </span>
          </button>

          {/* Success Notification */}
          {burnSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-[#30d158]/15 border border-[#30d158]/40 text-[#30d158] font-mono text-xs flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{burnSuccess}</span>
            </div>
          )}

          {/* Recent Burns Ticker */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2.5">
              Recent On-Chain Burns
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
                    <span className="text-white/30 text-[11px]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* UNLOCKABLE CONTRABAND TIERS (Clean tab bar + 3 case file cards)           */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-white/10">
          {/* Category Filter Tabs */}
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-white/10 pb-3 overflow-x-auto font-mono text-xs uppercase tracking-wider select-none">
            <div className="flex items-center gap-6 sm:gap-8">
              {ALTAR_TABS.map((cat) => {
                const isActive = selectedTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedTab(cat.id)}
                    className="group relative pb-1 text-left cursor-pointer transition-colors shrink-0"
                  >
                    {isActive && (
                      <div className="absolute -top-3.5 left-0 w-6 h-0.5 bg-[#d4fc50] shadow-[0_0_8px_#d4fc50]" />
                    )}
                    <div className="flex items-center gap-2">
                      <span className={isActive ? "text-[#d4fc50] font-bold" : "text-white/40"}>
                        {cat.id}
                      </span>
                      <span className={isActive ? "text-white font-bold" : "text-white/60 group-hover:text-white"}>
                        {cat.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Tier Grid with Manila Docket Headers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {filteredTiers.map((tier, idx) => {
              const isUnlocked = !!unlockedTiers[tier.id];
              const caseFileId = `CASE FILE #081-${String.fromCharCode(65 + idx)}`;

              return (
                <div
                  key={tier.id}
                  className={`rounded-3xl bg-[#090b09] border flex flex-col justify-between transition-all duration-300 relative group shadow-xl overflow-hidden ${
                    isUnlocked
                      ? "border-[#30d158]/50 shadow-[0_0_35px_rgba(48,209,88,0.2)]"
                      : "border-white/15 hover:border-white/30"
                  }`}
                >
                  {/* Washi Tape Pin on Top Center */}
                  <div className="washi-tape -top-3 left-1/2 -translate-x-1/2 -rotate-1" />

                  {/* Manila Evidence Docket Header Strip */}
                  <div className="evidence-docket-header px-4 py-2.5 font-mono text-[10px] font-bold tracking-widest flex items-center justify-between border-b border-black/20">
                    <span className="text-black uppercase">
                      {caseFileId} // {tier.tierCode}: {tier.isHolderGate ? "HOLD GATE" : "BURN-TO-ACCESS"}
                    </span>
                    {isUnlocked ? (
                      <span className="rubber-stamp-green text-[8px] py-0 px-1.5">
                        CLEARED
                      </span>
                    ) : (
                      <span className="text-red-700 font-extrabold uppercase tracking-widest">
                        // CONFIDENTIAL
                      </span>
                    )}
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Tier Badge & Price Header (From ContentVault design) */}
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-[#d4fc50]">
                            {tier.tierCode} · {tier.badge}
                          </span>
                          <span className="text-base sm:text-lg font-bold text-white tracking-tight font-gta uppercase">
                            {tier.costDisplay}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-[#d4fc50] bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10 inline-block">
                            {tier.tokenRequirement}
                          </span>
                          <span className="text-[10px] font-mono text-white/40 block mt-0.5">
                            {tier.subRequirement}
                          </span>
                        </div>
                      </div>

                      {/* Media Thumbnail with Washi Tape, Rubber Stamp and Corner Action Button */}
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-black border border-white/10 group-hover:border-white/25 transition-colors">
                        <div className="washi-tape -top-2 left-6 -rotate-2" />

                        {/* Stamped Ink Seal on Thumbnail */}
                        <div className="absolute top-2.5 right-2.5 z-10">
                          {idx === 0 && <span className="rubber-stamp-red text-[8px]">EVIDENCE // 35MM</span>}
                          {idx === 1 && <span className="rubber-stamp-red text-[8px]">INCINERATOR TORCH</span>}
                          {idx === 2 && <span className="rubber-stamp-yellow text-[8px]">CARTEL PASS</span>}
                        </div>

                        <img
                          src={tier.thumbnail}
                          alt={tier.title}
                          className={`w-full h-full object-cover transition-all duration-700 ${
                            isUnlocked
                              ? "filter-none group-hover:scale-105"
                              : "blur-[7px] brightness-50 contrast-125"
                          }`}
                        />

                        {/* Lock / Unlock Corner Badge */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold z-10">
                          {isUnlocked ? (
                            <>
                              <Unlock className="w-3 h-3 text-[#30d158]" />
                              <span className="text-[#30d158]">DECRYPTED // UNLOCKED</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-[#ff453a]" />
                              <span className="text-white/80">{tier.gateLabel}</span>
                            </>
                          )}
                        </div>

                        {/* Corner Action Plus / Eye Button */}
                        <button
                          onClick={() => {
                            if (isUnlocked) {
                              setActiveModalTier(tier);
                            } else {
                              handleUnlockTier(tier);
                            }
                          }}
                          className="absolute bottom-2.5 right-2.5 square-plus-btn z-10"
                          title={isUnlocked ? "View Content" : "Decrypt Stash"}
                        >
                          +
                        </button>
                      </div>

                      {/* Tier Title and Media Format */}
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

                      {/* "What You Get" Perks Checklist (Crystal Clear Communication) */}
                      <div className="space-y-1.5 py-3 border-t border-white/10 font-mono text-xs text-white/60 mb-5">
                        <div className="text-[9px] font-mono uppercase tracking-widest text-white/40 mb-1.5 font-bold">
                          INCLUDED IN EVIDENCE DOSSIER:
                        </div>
                        {tier.perks.map((perk, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50] shrink-0 mt-1.5" />
                            <span className="text-white/85">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="text-[11px] font-mono">
                        <span className="text-white/40 block text-[9px]">REQUIREMENT</span>
                        <span className="text-white font-bold">{tier.gateLabel}</span>
                      </div>

                      {isUnlocked ? (
                        <button
                          onClick={() => setActiveModalTier(tier)}
                          className="btn-tactile px-4 py-2.5 rounded-lg bg-[#30d158]/20 border border-[#30d158] text-[#30d158] hover:bg-[#30d158] hover:text-black font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(48,209,88,0.3)]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ACCESS ARCHIVE</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnlockTier(tier)}
                          disabled={isProcessingUnlock}
                          className="btn-tactile px-4 py-2.5 rounded-lg bg-[#d4fc50] hover:bg-white text-black font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(212,252,80,0.35)]"
                        >
                          {tier.isBurn ? (
                            <Flame className="w-3.5 h-3.5 text-black" />
                          ) : (
                            <Lock className="w-3 h-3 text-black" />
                          )}
                          <span>
                            {isProcessingUnlock
                              ? "DECRYPTING..."
                              : tier.isBurn
                              ? `BURN ${(tier.costTokens).toLocaleString()} TO UNLOCK`
                              : "VERIFY $50 HOLDER BALANCE"}
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

        {/* Modal: Decrypted Contraband Viewer */}
        {activeModalTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
            <div className="relative max-w-2xl w-full rounded-3xl bg-[#0d0f0d] border border-white/20 p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,1)] text-white font-mono">
              <button
                onClick={() => setActiveModalTier(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[#30d158] text-xs font-bold uppercase tracking-widest mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>SYNDICATE CLEARANCE GRANTED // TOP SECRET</span>
              </div>

              <h3 className="font-gta text-3xl sm:text-4xl uppercase text-white mb-2">
                {activeModalTier.title}
              </h3>
              <p className="text-xs text-white/60 font-sans mb-4">
                {activeModalTier.description}
              </p>

              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/20 mb-4 bg-black">
                <img
                  src={activeModalTier.thumbnail}
                  alt={activeModalTier.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 rounded-xl bg-black/70 border border-white/10 text-xs flex items-center justify-between mb-4">
                <span>FORMAT: {activeModalTier.format}</span>
                <span className="text-[#d4fc50]">VERIFIED L2 ZERO-KNOWLEDGE PROOF</span>
              </div>

              <button
                onClick={() => setActiveModalTier(null)}
                className="btn-tactile w-full py-3 rounded-xl bg-[#d4fc50] text-black font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                CLOSE EVIDENCE DOSSIER
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
