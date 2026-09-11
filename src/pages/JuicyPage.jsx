import React, { useState, useEffect } from "react";
import JuicyHeader from "../components/juicy/JuicyHeader";
import JuicyHero from "../components/juicy/JuicyHero";
import JuicyMarquee from "../components/juicy/JuicyMarquee";
import JuicySmelter from "../components/juicy/JuicySmelter";
import JuicyMilestones from "../components/juicy/JuicyMilestones";
import JuicyVault from "../components/juicy/JuicyVault";
import JuicyCapTable from "../components/juicy/JuicyCapTable";
import JuicyFooter from "../components/juicy/JuicyFooter";
import "./juicy.css";

class JuicyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("JuicyPage Crash:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060706] text-white p-8 font-mono flex flex-col items-center justify-center text-center">
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#ff453a] max-w-xl w-full">
            <h1 className="text-xl font-bold text-[#ff453a] mb-2 uppercase">
              // SYNDICATE DECRYPTION ERROR
            </h1>
            <p className="text-xs text-white/70 mb-4 font-sans">
              An unexpected error occurred while mounting the /juicy page.
            </p>
            <pre className="p-3 bg-black rounded border border-white/10 text-[11px] text-left text-red-400 overflow-auto mb-4">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[#ccff00] text-black font-bold uppercase text-xs"
            >
              Reload Syndicate Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function JuicyPageContent() {
  useEffect(() => {
    document.title = "Ms Juicy P ($JUICY) · Vice Capital Syndicate · Robinhood Chain L2";
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
  }, []);

  return (
    <div className="min-h-screen bg-[#050605] text-[#f4f4f2] selection:bg-[#ccff00] selection:text-black font-sans antialiased relative">
      {/* Global Fixed Street Background Noise & Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-grunge-pattern" />

      {/* Page Content Layers */}
      <div className="relative z-10">
        <JuicyHeader />
        <JuicyHero />
        <JuicyMarquee speed={32} />
        <JuicySmelter />
        <JuicyMilestones />
        <JuicyVault />
        <JuicyCapTable />
        <JuicyFooter />
      </div>
    </div>
  );
}

export default function JuicyPage() {
  return (
    <JuicyErrorBoundary>
      <JuicyPageContent />
    </JuicyErrorBoundary>
  );
}
