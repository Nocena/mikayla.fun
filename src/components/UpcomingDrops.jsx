import React, { useState, useEffect } from "react";
import {
  Search,
  Copy,
  Check,
  Flame,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import ShinyText from "./react-bits/ShinyText";
import SpotlightCard from "./react-bits/SpotlightCard";

const MIKA_CA = "0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4";

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

// Upcoming creator launches planned for Friday, Sunday, and Tuesday
const CREATOR_DROPS = [
  {
    id: "drop-friday",
    dropNumber: "MS JUICY P · DROP #01",
    codename: "$JUICY",
    creatorRank: "TOP CREATOR · VERIFIED",
    dayLabel: "THIS FRIDAY · 5PM UTC",
    scheduleText: "Launching Friday · 5:00 PM UTC",
    targetTimestamp: getFridayTargetMs(),
    avatar: "/creators/msjuicy.jpg",
    banner: "/creators/msjuicy_banner.jpg",
    handle: "@msjuicy_plenty",
    xUrl: "https://x.com/msjuicy_plenty",
    category: "Viral Sensation & Glamour Star · @msjuicy_plenty",
    metrics: {
      reach: "Viral Audience",
      monthlyGmv: "Audited Escrow",
      status: "Mikayla Launchpad",
    },
    targetMcapGate: "$100k Market Cap",
    holderGatePerk: "Exclusive Uncut Studio Vault & Leica Negatives",
    burnPerk: "Direct Private 4K Master Roll + Audio Access",
    teaser: "Official creator token launch presented by Mikayla Launchpad. Fair launch on Robinhood Chain L2 with 50% profit buyback & burn to $MIKA.",
    whitelistedCount: 1940,
    accentColor: "#d4fc50",
  },
  {
    id: "drop-sunday",
    dropNumber: "PROJECT KIRA · DROP #02",
    codename: "$KIRA",
    creatorRank: "TOP 0.02% ONLYFANS",
    dayLabel: "THIS SUNDAY",
    scheduleText: "Launching Sunday · T-4 Days",
    targetMs: 4 * 86400 * 1000 + 12 * 3600 * 1000 + 45 * 60 * 1000 + 10 * 1000,
    avatar: "/creators/kira.jpg",
    category: "Viral Alt-Glamour & Boudoir Sensation · LA",
    metrics: {
      reach: "2.2M+ Verified Fans",
      monthlyGmv: "$340k/mo Revenue",
      status: "Escrow Audited",
    },
    targetMcapGate: "$150k Market Cap",
    holderGatePerk: "30 Uncut Sunset Hills Penthouse 35mm Raw Photos",
    burnPerk: "15-Min 4K Studio Film + Private Binaural Note",
    teaser: "Apex-tier adult creator with high recurring subscriber retention. All due diligence & smart contract locks complete.",
    whitelistedCount: 1890,
    accentColor: "#d4fc50",
  },
  {
    id: "drop-tuesday",
    dropNumber: "PROJECT LUNA · DROP #03",
    codename: "$LUNA",
    creatorRank: "TOP 0.01% ONLYFANS",
    dayLabel: "NEXT TUESDAY",
    scheduleText: "Launching Tuesday · T-6 Days",
    targetMs: 6 * 86400 * 1000 + 8 * 3600 * 1000 + 20 * 60 * 1000,
    avatar: "/creators/luna.jpg",
    category: "Platinum Erotic Muse & Runaway Star · Paris",
    metrics: {
      reach: "3.6M+ Verified Fans",
      monthlyGmv: "$520k/mo Revenue",
      status: "Pre-Mine 0.0%",
    },
    targetMcapGate: "$200k Market Cap",
    holderGatePerk: "45 Uncut 4K HDR Studio Gallery + Paris Hotel Archive",
    burnPerk: "20-Min Cinematic 4K Master Roll + Signed Canvas",
    teaser: "Global top-ranking erotic creator with multi-million dollar verified annual revenue. Launching on Robinhood Chain.",
    whitelistedCount: 2420,
    accentColor: "#d4fc50",
  },
];

const CountdownClock = ({ initialRemainingMs, targetTimestamp }) => {
  const calculateRemaining = () => {
    if (targetTimestamp) {
      return Math.max(0, targetTimestamp - Date.now());
    }
    return initialRemainingMs || 0;
  };

  const [remaining, setRemaining] = useState(calculateRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(calculateRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp, initialRemainingMs]);

  const days = Math.floor(remaining / (86400 * 1000));
  const hours = Math.floor((remaining % (86400 * 1000)) / (3600 * 1000));
  const minutes = Math.floor((remaining % (3600 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

  return (
    <div className="flex items-center gap-1 font-mono text-[11px]">
      <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-white font-medium">
        {String(days).padStart(2, "0")}d
      </span>
      <span className="text-white/30">:</span>
      <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-white font-medium">
        {String(hours).padStart(2, "0")}h
      </span>
      <span className="text-white/30">:</span>
      <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-white font-medium">
        {String(minutes).padStart(2, "0")}m
      </span>
      <span className="text-white/30">:</span>
      <span className="px-2 py-0.5 rounded bg-black/60 border border-[#d4fc50]/30 text-[#d4fc50] font-semibold">
        {String(seconds).padStart(2, "0")}s
      </span>
    </div>
  );
};

const UpcomingDrops = () => {
  const [copiedCA, setCopiedCA] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all");
  const [whitelisted, setWhitelisted] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const handleCopy = (e) => {
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
    setWhitelisted((prev) => ({ ...prev, [dropId]: true }));
    setToastMessage(`Notification alert set for ${title}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredDrops = CREATOR_DROPS.filter((drop) => {
    if (filterTab === "genesis") return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      drop.dropNumber.toLowerCase().includes(q) ||
      drop.category.toLowerCase().includes(q) ||
      drop.dayLabel.toLowerCase().includes(q) ||
      drop.teaser.toLowerCase().includes(q)
    );
  });

  const showMikaCard =
    filterTab === "all" || filterTab === "genesis" || !searchQuery || "mika".includes(searchQuery.toLowerCase());

  return (
    <section id="upcoming-drops" className="relative py-20 lg:py-24 bg-[#080808] border-t border-white/[0.08]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#111111] border border-white/20 text-xs font-mono text-white flex items-center gap-2 shadow-xl backdrop-blur-xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#d4fc50]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 relative z-10">

        {/* 1. CLEAN SYSTEM BAR (Apple Translucent Chrome) */}
        <div className="mb-6 px-4 py-3 rounded-xl bg-black/50 border-t border-white/20 border-x border-b border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-3 text-white/70">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Sex Capital Markets · Curated Launchpad
            </span>
            <span className="text-white/20 hidden sm:inline">/</span>
            <span className="text-white/50 text-[11px]">
              Originating on Solana · Now expanding to Robinhood Chain L2
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-white/40 font-mono">Contract:</span>
              <code className="text-[11px] text-white/80 font-mono">
                0xa4f9...3Ab4
              </code>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="btn-tactile px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono font-medium text-white cursor-pointer flex items-center gap-1.5"
              >
                {copiedCA ? <Check className="w-3 h-3 text-[#d4fc50]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCA ? "Copied" : "Copy CA"}</span>
              </button>
              <a
                href="https://dexscreener.com/search?q=0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4"
                target="_blank"
                rel="noopener noreferrer"
                className="group/dexpaid btn-tactile inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-xl border-t border-white/25 border-x border-b border-white/10 text-[10px] font-mono font-bold transition-all hover:border-[#30d158]/40 hover:shadow-[0_0_14px_rgba(48,209,88,0.2)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] cursor-pointer"
              >
                <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30d158] opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#30d158] shadow-[0_0_6px_#30d158]"></span>
                </span>
                <ShinyText text="DEX PAID" color="#30d158" shineColor="#ffffff" speed={3} className="font-bold tracking-wider text-[10px]" />
                <span className="text-[9px] text-[#30d158]">✓</span>
                <span className="text-[8px] text-white/30 group-hover/dexpaid:text-[#30d158] transition-colors">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2. SEARCH & FILTER TOOLBAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search launches or dates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/60 border border-white/15 focus:border-[#d4fc50]/50 focus:outline-none text-xs font-mono text-white placeholder:text-white/40 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterTab("all")}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer shrink-0 ${
                filterTab === "all"
                  ? "bg-[#d4fc50] text-black font-semibold shadow-[0_0_12px_rgba(212,252,80,0.3)]"
                  : "bg-black/50 border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              All Drops [4]
            </button>
            <button
              onClick={() => setFilterTab("genesis")}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer shrink-0 ${
                filterTab === "genesis"
                  ? "bg-[#d4fc50] text-black font-semibold shadow-[0_0_12px_rgba(212,252,80,0.3)]"
                  : "bg-black/50 border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              Today: $MIKA
            </button>
            <button
              onClick={() => setFilterTab("creators")}
              className={`btn-tactile px-3.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer shrink-0 ${
                filterTab === "creators"
                  ? "bg-[#d4fc50] text-black font-semibold shadow-[0_0_12px_rgba(212,252,80,0.3)]"
                  : "bg-black/50 border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              Upcoming Creators (3)
            </button>
          </div>
        </div>

        {/* 3. MAIN LAUNCHPAD WRAPPER */}
        <div className="rounded-2xl border-t border-white/20 border-x border-b border-white/10 bg-[#0d0d0d] p-5 sm:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_60px_rgba(0,0,0,0.85)]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-5 mb-6 border-b border-white/[0.08]">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-white tracking-display">
                Curated Launch Schedule
              </h2>
              <p className="text-xs font-mono text-white/50 mt-1">
                Direct agency-represented creators · 50% of all launch & platform profits burn $MIKA
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/50">
              <span className="w-2 h-2 rounded-full bg-[#d4fc50]" />
              <span>Next Drops: Friday · Sunday · Tuesday</span>
            </div>
          </div>

          {/* Grid of 4 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* ========================================================= */}
            {/* CARD 1: $MIKA PROTOCOL ASSET (LIVE TODAY)                 */}
            {/* ========================================================= */}
            {showMikaCard && (
              <SpotlightCard
                className="bg-black/80 border-t border-[#d4fc50]/50 border-x border-b border-[#d4fc50]/20 shadow-[inset_0_1px_0_rgba(212,252,80,0.15)] hover:border-[#d4fc50]/70 p-5 rounded-xl flex flex-col justify-between transition-all"
                spotlightColor="rgba(212, 252, 80, 0.08)"
              >
                <div>
                  {/* Card Header & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#d4fc50] text-black uppercase tracking-wider">
                      Live Today
                    </span>
                    <span className="text-[10px] font-mono text-white/40">Robinhood L2</span>
                  </div>

                  {/* Token Identity */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-base font-bold text-white font-sans">Mikayla</h3>
                      <span className="text-xs font-mono text-[#30d158] font-medium">+342.8%</span>
                    </div>
                    <div className="text-lg font-mono font-bold text-[#d4fc50]">
                      <ShinyText text="$MIKA" color="#d4fc50" shineColor="#ffffff" speed={2.5} />
                    </div>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 gap-2 py-2.5 px-3 rounded-lg bg-white/[0.03] border border-white/[0.08] mb-3 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-white/40 uppercase">Price</div>
                      <div className="text-white font-medium">$0.0428</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase">Market Cap</div>
                      <div className="text-white font-medium">$42.8M</div>
                    </div>
                  </div>

                  {/* Verified CA with Copy */}
                  <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 mb-3.5 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[9px] font-mono text-white/40 uppercase">Verified Contract (CA)</div>
                      <code className="text-[10px] font-mono text-white/80 truncate block max-w-[150px]">
                        {MIKA_CA}
                      </code>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="btn-tactile px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] cursor-pointer shrink-0"
                    >
                      {copiedCA ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* Core Token Utility Callout */}
                  <div className="p-3 rounded-lg bg-[#d4fc50]/[0.06] border border-[#d4fc50]/20 mb-4 text-[11px] font-sans leading-relaxed text-white/80">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#d4fc50] uppercase mb-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>50% Launch Profit Burn Sink</span>
                    </div>
                    <p className="text-white/70">
                      Every subsequent creator launch generates platform profits. <strong className="text-white font-medium">50% of all profits are routed on-chain to buy back and burn $MIKA supply forever.</strong>
                    </p>
                  </div>
                </div>

                <a
                  href="#hero"
                  className="btn-tactile w-full py-2.5 rounded-lg bg-[#d4fc50] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,252,80,0.25)]"
                >
                  <span>Trade $MIKA Terminal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </SpotlightCard>
            )}

            {/* ========================================================= */}
            {/* CARDS 2, 3, 4: UPCOMING CREATOR DROPS (FRI, SUN, TUE)     */}
            {/* ========================================================= */}
            {filteredDrops.map((drop) => {
              const isWhitelisted = whitelisted[drop.id];
              return (
                <SpotlightCard
                  key={drop.id}
                  className="bg-black/60 border-t border-white/20 border-x border-b border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-white/25 p-5 rounded-xl flex flex-col justify-between transition-all"
                  spotlightColor="rgba(255, 255, 255, 0.05)"
                >
                  <div>
                    {/* Header & Date Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/10 text-white uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#d4fc50]" />
                        <span>{drop.dayLabel}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-[#d4fc50] bg-[#d4fc50]/10 border border-[#d4fc50]/20 font-bold uppercase">
                        {drop.creatorRank}
                      </span>
                    </div>

                    {/* Creator Visual Thumbnail */}
                    {drop.avatar && (
                      <div className="relative w-full h-28 rounded-lg overflow-hidden mb-3 border border-white/10 bg-black/60 group/thumb">
                        <img
                          src={drop.banner || drop.avatar}
                          alt={drop.dropNumber}
                          className="w-full h-full object-cover object-center group-hover/thumb:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-[#d4fc50]/60 shadow-[0_0_8px_rgba(212,252,80,0.3)] bg-black shrink-0">
                              <img src={drop.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            {drop.handle && (
                              <a
                                href={drop.xUrl || `https://x.com/${drop.handle.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[10px] font-mono font-medium text-white/90 hover:text-[#d4fc50] bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/15 flex items-center gap-1 transition-colors"
                              >
                                <span>{drop.handle}</span>
                                <ArrowUpRight className="w-2.5 h-2.5 text-[#d4fc50]" />
                              </a>
                            )}
                          </div>
                          {drop.id === "drop-friday" && (
                            <span className="text-[9px] font-mono font-bold text-[#d4fc50] bg-[#d4fc50]/20 border border-[#d4fc50]/40 px-1.5 py-0.5 rounded uppercase">
                              Launchpad Pick
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Drop Identity & Codename */}
                    <div className="mb-3">
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-base font-bold text-white font-sans">{drop.dropNumber}</h3>
                        <span className="text-xs font-mono font-bold text-[#d4fc50]">{drop.codename}</span>
                      </div>
                      <div className="text-xs font-mono text-white/60">{drop.category}</div>
                    </div>

                    {/* Verified Agency Roster Metrics */}
                    <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] mb-3 text-[10px] font-mono">
                      <div>
                        <div className="text-white/40 uppercase text-[9px]">Verified Reach</div>
                        <div className="text-white font-semibold">{drop.metrics.reach}</div>
                      </div>
                      <div>
                        <div className="text-white/40 uppercase text-[9px]">Platform GMV</div>
                        <div className="text-[#a8c3a0] font-semibold">{drop.metrics.monthlyGmv}</div>
                      </div>
                    </div>

                    {/* Countdown Clock & Embargo Notice */}
                    <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.08] mb-3 flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 uppercase">
                        <Clock className="w-3 h-3 text-[#d4fc50]" />
                        <span>{drop.scheduleText}</span>
                      </div>
                      <CountdownClock initialRemainingMs={drop.targetMs} targetTimestamp={drop.targetTimestamp} />
                      <div className="text-[9px] font-mono text-white/40 mt-0.5">
                        Handle & CA reveal at launch to protect fair orderflow
                      </div>
                    </div>

                    {/* Creator Token Utility Breakdown */}
                    <div className="space-y-2 mb-3.5">
                      {/* Utility 1: $50 Holder Gate at target MC */}
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[11px] leading-snug">
                        <div className="flex items-center justify-between font-mono text-[10px] text-white/60 mb-0.5">
                          <span className="text-[#d4fc50] font-semibold">Hold ≥ $50 Token</span>
                          <span className="text-white/40">Gate: {drop.targetMcapGate}</span>
                        </div>
                        <p className="text-white/70 text-[10px] font-sans">
                          {drop.holderGatePerk} unlocked automatically on token page.
                        </p>
                      </div>

                      {/* Utility 2: Burn-to-Access */}
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[11px] leading-snug">
                        <div className="flex items-center gap-1 font-mono text-[10px] text-[#ff79c6] font-semibold mb-0.5">
                          <Flame className="w-3 h-3 text-[#ff79c6]" />
                          <span>Burn-to-Access</span>
                        </div>
                        <p className="text-white/70 text-[10px] font-sans">
                          {drop.burnPerk} (burned on-site).
                        </p>
                      </div>
                    </div>

                    {/* Tie-in to $MIKA */}
                    <div className="mb-4 text-[10px] font-mono text-white/40 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
                      <span>50% of launch profit burns $MIKA</span>
                    </div>
                  </div>

                  {/* Whitelist / Alert Action with Instant Tactile Feedback */}
                  <button
                    onClick={() => handleWhitelist(drop.id, drop.dayLabel)}
                    className={`btn-tactile w-full py-2.5 rounded-lg font-mono font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                      isWhitelisted
                        ? "bg-white/10 text-[#d4fc50] border border-[#d4fc50]/30"
                        : "bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10"
                    }`}
                  >
                    {isWhitelisted ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#d4fc50]" />
                        <span>Alert Set</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-white/60" />
                        <span>Notify on Launch</span>
                      </>
                    )}
                  </button>
                </SpotlightCard>
              );
            })}
          </div>

          {/* ========================================================= */}
          {/* 4. THE 4-STEP SCM VALUE LOOP (CLEAN MINIMALIST ARCHITECTURE) */}
          {/* ========================================================= */}
          <div className="mt-8 pt-8 border-t border-white/[0.08]">
            <div className="mb-5">
              <span className="text-[10px] font-mono text-[#d4fc50] uppercase tracking-widest block mb-1">
                Protocol Architecture
              </span>
              <h3 className="text-lg sm:text-xl font-serif text-white">
                How Creator Launches Accrue Value Back to $MIKA
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <SpotlightCard
                className="p-4 rounded-xl bg-black/40 border border-white/[0.08]"
                spotlightColor="rgba(255, 255, 255, 0.04)"
              >
                <div className="text-[10px] font-mono text-[#d4fc50] font-bold mb-1">01 // LAUNCH</div>
                <div className="text-xs font-bold text-white mb-1">Fair Creator Drops</div>
                <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                  Agency models launch on Robinhood Chain with deterministic bonding curves and locked liquidity.
                </p>
              </SpotlightCard>

              <SpotlightCard
                className="p-4 rounded-xl bg-black/40 border border-white/[0.08]"
                spotlightColor="rgba(255, 255, 255, 0.04)"
              >
                <div className="text-[10px] font-mono text-[#d4fc50] font-bold mb-1">02 // UTILITY</div>
                <div className="text-xs font-bold text-white mb-1">Holder Gates & Burns</div>
                <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                  Fans hold $50+ for token-gated content and burn creator coins on-site to unlock rare video rolls.
                </p>
              </SpotlightCard>

              <SpotlightCard
                className="p-4 rounded-xl bg-black/40 border border-white/[0.08]"
                spotlightColor="rgba(255, 255, 255, 0.04)"
              >
                <div className="text-[10px] font-mono text-[#d4fc50] font-bold mb-1">03 // CASHFLOW</div>
                <div className="text-xs font-bold text-white mb-1">Platform Profits</div>
                <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                  Every launch generates platform revenue from trading fees and primary curve completions.
                </p>
              </SpotlightCard>

              <SpotlightCard
                className="p-4 rounded-xl bg-black/40 border border-[#d4fc50]/30"
                spotlightColor="rgba(212, 252, 80, 0.08)"
              >
                <div className="text-[10px] font-mono text-[#d4fc50] font-bold mb-1">04 // 50% BURN SINK</div>
                <div className="text-xs font-bold text-[#d4fc50] mb-1">Permanent $MIKA Burns</div>
                <p className="text-[11px] text-white/80 font-sans leading-relaxed">
                  50% of all launch & platform profits are routed directly on-chain to buy back and burn $MIKA supply.
                </p>
              </SpotlightCard>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default UpcomingDrops;
