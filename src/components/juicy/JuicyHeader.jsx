import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Flame, Shield, Menu, X, ExternalLink } from "lucide-react";
import { JUICY_CONFIG } from "../../constants/juicy";
import { useWeb3Wallet } from "../../hooks/useWeb3Wallet";

export default function JuicyHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    account,
    isConnected,
    isConnecting,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchToRobinhood,
  } = useWeb3Wallet();

  const navLinks = [
    { label: "Overview", href: "#overview" },
    { label: "The Incinerator", href: "#smelter" },
    { label: "Milestones", href: "#milestones" },
    { label: "Syndicate Pass", href: "#vault" },
    { label: "Cap Table", href: "#cap-table" },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#060706]/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* Specular Edge Gradient Line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4fc50]/50 to-transparent" />

      <div className="max-w-[92rem] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity & Back to Launchpad */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            to="/"
            className="group flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/70 hover:text-white transition-all cursor-pointer shrink-0"
            title="Return to Mikayla Launchpad"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          <a href="#overview" className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-[#d4fc50] shadow-[0_0_10px_rgba(212,252,80,0.4)] bg-black shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/creators/msjuicy.jpg"
                alt="Ms Juicy P"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="font-gta text-base sm:text-xl text-white tracking-wider group-hover:text-[#d4fc50] transition-colors whitespace-nowrap">
                  MS JUICY P
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1 py-0.2 rounded bg-[#d4fc50]/15 text-[#d4fc50] border border-[#d4fc50]/30 font-bold">
                  $JUICY
                </span>
              </div>
              <span className="text-[9px] font-mono text-white/40 tracking-[0.15em] uppercase hidden md:inline">
                Robinhood L2 Syndicate
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-white/60 hover:text-[#d4fc50] transition-colors py-1 relative group cursor-pointer"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#d4fc50] group-hover:w-full transition-all duration-200" />
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
          {/* Connect Wallet Button */}
          {!isConnected ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="btn-tactile hidden sm:flex px-3 py-1.5 rounded-lg border text-xs font-mono uppercase tracking-wider cursor-pointer transition-all items-center gap-1.5 bg-white/5 border-white/20 text-white/90 hover:bg-white/10 hover:border-[#d4fc50]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50] animate-pulse" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : !isCorrectNetwork ? (
            <button
              onClick={switchToRobinhood}
              className="btn-tactile hidden sm:flex px-3 py-1.5 rounded-lg border text-xs font-mono uppercase tracking-wider cursor-pointer transition-all items-center gap-1.5 bg-[#ff9500]/15 border-[#ff9500]/50 text-[#ff9500] hover:bg-[#ff9500]/25"
              title="Click to switch wallet to Robinhood Chain L2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9500] animate-ping" />
              <span>Switch to RH L2</span>
            </button>
          ) : (
            <button
              onClick={disconnectWallet}
              className="btn-tactile hidden sm:flex px-3 py-1.5 rounded-lg border text-xs font-mono uppercase tracking-wider cursor-pointer transition-all items-center gap-1.5 bg-white/10 border-[#30d158] text-[#30d158] hover:bg-white/15"
              title="Connected on Robinhood Chain L2 · Click to disconnect"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
              <span>
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </button>
          )}

          {/* Quick Buy / Incinerator CTA */}
          <a
            href="#smelter"
            className="btn-tactile px-3.5 py-1.5 rounded-lg bg-[#d4fc50] hover:bg-white text-black font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-[0_0_14px_rgba(212,252,80,0.3)] cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-black fill-black" />
            <span>Incinerator</span>
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white/80"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0c0a] border-b border-white/15 px-6 py-5 flex flex-col gap-4 font-mono text-sm animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-white/80 hover:text-[#d4fc50] py-1 border-b border-white/5 uppercase tracking-wider"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 flex items-center justify-between text-xs text-white/50">
            <span>Robinhood L2 Syndicate</span>
            <a
              href={JUICY_CONFIG.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4fc50] flex items-center gap-1"
            >
              <span>80K on X</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
