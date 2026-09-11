import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Clock, X, Flame, Check } from "lucide-react";
import ShinyText from "./react-bits/ShinyText";

// Target launch: Friday, September 11, 2026 at 17:00:00 UTC
const getTargetTimestamp = () => {
  const primaryTarget = new Date("2026-09-11T17:00:00Z").getTime();
  if (Date.now() < primaryTarget) return primaryTarget;

  // Resilient fallback for subsequent weeks: next upcoming Friday at 17:00 UTC
  const now = new Date();
  const nextFriday = new Date();
  const day = now.getUTCDay();
  const diffDays = (5 + 7 - day) % 7 || 7;
  nextFriday.setUTCDate(now.getUTCDate() + diffDays);
  nextFriday.setUTCHours(17, 0, 0, 0);
  return nextFriday.getTime();
};

const LaunchCountdownBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [targetTime] = useState(getTargetTimestamp);
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.max(0, targetTime - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      totalMs: diff,
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
        totalMs: diff,
      });
    };

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (!isVisible) return null;

  const scrollToDrop = (e) => {
    e.preventDefault();
    const element = document.getElementById("upcoming-drops");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full relative z-50 bg-[#060606]/95 backdrop-blur-2xl border-b border-[#d4fc50]/30 shadow-[0_4px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(212,252,80,0.08)] transition-all">
      {/* Specular light catch line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4fc50]/40 to-transparent" />

      <div className="max-w-[92rem] mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs">
        {/* Left: Creator Badge & Tagline */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            {/* Creator Avatar with Lime Glow Ring */}
            <div className="relative shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#d4fc50]/60 shadow-[0_0_10px_rgba(212,252,80,0.3)] bg-black">
                <img
                  src="/creators/msjuicy.jpg"
                  alt="Ms Juicy P"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/creators/aria.jpg";
                  }}
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#30d158] border-2 border-[#080808] animate-pulse" />
            </div>

            {/* Announcement Brand Tagline */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
              <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] tracking-wider uppercase">
                <span className="px-1.5 py-0.5 rounded bg-[#d4fc50]/15 text-[#d4fc50] border border-[#d4fc50]/30 font-bold">
                  Next Drop
                </span>
                <span className="text-white/60 font-semibold hidden xs:inline">
                  Mikayla Launchpad Presents:
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href="https://x.com/msjuicy_plenty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-white hover:text-[#d4fc50] transition-colors font-sans text-xs sm:text-sm flex items-center gap-1 group/name"
                >
                  <span>Ms Juicy P</span>
                  <span className="text-[10px] text-[#30d158] font-bold">✓</span>
                  <span className="text-[9px] font-mono text-white/40 group-hover/name:text-[#d4fc50]">
                    (@msjuicy_plenty)
                  </span>
                </a>
                <span className="text-[10px] font-mono font-bold text-[#d4fc50] px-1.5 py-0.5 rounded bg-black/60 border border-[#d4fc50]/30">
                  $JUICY
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Right Quick Action */}
          <button
            onClick={scrollToDrop}
            className="md:hidden btn-tactile text-[10px] font-mono font-bold px-2 py-1 rounded bg-[#d4fc50] text-black shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>Drop</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Center: Live Real-Time Countdown */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-center">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 uppercase tracking-wider hidden lg:flex">
            <Clock className="w-3.5 h-3.5 text-[#d4fc50] animate-spin-slow" />
            <span>Launch T-Minus:</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 font-mono">
            {/* Days */}
            <div className="flex flex-col items-center bg-black/70 border border-white/10 px-2 py-0.5 rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] min-w-[32px] sm:min-w-[36px]">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[8px] text-white/40 uppercase">Days</span>
            </div>
            <span className="text-white/30 text-xs font-bold">:</span>

            {/* Hours */}
            <div className="flex flex-col items-center bg-black/70 border border-white/10 px-2 py-0.5 rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] min-w-[32px] sm:min-w-[36px]">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[8px] text-white/40 uppercase">Hrs</span>
            </div>
            <span className="text-white/30 text-xs font-bold">:</span>

            {/* Mins */}
            <div className="flex flex-col items-center bg-black/70 border border-white/10 px-2 py-0.5 rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] min-w-[32px] sm:min-w-[36px]">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[8px] text-white/40 uppercase">Min</span>
            </div>
            <span className="text-white/30 text-xs font-bold">:</span>

            {/* Secs */}
            <div className="flex flex-col items-center bg-black/70 border border-[#d4fc50]/40 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(212,252,80,0.15)] min-w-[32px] sm:min-w-[36px]">
              <span className="text-xs sm:text-sm font-bold text-[#d4fc50] tracking-wider">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[8px] text-[#d4fc50]/70 uppercase">Sec</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-white/60 hidden sm:inline-flex items-center gap-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
            <span>Friday 5:00 PM UTC</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-2.5 font-mono text-xs">
          {/* 50% Profit Burn Tag */}
          <div className="hidden xl:flex items-center gap-1.5 text-[10px] text-white/60 px-2 py-1 rounded-md bg-white/[0.04] border border-white/10">
            <Flame className="w-3 h-3 text-white/40" />
            <span>50% Profit Burns $MIKA</span>
          </div>

          {/* View Drop CTA */}
          <button
            onClick={scrollToDrop}
            className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4fc50] hover:bg-white text-black font-bold text-[11px] uppercase tracking-wider shadow-[0_0_16px_rgba(212,252,80,0.3)] cursor-pointer transition-all"
          >
            <span>View Drop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Dismiss button */}
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss banner"
            className="icon-tactile w-6 h-6 flex items-center justify-center rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaunchCountdownBanner;
