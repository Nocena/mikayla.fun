import React, { useState } from "react";
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
    title: "Chatbot Origins & Monetization Edge",
    tagline: "Deep operational mastery of creator monetization and fan psychology.",
    description:
      "Originated as an AI chatbot infrastructure engine for OnlyFans and creator chatters. Operating in the trenches provided proprietary data on fan retention, high-converting monetization hooks, and agency workflows, establishing the exact domain edge needed for SCM.",
    specs: [
      { label: "Origin", value: "AI Chatbot for Chatters" },
      { label: "Sector", value: "Adult & Creator Monetization" },
      { label: "Agency Network", value: "Direct Founder Connections" },
      { label: "Optimization", value: "High-Converting Chatters" },
    ],
    widgetType: "chatter",
  },
  {
    phase: "PHASE 02",
    timeframe: "TODAY · LIVE NOW",
    status: "Live Genesis",
    statusCode: "active",
    badgeColor: "border-[#d4fc50]/30 bg-[#d4fc50]/10 text-[#d4fc50]",
    title: "Solana SCM Pioneer → Robinhood Genesis",
    tagline: "Solana's premier SCM launchpad expanding to Robinhood Chain with $MIKA.",
    description:
      "Proved product-market fit on Solana as the undisputed pioneer of the Sex Capital Market. Today marking genesis deployment on Robinhood Chain with the $MIKA protocol token, fair bonding curve, and a permanent 50% platform profit burn sink.",
    specs: [
      { label: "Genesis Token", value: "$MIKA Live Today" },
      { label: "Official CA", value: "0x71C25860d5Fa...42b0" },
      { label: "Platform Sink", value: "50% Profit Burn to $MIKA" },
      { label: "Settlement", value: "Robinhood Chain L2" },
    ],
    widgetType: "genesis",
  },
  {
    phase: "PHASE 03",
    timeframe: "THIS WEEK · IMMINENT",
    status: "Upcoming Drops",
    statusCode: "drops",
    badgeColor: "border-[#a8c3a0]/30 bg-[#a8c3a0]/10 text-[#a8c3a0]",
    title: "Curated Creator Drops (Fri · Sun · Tue)",
    tagline: "Three consecutive verified model drops scheduled for Friday, Sunday, and Tuesday.",
    description:
      "Rolling out the premier cohort of verified creators sourced via exclusive personal agency relationships. Drop #01 launches this Friday (T-2d), Drop #02 on Sunday (T-4d), and Drop #03 on Tuesday (T-6d) with fair bonding curves and zero developer pre-mine.",
    specs: [
      { label: "Drop #01", value: "This Friday (T-2d)" },
      { label: "Drop #02", value: "This Sunday (T-4d)" },
      { label: "Drop #03", value: "Next Tuesday (T-6d)" },
      { label: "Talent Source", value: "Direct Agency Rosters" },
    ],
    widgetType: "drops",
  },
  {
    phase: "PHASE 04",
    timeframe: "SCALING · LIVE SPECS",
    status: "Dual Utility Spec",
    statusCode: "utility",
    badgeColor: "border-white/20 bg-white/5 text-white/70",
    title: "Dual Utility Engine & Deflationary Burns",
    tagline: "Holding gates ($50 USD), on-site burn-to-access, and perpetual $MIKA sinks.",
    description:
      "Every creator token features dual real-world utility: holding ≥ $50 USD of creator tokens automatically unlocks private vault media when the target MC is reached, while burning creator tokens on-site unlocks ultra-exclusive content. 50% of all subsequent platform profits burn $MIKA.",
    specs: [
      { label: "Tier 1 Gate", value: "≥ $50 USD (Target MC Gate)" },
      { label: "Tier 2 Sink", value: "Burn-to-Access on Site" },
      { label: "Protocol Sink", value: "50% Profits Burn $MIKA" },
      { label: "On-Chain Audit", value: "Real-Time Verified Burns" },
    ],
    widgetType: "utility",
  },
];

const InteractiveWidget = ({ type }) => {
  if (type === "chatter") {
    return (
      <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs">
        <div className="flex items-center justify-between text-white/60 mb-2">
          <span className="flex items-center gap-1.5 text-[#10b981]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            Chatter AI Architecture
          </span>
          <span className="text-[10px] text-white/40">Operational Edge</span>
        </div>
        <div className="p-3 rounded-xl bg-[#090b09] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/40">Origin Model:</span>
            <span className="text-white/80 font-medium">Conversational AI for Agency Chatters</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/40">Monetization Data:</span>
            <span className="text-[#10b981] font-medium">10,000+ High-Converting Interactions</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/40">Agency Backing:</span>
            <span className="text-white/80 font-medium">Direct Creator Representation</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "genesis") {
    return (
      <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs">
        <div className="flex items-center justify-between text-white/60 mb-2">
          <span className="text-[#d4fc50] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
            $MIKA Genesis Protocol Burn Sink
          </span>
          <span className="text-[#d4fc50] font-bold">50% Platform Profits</span>
        </div>
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div className="h-full bg-gradient-to-r from-[#a8c3a0] to-[#d4fc50] rounded-full w-[78%]" />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-white/60">
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">Burn Destination:</span>
            <span className="text-white/80 bg-white/5 px-1.5 py-0.5 rounded">0x00...dead</span>
          </div>
          <span className="text-[#d4fc50] font-bold">Permanent Deflation</span>
        </div>
      </div>
    );
  }

  if (type === "drops") {
    return (
      <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs">
        <div className="flex items-center justify-between text-white/60 mb-2.5">
          <span className="text-[#a8c3a0] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a8c3a0]" />
            Verified Creator Drop Calendar
          </span>
          <span className="text-white/50">Robinhood L2</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#090b09] p-2.5 rounded-xl border border-white/5 text-center">
            <div className="text-[10px] text-white/40 uppercase">Drop #01</div>
            <div className="text-[#d4fc50] font-bold mt-0.5">Friday</div>
            <div className="text-[9px] text-white/50 mt-0.5 font-mono">T-2 Days</div>
          </div>
          <div className="bg-[#090b09] p-2.5 rounded-xl border border-white/5 text-center">
            <div className="text-[10px] text-white/40 uppercase">Drop #02</div>
            <div className="text-white font-bold mt-0.5">Sunday</div>
            <div className="text-[9px] text-white/50 mt-0.5 font-mono">T-4 Days</div>
          </div>
          <div className="bg-[#090b09] p-2.5 rounded-xl border border-white/5 text-center">
            <div className="text-[10px] text-white/40 uppercase">Drop #03</div>
            <div className="text-white font-bold mt-0.5">Tuesday</div>
            <div className="text-[9px] text-white/50 mt-0.5 font-mono">T-6 Days</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "utility") {
    return (
      <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs">
        <div className="flex items-center justify-between text-white/60 mb-2">
          <span className="text-white/70 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
            Dual Token Utility Mechanics
          </span>
          <span className="text-[#d4fc50]">Two-Tier Utility</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-[#090b09] p-2.5 rounded-xl border border-white/5">
            <div className="text-[#d4fc50] font-bold">Tier 1: $50 Gate</div>
            <div className="text-white/50 text-[10px] mt-1">
              Hold ≥ $50 USD at target MC to unlock exclusive vault content.
            </div>
          </div>
          <div className="bg-[#090b09] p-2.5 rounded-xl border border-white/5">
            <div className="text-white font-bold">Tier 2: Burn Sink</div>
            <div className="text-white/50 text-[10px] mt-1">
              Burn tokens on-site for ultra-rare drops + 50% profit burns $MIKA.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
            <ShinyText text="SCM EVOLUTION & PROTOCOL ROADMAP" speed={3} className="text-[#a8c3a0]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1] mb-6">
            From Chatter AI to the{" "}
            <span className="italic text-[#d4fc50] font-serif">#1 SCM Launchpad</span> on Robinhood.
          </h2>

          <p className="text-base sm:text-lg text-white/60 font-sans max-w-2xl mx-auto leading-relaxed">
            Born out of deep creator monetization operations, proven on Solana, and now establishing
            Robinhood Chain as the premier venue for creator tokenization and deflationary burns.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: "all", label: "All Milestones" },
              { id: "done", label: "Phase 1: Origins" },
              { id: "active", label: "Phase 2: $MIKA Genesis" },
              { id: "drops", label: "Phase 3: Creator Drops" },
              { id: "utility", label: "Phase 4: Dual Utility" },
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
                          ? "bg-[#d4fc50]"
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
              AGENCY ONBOARDING & CURATED DROPS
            </span>

            <h3 className="font-serif text-3xl sm:text-4xl text-white tracking-tight mb-4">
              Partner with Mikayla Protocol
            </h3>

            <p className="text-sm sm:text-base text-white/60 font-sans mb-8">
              Top creator agencies and verified models launch with zero upfront capital,
              proven holder utility gates, on-site deflationary burns, and direct access to Robinhood Chain.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleLaunchClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#d4fc50] text-[#080808] font-sans font-bold text-sm hover:bg-[#e4ff75] transition-all transform hover:scale-105 shadow-xl shadow-[#d4fc50]/20 flex items-center justify-center gap-2"
              >
                <span>Apply for Upcoming Drops</span>
                <span className="font-mono">→</span>
              </button>

              <a
                href="#upcoming-drops"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-sans text-sm font-medium transition-all"
              >
                View Upcoming Drop Calendar
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs font-mono text-white/40 uppercase">Upcoming Drops</div>
                <div className="text-xs font-mono text-white/90 font-semibold mt-0.5">
                  Fri · Sun · Tue
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-white/40 uppercase">Pre-Mine</div>
                <div className="text-xs font-mono text-[#d4fc50] font-semibold mt-0.5">
                  0.0% Guaranteed
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-white/40 uppercase">Dual Utility</div>
                <div className="text-xs font-mono text-white/90 font-semibold mt-0.5">
                  $50 Gate + Burn Sinks
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-white/40 uppercase">$MIKA Sink</div>
                <div className="text-xs font-mono text-[#a8c3a0] font-semibold mt-0.5">
                  50% Platform Profit Burn
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
