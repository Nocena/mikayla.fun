import { useState, useEffect } from "react";
import { logo } from "../assets";

const LaunchTokenModal = ({ isOpen, onClose, onCreated }) => {
  const [creatorName, setCreatorName] = useState("");
  const [ticker, setTicker] = useState("");
  const [platform, setPlatform] = useState("OnlyFans");
  const [profileUrl, setProfileUrl] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("$50k - $100k / mo");
  const [revSharePct, setRevSharePct] = useState("20%");
  const [contactHandle, setContactHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewStep, setReviewStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!creatorName || !ticker || !contactHandle) return;

    setIsSubmitting(true);
    setReviewStep(1);

    setTimeout(() => {
      setReviewStep(2);
      setTimeout(() => {
        setReviewStep(3);
        setTimeout(() => {
          setIsSubmitting(false);
          setSubmitted(true);
          if (onCreated) {
            onCreated({
              name: creatorName,
              ticker: ticker.startsWith("$") ? ticker : `$${ticker}`,
              platform,
              monthlyRevenue,
              revSharePct,
            });
          }
        }, 1200);
      }, 1200);
    }, 1000);
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsSubmitting(false);
    setReviewStep(0);
    setCreatorName("");
    setTicker("");
    setProfileUrl("");
    setContactHandle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0d100d] border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 text-[#f4f4f2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#d4fc50]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#d4fc50]">
                  Institutional Due Diligence · Curated Cohorts Only
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-tight">
                Apply to Launch on Mikayla
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl leading-relaxed">
                <strong>We do not permit open public meme token launches.</strong> To protect holders from scam rugs, every creator on Mikayla undergoes institutional due diligence, KYC legal verification, escrow revenue audits, and multi-year smart contract lockups.
              </p>
            </div>

            {/* Curation Guarantee Notice Box */}
            <div className="mb-6 p-3.5 rounded-2xl bg-[#d4fc50]/[0.06] border border-[#d4fc50]/20 flex items-center justify-between gap-3 text-xs font-mono text-white/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span>Weekly Drops: <strong>Friday, Sunday, and Tuesday (8:00 PM UTC)</strong></span>
              </div>
              <span className="text-[#d4fc50] font-bold">&lt; 2% Acceptance Rate</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Side (7 cols) */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider font-mono">
                      Creator / Legal Entity *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Aria Brooks / Brooks LLC"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#141614] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#d4fc50] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider font-mono">
                      Requested Ticker *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. $ARIA"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 bg-[#141614] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#d4fc50] text-sm uppercase font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider font-mono">
                    Primary Platform
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["OnlyFans", "Fansly", "Autonomous AI", "Top-Tier Agency"].map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setPlatform(cat)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-center ${
                          platform === cat 
                            ? "bg-[#d4fc50]/15 border-[#d4fc50] text-[#d4fc50] font-bold" 
                            : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider font-mono">
                      Verified Monthly Revenue
                    </label>
                    <select
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#141614] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#d4fc50] text-xs font-mono"
                    >
                      <option value="$20k - $50k / mo">$20,000 - $50,000 / mo</option>
                      <option value="$50k - $100k / mo">$50,000 - $100,000 / mo</option>
                      <option value="$100k - $250k / mo">$100,000 - $250,000 / mo</option>
                      <option value="$250k+ / mo">$250,000+ / mo (VIP Tier)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider font-mono">
                      Holder Cashflow Split
                    </label>
                    <select
                      value={revSharePct}
                      onChange={(e) => setRevSharePct(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#141614] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#d4fc50] text-xs font-mono"
                    >
                      <option value="15%">15% Net Content Cashflow</option>
                      <option value="20%">20% Net Content Cashflow (Standard)</option>
                      <option value="25%">25% Net Content Cashflow (Premier)</option>
                      <option value="30%">30% Net Content Cashflow</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider font-mono">
                    Official Profile / Social URL *
                  </label>
                  <input 
                    type="url"
                    required
                    placeholder="https://onlyfans.com/yourhandle or https://x.com/yourhandle"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#141614] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#d4fc50] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider font-mono">
                    Telegram / Signal Handle (For Due Diligence Team) *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="@your_telegram or contact@agency.com"
                    value={contactHandle}
                    onChange={(e) => setContactHandle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#141614] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#d4fc50] text-sm font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !creatorName || !ticker || !contactHandle}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isSubmitting || !creatorName || !ticker || !contactHandle
                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                        : "bg-[#d4fc50] hover:bg-[#e2ff66] text-black shadow-lg shadow-[#d4fc50]/20 hover:scale-[1.01] active:scale-[0.99]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        {reviewStep === 1 && "Encrypting Identity & Social Audit..."}
                        {reviewStep === 2 && "Verifying Escrow Revenue Proofs..."}
                        {reviewStep === 3 && "Scheduling Cohort Interview..."}
                      </>
                    ) : (
                      "Submit Due Diligence Application"
                    )}
                  </button>
                </div>
              </form>

              {/* Preview & Due Diligence Standards (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-white/50">
                  Cohort Due Diligence Standards
                </div>

                <div className="p-5 rounded-2xl bg-[#141614] border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#d4fc50]/15 border border-[#d4fc50]/30 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#d4fc50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Institutional KYC Verification</h4>
                      <p className="text-xs text-white/60 mt-0.5">
                        Legal identity and passport validation via cryptographic escrow. No anonymous devs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">12-Month Revenue Audit</h4>
                      <p className="text-xs text-white/60 mt-0.5">
                        Historical payment processor & bank statements audited to verify genuine cashflow.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#a8c3a0]/15 border border-[#a8c3a0]/30 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#a8c3a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Smart Contract Exclusivity</h4>
                      <p className="text-xs text-white/60 mt-0.5">
                        Multi-year legally binding covenant routing content revenue directly into USDC dividends.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-white/40">
                    Target Deployment: Robinhood Chain L2 · Automated Uniswap V4 Lock
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Application Submitted Screen */
          <div className="py-12 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-2">
              Due Diligence Dossier Received!
            </h3>
            <p className="text-sm font-mono text-[#d4fc50] mb-4">
              {creatorName} ({ticker.startsWith("$") ? ticker : `$${ticker}`}) · Cohort Q1 2026
            </p>
            <p className="text-xs text-white/65 mb-8 leading-relaxed max-w-sm mx-auto">
              Your application has been hashed and submitted to our curation review committee. We will review your escrow statements and reach out to <strong>{contactHandle}</strong> within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-[#d4fc50] hover:bg-[#e2ff66] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all"
              >
                Back to Launchpad
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchTokenModal;
