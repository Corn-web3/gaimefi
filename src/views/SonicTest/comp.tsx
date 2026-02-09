import React, { useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  TokenAccountsFilter,
  Commitment,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getBalance } from "./utils1";
import ConnectButton from "@/assets/fun/ConnectButton.png";

import { Buffer } from "buffer";
import { useStore } from "@/stores";
import { useEvent } from "@/utils/ImEvent";
// Ensure Buffer is globally accessible
window.Buffer = window.Buffer || Buffer;
// Import wallet styles
require("@solana/wallet-adapter-react-ui/styles.css");

const commitment: Commitment = "processed";

interface SonicWalletComponentProps {
  children?: React.ReactNode;
}

const sonicUrl =
  process.env.REACT_APP_SONIC_URL || "https://api.mainnet-alpha.sonic.game";
const SonicWalletComponent: React.FC<SonicWalletComponentProps> = ({
  children,
}) => {
  const {
    publicKey,
    connected,
    signTransaction,
    sendTransaction,
    wallet,
    connect,
    select,
    disconnect,
  } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [tokenBalances, setTokenBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [swapAmount, setSwapAmount] = useState<string>("0.1");
  const [swapStatus, setSwapStatus] = useState<string>("");
  const [targetTokenAddress, setTargetTokenAddress] = useState<string>("");
  const { setSonicAddress } = useStore.getState();

  // Connect to Sonic network
  const connection = new Connection(sonicUrl, {
    commitment,
    wsEndpoint: sonicUrl,
  });

  // Token symbol mapping table (expandable as needed)
  const tokenSymbols: Record<string, { symbol: string; decimals: number }> = {
    EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
      symbol: "USDC",
      decimals: 6,
    },
    Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: {
      symbol: "USDT",
      decimals: 6,
    },
    "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E": {
      symbol: "BTC",
      decimals: 6,
    },
    // Add more tokens
  };

  // Get SOL balance
  const getSolBalance = async () => {
    if (!publicKey) return;

    try {
      const balance = await connection.getBalance(
        new PublicKey("DxMxNMQhqnAdVNsSLC6uqcuTc53aPufmmK9x2jMyMGvm")
      );
      setSolBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {}
  };

  // Refresh all balances
  const refreshBalances = async () => {
    setLoading(true);
    await getSolBalance();
    setLoading(false);
  };

  const { currentSelectChainType } = useStore.getState();

  useEffect(() => {
    if (currentSelectChainType === "Base") {
      console.log("disconnect");
      disconnect();
    }
  }, [currentSelectChainType]);

  // Get current wallet address
  const getCurrentWalletAddress = () => {
    if (publicKey && currentSelectChainType === "Sonic") {
      setSonicAddress(publicKey.toString());
      return publicKey.toString();
    }

    return "";
  };

  // Swap SOL for other tokens
  const swapSolForToken = async () => {
    if (!publicKey || !sendTransaction) {
      setSwapStatus("Wallet not connected");
      return;
    }

    if (!targetTokenAddress) {
      setSwapStatus("Please enter target token address");
      return;
    }

    try {
      setSwapStatus("Preparing transaction...");
      setLoading(true);

      // Verify if target token address is valid
      let targetAddress;
      try {
        targetAddress = new PublicKey(targetTokenAddress);
      } catch (error) {
        setSwapStatus("Invalid token address");
        setLoading(false);
        return;
      }

      const lamports = parseFloat(swapAmount) * LAMPORTS_PER_SOL;

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: targetAddress,
          lamports,
        })
      );

      setSwapStatus("Please confirm transaction in wallet...");

      // Use sendTransaction instead of manual serialization
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      setSwapStatus(
        `Transaction sent, waiting for confirmation: ${signature.slice(
          0,
          8
        )}...`
      );

      // Wait for transaction confirmation
      await connection.confirmTransaction(signature, "confirmed");

      const tokenSymbol =
        tokenSymbols[targetAddress]?.symbol || "Unknown Token";
      setSwapStatus(
        `Swapped SOL for ${tokenSymbol} successfully! Signature: ${signature.slice(
          0,
          8
        )}...`
      );

      // Refresh balances
      await refreshBalances();
    } catch (error) {
      setSwapStatus(
        `Transaction failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Update balances when wallet connection status changes
  useEffect(() => {
    if (connected && publicKey) {
      refreshBalances();
      getCurrentWalletAddress();
    } else {
      setSolBalance(null);
      setTokenBalances([]);
    }
  }, [connected]);

  return (
    <div className="max-w-xl mx-auto">
      <div
        className="flex justify-center"
        onClick={async () => {
          await select("OKX Wallet" as any);
          await connect();
        }}
      >
        <img
          className="w-[133px] h-[42px] ml-[24px] cursor-pointer "
          src={ConnectButton}
          alt=""
        />
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && connected && publicKey && (
        <div className="mt-6">
          <p className="text-sm mb-4">
            Wallet Address:{" "}
            <span className="font-mono">
              {publicKey.toString().slice(0, 6)}...
              {publicKey.toString().slice(-4)}
            </span>
          </p>

          <div className="bg-white shadow rounded-lg mb-4 p-4">
            <h2 className="text-lg font-medium">SOL Balance</h2>
            <p className="text-2xl text-blue-600 font-bold">
              {solBalance !== null ? solBalance.toFixed(4) : "Loading..."}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg mb-6 p-4">
            <h2 className="text-lg font-medium mb-3">Swap SOL</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Token Address
              </label>
              <input
                type="text"
                value={targetTokenAddress}
                onChange={(e) => setTargetTokenAddress(e.target.value)}
                placeholder="Enter token address, e.g. EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SOL Amount
              </label>
              <input
                type="number"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="0.01"
              />
            </div>
            <button
              onClick={swapSolForToken}
              disabled={loading}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              {loading
                ? "Processing..."
                : `Swap SOL for ${
                    tokenSymbols[targetTokenAddress]?.symbol || "Token"
                  }`}
            </button>
            {swapStatus && (
              <p className="mt-2 text-sm text-center text-gray-600">
                {swapStatus}
              </p>
            )}
          </div>

          <h2 className="text-lg font-medium mt-8 mb-4">Token Balances</h2>

          {tokenBalances.length > 0 ? (
            tokenBalances.map((token) => (
              <div
                key={token.mint}
                className="bg-white shadow rounded-lg mb-4 p-4"
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">{token.symbol}</h3>
                  <p className="text-lg font-medium">
                    {token.amount.toFixed(
                      token.decimals > 4 ? 4 : token.decimals
                    )}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No tokens found</p>
          )}

          <div className="flex justify-center mt-8">
            <button
              onClick={refreshBalances}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              {loading ? "Refreshing..." : "Refresh Balance"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SonicWalletComponent;
