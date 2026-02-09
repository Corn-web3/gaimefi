import { base, sepolia } from "wagmi/chains";
import { isTest } from "@/contract/address";
export const privyConfig = {
    // Customize Privy's appearance in your app
    defaultChain: isTest ? sepolia : base,
    supportedChains: [isTest ? sepolia : base],
   
    // Create embedded wallets for users who don't have a wallet
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
    },
    onError: (error) => {
      return false
    },
  } as any;
