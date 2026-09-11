import React, { useState, useRef, useEffect } from "react";
import {
  Rocket,
  Sparkles,
  Flame,
  Activity,
  TrendingUp,
  PieChart,
  Milestone,
  Search,
  ArrowUpRight,
  ArrowUp,
} from "lucide-react";

const FloatingSideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredId, setHoveredId] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setHoveredId(null);
    }, 160);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleMenu = (e) => {
      setIsMobileMenuOpen(!!e.detail?.open);
    };
    window.addEventListener("mobile-menu-toggle", handleMenu);
    return () => window.removeEventListener("mobile-menu-toggle", handleMenu);
  }, []);

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

  // Track active section using IntersectionObserver (zero scroll layout reflows)
  useEffect(() => {
    const sections = [
      "hero",
      "upcoming-drops",
      "protocol",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Section navigation items with meticulously tailored icons
  const sectionItems = [
    {
      id: "hero",
      label: "Terminal & $MIKA",
      icon: <Rocket className="w-4 h-4" />,
      action: () => scrollToSection("hero"),
    },
    {
      id: "upcoming-drops",
      label: "Curated Launchpad",
      icon: <Sparkles className="w-4 h-4" />,
      action: () => scrollToSection("upcoming-drops"),
    },
    {
      id: "protocol",
      label: "Protocol & Tokenomics",
      icon: <PieChart className="w-4 h-4" />,
      action: () => scrollToSection("protocol"),
    },
  ];

  // Secondary utility items (1-to-1 vertical match between rail & drawer)
  const utilityItems = [
    {
      id: "search",
      label: "Search Drops",
      icon: <Search className="w-4 h-4" />,
      badge: (
        <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white/10 rounded text-slate-400 border border-white/10">
          ⌘K
        </kbd>
      ),
      action: handleOpenSearch,
    },
    {
      id: "apply",
      label: "Apply for Cohort",
      icon: <ArrowUpRight className="w-4 h-4" />,
      badge: <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />,
      action: handleOpenLaunch,
      accent: true,
    },
    {
      id: "top",
      label: "Back to Top",
      icon: <ArrowUp className="w-4 h-4" />,
      badge: <span className="text-[10px] text-slate-500 font-mono">↑</span>,
      action: scrollToTop,
    },
  ];

  return (
    <>
      {/* DESKTOP FLOATING ARCHITECTURAL RAIL */}
      <nav
        aria-label="Side Quick Navigation"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex items-start select-none transition-all duration-300"
      >
        {/* 1. SLENDER FLOATING ARCHITECTURAL RAIL (Apple Translucent Chrome) */}
        <div className="w-12 sm:w-13 p-1.5 bg-[#080a08]/90 backdrop-blur-2xl border-t border-white/20 border-x border-b border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_20px_50px_rgba(0,0,0,0.85)] flex flex-col items-center gap-1.5 transition-all rounded-full">
          {/* Section Icons with Instant Tactile Feedback */}
          {sectionItems.map((item) => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredId === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                title={item.label}
                aria-label={item.label}
                className={`icon-tactile w-9 h-9 flex items-center justify-center cursor-pointer rounded-full ${
                  isActive
                    ? "bg-[#d4fc50] text-black font-semibold shadow-[0_0_14px_rgba(212,252,80,0.4)]"
                    : isHovered
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.icon}
              </button>
            );
          })}

          {/* Hairline Divider */}
          <div className="w-5 h-[1px] bg-white/15 my-0.5 shrink-0" />

          {/* Utility Icons with Instant Tactile Feedback */}
          {utilityItems.map((item) => {
            const isHovered = hoveredId === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                title={item.label}
                aria-label={item.label}
                className={`icon-tactile w-9 h-9 flex items-center justify-center cursor-pointer rounded-full ${
                  item.accent
                    ? isHovered
                      ? "bg-[#d4fc50]/20 text-[#d4fc50]"
                      : "text-[#d4fc50] hover:bg-[#d4fc50]/15"
                    : isHovered
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.icon}
              </button>
            );
          })}
        </div>

        {/* 2. AIRY, SPACIOUS FLYOUT DRAWER (Apple Spring Easing Curve) */}
        <div
          className={`ml-2.5 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left ${
            isOpen
              ? "opacity-100 scale-100 translate-x-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-x-2 pointer-events-none"
          }`}
        >
          <div className="w-[230px] p-1.5 bg-[#080a08]/95 backdrop-blur-3xl border-t border-white/25 border-x border-b border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_30px_70px_rgba(0,0,0,0.9)] text-white flex flex-col gap-1.5 rounded-[22px]">
            {/* Section Navigation Rows */}
            {sectionItems.map((item) => {
              const isActive = activeSection === item.id;
              const isHovered = hoveredId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`btn-tactile w-full h-9 px-3 flex items-center gap-2.5 cursor-pointer text-left rounded-xl ${
                    isActive
                      ? "bg-[#d4fc50] text-black font-semibold shadow-[0_0_12px_rgba(212,252,80,0.35)]"
                      : isHovered
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className={`w-4 h-4 flex items-center justify-center shrink-0 ${isActive ? "text-black" : isHovered ? "text-white" : "text-slate-400"}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium truncate flex-1">
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* Hairline Divider */}
            <div className="w-full h-[1px] bg-white/15 my-0.5 shrink-0" />

            {/* Utility Rows */}
            {utilityItems.map((item) => {
              const isHovered = hoveredId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`btn-tactile w-full h-9 px-3 flex items-center gap-2.5 cursor-pointer text-left rounded-xl ${
                    item.accent
                      ? isHovered
                        ? "bg-[#d4fc50]/20 text-[#d4fc50]"
                        : "text-[#d4fc50] bg-[#d4fc50]/10 hover:bg-[#d4fc50]/15 border border-[#d4fc50]/20"
                      : isHovered
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium truncate flex-1">
                    {item.label}
                  </span>
                  {item.badge}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 3. APPLE MOBILE FLOATING BOTTOM DOCK */}
      {!isMobileMenuOpen && (
        <nav
          aria-label="Mobile Bottom Quick Navigation"
          className="lg:hidden fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-40 select-none pointer-events-auto max-w-[95vw] animate-fadeIn"
        >
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[#080a08]/85 backdrop-blur-2xl border-t border-white/25 border-x border-b border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.15)] rounded-full">
          {sectionItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action}
                aria-label={item.label}
                className={`icon-tactile w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full cursor-pointer transition-all ${
                  isActive
                    ? "bg-[#d4fc50] text-black font-semibold shadow-[0_0_12px_rgba(212,252,80,0.45)]"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.icon}
              </button>
            );
          })}

          <div className="w-[1px] h-4 bg-white/15 mx-0.5 shrink-0" />

          {/* Search trigger */}
          <button
            onClick={handleOpenSearch}
            aria-label="Search Drops"
            className="icon-tactile w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full cursor-pointer text-slate-400 hover:text-white hover:bg-white/10"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Apply launch trigger */}
          <button
            onClick={handleOpenLaunch}
            aria-label="Apply to Launch"
            className="icon-tactile w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full cursor-pointer text-[#d4fc50] hover:bg-[#d4fc50]/15"
          >
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </nav>
      )}
    </>
  );
};

export default FloatingSideMenu;
