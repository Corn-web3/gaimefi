import { useState } from "react";
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
import { useStore } from "@/stores";
import { imEvent, useEvent } from "./ImEvent";
import { base } from "viem/chains";
import { chain, wagmiConfig } from "@/config/wagmiConfig";
import { toast } from "@/components/Toast";
import { SiweMessage } from "siwe";

const USE_MOCK = true;
const MOCK_ADDRESS = "0x1234567890123456789012345678901234567890";

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
  const { user: privyUser, login, logout: logoutPrivy } = usePrivy();
  const { user: storeUser } = useStore();
  const [mockConnected, setMockConnected] = useState(false);

  // Check localStorage for mock connection persistence or existing store session
  useEffect(() => {
    if (USE_MOCK) {
      if (localStorage.getItem("mock_connected") === "true") {
        setMockConnected(true);
      }
    }
  }, []);

  const isEmailLogin = !!privyUser;

  // const isEmailLogin = false;
  const { address: wagmiAddress, isDisconnected } = useAccount();

  // In Mock mode, prefer store user address, then local mock state, then wagmi
  const address = USE_MOCK
    ? storeUser?.address || (mockConnected ? MOCK_ADDRESS : undefined)
    : wagmiAddress;

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
    if (USE_MOCK) return; // Skip in mock
    const challenge = await getChallenge({ address: _address });
    loginSignMessage(_address);
  };

  const loginOut = async (showToast = true) => {
    if (USE_MOCK) {
      setMockConnected(false);
      localStorage.removeItem("mock_connected");
      useStore.getState().reset(); // Reset global store
      if (showToast) {
        toast.success("Logout success (Mock)");
      }
      return;
    }

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
    if (USE_MOCK) {
      // Mock login process
      console.log("[Mock] Logging in...");

      // Update Global Store
      useStore.getState().setToken("mock-token");
      useStore.getState().setUser({
        address: _address,
        id: "mock-user-id",
        username: "Mock User",
        wallet: { address: _address },
      });

      imEvent.trigger("onSettled");
      return;
    }

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
    if (USE_MOCK) {
      // Simulate connection delay
      setTimeout(() => {
        setMockConnected(true);
        localStorage.setItem("mock_connected", "true");
        imEvent.trigger("onConnect");

        // Trigger getToken logic simulation -> which triggers loginSignMessage
        // In real flow, connect success triggers getToken.
        // Here we simulate the sequence manually.

        // Wait a bit then auto-trigger sign message step or let user click?
        // Real flow: LoginModal shows "Sign message" button after connection.
        // User clicks it -> loginSignMessage() called.
        // So we just need to ensure address is available (mockConnected=true does that)
        // and LoginModal will see address and switch to "sign" view.
      }, 500);
      return;
    }

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
    address: privyUser?.wallet?.address ?? address,
    loginOut,
    isEmailLogin,
    signMessage: _signMessage,
    loginSignMessage,
    sendTransaction: () => {},
    connectWallet,
  };
};
