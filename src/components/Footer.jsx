import React, { useState } from "react";
import Section from "./Section";
import { logo } from "../assets";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3500);
    }
  };

  const handleLaunchClick = () => {
    window.dispatchEvent(new CustomEvent("open-launch-modal"));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Section id="footer" crosses className="!px-0 !py-12 border-t border-white/10 bg-[#060806] text-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand & Ecosystem Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Logo Lockup */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logo}
                  alt="Mikayla"
                  className="w-9 h-9 rounded-xl object-contain drop-shadow-[0_0_12px_rgba(212,252,80,0.35)]"
                />
                <span className="font-serif text-2xl tracking-tight font-medium text-white">
                  MIKAYLA<span className="text-[#d4fc50]">.</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#d4fc50]/10 text-[#d4fc50] border border-[#d4fc50]/25">
                  Robinhood Chain
                </span>
              </div>

              <p className="text-sm text-white/60 font-sans leading-relaxed max-w-md mb-6">
                The premier SCM launchpad originating on Solana and expanding to Robinhood Chain.
                Fair bonding curves, zero creator pre-mine, dual holder & burn utility, and a permanent
                50% platform profit burn sink for $MIKA.
              </p>

              {/* Network Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-white/80 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span>Robinhood L2 Mainnet: 99.99% Uptime</span>
                <span className="text-white/30">|</span>
                <span className="text-[#a8c3a0]">Gas &lt;$0.001</span>
              </div>
            </div>

            {/* Newsletter / Drop Alerts */}
            <div className="mt-2">
              <div className="text-xs font-mono text-white/70 uppercase mb-2">
                Subscribe to Robinhood Creator Drops
              </div>
              <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4fc50] transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#d4fc50] text-[#080808] font-mono text-xs font-bold hover:bg-[#e4ff75] transition-all shrink-0"
                >
                  {subscribed ? "Subscribed!" : "Join Alerts"}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] font-mono text-[#d4fc50] mt-1.5 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>You will receive notification before each verified creator curve goes live.</span>
                </p>
              )}
            </div>
          </div>

          {/* Nav Links (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Protocol */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
                Protocol
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                <li>
                  <a href="#upcoming-drops" className="text-white/70 hover:text-[#d4fc50] transition-colors">
                    Curated Drops Feed
                  </a>
                </li>
                <li>
                  <a href="#hero" className="text-white/70 hover:text-[#d4fc50] transition-colors">
                    $MIKA Terminal & Swap
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-white/70 hover:text-[#d4fc50] transition-colors">
                    Bonding Curve Lifecycle
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-white/70 hover:text-[#d4fc50] transition-colors">
                    Cap Table & Tokenomics
                  </a>
                </li>
                <li>
                  <a
                    href="https://dexscreener.com/robinhood/0xc05decb01594ce17cb0cfc46dff62f79092971cb601eb7d8a68699d20b82a7bb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-[#30d158] transition-colors flex items-center gap-1"
                  >
                    <span>DexScreener Live Pool</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://fomo.family/token/0x123372D9de53D5bEC2988DD2386c7d3666A372a8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-[#d4fc50] transition-colors flex items-center gap-1"
                  >
                    <span>FOMO Trading App</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Creators */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
                For Creators
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                <li>
                  <button
                    onClick={handleLaunchClick}
                    className="text-[#d4fc50] font-semibold hover:underline text-left cursor-pointer"
                  >
                    Apply for Drops →
                  </button>
                </li>
                <li>
                  <a href="#services" className="text-white/70 hover:text-[#d4fc50] transition-colors">
                    Robinhood L2 Architecture
                  </a>
                </li>
                <li>
                  <a href="#upcoming-drops" className="text-white/70 hover:text-[#d4fc50] transition-colors">
                    Weekly Cohort Schedule
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-white/70 hover:text-[#d4fc50] transition-colors">
                    50% Platform Profit Burn
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Security & Network */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
                Trust & Security
              </h4>
              <ul className="space-y-2.5 text-xs font-sans">
                <li className="flex items-center gap-1.5 text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>CertiK Audited</span>
                </li>
                <li className="flex items-center gap-1.5 text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>OpenZeppelin Libs</span>
                </li>
                <li>
                  <a
                    href="https://robinhood.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/70 hover:text-[#d4fc50] transition-colors"
                  >
                    Robinhood Chain Docs
                  </a>
                </li>
                <li>
                  <span className="text-white/50 text-[11px] font-mono">
                    LP Burn: 0x00...dead
                  </span>
                </li>
                <li>
                  <span className="text-white/50 text-[11px] font-mono">
                    V4 Hook Verified
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pons-Style Risk Disclaimer */}
        <div className="py-6 border-b border-white/10 text-[11px] font-sans text-white/40 leading-relaxed">
          <p>
            <strong className="text-white/60">Non-Custodial Protocol Notice:</strong> Mikayla is a
            decentralized software application deployed on Robinhood Chain. All token launches operate
            via autonomous mathematical bonding curve algorithms. Digital tokens and creator assets
            are subject to extreme market volatility and risk of total loss. This platform does not
            provide investment advice, custody funds, or solicit security transactions. Liquidity is
            permanently locked in Uniswap V4 smart contracts upon graduation. Always perform independent
            due diligence before executing smart contract transactions.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} Mikayla Protocol</span>
            <span>•</span>
            <span>Robinhood Chain Ecosystem</span>
            <span>•</span>
            <span className="text-white/60">Block #8,941,204</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://x.com/mikaylafun"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#d4fc50] transition-colors"
            >
              Twitter / X
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#d4fc50] transition-colors"
            >
              Telegram
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#d4fc50] transition-colors"
            >
              GitHub
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <span>↑</span>
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Footer;
