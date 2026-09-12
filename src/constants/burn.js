// Protocol Burn Data - Centralized source of truth
// Verified onchain via Robinhood Chain RPC (Initial 1,000,000,000 supply - 983,554,429 remaining)

export const BURN_DATA = {
  // Primary Summary Metrics (Exact onchain)
  totalBurned: "22.0M",
  totalBurnedExact: "22,008,280",
  percentSupply: "2.20%",
  totalSupplyRemaining: "977,991,719",
  ethSpentTotal: "0.31 ETH+",
  statusNote: "50% of all platform & launch profits buy back & burn $MIKA",

  // Aliases for backwards compatibility
  burnedAmount: "22.0M",
  burnTxUrl: "https://robinhoodchain.blockscout.com/tx/0xd02491f157a37d48491dc820a449233047e723bea89e344fbe1e419933ba5125",

  // Verified Onchain Burn Ledger
  burns: [
    {
      id: 3,
      tranche: "Tranche 03 (Flash Burn 1 of 2)",
      date: "Sep 12, 2026",
      amount: "2,684,115 $MIKA",
      amountShort: "2.68M",
      percent: "0.27%",
      ethSpent: "0.06 ETH",
      mechanism: "Uniswap V4 Direct Buyback & Incineration",
      txHash: "0xd02491f157a37d48491dc820a449233047e723bea89e344fbe1e419933ba5125",
      buyTxHash: "0xe34c8dead5488bcc44cf20bb3a369bf170b12fffb846874660026ac59d4982e4",
      txUrl: "https://robinhoodchain.blockscout.com/tx/0xd02491f157a37d48491dc820a449233047e723bea89e344fbe1e419933ba5125",
    },
    {
      id: 2,
      tranche: "Tranche 02",
      date: "Sep 11, 2026",
      amount: "2,821,170 $MIKA",
      amountShort: "2.82M",
      percent: "0.28%",
      ethSpent: "Syndicate Reserve Burn",
      mechanism: "Deployer Token Incineration",
      txHash: "0x17b999bef817ee169ce2abf49ecd2ff5ce7257ca05ab53c67818e40a049129ea",
      txUrl: "https://robinhoodchain.blockscout.com/tx/0x17b999bef817ee169ce2abf49ecd2ff5ce7257ca05ab53c67818e40a049129ea",
    },
    {
      id: 1,
      tranche: "Tranche 01",
      date: "Sep 10, 2026",
      amount: "16,445,571 $MIKA",
      amountShort: "16.4M",
      percent: "1.64%",
      ethSpent: "0.10 ETH",
      mechanism: "Launch Profit Buyback & Burn",
      txHash: "0xab3eb67e00845e60210540d21b9d52eb43f057a86a129bd9ffc8a62d725fa9a1",
      txUrl: "https://robinhoodchain.blockscout.com/tx/0xab3eb67e00845e60210540d21b9d52eb43f057a86a129bd9ffc8a62d725fa9a1",
    },
  ],

  // Upcoming Scheduled Drops with Profit Burn
  upcomingBurns: [
    {
      drop: "Ms Juicy P",
      schedule: "Friday 5:00 PM UTC",
      note: "50% launch profit burns $MIKA",
    },
    {
      drop: "Classified Drop #02",
      schedule: "This Sunday",
      note: "50% launch profit burns $MIKA",
    },
    {
      drop: "Classified Drop #03",
      schedule: "Next Tuesday",
      note: "50% launch profit burns $MIKA",
    },
  ],
};
