import { Button, TextField, Box, Typography } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { TransactionSignature } from "@solana/web3.js";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { Buffer } from "buffer";

export const SendTransaction: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // Add state to store recipient address and amount
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const onClick = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setStatus("Please enter a valid amount");
      return;
    }

    let recipient: PublicKey;
    try {
      recipient = new PublicKey(recipientAddress);
    } catch (error) {
      setStatus("Invalid recipient address");
      return;
    }

    setStatus("Processing...");
    let signature: TransactionSignature | undefined = undefined;

    try {
      if (!publicKey) throw new Error("Wallet not connected!");

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      // Create a transfer transaction
      const transaction = new Transaction({
        feePayer: publicKey,
        recentBlockhash: blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL, // Convert SOL to lamports
        })
      );

      signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });
      setStatus(`Transaction sent: ${signature.slice(0, 8)}...`);

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      setStatus(`Transaction successful: ${signature.slice(0, 8)}...`);
      console.log("Transaction confirmed:", signature);
    } catch (error: any) {
      setStatus(`Transaction failed! ${error?.message}`);
      console.error(`Transaction failed! ${error?.message}`);
    }
  }, [publicKey, connection, sendTransaction, recipientAddress, amount]);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Send SOL
      </Typography>

      <TextField
        fullWidth
        label="Recipient Address"
        margin="normal"
        className="bg-white"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        placeholder="Enter Solana wallet address"
      />

      <TextField
        fullWidth
        label="Amount (SOL)"
        type="number"
        margin="normal"
        className="bg-white"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.1"
        inputProps={{ min: 0, step: 0.001 }}
      />

      {status && (
        <Typography
          color={
            status.includes("successful")
              ? "success"
              : status.includes("failed")
              ? "error"
              : "info"
          }
          sx={{ my: 2 }}
        >
          {status}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        className="bg-white"
        disabled={!publicKey || !recipientAddress || !amount}
        fullWidth
        sx={{ mt: 2 }}
      >
        Send SOL
      </Button>
    </Box>
  );
};
