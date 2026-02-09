import {
  Commitment,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

export const getBalance = async () => {
  const commitment: Commitment = "processed";

  const connection = new Connection("https://api.testnet.v1.sonic.game", {
    commitment,
    wsEndpoint: "wss://api.testnet.v1.sonic.game",
  });

  const balance = await connection.getBalance(
    new PublicKey("DxMxNMQhqnAdVNsSLC6uqcuTc53aPufmmK9x2jMyMGvm")
  );

  console.log("balance: ", balance / LAMPORTS_PER_SOL);
};
