import React, { useState, useEffect } from "react";
import {
  Flame,
  ArrowUpRight,
  Clock,
  Copy,
  Check,
  ArrowDown,
} from "lucide-react";
import { JUICY_CONFIG } from "../../constants/juicy";
import TrueFocus from "../react-bits/TrueFocus";
import DecryptedText from "../react-bits/DecryptedText";
import JuicyCityChaseMap from "./JuicyCityChaseMap";

export default function JuicyHero() {
  const [copiedCA, setCopiedCA] = useState(false);

  // Real-time countdown
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.max(0, JUICY_CONFIG.targetTimestamp - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, JUICY_CONFIG.targetTimestamp - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyCA = () => {
    navigator.clipboard.writeText(JUICY_CONFIG.ca);
    setCopiedCA(true);
    setTimeout(() => setCopiedCA(false), 2200);
  };

  return (
    <section
      id="overview"
      className="relative pt-24 sm:pt-28 pb-16 lg:pt-32 lg:pb-20 bg-[#060706] text-[#f4f4f2] overflow-hidden border-b border-white/10"
    >
      {/* Authentic City Map Blueprint with Calm Ambient Chaser Simulation (Treetino style) */}
      <JuicyCityChaseMap />

      <div className="max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">

        {/* 2-Column Hero Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT: PINTEREST STREETWEAR HEADLINE & VALUE PROP */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Pinterest Cursive Handwritten Tag */}
            <div className="mb-2">
              <span className="font-tag text-xl sm:text-3xl text-[#d4fc50] tracking-wider inline-block -rotate-2 drop-shadow-[0_0_12px_rgba(212,252,80,0.5)]">
                RULE THE STREETS
              </span>
            </div>

            {/* Giant Pinterest Urban Code Headline with Animated TrueFocus */}
            <div className="mb-6">
              <h1 className="font-gta text-6xl sm:text-7xl lg:text-[96px] text-white leading-[0.9] tracking-tight uppercase">
                VICE CAPITAL. <br />
                <span className="inline-flex items-center gap-2 mt-1">
                  <TrueFocus
                    sentence="BUILT DIFFERENT."
                    borderColor="#d4fc50"
                    glowColor="rgba(212, 252, 80, 0.7)"
                    blurAmount={5}
                    animationDuration={0.5}
                    pauseBetweenAnimations={1.0}
                  />
                </span>
              </h1>
            </div>

            {/* Subtitle / Syndicate Manifesto */}
            <p className="text-sm sm:text-base text-white/75 max-w-xl leading-relaxed font-sans font-light mb-8 border-l-2 border-[#d4fc50] pl-4">
              Ms Juicy P is taking over Sex Capital Markets on Robinhood Chain L2. Streetwear meets liquidity. <strong className="text-white font-medium">No VCs, no insider cabals. A fair bonding curve backed by an industrial cash incinerator that burns tokens with every drop.</strong>
            </p>

            {/* Tactile Pinterest Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {/* Direct Signature Lime Green CTA Button */}
              <a
                href="#smelter"
                className="btn-tactile px-8 py-4 bg-[#d4fc50] hover:bg-white text-black font-mono font-black text-xs sm:text-sm uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,252,80,0.35)] cursor-pointer"
              >
                <span>ACQUIRE $JUICY</span>
                <ArrowUpRight className="w-4 h-4 text-black font-bold" />
              </a>

              {/* Incinerator CTA */}
              <a
                href="#smelter"
                className="btn-tactile px-6 py-4 border border-white/20 bg-black/60 hover:bg-white/10 text-white font-mono text-xs sm:text-sm uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#ff5e3a]" />
                <span>THE INCINERATOR</span>
              </a>

              {/* Copy Contract Address with DecryptedText */}
              <button
                onClick={handleCopyCA}
                className="btn-tactile px-4 py-4 rounded-lg border border-white/15 bg-black/80 hover:bg-black text-xs font-mono text-white/80 hover:text-white flex items-center gap-2 cursor-pointer"
                title="Copy verified contract address"
              >
                <DecryptedText text="0x1233...72a8" animateOn="hover" speed={25} />
                {copiedCA ? (
                  <Check className="w-3.5 h-3.5 text-[#30d158]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/60" />
                )}
              </button>
            </div>

            {/* Scroll Indicator (Direct from Pinterest: "↓ SCROLL") */}
            <div className="flex items-center gap-2 text-white/40 font-mono text-xs tracking-widest uppercase">
              <ArrowDown className="w-3.5 h-3.5 text-[#d4fc50] animate-bounce" />
              <span>SCROLL TO INCINERATOR & DOSSIERS</span>
            </div>
          </div>

          {/* RIGHT: PINTEREST FLOATING DROP INSET & EDITORIAL DOSSIER */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Pinterest Main Visual Drop Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_25px_60px_rgba(0,0,0,0.95)] group">
              {/* Washi Tape Pin on Top Left */}
              <div
                className="washi-tape -top-3 left-6 -rotate-3"
                title="Evidence Tape Seal"
              />

              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="/juicy/images/juicy_bikini_hero.jpg"
                  alt="Ms Juicy P - Vice City Syndicate"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                {/* Floating GTA Syndicate Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <div className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#ccff00]/60 text-[11px] font-mono font-bold text-[#ccff00] flex items-center gap-1.5 shadow-[0_0_12px_rgba(204,255,0,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                    <span>VERIFIED BOSS</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/80">
                    TOP 0.01%
                  </div>
                </div>

                <a
                  href={JUICY_CONFIG.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-mono text-white hover:text-[#ccff00] transition-colors flex items-center gap-1 z-10"
                >
                  <span>80K+ on X</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>

                {/* Bottom Overlay with Barcode and Inset Drop Card (from Pinterest) */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="p-3 rounded-xl bg-black/85 backdrop-blur-xl border border-white/15 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-3">
                      {/* Mini Thumbnail */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-[#141414]">
                        <img
                          src="/juicy/images/elite.png"
                          alt="Drop Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-[#ccff00]">
                          NEW DROP
                        </div>
                        <div className="text-xs sm:text-sm font-bold font-gta text-white tracking-wider uppercase">
                          "SHADOW TECH" COLLECTION
                        </div>
                        <div className="text-[10px] font-mono text-white/50">
                          Fair Launch · 1,000,000,000 Supply
                        </div>
                      </div>
                    </div>

                    {/* Pinterest Signature Square Neon Plus Button */}
                    <a
                      href="#smelter"
                      className="square-plus-btn shrink-0"
                      title="Inspect Incinerator"
                    >
                      +
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Tactical Syndicate ID Card */}
            <div className="p-3.5 rounded-xl bg-black/70 border border-white/10 flex items-center justify-between text-xs font-mono text-white/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d4fc50]" />
                <span className="text-white font-bold tracking-wider">ROBINHOOD L2 BONDING CURVE</span>
              </div>
              <span className="text-[10px] text-[#d4fc50] uppercase tracking-widest">
                ZERO PRESALE // 100% PUBLIC
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
