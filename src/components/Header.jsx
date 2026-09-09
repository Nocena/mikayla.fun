import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { logo } from "../assets";
import { navigation } from "../constants";
import LaunchTokenModal from "./LaunchTokenModal";
import SearchModal from "./SearchModal";

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
      <header className="fixed top-0 left-0 w-full z-40">
        {/* Apple Translucent Chrome Navbar with Specular Bottom Edge */}
        <div className="w-full bg-[#080808]/75 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors">
          <div className="max-w-[90rem] mx-auto flex items-center justify-between px-6 sm:px-10 h-14">
            {/* Brand Logo with Instant Tactile Feedback */}
            <a href="#hero" className="flex items-center gap-2.5 group shrink-0 icon-tactile">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                <img src={logo} width={32} height={32} alt="Mikayla" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-[#d4fc50] transition-colors font-sans">
                  mikayla
                </span>
                <span className="text-xs font-mono font-bold text-[#d4fc50]">
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
            <div className="flex items-center gap-4 sm:gap-5 text-xs font-mono">
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
                className={`btn-tactile px-3.5 py-1.5 border text-xs font-mono flex items-center gap-2 cursor-pointer uppercase tracking-[0.05em] rounded-none ${
                  isConnected
                    ? "bg-white/10 border-[#30d158]/50 text-white"
                    : "bg-white/[0.04] border-white/20 text-white/80 hover:text-[#080808] hover:border-[#d4fc50] hover:bg-[#d4fc50]"
                }`}
              >
                <span className={`w-1.5 h-1.5 ${isConnected ? "bg-[#30d158]" : "bg-[#d4fc50]"}`} />
                <span>{isConnected ? "0x71C...42b0" : "Connect"}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleNavigation}
                className="icon-tactile md:hidden w-8 h-8 flex items-center justify-center rounded-none bg-white/5 border border-white/10 text-white/80"
                aria-label="Toggle Navigation"
              >
                {openNavigation ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {openNavigation && (
          <div className="md:hidden fixed inset-x-0 top-14 bottom-0 bg-[#080808]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col justify-between animate-fadeIn z-40">
            <div className="space-y-4 pt-2">
              <a
                href="#hero"
                onClick={handleClick}
                className="block text-base font-mono text-white/80 hover:text-white"
              >
                Overview
              </a>
              <a
                href="#upcoming-drops"
                onClick={handleClick}
                className="block text-base font-mono text-white/80 hover:text-white"
              >
                Curated Drops
              </a>
              <a
                href="#content-vault"
                onClick={handleClick}
                className="block text-base font-mono text-white/80 hover:text-white"
              >
                Burn-to-Unlock Vault
              </a>
              <a
                href="#benefits"
                onClick={handleClick}
                className="block text-base font-mono text-white/80 hover:text-white"
              >
                Protocol & Robinhood L2
              </a>
              <a
                href="#roadmap"
                onClick={handleClick}
                className="block text-base font-mono text-white/80 hover:text-white"
              >
                Roadmap
              </a>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  handleClick();
                  setIsLaunchOpen(true);
                }}
                className="w-full py-2.5 rounded-full bg-[#d4fc50] text-black font-mono font-bold text-xs uppercase tracking-wider text-center"
              >
                Apply to Launch
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
