import { useState } from "react";
import { logo } from "../assets";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import CountUp from "./react-bits/CountUp";

const tokenAllocation = [
  {
    name: "Public Bonding Curve",
    percentage: 45.0,
    amount: "450,000,000",
    color: "#d4fc50",
    status: "100% Unlocked",
    description: "Available for public trading on Robinhood Chain fair-launch bonding curve.",
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
    percentage: 10.0,
    amount: "100,000,000",
    color: "#ffc876",
    status: "DAO Governed",
    description: "Grants for upcoming creators, AI chat infrastructure, and security audits.",
  },
];

const PieChart = ({ data, activeIndex, onHover }) => {
  let cumulativePercentage = 0;

  return (
    <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[380px] mx-auto">
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
          {activeIndex !== null ? data[activeIndex].name.split(" ")[0] : "Supply"}
        </span>
        <strong className="text-sm font-bold font-mono text-white">
          {activeIndex !== null ? `${data[activeIndex].percentage}%` : "1.00 B"}
        </strong>
        <span className="text-[9px] font-mono text-[#d4fc50]">$MIKA</span>
      </div>
    </div>
  );
};

const Pricing = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="pricing" className="relative py-20 lg:py-28 bg-[#080808] border-t border-white/5 overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-4 font-mono text-xs uppercase tracking-widest text-[#a8c3a0]">
            <span className="w-2 h-2 rounded-full bg-[#d4fc50]" />
            <ShinyText text="ON-CHAIN TOKENOMICS & TREASURY" speed={3} className="text-[#a8c3a0]" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            The Mikayla Cap Table
          </h2>
          <p className="text-white/60 text-sm sm:text-base mt-3">
            Fixed 1,000,000,000 $MIKA supply deployed on Robinhood Chain L2. 0% inflation, automated
            buyback & burn from platform trading fees.
          </p>
        </div>

        {/* 2-Column Layout: Left Donut Chart, Right Allocations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Donut Chart Frame (5 Cols) wrapped in SpotlightCard */}
          <SpotlightCard
            className="lg:col-span-5 p-6 sm:p-8 flex flex-col items-center justify-center border border-white/15"
            spotlightColor="rgba(212, 252, 80, 0.15)"
          >
            <PieChart data={tokenAllocation} activeIndex={activeIndex} onHover={setActiveIndex} />

            <div className="w-full mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-xs font-mono text-white/50">
              <span>
                Token Standard: <strong className="text-white">ERC-20 (Robinhood L2)</strong>
              </span>
              <span>
                Total Supply:{" "}
                <strong className="text-[#d4fc50]">
                  <CountUp to={1000000000} separator="," duration={2.5} />
                </strong>
              </span>
            </div>
          </SpotlightCard>

          {/* Right: Breakdown Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            {tokenAllocation.map((item, index) => {
              const isSelected = activeIndex === index;
              return (
                <SpotlightCard
                  key={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`p-4 sm:p-5 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-[#141614] border-[#d4fc50]/50 shadow-lg scale-[1.01]"
                      : "bg-[#0a0c0a] border-white/10 hover:border-white/20"
                  }`}
                  spotlightColor={item.color === "#d4fc50" ? "rgba(212, 252, 80, 0.2)" : "rgba(255, 255, 255, 0.08)"}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <h4 className="text-sm sm:text-base font-bold text-white">{item.name}</h4>
                      <span className="text-xs font-mono font-bold text-[#d4fc50]">
                        {item.percentage}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-white/40">{item.amount} $MIKA</span>
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-[#a8c3a0]">
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed pl-5">{item.description}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>

        {/* Degen Utility & Liquidity Architecture Cards */}
        <div className="mt-14 pt-12 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4fc50] font-bold">
              WHY DEGENS HOLD $MIKA
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">
              Protocol Token Utility & Value Accrual
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <SpotlightCard
              className="p-5 border-white/10 bg-[#0c0e0c] flex flex-col justify-between"
              spotlightColor="rgba(212, 252, 80, 0.15)"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#d4fc50]/15 border border-[#d4fc50]/30 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#d4fc50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5 font-mono">Guaranteed Drop Access</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Stakers receive guaranteed Tier-1 allocations for every curated weekly drop: <strong>Friday ($ARIA), Sunday ($KIRA), Tuesday ($LUNA)</strong>.
                </p>
              </div>
              <span className="mt-4 text-[10px] font-mono text-[#d4fc50] bg-[#d4fc50]/10 px-2 py-1 rounded border border-[#d4fc50]/20">
                Tier-1 Whitelist Active
              </span>
            </SpotlightCard>

            <SpotlightCard
              className="p-5 border-white/10 bg-[#0c0e0c] flex flex-col justify-between"
              spotlightColor="rgba(212, 252, 80, 0.15)"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#ff007f]/15 border border-[#ff007f]/30 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#ff007f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5 font-mono">1% Auto Buyback & Burn</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  1% of all trading volume across every creator token on Robinhood Chain is automatically routed to market-buy $MIKA and burn it forever.
                </p>
              </div>
              <span className="mt-4 text-[10px] font-mono text-[#ff007f] bg-[#ff007f]/10 px-2 py-1 rounded border border-[#ff007f]/20">
                Deflationary Volume Sink
              </span>
            </SpotlightCard>

            <SpotlightCard
              className="p-5 border-white/10 bg-[#0c0e0c] flex flex-col justify-between"
              spotlightColor="rgba(212, 252, 80, 0.15)"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/15 border border-[#00f2ff]/30 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#00f2ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5 font-mono">100% LP Burned to 0x...dead</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Upon graduating bonding curve at 4.20 ETH, 100% of liquidity is migrated to Uniswap V4 with LP keys irreversibly destroyed. Zero rugs possible.
                </p>
              </div>
              <span className="mt-4 text-[10px] font-mono text-[#00f2ff] bg-[#00f2ff]/10 px-2 py-1 rounded border border-[#00f2ff]/20">
                Provably Non-Ruggable
              </span>
            </SpotlightCard>

            <SpotlightCard
              className="p-5 border-white/10 bg-[#0c0e0c] flex flex-col justify-between"
              spotlightColor="rgba(212, 252, 80, 0.15)"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#ffc876]/15 border border-[#ffc876]/30 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#ffc876]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5 font-mono">2.5x Yield & Burn Boost</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Holding $MIKA amplifies your streaming USDC dividends and unlocks fee discounts when burning creator tokens for $5, $10, and $25 exclusive drops.
                </p>
              </div>
              <span className="mt-4 text-[10px] font-mono text-[#ffc876] bg-[#ffc876]/10 px-2 py-1 rounded border border-[#ffc876]/20">
                Continuous Cashflow Boost
              </span>
            </SpotlightCard>
          </div>
        </div>

        {/* Proof of Reserves / Contract Link Bar */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-[#0e100e] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            <div>
              <div className="text-xs font-mono text-white font-semibold">
                Autonomous Buyback & Burn Engine Live
              </div>
              <p className="text-[11px] text-white/50 font-mono">
                1% of all launchpad trading fees are automatically routed into TWAP buybacks and
                sent to the 0x000...dead address.
              </p>
            </div>
          </div>

          <a
            href="https://robinhood.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#d4fc50] font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            Verify On-Chain Explorer ↗
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
