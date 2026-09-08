import React, { useState, useEffect } from "react";
import Section from "./Section";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import DecryptedText from "./react-bits/DecryptedText";

const roadmapData = [
  {
    phase: "PHASE 01",
    timeframe: "Q4 2025 · COMPLETED",
    status: "Completed",
    statusCode: "done",
    badgeColor: "border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]",
    title: "Fair Bonding Curve Engine",
    tagline: "Deterministic mathematical pricing with zero developer pre-mine.",
    description:
      "Engineered the core bonding curve contracts deployed on Robinhood Chain testnet and mainnet. Ensured every token launches with identical mathematical parameters, eliminating insider allocations, pre-sales, and bot snipers.",
    specs: [
      { label: "Pricing Model", value: "P = k · S² Deterministic" },
      { label: "Pre-Allocation", value: "0.00% (Fair Launch)" },
      { label: "Gas Cost", value: "<$0.0009 on Robinhood L2" },
      { label: "Security Audit", value: "CertiK & OZ Verified" },
    ],
    widgetType: "curve",
  },
  {
    phase: "PHASE 02",
    timeframe: "Q1 2026 · LIVE NOW",
    status: "Active Drops & $MIKA Live",
    statusCode: "active",
    badgeColor: "border-[#d4fc50]/30 bg-[#d4fc50]/10 text-[#d4fc50]",
    title: "Curated Cohort Drops & $MIKA Launch",
    tagline: "$MIKA protocol token live + weekly curated drops (Friday, Sunday, Tuesday).",
    description:
      "Deploying the $MIKA protocol token with automated trading fee buyback/burn, while launching the premier cohort of audited creators ($ARIA on Friday, $KIRA on Sunday, and $LUNA on Tuesday) on Robinhood Chain L2 with automated Uniswap V4 LP burn.",
    specs: [
      { label: "$MIKA Curve", value: "78.2% Filled (Live)" },
      { label: "Weekly Drops", value: "Friday, Sunday, Tuesday" },
      { label: "Due Diligence", value: "100% KYC & Escrow Audited" },
      { label: "LP Token Status", value: "Burned to 0x000...dead" },
    ],
    widgetType: "v4migration",
  },
  {
    phase: "PHASE 03",
    timeframe: "Q2 2026 · TESTNET BETA",
    status: "In Development",
    statusCode: "dev",
    badgeColor: "border-[#a8c3a0]/30 bg-[#a8c3a0]/10 text-[#a8c3a0]",
    title: "Creator Perpetual Leverage (3.2x)",
    tagline: "The world's first decentralized margin terminal for creator tokens.",
    description:
      "Enables high-conviction fans and traders to take long or short leverage positions up to 3.2x on graduated creator tokens. Sub-second Robinhood Chain settlement prevents liquidation cascades and toxic oracle lag.",
    specs: [
      { label: "Max Leverage", value: "3.2x Isolated Margin" },
      { label: "Oracle Latency", value: "<400ms Fast Finality" },
      { label: "Liquidation Buffer", value: "8.5% Safety Spread" },
      { label: "Wallet Support", value: "Robinhood Native + Passkeys" },
    ],
    widgetType: "leverage",
  },
  {
    phase: "PHASE 04",
    timeframe: "Q3 - Q4 2026 · SPEC",
    status: "Architectural Spec",
    statusCode: "planned",
    badgeColor: "border-white/20 bg-white/5 text-white/70",
    title: "Autonomous AI Chat & Streaming Yield",
    tagline: "Direct USDC creator dividend disbursement and autonomous AI agents.",
    description:
      "Holders earn continuous daily streaming revenue distributions funded by creator content sales and trading fees. Creators deploy fine-tuned AI chatter agents trained on their personal voice to engage fans 24/7.",
    specs: [
      { label: "Yield Model", value: "Continuous Streaming USDC" },
      { label: "AI Chat Agent", value: "Fine-tuned Creator LLM" },
      { label: "Token Gating", value: "Backstage Vault Access" },
      { label: "Cross-Chain Sync", value: "Robinhood <-> Ethereum L1" },
    ],
    widgetType: "dividends",
  },
];

const InteractiveWidget = ({ type }) => {
  if (type === "curve") {
    return (
      <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs">
        <div className="flex items-center justify-between text-white/60 mb-2">
          <span className="flex items-center gap-1.5 text-[#10b981]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            Audited Smart Contracts
          </span>
          <span className="text-[10px] text-white/40">Verified bytecode</span>
        </div>
        <div className="relative h-20 w-full overflow-hidden rounded-lg bg-[#050705] p-2 flex items-end">
          <svg viewBox="0 0 200 60" className="w-full h-full stroke-current overflow-visible">
            <defs>
              <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 55 Q 80 50, 130 30 T 200 5"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            <path
              d="M 0 55 Q 80 50, 130 30 T 200 5 L 200 60 L 0 60 Z"
              fill="url(#curveGrad)"
            />
            <circle cx="130" cy="30" r="4" fill="#10b981" className="animate-ping" />
            <circle cx="130" cy="30" r="3" fill="#ffffff" />
          </svg>
        </div>
        <div className="flex justify-between text-[11px] mt-2 text-white/50">
          <span>Supply: 0.00 M</span>
          <span className="text-[#10b981] font-semibold">100% Fair Mint</span>
          <span>Target: 1.00 B</span>
        </div>
      </div>
    );
  }

  if (type === "v4migration") {
    return (
      <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs">
        <div className="flex items-center justify-between text-white/60 mb-2">
          <span className="text-[#d4fc50] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-pulse" />
            Uniswap V4 Auto-Lock
          </span>
          <span className="text-[#d4fc50] font-bold">89.4% Progress</span>
        </div>
        <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div className="h-full bg-gradient-to-r from-[#a8c3a0] to-[#d4fc50] rounded-full w-[89.4%] animate-pulse" />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-white/60">
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">Burn Address:</span>
            <span className="text-white/80 bg-white/5 px-1.5 py-0.5 rounded">0x00...dead</span>
          </div>
          <span className="text-[#d4fc50] font-bold">100% LP Burned</span>
        </div>
      </div>
    );
  }

  if (type === "leverage") {
    return <LeverageSimulator />;
  }

  if (type === "dividends") {
    return <YieldTickerSimulator />;
  }

  return null;
};

const LeverageSimulator = () => {
  const [leverage, setLeverage] = useState(2.5);

  const calculatedGain = (leverage * 14.8).toFixed(1);
  const marginReq = (100 / leverage).toFixed(1);

  return (
    <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs">
      <div className="flex items-center justify-between text-white/60 mb-2">
        <span className="text-[#a8c3a0] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a8c3a0]" />
          Terminal Leverage Simulator
        </span>
        <span className="text-white/80 font-bold">{leverage}x Position</span>
      </div>

      <div className="flex items-center gap-3 my-2">
        <input
          type="range"
          min="1.0"
          max="3.2"
          step="0.1"
          value={leverage}
          onChange={(e) => setLeverage(parseFloat(e.target.value))}
          className="w-full accent-[#d4fc50] cursor-pointer h-1.5 bg-white/10 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-white/5 text-[11px]">
        <div className="bg-white/[0.02] p-2 rounded-lg">
          <div className="text-white/40">Simulated 24h PnL</div>
          <div className="text-[#d4fc50] font-bold font-sans text-sm">+{calculatedGain}%</div>
        </div>
        <div className="bg-white/[0.02] p-2 rounded-lg">
          <div className="text-white/40">Margin Required</div>
          <div className="text-white/90 font-bold font-sans text-sm">{marginReq}%</div>
        </div>
      </div>
    </div>
  );
};

const YieldTickerSimulator = () => {
  const [streamedAmount, setStreamedAmount] = useState(48.2415);

  useEffect(() => {
    const interval = setInterval(() => {
      setStreamedAmount((prev) => prev + 0.0003);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs">
      <div className="flex items-center justify-between text-white/60 mb-2">
        <span className="text-white/70 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-pulse" />
          Live Streaming Dividends
        </span>
        <span className="text-white/40">Robinhood USDC Feed</span>
      </div>

      <div className="p-3 rounded-xl bg-[#090b09] border border-white/5 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-white/40 uppercase">Total Real-Time Yield</div>
          <div className="text-lg font-bold text-[#d4fc50] tabular-nums font-mono">
            ${streamedAmount.toFixed(4)}{" "}
            <span className="text-xs text-white/60 font-sans">USDC</span>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-2 py-0.5 rounded bg-[#d4fc50]/10 text-[#d4fc50] text-[10px] font-semibold">
            Streaming / Sec
          </span>
          <div className="text-[10px] text-white/40 mt-0.5">Automated Splits</div>
        </div>
      </div>
    </div>
  );
};

const Roadmap = () => {
  const [filter, setFilter] = useState("all");

  const handleLaunchClick = () => {
    window.dispatchEvent(new CustomEvent("open-launch-modal"));
  };

  const filteredItems =
    filter === "all"
      ? roadmapData
      : roadmapData.filter((item) => item.statusCode === filter);

  return (
    <Section className="overflow-hidden relative py-20 lg:py-28" id="roadmap">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#d4fc50]/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono tracking-widest text-[#a8c3a0] uppercase mb-5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-pulse" />
            <ShinyText text="PROTOCOL EXECUTION ROADMAP · 2025 - 2026" speed={3} className="text-[#a8c3a0]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1] mb-6">
            Architected for the{" "}
            <span className="italic text-[#d4fc50] font-serif">Robinhood Chain</span> Era.
          </h2>

          <p className="text-base sm:text-lg text-white/60 font-sans max-w-2xl mx-auto leading-relaxed">
            From fair mathematical bonding curves and zero-rugpull Uniswap V4 graduation, to
            sub-second perpetual leverage and autonomous creator streaming yield.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: "all", label: "All Milestones" },
              { id: "done", label: "Phase 1: Genesis" },
              { id: "active", label: "Phase 2: V4 Migration" },
              { id: "dev", label: "Phase 3: 3.2x Leverage" },
              { id: "planned", label: "Phase 4: AI Yield" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-200 border ${
                  filter === tab.id
                    ? "bg-[#d4fc50] text-[#080808] border-[#d4fc50] font-bold shadow-lg shadow-[#d4fc50]/20"
                    : "bg-white/[0.03] text-white/60 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {filteredItems.map((item, index) => (
            <SpotlightCard
              key={index}
              className="p-6 sm:p-8"
              spotlightColor="rgba(212, 252, 80, 0.14)"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="font-mono text-xs tracking-widest text-white/40 uppercase">
                    {item.phase} · {item.timeframe}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border ${item.badgeColor}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.statusCode === "active"
                          ? "bg-[#d4fc50] animate-ping"
                          : item.statusCode === "done"
                          ? "bg-[#10b981]"
                          : "bg-current"
                      }`}
                    />
                    {item.status}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-tight mb-2 group-hover:text-[#d4fc50] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs font-mono text-[#a8c3a0] mb-3">
                  <DecryptedText text={item.tagline} speed={30} className="text-[#a8c3a0]" />
                </p>

                <p className="text-sm text-white/65 font-sans leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  {item.specs.map((spec, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">
                        {spec.label}
                      </span>
                      <span className="text-xs font-mono text-white/90 font-medium mt-0.5 truncate">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <InteractiveWidget type={item.widgetType} />
            </SpotlightCard>
          ))}
        </div>

        <SpotlightCard
          className="p-8 sm:p-12 text-center"
          spotlightColor="rgba(212, 252, 80, 0.2)"
        >
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono text-[#d4fc50] bg-[#d4fc50]/10 border border-[#d4fc50]/20 mb-4">
              ZERO-FEE CREATOR ONBOARDING
            </span>

            <h3 className="font-serif text-3xl sm:text-4xl text-white tracking-tight mb-4">
              Ready to deploy on Robinhood Chain?
            </h3>

            <p className="text-sm sm:text-base text-white/60 font-sans mb-8">
              Launch your creator token with zero upfront capital, automated bonding curves, and
              instant access to over 24 million retail traders.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleLaunchClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#d4fc50] text-[#080808] font-sans font-bold text-sm hover:bg-[#e4ff75] transition-all transform hover:scale-105 shadow-xl shadow-[#d4fc50]/20 flex items-center justify-center gap-2"
              >
                <span>Launch Token in 60s</span>
                <span className="font-mono">→</span>
              </button>

              <a
                href="#benefits"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-sans text-sm font-medium transition-all"
              >
                Explore Active Tokens
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs font-mono text-white/40 uppercase">Deployment</div>
                <div className="text-xs font-mono text-white/90 font-semibold mt-0.5">
                  1-Click Gasless
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-white/40 uppercase">Pre-Mine</div>
                <div className="text-xs font-mono text-[#d4fc50] font-semibold mt-0.5">
                  0.0% Guaranteed
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-white/40 uppercase">Graduation</div>
                <div className="text-xs font-mono text-white/90 font-semibold mt-0.5">
                  Uniswap V4 Auto
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-white/40 uppercase">Robinhood L2</div>
                <div className="text-xs font-mono text-[#a8c3a0] font-semibold mt-0.5">
                  Sub-second Tx
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </Section>
  );
};

export default Roadmap;
