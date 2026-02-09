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
import SonicWalletComponent from "./comp";

const SonicTest = () => {
  // Can choose 'mainnet-beta', 'testnet', 'devnet' or custom RPC URL
  // const network = WalletAdapterNetwork.Mainnet;
  // const endpoint = clusterApiUrl(network);
  const endpoint = "https://rpc.ankr.com/sonic_mainnet";
  // Initialize wallet
  const wallets = [
    // new PhantomWalletAdapter(),
    // new SolflareWalletAdapter(),
    // new SkyWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SonicWalletComponent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SonicTest;
