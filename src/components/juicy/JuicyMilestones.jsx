import React, { useState } from "react";
import {
  Lock,
  Flame,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  X,
  Eye,
  ArrowUpRight,
  Shield,
} from "lucide-react";
import { JUICY_MILESTONES, JUICY_CONFIG } from "../../constants/juicy";

export default function JuicyMilestones() {
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  return (
    <section
      id="milestones"
      className="relative py-20 lg:py-28 bg-[#050605] border-t border-white/10 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#d4fc50]/10 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-grunge-pattern" />
      </div>

      <div className="max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
        {/* Section Header (Clean Badbitch Style - Direct & Straightforward) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4fc50]/10 border border-[#d4fc50]/30 mb-3 font-mono text-xs uppercase tracking-widest text-[#d4fc50]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MARKET CAP TIMELINE // EXCLUSIVE HOLDER DROPS</span>
            </div>

            <h2 className="font-gta text-4xl sm:text-6xl text-white tracking-tight leading-none uppercase">
              MARKET CAP <span className="spray-underline">DROPS</span>
            </h2>

            <p className="text-white/70 text-xs sm:text-sm mt-3 max-w-2xl font-sans font-light leading-relaxed">
              When the market cap reaches each milestone in the coming days, Ms Juicy P drops this new fresh content exclusively for token holders.
            </p>
          </div>

          {/* Access Requirement Box */}
          <div className="p-4 rounded-2xl bg-[#0a0c0a] border border-white/15 font-mono text-xs backdrop-blur-md max-w-md">
            <div className="flex items-center gap-2 text-[#d4fc50] font-bold uppercase mb-1">
              <Lock className="w-3.5 h-3.5 text-[#d4fc50]" />
              <span>Holder Gate Rule</span>
            </div>
            <p className="text-white/70 text-[11px] leading-relaxed font-sans">
              Must hold <span className="text-white font-bold">&gt; $50 USD</span> worth of <span className="text-[#d4fc50] font-bold">$JUICY</span> tokens to view each drop. Zero tokens spent.
            </p>
          </div>
        </div>

        {/* 4 Clean Milestone Cards Grid (100k, 200k, 500k, 1M) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {JUICY_MILESTONES.map((m) => {
            return (
              <div
                key={m.phase}
                onClick={() => setSelectedMilestone(m)}
                className={`rounded-2xl bg-[#090b09] border flex flex-col justify-between transition-all duration-300 relative group p-5 shadow-xl cursor-pointer ${
                  m.active
                    ? "border-[#d4fc50]/50 shadow-[0_0_30px_rgba(212,252,80,0.15)] hover:border-[#d4fc50]"
                    : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
                }`}
              >
                <div>
                  {/* Top Target Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-gta text-3xl sm:text-4xl text-white tracking-tight font-bold">
                        {m.mcTarget}
                      </span>
                      <span className="font-mono text-xs text-white/40 uppercase">MC</span>
                    </div>

                    <span
                      className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${m.statusBadge}`}
                    >
                      {m.status}
                    </span>
                  </div>

                  {/* Thumbnail with Lock Overlay */}
                  <div className="relative aspect-[16/11] rounded-xl overflow-hidden mb-4 bg-black border border-white/10 group-hover:border-white/20 transition-colors">
                    <img
                      src={m.thumbnail}
                      alt={m.title}
                      className="w-full h-full object-cover filter blur-[4px] brightness-70 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Lock Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-white/90">
                      <Lock className="w-3 h-3 text-[#d4fc50]" />
                      <span>HOLD &gt; $50 USD</span>
                    </div>

                    {/* Media Tag */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                        {m.format}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:bg-[#d4fc50] group-hover:text-black transition-colors font-bold">
                        +
                      </span>
                    </div>
                  </div>

                  {/* Drop Title & Description */}
                  <div className="mb-4">
                    <div className="text-[10px] font-mono text-[#d4fc50] uppercase tracking-wider mb-1 font-bold">
                      {m.tag}
                    </div>
                    <h3 className="font-gta text-2xl text-white tracking-wide uppercase mb-2">
                      {m.title}
                    </h3>
                    <p className="text-xs text-white/60 font-sans font-light leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>

                {/* Footer Requirement & Action */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-mono mb-3">
                    <span className="text-white/40">ACCESS REQUIREMENT</span>
                    <span className="text-[#d4fc50] font-bold">&gt; $50 USD of $JUICY</span>
                  </div>

                  {m.active ? (
                    <div className="w-full py-2.5 rounded-xl bg-[#d4fc50] text-black font-mono text-xs font-bold uppercase text-center flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,252,80,0.3)]">
                      <Flame className="w-3.5 h-3.5 fill-black" />
                      <span>UNLOCKED AT {m.mcTarget} MC</span>
                    </div>
                  ) : (
                    <div className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 font-mono text-xs font-medium uppercase text-center flex items-center justify-center gap-1.5">
                      <Lock className="w-3 h-3 text-white/40" />
                      <span>LOCKED UNTIL {m.mcTarget}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal View for Milestone Drop Details */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0c0e0c] border border-white/20 p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#d4fc50]/15 text-[#d4fc50] border border-[#d4fc50]/30 font-mono text-xs font-bold uppercase">
                  {selectedMilestone.tag}
                </span>
                <span className="font-mono text-xs text-white/60">
                  Target: {selectedMilestone.mcFull}
                </span>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-black border border-white/15">
              <img
                src={selectedMilestone.thumbnail}
                alt={selectedMilestone.title}
                className="w-full h-full object-cover filter blur-[3px] brightness-75"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center p-4">
                <div className="w-12 h-12 rounded-full bg-black/80 border border-white/20 flex items-center justify-center mb-2 shadow-lg">
                  <Lock className="w-5 h-5 text-[#d4fc50]" />
                </div>
                <div className="font-gta text-2xl text-white tracking-wider uppercase">
                  {selectedMilestone.title}
                </div>
                <div className="text-xs font-mono text-[#d4fc50] mt-1">
                  DROPS AT {selectedMilestone.mcFull}
                </div>
              </div>
            </div>

            {/* Description & Rules */}
            <div className="space-y-3 mb-6 font-sans">
              <p className="text-sm text-white/80 leading-relaxed">
                {selectedMilestone.description}
              </p>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs space-y-1.5">
                <div className="flex justify-between items-center text-white/50">
                  <span>Format:</span>
                  <span className="text-white font-medium">{selectedMilestone.format}</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Required Holding:</span>
                  <span className="text-[#d4fc50] font-bold">&gt; $50 USD of $JUICY</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Tokens Spent:</span>
                  <span className="text-[#30d158] font-bold">0 Tokens (Hold Gate Only)</span>
                </div>
              </div>
            </div>

            {/* Close / Action Button */}
            <button
              onClick={() => setSelectedMilestone(null)}
              className="btn-tactile w-full py-3 rounded-xl bg-[#d4fc50] hover:bg-white text-black font-gta text-lg uppercase tracking-wider text-center cursor-pointer transition-all shadow-[0_0_20px_rgba(212,252,80,0.3)]"
            >
              GOT IT // RETURN TO TIMELINE
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
