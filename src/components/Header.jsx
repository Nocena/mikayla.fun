import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { logo } from "../assets";
import { navigation } from "../constants";
import LaunchTokenModal from "./LaunchTokenModal";
import SearchModal from "./SearchModal";
import ShinyText from "./react-bits/ShinyText";
import LaunchCountdownBanner from "./LaunchCountdownBanner";

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
      window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: { open: false } }));
    } else {
      setOpenNavigation(true);
      disablePageScroll();
      window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: { open: true } }));
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
    window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: { open: false } }));
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <LaunchCountdownBanner />
        {/* Apple Translucent Chrome Navbar with Specular Bottom Edge */}
        <div className="w-full bg-[#080808]/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors">
          <div className="max-w-[90rem] mx-auto flex items-center justify-between px-3.5 sm:px-10 h-14">
            {/* Brand Logo with Instant Tactile Feedback */}
            <a href="#hero" className="flex items-center gap-2 group shrink-0 icon-tactile">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                <img src={logo} width={32} height={32} alt="Mikayla" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-baseline gap-0.5 sm:gap-1">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-[#d4fc50] transition-colors font-sans">
                  mikayla
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-[#d4fc50]">
                  .fun
                </span>
              </div>
            </a>

            {/* Apple Optical Typographic Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-[0.06em] uppercase">
              <a
                href="#upcoming-drops"
                className="text-white/60 hover:text-white transition-colors py-1"
              >
                Launchpad
              </a>
              <a
                href="#content-vault"
                className="text-white/60 hover:text-white transition-colors py-1"
              >
                Vault
              </a>
              <a
                href="#benefits"
                className="text-white/60 hover:text-white transition-colors py-1"
              >
                Protocol
              </a>
              <a
                href="#roadmap"
                className="text-white/60 hover:text-white transition-colors py-1"
              >
                Roadmap
              </a>
            </nav>

            {/* Minimalist Right Actions */}
            <div className="flex items-center gap-2 sm:gap-5 text-xs font-mono">
              {/* Apple-Grade Dex Paid Pill */}
              <a
                href="https://dexscreener.com/search?q=0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4"
                target="_blank"
                rel="noopener noreferrer"
                className="group/dexpaid btn-tactile hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-xl border-t border-white/25 border-x border-b border-white/10 text-xs font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-[#30d158]/50 hover:shadow-[0_0_16px_rgba(48,209,88,0.2)] transition-all cursor-pointer"
              >
                <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30d158] opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#30d158] shadow-[0_0_6px_#30d158]"></span>
                </span>
                <span className="text-[10px] font-mono font-bold tracking-[0.12em] uppercase flex items-center gap-1">
                  <ShinyText text="DEX PAID" color="#30d158" shineColor="#ffffff" speed={3} className="font-bold" />
                  <span className="text-[9px] text-[#30d158]">✓</span>
                </span>
                <span className="text-[9px] font-mono text-white/30 group-hover/dexpaid:text-[#30d158] group-hover/dexpaid:translate-x-0.5 group-hover/dexpaid:-translate-y-0.5 transition-all">
                  ↗
                </span>
              </a>

              {/* Tactile Text Link for Apply */}
              <button
                onClick={() => setIsLaunchOpen(true)}
                className="btn-tactile hidden sm:inline-block text-white/60 hover:text-[#d4fc50] transition-colors cursor-pointer tracking-[0.05em] uppercase text-[11px]"
              >
                Apply to Launch
              </button>

              {/* Apple-Grade Tactile Connect Button */}
              <button
                onClick={() => setIsConnected(!isConnected)}
                className={`btn-tactile px-2.5 sm:px-3.5 py-1.5 border text-[11px] sm:text-xs font-mono flex items-center gap-1.5 sm:gap-2 cursor-pointer uppercase tracking-[0.05em] rounded-none shrink-0 whitespace-nowrap ${
                  isConnected
                    ? "bg-white/10 border-[#30d158]/50 text-white"
                    : "bg-white/[0.04] border-white/20 text-white/80 hover:text-[#080808] hover:border-[#d4fc50] hover:bg-[#d4fc50]"
                }`}
              >
                <span className={`w-1.5 h-1.5 ${isConnected ? "bg-[#30d158]" : "bg-[#d4fc50]"}`} />
                <span>{isConnected ? "0xa4f...3Ab4" : "Connect"}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleNavigation}
                className="icon-tactile md:hidden w-8 h-8 flex items-center justify-center rounded-none bg-white/5 border border-white/10 text-white/80 shrink-0"
                aria-label="Toggle Navigation"
              >
                {openNavigation ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {openNavigation && (
          <div className="md:hidden absolute top-full inset-x-0 h-[calc(100dvh-100%)] bg-[#080808]/98 backdrop-blur-3xl border-b border-white/10 p-5 pb-8 flex flex-col justify-between animate-fadeIn z-50 overflow-y-auto">
            <div className="space-y-2 pt-2">
              {[
                { href: "#hero", label: "01 // Protocol Overview", sub: "$MIKA Genesis & Robinhood L2" },
                { href: "#upcoming-drops", label: "02 // Curated Launchpad", sub: "Friday, Sunday, Tuesday Drops" },
                { href: "#content-vault", label: "03 // Burn-to-Unlock Vault", sub: "Holder Gates & Token Utility" },
                { href: "#benefits", label: "04 // SCM Thesis & Origins", sub: "Agency Network & Direct Talent" },
                { href: "#pricing", label: "05 // Tokenomics & Treasury", sub: "Cap Table & 50% Profit Burn" },
                { href: "#roadmap", label: "06 // Protocol Roadmap", sub: "Chatbot Origins to #1 Launchpad" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleClick}
                  className="block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#d4fc50]/30 hover:bg-white/5 transition-all"
                >
                  <div className="text-sm font-mono font-medium text-white flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className="text-[#d4fc50] text-xs">→</span>
                  </div>
                  <div className="text-[11px] font-mono text-white/40 mt-0.5">
                    {item.sub}
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-5 border-t border-white/10 space-y-2.5 mt-4">
              <a
                href="https://dexscreener.com/search?q=0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
                <span>View on DexScreener</span>
                <span>↗</span>
              </a>

              <button
                onClick={() => {
                  handleClick();
                  setIsLaunchOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-[#d4fc50] text-black font-mono font-bold text-xs uppercase tracking-wider text-center cursor-pointer hover:bg-white transition-colors"
              >
                Apply to Launch on Robinhood
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <LaunchTokenModal
        isOpen={isLaunchOpen}
        onClose={() => setIsLaunchOpen(false)}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;
