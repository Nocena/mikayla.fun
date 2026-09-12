import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  ShieldCheck,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  FolderLock,
  FolderOpen,
  Image as ImageIcon,
  Film,
  Layers,
  Eye,
  Info,
  Play,
  Volume2,
  Mic,
  Maximize2,
  X,
} from "lucide-react";

import { useWeb3Wallet } from "../hooks/useWeb3Wallet";
import { useStaking } from "../hooks/useStaking";
import {
  STAKING_CONFIG,
  CREATOR_FOLDERS_CATALOG,
  getUserTier,
} from "../constants/staking";
import LightRays from "../components/react-bits/LightRays";
import AgeVerificationModal from "../components/AgeVerificationModal";

export default function VaultPage() {
  const {
    account,
    signer,
    isConnected,
    isCorrectNetwork,
    connectWallet,
    switchToRobinhood,
    balance: walletBalFormatted,
  } = useWeb3Wallet();

  const {
    loading,
    activeStaked,
    activeStakedFormatted,
    pendingUnstake,
    pendingUnstakeFormatted,
    canWithdrawNow,
    cooldownFormatted,
    cooldownRemainingSeconds,
    isVipActive,
    walletTokenBalance,
    walletTokenBalanceFormatted,
    isApproved,
    totalStakedProtocolFormatted,
    totalActiveStakers,
    txLoading,
    txMessage,
    txHash,
    error,
    refreshStakeInfo,
    handleApprove,
    handleStake,
    handleInitiateUnstake,
    handleCancelUnstake,
    handleWithdraw,
  } = useStaking(account, signer);

  // Staking input state
  const [stakeInput, setStakeInput] = useState("900000");
  const [unstakeInput, setUnstakeInput] = useState("");
  const [activeTab, setActiveTab] = useState("folders"); // "folders" | "manage"
  const [filterTier, setFilterTier] = useState("all"); // "all" | "bronze" | "silver" | "gold"
  const [mediaFilter, setMediaFilter] = useState("all"); // "all" | "video" | "photo" | "audio"
  const [activeFolderModal, setActiveFolderModal] = useState(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const openFolderModal = (folder) => {
    setActiveFolderModal(folder);
    setSelectedFileIndex(0);
  };

  // Keyboard navigation for active folder media viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (fullscreenImage) {
        if (e.key === "Escape") setFullscreenImage(null);
        return;
      }
      if (!activeFolderModal) return;
      if (e.key === "Escape") {
        setActiveFolderModal(null);
        return;
      }
      if (!activeFolderModal.files || activeFolderModal.files.length === 0) return;
      if (e.key === "ArrowLeft") {
        setSelectedFileIndex((prev) =>
          prev > 0 ? prev - 1 : activeFolderModal.files.length - 1
        );
      } else if (e.key === "ArrowRight") {
        setSelectedFileIndex((prev) =>
          prev < activeFolderModal.files.length - 1 ? prev + 1 : 0
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeFolderModal, fullscreenImage]);

  // Compute active user tier based on staked amount
  const userTier = getUserTier(activeStaked);

  const isFolderUnlocked = (folder) => {
    if (!userTier) return false;
    if (userTier === "gold") return true;
    if (userTier === "silver") return folder.tierRequired === "bronze" || folder.tierRequired === "silver";
    if (userTier === "bronze") return folder.tierRequired === "bronze";
    return false;
  };

  const parsedStakeWei = (() => {
    try {
      return ethers.parseUnits(stakeInput || "0", 18);
    } catch {
      return 0n;
    }
  })();

  const parsedUnstakeWei = (() => {
    try {
      return ethers.parseUnits(unstakeInput || "0", 18);
    } catch {
      return 0n;
    }
  })();

  const onStakeSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      await connectWallet();
      return;
    }
    if (!isCorrectNetwork) {
      await switchToRobinhood();
      return;
    }
    if (!isApproved) {
      await handleApprove();
    } else {
      await handleStake(parsedStakeWei);
    }
  };

  const onUnstakeSubmit = async (e) => {
    e.preventDefault();
    if (!parsedUnstakeWei || parsedUnstakeWei === 0n) return;
    await handleInitiateUnstake(parsedUnstakeWei);
    setUnstakeInput("");
  };

  const onCancelUnstakeClick = async () => {
    await handleCancelUnstake();
  };

  const filteredCatalog = CREATOR_FOLDERS_CATALOG.filter((f) => {
    let matchesTier = true;
    if (filterTier === "bronze") matchesTier = f.tierRequired === "bronze";
    else if (filterTier === "silver") matchesTier = f.tierRequired === "bronze" || f.tierRequired === "silver";
    else if (filterTier === "gold") matchesTier = true;

    let matchesMedia = true;
    if (mediaFilter === "video") matchesMedia = f.mediaType === "video";
    else if (mediaFilter === "photo") matchesMedia = f.mediaType === "photo";
    else if (mediaFilter === "audio") matchesMedia = f.mediaType === "audio";

    return matchesTier && matchesMedia;
  });

  const unlockedCount = CREATOR_FOLDERS_CATALOG.filter((f) => isFolderUnlocked(f)).length;

  return (
    <div className="min-h-screen bg-[#080808] text-[#f4f4f2] font-sans relative overflow-x-hidden selection:bg-[#d4fc50] selection:text-black">
      {/* 18+ Verification Modal */}
      <AgeVerificationModal />

      {/* Volumetric Neon Ambient Glow */}
      <LightRays
        raysColor="#d4fc50"
        raysSpeed={0.3}
        lightSpread={1.2}
        rayLength={2.0}
        pulsating={true}
        noiseAmount={0.02}
        followMouse={false}
        className="opacity-20 pointer-events-none fixed inset-0 z-0"
      />

      {/* Top Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/70 border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 group text-xs font-mono text-white/60 hover:text-white transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#d4fc50] shadow-[0_0_8px_#d4fc50]" />
              <span className="group-hover:-translate-x-0.5 transition-transform">← mikayla.fun</span>
            </Link>

            <span className="text-white/20 hidden sm:inline">/</span>

            <div className="flex items-center gap-2 font-mono text-xs text-white/90">
              <span className="text-[#d4fc50] font-bold">[ CREATOR VAULTS ]</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-white/60 hidden md:inline">
                3-Day Onchain Lock
              </span>
            </div>
          </div>

          {/* Wallet Connection Capsule */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">
                <span
                  className={`w-2 h-2 rounded-full ${
                    userTier
                      ? "bg-[#30d158] shadow-[0_0_8px_#30d158]"
                      : "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                  }`}
                />
                <span className="text-white/80 hidden sm:inline">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
                <span className="text-[#d4fc50] font-bold uppercase">
                  {userTier ? `${userTier} PASS` : "LOCKED"}
                </span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="btn-tactile px-4 py-1.5 rounded-lg bg-[#d4fc50] text-black text-xs font-mono font-bold hover:bg-[#c2eb40] transition-colors shadow-[0_0_20px_rgba(212,252,80,0.2)]"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Hero Banner */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4fc50]/10 border border-[#d4fc50]/20 text-[#d4fc50] font-mono text-xs uppercase tracking-widest mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Non-Custodial Partner Vault // 3-Day Unbonding</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
            OFFICIAL CREATOR <span className="text-stroke-lime text-transparent">ARCHIVE</span>
          </h1>

          <p className="text-white/70 text-sm sm:text-base max-w-3xl font-normal leading-relaxed">
            Exclusive private sets, unedited raw session footage, and voice notes from verified partner creators who earn ongoing protocol revenue. Retain <strong>100% custody</strong> in the verified staking contract on Robinhood Chain with a swift <strong>3-day unstaking cooldown</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
              <span className="text-white/40 text-[11px] font-mono block mb-1">UNLOCKED ARCHIVES</span>
              <span className="text-lg sm:text-xl font-mono font-bold text-[#d4fc50]">
                {unlockedCount} / {CREATOR_FOLDERS_CATALOG.length} <span className="text-xs text-white/50">Folders</span>
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
              <span className="text-white/40 text-[11px] font-mono block mb-1">ACTIVE TIER</span>
              <span className="text-lg sm:text-xl font-mono font-bold uppercase text-white">
                {userTier ? `${userTier} Pass` : "None"}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
              <span className="text-white/40 text-[11px] font-mono block mb-1">UNBONDING COOLDOWN</span>
              <span className="text-lg sm:text-xl font-mono font-bold text-white">
                3 Days <span className="text-xs text-white/50">(259,200s)</span>
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
              <span className="text-white/40 text-[11px] font-mono block mb-1">AUDITED CONTRACT</span>
              <a
                href={`${STAKING_CONFIG.blockExplorer}/address/${STAKING_CONFIG.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold text-[#d4fc50] hover:underline flex items-center gap-1 mt-1"
              >
                <span>{STAKING_CONFIG.contractAddress.slice(0, 6)}...{STAKING_CONFIG.contractAddress.slice(-4)}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>



        {/* Transaction / Error Feedback */}
        <AnimatePresence>
          {txMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 rounded-xl bg-black/80 border border-[#d4fc50] backdrop-blur-2xl flex items-center justify-between shadow-[0_0_30px_rgba(212,252,80,0.15)]"
            >
              <div className="flex items-center gap-3">
                {txLoading ? (
                  <RefreshCw className="w-5 h-5 text-[#d4fc50] animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#30d158]" />
                )}
                <div>
                  <span className="text-sm font-mono text-white block">{txMessage}</span>
                  {txHash && (
                    <a
                      href={`${STAKING_CONFIG.blockExplorer}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#d4fc50] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      View on Blockscout <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-500/50 backdrop-blur-2xl flex items-center gap-3 text-red-300 text-sm font-mono"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Authenticity Notice */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            <strong className="text-amber-300">Authentic Raw Camera Rolls:</strong> All footage and media sets are authentic, unedited archives received straight from our verified partner creators. Because these are organic mobile camera rolls and raw takes, files maintain their natural mobile capture resolution with zero artificial studio filters.
          </div>
        </div>

        {/* Main Tabs Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("folders")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all flex items-center gap-2 ${
                activeTab === "folders"
                  ? "bg-[#d4fc50] text-black font-bold shadow-md shadow-[#d4fc50]/20"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <FolderLock className="w-4 h-4" />
              <span>Creator Folders ({CREATOR_FOLDERS_CATALOG.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("manage")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all flex items-center gap-2 ${
                activeTab === "manage"
                  ? "bg-[#d4fc50] text-black font-bold shadow-md shadow-[#d4fc50]/20"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Staking Deck & 3-Day Cooldown</span>
            </button>
          </div>

          {/* Dynamic Media & Tier Filtering Toolbar */}
          {activeTab === "folders" && (
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full border-t border-white/5 pt-4">
              {/* Media Type Filter (Videos / Photos / Audio) */}
              <div className="flex items-center gap-1.5 bg-black/70 p-1.5 rounded-2xl border border-white/10 text-xs font-mono backdrop-blur-xl flex-wrap">
                <button
                  type="button"
                  onClick={() => setMediaFilter("all")}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    mediaFilter === "all"
                      ? "bg-white/20 text-white font-bold shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>All Media (16)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaFilter("video")}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    mediaFilter === "video"
                      ? "bg-emerald-500/25 border border-emerald-500/50 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      : "text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10"
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🎬 77 Videos</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaFilter("photo")}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    mediaFilter === "photo"
                      ? "bg-blue-500/25 border border-blue-500/50 text-blue-300 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "text-blue-400/80 hover:text-blue-300 hover:bg-blue-500/10"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>📸 6 Photo Sets</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaFilter("audio")}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    mediaFilter === "audio"
                      ? "bg-purple-500/25 border border-purple-500/50 text-purple-300 font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      : "text-purple-400/80 hover:text-purple-300 hover:bg-purple-500/10"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-purple-400" />
                  <span>🎙️ Voice Notes</span>
                </button>
              </div>

              {/* Tier Filters */}
              <div className="flex items-center gap-1 bg-black/70 p-1.5 rounded-2xl border border-white/10 text-xs font-mono backdrop-blur-xl flex-wrap">
                <button
                  type="button"
                  onClick={() => setFilterTier("all")}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    filterTier === "all" ? "bg-white/20 text-white font-bold" : "text-white/50 hover:text-white"
                  }`}
                >
                  All Tiers
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTier("bronze")}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    filterTier === "bronze" ? "bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40" : "text-white/50 hover:text-white"
                  }`}
                >
                  Bronze ($50)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTier("silver")}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    filterTier === "silver" ? "bg-slate-300/30 text-slate-200 font-bold border border-slate-300/40" : "text-white/50 hover:text-white"
                  }`}
                >
                  Silver ($100)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTier("gold")}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    filterTier === "gold" ? "bg-[#d4fc50]/30 text-[#d4fc50] font-bold border border-[#d4fc50]/40" : "text-white/50 hover:text-white"
                  }`}
                >
                  Gold ($200)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: 16 CREATOR FOLDERS GRID */}
        {activeTab === "folders" && (
          filteredCatalog.length === 0 ? (
            <div className="py-16 text-center rounded-3xl border border-white/10 bg-[#0d0e12]/80 backdrop-blur-xl p-8 max-w-lg mx-auto">
              <Film className="w-12 h-12 text-[#d4fc50]/50 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">No Creator Folders Found</h3>
              <p className="text-xs font-mono text-white/50 mb-5">
                No folders match both the selected media format and access tier filter.
              </p>
              <button
                type="button"
                onClick={() => { setFilterTier("all"); setMediaFilter("all"); }}
                className="px-5 py-2.5 rounded-xl bg-[#d4fc50] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCatalog.map((folder) => {
                const unlocked = isFolderUnlocked(folder);
                const tierConfig = STAKING_CONFIG.tiers[folder.tierRequired];

                return (
                  <div
                    key={folder.id}
                    onClick={() => openFolderModal(folder)}
                    className={`group relative flex flex-col justify-between rounded-3xl border bg-[#0d0e12]/90 overflow-hidden transition-all duration-300 cursor-pointer ${
                      unlocked
                        ? "border-[#d4fc50]/40 hover:border-[#d4fc50] shadow-[0_0_30px_rgba(212,252,80,0.1)] hover:scale-[1.02]"
                        : "border-white/10 hover:border-white/20 opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* Thumbnail / Header Area */}
                    <div className="relative h-48 w-full overflow-hidden bg-black">
                      <img
                        src={folder.coverImage}
                        alt={folder.title}
                        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          unlocked ? "opacity-80" : "opacity-35 blur-sm"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/30 to-transparent" />

                      {/* Top Tier Tag */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${tierConfig.badgeColor}`}>
                          {tierConfig.name.split(" ")[0]} (${tierConfig.usdValue})
                        </span>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80">
                          {unlocked ? (
                            <span className="flex items-center gap-1 text-[#30d158]">
                              <Unlock className="w-3 h-3" />
                              UNLOCKED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-white/50">
                              <Lock className="w-3 h-3" />
                              LOCKED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hover Play Prompt for Video Archives */}
                      {folder.mediaType === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-[#d4fc50] text-black flex items-center justify-center shadow-[0_0_25px_rgba(212,252,80,0.8)] transform scale-75 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 fill-black ml-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Dynamic Media Type Badge */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-1.5">
                          {folder.mediaType === "video" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/90 text-black shadow-[0_0_12px_rgba(16,185,129,0.7)]">
                              <Play className="w-2.5 h-2.5 fill-black" />
                              <span>{folder.filesCount || folder.files?.length || 0} VIDEOS</span>
                            </span>
                          )}
                          {folder.mediaType === "photo" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/90 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]">
                              <ImageIcon className="w-2.5 h-2.5" />
                              <span>{folder.filesCount || folder.files?.length || 0} PHOTOS</span>
                            </span>
                          )}
                          {folder.mediaType === "audio" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/90 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)]">
                              <Mic className="w-2.5 h-2.5" />
                              <span>{folder.filesCount || folder.files?.length || 0} MEMOS</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-white/80 bg-black/80 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-md">
                          {folder.tag}
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-mono text-white/40 mb-1">{folder.category}</div>
                        <h3 className="text-base font-bold text-white mb-2 leading-tight group-hover:text-[#d4fc50] transition-colors">
                          {folder.title}
                        </h3>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                          {folder.description}
                        </p>

                        {/* Sneak Peek Mini Thumbnails Strip from actual Drive files */}
                        {folder.files && folder.files.length > 0 && (
                          <div className="mb-3 pt-2.5 border-t border-white/5">
                            <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-1.5">
                              <span>Archive Sneak Peek:</span>
                              <span className="text-[#d4fc50] font-bold">
                                {folder.mediaType === "video" ? `🎬 ${folder.files.length} Videos` : `${folder.files.length} Items`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {folder.files.slice(0, 4).map((f, idx) => (
                                <div
                                  key={f.id || idx}
                                  className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0"
                                >
                                  <img
                                    src={f.thumbUrl}
                                    alt=""
                                    loading="lazy"
                                    className={`w-full h-full object-cover transition-all ${
                                      unlocked ? "opacity-90 group-hover:scale-110" : "opacity-50 blur-[1px]"
                                    }`}
                                    onError={(e) => {
                                      e.target.src = folder.coverImage;
                                    }}
                                  />
                                  {f.type === "video" && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                      <Play className="w-3 h-3 text-[#d4fc50] fill-[#d4fc50]" />
                                    </div>
                                  )}
                                  {f.type === "audio" && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                      <Mic className="w-2.5 h-2.5 text-[#d4fc50]" />
                                    </div>
                                  )}
                                </div>
                              ))}
                              {folder.files.length > 4 && (
                                <div className="h-10 px-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-white/60">
                                  +{folder.files.length - 4}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/50">
                        <span className="text-white/40">{folder.qualityNote.split("·")[0]}</span>
                        <span className="text-[#d4fc50] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          {unlocked ? (folder.mediaType === "video" ? "Play Videos →" : "Open Archive →") : "View Tier →"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* TAB 2: STAKING MANAGEMENT DECK */}
        {activeTab === "manage" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Stake Form Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0e12]/90 border border-white/15 backdrop-blur-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-[#d4fc50]/15 border border-[#d4fc50]/30 flex items-center justify-center text-[#d4fc50]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Stake $MIKA into Vault</h3>
                    <span className="text-xs font-mono text-white/40">
                      3-Day Cooldown · Non-Custodial Vault
                    </span>
                  </div>
                </div>

                {/* Staking Tiers Selector */}
                <div className="mb-6 space-y-2">
                  <label className="text-xs font-mono text-white/60">Choose Tier Target:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setStakeInput("900000")}
                      className={`p-3 rounded-2xl border text-center font-mono transition-all ${
                        stakeInput === "900000"
                          ? "bg-amber-500/20 border-amber-500 text-amber-300"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                      }`}
                    >
                      <div className="text-xs font-bold">Bronze ($50)</div>
                      <div className="text-[10px] text-white/50 mt-0.5">900K $MIKA</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStakeInput("1800000")}
                      className={`p-3 rounded-2xl border text-center font-mono transition-all ${
                        stakeInput === "1800000"
                          ? "bg-slate-400/20 border-slate-300 text-white"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                      }`}
                    >
                      <div className="text-xs font-bold">Silver ($100)</div>
                      <div className="text-[10px] text-white/50 mt-0.5">1.8M $MIKA</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStakeInput("3600000")}
                      className={`p-3 rounded-2xl border text-center font-mono transition-all ${
                        stakeInput === "3600000"
                          ? "bg-[#d4fc50]/20 border-[#d4fc50] text-[#d4fc50]"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                      }`}
                    >
                      <div className="text-xs font-bold">Gold ($200)</div>
                      <div className="text-[10px] text-white/50 mt-0.5">3.6M $MIKA</div>
                    </button>
                  </div>
                </div>

                {/* Form Inputs */}
                <form onSubmit={onStakeSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeInput}
                      onChange={(e) => setStakeInput(e.target.value)}
                      placeholder="900000"
                      className="w-full bg-black/90 border border-white/15 rounded-2xl px-4 py-3.5 text-white font-mono text-sm focus:outline-none focus:border-[#d4fc50]"
                    />
                    <button
                      type="button"
                      onClick={() => setStakeInput(ethers.formatUnits(walletTokenBalance, 18))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white/80"
                    >
                      MAX
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={txLoading}
                    className="w-full py-4 rounded-2xl bg-[#d4fc50] hover:bg-[#c2eb40] text-black font-mono font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#d4fc50]/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {!isConnected ? (
                      "Connect Wallet"
                    ) : !isApproved ? (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Step 1: Approve $MIKA
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Step 2: Stake & Lock Tokens
                      </>
                    )}
                  </button>
                </form>

                {/* Balance Summary */}
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-xs font-mono text-white/60">
                  <span>Wallet Balance:</span>
                  <span className="text-white font-bold">{walletTokenBalanceFormatted} $MIKA</span>
                </div>
              </div>
            </div>

            {/* Unstake & Cooldown Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0e12]/90 border border-white/15 backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-mono text-white/40 block">CURRENT STAKE</span>
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                      {activeStakedFormatted} <span className="text-sm text-[#d4fc50]">$MIKA</span>
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#d4fc50]/10 border border-[#d4fc50]/30 text-[#d4fc50] text-xs font-mono font-bold uppercase">
                    {userTier ? `${userTier} Pass` : "No Active Tier"}
                  </div>
                </div>

                {/* Cooldown State if Active */}
                {pendingUnstake > 0n && (
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-400/20 mb-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/70">Unbonding Countdown (3 Days):</span>
                      <span className="text-amber-400 font-bold">{cooldownFormatted}</span>
                    </div>

                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-1000"
                        style={{
                          width: `${Math.max(
                            5,
                            ((259200 - cooldownRemainingSeconds) / 259200) * 100
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={onCancelUnstakeClick}
                        disabled={txLoading}
                        className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold transition-colors"
                      >
                        Cancel Cooldown
                      </button>
                      {canWithdrawNow && (
                        <button
                          type="button"
                          onClick={handleWithdraw}
                          disabled={txLoading}
                          className="flex-1 py-2.5 rounded-xl bg-[#30d158] hover:bg-[#28b84d] text-black text-xs font-mono font-bold transition-colors shadow-lg"
                        >
                          Withdraw Tokens
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Initiate Unstake Form */}
                <form onSubmit={onUnstakeSubmit} className="space-y-4">
                  <label className="text-xs font-mono text-white/60 block">
                    Initiate 3-Day Unbonding Cooldown:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={unstakeInput}
                      onChange={(e) => setUnstakeInput(e.target.value)}
                      placeholder="Amount to unstake"
                      className="w-full bg-black/90 border border-white/15 rounded-2xl px-4 py-3.5 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setUnstakeInput(ethers.formatUnits(activeStaked, 18))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white/80"
                    >
                      ALL
                    </button>
                  </div>

                  <p className="text-[11px] text-white/40 font-mono leading-relaxed">
                    Initiating unstaking starts the 3-day onchain cooldown. Your tokens remain safe in the contract until the timer completes.
                  </p>

                  <button
                    type="submit"
                    disabled={txLoading || !unstakeInput}
                    className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-sm transition-all disabled:opacity-30"
                  >
                    Initiate 3-Day Unstake
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* FOLDER PREVIEW / DETAIL LIGHTBOX MODAL */}
        <AnimatePresence>
          {activeFolderModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-3xl overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ type: "spring", damping: 26, stiffness: 320 }}
                className="relative w-full max-w-6xl rounded-[28px] sm:rounded-[36px] border border-white/15 bg-[#0a0b0e]/95 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95),0_0_50px_rgba(212,252,80,0.08)] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
              >
                {/* 1. Frosted Apple Header Bar */}
                <div className="flex items-center justify-between gap-3 px-5 sm:px-7 py-3.5 border-b border-white/10 bg-white/[0.02] backdrop-blur-xl shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/15 shrink-0 bg-black shadow-inner">
                      <img
                        src={activeFolderModal.coverImage}
                        alt={activeFolderModal.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold uppercase text-[#d4fc50] tracking-wider">
                          {activeFolderModal.creator}
                        </span>
                        <span className="text-white/30 hidden sm:inline">·</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-white/70">
                          {activeFolderModal.itemCount}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          isFolderUnlocked(activeFolderModal)
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                            : "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                        }`}>
                          {isFolderUnlocked(activeFolderModal) ? "UNLOCKED PASS" : "LOCKED ARCHIVE"}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white truncate font-sans tracking-tight">
                        {activeFolderModal.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/70">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#d4fc50]" />
                      <span>100% Custody · 3-Day Unbonding</span>
                    </div>

                    <button
                      onClick={() => setActiveFolderModal(null)}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer active:scale-90"
                      title="Close modal (Esc)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Unlocked View: Master-Detail Split Layout */}
                {isFolderUnlocked(activeFolderModal) ? (
                  <div className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                    {/* LEFT PANE: Spotlight Stage (60% Desktop) */}
                    <div className="lg:col-span-7 xl:col-span-8 p-3 sm:p-5 flex flex-col justify-between bg-black/60 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                      {(() => {
                        const currentFile =
                          activeFolderModal.files?.[selectedFileIndex] || activeFolderModal.files?.[0];
                        if (!currentFile) return null;
                        const isImage = currentFile.type === "image";
                        const isVideo = currentFile.type === "video";
                        const isAudio = currentFile.type === "audio";

                        return (
                          <>
                            {/* Media Viewport Container */}
                            <div className="flex-1 flex items-center justify-center relative min-h-[260px] max-h-[50vh] sm:max-h-[58vh] overflow-hidden rounded-2xl bg-black/40">
                              {/* Soft ambient backlight */}
                              <div
                                className="absolute inset-4 opacity-25 blur-3xl pointer-events-none bg-center bg-cover transition-all duration-700"
                                style={{
                                  backgroundImage: `url(${currentFile.fullUrl || currentFile.thumbUrl})`,
                                }}
                              />

                              {isImage && (
                                <div
                                  onClick={() =>
                                    setFullscreenImage(currentFile.fullUrl || currentFile.thumbUrl)
                                  }
                                  className="relative z-10 w-full h-full flex items-center justify-center cursor-zoom-in group/zoom"
                                >
                                  <img
                                    src={currentFile.fullUrl || currentFile.thumbUrl}
                                    alt={currentFile.name}
                                    className="max-w-full max-h-[48vh] sm:max-h-[56vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300 group-hover/zoom:scale-[1.01]"
                                    onError={(e) => {
                                      e.target.src = activeFolderModal.coverImage;
                                    }}
                                  />
                                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white/80 text-[10px] font-mono opacity-0 group-hover/zoom:opacity-100 transition-opacity flex items-center gap-1">
                                    <Maximize2 className="w-3 h-3 text-[#d4fc50]" />
                                    <span>Zoom Fullscreen</span>
                                  </div>
                                </div>
                              )}

                              {isVideo && (
                                <div className="relative z-10 w-full h-full min-h-[300px] flex items-center justify-center rounded-2xl overflow-hidden bg-black">
                                  <video
                                    key={currentFile.id}
                                    src={currentFile.videoUrl || `/vault/videos/${currentFile.id}.mp4`}
                                    poster={currentFile.fullUrl || currentFile.thumbUrl}
                                    controls
                                    autoPlay
                                    playsInline
                                    loop
                                    className="max-w-full max-h-[50vh] sm:max-h-[58vh] object-contain rounded-2xl shadow-2xl bg-black"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      const fallback = e.currentTarget.parentElement?.querySelector(".video-still-fallback");
                                      if (fallback) fallback.classList.remove("hidden");
                                    }}
                                  />
                                  <div
                                    onClick={() =>
                                      setFullscreenImage(currentFile.fullUrl || currentFile.thumbUrl)
                                    }
                                    className="video-still-fallback hidden w-full h-full flex items-center justify-center relative cursor-zoom-in group/zoom"
                                  >
                                    <img
                                      src={currentFile.fullUrl || currentFile.thumbUrl}
                                      alt={currentFile.name}
                                      className="max-w-full max-h-[48vh] sm:max-h-[56vh] object-contain rounded-2xl shadow-2xl"
                                      onError={(e) => {
                                        e.target.src = activeFolderModal.coverImage;
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                      <div className="px-4 py-2 rounded-2xl bg-black/90 border border-[#d4fc50]/50 text-white text-xs font-mono flex items-center gap-2">
                                        <Play className="w-4 h-4 text-[#d4fc50]" />
                                        <span>Video Stream Buffering · Click to Zoom Frame</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {isAudio && (
                                <div className="relative z-10 w-full py-8 px-6 flex flex-col items-center justify-center text-center">
                                  <div className="w-16 h-16 rounded-3xl bg-[#d4fc50]/15 border border-[#d4fc50]/30 flex items-center justify-center text-[#d4fc50] mb-3 shadow-[0_0_35px_rgba(212,252,80,0.25)]">
                                    <Mic className="w-8 h-8 animate-pulse" />
                                  </div>
                                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase text-[#d4fc50] font-bold mb-2">
                                    STUDIO VOICE MEMO · LOSSLESS AUDIO
                                  </span>
                                  <h4 className="text-base sm:text-lg font-bold text-white mb-1 font-sans">
                                    {currentFile.name}
                                  </h4>
                                  <p className="text-xs font-mono text-white/50 mb-4">
                                    {currentFile.meta} · Direct Creator Audio Stream
                                  </p>

                                  <audio
                                    key={currentFile.id}
                                    src={currentFile.videoUrl || `/vault/videos/${currentFile.id}.mp4`}
                                    controls
                                    autoPlay
                                    className="w-full max-w-md my-3 bg-black/80 rounded-xl"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Floating Apple Dock Controls */}
                            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
                              {/* Left: File metadata */}
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[#d4fc50] text-[10px] font-mono font-bold uppercase shrink-0">
                                  {currentFile.ext || "FILE"}
                                </span>
                                <span className="text-xs font-mono text-white/90 truncate font-semibold">
                                  {currentFile.name}
                                </span>
                                <span className="text-white/40 font-mono text-[10px] hidden sm:inline shrink-0">
                                  · {currentFile.meta}
                                </span>
                              </div>

                              {/* Right: Navigation pill */}
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-lg">
                                  <button
                                    onClick={() =>
                                      setSelectedFileIndex((prev) =>
                                        prev > 0 ? prev - 1 : activeFolderModal.files.length - 1
                                      )
                                    }
                                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer active:scale-90"
                                    title="Previous (Left Arrow)"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>

                                  <span className="px-2 text-[11px] font-mono text-white/80 font-bold">
                                    {String(selectedFileIndex + 1).padStart(2, "0")} /{" "}
                                    {String(activeFolderModal.files.length).padStart(2, "0")}
                                  </span>

                                  <button
                                    onClick={() =>
                                      setSelectedFileIndex((prev) =>
                                        prev < activeFolderModal.files.length - 1 ? prev + 1 : 0
                                      )
                                    }
                                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer active:scale-90"
                                    title="Next (Right Arrow)"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>

                                {isImage && (
                                  <button
                                    onClick={() =>
                                      setFullscreenImage(currentFile.fullUrl || currentFile.thumbUrl)
                                    }
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-[#d4fc50] hover:text-white transition-all cursor-pointer active:scale-90"
                                    title="View Fullscreen"
                                  >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* RIGHT PANE: Archive Files Collection (40% Desktop) */}
                    <div className="lg:col-span-5 xl:col-span-4 p-3 sm:p-5 flex flex-col justify-between bg-[#08090c]/90 overflow-hidden">
                      <div className="flex-1 flex flex-col min-h-0">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10 shrink-0">
                          <div className="flex items-center gap-2 text-xs font-mono text-white">
                            <FolderOpen className="w-4 h-4 text-[#d4fc50]" />
                            <span className="font-bold uppercase tracking-wider">ALL ARCHIVE FILES</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#d4fc50] font-bold">
                            {activeFolderModal.files?.length || 0} TOTAL
                          </span>
                        </div>

                        {/* Files Grid (Side Scrollable without jumping) */}
                        <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 overflow-y-auto max-h-[46vh] sm:max-h-[50vh] pr-1 custom-scrollbar">
                          {activeFolderModal.files?.map((file, idx) => {
                            const isSelected = idx === selectedFileIndex;
                            return (
                              <div
                                key={file.id || idx}
                                onClick={() => setSelectedFileIndex(idx)}
                                className={`group relative rounded-xl border p-1.5 bg-[#050608] cursor-pointer transition-all duration-200 ${
                                  isSelected
                                    ? "border-[#d4fc50] shadow-[0_0_15px_rgba(212,252,80,0.3)] ring-1 ring-[#d4fc50] bg-[#d4fc50]/10 scale-[1.02]"
                                    : "border-white/10 hover:border-white/30 hover:bg-white/5 opacity-80 hover:opacity-100"
                                }`}
                              >
                                <div className="aspect-square w-full rounded-lg overflow-hidden bg-black relative mb-1.5">
                                  <img
                                    src={file.thumbUrl}
                                    alt={file.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                      e.target.src = activeFolderModal.coverImage;
                                    }}
                                  />
                                  {file.type === "video" && (
                                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                      <div className="w-5 h-5 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white">
                                        <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                                      </div>
                                    </div>
                                  )}
                                  {file.type === "audio" && (
                                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                      <Mic className="w-3 h-3 text-[#d4fc50]" />
                                    </div>
                                  )}
                                  <div className="absolute top-1 left-1 px-1 py-0.2 rounded text-[8px] font-mono bg-black/80 text-white/90 border border-white/15 uppercase font-bold">
                                    {file.ext}
                                  </div>
                                </div>
                                <div className="text-[10px] font-mono text-white/90 truncate font-semibold">
                                  {file.name}
                                </div>
                                <div className="text-[9px] font-mono text-white/40 truncate">
                                  {file.meta?.split("·")[0]?.trim() || file.type}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reassurance Footer Banner */}
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50 shrink-0">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>100% Non-Custodial</span>
                        </span>
                        <span className="text-white/40">3-Day Unbonding Cooldown</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 3. High-Converting Seductive VIP Locked Screen */
                  <div className="p-5 sm:p-8 max-w-3xl mx-auto flex flex-col items-center text-center space-y-5 overflow-y-auto">
                    {/* Visual Teaser Fan: Overlapping Stack of Blurred Exclusive Content */}
                    <div className="relative w-full max-w-sm h-36 sm:h-40 flex items-center justify-center my-1">
                      {/* Left Tilted Card */}
                      <div className="absolute -left-2 sm:left-4 w-28 sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl transform -rotate-12 scale-90 opacity-70 blur-[2px]">
                        <img
                          src={activeFolderModal.files?.[1]?.thumbUrl || activeFolderModal.coverImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-white/60" />
                        </div>
                      </div>

                      {/* Right Tilted Card */}
                      <div className="absolute -right-2 sm:right-4 w-28 sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl transform rotate-12 scale-90 opacity-70 blur-[2px]">
                        <img
                          src={activeFolderModal.files?.[2]?.thumbUrl || activeFolderModal.coverImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-white/60" />
                        </div>
                      </div>

                      {/* Center Hero Card */}
                      <div className="relative z-10 w-32 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-black shadow-[0_0_35px_rgba(245,158,11,0.3)] blur-[1px]">
                        <img
                          src={activeFolderModal.files?.[0]?.thumbUrl || activeFolderModal.coverImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col items-center justify-between p-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300">
                            CONFIDENTIAL
                          </span>
                          <div className="w-8 h-8 rounded-full bg-black/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-mono text-white/70 font-bold uppercase">
                            {activeFolderModal.itemCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bold FOMO Headline & Description */}
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{STAKING_CONFIG.tiers[activeFolderModal.tierRequired].name} Required</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                        You're Missing Out On {activeFolderModal.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
                        To unlock this archive, stake at least{" "}
                        <strong className="text-white font-mono">
                          {STAKING_CONFIG.tiers[activeFolderModal.tierRequired].tokenAmountFormatted} ($
                          {STAKING_CONFIG.tiers[activeFolderModal.tierRequired].usdValue})
                        </strong>{" "}
                        in the vault. Unstaked holders miss out on raw unedited creator sets and ongoing platform dividends.
                      </p>
                    </div>

                    {/* FOMO Warning Box for Unstaked Wallets */}
                    <div className="w-full max-w-xl p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-sans text-neutral-200 leading-snug">
                        <strong className="text-amber-300">Over 94% of top holders are already staked.</strong> Wallets on the sidelines earn 0% platform dividends and remain locked out of 16 partner creator archives.
                      </div>
                    </div>

                    {/* Conversion CTAs */}
                    <div className="w-full max-w-md pt-1">
                      <button
                        onClick={() => {
                          setStakeInput(
                            STAKING_CONFIG.tiers[activeFolderModal.tierRequired].tokenAmount.toString()
                          );
                          setActiveTab("manage");
                          setActiveFolderModal(null);
                        }}
                        className="btn-tactile w-full py-3.5 rounded-2xl bg-[#d4fc50] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(212,252,80,0.35)] cursor-pointer active:scale-98 text-center"
                      >
                        Stake {STAKING_CONFIG.tiers[activeFolderModal.tierRequired].name} ($
                        {STAKING_CONFIG.tiers[activeFolderModal.tierRequired].usdValue}) →
                      </button>
                    </div>

                    {/* Dual Reassurance Cards: 3-Day Unbonding + 100% Non-Custodial */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl text-left">
                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white font-mono">3-Day Swift Unbonding</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                          You never lock capital away permanently. Initiate unstaking anytime and claim tokens after a 3-day cooldown.
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                          <ShieldCheck className="w-4 h-4 text-[#d4fc50]" />
                          <span className="text-xs font-bold text-white font-mono">100% Non-Custodial</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                          Immutable verified smart contract on Robinhood Chain L2. Your assets remain strictly in your custody.
                        </p>
                      </div>
                    </div>

                    {/* "More Coming For Believers" Banner */}
                    <div className="w-full max-w-xl p-3 rounded-2xl bg-gradient-to-r from-purple-950/30 via-[#d4fc50]/10 to-transparent border border-[#d4fc50]/30 text-left flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-[#d4fc50] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-mono font-bold text-[#d4fc50] uppercase tracking-wider">
                          More Coming For Believers // Wave 2 Drops
                        </div>
                        <p className="text-[11px] text-neutral-300 leading-relaxed font-sans mt-0.5">
                          Active stakers are continuously snapshotted for upcoming private drops from 4 new creators and live protocol revenue pool dividends. Believers eat first.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* FULLSCREEN LIGHTBOX MODAL */}
        <AnimatePresence>
          {fullscreenImage && (
            <div
              className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4"
              onClick={() => setFullscreenImage(null)}
            >
              <button
                onClick={() => setFullscreenImage(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close Fullscreen (Esc)"
              >
                <X className="w-6 h-6" />
              </button>

              <img
                src={fullscreenImage}
                alt="Full resolution view"
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
