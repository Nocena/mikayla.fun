import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logo } from "../assets";
import LightRays from "./react-bits/LightRays";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import BlurText from "./react-bits/BlurText";
import DecryptedText from "./react-bits/DecryptedText";
import TiltedCard from "./react-bits/TiltedCard";
import HeroScrollCanvas from "./HeroScrollCanvas";

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

const SCENE_WINDOWS = [
  { id: 0, label: "Overview", tag: "SCM Launchpad", enter: 0.00, fullIn: 0.00, fullOut: 0.14, exit: 0.18, jumpProgress: 0.00 },
  { id: 1, label: "What is SCM", tag: "Paradigm", enter: 0.20, fullIn: 0.24, fullOut: 0.35, exit: 0.39, jumpProgress: 0.28 },
  { id: 2, label: "Creator Drops", tag: "Live Curves", enter: 0.41, fullIn: 0.45, fullOut: 0.55, exit: 0.59, jumpProgress: 0.48 },
  { id: 3, label: "Burn Vault", tag: "Utility", enter: 0.61, fullIn: 0.65, fullOut: 0.75, exit: 0.79, jumpProgress: 0.68 },
  { id: 4, label: "$MIKA Terminal", tag: "Trade & Earn", enter: 0.81, fullIn: 0.85, fullOut: 1.00, exit: 1.00, jumpProgress: 0.92 },
];

export default function Hero() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);

  // Terminal & Trading State
  const [activeTab, setActiveTab] = useState("chart");
  const [timeframe, setTimeframe] = useState("1D");
  const [ethAmount, setEthAmount] = useState("0.5");
  const [isExecuting, setIsExecuting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [simEth, setSimEth] = useState(1.0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [copiedCA, setCopiedCA] = useState(false);
  const chartSvgRef = useRef(null);

  const handleCopyCA = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    navigator.clipboard.writeText("0x71C25860d5Fa7F602B734a6C31208639F45e42b0");
    setCopiedCA(true);
    setToastMessage("Copied $MIKA Contract Address to clipboard!");
    setTimeout(() => {
      setCopiedCA(false);
      setToastMessage(null);
    }, 3000);
  };

  const data = chartDatasets[timeframe];
  const activeDataPoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];

  // Throttled scroll progress listener using requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    let lastProgress = -1;
    let lastScene = -1;

    const updateScroll = () => {
      if (!containerRef.current) {
        ticking = false;
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      // Skip updates when hero container is outside viewport
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        ticking = false;
        return;
      }

      const totalDistance = rect.height - window.innerHeight;
      if (totalDistance <= 0) {
        ticking = false;
        return;
      }

      const progress = Math.max(0, Math.min(1, -rect.top / totalDistance));
      if (Math.abs(progress - lastProgress) > 0.001) {
        lastProgress = progress;
        setScrollProgress(progress);
      }

      let bestScene = 0;
      let minDistance = Infinity;
      SCENE_WINDOWS.forEach((sw) => {
        const center = (sw.fullIn + sw.fullOut) / 2;
        const dist = Math.abs(progress - center);
        if (dist < minDistance) {
          minDistance = dist;
          bestScene = sw.id;
        }
      });
      if (bestScene !== lastScene) {
        lastScene = bestScene;
        setCurrentScene(bestScene);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToScene = (sceneIndex) => {
    if (!containerRef.current) return;
    const targetProgress = SCENE_WINDOWS[sceneIndex].jumpProgress;
    const containerTop = containerRef.current.offsetTop;
    const totalDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + targetProgress * totalDistance;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
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
      setToastMessage(`Swapped ${ethAmount} ETH for ${tokensReceived} $MIKA on Robinhood Chain!`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  // Dynamic SVG Chart Path Generators
  const chartWidth = 400;
  const chartHeight = 160;
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(...prices) * 1.05;

  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((d.price - minPrice) / (maxPrice - minPrice)) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

  const areaD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  const handleChartMouseMove = (e) => {
    if (!chartSvgRef.current) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.round(ratio * (data.length - 1));
    setHoverIndex(index);
  };

  const currentPoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  // Strict non-overlapping opacity calculation
  const getSceneOpacity = (sceneIdx) => {
    const w = SCENE_WINDOWS[sceneIdx];
    if (scrollProgress < w.enter || scrollProgress > w.exit) return 0;
    if (scrollProgress >= w.fullIn && scrollProgress <= w.fullOut) return 1;
    if (scrollProgress < w.fullIn) {
      const denom = w.fullIn - w.enter;
      return denom > 0 ? (scrollProgress - w.enter) / denom : 1;
    }
    if (scrollProgress > w.fullOut) {
      const denom = w.exit - w.fullOut;
      return denom > 0 ? (w.exit - scrollProgress) / denom : 0;
    }
    return 0;
  };

  // Kinetic directional glide transition (entering up from +24px, exiting up to -24px)
  const getSceneTransform = (sceneIdx) => {
    const w = SCENE_WINDOWS[sceneIdx];
    if (scrollProgress < w.enter) {
      return "translate3d(0, 24px, 0)";
    }
    if (scrollProgress < w.fullIn) {
      const p = (scrollProgress - w.enter) / (w.fullIn - w.enter);
      const y = (1 - p) * 24;
      return `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
    if (scrollProgress <= w.fullOut) {
      return "translate3d(0, 0px, 0)";
    }
    if (scrollProgress <= w.exit) {
      const p = (scrollProgress - w.fullOut) / (w.exit - w.fullOut);
      const y = -p * 24;
      return `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
    return "translate3d(0, -24px, 0)";
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[500vh] bg-[#080808] text-[#f4f4f2] overflow-visible"
    >
      {/* Pinned Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* Background Video Frame Scrubbing Canvas */}
        <HeroScrollCanvas progress={scrollProgress} />

        {/* Subtle Ambient Volumetric Glow */}
        <LightRays
          raysColor="#d4fc50"
          raysSpeed={0.4}
          lightSpread={1.1}
          rayLength={2.0}
          pulsating={true}
          noiseAmount={0.03}
          followMouse={false}
          className="opacity-20 pointer-events-none z-[1]"
        />

        {/* Global Floating Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-[#080808]/95 border border-[#d4fc50] text-white shadow-[0_0_25px_rgba(212,252,80,0.25)] flex items-center gap-2.5 backdrop-blur-xl rounded-none"
            >
              <span className="w-1.5 h-1.5 bg-[#d4fc50]" />
              <span className="text-xs font-mono">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Stage: Left-Aligned Editorial Scenes (Sharp Architectural Aesthetic) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 h-full flex items-center pointer-events-none">

          {/* ========================================================= */}
          {/* SCENE 0: HERO SHOT & PROTOCOL INTRODUCTION               */}
          {/* ========================================================= */}
          {(() => {
            const opacity = getSceneOpacity(0);
            return (
              <div
                className={`absolute inset-y-0 left-6 sm:left-12 lg:left-20 pt-14 pb-6 w-full max-w-xl lg:max-w-2xl text-left flex flex-col justify-center transition-opacity duration-200 ${
                  opacity > 0.05 ? "pointer-events-auto" : "pointer-events-none"
                }`}
                style={{
                  opacity,
                  visibility: opacity > 0 ? "visible" : "hidden",
                }}
              >
                <div style={{ transform: getSceneTransform(0) }}>
                  {/* Monospace Architectural Tag */}
                  <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-[#d4fc50] uppercase mb-4 border-l-2 border-[#d4fc50] pl-3 py-0.5">
                    <span>[ 01 // ROBINHOOD PROTOCOL ]</span>
                    <span className="text-white/30 hidden sm:inline">|</span>
                    <span className="text-white/60 hidden sm:inline text-[10px]">SOLANA → ROBINHOOD EXPANSION</span>
                  </div>

                  {/* Official CA Capsule with 1-Click Copy */}
                  <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 border-t border-white/20 border-x border-b border-white/10 text-xs font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                      <span className="text-[#d4fc50] text-[10px] font-bold tracking-wider">CA:</span>
                      <code className="text-white font-mono text-[11px] truncate max-w-[170px] sm:max-w-[210px]">
                        0x71C25860d5Fa7F602B734a6C31208639F45e42b0
                      </code>
                      <button
                        onClick={handleCopyCA}
                        className={`btn-tactile px-2 py-0.5 rounded text-[10px] font-mono font-medium cursor-pointer transition-colors ${
                          copiedCA
                            ? "bg-[#d4fc50] text-black"
                            : "bg-white/10 hover:bg-[#d4fc50] hover:text-black text-white"
                        }`}
                      >
                        {copiedCA ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <span className="text-[10px] font-mono text-white/60 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
                      Robinhood L2 Verified
                    </span>
                  </div>

                  {/* Bold Editorial Headline (Apple Optical Display Typography) */}
                  <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-serif text-white tracking-display leading-[1.04] mb-3 sm:mb-4">
                    Sex Capital Markets.<br />
                    <span className="italic font-light text-[#d4fc50]">Tokenized on Robinhood.</span>
                  </h1>

                  {/* Editorial Narrative */}
                  <p className="text-xs sm:text-sm text-white/75 max-w-lg leading-relaxed font-sans font-light mb-4 sm:mb-5 border-l border-white/15 pl-3.5">
                    Solana's premier SCM launchpad is expanding to Robinhood Chain L2. <strong className="text-white font-medium">50% of all launch and platform profits are permanently routed on-chain to buy back and burn $MIKA supply.</strong>
                  </p>

                  {/* Metrics Matrix */}
                  <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg mb-6 sm:mb-7 py-3 sm:py-4 border-y border-white/10">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Market TAM</div>
                      <div className="text-lg sm:text-xl font-mono font-bold text-white">$60.2B</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Pre-Allocation</div>
                      <div className="text-lg sm:text-xl font-mono font-bold text-[#d4fc50]">0.00%</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Profit Burn</div>
                      <div className="text-lg sm:text-xl font-mono font-bold text-white">50% to $MIKA</div>
                    </div>
                  </div>

                  {/* Sharp Geometric Actions with Instant Tactile Feedback */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => scrollToScene(1)}
                      className="btn-tactile px-6 sm:px-7 py-3 sm:py-3.5 bg-[#d4fc50] text-[#080808] font-mono font-bold text-xs uppercase tracking-widest hover:bg-white cursor-pointer rounded-none flex items-center gap-2.5"
                    >
                      <span>Explore Paradigm</span>
                      <span>→</span>
                    </button>
                    <a
                      href="#upcoming-drops"
                      className="btn-tactile px-5 sm:px-6 py-3 sm:py-3.5 border border-white/20 bg-black/40 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-widest rounded-none flex items-center gap-2"
                    >
                      <span>Upcoming Drops (Fri, Sun, Tue)</span>
                      <span>↓</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* SCENE 1: WHAT IS SCM & ROOTS                              */}
          {/* ========================================================= */}
          {(() => {
            const opacity = getSceneOpacity(1);
            return (
              <div
                className={`absolute inset-y-0 left-6 sm:left-12 lg:left-20 pt-14 pb-6 w-full max-w-xl lg:max-w-2xl text-left flex flex-col justify-center transition-opacity duration-200 ${
                  opacity > 0.05 ? "pointer-events-auto" : "pointer-events-none"
                }`}
                style={{
                  opacity,
                  visibility: opacity > 0 ? "visible" : "hidden",
                }}
              >
                <div style={{ transform: getSceneTransform(1) }}>
                  {/* System Architecture Tagline */}
                  <div className="inline-flex flex-wrap items-center gap-2.5 font-mono text-[11px] tracking-widest text-[#d4fc50] uppercase mb-4 border-l-2 border-[#d4fc50] pl-3 py-0.5">
                    <span className="whitespace-nowrap font-medium">[ 02 // SCM ORIGINS & ADVANTAGE ]</span>
                    <span className="text-white/20 hidden sm:inline">|</span>
                    <span className="text-white/60 text-[10px] tracking-wider whitespace-nowrap">
                      <ShinyText text="AGENCY EXPERTISE & DEEP MARKET ROOTS" speed={3.5} className="text-white/70" />
                    </span>
                  </div>

                  {/* Editorial Headline */}
                  <h2 className="text-3xl sm:text-5xl lg:text-[50px] font-serif text-white tracking-tight leading-[1.06] mb-4">
                    From AI Chatters to<br />
                    <span className="italic font-serif text-[#d4fc50]">
                      <ShinyText text="Sex Capital Markets." speed={2.8} className="text-[#d4fc50]" />
                    </span>
                  </h2>

                  {/* Core Narrative Paragraph */}
                  <p className="text-xs sm:text-sm text-white/75 font-sans font-light leading-relaxed mb-6 border-l border-white/15 pl-3.5 max-w-xl">
                    Mikayla originally began as an AI chatter assistant—yielding deep insider mastery over creator operations, chatter conversions, and the cashflows of top-earning models. That operational engine evolved into Solana's premier SCM launchpad, and is now being brought to <strong className="text-white font-medium">Robinhood Chain</strong>.
                  </p>

                  {/* Two ReactBits Spotlight Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-5">
                    {/* Pillar 1: Agency Relationships */}
                    <SpotlightCard
                      className="p-5 bg-[#0a0c0a]/85 border-white/10 rounded-2xl transition-all duration-300 hover:border-[#d4fc50]/30 backdrop-blur-xl"
                      spotlightColor="rgba(212, 252, 80, 0.16)"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4fc50]/10 border border-[#d4fc50]/25 text-[10px] font-mono uppercase tracking-wider text-[#d4fc50] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
                          Agency Network
                        </div>
                        <span className="text-[10px] font-mono text-white/40">Direct Talent</span>
                      </div>

                      <h3 className="text-sm font-sans font-bold text-white mb-2 tracking-tight">
                        <DecryptedText text="Agency Relationships" speed={30} animateOn="hover" className="text-white" />
                      </h3>

                      <p className="text-xs text-white/70 leading-relaxed font-sans font-light mb-4">
                        Built on direct relationships with verified models and top management agencies. Not anonymous devs—real talent with organic followings.
                      </p>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-white/40">Creator Roster</span>
                        <span className="text-[#d4fc50] font-medium">100% Curated & KYC'd</span>
                      </div>
                    </SpotlightCard>

                    {/* Pillar 2: Robinhood L2 Settlement */}
                    <SpotlightCard
                      className="p-5 bg-[#0a0c0a]/85 border-white/10 rounded-2xl transition-all duration-300 hover:border-white/25 backdrop-blur-xl"
                      spotlightColor="rgba(255, 255, 255, 0.12)"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono uppercase tracking-wider text-white/80 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Infrastructure
                        </div>
                        <span className="text-[10px] font-mono text-white/40">Robinhood L2</span>
                      </div>

                      <h3 className="text-sm font-sans font-bold text-white mb-2 tracking-tight">
                        <DecryptedText text="Robinhood L2 Settlement" speed={30} animateOn="hover" className="text-white" />
                      </h3>

                      <p className="text-xs text-white/70 leading-relaxed font-sans font-light mb-4">
                        Sub-second finality, negligible gas (&lt;$0.001), and fair deterministic bonding curves accessible to 24M+ retail investors.
                      </p>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-white/40">Tx Finality</span>
                        <span className="text-[#a8c3a0] font-medium">&lt;400ms · &lt;$0.001 Gas</span>
                      </div>
                    </SpotlightCard>
                  </div>

                  {/* Liquid-Glass Footer Ticker Banner */}
                  <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-[11px] sm:text-xs font-mono text-white/80 w-full">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50] shrink-0" />
                      <span className="text-white/75 truncate">
                        Viral narrative built for high-conviction trading on Phantom & Robinhood
                      </span>
                    </div>

                    <button
                      onClick={() => scrollToScene(2)}
                      className="inline-flex items-center gap-1 text-[#d4fc50] hover:text-white transition-colors cursor-pointer shrink-0 font-medium pl-2 border-l border-white/10"
                    >
                      <span>Drops</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* SCENE 2: CREATOR COIN LAUNCHES (FRI, SUN, TUE)             */}
          {/* ========================================================= */}
          {(() => {
            const opacity = getSceneOpacity(2);
            return (
              <div
                className={`absolute inset-y-0 left-6 sm:left-12 lg:left-20 pt-14 pb-6 w-full max-w-xl lg:max-w-2xl text-left flex flex-col justify-center transition-opacity duration-200 ${
                  opacity > 0.05 ? "pointer-events-auto" : "pointer-events-none"
                }`}
                style={{
                  opacity,
                  visibility: opacity > 0 ? "visible" : "hidden",
                }}
              >
                <div style={{ transform: getSceneTransform(2) }}>
                  {/* System Architecture Tagline */}
                  <div className="inline-flex flex-wrap items-center gap-2.5 font-mono text-[11px] tracking-widest text-[#d4fc50] uppercase mb-3 border-l-2 border-[#d4fc50] pl-3 py-0.5 whitespace-nowrap">
                    <span className="font-medium">[ 03 // LAUNCH CALENDAR ]</span>
                    <span className="text-white/20 hidden sm:inline">|</span>
                    <span className="text-white/60 text-[10px] tracking-wider whitespace-nowrap">
                      <ShinyText text="TOP 0.1% ONLYFANS CREATOR COHORT" speed={3.5} className="text-white/70" />
                    </span>
                  </div>

                  {/* Editorial Headline */}
                  <h2 className="text-3xl sm:text-5xl lg:text-[48px] font-serif text-white tracking-tight leading-[1.06] mb-2">
                    Top 0.1% OnlyFans Drops.<br />
                    <span className="italic font-serif text-[#d4fc50]">
                      <ShinyText text="Agency Signed & Contract Locked." speed={2.8} className="text-[#d4fc50]" />
                    </span>
                  </h2>

                  <p className="text-xs sm:text-sm text-white/70 font-sans font-light leading-relaxed mb-4 max-w-xl">
                    Scheduled weekly drops for verified high-earning creators. Creator handles and tickers are embargoed under pre-launch NDA until countdown zero to guarantee 100% fair launch orderflow.
                  </p>

                  {/* 3 Polished Creator Rows */}
                  <div className="space-y-3 w-full mb-4">
                    {/* Drop 1 */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#0a0c0a]/85 border border-white/10 hover:border-[#d4fc50]/40 transition-all backdrop-blur-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-[#d4fc50]/10 border border-[#d4fc50]/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-mono font-bold text-[#d4fc50]">01</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-sans font-bold text-white">Project ARIA</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4fc50]/15 text-[#d4fc50] font-semibold border border-[#d4fc50]/25 uppercase">
                              This Friday
                            </span>
                            <span className="text-[10px] font-mono text-white/40 hidden sm:inline">Top 0.05% OF</span>
                          </div>
                          <div className="text-[11px] text-white/60 font-mono">
                            1.4M+ Fans · Miami/Milan · Hold $50+ for Milan Penthouse 35mm Negatives
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-white">In 2 Days</div>
                        <div className="text-[10px] font-mono text-[#d4fc50]">Burns $MIKA</div>
                      </div>
                    </div>

                    {/* Drop 2 */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#0a0c0a]/85 border border-white/10 hover:border-white/20 transition-all backdrop-blur-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-mono font-bold text-white/80">02</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-sans font-bold text-white">Project KIRA</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-semibold border border-white/15 uppercase">
                              This Sunday
                            </span>
                            <span className="text-[10px] font-mono text-white/40 hidden sm:inline">Top 0.02% OF</span>
                          </div>
                          <div className="text-[11px] text-white/60 font-mono">
                            2.2M+ Fans · Los Angeles · Hold $50+ for Sunset Hills Penthouse Raw Gallery
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-white/90">In 4 Days</div>
                        <div className="text-[10px] font-mono text-[#d4fc50]">Burns $MIKA</div>
                      </div>
                    </div>

                    {/* Drop 3 */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#0a0c0a]/85 border border-white/10 hover:border-white/20 transition-all backdrop-blur-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-mono font-bold text-white/80">03</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-sans font-bold text-white">Project LUNA</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-semibold border border-white/15 uppercase">
                              Next Tuesday
                            </span>
                            <span className="text-[10px] font-mono text-white/40 hidden sm:inline">Top 0.01% OF</span>
                          </div>
                          <div className="text-[11px] text-white/60 font-mono">
                            3.6M+ Fans · London/Paris · Hold $50+ for Paris Studio 4K HDR Archive
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-white/90">In 6 Days</div>
                        <div className="text-[10px] font-mono text-[#d4fc50]">Burns $MIKA</div>
                      </div>
                    </div>
                  </div>

                  {/* Liquid-Glass Footer Ticker Banner */}
                  <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-[11px] sm:text-xs font-mono text-white/80 w-full">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50] shrink-0" />
                      <span className="text-white/75 truncate">
                        Identity reveals at T-0h to protect fair launch · 50% of launch profit burns $MIKA
                      </span>
                    </div>

                    <a
                      href="#upcoming-drops"
                      className="inline-flex items-center gap-1 text-[#d4fc50] hover:text-white transition-colors cursor-pointer shrink-0 font-medium pl-2 border-l border-white/10"
                    >
                      <span>Full Schedule</span>
                      <span>↓</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* SCENE 3: DUAL CREATOR TOKEN UTILITY                       */}
          {/* ========================================================= */}
          {(() => {
            const opacity = getSceneOpacity(3);
            return (
              <div
                className={`absolute inset-y-0 left-6 sm:left-12 lg:left-20 pt-14 pb-6 w-full max-w-xl lg:max-w-2xl text-left flex flex-col justify-center transition-opacity duration-200 ${
                  opacity > 0.05 ? "pointer-events-auto" : "pointer-events-none"
                }`}
                style={{
                  opacity,
                  visibility: opacity > 0 ? "visible" : "hidden",
                }}
              >
                <div style={{ transform: getSceneTransform(3) }}>
                  <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-[#d4fc50] uppercase mb-2.5 border-l-2 border-[#d4fc50] pl-3 py-0.5">
                    <span>[ 04 // CLEAR TOKEN UTILITY ]</span>
                    <span className="text-white/30 hidden sm:inline">|</span>
                    <span className="text-white/60 hidden sm:inline text-[10px]">HOLDER GATES & ON-SITE BURNS</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-[1.08] mb-1.5">
                    Two Clear Utility Mechanics.
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60 font-light mb-4">
                    Every creator coin has tangible utility built directly into the token's web page.
                  </p>

                  {/* 2 Utility Panels */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-3.5">
                    <div className="p-4 bg-black/80 border border-white/15">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#d4fc50] mb-1 font-semibold">
                        Utility 01 // Gate
                      </div>
                      <div className="text-base font-bold text-white mb-1.5">Hold ≥ $50 of Token</div>
                      <p className="text-xs text-white/70 font-light leading-relaxed mb-2">
                        At predetermined Market Cap milestones, anyone holding at least $50 of the creator's token automatically unlocks exclusive private content directly on their page.
                      </p>
                      <div className="text-[10px] font-mono text-white/40 border-t border-white/10 pt-1.5">
                        Incentive: Continuous Buy & Hold Pressure
                      </div>
                    </div>

                    <div className="p-4 bg-black/80 border border-white/15">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#ff79c6] mb-1 font-semibold">
                        Utility 02 // Burn
                      </div>
                      <div className="text-base font-bold text-white mb-1.5">Burn-to-Access Exclusives</div>
                      <p className="text-xs text-white/70 font-light leading-relaxed mb-2">
                        Fans can burn creator tokens directly on the website to purchase ultra-exclusive photo rolls and 4K masters, driving permanent deflationary pressure.
                      </p>
                      <div className="text-[10px] font-mono text-[#ff79c6] border-t border-white/10 pt-1.5">
                        Incentive: Permanent Supply Contraction
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-white/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
                    <span>Executed on Robinhood L2 with instant zero-friction settlement</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* SCENE 4: $MIKA TOKENOMICS & TERMINAL                      */}
          {/* ========================================================= */}
          {(() => {
            const opacity = getSceneOpacity(4);
            return (
              <div
                className={`absolute inset-y-0 left-6 sm:left-12 lg:left-20 pt-14 pb-6 w-full max-w-xl lg:max-w-2xl text-left flex flex-col justify-center transition-opacity duration-200 ${
                  opacity > 0.05 ? "pointer-events-auto" : "pointer-events-none"
                }`}
                style={{
                  opacity,
                  visibility: opacity > 0 ? "visible" : "hidden",
                }}
              >
                <div style={{ transform: getSceneTransform(4) }}>
                  <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-[#d4fc50] uppercase mb-2.5 border-l-2 border-[#d4fc50] pl-3 py-0.5">
                    <span>[ 05 // PROTOCOL TOKENOMICS ]</span>
                    <span className="text-white/30 hidden sm:inline">|</span>
                    <span className="text-white/60 hidden sm:inline text-[10px]">50% PROFIT BURN ENGINE</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-tight leading-[1.08] mb-1">
                    $MIKA Genesis Protocol Asset.
                  </h2>
                  <p className="text-xs text-white/60 font-light mb-2.5">
                    The parent equity asset capturing 50% of all creator launch profits on Robinhood Chain.
                  </p>

                  {/* CA & Utility Sink Pill */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/80 border border-white/20 text-[11px] font-mono">
                      <span className="text-[#d4fc50] text-[10px] font-bold">CA:</span>
                      <code className="text-white font-mono text-[10px] truncate max-w-[140px] sm:max-w-[180px]">
                        0x71C25860d5Fa7F602B734a6C31208639F45e42b0
                      </code>
                      <button
                        onClick={handleCopyCA}
                        className={`btn-tactile px-1.5 py-0.5 rounded text-[9px] font-mono font-medium cursor-pointer transition-colors ${
                          copiedCA
                            ? "bg-[#d4fc50] text-black"
                            : "bg-white/10 hover:bg-[#d4fc50] hover:text-black text-white"
                        }`}
                      >
                        {copiedCA ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <span className="text-[10px] font-mono text-[#d4fc50]">
                      50% of all launch & platform profits burn $MIKA
                    </span>
                  </div>

                  {/* Sharp Geometric Terminal Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full items-start">
                    {/* Chart Card */}
                    <div className="md:col-span-7 p-3.5 sm:p-4 bg-black/85 border-t border-white/20 border-x border-b border-white/10 rounded-none backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl font-mono font-bold text-white">
                            ${activeDataPoint.price.toFixed(4)}
                          </span>
                          <span className="text-xs font-mono text-[#30d158] font-semibold">+342.8%</span>
                        </div>
                        <div className="flex items-center gap-1 border border-white/15 p-0.5 text-[10px] font-mono rounded-none">
                          {["1D", "1W", "1M", "ALL"].map((tf) => (
                            <button
                              key={tf}
                              onClick={() => {
                                setTimeframe(tf);
                                setHoverIndex(null);
                              }}
                              className={`btn-tactile px-1.5 py-0.5 cursor-pointer rounded-none ${
                                timeframe === tf ? "bg-white text-black font-bold" : "text-white/60 hover:text-white"
                              }`}
                            >
                              {tf}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative w-full h-[110px] bg-black/40 border border-white/10 p-1 rounded-none">
                        <svg
                          ref={chartSvgRef}
                          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                          preserveAspectRatio="none"
                          onMouseMove={handleChartMouseMove}
                          onMouseLeave={() => setHoverIndex(null)}
                          className="w-full h-full cursor-crosshair overflow-visible"
                        >
                          <defs>
                            <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#d4fc50" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#d4fc50" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path d={areaD} fill="url(#heroGradient)" />
                          <path d={pathD} fill="none" stroke="#d4fc50" strokeWidth="1.5" strokeLinecap="round" />
                          {currentPoint && (
                            <circle cx={currentPoint.x} cy={currentPoint.y} r={3.5} fill="#d4fc50" />
                          )}
                        </svg>
                      </div>
                    </div>

                    {/* Swap Ticket */}
                    <div className="md:col-span-5 p-3.5 sm:p-4 bg-black/85 border-t border-[#d4fc50]/60 border-x border-b border-[#d4fc50]/30 rounded-none backdrop-blur-md shadow-[inset_0_1px_0_rgba(212,252,80,0.2)]">
                      <div className="flex justify-between items-center text-[11px] font-mono mb-2">
                        <span className="text-white font-medium">Robinhood L2 Swap</span>
                        <span className="text-[#d4fc50]">2% Buyback</span>
                      </div>

                      <form onSubmit={handleOrder} className="space-y-2">
                        <div className="bg-black/60 border border-white/15 p-2 flex justify-between items-center rounded-none">
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={ethAmount}
                            onChange={(e) => setEthAmount(e.target.value)}
                            className="w-20 bg-transparent text-xs font-mono text-white focus:outline-none"
                          />
                          <span className="text-xs font-mono font-bold text-[#d4fc50]">ETH</span>
                        </div>

                        <div className="bg-black/60 border border-white/15 p-2 flex justify-between items-center rounded-none">
                          <input
                            type="text"
                            readOnly
                            value={
                              ethAmount && parseFloat(ethAmount) > 0
                                ? (parseFloat(ethAmount) * 46728).toLocaleString(undefined, { maximumFractionDigits: 0 })
                                : "0"
                            }
                            className="w-24 bg-transparent text-xs font-mono text-white/70 focus:outline-none"
                          />
                          <span className="text-xs font-mono font-bold text-white">$MIKA</span>
                        </div>

                        <button
                          type="submit"
                          disabled={isExecuting}
                          className="btn-tactile w-full py-2.5 bg-[#d4fc50] text-[#080808] font-bold text-xs font-mono uppercase tracking-widest hover:bg-white cursor-pointer disabled:opacity-50 rounded-none"
                        >
                          {isExecuting ? "Executing..." : "Confirm Swap"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </section>
  );
}
