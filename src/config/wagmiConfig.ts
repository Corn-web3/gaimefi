import { createConfig } from "wagmi";
import { base, mainnet, sepolia } from "viem/chains";
import { http, injected } from "wagmi";
import { createStorage } from "@wagmi/core";
import { coinbaseWallet, metaMask } from "wagmi/connectors";
import { isTest } from "@/contract/address";

// Create persistent storage configuration
const storage = createStorage({
  storage: window.localStorage,
});

export const chain = isTest ? sepolia : base;

export const wagmiConfig = createConfig({
  chains: [chain], // Pass your required chains as an array
  storage,
  connectors: [
    metaMask(),
    coinbaseWallet(),
    injected({
      target: {
        // Custom OKX wallet detection
        id: "okx",
        name: "OKX Wallet",
        provider: (window as any).okxwallet,
      },
    }),
  ],
  transports: {
    [chain.id]: http(),
  } as any,
}) as any;
