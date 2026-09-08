import React, { useState } from "react";
import SpotlightCard from "./react-bits/SpotlightCard";
import ShinyText from "./react-bits/ShinyText";
import DecryptedText from "./react-bits/DecryptedText";
import CountUp from "./react-bits/CountUp";

const creatorVaults = [
  {
    id: "aria",
    creator: "Aria Brooks",
    ticker: "$ARIA",
    image: "/creators/aria.jpg",
    category: "OnlyFans Top 0.05%",
    verifiedMonthly: "$72,000/mo Escrow",
    tokenPrice: 0.0428,
    accentColor: "#d4fc50",
    badgeBorder: "border-[#d4fc50]/30 bg-[#d4fc50]/10 text-[#d4fc50]",
    tiers: [
      {
        tierName: "UNFILTERED MILAN LEICA ROLL",
        usdPrice: 5,
        format: "24 Uncompressed 35mm Scans",
        description: "Intimate backstage 35mm film negatives shot in Aria's private Milan hotel dressing room. Uncensored, raw, zero public retouching.",
        perks: ["24 Uncompressed 35mm Leica Scans", "Private Darkroom Archive Pass", "Permanent On-Chain Vault Key"],
        previewThumbnail: "/creators/aria.jpg",
      },
      {
        tierName: "HOTEL SUITE 4K & 3 AM WHISPER",
        usdPrice: 10,
        format: "10-Min 4K Master Film + Voice Memo",
        description: "Private cinematic 4K video recorded in her private penthouse suite after Milan Fashion Week, plus an intimate unscripted 3 AM voice note.",
        perks: ["ProRes 4K 60fps Master Film", "Direct Binaural Voice Memo", "Encrypted Private Telegram Channel"],
        previewThumbnail: "/creators/vault_banner.jpg",
      },
      {
        tierName: "THE BLACK BOX & DIRECT LINE",
        usdPrice: 25,
        format: "Encrypted 1-on-1 Signal Access + Custom Drop",
        description: "Direct end-to-end encrypted messaging pass with Aria, signed physical analog Polaroid mailed in black wax seal, and custom dedicated PPV clip.",
        perks: ["Encrypted Direct Signal Line", "Custom Dedicated 4K Video Drop", "Physical Signed Polaroid in Wax Seal"],
        previewThumbnail: "/creators/luna.jpg",
      },
    ],
  },
  {
    id: "kira",
    creator: "Kira Fox",
    ticker: "$KIRA",
    image: "/creators/kira.jpg",
    category: "Tokyo/Berlin Underground DJ & Cult Star",
    verifiedMonthly: "$58,200/mo Nightlife Escrow",
    tokenPrice: 0.0215,
    accentColor: "#d4fc50",
    badgeBorder: "border-[#d4fc50]/30 bg-[#d4fc50]/10 text-[#d4fc50]",
    tiers: [
      {
        tierName: "TOKYO AFTERHOURS 35MM ROLL",
        usdPrice: 5,
        format: "24 Unreleased 35mm Analog Scans",
        description: "Raw analog 35mm scans shot behind the decks and backstage at Tokyo underground club Womb. Grainy, intimate, living human beauty.",
        perks: ["24 High-Res Analog Negatives", "Uncensored Backstage Archive", "Permanent Cryptographic Key"],
        previewThumbnail: "/creators/kira.jpg",
      },
      {
        tierName: "BERGHAIN SUITE 4K & MIDNIGHT MEMO",
        usdPrice: 10,
        format: "12-Min Uncut 4K Video + Lossless Memo",
        description: "Raw 4K video recording from Kira's private hotel suite after her Berlin set, plus an intimate unscripted 3 AM voice whisper.",
        perks: ["12-Min 4K ProRes Video Master", "Direct Binaural 3 AM Voice Memo", "Unreleased Ambient DJ Mix"],
        previewThumbnail: "/creators/kira.jpg",
      },
      {
        tierName: "PRIVATE SUITE DIRECT KEY & CUSTOM DROP",
        usdPrice: 25,
        format: "End-to-End Encrypted 1-on-1 + Custom PPV",
        description: "Direct encrypted Signal/Telegram channel access with Kira. Request a custom private Polaroid set and personal video answer.",
        perks: ["Direct Encrypted DM Access", "Personalized Custom 4K Clip", "VIP Backstage Guestlist Pass"],
        previewThumbnail: "/creators/vault_banner.jpg",
      },
    ],
  },
  {
    id: "luna",
    creator: "Luna St. Claire",
    ticker: "$LUNA",
    image: "/creators/luna.jpg",
    category: "Nocturnal Cinema & Fansly Top 0.01% Star",
    verifiedMonthly: "$94,000/mo Audited Cashflow",
    tokenPrice: 0.0310,
    accentColor: "#d4fc50",
    badgeBorder: "border-[#d4fc50]/30 bg-[#d4fc50]/10 text-[#d4fc50]",
    tiers: [
      {
        tierName: "PARIS VELVET 35MM VAULT",
        usdPrice: 5,
        format: "24 Vintage Analog Boudoir Scans",
        description: "Private nocturnal boudoir photosets shot on 35mm film in a confidential Paris apartment. Pure film grain, uncensored shadows.",
        perks: ["24 Uncompressed Film Scans", "Backstage Wardrobe Gallery", "Encrypted Vault Download"],
        previewThumbnail: "/creators/luna.jpg",
      },
      {
        tierName: "NOCTURNAL MASTER FILM (UNCUT)",
        usdPrice: 10,
        format: "14-Min High-Bitrate 4K Cinema",
        description: "Full-length unrated backstage luxury film. Direct streaming on Mikayla Launchpad player with zero ads, high-bitrate HDR.",
        perks: ["1080p/4K Encrypted Stream", "Zero-Tracking Decryption", "Fansly VIP Token Verification"],
        previewThumbnail: "/creators/vault_banner.jpg",
      },
      {
        tierName: "THE RED VELVET KEY & PRIVATE STREAM",
        usdPrice: 25,
        format: "Bi-Weekly Private Stream + Vault Archive",
        description: "Bi-weekly token-gated intimate livestream access, complete vault archive pass, and signed physical archival print delivered in confidential packaging.",
        perks: ["Bi-Weekly Private Stream Access", "All Past PPV Vault Releases", "Physical Signed Art Print in Wax Seal"],
        previewThumbnail: "/creators/aria.jpg",
      },
    ],
  },
];

const ContentVault = () => {
  const [activeCreatorId, setActiveCreatorId] = useState("aria");
  const [unlockedTiers, setUnlockedTiers] = useState({});
  const [burnModal, setBurnModal] = useState(null);
  const [isBurning, setIsBurning] = useState(false);
  const [burnStep, setBurnStep] = useState(0);
  const [totalBurnedUsd, setTotalBurnedUsd] = useState(142850);
  const [totalBurnedTokens, setTotalBurnedTokens] = useState(3337616);

  const currentCreator = creatorVaults.find((c) => c.id === activeCreatorId) || creatorVaults[0];

  const handleOpenBurn = (tier) => {
    const tokenAmount = Math.round((tier.usdPrice / currentCreator.tokenPrice) * 10) / 10;
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
            [`${burnModal.creator.id}_${burnModal.tier.usdPrice}`]: true,
          }));
          setTotalBurnedUsd((prev) => prev + burnModal.tier.usdPrice);
          setTotalBurnedTokens((prev) => prev + Math.round(burnModal.tokenAmount));
          setBurnModal((prev) => ({ ...prev, done: true }));
        }, 900);
      }, 900);
    }, 800);
  };

  return (
    <section id="content-vault" className="relative py-20 lg:py-28 bg-[#060706] border-t border-white/10 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[500px] bg-[#d4fc50]/[0.025] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[500px] bg-[#ff007f]/[0.02] blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#ff007f] animate-pulse" />
            <ShinyText
              text="CONFIDENTIAL HUMAN VAULT PROTOCOL · 100% REAL CREATORS"
              className="text-xs font-mono uppercase tracking-widest text-[#d4fc50]"
              speed={3}
            />
            <span className="text-white/30 text-xs">•</span>
            <span className="text-[11px] font-mono text-white/70 uppercase">
              ZERO AI · LIVING BREATHING TALENT
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-tight">
            Burn-to-Unlock Content Vault
          </h2>

          <p className="text-white/70 text-sm sm:text-base mt-4 max-w-3xl mx-auto leading-relaxed">
            Creator tokens are not useless memes or idiotic AI chatbots. These are <strong>world-class, living human creators</strong>. Token holders burn <strong>$5, $10, or $25 USD</strong> worth of the creator's token directly on Mikayla to unlock exclusive 35mm Leica darkroom scans, private 4K hotel suite master films, and encrypted 1-on-1 access. Every unlock <strong>permanently incinerates tokens to 0x000...dead</strong> on Robinhood Chain, driving continuous supply contraction from authentic fan demand.
          </p>

          {/* Live Burn Metrics Ribbon */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto font-mono text-xs">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
              <span className="text-white/40 block text-[10px] uppercase mb-1">Total Content Burned</span>
              <strong className="text-white text-base font-bold">
                $<CountUp to={totalBurnedUsd} separator="," duration={2} />
              </strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
              <span className="text-white/40 block text-[10px] uppercase mb-1">Tokens Incinerated</span>
              <strong className="text-[#d4fc50] text-base font-bold">
                <CountUp to={totalBurnedTokens} separator="," duration={2} />
              </strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
              <span className="text-white/40 block text-[10px] uppercase mb-1">Burn Address</span>
              <span className="text-white/80 bg-white/5 px-2 py-0.5 rounded text-[11px] inline-block font-mono">
                0x00...dEaD
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
              <span className="text-white/40 block text-[10px] uppercase mb-1">Settlement L2</span>
              <span className="text-[#10b981] font-bold text-[11px] block">Robinhood Chain</span>
            </div>
          </div>
        </div>

        {/* Creator Vault Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {creatorVaults.map((vault) => {
            const isActive = activeCreatorId === vault.id;
            return (
              <button
                key={vault.id}
                onClick={() => setActiveCreatorId(vault.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${
                  isActive
                    ? "bg-[#141814] border-[#d4fc50] shadow-xl shadow-[#d4fc50]/10 scale-105"
                    : "bg-[#0a0c0a] border-white/10 hover:border-white/20 text-white/60 hover:text-white"
                }`}
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/15 shrink-0">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          {currentCreator.tiers.map((tier) => {
            const isUnlocked = unlockedTiers[`${currentCreator.id}_${tier.usdPrice}`];
            const tokenCost = (tier.usdPrice / currentCreator.tokenPrice).toFixed(1);

            return (
              <SpotlightCard
                key={tier.usdPrice}
                className="p-6 sm:p-7 flex flex-col justify-between border-white/10 bg-[#0c0e0c] hover:border-white/20 transition-all relative overflow-hidden"
                spotlightColor="rgba(212, 252, 80, 0.14)"
              >
                <div>
                  {/* Card Header: Tier Badge & Burn Price Tag */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider block text-white/50">
                        {tier.tierName}
                      </span>
                      <span className="text-lg font-serif font-bold text-white tracking-tight">
                        ${tier.usdPrice} USD BURN
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#d4fc50] bg-[#d4fc50]/10 px-2.5 py-1 rounded-xl border border-[#d4fc50]/30 inline-block">
                        {tokenCost} {currentCreator.ticker}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 block mt-0.5">Permanent Burn</span>
                    </div>
                  </div>

                  {/* Media Preview Box with Frosted Gate */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 border border-white/10 bg-black/60 group">
                    <img
                      src={tier.previewThumbnail}
                      alt={tier.tierName}
                      className={`w-full h-full object-cover object-top transition-all duration-700 ${
                        isUnlocked ? "filter-none scale-100" : "filter blur-md scale-105 opacity-60"
                      }`}
                    />

                    {/* Scanline texture overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

                    {/* Status Overlay */}
                    {!isUnlocked ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm text-center">
                        <div className="w-10 h-10 rounded-2xl bg-black/70 border border-white/20 flex items-center justify-center mb-2 shadow-2xl">
                          <svg className="w-5 h-5 text-[#d4fc50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                          TOKEN-GATED VAULT
                        </span>
                        <span className="text-[11px] font-mono text-[#d4fc50] mt-0.5">
                          Burn ${tier.usdPrice} of {currentCreator.ticker}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#10b981] text-black font-mono text-[10px] font-bold tracking-wider uppercase shadow-xl flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                        UNLOCKED & ACTIVE
                      </div>
                    )}
                  </div>

                  {/* Format & Description */}
                  <div className="mb-4">
                    <span className="text-[11px] font-mono text-[#a8c3a0] block uppercase tracking-wider mb-1">
                      {tier.format}
                    </span>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-1.5 py-3 border-t border-white/5 font-mono text-xs text-white/60 mb-6">
                    {tier.perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <svg className="w-3.5 h-3.5 text-[#d4fc50] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Burn Action Button */}
                <div>
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => alert(`Opening full high-definition vault for ${currentCreator.creator} (${tier.tierName}) on Robinhood Chain IPFS player!`)}
                      className="w-full py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-[#10b981] hover:bg-[#1fd694] text-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#10b981]/20"
                    >
                      <span>Access Unlocked Media</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenBurn(tier)}
                      className="w-full py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-[#d4fc50] hover:bg-[#e4ff75] text-[#080808] shadow-xl shadow-[#d4fc50]/20 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <span>Burn ${tier.usdPrice} in {currentCreator.ticker} to Unlock</span>
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
