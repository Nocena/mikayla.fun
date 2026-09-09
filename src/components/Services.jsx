import { useState } from "react";
import { logo } from "../assets";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import DecryptedText from "./react-bits/DecryptedText";

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

const Services = () => {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section id="services" className="relative py-20 lg:py-28 bg-[#080808] border-t border-white/5 overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-4 font-mono text-xs uppercase tracking-widest text-[#a8c3a0]">
            <span className="w-2 h-2 rounded-full bg-[#d4fc50]" />
            <ShinyText text="ROBINHOOD CHAIN PROTOCOL LIFECYCLE" speed={3} className="text-[#a8c3a0]" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            How Mikayla Launchpad Works
          </h2>
          <p className="text-white/60 text-sm sm:text-base mt-3">
            We automated complex DeFi mechanics into a seamless, Robinhood-grade experience so
            creators can monetize and fans can share in their upside.
          </p>
        </div>

        {/* Interactive 4-Step Stepper Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Step Selector (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            {stages.map((stage, idx) => {
              const isCurrent = activeStage === idx;
              return (
                <SpotlightCard
                  key={stage.step}
                  onClick={() => setActiveStage(idx)}
                  className={`p-5 cursor-pointer transition-all duration-300 ${
                    isCurrent
                      ? "border-[#d4fc50]/60 bg-[#121612] shadow-xl shadow-[#d4fc50]/10 scale-[1.02]"
                      : "border-white/10 bg-[#0a0c0a] hover:border-white/20"
                  }`}
                  spotlightColor={isCurrent ? "rgba(212, 252, 80, 0.2)" : "rgba(255, 255, 255, 0.08)"}
                >
                  <div className="flex items-center justify-between mb-2">
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

                  <h4 className="text-lg font-bold text-white mb-1.5">{stage.name}</h4>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                    {stage.description}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>

          {/* Right: Stage Detail & Live Demonstration Card (7 Cols) */}
          <SpotlightCard
            className="lg:col-span-7 p-6 sm:p-10 border border-white/15"
            spotlightColor="rgba(212, 252, 80, 0.16)"
          >
            {/* Stage Detail Header */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0">
                  <img src={logo} alt="Puffy Mark" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#d4fc50]">
                    Phase {stages[activeStage].step} · {stages[activeStage].status}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                    {stages[activeStage].name}
                  </h3>
                </div>
              </div>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8">
                {stages[activeStage].description}
              </p>

              {/* Stat Highlights */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-xs font-mono text-white/40 block mb-1">Architecture</span>
                  <strong className="text-sm sm:text-base font-bold text-white font-mono">
                    {stages[activeStage].perk}
                  </strong>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-xs font-mono text-white/40 block mb-1">Guarantee</span>
                  <strong className="text-sm sm:text-base font-bold text-[#d4fc50] font-mono">
                    {stages[activeStage].stat}
                  </strong>
                </div>
              </div>
            </div>

            {/* Visual Live Demonstration Frame */}
            <div className="p-5 rounded-xl bg-[#090b09] border border-white/10 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span className="text-white font-medium">Smart Contract Execution State</span>
                </div>
                <span className="text-[#a8c3a0]">Robinhood Chain L2 Verified</span>
              </div>

              {activeStage === 0 && (
                <div className="text-xs text-white/70 space-y-1.5 pt-2">
                  <div className="text-white/40">
                    <DecryptedText text="// CohortFactory.verifyDueDiligence(creatorKYC, escrowAudit, revShareContract)" speed={30} />
                  </div>
                  <div>
                    Weekly Cohort: <span className="text-[#d4fc50]">Friday ($ARIA) · Sunday ($KIRA) · Tuesday ($LUNA)</span>
                  </div>
                  <div>
                    Vetting Status:{" "}
                    <span className="text-[#10b981]">100% Escrow Verified & Legal Lockup Bound</span>
                  </div>
                </div>
              )}

              {activeStage === 1 && (
                <div className="text-xs text-white/70 space-y-1.5 pt-2">
                  <div className="text-white/40">
                    <DecryptedText text="// Deterministic Pricing: P(S) = k * S^2" speed={30} />
                  </div>
                  <div>
                    Current Supply Sold:{" "}
                    <span className="text-white">450,000,000 / 450,000,000</span>
                  </div>
                  <div>
                    Current Price:{" "}
                    <span className="text-[#d4fc50] font-bold">$0.0428</span> (Fair Discovery)
                  </div>
                </div>
              )}

              {activeStage === 2 && (
                <div className="text-xs text-white/70 space-y-1.5 pt-2">
                  <div className="text-white/40">
                    <DecryptedText text="// Uniswap V4 LP Auto-Migration & Burn" speed={30} />
                  </div>
                  <div>
                    Target Met:{" "}
                    <span className="text-[#10b981] font-bold">4.20 ETH Raised ($14,500)</span>
                  </div>
                  <div>
                    Liquidity Status:{" "}
                    <span className="text-[#d4fc50]">100% Deposited & LP Tokens Burned Forever</span>
                  </div>
                </div>
              )}

              {activeStage === 3 && (
                <div className="text-xs text-white/70 space-y-1.5 pt-2">
                  <div className="text-white/40">
                    <DecryptedText text="// Perpetual Creator Stream & Fan Perks" speed={30} />
                  </div>
                  <div>
                    Daily Volume: <span className="text-white">$1,420,000</span> → Creator Yield:{" "}
                    <span className="text-[#d4fc50] font-bold">$14,200 / day in USDC</span>
                  </div>
                  <div>
                    Fan Perk:{" "}
                    <span className="text-white">
                      Hold &gt; 1,000 $MIKA to unlock private media stream
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

export default Services;
