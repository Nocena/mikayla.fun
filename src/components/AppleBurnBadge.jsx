import React from "react";
import { BURN_DATA } from "../constants/burn";

export default function AppleBurnBadge({ className = "" }) {
  return (
    <a
      href={BURN_DATA.burnTxUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/burn btn-tactile inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black/95 backdrop-blur-2xl border-t border-white/20 border-x border-b border-white/10 text-xs font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)] hover:border-[#ff453a]/40 hover:shadow-[0_0_16px_rgba(255,69,58,0.15)] transition-all cursor-pointer ${className}`}
      title="Verified Onchain Burn: 16.4M $MIKA (1.64%) on Robinhood Chain Blockscout"
    >
      <span className="relative flex h-1.5 w-1.5 items-center justify-center">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff453a] opacity-60" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff453a] shadow-[0_0_6px_#ff453a]" />
      </span>

      <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.1em] uppercase text-white/90 group-hover/burn:text-white transition-colors flex items-center gap-1">
        <span>BURNED</span>
        <span className="text-[#d4fc50]">{BURN_DATA.totalBurned}</span>
        <span className="text-white/40 text-[9px] font-normal">({BURN_DATA.percentSupply})</span>
      </span>

      <span className="text-[8px] sm:text-[9px] font-mono text-white/30 group-hover/burn:text-[#d4fc50] group-hover/burn:translate-x-0.5 group-hover/burn:-translate-y-0.5 transition-all">
        ↗
      </span>
    </a>
  );
}
