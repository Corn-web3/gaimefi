import { useReadContract } from "wagmi";
import {
  GAME_TOKEN_ADDRESS,
  ROUTER_ADDRESS,
  SWAP_ROUTER_ADDRESS,
} from "./address";
import { routerAbi } from "./abi/router-abi";
import { ROUTER_ABI as v2RouterAbi } from "./abi/v2-abi";
import { formatEther, parseEther } from "viem";
import { readContract } from "@wagmi/core";
import { wagmiConfig } from "@/config/wagmiConfig";

export const useLaunchFee = () => {
  const { data, status } = useReadContract({
    address: ROUTER_ADDRESS as any,
    abi: routerAbi,
    functionName: "launchFee",
  });
  return {
    launchFee: data ?? 0,
    status,
  };
};

export const useTokenAmountOut = (
  tokenAddress,
  amount: any = 0,
  isOuter: boolean = false
) => {
  const { data, status } = useReadContract({
    address: ROUTER_ADDRESS as any,
    abi: routerAbi,
    functionName: "getAmountsOut",
    args: [
      tokenAddress,
      GAME_TOKEN_ADDRESS,
      parseEther(String(Number(amount) * 0.99)),
    ],
    query: {
      enabled: !!amount && !isOuter,
    },
  });

  const { data: outerData, status: outerStatus } = useReadContract({
    address: SWAP_ROUTER_ADDRESS,
    abi: v2RouterAbi,
    functionName: "getAmountsOut",
    args: [
      parseEther(String(Number(amount) * 0.99)),
      [GAME_TOKEN_ADDRESS, tokenAddress],
    ],
    query: {
      enabled: !!amount && !!isOuter,
    },
  });
  return {
    data: (isOuter ? outerData?.[1] : data) ?? 0,
    status: isOuter ? outerStatus : status,
  } as any;
};

export const getTokenAmountIn = async (amount, tokenAddress) => {
  const result = await readContract(wagmiConfig, {
    abi: routerAbi,
    address: ROUTER_ADDRESS,
    functionName: "getAmountsIn",
    args: [
      tokenAddress,
      GAME_TOKEN_ADDRESS,
      amount,
    ],
  });
  return result;
};

const TOTAL = 1000000000;
export const useReceiveAmount = (amount: any = 0) => {
  const { data = 0, status } = useReadContract({
    address: ROUTER_ADDRESS as any,
    abi: routerAbi,
    functionName: "getAmountsOutForLaunch",
    args: [parseEther(String(Number(amount) * 0.99))],
    query: {
      enabled: !!amount,
    },
  }) as any;
  const percent = data
    ? ((Number(formatEther(data)) * 100) / TOTAL).toFixed(2)
    : 0;
  return {
    data: data ?? 0,
    percent,
    status,
  };
};
