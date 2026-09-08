import { useState } from "react";
import { logo } from "../assets";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import DecryptedText from "./react-bits/DecryptedText";
import CountUp from "./react-bits/CountUp";

const tokensData = [
  {
    id: "mika",
    name: "Mikayla",
    ticker: "$MIKA",
    category: "AI Model Ecosystem",
    price: "$0.0428",
    change: "+342.8%",
    isUp: true,
    mcap: "$42.8M",
    fdv: "$62.5M",
    status: "bonding",
    progress: 78.2,
    target: "4.20 ETH",
    age: "12m ago",
    sparkline: [20, 24, 28, 22, 35, 48, 55, 68, 85],
    isFeatured: true,
  },
  {
    id: "pons",
    name: "Pons",
    ticker: "$PONS",
    category: "Robinhood Ecosystem",
    price: "$0.5613",
    change: "+18.4%",
    isUp: true,
    mcap: "$561.3M",
    fdv: "$803.4M",
    status: "graduated",
    version: "V2",
    progress: 100,
    target: "Graduated",
    age: "57d ago",
    sparkline: [40, 48, 52, 60, 68, 75, 82, 90, 95],
  },
  {
    id: "orbio",
    name: "Orbio.so",
    ticker: "$ORBIO",
    category: "Autonomous Creator",
    price: "$0.0359",
    change: "+44.1%",
    isUp: true,
    mcap: "$35.9M",
    fdv: "$52.1M",
    status: "graduated",
    version: "V2",
    progress: 100,
    target: "Graduated",
    age: "7d ago",
    sparkline: [25, 30, 38, 45, 42, 58, 65, 78, 84],
  },
  {
    id: "cyrene",
    name: "Cyrene AI",
    ticker: "$CYRENE",
    category: "Model Personality",
    price: "$0.0192",
    change: "+54.2%",
    isUp: true,
    mcap: "$19.2M",
    fdv: "$28.4M",
    status: "bonding",
    progress: 55.4,
    target: "4.20 ETH",
    age: "4h ago",
    sparkline: [15, 18, 22, 28, 25, 38, 42, 50, 58],
  },
  {
    id: "zzz",
    name: "ZZZ",
    ticker: "$ZZZ",
    category: "Decentralized Media",
    price: "$0.0267",
    change: "+9.2%",
    isUp: true,
    mcap: "$26.7M",
    fdv: "$39.2M",
    status: "graduated",
    version: "V2",
    progress: 100,
    target: "Graduated",
    age: "11d ago",
    sparkline: [30, 35, 32, 40, 45, 52, 58, 62, 70],
  },
  {
    id: "luna",
    name: "Luna Vault",
    ticker: "$LUNA",
    category: "Creator Royalty Share",
    price: "$0.0084",
    change: "+18.1%",
    isUp: true,
    mcap: "$8.4M",
    fdv: "$12.8M",
    status: "bonding",
    progress: 32.0,
    target: "4.20 ETH",
    age: "1d ago",
    sparkline: [10, 12, 14, 11, 16, 22, 26, 30, 38],
  },
];

const scmPillars = [
  {
    step: "01",
    tag: "THE $60B UNTAPPED CASHFLOW",
    title: "Sex Capital Markets (SCM)",
    description:
      "The creator and adult media industry generates over $60 Billion annually in verified consumer cashflow. Yet Web2 platforms take 20% cuts, ban creators arbitrarily, and fans get 0% financial upside. SCM tokenizes real cashflow into liquid, tradable on-chain assets.",
    highlight: "$60B+ Annual Volume · Zero Liquid Web3 Tokens Until Now",
    icon: (
      <svg className="w-6 h-6 text-[#d4fc50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    step: "02",
    tag: "ZERO PUBLIC SCAMS · 100% CURATED",
    title: "Strict Due Diligence Protocol",
    description:
      "We are NOT pump.fun. Mikayla does not allow permissionless public token creation. We reject >98% of applicants, verifying legal identity, 12 months of escrow revenue statements, and enforcing multi-year revenue-sharing smart contract lockups.",
    highlight: "KYC Verified Creators · Binding Revenue Smart Contracts",
    icon: (
      <svg className="w-6 h-6 text-[#00f2ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    step: "03",
    tag: "BURN-TO-UNLOCK CONTENT · REAL VALUE",
    title: "$5 / $10 / $25 Token Burn Utility",
    description:
      "Fans burn $5, $10, or $25 in creator tokens to unlock unreleased photosets, PPV video masters, and private AI calls directly on this launchpad. Every unlock permanently incinerates tokens to 0x00...dead, creating a continuous deflationary supply squeeze.",
    highlight: "Real Media Unlocks · Automated Token Incineration on Robinhood Chain",
    icon: (
      <svg className="w-6 h-6 text-[#ff007f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
  },
];

const Benefits = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tradeToast, setTradeToast] = useState(null);

  const filteredTokens = tokensData.filter((token) => {
    if (activeTab === "bonding") return token.status === "bonding";
    if (activeTab === "graduated") return token.status === "graduated";
    return true;
  });

  const handleQuickTrade = (token) => {
    setTradeToast(`Simulated buy order for 1,000 ${token.ticker} executed on Robinhood L2!`);
    setTimeout(() => setTradeToast(null), 3500);
  };

  return (
    <section id="benefits" className="relative py-20 lg:py-28 bg-[#080808] border-t border-white/5 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[400px] bg-[#d4fc50]/[0.02] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SCM Thesis Explainer Section for the Unknowing Degen */}
        <div id="scm-thesis" className="mb-24 pt-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-pulse" />
              <ShinyText
                text="THE SCM THESIS · WHY DEGENS WIN HERE"
                className="text-xs font-mono uppercase tracking-widest text-[#d4fc50]"
                speed={3}
              />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
              Why Sex Capital Markets?
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              If you’re a crypto degen, you’ve seen thousands of useless memecoins rug in 5 minutes.
              SCM brings <strong>real, high-margin adult and creator cashflow</strong> into on-chain liquidity pools with institutional backing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scmPillars.map((pillar) => (
              <SpotlightCard
                key={pillar.step}
                className="p-6 sm:p-8 flex flex-col justify-between border-white/10 bg-[#0a0c0a] hover:border-[#d4fc50]/40 transition-all"
                spotlightColor="rgba(212, 252, 80, 0.15)"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                      {pillar.icon}
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#d4fc50]">
                      PHASE {pillar.step}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#a8c3a0] block mb-2 font-bold">
                    {pillar.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/65 leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-[#d4fc50] flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{pillar.highlight}</span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Section Header: Active Tokens */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pt-12 border-t border-white/5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-pulse" />
              <ShinyText
                text="LIVE ROBINHOOD MARKET FEED"
                className="text-xs font-mono uppercase tracking-widest text-[#d4fc50]"
                speed={3}
              />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              Explore Active Creator Tokens
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-2 max-w-xl">
              Real-time trading on the Robinhood Chain. From fair-launch bonding curves to graduated
              Uniswap V4 perpetuals with locked liquidity.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono shrink-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === "all"
                  ? "bg-[#d4fc50] text-black font-bold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              All Tokens ({tokensData.length})
            </button>
            <button
              onClick={() => setActiveTab("bonding")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === "bonding"
                  ? "bg-[#d4fc50] text-black font-bold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Bonding Curves
            </button>
            <button
              onClick={() => setActiveTab("graduated")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === "graduated"
                  ? "bg-[#d4fc50] text-black font-bold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Graduated V2
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
        {tradeToast && (
          <div className="mb-8 p-3 rounded-2xl bg-[#d4fc50]/15 border border-[#d4fc50]/40 text-xs font-mono text-[#d4fc50] flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-ping" />
              {tradeToast}
            </span>
            <span className="text-white/40">Robinhood L2 Finality &lt;400ms</span>
          </div>
        )}

        {/* Tokens Grid with ReactBits SpotlightCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTokens.map((token) => (
            <SpotlightCard
              key={token.id}
              className="p-6 transition-all duration-300 hover:scale-[1.01]"
              spotlightColor="rgba(212, 252, 80, 0.14)"
            >
              {/* Badges Header */}
              <div className="flex items-center justify-between gap-2 mb-4">
                {token.status === "graduated" ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-white/10 text-white border border-white/10">
                      Graduated
                    </span>
                    {token.version && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#2563eb] text-white">
                        {token.version}
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#d4fc50]/10 text-[#d4fc50] border border-[#d4fc50]/25">
                      3.2x Ready
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-[#d4fc50]/15 text-[#d4fc50] border border-[#d4fc50]/20">
                    Bonding Curve ({token.progress}%)
                  </span>
                )}
                <span className="text-xs font-mono text-white/40">{token.age}</span>
              </div>

              {/* Token Identity */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0">
                  <img src={logo} alt={token.name} className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-white truncate group-hover:text-[#d4fc50] transition-colors">
                    {token.name}
                  </h3>
                  <p className="text-xs font-mono text-[#a8c3a0]">
                    <DecryptedText
                      text={token.ticker}
                      speed={30}
                      className="text-[#a8c3a0] font-mono"
                    />
                  </p>
                  <span className="text-[11px] text-white/40 truncate block mt-0.5">
                    {token.category}
                  </span>
                </div>
              </div>

              {/* Price & Sparkline */}
              <div className="flex items-end justify-between gap-2 py-3 border-y border-white/5 mb-4">
                <div>
                  <span className="text-xs font-mono text-white/40 block">Price</span>
                  <span className="text-lg font-bold font-mono text-white tracking-tight">
                    {token.price}
                  </span>
                  <span
                    className={`text-xs font-mono font-semibold block ${
                      token.isUp ? "text-[#30d158]" : "text-[#ff453a]"
                    }`}
                  >
                    {token.change}
                  </span>
                </div>

                {/* Mini Sparkline Chart */}
                <div className="w-24 h-10">
                  <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                    <path
                      d={
                        `M 0 ${40 - token.sparkline[0] * 0.4} ` +
                        token.sparkline
                          .map((val, idx) => `L ${(idx / (token.sparkline.length - 1)) * 100} ${40 - val * 0.4}`)
                          .join(" ")
                      }
                      fill="none"
                      stroke={token.isUp ? "#d4fc50" : "#ff453a"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Market Cap & FDV */}
              <div className="space-y-1 text-xs font-mono mb-4">
                <div className="flex justify-between">
                  <span className="text-white/40">Market Cap:</span>
                  <strong className="text-white font-medium">{token.mcap}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/30">Target / FDV:</span>
                  <span className="text-white/60">{token.fdv}</span>
                </div>
              </div>

              {/* Bonding Meter or V4 Migration Tag */}
              {token.status === "bonding" ? (
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] font-mono text-white/40 mb-1">
                    <span>Graduation Progress</span>
                    <span className="text-white font-bold">{token.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-[#a8c3a0] to-[#d4fc50] rounded-full"
                      style={{ width: `${token.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex items-center justify-between text-[11px] font-mono text-[#a8c3a0] bg-[#a8c3a0]/5 px-2.5 py-1.5 rounded-xl border border-[#a8c3a0]/15">
                  <span>LP Tokens 100% Burned</span>
                  <span className="font-bold text-white">Uniswap V4</span>
                </div>
              )}

              {/* Interactive Quick Trade Action */}
              <button
                type="button"
                onClick={() => handleQuickTrade(token)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#d4fc50] hover:text-[#080808] border border-white/10 hover:border-[#d4fc50] text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 group/btn"
              >
                <span>Instant Trade {token.ticker}</span>
                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </button>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
