// USDC address on Base chain
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// Base Uniswap V3 Router address
export const GAME_ENTRY_ADDRESS = "0x4bf9ac713034b3eAa51a30f4F55340D7d8AD5BA9";

// hooks/useSwapEthForUsdc.ts
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useConnect,
} from "wagmi";
import { parseEther } from "viem";
import { base } from "viem/chains";
import { GAME_ENTRY_ABI } from "./game-entry-abi";

export function useSwapEthForUsdc() {
  const [amount, setAmount] = useState("");
  const { address, isConnected, chainId, chain } = useAccount();
  const { connect } = useConnect();

  // Swap transaction
  const { writeContract, data: swapData } = useWriteContract();
  const { writeContract: buy, data: buyData } = useWriteContract();
  const { writeContract: sell, data: sellData } = useWriteContract();

  // Transaction status monitoring
  const { isLoading, isSuccess, data } = useWaitForTransactionReceipt({
    hash: swapData,
  });

  // Handle ETH to USDC swap
  const handleSwap = async () => {
    try {
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes expiration
      const res = await writeContract({
        // chainId:base.id,
        address: GAME_ENTRY_ADDRESS,
        abi: GAME_ENTRY_ABI,
        functionName: "launch",
        args: [`Test1 Token`, `Test2`, ``, ``, ["", "", "", ""], BigInt(0)],
        // value: parseEther('0.0001') // Send ETH
      });
    } catch (error) {
      console.error("Swap failed:", error);
    }
  };

  // Handle ETH to USDC swap
  const handleBuy = async () => {
    try {
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes expiration
      await writeContract({
        // chainId:base.id,
        address: GAME_ENTRY_ADDRESS,
        abi: GAME_ENTRY_ABI,
        functionName: "swapProtocolTokenForToken",
        args: [parseEther("0.1"), USDC_ADDRESS],
        // value: parseEther(amount) // Send ETH
      });
    } catch (error) {
      console.error("Swap failed:", error);
    }
  };

  return {
    amount,
    setAmount,
    handleSwap,
    isLoading,
    isSuccess,
    isConnected,
  };
}

export function SwapEthForUsdc() {
  const { amount, setAmount, handleSwap, isLoading, isSuccess, isConnected } =
    useSwapEthForUsdc();

  return (
    <div className=" bg-[#fff]">
      <div>
        <h2>ETH → USDC Swap</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter ETH amount"
          step="0.01"
        />
      </div>

      <button
        onClick={handleSwap}
        // disabled={isLoading || !amount || Number(amount) <= 0}
      >
        {isLoading ? "Transaction in progress..." : "Luanch"}
      </button>

      {isSuccess && <div style={{ color: "green" }}> Luanch Successful!</div>}
    </div>
  );
}

export default SwapEthForUsdc;
