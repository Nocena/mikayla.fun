import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { logo, brainwave } from "../assets";
import { navigation } from "../constants";
import LaunchTokenModal from "./LaunchTokenModal";
import SearchModal from "./SearchModal";

const marqueeItems = [
  { text: "[DROP 01] $ARIA launches FRIDAY 8PM UTC (Aria Brooks · Haute Boudoir · $72k/mo verified)", time: "Cohort 1", isNotice: true },
  { text: "[DROP 02] $KIRA launches SUNDAY 8PM UTC (Kira Fox · Tokyo/Berlin Underground Icon · $58k/mo)", time: "Cohort 1", isNotice: true },
  { text: "[DROP 03] $LUNA launches TUESDAY 8PM UTC (Luna St. Claire · Nocturnal Cinema · $94k/mo)", time: "Cohort 1", isNotice: true },
  { text: "[BURN VAULT] Burn $5 / $10 / $25 in creator tokens to unlock exclusive 4K content & PPV", time: "Utility Engine", isNotice: true },
  { text: "$MIKA Protocol Token Curve: 78.2% Filled · Robinhood Chain L2", time: "Live Trading", isNotice: true },
  { text: "100% Curated Drops · Zero Public Scam Rugs · Institutional Legal Due Diligence", time: "Mikayla Guarantee", isNotice: true },
  { text: "2.45 ETH on $MIKA", time: "3s ago", isBuy: true },
  { text: "1.75 ETH on $LUNA", time: "24s ago", isBuy: true },
  { text: "3.10 ETH on $MIKA", time: "1m ago", isBuy: true },
];

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLaunchOpen, setIsLaunchOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleOpenLaunch = () => setIsLaunchOpen(true);
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener("open-launch-modal", handleOpenLaunch);
    window.addEventListener("open-search-modal", handleOpenSearch);
    return () => {
      window.removeEventListener("open-launch-modal", handleOpenLaunch);
      window.removeEventListener("open-search-modal", handleOpenSearch);
    };
  }, []);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        {/* 1. Top Ticker Marquee Chrome */}
        <div className="w-full bg-[#070907] border-b border-white/5 py-1.5 px-4 overflow-hidden select-none">
          <div className="max-w-[90rem] mx-auto flex items-center justify-between gap-4 text-xs font-mono">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-pulse" />
              <span className="text-white/70 uppercase tracking-widest text-[11px] font-semibold">
                Robinhood Chain L2
              </span>
            </div>

            {/* Marquee Track */}
            <div className="flex-1 overflow-hidden relative">
              <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
                {[...marqueeItems, ...marqueeItems].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {item.isBuy ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
                        <span className="text-white/50">Buy</span>
                        <span className="text-white font-semibold">{item.text}</span>
                        <span className="text-white/30 text-[11px]">({item.time})</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
                        <span className="text-[#d4fc50] font-medium">{item.text}</span>
                        <span className="text-white/40 text-[11px] font-mono">[{item.time}]</span>
                      </>
                    )}
                    <span className="text-white/10 mx-2">/</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Gas / Status */}
            <div className="hidden md:flex items-center gap-3 shrink-0 pl-3 border-l border-white/10 text-white/50 text-[11px]">
              <span>Gas: <strong className="text-[#d4fc50] font-mono">0.1 Gwei</strong></span>
              <span>TPS: <strong className="text-white font-mono">1,420</strong></span>
            </div>
          </div>
        </div>

        {/* 2. Main Liquid-Glass Navbar */}
        <div className="w-full bg-[#0a0c0a]/80 backdrop-blur-xl border-b border-white/10 transition-colors">
          <div className="max-w-[90rem] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            {/* Brand Logo */}
            <a href="#hero" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src={logo} width={36} height={36} alt="Mikayla mark" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#d4fc50] transition-colors">
                  mikayla
                </span>
                <span className="text-xs font-mono font-bold text-[#d4fc50]">
                  .fun
                </span>
              </div>
            </a>

            {/* Desktop Navigation Pill */}
            <nav className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full p-1.5 shadow-inner">
              {navigation.map((item) => {
                const isActive = pathname.hash === item.url || (item.url === "#explore" && !pathname.hash);
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    onClick={handleClick}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium font-sans transition-all duration-200 ${
                      isActive
                        ? "bg-white/10 text-white shadow-sm font-semibold"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.title}
                  </a>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/50 hover:text-white transition-all"
                title="Quick Search"
              >
                <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
                <kbd className="text-[10px] font-mono text-white/30 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                  ⌘K
                </kbd>
              </button>

              {/* Apply to Launch Button */}
              <button
                onClick={() => setIsLaunchOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#d4fc50] hover:bg-[#e2ff66] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#d4fc50]/20 hover:scale-105 active:scale-95"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                <span>Apply to Launch</span>
              </button>

              {/* Wallet Button */}
              <button
                onClick={() => setIsConnected(!isConnected)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all flex items-center gap-2 ${
                  isConnected
                    ? "bg-white/10 border-[#30d158]/50 text-white"
                    : "bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-[#30d158]" : "bg-white/40"}`} />
                <span>{isConnected ? "0x71C...42b0" : "Connect"}</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleNavigation}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/80"
                aria-label="Toggle Navigation"
              >
                {openNavigation ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {openNavigation && (
          <div className="lg:hidden fixed inset-x-0 top-[6.25rem] bottom-0 bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col justify-between animate-fadeIn z-40">
            <div className="space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={handleClick}
                  className="block px-4 py-3 rounded-xl text-lg font-medium text-white/80 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  handleClick();
                  setIsLaunchOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-[#d4fc50] text-black font-mono font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                Apply for Creator Cohort
              </button>
              <button
                onClick={() => {
                  handleClick();
                  setIsSearchOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs text-center"
              >
                Search Tokens (⌘K)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Interactive Modals */}
      <LaunchTokenModal 
        isOpen={isLaunchOpen} 
        onClose={() => setIsLaunchOpen(false)} 
        onCreated={(token) => {
          alert(`Success! ${token.name} (${token.ticker}) deployed on Robinhood Chain.`);
        }}
      />
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelectToken={(token) => {
          window.location.hash = "#trading";
        }}
      />
    </>
  );
};

export default Header;
