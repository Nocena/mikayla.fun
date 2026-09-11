import React, { useState } from "react";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import CountUp from "./react-bits/CountUp";
import { Activity, PieChart as PieIcon, ArrowRight } from "lucide-react";

const stages = [
  {
    step: "01",
    status: "Agency Talent Curation",
    name: "Agency Network & Direct Model Access",
    description:
      "Originating from AI chatter and creator operations, our team works directly with verified agency talent rosters and high-earning models. Every creator drop is vetted for organic engagement and verified revenue, eliminating low-effort scam rugs.",
    tag: "AGENCY NETWORK",
    perk: "Zero Scam Rugs",
    stat: "Verified Talent Rosters",
  },
  {
    step: "02",
    status: "Fair Bonding Curve",
    name: "Robinhood Chain L2 Price Discovery",
    description:
      "Fans and traders buy directly from fair deterministic bonding curves on Robinhood Chain L2. Sub-second execution and negligible gas fees (<$0.001) provide seamless access for millions of retail traders.",
    tag: "ROBINHOOD L2",
    perk: "Zero MEV Exploits",
    stat: "Instant Liquidity Pools",
  },
  {
    step: "03",
    status: "Dual Utility Engine",
    name: "$50 Holder Gate & On-Site Burns",
    description:
      "Every creator token features concrete utility: holding at least $50 USD of the token unlocks exclusive private content once market cap milestones are reached. Fans can also burn creator tokens on-site to unlock ultra-exclusive master rolls.",
    tag: "DUAL UTILITY",
    perk: "Deflationary Contraction",
    stat: "Hold $50 Gate + On-Site Burns",
  },
  {
    step: "04",
    status: "Protocol Value Capture",
    name: "50% Platform Profit Burn for $MIKA",
    description:
      "Every secondary trade and creator launch generates platform profits. 50% of all platform and launch profits are routed directly on-chain to buy back and burn $MIKA supply forever.",
    tag: "50% PROFIT BURN",
    perk: "Automated Supply Squeeze",
    stat: "50% Routed to 0x0...dead",
  },
];

const tokenAllocation = [
  {
    name: "Public Allocation (100% Bonded)",
    percentage: 45.0,
    amount: "450,000,000",
    color: "#d4fc50",
    status: "100% Bonded · Graduated",
    description: "Bonding curve completed. Graduated to Uniswap v4 on Robinhood Chain L2. Actively trading on FOMO & Uniswap.",
  },
  {
    name: "Community & Creators",
    percentage: 20.0,
    amount: "200,000,000",
    color: "#a8c3a0",
    status: "Airdrop & Ecosystem",
    description: "Incentives for high-volume creator models, early traders, and liquidity providers.",
  },
  {
    name: "Core Development",
    percentage: 15.0,
    amount: "150,000,000",
    color: "#f4f4f2",
    status: "1-Year Cliff · Linear",
    description: "Smart contract locked. 12-month cliff followed by 24-month linear vesting.",
  },
  {
    name: "Tier-1 CEX Listings",
    percentage: 10.0,
    amount: "100,000,000",
    color: "#5d85ff",
    status: "Multi-Sig Locked",
    description: "Reserved for institutional market-making and centralized exchange liquidity.",
  },
  {
    name: "Protocol Treasury",
    percentage: 8.36,
    amount: "83,554,429",
    color: "#ffc876",
    status: "DAO Governed",
    description: "Remaining after permanent burn. Allocated for upcoming creators and chat infrastructure.",
  },
  {
    name: "Permanently Burned",
    percentage: 1.64,
    amount: "16,445,571",
    color: "#ff453a",
    status: "Onchain Destroyed",
    description: "Permanently burned via launch profit buyback & burn smart contract transaction.",
  },
];

const PieChart = ({ data, activeIndex, onHover }) => {
  let cumulativePercentage = 0;

  return (
    <div className="relative w-full aspect-square max-w-[260px] sm:max-w-[340px] md:max-w-[360px] mx-auto">
      <div className="absolute inset-0 rounded-full bg-[#d4fc50]/[0.05] blur-2xl pointer-events-none" />

      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
        {data.map((item, index) => {
          const percentage = item.percentage;
          const startAngle = (cumulativePercentage / 100) * 360;
          const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
          cumulativePercentage += percentage;

          const startAngleRad = (startAngle - 90) * (Math.PI / 180);
          const endAngleRad = (endAngle - 90) * (Math.PI / 180);

          const isHovered = activeIndex === index;
          const outerRadius = isHovered ? 88 : 82;
          const innerRadius = isHovered ? 46 : 50;

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
              stroke="#080808"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300"
              opacity={activeIndex === null || isHovered ? 1 : 0.4}
              onMouseEnter={() => onHover(index)}
              onMouseLeave={() => onHover(null)}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-[#121412] border border-white/10 flex flex-col items-center justify-center pointer-events-none text-center shadow-lg">
        <span className="text-[10px] font-mono uppercase text-white/50">
          {activeIndex !== null ? data[activeIndex].name.split(" ")[0] : "Circulating"}
        </span>
        <strong className="text-sm font-bold font-mono text-white">
          {activeIndex !== null ? `${data[activeIndex].percentage}%` : "983.5M"}
        </strong>
        <span className="text-[9px] font-mono text-[#d4fc50]">$MIKA</span>
      </div>
    </div>
  );
};

export default function Protocol() {
  const [activeTab, setActiveTab] = useState("lifecycle");
  const [activeStage, setActiveStage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section
      id="protocol"
      className="relative py-20 lg:py-28 bg-[#080808] border-t border-white/[0.08] overflow-hidden"
    >
      <div id="services" className="absolute -top-20" />
      <div id="pricing" className="absolute -top-20" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-3 font-mono text-xs uppercase tracking-widest text-[#a8c3a0]">
              <span className="w-2 h-2 rounded-full bg-[#d4fc50]" />
              <ShinyText text="ROBINHOOD CHAIN PROTOCOL & CAP TABLE" speed={3} className="text-[#a8c3a0]" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-tight">
              Protocol Architecture & Tokenomics
            </h2>
            <p className="text-white/60 text-xs sm:text-sm mt-2 max-w-xl font-sans">
              Automated fair bonding curves, dual holder/burn utility sinks, and fixed 1,000,000,000 $MIKA supply on Robinhood Chain L2.
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/15 shrink-0 self-start md:self-auto font-mono text-xs">
            <button
              onClick={() => setActiveTab("lifecycle")}
              className={`btn-tactile px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "lifecycle"
                  ? "bg-[#d4fc50] text-black font-semibold shadow-[0_0_12px_rgba(212,252,80,0.25)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Bonding Lifecycle</span>
            </button>
            <button
              onClick={() => setActiveTab("tokenomics")}
              className={`btn-tactile px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === "tokenomics"
                  ? "bg-[#d4fc50] text-black font-semibold shadow-[0_0_12px_rgba(212,252,80,0.25)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Cap Table & $MIKA</span>
            </button>
          </div>
        </div>

        {activeTab === "lifecycle" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              {stages.map((stage, idx) => {
                const isCurrent = activeStage === idx;
                return (
                  <SpotlightCard
                    key={stage.step}
                    onClick={() => setActiveStage(idx)}
                    className={`p-4 sm:p-5 cursor-pointer transition-all duration-300 rounded-xl ${
                      isCurrent
                        ? "border-[#d4fc50]/60 bg-[#121612] shadow-xl shadow-[#d4fc50]/10 scale-[1.01]"
                        : "border-white/10 bg-[#0a0c0a] hover:border-white/20"
                    }`}
                    spotlightColor={isCurrent ? "rgba(212, 252, 80, 0.2)" : "rgba(255, 255, 255, 0.08)"}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-[#d4fc50]">
                        PHASE {stage.step}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isCurrent
                            ? "bg-[#d4fc50]/15 text-[#d4fc50] border-[#d4fc50]/30"
                            : "bg-white/5 text-white/40 border-white/10"
                        }`}
                      >
                        {stage.tag}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1 tracking-tight font-sans">
                      {stage.name}
                    </h4>
                    <p className="text-xs text-white/50 line-clamp-2 font-sans font-light">
                      {stage.description}
                    </p>
                  </SpotlightCard>
                );
              })}
            </div>

            <div className="lg:col-span-7">
              <SpotlightCard
                className="h-full p-6 sm:p-8 flex flex-col justify-between bg-[#0d0d0d] border-t border-white/20 border-x border-b border-white/10 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.85)]"
                spotlightColor="rgba(212, 252, 80, 0.12)"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                    <span className="text-xs font-mono text-[#d4fc50] uppercase tracking-widest font-semibold">
                      Phase {stages[activeStage].step} Architecture
                    </span>
                    <span className="text-xs font-mono text-white/40">Robinhood L2 Protocol</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif text-white mb-3 tracking-tight leading-tight">
                    {stages[activeStage].name}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 font-sans font-light leading-relaxed mb-6">
                    {stages[activeStage].description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/10">
                      <div className="text-[10px] font-mono uppercase text-white/40 mb-1">Standard</div>
                      <div className="text-xs font-mono font-bold text-white">
                        {stages[activeStage].perk}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/10">
                      <div className="text-[10px] font-mono uppercase text-white/40 mb-1">Impact</div>
                      <div className="text-xs font-mono font-bold text-[#d4fc50]">
                        {stages[activeStage].stat}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#d4fc50]/[0.05] border border-[#d4fc50]/20 text-xs font-mono text-white/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-[#d4fc50] shrink-0" />
                    <span className="truncate text-white/70">
                      50% of all launch & platform profits automatically routed to burn $MIKA supply
                    </span>
                  </div>
                  <a
                    href="#upcoming-drops"
                    className="text-[#d4fc50] hover:text-white font-bold shrink-0 flex items-center gap-1"
                  >
                    <span>View Drops</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </SpotlightCard>
            </div>
          </div>
        )}

        {activeTab === "tokenomics" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            <SpotlightCard
              className="lg:col-span-5 p-6 sm:p-8 flex flex-col items-center justify-center border border-white/15 rounded-2xl bg-[#0d0d0d]"
              spotlightColor="rgba(212, 252, 80, 0.12)"
            >
              <PieChart data={tokenAllocation} activeIndex={activeIndex} onHover={setActiveIndex} />

              <div className="w-full mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono text-white/50">
                <span>
                  Standard: <strong className="text-white">ERC-20 (Robinhood L2)</strong>
                </span>
                <span>
                  Remaining Supply:{" "}
                  <strong className="text-[#d4fc50]">
                    <CountUp to={983554429} separator="," duration={2.5} />
                  </strong>{" "}
                  <span className="text-white/40 text-[10px]">(16.4M burned)</span>
                </span>
              </div>
            </SpotlightCard>

            <div className="lg:col-span-7 space-y-2.5">
              {tokenAllocation.map((item, index) => {
                const isSelected = activeIndex === index;
                return (
                  <SpotlightCard
                    key={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    className={`p-3.5 sm:p-4 cursor-pointer transition-all duration-300 rounded-xl ${
                      isSelected
                        ? "bg-[#141614] border-[#d4fc50]/50 shadow-lg scale-[1.01]"
                        : "bg-[#0a0c0a] border-white/10 hover:border-white/20"
                    }`}
                    spotlightColor={item.color === "#d4fc50" ? "rgba(212, 252, 80, 0.2)" : "rgba(255, 255, 255, 0.08)"}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        <span className="text-xs font-mono font-bold text-[#d4fc50]">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                        <span>{item.amount} tokens</span>
                        <span className="text-white/20">·</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-white/50 font-sans font-light pl-5">
                      {item.description}
                    </p>
                  </SpotlightCard>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
