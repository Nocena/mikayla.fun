import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

export const MIKA_TOKEN_ADDRESS = "0x123372D9de53D5bEC2988DD2386c7d3666A372a8";

export const ROBINHOOD_CHAIN = {
  chainIdHex: "0x1237",
  chainIdDec: 4663,
  chainName: "Robinhood Chain L2",
  rpcUrl: "https://rpc.mainnet.chain.robinhood.com",
  blockExplorer: "https://robinhoodchain.blockscout.com",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
};

const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function burn(uint256 amount) external",
  "function transfer(address recipient, uint256 amount) external returns (bool)",
];

export function useWeb3Wallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState("0");
  const [rawBalance, setRawBalance] = useState(0n);
  const [isConnecting, setIsConnecting] = useState(false);
  const [txState, setTxState] = useState({
    status: "idle", // "idle" | "signing" | "confirming" | "success" | "error"
    txHash: null,
    error: null,
  });

  const hasProvider = typeof window !== "undefined" && Boolean(window.ethereum);
  const isCorrectNetwork =
    chainId === ROBINHOOD_CHAIN.chainIdDec ||
    chainId === ROBINHOOD_CHAIN.chainIdHex ||
    String(chainId) === "4663";

  // Refresh token balance for an address
  const fetchBalance = useCallback(async (targetAccount) => {
    const acc = targetAccount || account;
    if (!acc) return;

    try {
      const readProvider = new ethers.JsonRpcProvider(ROBINHOOD_CHAIN.rpcUrl);
      const contract = new ethers.Contract(MIKA_TOKEN_ADDRESS, TOKEN_ABI, readProvider);
      const bal = await contract.balanceOf(acc);
      setRawBalance(bal);
      const formatted = ethers.formatUnits(bal, 18);
      const num = parseFloat(formatted);
      setBalance(num.toLocaleString(undefined, { maximumFractionDigits: 2 }));
    } catch (err) {
      console.warn("Could not fetch $MIKA balance:", err);
    }
  }, [account]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!hasProvider) {
      alert("No Web3 wallet detected. Please install MetaMask, Rabby, or Coinbase Wallet.");
      return null;
    }

    setIsConnecting(true);
    setTxState({ status: "idle", txHash: null, error: null });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts && accounts.length > 0) {
        const activeAcc = accounts[0];
        setAccount(activeAcc);

        const network = await provider.getNetwork();
        const currentChainId = Number(network.chainId);
        setChainId(currentChainId);

        await fetchBalance(activeAcc);

        if (currentChainId !== ROBINHOOD_CHAIN.chainIdDec) {
          await switchToRobinhood();
        }

        setIsConnecting(false);
        return activeAcc;
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
      setIsConnecting(false);
      setTxState({
        status: "error",
        txHash: null,
        error: err?.message || "Failed to connect wallet",
      });
      return null;
    }

    setIsConnecting(false);
    return null;
  }, [hasProvider, fetchBalance]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setBalance("0");
    setRawBalance(0n);
    setTxState({ status: "idle", txHash: null, error: null });
  }, []);

  // Switch network to Robinhood Chain L2
  const switchToRobinhood = useCallback(async () => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ROBINHOOD_CHAIN.chainIdHex }],
      });
      setChainId(ROBINHOOD_CHAIN.chainIdDec);
      return true;
    } catch (switchError) {
      if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: ROBINHOOD_CHAIN.chainIdHex,
                chainName: ROBINHOOD_CHAIN.chainName,
                rpcUrls: [ROBINHOOD_CHAIN.rpcUrl],
                blockExplorerUrls: [ROBINHOOD_CHAIN.blockExplorer],
                nativeCurrency: ROBINHOOD_CHAIN.nativeCurrency,
              },
            ],
          });
          setChainId(ROBINHOOD_CHAIN.chainIdDec);
          return true;
        } catch (addError) {
          console.error("Error adding Robinhood Chain L2:", addError);
          setTxState({
            status: "error",
            txHash: null,
            error: "Failed to add Robinhood Chain L2 to wallet.",
          });
          return false;
        }
      } else {
        console.error("Error switching to Robinhood Chain L2:", switchError);
        setTxState({
          status: "error",
          txHash: null,
          error: "Failed to switch to Robinhood Chain L2 in wallet.",
        });
        return false;
      }
    }
  }, []);

  // Burn tokens on-chain with wallet signature
  const burnTokens = useCallback(
    async (tokenAmount) => {
      if (!hasProvider) {
        throw new Error("No Web3 wallet detected. Please connect MetaMask or Rabby.");
      }

      let activeAccount = account;
      if (!activeAccount) {
        activeAccount = await connectWallet();
        if (!activeAccount) throw new Error("Wallet connection required to burn tokens.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== ROBINHOOD_CHAIN.chainIdDec) {
        const switched = await switchToRobinhood();
        if (!switched) {
          throw new Error("Please switch your wallet to Robinhood Chain L2 (Chain ID 4663).");
        }
      }

      const parsedAmount = ethers.parseUnits(String(tokenAmount), 18);

      const readProvider = new ethers.JsonRpcProvider(ROBINHOOD_CHAIN.rpcUrl);
      const readContract = new ethers.Contract(MIKA_TOKEN_ADDRESS, TOKEN_ABI, readProvider);
      const currentBal = await readContract.balanceOf(activeAccount);
      if (currentBal < parsedAmount) {
        const holding = ethers.formatUnits(currentBal, 18);
        throw new Error(
          "Insufficient $MIKA balance! You have " +
            parseFloat(holding).toLocaleString() +
            " $MIKA, but tried to burn " +
            Number(tokenAmount).toLocaleString() +
            " $MIKA."
        );
      }

      setTxState({
        status: "signing",
        txHash: null,
        error: null,
      });

      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(MIKA_TOKEN_ADDRESS, TOKEN_ABI, signer);

      try {
        const tx = await tokenContract.burn(parsedAmount);

        setTxState({
          status: "confirming",
          txHash: tx.hash,
          error: null,
        });

        const receipt = await tx.wait(1);

        setTxState({
          status: "success",
          txHash: tx.hash,
          error: null,
        });

        await fetchBalance(activeAccount);

        return {
          success: true,
          txHash: tx.hash,
          blockNumber: receipt?.blockNumber,
          explorerUrl: ROBINHOOD_CHAIN.blockExplorer + "/tx/" + tx.hash,
        };
      } catch (err) {
        console.error("Burn transaction failed:", err);
        let msg = err?.message || "Transaction failed";
        if (err?.code === 4001 || err?.code === "ACTION_REJECTED") {
          msg = "Transaction cancelled by user in wallet.";
        } else if (err?.info?.error?.message) {
          msg = err.info.error.message;
        }

        setTxState({
          status: "error",
          txHash: null,
          error: msg,
        });
        throw new Error(msg);
      }
    },
    [account, hasProvider, connectWallet, switchToRobinhood, fetchBalance]
  );

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      } else {
        setAccount(null);
        setBalance("0");
        setRawBalance(0n);
      }
    };

    const handleChainChanged = (hexChainId) => {
      setChainId(parseInt(hexChainId, 16));
      if (account) fetchBalance(account);
    };

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum.on?.("chainChanged", handleChainChanged);

    window.ethereum
      .request?.({ method: "eth_accounts" })
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          fetchBalance(accounts[0]);
        }
      })
      .catch(() => {});

    window.ethereum
      .request?.({ method: "eth_chainId" })
      .then((hexChainId) => {
        if (hexChainId) setChainId(parseInt(hexChainId, 16));
      })
      .catch(() => {});

    return () => {
      window.ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [account, fetchBalance]);

  return {
    account,
    chainId,
    balance,
    rawBalance,
    hasProvider,
    isConnecting,
    isConnected: Boolean(account),
    isCorrectNetwork,
    txState,
    connectWallet,
    disconnectWallet,
    switchToRobinhood,
    burnTokens,
    fetchBalance,
  };
}
