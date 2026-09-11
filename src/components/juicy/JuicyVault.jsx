import React, { useState, useEffect } from "react";
import { Lock, ArrowUpRight, Globe } from "lucide-react";
import { JUICY_CONFIG } from "../../constants/juicy";

export default function JuicyVault() {
  // Countdown for the Limited Release Torn Paper Box
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "03",
    mins: "57",
    secs: "16",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.max(0, JUICY_CONFIG.targetTimestamp - Date.now());
      setCountdown({
        days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
        hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
        mins: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0"),
        secs: String(Math.floor((diff / 1000) % 60)).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="vault"
      className="relative py-24 lg:py-32 bg-[#060706] border-t border-white/10 overflow-hidden"
    >
      {/* Background Gritty Ambiance */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-[#d4fc50]/10 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-grunge-pattern" />
      </div>

      <div className="max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
        {/* Section Header with Graffiti Spray Underline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4fc50]/10 border border-[#d4fc50]/30 mb-3 font-mono text-xs uppercase tracking-widest text-[#d4fc50]">
              <Lock className="w-3.5 h-3.5" />
              <span>LIMITED MERCH DROP // CAPSULE 01</span>
            </div>
            <h2 className="font-gta text-5xl sm:text-7xl text-white tracking-tight leading-none uppercase">
              SYNDICATE <span className="spray-underline">PASS</span>
            </h2>
            <p className="text-white/60 text-xs sm:text-sm mt-3 max-w-xl font-sans font-light leading-relaxed">
              Physical streetwear capsule and verified on-chain syndicate credentials. Worn in the street, verified on Robinhood L2.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-white/60 bg-black/60 px-3.5 py-2 rounded-xl border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse" />
            <span>Limited Run · 50 Physical Passes Worldwide</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PINTEREST SHOWPIECE: TORN PAPER LIMITED RELEASE CARD (Direct User Favorite) */}
        {/* ========================================================================= */}
        <div className="rounded-3xl overflow-hidden border border-white/15 bg-black shadow-[0_25px_60px_rgba(0,0,0,0.9)] grid grid-cols-1 lg:grid-cols-12 relative group">
          {/* LEFT SIDE: Authentic Torn White Paper Dossier */}
          <div className="lg:col-span-6 bg-[#f7f7f5] text-black p-8 sm:p-12 relative flex flex-col justify-between torn-paper-edge-r z-20 shadow-[10px_0_30px_rgba(0,0,0,0.4)]">
            <div>
              {/* Angled Neon Marker Badge */}
              <div className="inline-block bg-[#d4fc50] text-black px-3 py-1 text-xs font-mono font-black uppercase tracking-widest -rotate-2 mb-4 shadow-sm">
                LIMITED RELEASE
              </div>

              {/* Heavy Bold Condensed Title */}
              <h3 className="font-gta text-5xl sm:text-7xl text-black tracking-tight leading-[0.9] uppercase mb-3">
                SHADOW TECH <br />
                <span className="text-black/70">SYNDICATE PASS</span>
              </h3>

              <p className="text-xs sm:text-sm text-black/70 font-sans font-normal leading-relaxed mb-6 max-w-md">
                Engineered for the cartel. Worn in the now. Holders gain exclusive VIP guestlist to secret Miami events, unreleased footage, and direct syndicate access with Ms Juicy P.
              </p>

              {/* 4 Pitch Black Countdown Blocks (Exact Pinterest Replica) */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mb-8 font-mono text-center">
                <div className="p-2 sm:p-3 rounded-xl bg-black text-white shadow-md">
                  <div className="text-2xl sm:text-3xl font-bold font-gta tracking-wider text-white">
                    {countdown.days}
                  </div>
                  <div className="text-[8px] uppercase tracking-widest text-white/50">DAYS</div>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-black text-white shadow-md">
                  <div className="text-2xl sm:text-3xl font-bold font-gta tracking-wider text-white">
                    {countdown.hours}
                  </div>
                  <div className="text-[8px] uppercase tracking-widest text-white/50">HRS</div>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-black text-white shadow-md">
                  <div className="text-2xl sm:text-3xl font-bold font-gta tracking-wider text-white">
                    {countdown.mins}
                  </div>
                  <div className="text-[8px] uppercase tracking-widest text-white/50">MINS</div>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-black text-[#d4fc50] border border-[#d4fc50]/40 shadow-md">
                  <div className="text-2xl sm:text-3xl font-bold font-gta tracking-wider text-[#d4fc50] animate-pulse">
                    {countdown.secs}
                  </div>
                  <div className="text-[8px] uppercase tracking-widest text-[#d4fc50]/80">SECS</div>
                </div>
              </div>
            </div>

            {/* Neon Volt Yellow Button */}
            <a
              href="#smelter"
              className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#d4fc50] hover:bg-black hover:text-[#d4fc50] text-black font-mono font-black text-xs uppercase tracking-widest rounded-lg shadow-md transition-all cursor-pointer"
            >
              <span>BURN IN INCINERATOR TO ACQUIRE</span>
              <ArrowUpRight className="w-4 h-4 font-bold" />
            </a>
          </div>

          {/* RIGHT SIDE: Pitch Black Technical Showcase with Wireframe & Serrated Sticker */}
          <div className="lg:col-span-6 bg-[#090a09] relative p-8 sm:p-12 flex items-center justify-center overflow-hidden">
            {/* Subtle Wireframe Globe & Vector Grid (from Pinterest) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center">
              <Globe className="w-96 h-96 text-white stroke-[0.5]" />
            </div>

            {/* Product Photography / Censored Evidence Photo */}
            <div className="relative z-10 max-w-md w-full select-none">
              <div
                onContextMenu={(e) => e.preventDefault()}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl group-hover:border-[#d4fc50]/50 transition-colors"
              >
                <img
                  src="/juicy/images/juicy_syndicate_pass_censored.jpg"
                  alt="Shadow Tech Contraband Pass"
                  draggable="false"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-125 select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Direct Pinterest Serrated Neon Yellow Badge: "ONLY 50 PASSES" */}
            <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-24 h-24 sm:w-28 sm:h-28 serrated-badge z-30 shadow-2xl p-2 cursor-pointer">
              <span className="text-[10px] sm:text-xs tracking-widest font-mono font-bold uppercase">
                ONLY
              </span>
              <span className="text-3xl sm:text-4xl font-black font-gta leading-none">
                50
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest font-mono font-bold uppercase">
                PASSES
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
