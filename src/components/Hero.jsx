import { useState, useRef } from "react";
import { logo } from "../assets";
import LightRays from "./react-bits/LightRays";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import DecryptedText from "./react-bits/DecryptedText";
import CountUp from "./react-bits/CountUp";

const chartDatasets = {
  "1D": [
    { time: "09:30 AM", price: 0.0098 },
    { time: "11:00 AM", price: 0.0124 },
    { time: "01:00 PM", price: 0.0115 },
    { time: "03:30 PM", price: 0.0189 },
    { time: "05:00 PM", price: 0.0245 },
    { time: "07:30 PM", price: 0.0210 },
    { time: "09:00 PM", price: 0.0340 },
    { time: "11:00 PM", price: 0.0385 },
    { time: "Now", price: 0.0428 },
  ],
  "1W": [
    { time: "Mon", price: 0.0042 },
    { time: "Tue", price: 0.0068 },
    { time: "Wed", price: 0.0112 },
    { time: "Thu", price: 0.0195 },
    { time: "Fri", price: 0.0260 },
    { time: "Sat", price: 0.0345 },
    { time: "Sun", price: 0.0428 },
  ],
  "1M": [
    { time: "Week 1", price: 0.0012 },
    { time: "Week 2", price: 0.0035 },
    { time: "Week 3", price: 0.0140 },
    { time: "Week 4", price: 0.0428 },
  ],
  "1Y": [
    { time: "Q1", price: 0.0005 },
    { time: "Q2", price: 0.0020 },
    { time: "Q3", price: 0.0110 },
    { time: "Q4", price: 0.0428 },
  ],
  "ALL": [
    { time: "Genesis", price: 0.0001 },
    { time: "Bonding", price: 0.0080 },
    { time: "Robinhood L2", price: 0.0210 },
    { time: "Current", price: 0.0428 },
  ],
};

const mockOrderbookAsks = [
  { price: "0.0435", amount: "18,400", total: "$800.40", width: "85%" },
  { price: "0.0432", amount: "12,100", total: "$522.72", width: "65%" },
  { price: "0.0430", amount: "24,800", total: "$1,066.40", width: "95%" },
  { price: "0.0429", amount: "8,900", total: "$381.81", width: "45%" },
];

const mockOrderbookBids = [
  { price: "0.0428", amount: "32,400", total: "$1,386.72", width: "100%" },
  { price: "0.0425", amount: "15,600", total: "$663.00", width: "70%" },
  { price: "0.0422", amount: "28,000", total: "$1,181.60", width: "88%" },
  { price: "0.0418", amount: "19,200", total: "$802.56", width: "60%" },
];

const Hero = () => {
  const [activeTab, setActiveTab] = useState("chart");
  const [timeframe, setTimeframe] = useState("1D");
  const [copied, setCopied] = useState(false);
  const [orderTab, setOrderTab] = useState("buy");
  const [ethAmount, setEthAmount] = useState("0.5");
  const [isExecuting, setIsExecuting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [simEth, setSimEth] = useState(1.0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const chartSvgRef = useRef(null);

  const contractAddress = "0xQCDgZ9RDarrnDq57GiSxPyWeJ3PKJndfMcHYkMWcyai";
  const data = chartDatasets[timeframe];
  const activeDataPoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];

  const handleCopyCA = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrder = (e) => {
    e.preventDefault();
    if (!ethAmount || parseFloat(ethAmount) <= 0) return;

    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      const tokensReceived = (parseFloat(ethAmount) * 46728).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      });
      setToastMessage(`Swapped ${ethAmount} ETH for ${tokensReceived} $MIKA on Robinhood Chain`);
      setTimeout(() => setToastMessage(null), 4500);
    }, 900);
  };

  const minPrice = Math.min(...data.map((d) => d.price)) * 0.9;
  const maxPrice = Math.max(...data.map((d) => d.price)) * 1.05;
  const chartWidth = 600;
  const chartHeight = 220;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((d.price - minPrice) / (maxPrice - minPrice)) * (chartHeight - 30) - 15;
    return { x, y, ...d };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX = (p0.x + p1.x) / 2;
    pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const areaD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  const handleChartMouseMove = (e) => {
    if (!chartSvgRef.current) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clientX / rect.width));
    const closestIdx = Math.round(ratio * (data.length - 1));
    setHoverIndex(closestIdx);
  };

  const currentPoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];
  const simTokens = Math.round(simEth * 46728);
  const simNewMcap = Math.round(48290 + simEth * 2800);
  const simNewGradPct = Math.min(100, 78.2 + simEth * 3.4).toFixed(1);

  return (
    <section id="hero" className="relative pt-32 lg:pt-36 pb-20 overflow-hidden">
      {/* Volumetric LightRays */}
      <LightRays
        raysColor="#d4fc50"
        raysSpeed={0.7}
        lightSpread={1.4}
        rayLength={2.2}
        pulsating={true}
        noiseAmount={0.06}
        followMouse={true}
        className="opacity-40 pointer-events-none"
      />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#d4fc50]/[0.04] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Explainer Headline for the Unknowing Degen */}
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-pulse" />
            <ShinyText
              text="THE CURATED SEX CAPITAL MARKET (SCM) LAUNCHPAD"
              className="text-xs font-mono uppercase tracking-widest text-[#d4fc50]"
              speed={3}
            />
            <span className="text-white/30 text-xs">•</span>
            <DecryptedText
              text="$MIKA TOKEN LIVE"
              className="text-xs font-mono text-white/90 font-bold"
              encryptedClassName="text-[#d4fc50] text-xs font-mono"
              speed={35}
            />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.05] mb-6">
            What is SCM? <br />
            <span className="italic font-light text-[#d4fc50]">Sex Capital Markets on Robinhood.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed font-sans">
            The creator and adult media industry does <strong>$60B+ in annual volume</strong>, yet has zero liquid financial markets. Fans donate with zero upside. 
            <br className="hidden sm:inline" />
            <strong>Mikayla fixes this.</strong> We are a <strong>selective, curated launchpad</strong> on Robinhood Chain: we work directly with verified, living top human creators (zero AI bots), conduct institutional due diligence, and launch liquid equity tokens. Holders <strong>burn $5, $10, or $25 in creator tokens</strong> directly through our launchpad to unlock exclusive 4K drops, camera roll dumps, and private PPV vaults—creating continuous deflationary buy-and-burn demand.
          </p>

          {/* Quick Degen Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <strong>Zero Public Scam Rugs</strong> (100% Curated)
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff007f]" />
              <strong>$5 / $10 / $25 Burn Utility</strong> (Deflationary Sinks)
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
              <strong>Drop #1 This Friday 8PM UTC</strong> ($ARIA)
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
              <strong>Protocol Token $MIKA Live</strong>
            </span>
          </div>
        </div>

        {/* Hero Interactive Grid: Left = $MIKA Token Terminal, Right = Instant Order Ticket */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Terminal Card (7 Cols) */}
          <SpotlightCard
            className="lg:col-span-7 p-6 sm:p-8"
            spotlightColor="rgba(212, 252, 80, 0.12)"
          >
            {/* Header: Token Info + Navigation Tabs */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0 drop-shadow-[0_0_12px_rgba(212,252,80,0.25)]">
                    <img src={logo} alt="Mikayla" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Mikayla Protocol
                      </h2>
                      <span className="text-xs font-mono text-[#d4fc50] bg-[#d4fc50]/10 px-2.5 py-0.5 rounded-full border border-[#d4fc50]/30 font-bold">
                        $MIKA
                      </span>
                    </div>
                    <span className="text-xs text-white/50 font-mono flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      Official Platform Token · Robinhood Chain L2
                    </span>
                  </div>
                </div>

                {/* Live Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                    ${activeDataPoint.price.toFixed(4)}
                  </span>
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-mono text-[#30d158] font-bold bg-[#30d158]/10 px-2.5 py-1 rounded-full border border-[#30d158]/20">
                    <span>↑</span>
                    <span>+342.8%</span>
                    <span className="text-white/40 text-[11px] font-normal hidden sm:inline">
                      From Fair Mint
                    </span>
                  </div>
                </div>
                <div className="text-xs font-mono text-white/40 mt-1">
                  Point: {activeDataPoint.time} · 24h Volume:{" "}
                  <strong className="text-white font-mono">$1.42M</strong> · 100% LP Burned
                </div>
              </div>

              {/* View Switcher: Chart vs Orderbook vs Simulator */}
              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-xs font-mono">
                  <button
                    onClick={() => setActiveTab("chart")}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeTab === "chart"
                        ? "bg-[#d4fc50] text-[#080808] font-bold shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Chart
                  </button>
                  <button
                    onClick={() => setActiveTab("orderbook")}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeTab === "orderbook"
                        ? "bg-[#d4fc50] text-[#080808] font-bold shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Orderbook
                  </button>
                  <button
                    onClick={() => setActiveTab("simulator")}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeTab === "simulator"
                        ? "bg-[#d4fc50] text-[#080808] font-bold shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Simulator
                  </button>
                </div>

                {activeTab === "chart" && (
                  <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 p-0.5 rounded-full text-[11px] font-mono">
                    {["1D", "1W", "1M", "1Y", "ALL"].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => {
                          setTimeframe(tf);
                          setHoverIndex(null);
                        }}
                        className={`px-2.5 py-0.5 rounded-full transition-all ${
                          timeframe === tf
                            ? "bg-white/20 text-white font-semibold"
                            : "text-white/40 hover:text-white"
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* TAB 1: SVG Chart */}
            {activeTab === "chart" && (
              <div
                className="relative w-full h-[220px] select-none cursor-crosshair"
                onMouseMove={handleChartMouseMove}
                onMouseLeave={() => setHoverIndex(null)}
                ref={chartSvgRef}
              >
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#d4fc50" stopOpacity="0.25" />
                      <stop offset="60%" stopColor="#d4fc50" stopOpacity="0.04" />
                      <stop offset="100%" stopColor="#d4fc50" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  <path d={areaD} fill="url(#chartGradient)" />
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#d4fc50"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {hoverIndex !== null && (
                    <>
                      <line
                        x1={currentPoint.x}
                        y1={0}
                        x2={currentPoint.x}
                        y2={chartHeight}
                        stroke="#d4fc50"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        opacity="0.6"
                      />
                      <circle
                        cx={currentPoint.x}
                        cy={currentPoint.y}
                        r="6"
                        fill="#d4fc50"
                        className="animate-ping opacity-40"
                      />
                      <circle
                        cx={currentPoint.x}
                        cy={currentPoint.y}
                        r="4.5"
                        fill="#d4fc50"
                        stroke="#080808"
                        strokeWidth="2"
                      />
                    </>
                  )}
                </svg>

                {hoverIndex !== null && (
                  <div
                    className="absolute top-2 pointer-events-none px-2.5 py-1 bg-[#090b09]/95 border border-[#d4fc50]/30 rounded-lg text-xs font-mono text-white shadow-xl backdrop-blur-md transform -translate-x-1/2"
                    style={{
                      left: `${(currentPoint.x / chartWidth) * 100}%`,
                    }}
                  >
                    <span className="text-[#d4fc50] font-bold">${currentPoint.price.toFixed(4)}</span>
                    <span className="text-white/40 ml-1.5">{currentPoint.time}</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Live Robinhood Orderbook */}
            {activeTab === "orderbook" && (
              <div className="w-full h-[220px] overflow-hidden flex flex-col justify-between font-mono text-xs p-2 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-center justify-between text-[11px] text-white/40 pb-1.5 border-b border-white/10 px-2">
                  <span>Price (ETH)</span>
                  <span>Amount ($MIKA)</span>
                  <span>Total (USD)</span>
                </div>

                <div className="space-y-1">
                  {mockOrderbookAsks.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="relative flex items-center justify-between px-2 py-0.5 rounded overflow-hidden"
                    >
                      <div
                        className="absolute right-0 top-0 bottom-0 bg-red-500/10 pointer-events-none"
                        style={{ width: item.width }}
                      />
                      <span className="text-red-400 font-bold z-10">{item.price}</span>
                      <span className="text-white/70 z-10">{item.amount}</span>
                      <span className="text-white/40 z-10">{item.total}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between px-2 py-1 bg-white/[0.03] border-y border-white/10 text-[11px]">
                  <span className="text-[#d4fc50] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50] animate-pulse" />
                    Spread 0.0001 ETH (0.23%)
                  </span>
                  <span className="text-white/50">Robinhood L2 Sub-second Fills</span>
                </div>

                <div className="space-y-1">
                  {mockOrderbookBids.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="relative flex items-center justify-between px-2 py-0.5 rounded overflow-hidden"
                    >
                      <div
                        className="absolute right-0 top-0 bottom-0 bg-[#d4fc50]/10 pointer-events-none"
                        style={{ width: item.width }}
                      />
                      <span className="text-[#d4fc50] font-bold z-10">{item.price}</span>
                      <span className="text-white/70 z-10">{item.amount}</span>
                      <span className="text-white/40 z-10">{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Curve Simulator */}
            {activeTab === "simulator" && (
              <div className="w-full h-[220px] flex flex-col justify-between p-4 rounded-xl bg-black/40 border border-white/5 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Simulate $MIKA Purchase:</span>
                  <span className="text-[#d4fc50] font-bold text-sm">{simEth} ETH</span>
                </div>

                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={simEth}
                  onChange={(e) => setSimEth(parseFloat(e.target.value))}
                  className="w-full accent-[#d4fc50] cursor-pointer h-2 bg-white/10 rounded-lg my-2"
                />

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="text-white/40 text-[10px] uppercase">You Receive</div>
                    <div className="text-white font-bold text-sm mt-0.5">
                      {simTokens.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="text-white/40 text-[10px] uppercase">New Market Cap</div>
                    <div className="text-[#d4fc50] font-bold text-sm mt-0.5">
                      ${simNewMcap.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="text-white/40 text-[10px] uppercase">Graduation</div>
                    <div className="text-[#a8c3a0] font-bold text-sm mt-0.5">{simNewGradPct}%</div>
                  </div>
                </div>

                <div className="text-[11px] text-white/50 text-center">
                  Predictive formula: <code className="text-[#d4fc50]">P = k · S²</code> on Robinhood Chain.
                </div>
              </div>
            )}

            {/* Bonding Curve Progress Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">$MIKA Graduation Progress</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#d4fc50]/10 text-[#d4fc50] text-[10px] font-bold">
                    Uniswap V4 Auto-Lock
                  </span>
                </div>
                <div className="text-white/80 font-bold tabular-nums">
                  <CountUp to={78.2} duration={2} />% Filled
                </div>
              </div>

              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#a8c3a0] via-[#d4fc50] to-[#e4ff75] rounded-full transition-all duration-700 relative"
                  style={{ width: "78.2%" }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between text-xs font-mono text-white/40">
                <span>
                  Current:{" "}
                  <strong className="text-white">
                    $<CountUp to={48290} separator="," duration={2} />
                  </strong>{" "}
                  FDV
                </span>
                <span>
                  Graduation Target: <strong className="text-[#d4fc50]">$69,000</strong> (4.20 ETH)
                </span>
              </div>
            </div>
          </SpotlightCard>

          {/* Right: Instant Order Ticket (5 Cols) */}
          <SpotlightCard
            className="lg:col-span-5 p-6 sm:p-8"
            spotlightColor="rgba(212, 252, 80, 0.15)"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOrderTab("buy")}
                  className={`px-5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    orderTab === "buy"
                      ? "bg-[#d4fc50] text-black shadow-lg shadow-[#d4fc50]/20"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Buy $MIKA
                </button>
                <button
                  type="button"
                  onClick={() => setOrderTab("sell")}
                  className={`px-5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    orderTab === "sell"
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Sell
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span>Robinhood L2</span>
              </div>
            </div>

            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-1.5">
                  <span>Pay with ETH</span>
                  <span>Balance: 3.420 ETH</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white font-bold focus:outline-none focus:border-[#d4fc50] transition-colors"
                    placeholder="0.0"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEthAmount("0.1")}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white"
                    >
                      0.1
                    </button>
                    <button
                      type="button"
                      onClick={() => setEthAmount("0.5")}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white"
                    >
                      0.5
                    </button>
                    <button
                      type="button"
                      onClick={() => setEthAmount("1.0")}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white"
                    >
                      1.0
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-white/60">
                  <span>You Receive</span>
                  <span className="text-[#d4fc50] font-bold text-sm tabular-nums">
                    {(parseFloat(ethAmount || 0) * 46728).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    $MIKA
                  </span>
                </div>
                <div className="flex items-center justify-between text-white/40 text-[11px]">
                  <span>$MIKA Staking Tier</span>
                  <span className="text-[#10b981] font-semibold">Tier 1 · Friday Drop Whitelist</span>
                </div>
                <div className="flex items-center justify-between text-white/40 text-[11px]">
                  <span>Network Gas Fee</span>
                  <span className="text-[#a8c3a0]">&lt;$0.001 (Robinhood L2)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isExecuting}
                className="w-full py-4 rounded-xl bg-[#d4fc50] text-[#080808] font-sans font-bold text-sm hover:bg-[#e4ff75] transition-all transform active:scale-95 shadow-xl shadow-[#d4fc50]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isExecuting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    <span>Executing on Robinhood Chain...</span>
                  </>
                ) : (
                  <>
                    <span>Buy $MIKA Now</span>
                    <span className="font-mono">→</span>
                  </>
                )}
              </button>
            </form>

            {toastMessage && (
              <div className="mt-4 p-3 rounded-xl bg-[#d4fc50]/15 border border-[#d4fc50]/40 text-xs font-mono text-[#d4fc50] flex items-center gap-2 animate-bounce">
                <svg className="w-4 h-4 text-[#d4fc50] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>{toastMessage}</span>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-white/40 mb-1.5">
                <span>$MIKA Robinhood L2 Contract</span>
                <span className="text-[#30d158] text-[10px]">Audited</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                <span className="text-white/80 truncate mr-2">{contractAddress}</span>
                <button
                  type="button"
                  onClick={handleCopyCA}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#d4fc50] hover:text-black transition-all shrink-0 text-[11px] font-semibold"
                >
                  {copied ? "Copied!" : "Copy CA"}
                </button>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

export default Hero;
