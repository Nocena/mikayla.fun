// Protocol Burn Data - Centralized source of truth
// To record a new burn, update totalBurned, percentSupply, and append to the burns array.

export const BURN_DATA = {
  // Primary Summary Metrics
  totalBurned: "16.3M",
  totalBurnedExact: "16,339,268",
  percentSupply: "1.64%",
  totalSupplyRemaining: "983,554,429",
  ethSpentTotal: "0.10 ETH",
  statusNote: "More burns coming",

  // Aliases for backwards compatibility
  burnedAmount: "16.3M",
  burnTxUrl: "https://robinhoodchain.blockscout.com/tx/0xab3eb67e00845e60210540d21b9d52eb43f057a86a129bd9ffc8a62d725fa9a1",

  // Verified Onchain Burn Ledger (append future burns here)
  burns: [
    {
      id: 1,
      tranche: "Tranche 01",
      date: "Sep 10, 2026",
      amount: "16,339,268 $MIKA",
      amountShort: "16.3M",
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
      drop: "Ms Juicy P ($JUICY)",
      schedule: "Friday 5:00 PM UTC",
      note: "50% launch profit burns $MIKA",
    },
    {
      drop: "Project KIRA",
      schedule: "This Sunday",
      note: "50% launch profit burns $MIKA",
    },
    {
      drop: "Project LUNA",
      schedule: "Next Tuesday",
      note: "50% launch profit burns $MIKA",
    },
  ],
};
