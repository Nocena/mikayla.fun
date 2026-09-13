import { useState, useEffect } from "react";

export const MIKA_CA = "0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4";
export const ROBINHOOD_RPC_URL = "https://rpc.mainnet.chain.robinhood.com";
export const DEX_PAIR_URL = "https://dexscreener.com/robinhood/0xc05decb01594ce17cb0cfc46dff62f79092971cb601eb7d8a68699d20b82a7bb";
export const FOMO_URL = `https://fomo.family/token/${MIKA_CA}`;
export const DEX_SEARCH_URL = "https://dexscreener.com/robinhood/0xc05decb01594ce17cb0cfc46dff62f79092971cb601eb7d8a68699d20b82a7bb";

// Verified live market values from Uniswap V4 Pool & Robinhood Chain RPC
export const ONCHAIN_DEFAULTS = {
  isGraduated: true,
  priceUsd: 0.0000538,
  priceUsdFormatted: "$0.000054",
  marketCap: 52400,
  marketCapFormatted: "$52.4K",
  priceChange24h: -36.0,
  volume24h: 57700,
  volume24hFormatted: "$57.7K",
  liquidityUsd: 21500,
  liquidityFormatted: "$21.5K",
  holders: 415,
  totalSupplyRemaining: 975228142,
  totalSupplyFormatted: "975.2M",
  totalBurned: 24771858,
  totalBurnedFormatted: "24.8M",
  burnedFormatted: "24.8M",
  percentBurned: "2.48%",
  burnedPct: "2.48",
  initialMaxSupply: 1000000000,
  graduationThresholdEth: 4.2,
  realQuoteReserveEth: 4.2,
  graduationProgressPct: 100,
  pairUrl: DEX_PAIR_URL,
  fomoUrl: FOMO_URL,
  tokenAddress: MIKA_CA,
  source: "onchain_uniswap_v4",
};

export function useTokenData() {
  const [data, setData] = useState(ONCHAIN_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveMarketData() {
      try {
        // 1. Fetch live pool directly from DexScreener pair endpoint
        const dexPromise = fetch(
          "https://api.dexscreener.com/latest/dex/pairs/robinhood/0xc05decb01594ce17cb0cfc46dff62f79092971cb601eb7d8a68699d20b82a7bb"
        )
          .then((res) => res.json())
          .catch(() => null);

        // 2. Fetch live total supply from Robinhood Chain RPC (eth_call totalSupply())
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

        // Calculate verified onchain burned supply
        let totalSupply = 975228142;
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

        // Extract primary pair data
        let primaryPair = null;
        if (dexData && Array.isArray(dexData.pairs) && dexData.pairs.length > 0) {
          primaryPair = dexData.pairs[0];
        }

        if (isMounted) {
          setData((prev) => {
            if (primaryPair) {
              const priceUsdNum = parseFloat(primaryPair.priceUsd) || prev.priceUsd;
              const mcNum =
                parseFloat(primaryPair.marketCap) ||
                Math.round(priceUsdNum * totalSupply) ||
                prev.marketCap;
              const formattedMc =
                mcNum >= 1_000_000
                  ? `$${(mcNum / 1_000_000).toFixed(2)}M`
                  : `$${(mcNum / 1000).toFixed(1)}K`;

              const volNum = parseFloat(primaryPair.volume?.h24) || prev.volume24h;
              const formattedVol =
                volNum >= 1_000_000
                  ? `$${(volNum / 1_000_000).toFixed(2)}M`
                  : `$${(volNum / 1000).toFixed(1)}K`;

              const liqNum = parseFloat(primaryPair.liquidity?.usd) || prev.liquidityUsd;
              const formattedLiq = `$${(liqNum / 1000).toFixed(1)}K`;

              const priceChange =
                primaryPair.priceChange?.h24 !== undefined
                  ? parseFloat(primaryPair.priceChange.h24)
                  : prev.priceChange24h;

              return {
                isGraduated: true,
                priceUsd: priceUsdNum,
                priceUsdFormatted: `$${priceUsdNum < 0.01 ? priceUsdNum.toFixed(6) : priceUsdNum.toFixed(4)}`,
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
                source: "onchain_uniswap_v4",
              };
            }

            // If only RPC succeeded
            return {
              ...prev,
              totalSupplyRemaining: Math.round(totalSupply),
              totalSupplyFormatted: `${(totalSupply / 1e6).toFixed(1)}M`,
              totalBurned: Math.round(totalBurned),
              totalBurnedFormatted: burnedFormatted,
              burnedFormatted,
              percentBurned,
              burnedPct,
              tokenAddress: MIKA_CA,
            };
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
