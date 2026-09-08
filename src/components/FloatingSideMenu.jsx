import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  Sparkles,
  Flame,
  Activity,
  TrendingUp,
  Coins,
  Compass,
  Search,
  ArrowUpRight,
  ArrowUp,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";

const FloatingSideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-search-modal"));
  };

  const handleOpenLaunch = () => {
    window.dispatchEvent(new CustomEvent("open-launch-modal"));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveSection("hero");
  };

  // Track active section on scroll
  useEffect(() => {
    const sections = [
      "hero",
      "upcoming-drops",
      "content-vault",
      "benefits",
      "collaboration",
      "pricing",
      "roadmap",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 260;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      id: "hero",
      label: "Protocol & $MIKA",
      icon: <Home className="w-4 h-4" />,
      action: () => scrollToSection("hero"),
    },
    {
      id: "upcoming-drops",
      label: "Curated Drops",
      icon: <Sparkles className="w-4 h-4" />,
      action: () => scrollToSection("upcoming-drops"),
    },
    {
      id: "content-vault",
      label: "Burn-to-Unlock Vault",
      icon: <Flame className="w-4 h-4" />,
      action: () => scrollToSection("content-vault"),
    },
    {
      id: "benefits",
      label: "Robinhood Telemetry",
      icon: <Activity className="w-4 h-4" />,
      action: () => scrollToSection("benefits"),
    },
    {
      id: "collaboration",
      label: "3.2x Perp Leverage",
      icon: <TrendingUp className="w-4 h-4" />,
      action: () => scrollToSection("collaboration"),
    },
    {
      id: "pricing",
      label: "$MIKA Tokenomics",
      icon: <Coins className="w-4 h-4" />,
      action: () => scrollToSection("pricing"),
    },
    {
      id: "roadmap",
      label: "Protocol Roadmap",
      icon: <Compass className="w-4 h-4" />,
      action: () => scrollToSection("roadmap"),
    },
  ];

  return (
    <nav
      aria-label="Side Quick Navigation"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-50 flex items-center select-none"
    >
      {/* 1. SLENDER FLOATING CAPSULE RAIL (Minimal Anygoo Style) */}
      <div className="w-12 sm:w-14 py-5 px-1.5 rounded-full bg-[#080a08]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col items-center justify-between min-h-[460px] transition-all">
        {/* Top Flyout Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          {isOpen ? (
            <PanelLeftClose className="w-4 h-4 text-[#d4fc50]" />
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
        </button>

        {/* Vertical Section Icons */}
        <div className="flex flex-col items-center gap-3.5 my-auto">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action}
                title={item.label}
                aria-label={item.label}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#d4fc50] text-black shadow-lg shadow-[#d4fc50]/30 scale-105"
                    : "text-slate-400 hover:text-white hover:bg-white/10 hover:scale-105"
                }`}
              >
                {item.icon}
              </button>
            );
          })}

          <div className="w-[1px] h-6 bg-white/15 my-0.5" />

          {/* Quick Search */}
          <button
            onClick={handleOpenSearch}
            title="Search Launchpad (⌘K)"
            aria-label="Search Launchpad"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Back-to-Top */}
        <button
          onClick={scrollToTop}
          title="Scroll to Top"
          aria-label="Scroll to Top"
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>

      {/* 2. AIRY, SPACIOUS FLYOUT DRAWER (Anygoo Design Language) */}
      <div
        className={`ml-3 transition-all duration-200 ease-out origin-left ${
          isOpen
            ? "opacity-100 scale-100 translate-x-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-x-2 pointer-events-none"
        }`}
      >
        <div className="w-[245px] p-4.5 rounded-[26px] bg-[#080a08]/95 backdrop-blur-3xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.9)] text-white space-y-3.5">
          {/* Header */}
          <div className="flex items-center justify-between px-1 pb-2.5 border-b border-white/10 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4fc50] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-300">
                Mikayla Protocol
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase">
              V2.4
            </span>
          </div>

          {/* Clean Navigation List */}
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    // optional keep or auto-dismiss
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
                    isActive
                      ? "bg-[#d4fc50] text-black font-semibold shadow-md shadow-[#d4fc50]/25"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className={isActive ? "text-black" : "text-slate-400"}>
                    {item.icon}
                  </div>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Hairline Divider */}
          <div className="w-full h-[1px] bg-white/10 my-1" />

          {/* Quick Secondary Actions */}
          <div className="space-y-1 pt-0.5">
            <button
              onClick={handleOpenSearch}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search Drops</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white/10 rounded text-slate-400 border border-white/10">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={handleOpenLaunch}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#d4fc50] bg-[#d4fc50]/10 hover:bg-[#d4fc50]/15 border border-[#d4fc50]/20 transition-all cursor-pointer text-left font-medium"
            >
              <div className="flex items-center gap-2.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#d4fc50]" />
                <span>Apply for Cohort</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FloatingSideMenu;
