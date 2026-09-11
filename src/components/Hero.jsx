import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Bell, Check, Clock, Flame, ShieldAlert } from "lucide-react";
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const tokenData = useTokenData();

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
    navigator.clipboard.writeText(tokenData.tokenAddress || "0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4");
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
              <span>[ 01 // ROBINHOOD PROTOCOL ]</span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span className="text-white/60 hidden sm:inline text-[10px]">SOLANA → ROBINHOOD EXPANSION</span>
            </div>

            {/* Official CA, DEX PAID & Non-Overlaying Burn Counter Capsule */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* Minimalist CA Capsule */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black/95 backdrop-blur-2xl border-t border-white/20 border-x border-b border-white/10 text-xs font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)]">
                <span className="text-white/50 text-[9px] sm:text-[10px] font-medium tracking-wider">CA:</span>
                <code className="text-white/90 font-mono text-[10px] sm:text-[11px] truncate max-w-[110px] sm:max-w-[140px]">
                  0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4
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
                href={tokenData.fomoUrl || "https://fomo.family/token/0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4"}
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
              Sex Capital Markets.<br />
              <span className="italic font-light text-[#d4fc50]">Tokenized on Robinhood.</span>
            </h1>

            {/* Crucial Explanation of Current Token ($MIKA) */}
            <p className="text-xs sm:text-sm text-white/75 max-w-xl leading-relaxed font-sans font-light mb-6 border-l border-white/15 pl-3">
              Solana's premier SCM launchpad is expanding to Robinhood Chain L2. <strong className="text-white font-medium">50% of all launch and platform profits are permanently routed on-chain to buy back and burn $MIKA supply forever.</strong>
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
              <a
                href="#upcoming-drops"
                className="btn-tactile px-6 py-3.5 bg-[#d4fc50] text-[#080808] font-mono font-bold text-xs uppercase tracking-widest hover:bg-white cursor-pointer rounded-none flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(212,252,80,0.25)]"
              >
                <span>Explore Launchpad Drops</span>
                <span>↓</span>
              </a>
              <a
                href={tokenData.fomoUrl || "https://fomo.family/token/0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactile px-5 py-3.5 border border-white/20 hover:border-[#d4fc50] text-white/90 hover:text-white font-mono text-xs uppercase font-medium tracking-[0.08em] transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white/[0.02] hover:bg-[#d4fc50]/10"
              >
                <span>Trade on FOMO</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#d4fc50]" />
              </a>
              <button
                onClick={handleOpenLaunch}
                className="btn-tactile px-6 py-3.5 border border-white/20 bg-black/50 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-widest rounded-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>+ Apply to Launch</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: NEXT FAIR LAUNCH TEASER (MS JUICY P)        */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-5">
            <SpotlightCard
              className="p-5 sm:p-6 bg-[#0c0e0c]/90 border-t border-[#d4fc50]/50 border-x border-b border-[#d4fc50]/20 rounded-2xl shadow-[inset_0_1px_0_rgba(212,252,80,0.15),0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl group"
              spotlightColor="rgba(212, 252, 80, 0.12)"
            >
              {/* Teaser Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-pulse shadow-[0_0_8px_#d4fc50]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4fc50]">
                    Next Launch Teaser
                  </span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono text-white/70">
                  Robinhood Chain L2
                </div>
              </div>

              {/* High-Impact Visual Poster (Artwork: Only "MS JUICY P", zero overlay text) */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3.5 bg-black border border-white/10 group-hover:border-[#d4fc50]/40 transition-colors shadow-lg">
                <img
                  src="/creators/msjuicy_banner.jpg"
                  alt="Ms Juicy P"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Creator Profile & Status Bar */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-[#d4fc50] bg-black shrink-0 shadow-[0_0_10px_rgba(212,252,80,0.3)]">
                    <img src="/creators/msjuicy.jpg" alt="Ms Juicy P" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Ms Juicy P</span>
                      <span className="text-xs text-[#30d158]" title="Verified Creator">✓</span>
                    </div>
                    <a
                      href={JUICY_X_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-white/60 hover:text-[#d4fc50] transition-colors"
                    >
                      @msjuicy_plenty
                    </a>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono text-white/60 px-2 py-0.5 rounded bg-black/70 border border-white/15">
                    [Ticker Embargoed]
                  </span>
                  <span className="text-[9px] font-mono text-white/40">
                    Anti-Sniper Protection
                  </span>
                </div>
              </div>

              {/* Creator Credentials & Endorsement Row */}
              <div className="flex items-center justify-between text-xs font-mono mb-3 py-1.5 px-2.5 rounded-lg bg-black/50 border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#d4fc50]/10 border border-[#d4fc50]/30 text-[10px] font-bold text-[#d4fc50]">
                    DROP #01 · FRI 5PM UTC
                  </span>
                  <a
                    href={JUICY_X_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-[#d4fc50] transition-colors text-[11px] flex items-center gap-1"
                  >
                    <span>80K+ on X</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
                <a
                  href={JUICY_REPOST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#30d158] hover:text-[#d4fc50] font-medium transition-colors text-[11px]"
                  title="Verified announcement repost on X"
                >
                  <span>Reposted on X</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>

              {/* Real-time Countdown Display */}
              <div className="p-3 bg-black/70 border border-white/10 rounded-xl mb-3 text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5 flex items-center justify-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#d4fc50]" />
                  <span>Fair Launch T-Minus (Friday 5:00 PM UTC)</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 font-mono">
                  <div className="p-1.5 rounded-lg bg-black/60 border border-white/10">
                    <div className="text-base sm:text-lg font-bold text-white">
                      {String(timeLeft.days).padStart(2, "0")}
                    </div>
                    <div className="text-[8px] uppercase text-white/40">Days</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/60 border border-white/10">
                    <div className="text-base sm:text-lg font-bold text-white">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-[8px] uppercase text-white/40">Hours</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/60 border border-white/10">
                    <div className="text-base sm:text-lg font-bold text-white">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-[8px] uppercase text-white/40">Mins</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/60 border border-[#d4fc50]/30 shadow-[0_0_10px_rgba(212,252,80,0.15)]">
                    <div className="text-base sm:text-lg font-bold text-[#d4fc50]">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-[8px] uppercase text-[#d4fc50]/70">Secs</div>
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="space-y-2">
                <button
                  onClick={handleNotifyLaunch}
                  className={`btn-tactile w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isAlertSet
                      ? "bg-white/10 text-[#d4fc50] border border-[#d4fc50]/40"
                      : "bg-[#d4fc50] hover:bg-white text-black shadow-[0_0_16px_rgba(212,252,80,0.3)]"
                  }`}
                >
                  {isAlertSet ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  <span>{isAlertSet ? "Launch Notification Active ✓" : "Notify Me on Launch"}</span>
                </button>

                <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-0.5 px-1">
                  <span>Anti-Sniper Shield Active</span>
                  <a
                    href="#upcoming-drops"
                    className="text-[#d4fc50] hover:underline flex items-center gap-0.5"
                  >
                    <span>View All Cohort Drops</span>
                    <span>↓</span>
                  </a>
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
