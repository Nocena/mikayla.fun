import { ethers } from "ethers";
import readline from "readline";

const RPC_URL = "https://rpc.mainnet.chain.robinhood.com";
const CURVE_ADDRESS = "0x551317514d823bda9bd2eb20d2ed331afaae45ed";
const TOKEN_ADDRESS = "0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4";
const EXPECTED_DEPLOYER = "0xb8a7a3b3422d9d551c0d7e54e24e260e4a087ecb".toLowerCase();

const CURVE_ABI = [
  "function buy(uint256 quoteAmount, uint256 minTokensOut, address recipient) external payable returns (uint256)",
  "function realQuoteReserve() external view returns (uint256)",
  "function quoteReserve() external view returns (uint256)",
  "function tokenReserve() external view returns (uint256)",
  "function graduationThreshold() external view returns (uint256)"
];

const TOKEN_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function burn(uint256 amount) external",
  "function totalSupply() external view returns (uint256)"
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

async function main() {
  console.log("====================================================");
  console.log("  $MIKA Protocol Buyback & Burn Tool (Robinhood L2) ");
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

  if (ethBal === 0n) {
    console.error("❌ Wallet has 0 ETH. Aborting.");
    process.exit(1);
  }

  const amountStr = await askQuestion("Amount of ETH to buy & burn [default: 0.1]: ");
  const ethToSpend = amountStr ? amountStr : "0.1";
  const buyAmountWei = ethers.parseEther(ethToSpend);

  if (buyAmountWei > ethBal) {
    console.error(`❌ Insufficient ETH. You have ${ethers.formatEther(ethBal)} ETH but tried to spend ${ethToSpend} ETH.`);
    process.exit(1);
  }

  const curve = new ethers.Contract(CURVE_ADDRESS, CURVE_ABI, wallet);
  const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, wallet);

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

  const realQuote = await curve.realQuoteReserve();
  const gradThresh = await curve.graduationThreshold();
  const currentGradPct = (Number(realQuote) / Number(gradThresh) * 100).toFixed(2);
  const newGradPct = ((Number(realQuote) + Number(buyAmountWei)) / Number(gradThresh) * 100).toFixed(2);

  console.log(`\n--- Transaction Preview ---`);
  console.log(`• ETH to spend:        ${ethToSpend} ETH`);
  console.log(`• Estimated $MIKA:     ~${ethers.formatUnits(estimatedTokens, 18)} MIKA`);
  console.log(`• Graduation Progress: ${currentGradPct}% -> ${newGradPct}%`);
  console.log(`• Token Action:        Buy on Curve -> Burn to 0x0`);
  console.log(`---------------------------\n`);

  const confirm = await askQuestion(`Type 'burn' to execute on Robinhood Chain: `);
  if (confirm.toLowerCase() !== "burn") {
    console.log("Execution cancelled.");
    process.exit(0);
  }

  // 1. Buy on Curve
  console.log(`\n🚀 [1/2] Sending Buy Transaction for ${ethToSpend} ETH...`);
  const buyTx = await curve.buy(buyAmountWei, 0n, wallet.address, {
    value: buyAmountWei,
  });
  console.log(`➡️ Buy Tx Hash: ${buyTx.hash}`);
  console.log("Waiting for confirmation...");
  const buyReceipt = await buyTx.wait();
  console.log(`✅ Buy confirmed in block ${buyReceipt.blockNumber}!`);

  // 2. Check tokens received
  const tokenBal = await token.balanceOf(wallet.address);
  console.log(`\n🔍 Current wallet $MIKA balance: ${ethers.formatUnits(tokenBal, 18)} MIKA`);

  // 3. Burn tokens
  const tokensToBurn = estimatedTokens <= tokenBal ? estimatedTokens : tokenBal;
  console.log(`🔥 [2/2] Burning ${ethers.formatUnits(tokensToBurn, 18)} $MIKA...`);
  const burnTx = await token.burn(tokensToBurn);
  console.log(`➡️ Burn Tx Hash: ${burnTx.hash}`);
  console.log("Waiting for burn confirmation...");
  const burnReceipt = await burnTx.wait();
  console.log(`✅ Burn confirmed in block ${burnReceipt.blockNumber}!`);

  const newTotalSupply = await token.totalSupply();
  console.log(`\n🎉 SUCCESS! Buyback & Burn complete.`);
  console.log(`📉 New Total Supply: ${ethers.formatUnits(newTotalSupply, 18)} MIKA`);
  console.log(`\n🔗 Onchain Explorer Links:`);
  console.log(`• Buy Tx:  https://robinhoodchain.blockscout.com/tx/${buyTx.hash}`);
  console.log(`• Burn Tx: https://robinhoodchain.blockscout.com/tx/${burnTx.hash}`);
  console.log(`• DexScreener: https://dexscreener.com/search?q=${TOKEN_ADDRESS}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
