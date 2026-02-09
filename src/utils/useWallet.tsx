import {
  usePrivy,
  useSignMessage as usePrivySignMessage,
  // connect
} from "@privy-io/react-auth";
import { coinbaseWallet, injected, metaMask } from "wagmi/connectors";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { disconnect } from "@wagmi/core";
import { getChallenge, userLogin, userLogout } from "@/services/userService";
import { useEffect } from "react";
import CryptoJS from "crypto-js";
import { useLoginStore } from "@/stores/useLogin";
import { imEvent, useEvent } from "./ImEvent";
import { base } from "viem/chains";
import { chain, wagmiConfig } from "@/config/wagmiConfig";
import { toast } from "@/components/Toast";
import { SiweMessage } from "siwe";

// Generate random nonce
const generateNonce = () => {
  return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[x]/g, () => {
    return ((Math.random() * 16) | 0).toString(16);
  });
};

const getSignMessage = (address: any) => {
  if (!address) {
    return "";
  }
  const message = new SiweMessage({
    domain: window.location.host,
    address: address,
    statement: `By signing, you are proving you own this wallet and logging in.
This does not initiate a transaction or cost any fees.`,
    uri: "https://gaime.fun",
    version: "1",
    chainId: chain?.id,
    nonce: generateNonce(), // Generate random nonce
    issuedAt: new Date().toISOString(),
  });
  return message.prepareMessage();
};

export const useWallet = () => {
  const { user, login, logout: logoutPrivy } = usePrivy();

  const isEmailLogin = !!user;

  // const isEmailLogin = false;
  const { address, isDisconnected } = useAccount();
  // const { disconnect, connectors,disconnectAsync } = useDisconnect();
  const { signMessage } = useSignMessage();
  const { signMessage: signMessagePrivy } = usePrivySignMessage({
    onError: () => {
      return false;
    },
  });

  const { connect } = useConnect({
    mutation: {
      onSuccess: (data) => {
        // const { setType } = useLoginStore.getState();
        // setType("loading");
        imEvent.trigger("onConnect");
        getToken(data.accounts[0]);
      },
    },
  });

  const getToken = async (_address: any) => {
    const challenge = await getChallenge({ address: _address });
    loginSignMessage(_address);
  };

  const loginOut = async (showToast = true) => {
    logoutPrivy();
    disconnect(wagmiConfig);
    (window as any)?.ethereum?.disconnect?.();
    (window as any)?.okxwallet?.disconnect?.();
    await userLogout();
    if (showToast) {
      toast.success("Logout success");
    }
  };

  const _signMessage = (msg, onSuccess) => {
    if (isEmailLogin) {
      try {
        signMessagePrivy(msg);
      } catch (e) {
        console.log(e);
      }
    } else {
      signMessage({ message: msg }, { onSuccess });
    }
  };

  const loginSignMessage = async (_address) => {
    const msg = getSignMessage(address);
    const onSuccess = async (signature) => {
      await userLogin({
        signature,
        content: msg,
        address: address ?? _address,
      });
    };
    const onSettled = (e) => {
      if (!e) {
        imEvent.trigger("onSettled");
        loginOut(false);
      }
      // const { setType } = useLoginStore.getState();
      // setType("sign");
    };
    if (isEmailLogin) {
      try {
        const signature = await signMessagePrivy(msg);
        onSuccess(signature);
      } catch (e) {
        loginOut(false);
      }
    } else {
      signMessage({ message: msg }, { onSuccess, onSettled });
    }
  };

  const connectWallet = (type: "metamask" | "coinbase" | "okx") => {
    const IdMap = {
      metamask: metaMask(),
      coinbase: coinbaseWallet(),
      okx: injected({
        target: {
          // Custom OKX wallet detection
          id: "okx",
          name: "OKX Wallet",
          provider: (window as any).okxwallet,
        },
      }),
    };
    // const connector = connectors.find((c:any) => c.id === IdMap[type]);
    const connector = IdMap[type];
    if (!connector) {
      return;
    }
    connect({ connector: connector, chainId: chain.id });
  };

  useEvent("logout", (key) => {
    loginOut(key);
  });

  return {
    login,
    address: user?.wallet?.address ?? address,
    loginOut,
    isEmailLogin,
    signMessage: _signMessage,
    loginSignMessage,
    sendTransaction: () => {},
    connectWallet,
  };
};
