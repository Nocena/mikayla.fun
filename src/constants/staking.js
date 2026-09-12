// Onchain Staking Configuration for Robinhood Chain L2
// Deployed contract: 0x54F35DE15Fdd410417f4591afEe36a6Bad2F5cfa
import MikaStakingVaultArtifact from "./MikaStakingVault.json";

export const STAKING_CONFIG = {
  contractAddress: "0x54F35DE15Fdd410417f4591afEe36a6Bad2F5cfa",
  tokenAddress: "0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4",
  tokenSymbol: "$MIKA",
  chainName: "Robinhood Chain L2",
  chainIdDec: 4663,
  chainIdHex: "0x1237",
  rpcUrl: "https://rpc.mainnet.chain.robinhood.com",
  blockExplorer: "https://robinhoodchain.blockscout.com",
  cooldownPeriodDays: 3,
  cooldownPeriodSeconds: 259200, // 3 days in seconds

  // Tier Thresholds (Estimated based on live $MIKA pricing: ~18M MIKA / $1,000 USD)
  tiers: {
    bronze: {
      name: "Bronze Vault Pass",
      usdValue: 50,
      tokenAmount: 900000,
      tokenAmountFormatted: "900,000 $MIKA",
      tokenAmountRaw: "900000000000000000000000",
      folderCount: 4,
      tag: "STARTER ACCESS (4 FOLDERS)",
      color: "from-amber-700/30 to-amber-900/10 border-amber-600/40 text-amber-400",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    },
    silver: {
      name: "Silver Vault Pass",
      usdValue: 100,
      tokenAmount: 1800000,
      tokenAmountFormatted: "1,800,000 $MIKA",
      tokenAmountRaw: "1800000000000000000000000",
      folderCount: 8,
      tag: "EXPANDED ACCESS (HALF VAULT - 8 FOLDERS)",
      color: "from-slate-400/20 to-slate-600/10 border-slate-400/40 text-slate-200",
      badgeColor: "bg-slate-300/10 text-slate-200 border-slate-300/30",
    },
    gold: {
      name: "Gold All-Access Pass",
      usdValue: 200,
      tokenAmount: 3600000,
      tokenAmountFormatted: "3,600,000 $MIKA",
      tokenAmountRaw: "3600000000000000000000000",
      folderCount: 16,
      tag: "FULL ALL-ACCESS PASS (ALL 16 FOLDERS)",
      color: "from-[#d4fc50]/20 to-emerald-950/30 border-[#d4fc50]/50 text-[#d4fc50]",
      badgeColor: "bg-[#d4fc50]/15 text-[#d4fc50] border-[#d4fc50]/40",
    },
  },

  minVipStake: 900000,
  minVipStakeFormatted: "900,000 $MIKA ($50)",
  minVipStakeRaw: "900000000000000000000000",
};

export const STAKING_ABI = MikaStakingVaultArtifact.abi;

export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address recipient, uint256 amount) external returns (bool)",
  "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
];

// Complete 16 Partner Creator Folders Catalog (Mapped directly to Drive archive)
import { CREATOR_FOLDERS_CATALOG as FULL_CATALOG } from "./creatorVaultCatalog.js";
export const CREATOR_FOLDERS_CATALOG = FULL_CATALOG;

// Helper to determine active tier from staked balance
export function getUserTier(stakedAmountWei) {
  if (!stakedAmountWei || stakedAmountWei === 0n) return null;
  const goldReq = BigInt(STAKING_CONFIG.tiers.gold.tokenAmountRaw);
  const silverReq = BigInt(STAKING_CONFIG.tiers.silver.tokenAmountRaw);
  const bronzeReq = BigInt(STAKING_CONFIG.tiers.bronze.tokenAmountRaw);

  if (stakedAmountWei >= goldReq) return "gold";
  if (stakedAmountWei >= silverReq) return "silver";
  if (stakedAmountWei >= bronzeReq) return "bronze";
  return null;
}

// Backward-compatibility alias
export const VAULT_EXCLUSIVE_CONTENT = CREATOR_FOLDERS_CATALOG;
