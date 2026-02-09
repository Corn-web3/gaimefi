// USDC address on Base chain
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// Base Uniswap V3 Router address
export const ROUTER_ADDRESS = "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24";

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
import { ROUTER_ABI } from "./v2-abi";

export function useSwapEthForUsdc() {
  const [amount, setAmount] = useState("");
  const { address, isConnected, chainId, chain } = useAccount();
  const { connect } = useConnect();

  // Swap transaction
  const { writeContract: swap, data: swapData } = useWriteContract();

  // Transaction status monitoring
  // Transaction status monitoring
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: swapData,
  });

  // Handle ETH to USDC swap
  // Handle ETH to USDC swap
  const handleSwap = async () => {
    try {
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes expiration20 minutes expiration
      await swap({
        // chainId:base.id,
        address: ROUTER_ADDRESS,
        abi: ROUTER_ABI,
        functionName: "swapExactETHForTokens",
        // args: [{
        //   tokenIn: '0x4200000000000000000000000000000000000006', // WETH on Base
        //   tokenOut: USDC_ADDRESS,
        //   fee: 500, // 0.05% fee tier
        //   recipient: address as any,
        //   deadline,
        //   amountIn: parseEther(amount),
        //   amountOutMinimum: BigInt(0),
        //   sqrtPriceLimitX96: BigInt(0)
        // }],
        args: [
          BigInt(0),
          [
            `0x4200000000000000000000000000000000000006`,
            `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`,
          ],
          address as any,
          deadline,
        ],
        value: parseEther(amount), // Send ETH
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
        disabled={isLoading || !amount || Number(amount) <= 0}
      >
        {isLoading ? "Transaction in progress..." : "ETH Swap USDC"}
      </button>

      {isSuccess && (
        <div style={{ color: "green" }}>Transaction Successful!</div>
      )}
    </div>
  );
}

export default SwapEthForUsdc;
