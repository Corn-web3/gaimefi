import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ERC20_ABI } from "./abi/erc20-abi";
import { ROUTER_ADDRESS } from "./address";
import { waitForTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "@/config/wagmiConfig";
import { walletToast } from "@/components/Toast/WalletToast";
import { WALLET_TOAST_TEXT } from "@/components/Toast/text";
import { useEvent } from "@/utils/ImEvent";

export const useCustomToken = ({
  tokenAddress,
  routerAddress = ROUTER_ADDRESS,
}: any) => {
  const { address } = useAccount();
  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "symbol",
    query: {
      enabled: !!tokenAddress,
    },
    scopeKey: tokenAddress,
  });

  const { data: balance, refetch: refetchBalance }: any = useReadContract({
    address: tokenAddress, // GameToken contract address
    abi: ERC20_ABI, // GameToken contract ABI
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!tokenAddress,
    },
    scopeKey: tokenAddress,
  });

  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address, routerAddress],
    query: {
      enabled: !!tokenAddress,
    },
    scopeKey: tokenAddress,
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
  const handleApprove = async () => {
    try {
      const approveTx = await approve({
        // chainId:base.id,
        address: tokenAddress as any,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [
          routerAddress,
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
      // await waitForTransactionReceipt({ hash: approveTx });
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

  useEvent("buy-success", refetchBalance);
  useEvent("sell-success", refetchBalance);
  return {
    symbol: symbol ?? "",
    balance: balance ?? 0,
    allowance: allowance ?? 0,
    handleApprove,
    refetch,
    refetchBalance,
  } as any;
};
