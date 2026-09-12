import { ethers } from "ethers";
import readline from "readline";

const RPC_URL = "https://rpc.mainnet.chain.robinhood.com";
const EXPECTED_DEPLOYER = "0xb8a7a3b3422d9d551c0d7e54e24e260e4a087ecb".toLowerCase();

const TOKENS = {
  1: {
    key: "MIKA",
    symbol: "MIKA",
    name: "Mikayla Protocol ($MIKA - Graduated to Uniswap V4 Pool)",
    tokenAddress: "0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4",
    curveAddress: "0x551317514d823bda9bd2eb20d2ed331afaae45ed",
    isGraduated: true,
    dexUrl: "https://dexscreener.com/robinhood/0xc05decb01594ce17cb0cfc46dff62f79092971cb601eb7d8a68699d20b82a7bb",
  },
  2: {
    key: "JUICY",
    symbol: "JUICY",
    name: "Ms Juicy P ($JUICY - Active Bonding Curve)",
    tokenAddress: "0x123372D9de53D5bEC2988DD2386c7d3666A372a8",
    curveAddress: "0xecaD48192A6153EE1F5091e9f1F14Ffb4e9C7F7e",
    isGraduated: false,
    dexUrl: "https://dexscreener.com/search?q=0x123372D9de53D5bEC2988DD2386c7d3666A372a8",
  },
};

const CURVE_ABI = [
  "function buy(uint256 quoteAmount, uint256 minTokensOut, address recipient) external payable returns (uint256)",
  "function realQuoteReserve() external view returns (uint256)",
  "function quoteReserve() external view returns (uint256)",
  "function tokenReserve() external view returns (uint256)",
  "function graduationThreshold() external view returns (uint256)",
  "function token() external view returns (address)",
];

const TOKEN_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function burn(uint256 amount) external",
  "function totalSupply() external view returns (uint256)",
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
];

function askQuestion(query, hidden = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    if (hidden) {
      process.stdout.write(query);
      const stdin = process.stdin;
      const oldRaw = stdin.isRaw;
      stdin.setRawMode(true);
      stdin.resume();

      let input = "";
      const onData = (ch) => {
        const char = ch.toString("utf8");
        if (char === "\n" || char === "\r" || char === "\u0004") {
          stdin.setRawMode(oldRaw);
          stdin.removeListener("data", onData);
          process.stdout.write("\n");
          rl.close();
          resolve(input.trim());
        } else if (char === "\u0003") {
          process.exit();
        } else if (char === "\u007f" || char === "\b") {
          if (input.length > 0) {
            input = input.slice(0, -1);
            process.stdout.write("\b \b");
          }
        } else {
          input += char;
          process.stdout.write("*");
        }
      };
      stdin.on("data", onData);
    } else {
      rl.question(query, (ans) => {
        rl.close();
        resolve(ans.trim());
      });
    }
  });
}

async function handleGraduatedTokenBuyback(wallet, tokenConfig, ethBal) {
  const token = new ethers.Contract(tokenConfig.tokenAddress, TOKEN_ABI, wallet);
  let existingBal = await token.balanceOf(wallet.address);

  console.log(`\n--- Target: ${tokenConfig.name} ---`);
  console.log(`• Status: GRADUATED to Uniswap V4 Pool!`);
  console.log(`• Live Dexscreener: ${tokenConfig.dexUrl}`);
  console.log(`• Current Wallet Balance: ${Number(ethers.formatUnits(existingBal, 18)).toLocaleString()} $${tokenConfig.symbol}`);
  console.log(`• Current Wallet ETH:     ${ethers.formatEther(ethBal)} ETH`);

  const amountStr = await askQuestion("\nAmount of ETH to buy & burn [default: 0.10]: ");
  const cleanEthStr = amountStr ? amountStr.replace(/eth/gi, "").replace(/,/g, ".").trim() : "0.10";
  let buyAmountWei;
  try {
    buyAmountWei = ethers.parseEther(cleanEthStr);
  } catch (e) {
    console.error(`❌ Invalid ETH amount: "${amountStr}". Please enter a valid number like 0.10.`);
    process.exit(1);
  }
  const ethToSpend = cleanEthStr;

  if (buyAmountWei > ethBal) {
    console.error(`❌ Insufficient ETH. You have ${ethers.formatEther(ethBal)} ETH but tried to spend ${ethToSpend} ETH.`);
    process.exit(1);
  }

  console.log("\n⏳ Fetching live Uniswap V4 pool route & quote...");
  let quoteData;
  try {
    const quoteBody = {
      user: wallet.address,
      originChainId: 4663,
      destinationChainId: 4663,
      originCurrency: "0x0000000000000000000000000000000000000000",
      destinationCurrency: tokenConfig.tokenAddress,
      amount: buyAmountWei.toString(),
      tradeType: "EXACT_INPUT"
    };

    const quoteRes = await fetch("https://api.relay.link/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quoteBody)
    });

    if (!quoteRes.ok) {
      const errTxt = await quoteRes.text();
      throw new Error(`Quote failed (${quoteRes.status}): ${errTxt}`);
    }

    quoteData = await quoteRes.json();
  } catch (err) {
    console.error("❌ Failed to fetch Uniswap V4 quote:", err.message);
    process.exit(1);
  }

  const txItem = quoteData.steps?.[0]?.items?.[0];
  if (!txItem || !txItem.data) {
    console.error("❌ Invalid route data returned from aggregator.");
    process.exit(1);
  }

  const estimatedTokensStr = quoteData.details?.currencyOut?.amountFormatted || "0";
  const estimatedTokensNum = Number(estimatedTokensStr);

  console.log(`\n================ TRANSACTION PREVIEW ================`);
  console.log(`• Action:              Uniswap V4 Direct Terminal Buy + Burn`);
  console.log(`• ETH to spend:        ${ethToSpend} ETH`);
  console.log(`• Estimated $MIKA:     ~${estimatedTokensNum.toLocaleString(undefined, { maximumFractionDigits: 2 })} $${tokenConfig.symbol}`);
  console.log(`• Destination:         Tokens incinerated via token.burn()`);
  console.log(`=====================================================\n`);

  const confirm = await askQuestion(`Type 'burn' to execute on Robinhood Chain L2: `);
  if (confirm.toLowerCase() !== "burn") {
    console.log("Execution cancelled.");
    process.exit(0);
  }

  // 1. Send Swap Transaction directly from terminal wallet
  console.log(`\n🚀 [1/2] Sending Buy Transaction for ${ethToSpend} ETH on Uniswap V4...`);
  let buyTx;
  try {
    const txPayload = {
      to: txItem.data.to,
      data: txItem.data.data,
      value: BigInt(txItem.data.value),
    };
    if (txItem.data.gas) {
      txPayload.gasLimit = BigInt(Math.floor(Number(txItem.data.gas) * 1.3));
    }

    buyTx = await wallet.sendTransaction(txPayload);
  } catch (err) {
    console.error("❌ Buy transaction failed to broadcast:", err.message);
    process.exit(1);
  }

  console.log(`➡️ Buy Tx Hash: ${buyTx.hash}`);
  console.log("Waiting for confirmation on Robinhood Chain L2...");
  const buyReceipt = await buyTx.wait();
  console.log(`✅ Buy confirmed in block ${buyReceipt.blockNumber}!`);

  // 2. Check tokens received
  const tokenBal = await token.balanceOf(wallet.address);
  console.log(`\n🔍 Current wallet balance: ${Number(ethers.formatUnits(tokenBal, 18)).toLocaleString()} $${tokenConfig.symbol}`);

  const tokensToBurn = tokenBal;
  if (tokensToBurn === 0n) {
    console.error("❌ No tokens found in wallet to burn. Please check the buy transaction.");
    process.exit(1);
  }

  // 3. Burn tokens
  console.log(`🔥 [2/2] Burning ${Number(ethers.formatUnits(tokensToBurn, 18)).toLocaleString()} $${tokenConfig.symbol}...`);
  const burnTx = await token.burn(tokensToBurn);
  console.log(`➡️ Burn Tx Hash: ${burnTx.hash}`);
  console.log("Waiting for burn confirmation on Robinhood Chain L2...");
  const burnReceipt = await burnTx.wait();
  console.log(`✅ Burn confirmed in block ${burnReceipt.blockNumber}!`);

  const newTotalSupply = await token.totalSupply();
  console.log(`\n🎉 SUCCESS! Buyback & Burn complete.`);
  console.log(`📉 New Total Supply: ${Number(ethers.formatUnits(newTotalSupply, 18)).toLocaleString()} $${tokenConfig.symbol}`);
  console.log(`\n🔗 Onchain Explorer Links:`);
  console.log(`• Buy Tx:  https://robinhoodchain.blockscout.com/tx/${buyTx.hash}`);
  console.log(`• Burn Tx: https://robinhoodchain.blockscout.com/tx/${burnTx.hash}`);
  console.log(`• DexScreener: ${tokenConfig.dexUrl}`);
}

async function handleBondingCurveBuyback(wallet, tokenConfig, ethBal) {
  const token = new ethers.Contract(tokenConfig.tokenAddress, TOKEN_ABI, wallet);
  const curve = new ethers.Contract(tokenConfig.curveAddress, CURVE_ABI, wallet);

  console.log(`\n--- Target: ${tokenConfig.name} ---`);
  console.log(`• Token CA: ${tokenConfig.tokenAddress}`);
  console.log(`• Curve CA: ${tokenConfig.curveAddress}`);

  const realQuote = await curve.realQuoteReserve();
  const gradThresh = await curve.graduationThreshold();
  const currentGradPct = ((Number(realQuote) / Number(gradThresh)) * 100).toFixed(2);

  console.log(`• Current Curve Progress: ${ethers.formatEther(realQuote)} / ${ethers.formatEther(gradThresh)} ETH (${currentGradPct}%)`);

  const amountStr = await askQuestion("\nAmount of ETH to buy & burn [default: 0.10]: ");
  const cleanEthStr = amountStr ? amountStr.replace(/eth/gi, "").replace(/,/g, ".").trim() : "0.10";
  let buyAmountWei;
  try {
    buyAmountWei = ethers.parseEther(cleanEthStr);
  } catch (e) {
    console.error(`❌ Invalid ETH amount: "${amountStr}". Please enter a valid number like 0.10.`);
    process.exit(1);
  }
  const ethToSpend = cleanEthStr;

  if (buyAmountWei > ethBal) {
    console.error(`❌ Insufficient ETH. You have ${ethers.formatEther(ethBal)} ETH but tried to spend ${ethToSpend} ETH.`);
    process.exit(1);
  }

  console.log("\n⏳ Simulating buy on bonding curve...");
  let estimatedTokens;
  try {
    estimatedTokens = await curve.buy.staticCall(buyAmountWei, 0n, wallet.address, {
      value: buyAmountWei,
    });
  } catch (err) {
    console.error("❌ Simulation failed:", err.message);
    process.exit(1);
  }

  const newGradPct = (((Number(realQuote) + Number(buyAmountWei)) / Number(gradThresh)) * 100).toFixed(2);

  console.log(`\n================ TRANSACTION PREVIEW ================`);
  console.log(`• Action:              Curve Buy + Immediate Burn`);
  console.log(`• ETH to spend:        ${ethToSpend} ETH`);
  console.log(`• Estimated Tokens:    ~${Number(ethers.formatUnits(estimatedTokens, 18)).toLocaleString()} $${tokenConfig.symbol}`);
  console.log(`• Curve Progress:      ${currentGradPct}% ➔ ${newGradPct}%`);
  console.log(`• Destination:         Tokens incinerated via token.burn()`);
  console.log(`=====================================================\n`);

  const confirm = await askQuestion(`Type 'burn' to execute on Robinhood Chain L2: `);
  if (confirm.toLowerCase() !== "burn") {
    console.log("Execution cancelled.");
    process.exit(0);
  }

  console.log(`\n🚀 [1/2] Sending Buy Transaction for ${ethToSpend} ETH...`);
  const buyTx = await curve.buy(buyAmountWei, 0n, wallet.address, {
    value: buyAmountWei,
  });
  console.log(`➡️ Buy Tx Hash: ${buyTx.hash}`);
  console.log("Waiting for confirmation...");
  const buyReceipt = await buyTx.wait();
  console.log(`✅ Buy confirmed in block ${buyReceipt.blockNumber}!`);

  const tokenBal = await token.balanceOf(wallet.address);
  console.log(`\n🔍 Current wallet balance: ${ethers.formatUnits(tokenBal, 18)} $${tokenConfig.symbol}`);

  const tokensToBurn = estimatedTokens <= tokenBal ? estimatedTokens : tokenBal;
  console.log(`🔥 [2/2] Burning ${Number(ethers.formatUnits(tokensToBurn, 18)).toLocaleString()} $${tokenConfig.symbol}...`);
  const burnTx = await token.burn(tokensToBurn);
  console.log(`➡️ Burn Tx Hash: ${burnTx.hash}`);
  console.log("Waiting for burn confirmation...");
  const burnReceipt = await burnTx.wait();
  console.log(`✅ Burn confirmed in block ${burnReceipt.blockNumber}!`);

  const newTotalSupply = await token.totalSupply();
  console.log(`\n🎉 SUCCESS! Buyback & Burn complete.`);
  console.log(`📉 New Total Supply: ${Number(ethers.formatUnits(newTotalSupply, 18)).toLocaleString()} $${tokenConfig.symbol}`);
  console.log(`\n🔗 Onchain Explorer Links:`);
  console.log(`• Buy Tx:  https://robinhoodchain.blockscout.com/tx/${buyTx.hash}`);
  console.log(`• Burn Tx: https://robinhoodchain.blockscout.com/tx/${burnTx.hash}`);
  console.log(`• DexScreener: ${tokenConfig.dexUrl}`);
}

async function main() {
  console.log("====================================================");
  console.log("   Mikayla Protocol Buyback & Burn CLI (Robinhood L2)");
  console.log("====================================================\n");

  let privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    privateKey = await askQuestion("Enter deployer private key (input hidden): ", true);
  }

  if (!privateKey.startsWith("0x")) {
    privateKey = "0x" + privateKey;
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  let wallet;
  try {
    wallet = new ethers.Wallet(privateKey, provider);
  } catch (err) {
    console.error("❌ Invalid private key:", err.message);
    process.exit(1);
  }

  const walletAddress = wallet.address.toLowerCase();
  console.log(`\n🔑 Wallet loaded: ${wallet.address}`);

  if (walletAddress !== EXPECTED_DEPLOYER) {
    console.warn(`⚠️ Warning: Expected deployer ${EXPECTED_DEPLOYER}, but loaded ${wallet.address}`);
    const proceed = await askQuestion("Do you want to continue with this wallet? (y/N): ");
    if (proceed.toLowerCase() !== "y") {
      console.log("Aborted.");
      process.exit(0);
    }
  }

  const ethBal = await provider.getBalance(wallet.address);
  console.log(`💰 ETH Balance: ${ethers.formatEther(ethBal)} ETH`);

  console.log("\nSelect token to buyback & burn:");
  console.log("  [1] $MIKA  (Genesis Protocol Token - Graduated Uniswap V4 Pool) [DEFAULT]");
  console.log("  [2] $JUICY (Ms Juicy P - Active Bonding Curve at 10.7%)");
  const choice = await askQuestion("Choose token [default: 1 ($MIKA)]: ");
  const cleanChoice = choice.trim().toLowerCase();
  const selectedChoice = (cleanChoice === "2" || cleanChoice.includes("juicy")) ? 2 : 1;
  const tokenConfig = TOKENS[selectedChoice];

  if (!tokenConfig.isGraduated) {
    await handleBondingCurveBuyback(wallet, tokenConfig, ethBal);
  } else {
    await handleGraduatedTokenBuyback(wallet, tokenConfig, ethBal);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
