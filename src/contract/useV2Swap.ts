import { parseEther } from "ethers";
import { ROUTER_ABI } from "./abi/v2-abi";
import { ROUTER_ADDRESS, SWAP_ROUTER_ADDRESS } from "./address";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "viem/chains";
import { useState } from "react";
import { useCustomToken } from "./useCustomToken";
import { imEvent } from "@/utils/ImEvent";
import { walletToast } from "@/components/Toast/WalletToast";
import { WALLET_TOAST_TEXT } from "@/components/Toast/text";

export const useV2Swap = ({ tokenAddressA, tokenAddressB }) => {
  const { allowance, handleApprove, refetchBalance, refetch } = useCustomToken({
    tokenAddress: tokenAddressA,
    routerAddress: SWAP_ROUTER_ADDRESS,
  });
  const { address } = useAccount();
  // Swap Transaction
  const { writeContractAsync: swap, data: swapData } = useWriteContract();

  // Transaction Status Monitoring
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: swapData,
  });

  // Handle ETH swap to USDC
  const handleSwap = async (amount: any, isBuy: boolean = true) => {
    const text = {
      loading: isBuy
        ? WALLET_TOAST_TEXT.purchaseLoading
        : WALLET_TOAST_TEXT.saleLoading,
      loadingContent: isBuy
        ? WALLET_TOAST_TEXT.purchaseLoadingContent
        : WALLET_TOAST_TEXT.saleLoadingContent,
      success: isBuy
        ? WALLET_TOAST_TEXT.purchaseSuccess
        : WALLET_TOAST_TEXT.saleSuccess,
      successContent: isBuy
        ? WALLET_TOAST_TEXT.purchaseSuccessContent
        : WALLET_TOAST_TEXT.saleSuccessContent,
      error: isBuy
        ? WALLET_TOAST_TEXT.purchaseFailed
        : WALLET_TOAST_TEXT.saleFailed,
      errorContent: isBuy
        ? WALLET_TOAST_TEXT.purchaseFailedContent
        : WALLET_TOAST_TEXT.saleFailedContent,
    };
    if (allowance < parseEther(String(amount))) {
      const res = await handleApprove();
      if (!res) {
        return;
      }
    }
    try {
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes expiration
      const hash = await swap({
        address: SWAP_ROUTER_ADDRESS,
        abi: ROUTER_ABI,
        functionName: "swapExactTokensForTokens",
        args: [
          parseEther(String(amount)),
          BigInt(0),
          [tokenAddressA, tokenAddressB],
          address as any,
          deadline,
        ],
        // value: parseEther(amount), // Send ETH
      });

      walletToast.loading({
        title: text.loading,
        message: text.loadingContent,
        tx: hash,
        success: {
          title: text.success,
          message: text.successContent,
          callback: () => {
            if (isBuy) {
              imEvent.trigger("buy-success");
            } else {
              imEvent.trigger("sell-success");
            }
            refetchBalance();
            refetch();
            imEvent.trigger("gaime-token-refetch");
          },
        },
        error: {
          title: text.error,
          message: text.errorContent,
        },
      });
    } catch (error) {
      walletToast.error({
        title: text.error,
        message: text.errorContent,
        autoHide: true,
      });
    }
  };
  return {
    handleSwap,
  };
};
