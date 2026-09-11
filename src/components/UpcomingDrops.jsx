import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Copy,
  Check,
  ArrowUpRight,
  Lock,
  Flame,
  Bell,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { logo } from "../assets";
import SpotlightCard from "./react-bits/SpotlightCard";
import { useTokenData } from "../hooks/useTokenData";
import LaunchNotifyModal from "./LaunchNotifyModal";

const MIKA_CA = "0x123372D9de53D5bEC2988DD2386c7d3666A372a8";
const JUICY_X_URL = "https://x.com/msjuicy_plenty";
const JUICY_REPOST_URL = "https://x.com/mikaylafun/status/2098092424337711392?s=20";

const getFridayTargetMs = () => {
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

const CardCountdown = ({ targetTimestamp, initialMs, highlight = false }) => {
  const calculate = () => {
    if (targetTimestamp) return Math.max(0, targetTimestamp - Date.now());
    return initialMs || 0;
  };
  const [remaining, setRemaining] = useState(calculate);

  useEffect(() => {
    const interval = setInterval(() => setRemaining(calculate()), 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp, initialMs]);

  const d = Math.floor(remaining / (86400 * 1000));
  const h = Math.floor((remaining % (86400 * 1000)) / (3600 * 1000));
  const m = Math.floor((remaining % (3600 * 1000)) / (60 * 1000));
  const s = Math.floor((remaining % (60 * 1000)) / 1000);

  return (
    <span className={`font-mono font-bold tracking-wider ${highlight ? "text-[#d4fc50]" : "text-white/80"}`}>
      {d > 0 ? `${d}d ` : ""}
      {String(h).padStart(2, "0")}h : {String(m).padStart(2, "0")}m : {String(s).padStart(2, "0")}s
    </span>
  );
};

export default function UpcomingDrops() {
  const tokenData = useTokenData();
  const [copiedCA, setCopiedCA] = useState(false);
  const [filterTab, setFilterTab] = useState("all");
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [whitelisted, setWhitelisted] = useState(() => {
    const initial = {};
    try {
      if (localStorage.getItem("mika_drop_alert_msjuicy")) {
        initial["drop-friday"] = true;
      }
      if (localStorage.getItem("mika_drop_alert_sunday")) {
        initial["drop-sunday"] = true;
      }
      if (localStorage.getItem("mika_drop_alert_tuesday")) {
        initial["drop-tuesday"] = true;
      }
    } catch (e) {}
    return initial;
  });
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const syncAlerts = () => {
      try {
        const savedJuicy = localStorage.getItem("mika_drop_alert_msjuicy");
        if (savedJuicy) {
          setWhitelisted((prev) => ({ ...prev, "drop-friday": true }));
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
    e.stopPropagation();
    navigator.clipboard.writeText(MIKA_CA);
    setCopiedCA(true);
    setToastMessage("Copied $MIKA Contract Address to clipboard");
    setTimeout(() => {
      setCopiedCA(false);
      setToastMessage(null);
    }, 3000);
  };

  const handleWhitelist = (dropId, title) => {
    if (dropId === "drop-friday") {
      setIsNotifyModalOpen(true);
      return;
    }

    try {
      const key = dropId === "drop-sunday" ? "mika_drop_alert_sunday" : "mika_drop_alert_tuesday";
      localStorage.setItem(key, JSON.stringify({ active: true, dropId, timestamp: Date.now() }));
    } catch (e) {}

    setWhitelisted((prev) => ({ ...prev, [dropId]: true }));
    setToastMessage(`Launch alert registered for ${title}. Embargo notification ready.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showMika = filterTab === "all" || filterTab === "genesis";
  const showCreators = filterTab === "all" || filterTab === "creators";

  return (
    <section id="upcoming-drops" className="relative py-14 lg:py-20 bg-[#080808] border-t border-white/[0.08]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#111111] border border-white/20 text-xs font-mono text-white flex items-center gap-2 shadow-xl backdrop-blur-xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#d4fc50]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 relative z-10">

        {/* Section Header & Filters (Clean Daos.fun / Pump.fun styling) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
              Curated Launchpad Drops
            </h2>
            <p className="text-xs font-mono text-white/50 mt-1">
              Fair bonding curves on Robinhood Chain L2 · All tickers embargoed until T-0 against sniper bots
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterTab("all")}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer shrink-0 transition-colors ${
                filterTab === "all"
                  ? "bg-[#d4fc50] text-black font-semibold shadow-[0_0_12px_rgba(212,252,80,0.3)]"
                  : "bg-white/[0.04] border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              ★ All Drops [4]
            </button>
            <button
              onClick={() => setFilterTab("genesis")}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer shrink-0 transition-colors ${
                filterTab === "genesis"
                  ? "bg-[#d4fc50] text-black font-semibold shadow-[0_0_12px_rgba(212,252,80,0.3)]"
                  : "bg-white/[0.04] border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              Live: $MIKA
            </button>
            <button
              onClick={() => setFilterTab("creators")}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer shrink-0 transition-colors ${
                filterTab === "creators"
                  ? "bg-[#d4fc50] text-black font-semibold shadow-[0_0_12px_rgba(212,252,80,0.3)]"
                  : "bg-white/[0.04] border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              Upcoming Creators (3)
            </button>
          </div>
        </div>

        {/* Featured Juicy Syndicate Banner */}
        <div className="mb-7 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#d4fc50]/15 via-black/80 to-[#d4fc50]/10 border border-[#d4fc50]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_25px_rgba(212,252,80,0.12)]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#d4fc50] text-black flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,252,80,0.4)]">
              <Flame className="w-6 h-6 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#d4fc50]">
                  Ms Juicy P ($JUICY) Syndicate Subpage Live
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#30d158]/20 border border-[#30d158]/40 text-[#30d158] text-[9px] font-mono font-bold animate-pulse">
                  PUBLIC ACCESS · ZERO PASSWORD
                </span>
              </div>
              <p className="text-xs text-white/75 font-sans mt-0.5 max-w-2xl">
                Burn $MIKA on-chain with wallet signature to incinerate supply & unlock exclusive high-resolution videos, snippets, and master tapes.
              </p>
            </div>
          </div>
          <Link
            to="/juicy"
            className="btn-tactile px-6 py-3 rounded-xl bg-[#d4fc50] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-2 shadow-[0_0_20px_rgba(212,252,80,0.3)] transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            <span>ENTER $JUICY SUBPAGE</span>
            <span>→</span>
          </Link>
        </div>

        {/* Launchpad Grid: High media presence, zero nested box clutter, effortless typography */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">

          {/* ========================================================= */}
          {/* CARD 1: $MIKA PROTOCOL ASSET (LIVE TODAY)                 */}
          {/* ========================================================= */}
          {showMika && (
            <SpotlightCard
              className="bg-[#0f1110] border border-white/10 hover:border-[#d4fc50]/40 p-4 rounded-2xl flex flex-col justify-between transition-all group shadow-md"
              spotlightColor="rgba(212, 252, 80, 0.08)"
            >
              <div>
                {/* Media Thumbnail with Floating Corner Pills */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3.5 bg-black flex items-center justify-center border border-white/10 group-hover:border-[#d4fc50]/30 transition-colors">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/15 p-2 bg-black/80 shadow-[0_0_24px_rgba(212,252,80,0.2)] group-hover:scale-105 transition-transform duration-300">
                    <img src={logo} alt="Mikayla" className="w-full h-full object-contain" />
                  </div>

                  {/* Corner Status Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-[#30d158]/40 text-[10px] font-mono font-bold text-[#30d158]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
                    <span>GRADUATED · LIVE</span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/70">
                    Robinhood L2
                  </div>
                </div>

                {/* Name & Ticker */}
                <div className="flex items-baseline justify-between gap-1 mb-1">
                  <h3 className="text-base font-bold text-white tracking-tight font-sans">
                    Mikayla Protocol
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#d4fc50]">
                    $MIKA
                  </span>
                </div>

                {/* Market Cap & Status */}
                <div className="flex items-baseline gap-2 mb-1.5 text-xs font-mono">
                  <span className="text-sm font-bold text-white">{tokenData.marketCapFormatted} MC</span>
                  <span className="text-[#30d158] font-bold text-[11px]">+{tokenData.priceChange24h.toFixed(1)}%</span>
                  <span className="text-white/40 text-[11px]">· {tokenData.priceUsdFormatted}</span>
                </div>

                {/* Bonded Status Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-white/60">Bonding Status</span>
                    <span className="text-[#30d158] font-bold">100% Bonded ✓</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#30d158] h-full rounded-full transition-all duration-700"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-white/40 mt-1">
                    <span>415 Holders · FOMO & Uniswap</span>
                    <span>{(tokenData.burnedFormatted || "16.4M")} ({(tokenData.burnedPct || "1.64")}%) Burned</span>
                  </div>
                </div>

                {/* Clean Description */}
                <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-3 font-sans">
                  Genesis asset. 50% of all creator launch profits are routed on-chain to buy back and burn $MIKA supply forever.
                </p>

                {/* Contract Address */}
                <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-4 pt-2.5 border-t border-white/5">
                  <span className="text-[11px] text-white/40">Verified CA</span>
                  <button
                    onClick={handleCopyCA}
                    className="flex items-center gap-1.5 text-white/80 hover:text-[#d4fc50] transition-colors cursor-pointer"
                    title="Copy Contract Address"
                  >
                    <code className="text-[10px]">0x1233...72a8</code>
                    {copiedCA ? <Check className="w-3 h-3 text-[#d4fc50]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <a
                href={tokenData.fomoUrl || "https://fomo.family/token/0x123372D9de53D5bEC2988DD2386c7d3666A372a8"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tactile w-full py-2.5 rounded-xl bg-[#d4fc50] hover:bg-white text-black text-xs font-mono font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-[0_0_14px_rgba(212,252,80,0.25)] transition-colors"
              >
                <span>Trade on FOMO / DEX</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </SpotlightCard>
          )}

          {/* ========================================================= */}
          {/* CARD 2: MS JUICY P · DROP #01 (FRIDAY 5PM UTC)             */}
          {/* ========================================================= */}
          {showCreators && (
            <SpotlightCard
              className="bg-[#0f1110] border border-white/10 hover:border-[#d4fc50]/40 p-4 rounded-2xl flex flex-col justify-between transition-all group shadow-md"
              spotlightColor="rgba(212, 252, 80, 0.08)"
            >
              <div>
                {/* Media Artwork: Ms Juicy P (Only "MS JUICY P", zero overlay text) */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3.5 bg-black border border-white/10 group-hover:border-[#d4fc50]/30 transition-colors shadow-md">
                  <img
                    src="/creators/msjuicy_banner.jpg"
                    alt="Ms Juicy P"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Name, Avatar & Ticker (Anti-Sniper Embargoed) */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-[#d4fc50] bg-black shrink-0 shadow-[0_0_8px_rgba(212,252,80,0.3)]">
                      <img src="/creators/msjuicy.jpg" alt="Ms Juicy P" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={JUICY_X_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-white hover:text-[#d4fc50] transition-colors font-sans"
                        >
                          Ms Juicy P
                        </a>
                        <span className="text-xs text-[#30d158]" title="Verified Creator">✓</span>
                      </div>
                      <a
                        href={JUICY_X_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-white/50 hover:text-white transition-colors"
                      >
                        @msjuicy_plenty
                      </a>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-mono text-white/40 px-1.5 py-0.5 rounded bg-white/5 border border-white/10"
                    title="Ticker embargoed to prevent frontrunning sniper bots"
                  >
                    [Ticker Embargoed]
                  </span>
                </div>

                {/* Drop schedule tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-[#d4fc50]/10 border border-[#d4fc50]/30 text-[10px] font-mono font-bold text-[#d4fc50]">
                    DROP #01 · FRI 5PM UTC
                  </span>
                </div>

                {/* Verified Creator & Official Repost on X */}
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <a
                    href={JUICY_X_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors truncate"
                  >
                    80K+ Fans on X
                  </a>
                  <a
                    href={JUICY_REPOST_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#30d158] hover:text-[#d4fc50] transition-colors shrink-0"
                    title="Verified announcement reposted on X"
                  >
                    <span>Reposted on X</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>

                {/* Clean Description */}
                <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-3 font-sans">
                  Historic first artist launch together with @CyreneAI. Drops Friday at 5:00 PM UTC on Robinhood Chain.
                </p>

                {/* Inline Countdown */}
                <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-4 pt-2.5 border-t border-white/5">
                  <span className="text-[11px] text-white/40">Fair Launch</span>
                  <CardCountdown targetTimestamp={getFridayTargetMs()} highlight={true} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  to="/juicy"
                  className="btn-tactile w-full py-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 bg-[#d4fc50] hover:bg-white text-black shadow-[0_0_18px_rgba(212,252,80,0.35)] group/btn active:scale-[0.99]"
                >
                  <Flame className="w-3.5 h-3.5 text-black group-hover/btn:scale-110 transition-transform" />
                  <span>Enter Ms Juicy ($JUICY) →</span>
                </Link>
                <button
                  onClick={() => handleWhitelist("drop-friday", "Ms Juicy P (Drop #01)")}
                  className={`btn-tactile w-full py-2 rounded-xl text-[11px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    whitelisted["drop-friday"]
                      ? "bg-white/10 text-[#d4fc50] border border-[#d4fc50]/40"
                      : "bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
                  }`}
                >
                  {whitelisted["drop-friday"] ? <Check className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                  <span>{whitelisted["drop-friday"] ? "Alert Set ✓" : "Notify on Launch"}</span>
                </button>
              </div>
            </SpotlightCard>
          )}

          {/* ========================================================= */}
          {/* CARD 3: DROP #02 (THIS SUNDAY) — COMPLETELY CENSORED      */}
          {/* ========================================================= */}
          {showCreators && (
            <SpotlightCard
              className="bg-[#0f1110] border border-white/10 hover:border-white/25 p-4 rounded-2xl flex flex-col justify-between transition-all group shadow-md"
              spotlightColor="rgba(255, 255, 255, 0.05)"
            >
              <div>
                {/* Media Artwork: Censored Redacted Silhouette */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3.5 bg-gradient-to-b from-[#141714] to-[#090b09] border border-white/10 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-1 text-white/40 group-hover:text-white/70 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/75">
                    [ IDENTITY EMBARGOED ]
                  </div>
                  <div className="text-[9px] font-mono text-white/30">
                    Pre-Launch NDA Protected
                  </div>

                  {/* Corner Badges */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/70">
                    SUN 5PM UTC
                  </div>

                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/70">
                    Top 0.02% OF
                  </div>
                </div>

                {/* Name & Ticker */}
                <div className="flex items-baseline justify-between gap-1 mb-1">
                  <h3 className="text-base font-bold text-white tracking-tight font-sans">
                    Classified Creator
                  </h3>
                  <span className="text-[10px] font-mono text-white/40 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                    [Ticker Embargoed]
                  </span>
                </div>

                {/* Talent Status */}
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-white/60">Top 0.02% Earner</span>
                  <span className="text-white/40">West Coast Agency</span>
                </div>

                {/* Clean Description */}
                <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-3 font-sans">
                  Confidential talent roster. Fair bonding curve and contract address remain hidden until countdown zero.
                </p>

                {/* Inline Countdown */}
                <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-4 pt-2.5 border-t border-white/5">
                  <span className="text-[11px] text-white/40">Fair Launch</span>
                  <CardCountdown initialMs={4 * 86400 * 1000 + 12 * 3600 * 1000 + 45 * 60 * 1000} />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleWhitelist("drop-sunday", "Drop #02 (Sunday)")}
                className={`btn-tactile w-full py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  whitelisted["drop-sunday"]
                    ? "bg-white/10 text-[#d4fc50] border border-[#d4fc50]/40"
                    : "bg-white/10 hover:bg-[#d4fc50] hover:text-black text-white border border-white/15"
                }`}
              >
                {whitelisted["drop-sunday"] ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                <span>{whitelisted["drop-sunday"] ? "Alert Set" : "Notify on Launch"}</span>
              </button>
            </SpotlightCard>
          )}

          {/* ========================================================= */}
          {/* CARD 4: DROP #03 (NEXT TUESDAY) — COMPLETELY CENSORED     */}
          {/* ========================================================= */}
          {showCreators && (
            <SpotlightCard
              className="bg-[#0f1110] border border-white/10 hover:border-white/25 p-4 rounded-2xl flex flex-col justify-between transition-all group shadow-md"
              spotlightColor="rgba(255, 255, 255, 0.05)"
            >
              <div>
                {/* Media Artwork: Censored Redacted Silhouette */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3.5 bg-gradient-to-b from-[#141714] to-[#090b09] border border-white/10 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-1 text-white/40 group-hover:text-white/70 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/75">
                    [ IDENTITY EMBARGOED ]
                  </div>
                  <div className="text-[9px] font-mono text-white/30">
                    Pre-Launch NDA Protected
                  </div>

                  {/* Corner Badges */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/70">
                    TUE 5PM UTC
                  </div>

                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/70">
                    Top 0.01% OF
                  </div>
                </div>

                {/* Name & Ticker */}
                <div className="flex items-baseline justify-between gap-1 mb-1">
                  <h3 className="text-base font-bold text-white tracking-tight font-sans">
                    Classified Creator
                  </h3>
                  <span className="text-[10px] font-mono text-white/40 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                    [Ticker Embargoed]
                  </span>
                </div>

                {/* Talent Status */}
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-white/60">Top 0.01% Supermodel</span>
                  <span className="text-white/40">European Agency</span>
                </div>

                {/* Clean Description */}
                <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-3 font-sans">
                  European supermodel roster. 100% fair launch, anti-sniper contract hidden until launch.
                </p>

                {/* Inline Countdown */}
                <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-4 pt-2.5 border-t border-white/5">
                  <span className="text-[11px] text-white/40">Fair Launch</span>
                  <CardCountdown initialMs={6 * 86400 * 1000 + 8 * 3600 * 1000 + 20 * 60 * 1000} />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleWhitelist("drop-tuesday", "Drop #03 (Tuesday)")}
                className={`btn-tactile w-full py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  whitelisted["drop-tuesday"]
                    ? "bg-white/10 text-[#d4fc50] border border-[#d4fc50]/40"
                    : "bg-white/10 hover:bg-[#d4fc50] hover:text-black text-white border border-white/15"
                }`}
              >
                {whitelisted["drop-tuesday"] ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                <span>{whitelisted["drop-tuesday"] ? "Alert Set" : "Notify on Launch"}</span>
              </button>
            </SpotlightCard>
          )}

        </div>
      </div>

      {/* Real Drop Notification & Calendar Sync Modal */}
      <LaunchNotifyModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        onAlertSaved={() => {
          setWhitelisted((prev) => ({ ...prev, "drop-friday": true }));
          window.dispatchEvent(new Event("mika_alert_updated"));
          setToastMessage("Launch alert set! Added to calendar & alerts.");
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />
    </section>
  );
}
