import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  ShieldCheck,
  Clock,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FolderLock,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { STAKING_CONFIG } from "../constants/staking";

export default function StakingSection() {
  const navigate = useNavigate();
  const tiers = [
    {
      key: "bronze",
      title: "Bronze Pass",
      usd: "$50",
      tokens: "900,000 $MIKA",
      unlockedFolders: "4 Creator Folders",
      summary: "Starter archive access to 4 verified creator folders including 15 full videos.",
      creators: ["Cleo", "ElaChar (15 Vids)", "Melissa", "Tessa"],
      features: [
        "Unlocks 4 Private Folders (1 Video + 3 Photo)",
        "ElaChar Reel (15 Full-Length Videos)",
        "Cleo, Melissa & Tessa Photo Archives",
        "100% Token Custody · 3-Day Unbonding",
      ],
      popular: false,
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      accentBorder: "border-amber-500/20 hover:border-amber-500/40",
      btnBg: "bg-amber-500 hover:bg-amber-400 text-black",
    },
    {
      key: "silver",
      title: "Silver Pass",
      usd: "$100",
      tokens: "1,800,000 $MIKA",
      unlockedFolders: "8 Creator Folders (Half)",
      summary: "Expanded archive covering half of the entire platform vault with 29 videos.",
      creators: ["Cleo", "ElaChar", "Idkblondyna (14 Vids)", "Melissa", "Tessa", "Khalie", "Nevim777", "Zoe"],
      features: [
        "Unlocks 8 Creator Archive Folders",
        "2 Full Video Archives (29 Videos Total)",
        "Extended Photo Sets (Over 100+ Photos)",
        "100% Token Custody · 3-Day Unbonding",
      ],
      popular: true,
      badgeColor: "text-white bg-white/10 border-white/30",
      accentBorder: "border-white/30 hover:border-white/50",
      btnBg: "bg-white hover:bg-neutral-200 text-black",
    },
    {
      key: "gold",
      title: "Gold All-Access",
      usd: "$200",
      tokens: "3,600,000 $MIKA",
      unlockedFolders: "ALL 16 Folders (100%)",
      summary: "Complete unrestricted pass to all 77 full videos, 117 photos, and studio voice notes.",
      creators: ["All 8 Top Creators + 9 Full Video Vaults + Studio Voice Memos"],
      features: [
        "Unlocks All 16 Folders (100% Vault Access)",
        "All 9 Video Archives (77 Full-Length MP4s)",
        "117 High-Res Photos + Studio Voice Notes",
        "Wave 2 Priority Drops Whitelist · 3-Day Cooldown",
      ],
      popular: false,
      badgeColor: "text-[#d4fc50] bg-[#d4fc50]/15 border-[#d4fc50]/40",
      accentBorder: "border-[#d4fc50]/40 hover:border-[#d4fc50]/70",
      btnBg: "bg-[#d4fc50] hover:bg-[#c2ea3f] text-black font-extrabold",
    },
  ];

  return (
    <section id="staking-vault" className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden scroll-mt-24">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-3/4 rounded-full bg-[#d4fc50]/5 blur-[140px]" />

      {/* FOMO Live Staking Ticker */}
      <div className="relative z-10 max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-xl text-xs font-mono text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-bold uppercase tracking-wider text-[11px] sm:text-xs">
              94.2% of Top Holders Staked
            </span>
          </div>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-neutral-300 text-[11px] truncate">
            Unstaked wallets miss protocol dividends & 16 private archives
          </span>
        </div>
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto mb-14">
        {/* Top Badges */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-300 backdrop-blur-md mb-5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#d4fc50]" />
          <span>100% Non-Custodial</span>
          <span className="h-1 w-1 rounded-full bg-neutral-600" />
          <span className="text-[#30d158]">3-Day Swift Cooldown</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-5 font-sans">
          Stake $MIKA. Unlock <span className="text-[#d4fc50]">Creator Vaults</span>.
        </h2>

        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl mx-auto font-sans">
          Direct revenue-sharing creator archives. Stake $MIKA to unlock private photo packages, raw unedited takes, and behind-the-scenes voice notes while retaining 100% custody of your tokens.
        </p>
      </div>

      {/* 3 Tiers Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
        {tiers.map((tier) => (
          <div
            key={tier.key}
            className={`relative flex flex-col justify-between rounded-[28px] border bg-[#0b0c10]/90 p-7 sm:p-8 backdrop-blur-2xl transition-all duration-300 ${tier.accentBorder} ${
              tier.popular
                ? "shadow-[0_0_40px_-10px_rgba(212,252,80,0.18)] ring-1 ring-white/20 scale-[1.01]"
                : "hover:border-white/25"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#d4fc50] px-4 py-1 text-[11px] font-mono font-black uppercase tracking-wider text-black shadow-lg">
                Most Popular Choice
              </div>
            )}

            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider font-mono ${tier.badgeColor}`}>
                  <FolderLock className="h-3 w-3" />
                  {tier.unlockedFolders}
                </span>
                <span className="text-xs font-mono text-neutral-400">{tier.tokens}</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-1 font-sans">{tier.title}</h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black text-white font-mono">{tier.usd}</span>
                <span className="text-xs font-medium text-neutral-400">worth of $MIKA</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-400 mb-5 leading-relaxed">
                {tier.summary}
              </p>

              {/* Creator Badges */}
              <div className="mb-5 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Featured Creators:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tier.creators.map((c, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-xs font-medium text-neutral-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-2.5 mb-7">
                {tier.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#d4fc50]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action CTA */}
            <div className="space-y-2 w-full pt-4 border-t border-white/5">
              <Link
                to="/vault"
                className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg ${tier.btnBg}`}
              >
                <span>Unlock {tier.title}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem("mika_simulated_tier", tier.key);
                    localStorage.setItem("mika_age_verified", "true");
                  } catch {}
                  navigate("/vault");
                }}
                className="w-full py-2 rounded-xl text-[11px] font-mono text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer text-center block"
              >
                ⚡ Test Demo: Simulate {tier.title}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* "More Coming For Believers" Wave 2 Banner */}
      <div className="relative z-10 mb-12 rounded-3xl border border-[#d4fc50]/30 bg-gradient-to-r from-purple-950/20 via-[#d4fc50]/10 to-[#0b0c10]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_30px_rgba(212,252,80,0.08)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4fc50]/15 border border-[#d4fc50]/30 text-[#d4fc50] text-[11px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wave 2 Drops // Believers Eat First</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
              More Content & Protocol Fee Distributions Coming
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              Active stakers are snapshotted weekly for whitelist access to 4 upcoming creator drops and protocol revenue pool distributions. The longer and higher you stake, the larger your share of ecosystem rewards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/vault"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#d4fc50] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,252,80,0.3)] text-center cursor-pointer active:scale-98"
            >
              Get Whitelisted Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Trust & Custody Assurance Grid */}
      <div className="relative z-10 rounded-3xl border border-white/10 bg-[#0d0e12]/80 p-6 sm:p-8 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d4fc50]/30 bg-[#d4fc50]/10 text-[#d4fc50]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1 font-sans">100% Non-Custodial</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                You retain complete ownership of your tokens. Staked funds are held strictly by the immutable onchain vault contract.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1 font-sans">3-Day Swift Cooldown</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Need your tokens back? Initiate unstaking at any moment. Your principal is claimable after a brief 3-day cooldown.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <ExternalLink className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1 font-sans">Robinhood Chain L2 Verified</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Fully transparent smart contract deployed on Robinhood Chain L2:
              </p>
              <a
                href={`${STAKING_CONFIG.blockExplorer}/address/${STAKING_CONFIG.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-mono text-[#d4fc50] hover:underline"
              >
                <span>{STAKING_CONFIG.contractAddress.slice(0, 10)}...{STAKING_CONFIG.contractAddress.slice(-8)}</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
