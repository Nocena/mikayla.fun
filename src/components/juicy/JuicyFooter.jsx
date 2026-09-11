import React, { useState } from "react";
import { ArrowUpRight, Copy, Check, Shield } from "lucide-react";
import { JUICY_CONFIG } from "../../constants/juicy";

export default function JuicyFooter() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JUICY_CONFIG.ca);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="relative bg-[#050605] border-t border-white/10 pt-16 pb-12 text-[#f4f4f2] overflow-hidden">
      <div className="max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d4fc50] bg-black shrink-0">
                <img src="/creators/msjuicy.jpg" alt="Ms Juicy P" className="w-full h-full object-cover" />
              </div>
              <span className="font-gta text-2xl text-white tracking-wider">
                MS JUICY P
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#d4fc50]/15 text-[#d4fc50] border border-[#d4fc50]/30 font-bold">
                $JUICY
              </span>
            </div>

            <p className="text-xs text-white/60 max-w-md font-sans font-light leading-relaxed mb-4">
              The flagship artist launchpad drop by Mikayla.fun, expanding Sex Capital Markets onto Robinhood Chain L2. Powered by continuous on-chain buybacks and industrial cash incinerator burns.
            </p>

            <div className="flex items-center gap-2 font-mono text-xs text-white/50">
              <span className="w-2 h-2 rounded-full bg-[#30d158]" />
              <span>Robinhood Chain L2 Mainnet Verified</span>
            </div>
          </div>

          {/* Quick Technical Specs */}
          <div className="md:col-span-3 font-mono text-xs">
            <div className="text-[10px] uppercase tracking-widest text-[#d4fc50] mb-3">
              SYNDICATE NETWORK
            </div>
            <ul className="space-y-2 text-white/70">
              <li>
                <span className="text-white/40">Chain:</span> Robinhood L2
              </li>
              <li>
                <span className="text-white/40">Graduation:</span> 4.20 ETH
              </li>
              <li>
                <span className="text-white/40">Curve:</span> Constant Product
              </li>
              <li>
                <span className="text-white/40">Burn Match:</span> 50% Platform Match
              </li>
            </ul>
          </div>

          {/* Official Verification Links */}
          <div className="md:col-span-3 font-mono text-xs">
            <div className="text-[10px] uppercase tracking-widest text-[#d4fc50] mb-3">
              OFFICIAL LINKS
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href={JUICY_CONFIG.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#d4fc50] transition-colors flex items-center gap-1"
                >
                  <span>@msjuicy_plenty (80K+ on X)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={JUICY_CONFIG.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#d4fc50] transition-colors flex items-center gap-1"
                >
                  <span>Co-Creator @CyreneAI</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={JUICY_CONFIG.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#d4fc50] transition-colors flex items-center gap-1"
                >
                  <span>Robinhood Blockscout Explorer</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-[#d4fc50] hover:underline flex items-center gap-1 font-bold"
                >
                  <span>← Mikayla.fun Home</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-white/40">
          <div>
            © 2026 Ms Juicy P Syndicate · Mikayla Launchpad · All rights reserved.
          </div>
          <div>
            Disclaimer: Experimental creator asset. Digital entertainment collectible utility only.
          </div>
        </div>
      </div>
    </footer>
  );
}
