import React from "react";

const MARQUEE_ITEMS = [
  "WORLDWIDE SYNDICATE",
  "ZERO MEV FRONT-RUNNING",
  "50% PROFIT INCINERATOR TORCH",
  "ROBINHOOD CHAIN L2",
  "UNTOUCHABLE SOLVENCY",
  "NO VC PRE-ALLOCATIONS",
  "PERMANENT SUPPLY DEFLATION",
  "BUILT DIFFERENT",
  "FAIR BONDING CURVE",
  "ANTI-SNIPER EMBARGO",
];

export default function JuicyMarquee({ speed = 25, reverse = false }) {
  const repeated = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="relative w-full overflow-hidden bg-black py-3.5 border-y border-white/15 select-none z-20 group">
      {/* Subtle edge fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div
        className={`flex whitespace-nowrap items-center font-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-bold text-white group-hover:[animation-play-state:paused] ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
        style={{ animationDuration: `${speed}s` }}
      >
        {repeated.map((item, idx) => (
          <span key={idx} className="inline-flex items-center">
            <span className="hover:text-[#d4fc50] transition-colors cursor-default px-4">
              {item}
            </span>
            <span className="text-[#d4fc50] font-black text-base px-2 animate-pulse">
              +
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
