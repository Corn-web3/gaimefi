import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { GAME_TOKEN_ADDRESS, ROUTER_ADDRESS } from "./address";
import { ERC20_ABI } from "./abi/erc20-abi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { imEvent } from "@/utils/ImEvent";
import { wagmiConfig } from "@/config/wagmiConfig";
import { formatEther, parseEther } from "viem";
import { walletToast } from "@/components/Toast/WalletToast";
import { WALLET_TOAST_TEXT } from "@/components/Toast/text";
import { useEffect } from "react";

const USE_MOCK = true; // Enable mock mode

export const useGaimeToken = () => {
  const { address } = useAccount();

  const { data: allowance, refetch } = useReadContract({
    address: GAME_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address, ROUTER_ADDRESS],
    scopeKey: "game-allowance",
  });
  const { data: decimals } = useReadContract({
    address: GAME_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "decimals",
    scopeKey: "game-decimals",
  });

  const { data: balance, refetch: balanceRefetch }: any = useReadContract({
    address: GAME_TOKEN_ADDRESS, // GameToken contract address
    abi: ERC20_ABI, // GameToken contract ABI
    functionName: "balanceOf",
    args: [address],
    scopeKey: "game-balance",
  });

  const {
    writeContractAsync: approve,
    data: approveData,
    isSuccess,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        // refetch();
        imEvent.trigger("gaime-approve-success");
      },
    },
  });

  // useWatchContractEvent({
  //   address: GAME_TOKEN_ADDRESS,
  //   abi: ERC20_ABI,
  //   eventName: 'Transfer',
  //   onLogs() {
  //     refetch()
  //     balanceRefetch()
  //   }
  // })

  imEvent.on("gaime-token-refetch", () => {
    refetch();
    balanceRefetch();
  });

  imEvent.on("address-change", () => {
    refetch();
    balanceRefetch();
  });

  const handleApprove = async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      imEvent.trigger("gaime-approve-success");
      return true;
    }

    try {
      const approveTx = await approve({
        address: GAME_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [
          ROUTER_ADDRESS,
          BigInt(
            "115792089237316195423570985008687907853269984665640564039457584007913129639935"
          ),
        ],
        // value: parseEther('0.0001') // Send ETH
      });
      walletToast.loading({
        title: WALLET_TOAST_TEXT.approvalLoading,
        message: WALLET_TOAST_TEXT.approvalLoadingContent,
        tx: approveTx as any,
        success: {
          title: WALLET_TOAST_TEXT.approvalSuccess,
          message: WALLET_TOAST_TEXT.approvalSuccessContent,
        },
        error: {
          title: WALLET_TOAST_TEXT.approvalFailed,
          message: WALLET_TOAST_TEXT.approvalFailedContent,
        },
      });
      const res = await waitForTransactionReceipt(wagmiConfig, {
        hash: approveTx as any,
      });
      refetch();
    } catch (error) {
      walletToast.error({
        title: WALLET_TOAST_TEXT.approvalFailed,
        message: WALLET_TOAST_TEXT.approvalFailedContent,
        autoHide: true,
      });
      return false;
    }
    return true;
  };

  if (USE_MOCK) {
    return {
      balance: parseEther("1000000"), // Mock balance: 1,000,000 GAIME
      handleApprove,
      allowance: parseEther("1000000000"), // Mock infinite allowance
      refetch: () => {},
      approveSuccess: true,
    };
  }

  return {
    balance: balance ?? 0,
    handleApprove,
    allowance,
    refetch,
    approveSuccess: isSuccess,
  };
};
