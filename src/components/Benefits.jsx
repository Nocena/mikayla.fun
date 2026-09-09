import React from "react";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import { ShieldCheck, Flame, Users, Coins, ArrowUpRight } from "lucide-react";

const scmPillars = [
  {
    step: "01",
    tag: "THE $60B UNTAPPED CASHFLOW",
    title: "Sex Capital Markets (SCM)",
    description:
      "The creator and adult media industry generates over $60 Billion annually in verified consumer cashflow. Yet Web2 platforms extract 20–30% cuts, ban creators arbitrarily, and fans get 0% financial upside. SCM tokenizes real cashflow into liquid, tradable on-chain assets.",
    highlight: "$60B+ Annual Volume · Liquid On-Chain Equity",
    icon: <Coins className="w-6 h-6 text-[#d4fc50]" />,
  },
  {
    step: "02",
    tag: "AGENCY NETWORK & DIRECT TALENT",
    title: "Insider Agency Advantage",
    description:
      "Originating as an AI chatter assistant gave our team deep operational mastery of creator monetization, subscriber retention, and chatter revenue mechanics. We work directly with verified agency rosters and established models, ensuring organic traction and high trading volume.",
    highlight: "Direct Model Access · Established Agency Backing",
    icon: <Users className="w-6 h-6 text-[#d4fc50]" />,
  },
  {
    step: "03",
    tag: "DUAL UTILITY & 50% PROFIT BURN",
    title: "On-Chain Deflation Engine",
    description:
      "Creator coins feature $50 holder gates at target market caps and on-site token burns for ultra-exclusive content. Meanwhile, 50% of all platform and launch profits are routed directly on-chain to buy back and burn $MIKA supply forever.",
    highlight: "50% Platform Profit Burn · Real Token Utility",
    icon: <Flame className="w-6 h-6 text-[#d4fc50]" />,
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className="relative py-20 lg:py-28 bg-[#080808] border-t border-white/[0.08]">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
            <ShinyText
              text="THE SCM THESIS & ADVANTAGE"
              className="text-xs font-mono uppercase tracking-widest text-[#d4fc50]"
              speed={3}
            />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-display leading-tight">
            Why Sex Capital Markets?
          </h2>
          <p className="text-white/60 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed font-sans">
            Instead of ephemeral memecoins that rug in hours, SCM bridges <strong>real, high-margin creator cashflow</strong> into on-chain liquidity pools with verified agency backing on Robinhood Chain.
          </p>
        </div>

        {/* 3 Core Pillars (Apple Materials & Depth) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {scmPillars.map((pillar) => (
            <SpotlightCard
              key={pillar.step}
              className="p-6 sm:p-8 flex flex-col justify-between border-t border-white/20 border-x border-b border-white/10 bg-[#0d0d0d] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-white/25 transition-all rounded-2xl"
              spotlightColor="rgba(212, 252, 80, 0.08)"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-white/70">
                    PHASE {pillar.step}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4fc50] block mb-2 font-medium">
                  {pillar.tag}
                </span>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-sans">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-6 font-sans">
                  {pillar.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-white/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
                <span>{pillar.highlight}</span>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Quick Launchpad Callout Banner with Specular Border */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d0d0d] border-t border-white/20 border-x border-b border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono text-[#d4fc50] uppercase tracking-widest block mb-1">
              Genesis Launch Active
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-white tracking-display">
              First 3 Creator Tokens Launching This Week
            </h3>
            <p className="text-xs font-mono text-white/50 mt-1">
              Friday · Sunday · Tuesday · 50% of platform launch profits burn $MIKA
            </p>
          </div>

          <a
            href="#upcoming-drops"
            className="btn-tactile px-6 py-3 rounded-lg bg-[#d4fc50] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(212,252,80,0.25)]"
          >
            <span>View Launch Schedule</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default Benefits;
