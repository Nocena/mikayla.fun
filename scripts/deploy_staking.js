import fs from "fs";
import path from "path";
import solc from "solc";
import { ethers } from "ethers";
import readline from "readline";

const RPC_URL = "https://rpc.mainnet.chain.robinhood.com";
const MIKA_TOKEN_ADDRESS = "0xa4f9145d8d02B74DD30c44d94e7C479Eb6103Ab4";
const EXPECTED_DEPLOYER = "0xb8a7a3b3422d9d551c0d7e54e24e260e4a087ecb".toLowerCase();

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

export function compileContract() {
  const contractPath = path.resolve("contracts/MikaStakingVault.sol");
  const source = fs.readFileSync(contractPath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "MikaStakingVault.sol": {
        content: source,
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    let hasFatal = false;
    for (const err of output.errors) {
      console.log(err.formattedMessage);
      if (err.severity === "error") hasFatal = true;
    }
    if (hasFatal) throw new Error("Compilation failed with errors.");
  }

  const contract = output.contracts["MikaStakingVault.sol"]["MikaStakingVault"];
  return {
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object,
  };
}

async function main() {
  console.log("====================================================");
  console.log("   MikaStakingVault Deployment Tool (Robinhood L2)  ");
  console.log("====================================================\n");

  console.log("⏳ Compiling contracts/MikaStakingVault.sol...");
  const { abi, bytecode } = compileContract();
  console.log(`✅ Compilation successful! Bytecode length: ${bytecode.length} chars, ABI items: ${abi.length}\n`);

  // Ensure constants directory exists and write compiled artifact
  const artifactPath = path.resolve("src/constants/MikaStakingVault.json");
  fs.writeFileSync(
    artifactPath,
    JSON.stringify({ abi, bytecode, tokenAddress: MIKA_TOKEN_ADDRESS }, null, 2)
  );
  console.log(`📁 Artifact saved to src/constants/MikaStakingVault.json`);

  const args = process.argv.slice(2);
  const isDeploy = args.includes("--deploy");

  if (!isDeploy) {
    console.log("\n💡 To deploy live on Robinhood Chain L2, run:");
    console.log("   node scripts/deploy_staking.js --deploy\n");
    return;
  }

  let privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    privateKey = await askQuestion("Enter deployer private key (input hidden): ", true);
  }

  if (!privateKey.startsWith("0x")) {
    privateKey = "0x" + privateKey;
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`\n🔑 Deployer Wallet: ${wallet.address}`);

  if (wallet.address.toLowerCase() !== EXPECTED_DEPLOYER) {
    console.warn(`⚠️ Warning: Expected deployer ${EXPECTED_DEPLOYER}, but loaded ${wallet.address}`);
    const proceed = await askQuestion("Do you want to continue with this wallet? (y/N): ");
    if (proceed.toLowerCase() !== "y") {
      console.log("Aborted.");
      process.exit(0);
    }
  }

  const ethBal = await provider.getBalance(wallet.address);
  console.log(`💰 ETH Balance: ${ethers.formatEther(ethBal)} ETH`);

  if (ethBal < ethers.parseEther("0.005")) {
    console.error("❌ Insufficient ETH for deployment gas. Need at least 0.005 ETH.");
    process.exit(1);
  }

  console.log(`\n🚀 Deploying MikaStakingVault for token: ${MIKA_TOKEN_ADDRESS}...`);
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy(MIKA_TOKEN_ADDRESS);

  console.log(`➡️ Tx Hash: ${contract.deploymentTransaction().hash}`);
  console.log("Waiting for block confirmation...");
  await contract.waitForDeployment();

  const deployedAddress = await contract.getAddress();
  console.log(`\n🎉 MikaStakingVault DEPLOYED SUCCESSFULLY!`);
  console.log(`📍 Contract Address: ${deployedAddress}`);
  console.log(`🔗 Explorer: https://robinhoodchain.blockscout.com/address/${deployedAddress}\n`);

  // Update src/constants/staking.js contractAddress cleanly without wiping tiers/catalogs
  const stakingJsPath = path.resolve("src/constants/staking.js");
  let stakingJsContent = fs.readFileSync(stakingJsPath, "utf8");
  stakingJsContent = stakingJsContent.replace(
    /contractAddress:\s*"0x[a-fA-F0-9]{40}"/,
    `contractAddress: "${deployedAddress}"`
  );
  stakingJsContent = stakingJsContent.replace(
    /\/\/ Deployed contract:\s*0x[a-fA-F0-9]{40}/,
    `// Deployed contract: ${deployedAddress}`
  );
  fs.writeFileSync(stakingJsPath, stakingJsContent);
  console.log(`📝 Updated contractAddress in src/constants/staking.js to ${deployedAddress}!`);
}

main().catch((err) => {
  console.error("Fatal deployment error:", err);
  process.exit(1);
});
