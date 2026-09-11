import React, { useState } from "react";
import { ArrowDownUp, Zap, Shield, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";
import { JUICY_CONFIG } from "../../constants/juicy";
import SpotlightCard from "../react-bits/SpotlightCard";
import DecryptedText from "../react-bits/DecryptedText";

export default function JuicyTradingTerminal() {
  const [ethAmount, setEthAmount] = useState("0.1");
  const [slippage, setSlippage] = useState("1.0");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapReceipt, setSwapReceipt] = useState(null);

  // Constant Product Bonding Curve Formula (k = x * y)
  const quoteReserve = 3.55;
  const tokenReserve = 472869449;

  const calculateTokensOut = (eth) => {
    const parsedEth = parseFloat(eth);
    if (!parsedEth || parsedEth <= 0 || isNaN(parsedEth)) return 0;
    const k = quoteReserve * tokenReserve;
    const newQuote = quoteReserve + parsedEth;
    const newTokenReserve = k / newQuote;
    return Math.max(0, tokenReserve - newTokenReserve);
  };

  const estimatedTokens = calculateTokensOut(ethAmount);
  const pricePerTokenUsd = 0.0000827;
  const totalCostUsd = ((parseFloat(ethAmount) || 0) * 2900).toFixed(2);

  const handleExecuteSwap = () => {
    if (!estimatedTokens || estimatedTokens <= 0) return;
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setSwapReceipt({
        amount: Math.floor(estimatedTokens).toLocaleString(),
        eth: ethAmount,
        txHash: "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      });
      setTimeout(() => setSwapReceipt(null), 6000);
    }, 1600);
  };

  return (
    <section
      id="terminal"
      className="relative py-24 lg:py-32 bg-[#060706] border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-[92rem] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 mb-3 font-mono text-xs uppercase tracking-widest text-[#ccff00]">
              <Zap className="w-3.5 h-3.5" />
              <span>ROBINHOOD CHAIN L2 BONDING CURVE</span>
            </div>
            <h2 className="font-gta text-5xl sm:text-7xl text-white tracking-tight leading-none uppercase">
              TRADING <span className="spray-underline">TERMINAL</span>
            </h2>
            <p className="text-white/60 text-xs sm:text-sm mt-3 max-w-xl font-sans font-light leading-relaxed">
              Direct mathematical price discovery. Acquire $JUICY tokens on the constant-product curve before it reaches the 4.2 ETH DEX graduation mark.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-white/50 bg-black/60 px-3.5 py-2 rounded-xl border border-white/10">
            <span>Graduation: </span>
            <strong className="text-[#ccff00]">1.87 / 4.2 ETH (44.6%)</strong>
          </div>
        </div>

        {/* Swap Receipt Banner */}
        {swapReceipt && (
          <div className="mb-8 p-4 rounded-xl bg-[#30d158]/15 border border-[#30d158] text-white font-mono text-xs flex items-center justify-between shadow-[0_0_25px_rgba(48,209,88,0.25)] animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#30d158] shrink-0" />
              <span>
                Swapped {swapReceipt.eth} ETH for {swapReceipt.amount} $JUICY on Robinhood L2!
              </span>
            </div>
            <a
              href={`${JUICY_CONFIG.explorerBaseUrl || "https://robinhoodchain.blockscout.com"}/tx/${swapReceipt.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ccff00] hover:underline flex items-center gap-1"
            >
              <span>Explorer Tx</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Live Running Underworld Market Ticker Tape */}
        <div className="w-full overflow-hidden bg-black/80 border-y border-white/10 py-2.5 mb-10 select-none backdrop-blur-md">
          <div className="animate-ticker text-xs font-mono tracking-widest text-[#ccff00] space-x-8">
            <span>● $JUICY/ETH: 0.0000827</span>
            <span className="text-white/40">|</span>
            <span className="text-white">24H VOLUME: $482,900 USD</span>
            <span className="text-white/40">|</span>
            <span className="text-[#30d158]">GRADUATION: 44.6% TO ROBINHOOD DEX</span>
            <span className="text-white/40">|</span>
            <span className="text-[#ff5e3a]">AUTO INCINERATOR TORCH: 50% ACTIVE</span>
            <span className="text-white/40">|</span>
            <span className="text-white">ROBINHOOD L2 SPEED: &lt; 200MS</span>
            <span className="text-white/40">|</span>
            <span className="text-[#ccff00]">ZERO MEV FRONTRUNNING</span>
            <span className="text-white/40">|</span>
            <span>● $JUICY/ETH: 0.0000827</span>
            <span className="text-white/40">|</span>
            <span className="text-white">24H VOLUME: $482,900 USD</span>
            <span className="text-white/40">|</span>
            <span className="text-[#30d158]">GRADUATION: 44.6% TO ROBINHOOD DEX</span>
            <span className="text-white/40">|</span>
            <span className="text-[#ff5e3a]">AUTO INCINERATOR TORCH: 50% ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: VICE CITY CASH EXCHANGE KIOSK */}
          <SpotlightCard
            spotlightColor="rgba(204, 255, 0, 0.14)"
            className="lg:col-span-6 p-6 sm:p-8 rounded-3xl !bg-black/95 !border-white/20 shadow-2xl relative overflow-hidden"
          >
            {/* Washi Tape Pin */}
            <div className="washi-tape -top-3.5 left-1/2 -translate-x-1/2 rotate-1" />

            {/* Manila Evidence Docket Header Banner */}
            <div className="evidence-docket-header -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 px-6 py-2.5 font-mono text-[10px] font-bold tracking-widest flex items-center justify-between border-b border-black/20">
              <span className="text-black uppercase">
                BUREAU DE CHANGE // OTC KIOSK #44
              </span>
              <span className="rubber-stamp-green text-[8px] py-0 px-1.5">
                0% TAX // AUDITED
              </span>
            </div>

            {/* Top Kiosk Controls */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10 font-mono text-xs">
              <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span>VICE CITY CASH EXCHANGE // L2</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                <span>Slippage:</span>
                {["0.5", "1.0", "2.5"].map((slip) => (
                  <button
                    key={slip}
                    onClick={() => setSlippage(slip)}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      slippage === slip
                        ? "bg-[#ccff00] text-black font-bold"
                        : "bg-black/50 text-white/60 hover:text-white"
                    }`}
                  >
                    {slip}%
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Buy Presets */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono text-white/40 uppercase">QUICK AMOUNT:</span>
              {["0.05", "0.1", "0.25", "0.5"].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setEthAmount(amt)}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono cursor-pointer transition-all ${
                    ethAmount === amt
                      ? "bg-[#ccff00] text-black font-bold shadow-[0_0_10px_rgba(204,255,0,0.3)]"
                      : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {amt} ETH
                </button>
              ))}
            </div>

            {/* ETH Input Box */}
            <div className="p-4 rounded-2xl bg-[#090b09] border border-white/10 mb-2">
              <div className="flex items-center justify-between text-xs font-mono text-white/40 mb-1.5">
                <span>YOU PAY</span>
                <span>Balance: 1.450 ETH</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <input
                  type="text"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="0.0"
                  className="bg-transparent text-2xl sm:text-3xl font-mono font-bold text-white focus:outline-none w-full"
                />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-mono text-xs font-bold shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#627eea]" />
                  <span>ETH</span>
                </div>
              </div>
              <div className="text-[11px] font-mono text-white/40 mt-1">
                ≈ ${totalCostUsd} USD
              </div>
            </div>

            {/* Flip Icon */}
            <div className="flex justify-center -my-2 relative z-10">
              <div className="w-9 h-9 rounded-full bg-black border border-white/20 flex items-center justify-center text-white/70 shadow-lg">
                <ArrowDownUp className="w-4 h-4 text-[#ccff00]" />
              </div>
            </div>

            {/* JUICY Output Box */}
            <div className="p-4 rounded-2xl bg-[#090b09] border border-white/10 mb-5">
              <div className="flex items-center justify-between text-xs font-mono text-white/40 mb-1.5">
                <span>YOU RECEIVE (ESTIMATED)</span>
                <span>Fixed Supply Pool</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#ccff00] truncate">
                  {estimatedTokens > 0
                    ? Math.floor(estimatedTokens).toLocaleString()
                    : "0"}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ccff00]/15 border border-[#ccff00]/40 text-[#ccff00] font-mono text-xs font-bold shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
                  <span>$JUICY</span>
                </div>
              </div>
              <div className="text-[11px] font-mono text-white/40 mt-1">
                ≈ ${pricePerTokenUsd} per $JUICY
              </div>
            </div>

            {/* Execution Details */}
            <div className="p-3.5 rounded-xl bg-[#0e110e] border border-white/10 text-xs font-mono space-y-1.5 mb-6 text-white/60">
              <div className="flex justify-between">
                <span>Price Impact</span>
                <span className="text-[#30d158]">&lt; 0.12%</span>
              </div>
              <div className="flex justify-between">
                <span>Network</span>
                <span className="text-white">Robinhood Chain L2</span>
              </div>
              <div className="flex justify-between">
                <span>Auto Incinerator Torch</span>
                <span className="text-[#ff5e3a]">50% of Swap Fee</span>
              </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleExecuteSwap}
              disabled={isSwapping || estimatedTokens <= 0}
              className={`btn-tactile w-full py-4 rounded-xl font-gta text-xl uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isSwapping
                  ? "bg-[#ccff00]/50 text-black animate-pulse"
                  : "bg-[#ccff00] hover:bg-white text-black shadow-[0_0_30px_rgba(204,255,0,0.45)]"
              }`}
            >
              <span>{isSwapping ? "CONFIRMING ON L2..." : "EXECUTE SWAP"}</span>
              <ArrowUpRight className="w-4 h-4 font-bold" />
            </button>
          </SpotlightCard>

          {/* RIGHT: LIVE ORDERBOOK / CURVE HEALTH */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0c0a] border border-white/15 shadow-xl relative overflow-hidden">
              {/* Washi Tape */}
              <div className="washi-tape -top-3.5 left-1/2 -translate-x-1/2 -rotate-1" />

              {/* Manila Docket Header Banner */}
              <div className="evidence-docket-header -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 px-6 py-2.5 font-mono text-[10px] font-bold tracking-widest flex items-center justify-between border-b border-black/20">
                <span className="text-black uppercase">
                  CURVE TELEMETRY // SPEC SHEET
                </span>
                <span className="rubber-stamp-yellow text-[8px] py-0 px-1.5">
                  100% FAIR LAUNCH
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                  <div className="text-[10px] font-mono uppercase text-white/40 mb-1">POOL LIQUIDITY</div>
                  <div className="text-2xl font-bold font-gta text-white tracking-wider">
                    3.55 ETH
                  </div>
                  <div className="text-xs font-mono text-[#ccff00] mt-0.5">≈ $10,295 USD</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                  <div className="text-[10px] font-mono uppercase text-white/40 mb-1">CIRCULATING</div>
                  <div className="text-2xl font-bold font-gta text-[#ccff00] tracking-wider">
                    527.1M $JUICY
                  </div>
                  <div className="text-xs font-mono text-white/50 mt-0.5">52.7% of Supply</div>
                </div>
              </div>

              {/* Graduation Meter */}
              <div className="p-4 rounded-2xl bg-black/70 border border-white/10 mb-6">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-white/50">GRADUATION PROGRESS</span>
                  <span className="text-[#ccff00] font-bold">1.87 / 4.2 ETH (44.6%)</span>
                </div>
                <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-white/15 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#ccff00] via-[#ffc876] to-[#30d158] rounded-full transition-all duration-700"
                    style={{ width: "44.6%" }}
                  />
                </div>
              </div>

              {/* Tactical Progression Steps */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs space-y-2.5 mb-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/60">01. CURVE LAUNCH</span>
                  <span className="text-[#30d158] font-bold">COMPLETED ✓</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white">02. BONDING POOL ACCUMULATION</span>
                  <span className="text-[#ccff00] font-bold">44.6% ACTIVE</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/40">03. DEX DEPOSIT & LP BURN</span>
                  <span className="text-white/40">AT 4.2 ETH</span>
                </div>
              </div>

              <p className="text-xs text-white/60 font-sans font-light leading-relaxed">
                When the bonding curve reaches 4.2 ETH, liquidity automatically deposits into Robinhood L2 DEX and the LP tokens are sent to 0x0...dead forever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
