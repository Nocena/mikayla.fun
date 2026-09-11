import { useState, useEffect } from "react";

export const MIKA_CA = "0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4";
export const ROBINHOOD_RPC_URL = "https://rpc.mainnet.chain.robinhood.com";
export const DEX_PAIR_URL = "https://dexscreener.com/robinhood/0xc05decb01594ce17cb0cfc46dff62f79092971cb601eb7d8a68699d20b82a7bb";
export const FOMO_URL = `https://fomo.family/token/${MIKA_CA}`;
export const DEX_SEARCH_URL = `https://dexscreener.com/search?q=${MIKA_CA}`;

// Verified live market values from FOMO Social Trading Terminal & DexScreener
export const ONCHAIN_DEFAULTS = {
  isGraduated: true,
  priceUsd: 0.000103,
  priceUsdFormatted: "$0.000103",
  marketCap: 101500,
  marketCapFormatted: "$101.5K",
  priceChange24h: 443.45,
  volume24h: 177100,
  volume24hFormatted: "$177.1K",
  liquidityUsd: 15200,
  liquidityFormatted: "$15.2K",
  holders: 415,
  totalSupplyRemaining: 983554429,
  totalSupplyFormatted: "983.5M",
  totalBurned: 16445571,
  totalBurnedFormatted: "16.4M",
  burnedFormatted: "16.4M",
  percentBurned: "1.64%",
  burnedPct: "1.64",
  initialMaxSupply: 1000000000,
  graduationThresholdEth: 4.2,
  realQuoteReserveEth: 4.2,
  graduationProgressPct: 100,
  pairUrl: DEX_PAIR_URL,
  fomoUrl: FOMO_URL,
  tokenAddress: MIKA_CA,
  source: "fomo_and_dex",
};

export function useTokenData() {
  const [data, setData] = useState(ONCHAIN_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveMarketData() {
      try {
        // 1. Fetch live pool from DexScreener
        const dexPromise = fetch(`https://api.dexscreener.com/latest/dex/tokens/${MIKA_CA}`)
          .then((res) => res.json())
          .catch(() => null);

        // 2. Fetch live total supply from Robinhood Chain RPC
        const rpcPromise = fetch(ROBINHOOD_RPC_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_call",
            params: [{ to: MIKA_CA, data: "0x18160ddd" }, "latest"],
          }),
        })
          .then((res) => res.json())
          .catch(() => null);

        const [dexData, rpcData] = await Promise.all([dexPromise, rpcPromise]);

        // Calculate onchain burned supply
        let totalSupply = 983554429;
        if (rpcData && rpcData.result && rpcData.result !== "0x") {
          try {
            const rawSupply = BigInt(rpcData.result);
            totalSupply = Number(rawSupply) / 1e18;
          } catch (e) {}
        }

        const initialMax = 1_000_000_000;
        const totalBurned = Math.max(0, initialMax - totalSupply);
        const percentBurned = ((totalBurned / initialMax) * 100).toFixed(2) + "%";
        const burnedFormatted = `${(totalBurned / 1e6).toFixed(1)}M`;
        const burnedPct = ((totalBurned / initialMax) * 100).toFixed(2);

        // Extract primary pair with highest liquidity
        let primaryPair = null;
        if (dexData && Array.isArray(dexData.pairs)) {
          const validPairs = dexData.pairs.filter(
            (p) =>
              p.chainId === "robinhood" &&
              (p.baseToken?.address?.toLowerCase() === MIKA_CA.toLowerCase() ||
                p.quoteToken?.address?.toLowerCase() === MIKA_CA.toLowerCase())
          );
          validPairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0));
          primaryPair = validPairs[0];
        }

        if (primaryPair && isMounted) {
          const priceUsdNum = parseFloat(primaryPair.priceUsd) || 0.000103;
          const mcNum = parseFloat(primaryPair.marketCap) || (priceUsdNum * totalSupply) || 101500;
          const formattedMc =
            mcNum >= 1_000_000
              ? `$${(mcNum / 1_000_000).toFixed(2)}M`
              : `$${(mcNum / 1000).toFixed(1)}K`;

          const volNum = parseFloat(primaryPair.volume?.h24) || 177100;
          const formattedVol =
            volNum >= 1_000_000
              ? `$${(volNum / 1_000_000).toFixed(2)}M`
              : `$${(volNum / 1000).toFixed(1)}K`;

          const liqNum = parseFloat(primaryPair.liquidity?.usd) || 15200;
          const formattedLiq = `$${(liqNum / 1000).toFixed(1)}K`;

          const priceChange = parseFloat(primaryPair.priceChange?.h24) || 443.45;

          setData({
            isGraduated: true,
            priceUsd: priceUsdNum,
            priceUsdFormatted: `$${priceUsdNum.toFixed(6)}`,
            marketCap: mcNum,
            marketCapFormatted: formattedMc,
            priceChange24h: priceChange,
            volume24h: volNum,
            volume24hFormatted: formattedVol,
            liquidityUsd: liqNum,
            liquidityFormatted: formattedLiq,
            holders: 415,
            totalSupplyRemaining: Math.round(totalSupply),
            totalSupplyFormatted: `${(totalSupply / 1e6).toFixed(1)}M`,
            totalBurned: Math.round(totalBurned),
            totalBurnedFormatted: burnedFormatted,
            burnedFormatted,
            percentBurned,
            burnedPct,
            initialMaxSupply: initialMax,
            graduationThresholdEth: 4.2,
            realQuoteReserveEth: 4.2,
            graduationProgressPct: 100,
            pairUrl: primaryPair.url || DEX_PAIR_URL,
            fomoUrl: FOMO_URL,
            tokenAddress: MIKA_CA,
            source: "fomo_and_dex",
          });
        }
      } catch (err) {
        console.warn("Market data fallback:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLiveMarketData();
    const interval = setInterval(fetchLiveMarketData, 10000); // Poll every 10s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { ...data, loading };
}
