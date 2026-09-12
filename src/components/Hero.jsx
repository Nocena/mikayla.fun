import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Bell, Check, Clock, Flame, ShieldAlert, FolderLock, Unlock, Sparkles, ShieldCheck } from "lucide-react";
import LightRays from "./react-bits/LightRays";
import SpotlightCard from "./react-bits/SpotlightCard";
import HeroScrollCanvas from "./HeroScrollCanvas";
import { BURN_DATA } from "../constants/burn";
import AppleBurnBadge from "./AppleBurnBadge";
import { useTokenData } from "../hooks/useTokenData";
import LaunchNotifyModal from "./LaunchNotifyModal";

const JUICY_X_URL = "https://x.com/msjuicy_plenty";
const JUICY_REPOST_URL = "https://x.com/mikaylafun/status/2098092424337711392?s=20";

const getTargetTimestamp = () => {
  const primaryTarget = new Date("2026-09-11T17:00:00Z").getTime();
  if (Date.now() < primaryTarget) return primaryTarget;
  const now = new Date();
  const nextFriday = new Date();
  const day = now.getUTCDay();
  const diffDays = (5 + 7 - day) % 7 || 7;
  nextFriday.setUTCDate(now.getUTCDate() + diffDays);
  nextFriday.setUTCHours(17, 0, 0, 0);
  return nextFriday.getTime();
};

export default function Hero() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const tokenData = useTokenData();

  const handleDemoTier = (tier) => {
    try {
      localStorage.setItem("mika_simulated_tier", tier);
      localStorage.setItem("mika_age_verified", "true");
    } catch {}
    navigate("/vault");
  };

  const [toastMessage, setToastMessage] = useState(null);
  const [copiedCA, setCopiedCA] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isAlertSet, setIsAlertSet] = useState(() => {
    try {
      const saved = localStorage.getItem("mika_drop_alert_msjuicy");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.calendar || parsed.browser || parsed.contact);
      }
    } catch (e) {}
    return false;
  });

  // Live countdown state for upcoming launch teaser
  const [targetTime] = useState(getTargetTimestamp);
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.max(0, targetTime - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  });

  useEffect(() => {
    const updateCountdown = () => {
      const diff = Math.max(0, targetTime - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  // Sync alert state across tabs and components
  useEffect(() => {
    const syncAlerts = () => {
      try {
        const saved = localStorage.getItem("mika_drop_alert_msjuicy");
        if (saved) {
          const parsed = JSON.parse(saved);
          setIsAlertSet(Boolean(parsed.calendar || parsed.browser || parsed.contact));
        }
      } catch (e) {}
    };
    window.addEventListener("storage", syncAlerts);
    window.addEventListener("mika_alert_updated", syncAlerts);
    return () => {
      window.removeEventListener("storage", syncAlerts);
      window.removeEventListener("mika_alert_updated", syncAlerts);
    };
  }, []);

  const handleCopyCA = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    navigator.clipboard.writeText(tokenData.tokenAddress || "0x123372D9de53D5bEC2988DD2386c7d3666A372a8");
    setCopiedCA(true);
    setToastMessage("Copied $MIKA Contract Address to clipboard!");
    setTimeout(() => {
      setCopiedCA(false);
      setToastMessage(null);
    }, 3000);
  };

  const handleNotifyLaunch = () => {
    setIsNotifyModalOpen(true);
  };

  const handleOpenLaunch = () => {
    window.dispatchEvent(new CustomEvent("open-launch-modal"));
  };

  // Subtle background video scrub driven by standard window scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrubRange = window.innerHeight * 1.5;
      const progress = Math.min(1, Math.max(0, scrollY / scrubRange));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center pt-28 pb-16 lg:pt-36 lg:pb-24 bg-[#080808] text-[#f4f4f2] overflow-hidden"
    >
      {/* Background Video Frame Scrubbing Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <HeroScrollCanvas progress={scrollProgress} />
      </div>

      {/* Subtle Ambient Volumetric Glow */}
      <LightRays
        raysColor="#d4fc50"
        raysSpeed={0.4}
        lightSpread={1.1}
        rayLength={2.0}
        pulsating={true}
        noiseAmount={0.03}
        followMouse={false}
        className="opacity-20 pointer-events-none z-[1]"
      />

      {/* Global Floating Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-[#080808]/95 border border-[#d4fc50] text-white shadow-[0_0_25px_rgba(212,252,80,0.25)] flex items-center gap-2.5 backdrop-blur-xl rounded-none"
          >
            <span className="w-1.5 h-1.5 bg-[#d4fc50]" />
            <span className="text-xs font-mono">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 2-Column Launchpad Hero Stage */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ========================================================= */}
          {/* LEFT COLUMN: EDITORIAL, TOKEN EXPLANATION, DEX PAID, BURNS */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
            {/* Monospace Architectural Tag */}
            <div className="flex items-center gap-2 sm:gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] text-[#d4fc50] uppercase mb-4 border-l-2 border-[#d4fc50] pl-2.5 sm:pl-3 py-0.5">
              <span>[ 01 // NON-CUSTODIAL STAKING VAULT ]</span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span className="text-white/60 hidden sm:inline text-[10px]">16 CREATOR ARCHIVES · 3-DAY UNBONDING</span>
            </div>

            {/* Official CA, DEX PAID & Non-Overlaying Burn Counter Capsule */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* Minimalist CA Capsule */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black/95 backdrop-blur-2xl border-t border-white/20 border-x border-b border-white/10 text-xs font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)]">
                <span className="text-white/50 text-[9px] sm:text-[10px] font-medium tracking-wider">CA:</span>
                <code className="text-white/90 font-mono text-[10px] sm:text-[11px] truncate max-w-[110px] sm:max-w-[140px]">
                  0x123372D9de53D5bEC2988DD2386c7d3666A372a8
                </code>
                <button
                  onClick={handleCopyCA}
                  className={`btn-tactile px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-medium cursor-pointer transition-colors ${
                    copiedCA
                      ? "bg-white text-black"
                      : "bg-white/10 hover:bg-white hover:text-black text-white"
                  }`}
                >
                  {copiedCA ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Apple-Grade Dex Paid Capsule */}
              <a
                href={tokenData.pairUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/dexpaid btn-tactile inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black/95 backdrop-blur-2xl border-t border-white/20 border-x border-b border-white/10 text-xs font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)] hover:border-[#30d158]/40 hover:shadow-[0_0_16px_rgba(48,209,88,0.15)] transition-all cursor-pointer"
                title="Verified Enhanced Token Info on Dexscreener"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] shadow-[0_0_6px_#30d158]" />
                <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.1em] uppercase text-white/90 group-hover/dexpaid:text-white transition-colors flex items-center gap-1">
                  DEX PAID
                  <span className="text-[9px] text-[#30d158]">✓</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-white/30 group-hover/dexpaid:text-[#30d158] group-hover/dexpaid:translate-x-0.5 group-hover/dexpaid:-translate-y-0.5 transition-all">
                  ↗
                </span>
              </a>

              {/* FOMO Terminal Capsule */}
              <a
                href={tokenData.fomoUrl || "https://fomo.family/token/0x123372D9de53D5bEC2988DD2386c7d3666A372a8"}
                target="_blank"
                rel="noopener noreferrer"
                className="group/fomo btn-tactile inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black/95 backdrop-blur-2xl border-t border-white/20 border-x border-b border-white/10 text-xs font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)] hover:border-[#d4fc50]/40 hover:shadow-[0_0_16px_rgba(212,252,80,0.15)] transition-all cursor-pointer"
                title="Trade MIKA on FOMO Social App"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50] shadow-[0_0_6px_#d4fc50]" />
                <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.1em] uppercase text-white/90 group-hover/fomo:text-white transition-colors flex items-center gap-1">
                  FOMO
                  <span className="text-[9px] text-[#d4fc50]">⚡</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-white/30 group-hover/fomo:text-[#d4fc50] group-hover/fomo:translate-x-0.5 group-hover/fomo:-translate-y-0.5 transition-all">
                  ↗
                </span>
              </a>

              {/* Clean, Non-Overlaying Onchain Burn Counter Capsule */}
              <AppleBurnBadge />
            </div>

            {/* Bold Editorial Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif text-white tracking-display leading-[1.05] mb-4">
              Stake $MIKA.<br />
              <span className="italic font-light text-[#d4fc50]">Unlock 16 Creator Vaults.</span>
            </h1>

            {/* Crucial Explanation of Current Token ($MIKA) and Staking Vault */}
            <p className="text-xs sm:text-sm text-white/75 max-w-xl leading-relaxed font-sans font-light mb-6 border-l border-[#d4fc50]/40 pl-3">
              We collaborate directly with verified top creators who receive continuous protocol revenue. Stake $MIKA to unlock <strong className="text-white font-medium">exclusive private sets, raw unedited takes, and studio voice memos</strong> while retaining 100% non-custodial custody with a swift 3-day unbonding cooldown.
            </p>

            {/* Metrics Matrix (Verified Live Market & Onchain Values) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mb-7 py-3 border-y border-white/10">
              <div>
                <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Market Cap</div>
                <div className="text-base sm:text-xl font-mono font-bold text-white">
                  {tokenData.marketCapFormatted}
                </div>
                <div className="text-[10px] font-mono text-white/40 mt-0.5">
                  FOMO & Uniswap
                </div>
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">24H Change</div>
                <div className="text-base sm:text-xl font-mono font-bold text-[#30d158] flex items-center gap-1">
                  <span>+{tokenData.priceChange24h.toFixed(1)}%</span>
                  <span className="text-xs text-[#30d158]">▲</span>
                </div>
                <div className="text-[10px] font-mono text-white/40 mt-0.5">
                  Vol: {tokenData.volume24hFormatted || "$177.1K"} · 415 Holders
                </div>
              </div>
              <a
                href={BURN_DATA.burnTxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/burnstat block hover:opacity-80 transition-opacity"
              >
                <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1 flex items-center gap-1">
                  <span>Burned Supply</span>
                  <span className="text-white/30 group-hover/burnstat:text-white transition-colors">↗</span>
                </div>
                <div className="text-base sm:text-xl font-mono font-bold text-white flex items-baseline gap-1.5">
                  <span>{tokenData.totalBurnedFormatted || "16.4M"}</span>
                  <span className="text-[10px] font-mono text-white/40 font-normal">({tokenData.percentBurned || "1.64%"})</span>
                </div>
                <div className="text-[10px] font-mono text-white/40 mt-0.5">
                  Permanent Deflation
                </div>
              </a>
            </div>

            {/* Quick Tactile Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
              <Link
                to="/vault"
                className="btn-tactile px-6 py-3.5 bg-[#d4fc50] text-[#080808] font-mono font-bold text-xs uppercase tracking-widest hover:bg-white cursor-pointer rounded-xl flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(212,252,80,0.4)] active:scale-[0.98] transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                <span>ENTER CREATOR VAULT (16 ARCHIVES)</span>
                <span>→</span>
              </Link>
              <Link
                to="/juicy"
                className="btn-tactile px-4 py-3.5 border border-[#d4fc50]/40 bg-[#d4fc50]/10 hover:bg-[#d4fc50]/20 text-[#d4fc50] font-mono font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>$JUICY</span>
              </Link>
              <a
                href={tokenData.fomoUrl || "https://fomo.family/token/0x123372D9de53D5bEC2988DD2386c7d3666A372a8"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactile px-4 py-3.5 border border-white/20 hover:border-[#d4fc50] text-white/90 hover:text-white font-mono text-xs uppercase font-medium tracking-[0.08em] transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white/[0.02] hover:bg-[#d4fc50]/10 rounded-xl"
              >
                <span>Trade $MIKA</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#d4fc50]" />
              </a>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: CREATOR STAKING VAULT MEGA FEATURE CARD      */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-5">
            <SpotlightCard
              className="p-5 sm:p-6 bg-[#0c0e0c]/90 border-t border-[#d4fc50]/60 border-x border-b border-[#d4fc50]/25 rounded-2xl shadow-[inset_0_1px_0_rgba(212,252,80,0.2),0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl group relative overflow-hidden"
              spotlightColor="rgba(212, 252, 80, 0.15)"
            >
              {/* Vault Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d4fc50] animate-pulse shadow-[0_0_10px_#d4fc50]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4fc50]">
                    Live Staking Vault · 16 Archives
                  </span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono text-white/70">
                  Robinhood Chain L2
                </div>
              </div>

              {/* High-Impact Visual Poster */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3.5 bg-black border border-white/15 group-hover:border-[#d4fc50]/50 transition-colors shadow-xl">
                <img
                  src="/mika_vault_staking_hype.jpg"
                  alt="Creator Staking Vault"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />

                {/* Corner Floating Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300">
                  <span>18+ ADULTS ONLY</span>
                </div>

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-[#30d158]/40 text-[10px] font-mono font-bold text-[#30d158]">
                  3-DAY UNBONDING
                </div>

                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-[#d4fc50]/40 text-[10px] font-mono font-bold text-[#d4fc50]">
                  50% PROTOCOL REVENUE SHARE
                </div>
              </div>

              {/* Title & Click-Baity Teaser */}
              <div className="mb-3.5">
                <h3 className="text-lg sm:text-xl font-bold text-white font-sans tracking-tight mb-1 flex items-center gap-2">
                  <span>Stake $50 To Unlock Creator Archives</span>
                  <Sparkles className="w-4 h-4 text-[#d4fc50] shrink-0" />
                </h3>
                <p className="text-xs text-white/75 font-sans leading-relaxed">
                  Direct revenue-sharing partner archives. Stake $MIKA to gain access to private photo shoots, raw unedited camera rolls, and green-room audio tapes.
                </p>
              </div>

              {/* 3 Tiers Quick Breakdown Strip */}
              <div className="grid grid-cols-3 gap-2 mb-3.5 text-center font-mono">
                <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/30">
                  <div className="text-[10px] font-bold text-amber-400 uppercase">Bronze</div>
                  <div className="text-sm font-bold text-white mt-0.5">$50</div>
                  <div className="text-[9px] text-white/50">4 Folders</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/20">
                  <div className="text-[10px] font-bold text-white uppercase">Silver</div>
                  <div className="text-sm font-bold text-white mt-0.5">$100</div>
                  <div className="text-[9px] text-white/50">8 Folders (Half)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-[#d4fc50]/40 shadow-[0_0_12px_rgba(212,252,80,0.15)]">
                  <div className="text-[10px] font-bold text-[#d4fc50] uppercase">Gold VIP</div>
                  <div className="text-sm font-bold text-[#d4fc50] mt-0.5">$200</div>
                  <div className="text-[9px] text-[#d4fc50]/80">ALL 16 Folders</div>
                </div>
              </div>

              {/* Verified Trust & Guarantee Row */}
              <div className="flex items-center justify-between text-xs font-mono mb-3.5 py-1.5 px-3 rounded-lg bg-black/50 border border-white/10">
                <span className="text-white/60 text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#30d158]" />
                  <span>100% Non-Custodial Vault</span>
                </span>
                <span className="text-[#d4fc50] text-[11px] font-semibold">
                  3-Day Cooldown · Zero Fee
                </span>
              </div>

              {/* Primary Action Button */}
              <div className="space-y-2.5">
                <Link
                  to="/vault"
                  className="btn-tactile w-full py-3.5 rounded-xl text-xs sm:text-sm font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 bg-[#d4fc50] hover:bg-white text-black shadow-[0_0_30px_rgba(212,252,80,0.4)] transition-all cursor-pointer group/vaultbtn active:scale-[0.99]"
                >
                  <FolderLock className="w-4 h-4 text-black group-hover/vaultbtn:scale-110 transition-transform" />
                  <span>ENTER VAULT & UNLOCK ARCHIVES →</span>
                </Link>

                {/* Instant Simulator Triggers */}
                <div className="pt-1 flex items-center justify-between gap-1 text-[10px] font-mono">
                  <span className="text-white/40 shrink-0">Demo Test:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => handleDemoTier("bronze")}
                      className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-colors"
                    >
                      ⚡ Bronze ($50)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoTier("silver")}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
                    >
                      ⚡ Silver ($100)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoTier("gold")}
                      className="px-2 py-0.5 rounded bg-[#d4fc50]/15 hover:bg-[#d4fc50]/30 border border-[#d4fc50]/40 text-[#d4fc50] transition-colors"
                    >
                      ⚡ Gold ($200)
                    </button>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>

        </div>
      </div>

      {/* Real Drop Notification & Calendar Sync Modal */}
      <LaunchNotifyModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        onAlertSaved={() => {
          setIsAlertSet(true);
          window.dispatchEvent(new Event("mika_alert_updated"));
        }}
      />
    </section>
  );
}
