import { useState } from "react";
import { formatEther, parseEther } from "viem";
import {
  useAccount,
  useConnect,
  useReadContract,
  useSimulateContract,
  useWriteContract,
} from "wagmi";
import { GAME_ENTRY_ABI } from "./abi/game-entry-abi";
import {
  GAME_ENTRY_ADDRESS,
  GAME_TOKEN_ADDRESS,
  ROUTER_ADDRESS,
  SWAP_ROUTER_ADDRESS,
} from "./address";
import { ERC20_ABI } from "./abi/erc20-abi";
import { useGaimeToken } from "./useGaimeToken";
import { simulateContract } from "@wagmi/core";
import { wagmiConfig } from "@/config/wagmiConfig";
import { routerAbi } from "./abi/router-abi";
import { useCustomToken } from "./useCustomToken";
import { walletToast } from "@/components/Toast/WalletToast";
import { toast } from "@/components/Toast";
import { imEvent } from "@/utils/ImEvent";
import { useLaunchFee } from "./useRouter";
import { WALLET_TOAST_TEXT } from "@/components/Toast/text";
import { ROUTER_ABI } from "./abi/v2-abi";
import { useNavigate } from "react-router-dom";

export const useGameEntry = ({ sellTokenAddress }: any = {}) => {
  const navigate = useNavigate();
  const { handleApprove, approveSuccess, allowance } = useGaimeToken();
  const { allowance: sellAllowance, handleApprove: handleSellApprove } =
    useCustomToken({
      tokenAddress: sellTokenAddress,
    });
  const { launchFee }: any = useLaunchFee();

  // Swap Transaction
  const {
    writeContractAsync: launch,
    data: swapData,
    isSuccess: launchSuccess,
  } = useWriteContract();
  const { writeContractAsync: buy, data: buyData } = useWriteContract();
  const { writeContractAsync: sell, data: sellData } = useWriteContract();

  const checkAllowance = async (num: any) => {
    if ((num as any) > (allowance as any)) {
      return await handleApprove();
    }
    return true;
  };

  const handleLaunch = async (values: any) => {
    let args = [
      values.name,
      values.ticker,
      values.gameId + "",
      [
        values.twitter ?? "",
        values.telegram ?? "",
        values.discord ?? "",
        values.website ?? "",
        values.gameType + "",
        values.description,
        values.coverImageUrl,
      ],
      // BigInt(values.amount),
      parseEther(values.amount),
    ];

    const res = await checkAllowance(parseEther(values.amount) + launchFee);
    if (!res) {
      return;
    }

    try {
      const hash = await launch({
        // chainId:base.id,
        address: GAME_ENTRY_ADDRESS,
        abi: GAME_ENTRY_ABI,
        functionName: "launch",
        args,
        // value: parseEther('0.0001') // Send ETH
      });
      navigate(`/`);
      walletToast.loading({
        title: WALLET_TOAST_TEXT.launchLoading,
        message: WALLET_TOAST_TEXT.launchLoadingContent,
        tx: hash,
        showTx: false,
        success: {
          title: WALLET_TOAST_TEXT.launchSuccess,
          message: WALLET_TOAST_TEXT.launchSuccessContent,
        },
        error: {
          title: WALLET_TOAST_TEXT.launchFailed,
          message: WALLET_TOAST_TEXT.launchFailedContent,
        },
      });
    } catch (error) {
      // console.error("Swap failed:", error);
      walletToast.error({
        title: WALLET_TOAST_TEXT.launchFailed,
        message: WALLET_TOAST_TEXT.launchFailedContent,
        autoHide: true,
      });
    }
  };

  const handleBuy = async (num: any, address: any) => {
    // const res = await buy()
    const res = await checkAllowance(parseEther(num));
    if (!res) {
      return;
    }

    let args = [parseEther(num), address];

    try {
      const hash = await buy({
        // chainId:base.id,
        address: GAME_ENTRY_ADDRESS,
        abi: GAME_ENTRY_ABI,
        functionName: "swapProtocolTokenForToken",
        args,
      });
      walletToast.loading({
        title: WALLET_TOAST_TEXT.purchaseLoading,
        message: WALLET_TOAST_TEXT.purchaseLoadingContent,
        tx: hash,
        success: {
          title: WALLET_TOAST_TEXT.purchaseSuccess,
          message: WALLET_TOAST_TEXT.purchaseSuccessContent,
          callback: () => {
            imEvent.trigger("buy-success");
            imEvent.trigger("gaime-token-refetch");
          },
        },
        error: {
          title: WALLET_TOAST_TEXT.purchaseFailed,
          message: WALLET_TOAST_TEXT.purchaseFailedContent,
        },
      });
    } catch (error) {
      walletToast.error({
        title: WALLET_TOAST_TEXT.purchaseFailed,
        message: WALLET_TOAST_TEXT.purchaseFailedContent,
        autoHide: true,
      });
    }
  };

  const handleSell = async (num: any, address: any) => {
    let args = [parseEther(num + ""), address];
    if (sellAllowance < parseEther(num + "")) {
      await handleSellApprove(address);
    }
    try {
      const hash = await sell({
        // chainId:base.id,
        address: GAME_ENTRY_ADDRESS,
        abi: GAME_ENTRY_ABI,
        functionName: "swapTokenForProtocolToken",
        args,
        // value: parseEther('0.0001') // Send ETH
      });
      walletToast.loading({
        title: WALLET_TOAST_TEXT.saleLoading,
        message: WALLET_TOAST_TEXT.saleLoadingContent,
        tx: hash,
        success: {
          title: WALLET_TOAST_TEXT.saleSuccess,
          message: WALLET_TOAST_TEXT.saleSuccessContent,
          callback: () => {
            imEvent.trigger("sell-success");
            imEvent.trigger("gaime-token-refetch");
          },
        },
        error: {
          title: WALLET_TOAST_TEXT.saleFailed,
          message: WALLET_TOAST_TEXT.saleFailedContent,
        },
      });
    } catch (error) {
      walletToast.error({
        title: WALLET_TOAST_TEXT.saleFailed,
        message: WALLET_TOAST_TEXT.saleFailedContent,
        autoHide: true,
      });
    }
  };

  return {
    handleLaunch,
    handleBuy,
    handleSell,
    launchSuccess: launchSuccess,
  };
};
