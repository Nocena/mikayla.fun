import React, { useState, useEffect } from "react";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import DecryptedText from "./react-bits/DecryptedText";
import CountUp from "./react-bits/CountUp";

// Calculate countdown to upcoming Friday, Sunday, Tuesday at 20:00 UTC
const calculateTimeRemaining = (targetDayOffset) => {
  const totalSeconds = targetDayOffset * 86400 + 14400; 
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: Math.floor(totalSeconds % 60),
  };
};

const dropsData = [
  {
    id: "aria",
    dropNumber: "DROP 01",
    day: "FRIDAY",
    time: "8:00 PM UTC",
    dayOffset: 2,
    status: "WHITELIST ACTIVE",
    name: "Aria Brooks",
    ticker: "$ARIA",
    image: "/creators/aria.jpg",
    category: "Haute Boudoir & Runway · OF Top 0.05%",
    monthlyRevenue: "$72,000 / mo",
    revenueAudit: "Verified Stripe & OF Escrow",
    secretWhisper: "You want to know what happens when the cameras turn off? Hold my token, burn the key, and find out.",
    burnUtility: "$5 35mm Roll · $10 4K Suite Film · $25 Direct Line",
    cashflowShare: "20% Content Revenue to Holders",
    isFirst: true,
  },
  {
    id: "kira",
    dropNumber: "DROP 02",
    day: "SUNDAY",
    time: "8:00 PM UTC",
    dayOffset: 4,
    status: "LAUNCHES SUNDAY",
    name: "Kira Fox",
    ticker: "$KIRA",
    image: "/creators/kira.jpg",
    category: "Tokyo & Berlin Underground DJ",
    monthlyRevenue: "$58,200 / mo",
    revenueAudit: "Audited Nightlife & Subscriptions",
    secretWhisper: "Tokyo at 4 AM, Berlin at midnight. No PR filters, no fake AI bullshit. Just me in the dark.",
    burnUtility: "$5 Tokyo 35mm Scans · $10 4K Suite Video · $25 Guestlist & Custom PPV",
    cashflowShare: "Private Midnight Drops in USDC",
    isFirst: false,
  },
  {
    id: "luna",
    dropNumber: "DROP 03",
    day: "TUESDAY",
    time: "8:00 PM UTC",
    dayOffset: 6,
    status: "LAUNCHES TUESDAY",
    name: "Luna St. Claire",
    ticker: "$LUNA",
    image: "/creators/luna.jpg",
    category: "Nocturnal Cinema · Fansly Top 0.01%",
    monthlyRevenue: "$94,000 / mo",
    revenueAudit: "Swiss Legal Escrow & Trust",
    secretWhisper: "The velvet room isn't for spectators. When you burn the tokens, the door locks behind you.",
    burnUtility: "$5 Paris 35mm Vault · $10 Nocturnal Film · $25 Private Stream & Key",
    cashflowShare: "25% Backstage PPV Split",
    isFirst: false,
  },
];

const CountdownWidget = ({ dayOffset }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(dayOffset));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(dayOffset));
    }, 1000);
    return () => clearInterval(timer);
  }, [dayOffset]);

  return (
    <div className="flex items-center gap-1.5 font-mono text-center text-xs">
      <div className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 min-w-[36px]">
        <span className="text-xs font-bold text-white block leading-none">{timeLeft.days}</span>
        <span className="text-[8px] text-white/40 uppercase">d</span>
      </div>
      <span className="text-white/30 font-bold">:</span>
      <div className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 min-w-[36px]">
        <span className="text-xs font-bold text-white block leading-none">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="text-[8px] text-white/40 uppercase">h</span>
      </div>
      <span className="text-white/30 font-bold">:</span>
      <div className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 min-w-[36px]">
        <span className="text-xs font-bold text-white block leading-none">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="text-[8px] text-white/40 uppercase">m</span>
      </div>
      <span className="text-white/30 font-bold">:</span>
      <div className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 min-w-[36px]">
        <span className="text-xs font-bold text-[#d4fc50] block leading-none">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="text-[8px] text-[#d4fc50]/60 uppercase">s</span>
      </div>
    </div>
  );
};

const UpcomingDrops = () => {
  const [alertToast, setAlertToast] = useState(null);
  const [activeWhisper, setActiveWhisper] = useState(null);

  const handleAction = (drop) => {
    setAlertToast(`Whitelisted for ${drop.name} (${drop.ticker})! Drop alert sent to your connected wallet.`);
    setTimeout(() => setAlertToast(null), 4000);
  };

  const toggleWhisper = (dropId) => {
    setActiveWhisper(activeWhisper === dropId ? null : dropId);
  };

  return (
    <section id="upcoming-drops" className="relative py-24 lg:py-32 bg-[#080908] border-t border-white/10 overflow-hidden">
      {/* Clean ambient glow consistent with Hero */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#d4fc50]/[0.03] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-pulse" />
            <ShinyText
              text="CURATED CREATOR DROPS · ROBINHOOD CHAIN"
              className="text-xs font-mono uppercase tracking-widest text-[#d4fc50]"
              speed={3}
            />
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
            Upcoming Creator Launches
          </h2>

          <p className="text-white/60 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed font-sans">
            Selective, verified human creator tokens. Every drop undergoes institutional identity due diligence,
            12-month revenue audits, and locked LP covenants on Robinhood Chain L2.
          </p>
        </div>

        {/* Toast Feedback */}
        {alertToast && (
          <div className="mb-8 max-w-xl mx-auto p-3.5 rounded-2xl bg-[#d4fc50]/15 border border-[#d4fc50]/40 text-xs font-mono text-[#d4fc50] flex items-center justify-between animate-fadeIn shadow-xl">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-ping" />
              {alertToast}
            </span>
            <span className="text-white/50 text-[11px]">Robinhood L2 Priority</span>
          </div>
        )}

        {/* 3-Card Editorial Drops Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {dropsData.map((drop) => (
            <SpotlightCard
              key={drop.id}
              className={`relative min-h-[690px] h-full p-6 sm:p-8 flex flex-col justify-between overflow-hidden group border transition-all duration-500 ${
                drop.isFirst
                  ? "border-[#d4fc50]/40 shadow-2xl shadow-[#d4fc50]/10 bg-[#0a0c0a]"
                  : "border-white/10 hover:border-[#d4fc50]/30 bg-[#0a0c0a]"
              }`}
              spotlightColor="rgba(212, 252, 80, 0.15)"
            >
              {/* Big Editorial Photographic Background with Veily Translucent Overlay */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                  src={drop.image}
                  alt={drop.name}
                  className="w-full h-full object-cover object-top filter brightness-[0.7] contrast-[1.08] saturate-[0.9] group-hover:scale-105 group-hover:brightness-[0.82] transition-all duration-700 ease-out"
                />
                {/* Smoky Veily Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070907] via-[#070907]/80 to-[#070907]/25 backdrop-blur-[1.5px] group-hover:backdrop-blur-none transition-all duration-700" />
                {/* Subtle Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,252,80,0.12)_0%,transparent_65%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* TOP: Date Tag & Status Pill (Floating over the veil) */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                    {drop.dropNumber} · {drop.day} {drop.time}
                  </span>
                </div>

                <span className="text-[10px] font-mono px-3 py-1 rounded-full border border-white/15 bg-black/60 text-[#d4fc50] font-bold backdrop-blur-md">
                  {drop.status}
                </span>
              </div>

              {/* MIDDLE: Atmospheric Gaze & Sleek Audio Whisper Pill */}
              <div className="relative z-10 my-auto py-6">
                {/* Sleek Horizontal Audio Whisper Pill */}
                <div className="max-w-sm">
                  <button
                    type="button"
                    onClick={() => toggleWhisper(drop.id)}
                    className="w-full p-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/15 hover:border-[#d4fc50]/40 backdrop-blur-xl flex items-center justify-between text-xs font-mono transition-all group/btn shadow-xl"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${activeWhisper === drop.id ? 'bg-[#d4fc50] text-black shadow-md shadow-[#d4fc50]/30' : 'bg-white/10 text-white group-hover/btn:bg-[#d4fc50] group-hover/btn:text-black'}`}>
                        {activeWhisper === drop.id ? (
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                      </div>
                      <span className="text-white/80 group-hover/btn:text-white text-xs">
                        {activeWhisper === drop.id ? "Playing Voice Memo..." : "Private Whisper Memo"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 h-3 mr-1">
                      {[40, 85, 55, 95, 45, 75].map((h, idx) => (
                        <span
                          key={idx}
                          className={`w-0.5 bg-[#d4fc50] rounded-full transition-all duration-300 ${activeWhisper === drop.id ? 'animate-pulse' : 'opacity-40'}`}
                          style={{ height: activeWhisper === drop.id ? `${h}%` : '35%' }}
                        />
                      ))}
                    </div>
                  </button>

                  {/* Unfurled Whisper Quote */}
                  {activeWhisper === drop.id && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-black/80 border border-[#d4fc50]/30 text-xs font-mono text-[#d4fc50] animate-fadeIn leading-relaxed italic backdrop-blur-2xl shadow-2xl">
                      "{drop.secretWhisper}"
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM: Clean Editorial Profile, Burn Utility, and Action */}
              <div className="relative z-10 space-y-4">
                {/* Creator Title & Verified Cashflow */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight font-medium">
                      {drop.name}
                    </h3>
                    <span className="text-xs font-mono text-[#d4fc50] bg-[#d4fc50]/10 px-2.5 py-1 rounded-full border border-[#d4fc50]/30 font-bold shrink-0">
                      <DecryptedText text={drop.ticker} speed={30} className="text-[#d4fc50]" />
                    </span>
                  </div>

                  <p className="text-xs font-mono text-white/60 mb-2">{drop.category}</p>

                  <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    <span>Audited Net Cashflow: <strong className="text-white">{drop.monthlyRevenue}</strong></span>
                  </div>
                </div>

                {/* Clean Frosted Burn Utility Capsule */}
                <div className="p-3 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-white/40 mb-1">
                    <span className="font-bold text-white/60">Burn Utility Sinks</span>
                    <span className="text-[#d4fc50] font-bold">$5 · $10 · $25</span>
                  </div>
                  <p className="text-xs font-mono text-white/80 leading-snug">
                    {drop.burnUtility}
                  </p>
                </div>

                {/* Countdown and Action Row */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                  <CountdownWidget dayOffset={drop.dayOffset} />

                  <button
                    type="button"
                    onClick={() => handleAction(drop)}
                    className={`flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg ${
                      drop.isFirst
                        ? "bg-[#d4fc50] hover:bg-[#e4ff75] text-black shadow-[#d4fc50]/20 hover:scale-[1.02]"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                    }`}
                  >
                    <span>{drop.isFirst ? "Join Whitelist" : "Set Reminder"}</span>
                    <span className="font-mono">→</span>
                  </button>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Due Diligence & Curation Guarantee Bar */}
        <div className="p-6 rounded-3xl bg-[#0b0d0b] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#d4fc50]/15 border border-[#d4fc50]/30 flex items-center justify-center text-[#d4fc50] font-bold text-xs shrink-0 font-mono">
              KYC
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono">
                Institutional Due Diligence (No Public Unverified Launches)
              </h4>
              <p className="text-xs text-white/60 font-sans mt-0.5">
                We accept &lt;2% of creator applications. All creators submit legal identity verification, 12-month bank/escrow revenue statements, and multi-year smart contract exclusivity lockups.
              </p>
            </div>
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-launch-modal"))}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-white hover:text-[#d4fc50] transition-all shrink-0"
          >
            Apply for Next Cohort →
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingDrops;
