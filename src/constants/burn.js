// Protocol Burn Data - Centralized source of truth
// Verified onchain via Robinhood Chain RPC (Initial 1,000,000,000 supply - 983,554,429 remaining)

export const BURN_DATA = {
  // Primary Summary Metrics (Exact onchain)
  totalBurned: "16.4M",
  totalBurnedExact: "16,445,571",
  percentSupply: "1.64%",
  totalSupplyRemaining: "983,554,429",
  ethSpentTotal: "0.10 ETH",
  statusNote: "50% of all platform & launch profits buy back & burn $MIKA",

  // Aliases for backwards compatibility
  burnedAmount: "16.4M",
  burnTxUrl: "https://robinhoodchain.blockscout.com/tx/0xab3eb67e00845e60210540d21b9d52eb43f057a86a129bd9ffc8a62d725fa9a1",

  // Verified Onchain Burn Ledger
  burns: [
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
