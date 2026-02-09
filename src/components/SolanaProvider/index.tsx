import React from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SkyWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
// import SonicWalletComponent from "./comp";

export const SolanaProvider = ({ children }: { children: React.ReactNode }) => {
  // Can choose 'mainnet-beta', 'testnet', 'devnet' or custom RPC URL
  console.log("SonicWalletComponent", WalletAdapterNetwork);
  // const network = WalletAdapterNetwork.Mainnet;
  // const endpoint = clusterApiUrl(network);
  const endpoint = "https://rpc.ankr.com/sonic_mainnet";
  console.log("SonicWalletComponent", endpoint);
  // Initialize wallet
  const wallets = [
    // new PhantomWalletAdapter(),
    // new SolflareWalletAdapter(),
    // new SkyWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
