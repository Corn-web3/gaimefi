import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { TRADE_ABI } from "./abi/trade-abi";
import { GAME_TOKEN_ADDRESS, TRADE_ADDRESS } from "./address";
import { formatEther, parseEther } from "viem";
import { useGaimeToken } from "./useGaimeToken";
import { ERC20_ABI } from "./abi/erc20-abi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { walletToast } from "@/components/Toast/WalletToast";
import { WALLET_TOAST_TEXT } from "@/components/Toast/text";
import { wagmiConfig } from "@/config/wagmiConfig";

export const useTrade = () => {
  const { address } = useAccount();
  const { data: allowance, refetch } = useReadContract({
    address: GAME_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address, TRADE_ADDRESS],
    scopeKey: "trade-game-allowance",
  });

  const {
    writeContractAsync: approve,
    data: approveData,
    isSuccess,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        refetch();
        // imEvent.trigger("gaime-approve-success");
      },
    },
  });
  const { writeContractAsync: tradeAsync, data: tradeData } =
    useWriteContract();
  const trade = async (amount: number) => {
    if (Number(formatEther(allowance as any)) < Number(amount)) {
      try {
        const approveTx = await approve({
          // chainId:base.id,
          address: GAME_TOKEN_ADDRESS as any,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [
            TRADE_ADDRESS,
            // Max approval
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
      } catch (e) {
        return;
      }
    }
    try {
      const tx = await tradeAsync({
        address: TRADE_ADDRESS,
        abi: TRADE_ABI,
        functionName: "deposit",
        args: [parseEther(String(amount))],
      });

      walletToast.loading({
        title: WALLET_TOAST_TEXT.awakenLoading,
        message: WALLET_TOAST_TEXT.awakenLoadingContent,
        tx: tx as any,
        success: {
          title: WALLET_TOAST_TEXT.awakenSuccess,
          message: WALLET_TOAST_TEXT.awakenSuccessContent,
        },
        error: {
          title: WALLET_TOAST_TEXT.awakenFailed,
          message: WALLET_TOAST_TEXT.awakenFailedContent,
        },
      });
      await waitForTransactionReceipt(wagmiConfig, {
        hash: tx as any,
      });
      return tx;
    } catch (e) {
      return;
    }
  };
  return {
    trade,
    tradeData,
  };
};
