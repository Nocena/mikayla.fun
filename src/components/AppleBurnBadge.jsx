import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BURN_DATA } from "../constants/burn";

export default function AppleBurnBadge({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on click outside or Esc key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Minimalist Apple-Grade Monochrome Glass Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group btn-tactile inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black/95 backdrop-blur-2xl border-t border-white/20 border-x border-b border-white/10 text-xs font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)] hover:border-white/30 transition-all cursor-pointer select-none"
        title="View protocol burn ledger & upcoming schedule"
        aria-expanded={isOpen}
      >
        {/* Muted White Ember */}
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors" />

        {/* Burned Amount */}
        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/50">
          Burned
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold text-white">
          {BURN_DATA.totalBurned}
        </span>
        <span className="text-[9px] sm:text-[10px] text-white/40">
          ({BURN_DATA.percentSupply})
        </span>

        {/* Hairline Divider */}
        <span className="w-[1px] h-2.5 bg-white/10 hidden xs:inline-block" />

        {/* Status / Next Burns Note */}
        <span className="text-[9px] sm:text-[10px] text-white/40 group-hover:text-white/70 transition-colors hidden xs:inline-block">
          {BURN_DATA.statusNote}
        </span>

        {/* Subtle Disclosure Glyph */}
        <span className={`text-[9px] font-mono text-white/30 group-hover:text-white transition-transform duration-200 ${isOpen ? "rotate-180 text-white" : ""}`}>
          ▾
        </span>
      </button>

      {/* Anchored Popover (Apple Spring Motion & Material) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-84 p-4 rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-white/20 border-x border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                  Protocol Burn Ledger
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-5 h-5 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-xs cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Hero Metric */}
            <div className="py-3">
              <div className="text-[10px] font-mono uppercase text-white/40 mb-1">
                Total Supply Burned
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold text-white tracking-tight">
                  {BURN_DATA.totalBurned}
                </span>
                <span className="text-xs font-mono text-white/50">
                  / 1,000,000,000
                </span>
                <span className="text-xs font-mono text-white/40">
                  ({BURN_DATA.percentSupply})
                </span>
              </div>
              <div className="text-[10px] font-mono text-white/40 mt-1">
                Remaining Circulating: {BURN_DATA.totalSupplyRemaining} $MIKA
              </div>
            </div>

            {/* Mechanism Note */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 mb-3 text-[11px] font-sans font-light text-white/60 leading-relaxed">
              <strong className="text-white font-medium">50% of platform profits</strong> from every creator launch and secondary trade are permanently routed onchain to buy back and burn $MIKA supply.
            </div>

            {/* Verified Burns History */}
            <div className="mb-3">
              <div className="text-[9px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
                Verified Onchain Burns
              </div>
              <div className="space-y-1.5">
                {BURN_DATA.burns.map((burn) => (
                  <a
                    key={burn.id}
                    href={burn.txUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/[0.05] border border-white/5 hover:border-white/15 transition-all text-xs font-mono group/item cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span className="text-white/80 font-medium">{burn.amount}</span>
                      <span className="text-[10px] text-white/40">({burn.ethSpent})</span>
                    </div>
                    <span className="text-[10px] text-white/30 group-hover/item:text-white transition-colors flex items-center gap-0.5">
                      Verify ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Upcoming Burns Schedule */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-[9px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
                Upcoming Drops & Burns
              </div>
              <div className="space-y-1">
                {BURN_DATA.upcomingBurns.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-[10px] font-mono py-0.5"
                  >
                    <span className="text-white/70">{item.drop}</span>
                    <span className="text-white/40">{item.schedule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer External Link */}
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
              <a
                href={BURN_DATA.burnTxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Latest Tx on Blockscout</span>
                <span>↗</span>
              </a>
              <span className="text-white/30">Robinhood L2</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
