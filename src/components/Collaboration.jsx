import React, { useState } from "react";
import { logo } from "../assets";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import DecryptedText from "./react-bits/DecryptedText";

const ecosystemItems = [
  {
    title: "Robinhood Chain L2 Execution",
    description:
      "Sub-second block times and sub-penny gas fees (<$0.001 per swap) make trading creator shares frictionless for over 24 million retail traders.",
    tag: "SPEED & SCALE",
  },
  {
    title: "Native Creator Leverage (Up to 3.2x)",
    description:
      "The first launchpad offering perpetual futures on creator market caps. Go long on rising creators or hedge market volatility with deep pooled liquidity.",
    tag: "DEFI INNOVATION",
  },
  {
    title: "Permanent Anti-Rug Protection",
    description:
      "Bonding curves graduate automatically into Uniswap V4 liquidity pools with 100% of LP tokens burned forever on-chain.",
    tag: "SECURITY",
  },
];

const ecosystemLogos = [
  { name: "Robinhood", label: "Robinhood L2", symbol: "RH" },
  { name: "Uniswap", label: "Uniswap V4", symbol: "UNI" },
  { name: "Raydium", label: "Raydium DEX", symbol: "RAY" },
  { name: "OnlyFans", label: "Creator Content", symbol: "OF" },
  { name: "Fansly", label: "Adult Creator", symbol: "FA" },
  { name: "Phantom", label: "Self-Custody", symbol: "PH" },
];

const Collaboration = () => {
  const [leverageSide, setLeverageSide] = useState("long"); // 'long' | 'short'
  const [leverageMult, setLeverageMult] = useState(2.5);
  const [collateralEth, setCollateralEth] = useState(1.0);
  const [leverageToast, setLeverageToast] = useState(null);

  const positionSizeEth = (collateralEth * leverageMult).toFixed(2);
  const positionSizeUsd = (collateralEth * leverageMult * 2800).toLocaleString();
  const liqDistance = (100 / leverageMult * 0.85).toFixed(1);

  const handleSimulatePosition = () => {
    setLeverageToast(
      `Simulated ${leverageMult}x ${leverageSide.toUpperCase()} on $MIKA executed on Robinhood Chain!`
    );
    setTimeout(() => setLeverageToast(null), 3500);
  };

  return (
    <section id="collaboration" className="relative py-20 lg:py-28 bg-[#080808] border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#d4fc50]/[0.02] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Ecosystem Text & Features (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs uppercase tracking-widest text-[#a8c3a0]">
              <span className="w-2 h-2 rounded-full bg-[#d4fc50]" />
              <ShinyText text="DECENTRALIZED PERPETUAL TERMINAL" speed={3} className="text-[#a8c3a0]" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
              Bridging Creator Influence with <br />
              <span className="text-[#d4fc50] italic font-light">Robinhood Chain 3.2x Leverage</span>
            </h2>

            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              We eliminated the barrier between social clout and professional financial markets.
              Creators unlock instant liquid equity without debt, while traders access the world’s
              first decentralized creator perpetual leverage terminal.
            </p>

            <div className="space-y-4 pt-4">
              {ecosystemItems.map((item, idx) => (
                <SpotlightCard
                  key={idx}
                  className="p-4 bg-[#0e100e] border border-white/5"
                  spotlightColor="rgba(212, 252, 80, 0.1)"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono text-[#a8c3a0] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed pl-3.5">
                    {item.description}
                  </p>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Right: Interactive 3.2x Leverage Simulator Terminal (6 Cols) */}
          <div className="lg:col-span-6">
            <SpotlightCard
              className="p-6 sm:p-8 border border-white/15"
              spotlightColor="rgba(212, 252, 80, 0.16)"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center">
                    <img src={logo} alt="Mikayla" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      Creator Leverage Terminal
                    </h3>
                    <div className="text-xs font-mono text-white/40">
                      Oracle:{" "}
                      <DecryptedText
                        text="Robinhood Fast Finality (<400ms)"
                        speed={35}
                        className="text-[#10b981]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl font-mono text-xs">
                  <button
                    onClick={() => setLeverageSide("long")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 text-xs ${
                      leverageSide === "long"
                        ? "bg-[#d4fc50] text-black shadow-md shadow-[#d4fc50]/20"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    <span>LONG</span>
                  </button>
                  <button
                    onClick={() => setLeverageSide("short")}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 text-xs ${
                      leverageSide === "short"
                        ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>SHORT</span>
                  </button>
                </div>
              </div>

              {/* Leverage Multiplier Slider */}
              <div className="space-y-4 mb-6 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Leverage Multiplier:</span>
                  <span className="text-[#d4fc50] font-bold text-lg">{leverageMult}x Max</span>
                </div>

                <input
                  type="range"
                  min="1.0"
                  max="3.2"
                  step="0.1"
                  value={leverageMult}
                  onChange={(e) => setLeverageMult(parseFloat(e.target.value))}
                  className="w-full accent-[#d4fc50] cursor-pointer h-2 bg-white/10 rounded-lg"
                />

                <div className="flex justify-between text-[10px] text-white/30">
                  <span>1.0x (Spot)</span>
                  <span>2.0x (Balanced)</span>
                  <span className="text-[#d4fc50]">3.2x (Max Protocol Cap)</span>
                </div>
              </div>

              {/* Collateral & Position Specs */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs mb-6">
                <div>
                  <div className="text-white/40 text-[10px] uppercase">Collateral Margin</div>
                  <div className="text-white font-bold text-sm mt-0.5">{collateralEth} ETH ($2,800)</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase">Position Size</div>
                  <div className="text-[#d4fc50] font-bold text-sm mt-0.5">
                    {positionSizeEth} ETH (${positionSizeUsd})
                  </div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase">Est. Liquidation Buffer</div>
                  <div className="text-[#30d158] font-bold text-sm mt-0.5">{liqDistance}% Spread</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase">Funding Rate (8h)</div>
                  <div className="text-white/80 font-bold text-sm mt-0.5">+0.008% USDC</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSimulatePosition}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4fc50] to-[#e4ff75] text-[#080808] font-sans font-bold text-sm hover:opacity-95 transition-all shadow-xl shadow-[#d4fc50]/20 flex items-center justify-center gap-2"
              >
                <span>Simulate {leverageMult}x {leverageSide.toUpperCase()} Position</span>
                <span className="font-mono">→</span>
              </button>

              {leverageToast && (
                <div className="mt-4 p-3 rounded-xl bg-[#d4fc50]/15 border border-[#d4fc50]/40 text-xs font-mono text-[#d4fc50] text-center animate-fadeIn flex items-center justify-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#d4fc50] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{leverageToast}</span>
                </div>
              )}

              {/* Ecosystem Node Badges */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40">
                <span>Integrated Ecosystem:</span>
                <div className="flex items-center gap-2">
                  {ecosystemLogos.slice(0, 4).map((node, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-white/70 text-[10px]">
                      {node.symbol}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaboration;
