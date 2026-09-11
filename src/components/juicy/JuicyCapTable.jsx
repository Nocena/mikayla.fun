import React, { useState } from "react";
import { PieChart as PieIcon, ShieldCheck, Flame, ArrowUpRight, Copy, Check } from "lucide-react";
import { JUICY_CAP_TABLE, JUICY_CONFIG } from "../../constants/juicy";
import SpotlightCard from "../react-bits/SpotlightCard";

const ALLOCATION_TAGS = [
  "100% CIRCULATING // NO TAX",
  "VESTED & LOCKED IN VAULT",
  "PERMANENT BURN ON GRADUATION",
  "MERKLE AIRDROP FOR $MIKA",
  "BURN POOL TORCH MATCH",
];

export default function JuicyCapTable() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const activeItem = JUICY_CAP_TABLE[activeIndex] || JUICY_CAP_TABLE[0];

  const handleCopyCA = () => {
    navigator.clipboard.writeText(JUICY_CONFIG.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  let cumulativePercentage = 0;

  return (
    <section
      id="cap-table"
      className="relative py-24 lg:py-32 bg-[#050605] border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 mb-3 font-mono text-xs uppercase tracking-widest text-[#ccff00]">
              <PieIcon className="w-3.5 h-3.5" />
              <span>SYNDICATE CAP TABLE // ON-CHAIN AUDIT</span>
            </div>
            <h2 className="font-gta text-5xl sm:text-7xl text-white tracking-tight leading-none uppercase">
              TOKENOMICS // <span className="spray-underline">ALLOCATION</span>
            </h2>
            <p className="text-white/60 text-xs sm:text-sm mt-3 max-w-xl font-sans font-light leading-relaxed">
              1,000,000,000 fixed supply on Robinhood Chain L2. Zero VC unlocks, zero covert insider allocations, and a dedicated 100M token airdrop for verified $MIKA holders.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-white/50 bg-black/60 px-3.5 py-2 rounded-xl border border-white/10">
            <span>Total Supply: </span>
            <strong className="text-white">1,000,000,000 $JUICY</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          {/* LEFT: BLUEPRINT DONUT CHART CARD */}
          <SpotlightCard
            spotlightColor="rgba(204, 255, 0, 0.12)"
            className="lg:col-span-5 p-6 sm:p-8 rounded-3xl !bg-black/95 !border-white/20 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden"
          >
            {/* Washi Tape Pin */}
            <div className="washi-tape -top-3.5 left-1/2 -translate-x-1/2 rotate-1" />

            {/* Manila Evidence Docket Header Banner */}
            <div className="evidence-docket-header -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 px-6 py-2.5 font-mono text-[10px] font-bold tracking-widest flex items-center justify-between border-b border-black/20 w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)]">
              <span className="text-black uppercase">
                CAP TABLE BLUEPRINT // L2
              </span>
              <span className="rubber-stamp-green text-[8px] py-0 px-1.5">
                VERIFIED L2
              </span>
            </div>

            <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[340px] mx-auto my-2">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl overflow-visible">
                {JUICY_CAP_TABLE.map((item, index) => {
                  const percentage = item.percentage;
                  const startAngle = (cumulativePercentage / 100) * 360;
                  const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
                  cumulativePercentage += percentage;

                  const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                  const endAngleRad = (endAngle - 90) * (Math.PI / 180);

                  const isHovered = activeIndex === index;
                  const outerRadius = isHovered ? 88 : 82;
                  const innerRadius = isHovered ? 48 : 52;

                  const x1 = 100 + outerRadius * Math.cos(startAngleRad);
                  const y1 = 100 + outerRadius * Math.sin(startAngleRad);
                  const x2 = 100 + outerRadius * Math.cos(endAngleRad);
                  const y2 = 100 + outerRadius * Math.sin(endAngleRad);
                  const x3 = 100 + innerRadius * Math.cos(endAngleRad);
                  const y3 = 100 + innerRadius * Math.sin(endAngleRad);
                  const x4 = 100 + innerRadius * Math.cos(startAngleRad);
                  const y4 = 100 + innerRadius * Math.sin(startAngleRad);

                  const largeArcFlag = percentage > 50 ? 1 : 0;
                  const pathData = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;

                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={item.color}
                      stroke="#050605"
                      strokeWidth="2.5"
                      className="cursor-pointer transition-all duration-300 origin-center"
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 10px ${item.color})` : "none",
                      }}
                      opacity={activeIndex === null || isHovered ? 1 : 0.4}
                      onMouseEnter={() => setActiveIndex(index)}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Hub */}
              <div className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#0d0f0d] border border-white/15 flex flex-col items-center justify-center pointer-events-none text-center shadow-2xl">
                <span className="text-[10px] font-mono uppercase text-white/50">
                  {activeItem.name.split(" ")[0]}
                </span>
                <strong className="text-xl sm:text-2xl font-bold font-gta text-white tracking-wider">
                  {activeItem.percentage}%
                </strong>
                <span className="text-[9px] font-mono text-[#ccff00]">$JUICY</span>
              </div>
            </div>

            <div className="w-full mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Token Standard:</span>
              <span className="text-[#ccff00] font-bold">ERC-20 (Robinhood L2)</span>
            </div>
          </SpotlightCard>

          {/* RIGHT: ALLOCATION BREAKDOWN CARDS */}
          <div className="lg:col-span-7 space-y-3">
            {JUICY_CAP_TABLE.map((item, index) => {
              const isSelected = activeIndex === index;
              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between relative overflow-hidden group ${
                    isSelected
                      ? "bg-[#0f120f] border-[#ccff00] shadow-[0_0_25px_rgba(204,255,0,0.25)]"
                      : "bg-[#090b09] border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Left Yellow Accent Bar on Hover/Select */}
                  {isSelected && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#ccff00] rounded-r shadow-[0_0_8px_#ccff00]" />
                  )}

                  <div className="flex items-center gap-3.5 pl-1.5">
                    <span className="text-xs font-mono font-bold text-white/30 group-hover:text-white/60">
                      0{index + 1}
                    </span>
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-gta text-xl text-white tracking-wider uppercase">
                          {item.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-white/60">
                          {ALLOCATION_TAGS[index]}
                        </span>
                      </div>
                      <div className="text-xs text-white/50 font-sans font-light">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-gta text-2xl font-bold text-white tracking-wider">
                      {item.percentage}%
                    </div>
                    <div className="text-[11px] font-mono text-[#ccff00]">
                      {item.tokens}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Contract Verification Slip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090b09] border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="rubber-stamp-yellow text-[9px] py-0.5 px-2">OFFICIAL DEPLOYMENT</span>
            <div>
              <div className="text-[10px] text-white/40 uppercase">ROBINHOOD CHAIN L2 SMART CONTRACT</div>
              <div className="text-sm font-bold text-white tracking-wider">{JUICY_CONFIG.contractAddress}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCopyCA}
              className="btn-tactile flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#30d158]" /> : <Copy className="w-3.5 h-3.5 text-[#ccff00]" />}
              <span>{copied ? "COPIED TO CLIPBOARD" : "COPY CONTRACT"}</span>
            </button>
            <a
              href={JUICY_CONFIG.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile px-4 py-2.5 rounded-xl bg-[#ccff00] hover:bg-white text-black font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.3)]"
            >
              <span>EXPLORER</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
