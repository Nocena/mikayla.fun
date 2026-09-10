import React, { useState } from "react";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import CountUp from "./react-bits/CountUp";

const creatorVaults = [
  {
    id: "drop01",
    creator: "Project Aria · Drop #01",
    ticker: "TICKER $ARIA [THIS FRIDAY]",
    image: "/creators/aria.jpg",
    category: "Top 0.05% OnlyFans Model · Miami / Milan",
    verifiedMonthly: "Top 0.05% Earner · Launching Friday",
    tokenPrice: 0.0428,
    accentColor: "#d4fc50",
    badgeBorder: "border-[#d4fc50]/30 bg-[#d4fc50]/10 text-[#d4fc50]",
    tiers: [
      {
        tierName: "TIER 01: $50 HOLDER GATE (TARGET MC)",
        usdPrice: 0,
        gateRequirement: "Hold ≥ $50 Token at $100k MC",
        format: "24 Uncompressed 35mm Leica Negatives",
        description: "Intimate backstage 35mm film negatives shot in Milan hotel dressing room. Automatically unlocks on the token page for any wallet holding at least $50 USD of this token once market cap reaches $100k.",
        perks: ["Hold ≥ $50 USD to Unlock", "24 Uncompressed 35mm Leica Scans", "Automatic On-Chain Token Gate"],
        previewThumbnail: "/creators/aria.jpg",
        isHolderGate: true,
      },
      {
        tierName: "TIER 02: ON-SITE BURN-TO-ACCESS",
        usdPrice: 10,
        format: "10-Min 4K Master Film + Binaural Voice Memo",
        description: "Private cinematic 4K video recorded after Milan Fashion Week, plus an intimate unscripted 3 AM voice note. Unlocked by burning creator tokens directly on this website, shrinking circulating supply.",
        perks: ["Burn $10 Token on Website", "ProRes 4K 60fps Master Film", "Tokens Sent to 0x00...dead"],
        previewThumbnail: "/creators/vault_banner.jpg",
        isHolderGate: false,
      },
      {
        tierName: "TIER 03: ULTRA-RARE ON-SITE BURN",
        usdPrice: 25,
        format: "Encrypted 1-on-1 Access + Signed Wax-Sealed Print",
        description: "Direct end-to-end encrypted messaging pass with the creator, plus signed physical analog print mailed in black wax seal. High deflationary burn on the creator's token.",
        perks: ["Burn $25 Token on Website", "Encrypted Direct Line Access", "Physical Archival Print in Wax Seal"],
        previewThumbnail: "/creators/luna.jpg",
        isHolderGate: false,
      },
    ],
  },
  {
    id: "drop02",
    creator: "Project Kira · Drop #02",
    ticker: "TICKER $KIRA [THIS SUNDAY]",
    image: "/creators/kira.jpg",
    category: "Top 0.02% OnlyFans Sensation · Los Angeles",
    verifiedMonthly: "Top 0.02% Earner · Launching Sunday",
    tokenPrice: 0.0215,
    accentColor: "#d4fc50",
    badgeBorder: "border-[#d4fc50]/30 bg-[#d4fc50]/10 text-[#d4fc50]",
    tiers: [
      {
        tierName: "TIER 01: $50 HOLDER GATE (TARGET MC)",
        usdPrice: 0,
        gateRequirement: "Hold ≥ $50 Token at $150k MC",
        format: "30 Uncut Sunset Hills Penthouse 35mm Scans",
        description: "Confidential 35mm raw film negatives from private Sunset Hills villa shoot. Automatically unlocks on the token page for all holders of ≥ $50 of the creator token when MC reaches $150k.",
        perks: ["Hold ≥ $50 USD to Unlock", "30 High-Res Raw Negatives", "Automatic On-Chain Token Gate"],
        previewThumbnail: "/creators/kira.jpg",
        isHolderGate: true,
      },
      {
        tierName: "TIER 02: ON-SITE BURN-TO-ACCESS",
        usdPrice: 10,
        format: "15-Min Uncut 4K Video + Intimate Audio Note",
        description: "Private cinematic 4K video recording, plus an intimate unscripted whisper note. Burn creator tokens on-site to unlock and permanently incinerate circulating supply.",
        perks: ["Burn $10 Token on Website", "15-Min 4K ProRes Video Master", "Tokens Sent to 0x00...dead"],
        previewThumbnail: "/creators/kira.jpg",
        isHolderGate: false,
      },
      {
        tierName: "TIER 03: ULTRA-RARE ON-SITE BURN",
        usdPrice: 25,
        format: "Direct Encrypted Telegram Line + Signed Canvas",
        description: "Direct encrypted VIP channel access with the creator, dedicated private video response, and physical archival print delivered in wax seal.",
        perks: ["Burn $25 Token on Website", "Direct Encrypted Line", "Physical Signed Archival Canvas"],
        previewThumbnail: "/creators/vault_banner.jpg",
        isHolderGate: false,
      },
    ],
  },
  {
    id: "drop03",
    creator: "Project Luna · Drop #03",
    ticker: "TICKER $LUNA [NEXT TUESDAY]",
    image: "/creators/luna.jpg",
    category: "Top 0.01% OnlyFans Supermodel · London / Paris",
    verifiedMonthly: "Top 0.01% Earner · Launching Tuesday",
    tokenPrice: 0.0310,
    accentColor: "#d4fc50",
    badgeBorder: "border-[#d4fc50]/30 bg-[#d4fc50]/10 text-[#d4fc50]",
    tiers: [
      {
        tierName: "TIER 01: $50 HOLDER GATE (TARGET MC)",
        usdPrice: 0,
        gateRequirement: "Hold ≥ $50 Token at $200k MC",
        format: "45 Uncut 4K HDR Studio Gallery + Paris Hotel Archive",
        description: "Private boudoir photosets shot on 35mm film in a confidential Paris apartment. Automatically unlocks on the token page for all holders of ≥ $50 of the creator token when MC reaches $200k.",
        perks: ["Hold ≥ $50 USD to Unlock", "45 Uncompressed Film Scans", "Automatic On-Chain Token Gate"],
        previewThumbnail: "/creators/luna.jpg",
        isHolderGate: true,
      },
      {
        tierName: "TIER 02: ON-SITE BURN-TO-ACCESS",
        usdPrice: 10,
        format: "14-Min High-Bitrate 4K Cinema Master",
        description: "Full-length unrated backstage luxury film. Burn creator tokens on-site to decrypt and permanently burn supply on Robinhood Chain.",
        perks: ["Burn $10 Token on Website", "14-Min 4K Cinema Master", "Tokens Sent to 0x00...dead"],
        previewThumbnail: "/creators/vault_banner.jpg",
        isHolderGate: false,
      },
      {
        tierName: "TIER 03: ULTRA-RARE ON-SITE BURN",
        usdPrice: 25,
        format: "Private Token-Gated Stream + Signed Art Print",
        description: "Bi-weekly token-gated intimate livestream access and signed physical archival print delivered in confidential packaging.",
        perks: ["Burn $25 Token on Website", "Private Stream Access", "Physical Signed Art Print in Wax Seal"],
        previewThumbnail: "/creators/aria.jpg",
        isHolderGate: false,
      },
    ],
  },
];

const ContentVault = () => {
  const [activeCreatorId, setActiveCreatorId] = useState("drop01");
  const [unlockedTiers, setUnlockedTiers] = useState({});
  const [burnModal, setBurnModal] = useState(null);
  const [isBurning, setIsBurning] = useState(false);
  const [burnStep, setBurnStep] = useState(0);
  const [totalBurnedUsd, setTotalBurnedUsd] = useState(142850);
  const [totalBurnedTokens, setTotalBurnedTokens] = useState(3337616);
  const [toastMessage, setToastMessage] = useState(null);

  const currentCreator = creatorVaults.find((c) => c.id === activeCreatorId) || creatorVaults[0];

  const handleOpenBurn = (tier) => {
    const cost = tier.isHolderGate ? 50 : tier.usdPrice;
    const tokenAmount = Math.round((cost / currentCreator.tokenPrice) * 10) / 10;
    setBurnModal({
      tier,
      creator: currentCreator,
      tokenAmount,
    });
    setBurnStep(0);
  };

  const handleConfirmBurn = () => {
    if (!burnModal) return;
    setIsBurning(true);
    setBurnStep(1);

    setTimeout(() => {
      setBurnStep(2);
      setTimeout(() => {
        setBurnStep(3);
        setTimeout(() => {
          setIsBurning(false);
          setUnlockedTiers((prev) => ({
            ...prev,
            [`${burnModal.creator.id}_${burnModal.tier.tierName}`]: true,
          }));
          setTotalBurnedUsd((prev) => prev + (burnModal.tier.usdPrice || 50));
          setTotalBurnedTokens((prev) => prev + Math.round(burnModal.tokenAmount));
          setBurnModal((prev) => ({ ...prev, done: true }));
        }, 900);
      }, 900);
    }, 800);
  };

  return (
    <section id="content-vault" className="relative py-20 lg:py-28 bg-[#080808] border-t border-white/[0.08]">
      {/* Apple Fluid Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-lg bg-[#111111] border-t border-white/20 border-x border-b border-white/10 text-xs font-mono text-white flex items-center gap-2 shadow-[0_12px_32px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
            <ShinyText
              text="DUAL CREATOR TOKEN UTILITY ARCHITECTURE"
              className="text-xs font-mono uppercase tracking-widest text-[#d4fc50]"
              speed={3}
            />
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-display leading-tight">
            Holder Gates & Burn-to-Access
          </h2>

          <p className="text-white/70 text-sm sm:text-base mt-4 max-w-3xl mx-auto leading-relaxed font-sans">
            Every creator token features concrete, automated utility directly on their token page: <strong>holding at least $50 USD of the token</strong> automatically unlocks exclusive content once their market cap milestone is reached. Furthermore, fans can burn creator tokens directly on-site to access ultra-rare master media, creating <strong>continuous deflationary supply pressure</strong> on each creator coin.
          </p>

          {/* Live Burn Metrics Ribbon */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border-t border-white/15 border-x border-b border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-center">
              <span className="text-white/40 block text-[10px] uppercase mb-1">Total Content Burned</span>
              <strong className="text-white text-base font-bold">
                $<CountUp to={totalBurnedUsd} separator="," duration={2} />
              </strong>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border-t border-white/15 border-x border-b border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-center">
              <span className="text-white/40 block text-[10px] uppercase mb-1">Tokens Incinerated</span>
              <strong className="text-[#d4fc50] text-base font-bold">
                <CountUp to={totalBurnedTokens} separator="," duration={2} />
              </strong>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border-t border-white/15 border-x border-b border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-center">
              <span className="text-white/40 block text-[10px] uppercase mb-1">Burn Address</span>
              <span className="text-white/80 bg-white/5 px-2 py-0.5 rounded text-[11px] inline-block font-mono">
                0x00...dEaD
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border-t border-white/15 border-x border-b border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-center">
              <span className="text-white/40 block text-[10px] uppercase mb-1">Settlement L2</span>
              <span className="text-[#d4fc50] font-medium text-[11px] block">Robinhood Chain</span>
            </div>
          </div>
        </div>

        {/* Creator Vault Selector Tabs (Apple Segmented Pill with Tactile Feedback) */}
        <div className="flex sm:flex-wrap items-center sm:justify-center gap-2.5 mb-10 overflow-x-auto no-scrollbar max-w-full pb-2 px-1">
          {creatorVaults.map((vault) => {
            const isActive = activeCreatorId === vault.id;
            return (
              <button
                key={vault.id}
                onClick={() => setActiveCreatorId(vault.id)}
                className={`btn-tactile flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl border cursor-pointer transition-all shrink-0 ${
                  isActive
                    ? "bg-[#141814] border-t border-[#d4fc50]/60 border-x border-b border-[#d4fc50]/30 shadow-[inset_0_1px_0_rgba(212,252,80,0.2),0_10px_25px_rgba(0,0,0,0.7)]"
                    : "bg-[#0a0c0a] border-white/10 hover:border-white/20 text-white/60 hover:text-white"
                }`}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden border border-white/15 shrink-0">
                  <img src={vault.image} alt={vault.creator} className="w-full h-full object-cover object-top" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight">{vault.creator}</span>
                    <span className="text-[11px] font-mono font-bold text-[#d4fc50] bg-[#d4fc50]/10 px-1.5 py-0.5 rounded">
                      {vault.ticker}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40 block">{vault.category}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3-Tier Content Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          {currentCreator.tiers.map((tier) => {
            const isUnlocked = unlockedTiers[`${currentCreator.id}_${tier.tierName}`];
            const tokenCost = tier.isHolderGate
              ? (50 / currentCreator.tokenPrice).toFixed(1)
              : (tier.usdPrice / currentCreator.tokenPrice).toFixed(1);

            return (
              <SpotlightCard
                key={tier.tierName}
                className="p-6 sm:p-7 flex flex-col justify-between border border-white/10 bg-[#0d0d0d] hover:border-white/20 transition-all rounded-2xl relative overflow-hidden"
                spotlightColor="rgba(212, 252, 80, 0.08)"
              >
                <div>
                  {/* Card Header: Tier Badge & Requirements */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
                    <div>
                      <span className="text-[10px] font-mono font-medium uppercase tracking-wider block text-white/50">
                        {tier.isHolderGate ? "HOLD GATE UTILITY" : "DEFLATIONARY BURN SINK"}
                      </span>
                      <span className="text-base font-bold text-white tracking-tight font-sans">
                        {tier.isHolderGate ? "Hold ≥ $50 Token" : `$${tier.usdPrice} USD Burn`}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-medium text-[#d4fc50] bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10 inline-block">
                        {tokenCost} {currentCreator.ticker.split(" ")[0]}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 block mt-0.5">
                        {tier.isHolderGate ? "Holding Required" : "On-Site Burn"}
                      </span>
                    </div>
                  </div>

                  {/* Media Preview Box */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 border border-white/10 bg-black/60">
                    <img
                      src={tier.previewThumbnail}
                      alt={tier.tierName}
                      className={`w-full h-full object-cover object-top transition-all duration-500 ${
                        isUnlocked ? "filter-none scale-100" : "filter blur-sm scale-105 opacity-60"
                      }`}
                    />

                    {/* Status Overlay */}
                    {!isUnlocked ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm text-center">
                        <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                          {tier.isHolderGate ? "Market Cap Gate" : "Burn-to-Access"}
                        </span>
                        <span className="text-[11px] font-mono text-[#d4fc50] mt-1">
                          {tier.isHolderGate ? tier.gateRequirement : `Burn $${tier.usdPrice} on Website`}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#d4fc50] text-black font-mono text-[10px] font-bold tracking-wider uppercase">
                        Unlocked & Active
                      </div>
                    )}
                  </div>

                  {/* Format & Description */}
                  <div className="mb-4">
                    <span className="text-[11px] font-mono text-[#d4fc50] block uppercase tracking-wider mb-1">
                      {tier.format}
                    </span>
                    <p className="text-xs text-white/70 leading-relaxed font-sans">
                      {tier.description}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-1.5 py-3 border-t border-white/[0.06] font-mono text-xs text-white/60 mb-6">
                    {tier.perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
                        <span className="text-white/80">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button with Apple Tactile Feedback */}
                <div>
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => {
                        setToastMessage("Decrypting private media archive from Robinhood L2 IPFS cluster...");
                        setTimeout(() => setToastMessage(null), 3500);
                      }}
                      className="btn-tactile w-full py-3 rounded-xl font-mono font-medium text-xs uppercase tracking-wider bg-[#d4fc50] text-black shadow-[0_0_15px_rgba(212,252,80,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Access Media Pass</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenBurn(tier)}
                      className="btn-tactile w-full py-3 rounded-xl font-mono font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-white/10 hover:bg-[#d4fc50] text-white hover:text-black border-t border-white/20 border-x border-b border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer"
                    >
                      <span>
                        {tier.isHolderGate
                          ? "Verify $50 Token Balance"
                          : `Burn $${tier.usdPrice} on Website`}
                      </span>
                      <span>→</span>
                    </button>
                  )}
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {/* Flywheel Architecture Explainer Callout */}
        <div className="p-8 rounded-3xl bg-[#0d100d] border border-white/10 backdrop-blur-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#d4fc50] font-bold">
                HOW THE BURN-TO-UNLOCK FLYWHEEL WORKS
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                Fans Get Premium Content. Holders Get Deflationary Alpha.
              </h3>
              <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                In Web2, 100% of fan spend vanishes into OnlyFans' 20% platform tax and corporate bank accounts, leaving fans with zero financial upside.
                On Mikayla Launchpad, every time a fan unlocks an unreleased photoset, PPV video, or private AI call, the tokens are <strong>permanently removed from circulation on Robinhood Chain</strong>.
                This transforms organic fan engagement into non-stop upward buy pressure and token supply shrinkage.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 font-mono text-xs">
                <div className="text-white/40 text-[10px] uppercase mb-1">Contract Action</div>
                <div className="text-[#d4fc50] font-bold truncate">ERC20.burn(amount)</div>
                <div className="text-[11px] text-white/50 mt-0.5">Automated LP Deflation</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 font-mono text-xs">
                <div className="text-white/40 text-[10px] uppercase mb-1">Gas Cost per Burn</div>
                <div className="text-white font-bold">&lt; $0.0008 USD</div>
                <div className="text-[11px] text-[#10b981] mt-0.5">Sub-Second Robinhood L2</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Burn Execution Modal */}
      {burnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-md bg-[#0e110e] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {!burnModal.done ? (
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-[#d4fc50] uppercase font-bold tracking-wider">
                    BURN AUTHORIZATION
                  </span>
                  <button
                    onClick={() => setBurnModal(null)}
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 mx-auto mb-3">
                    <img src={burnModal.creator.image} alt={burnModal.creator.creator} className="w-full h-full object-cover object-top" />
                  </div>
                  <h4 className="font-serif text-2xl text-white tracking-tight">{burnModal.tier.tierName}</h4>
                  <p className="text-xs font-mono text-white/50 mt-1">
                    Creator: {burnModal.creator.creator} ({burnModal.creator.ticker})
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs space-y-2.5 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/40">Tier Price:</span>
                    <strong className="text-white font-bold">${burnModal.tier.usdPrice}.00 USD</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Token Burn Amount:</span>
                    <strong className="text-[#d4fc50] font-bold">
                      {burnModal.tokenAmount} {burnModal.creator.ticker}
                    </strong>
                  </div>
                  <div className="flex justify-between text-[11px] pt-2 border-t border-white/5">
                    <span className="text-white/30">Destination:</span>
                    <span className="text-white/60">0x000000000000000000000000000000000000dEaD</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isBurning}
                  onClick={handleConfirmBurn}
                  className={`w-full py-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isBurning
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-[#d4fc50] hover:bg-[#e4ff75] text-black shadow-xl shadow-[#d4fc50]/20 hover:scale-[1.01]"
                  }`}
                >
                  {isBurning ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      {burnStep === 1 && "Signing Robinhood L2 Burn Tx..."}
                      {burnStep === 2 && "Transmitting Tokens to 0x...dEaD..."}
                      {burnStep === 3 && "Decrypting Vault IPFS Stream..."}
                    </>
                  ) : (
                    `Confirm & Burn ${burnModal.tokenAmount} ${burnModal.creator.ticker}`
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center mx-auto mb-4 text-[#10b981]">
                  <svg className="w-8 h-8 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-serif text-2xl text-white mb-1">Content Vault Unlocked!</h4>
                <p className="text-xs font-mono text-[#d4fc50] mb-4">
                  Permanently burned {burnModal.tokenAmount} {burnModal.creator.ticker} ($
                  {burnModal.tier.usdPrice} USD)
                </p>
                <p className="text-xs text-white/65 mb-6 leading-relaxed">
                  Your transaction has finalized on Robinhood Chain. Your wallet now holds lifetime decryption rights to this release.
                </p>
                <button
                  type="button"
                  onClick={() => setBurnModal(null)}
                  className="w-full py-3.5 rounded-xl bg-[#d4fc50] hover:bg-[#e4ff75] text-black font-mono text-xs font-bold uppercase tracking-wider"
                >
                  View Unlocked Media Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ContentVault;
