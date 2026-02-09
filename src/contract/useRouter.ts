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

const USE_MOCK = true;

export const useLaunchFee = () => {
  const { data, status } = useReadContract({
    address: ROUTER_ADDRESS as any,
    abi: routerAbi,
    functionName: "launchFee",
  });

  if (USE_MOCK) {
    return {
      launchFee: parseEther("1000"), // Mock fee: 1000 GAIME
      status: "success",
    };
  }

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
  // ... (keep existing hook logic, but maybe mock return if needed)
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
  if (USE_MOCK) {
    return parseEther("100"); // Mock
  }
  const result = await readContract(wagmiConfig, {
    abi: routerAbi,
    address: ROUTER_ADDRESS,
    functionName: "getAmountsIn",
    args: [tokenAddress, GAME_TOKEN_ADDRESS, amount],
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

  if (USE_MOCK && amount) {
    // Mock calculation: amount * 1000 for demo
    const mockData = parseEther(String(Number(amount) * 1000));
    const percent = ((Number(formatEther(mockData)) * 100) / TOTAL).toFixed(2);
    return {
      data: mockData,
      percent: percent,
      status: "success",
    };
  }

  const percent = data
    ? ((Number(formatEther(data)) * 100) / TOTAL).toFixed(2)
    : 0;
  return {
    data: data ?? 0,
    percent,
    status,
  };
};
