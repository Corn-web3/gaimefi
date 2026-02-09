// Check wallet login status logic

import { useEffect } from "react";
import { useWallet } from "./useWallet";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useStore } from "@/stores";
import { chain } from "@/config/wagmiConfig";
import { userLogout } from "@/services/userService";
import {
  useLocation,
  useRoutes,
  matchPath,
  useNavigate,
} from "react-router-dom";
import { routes } from "@/configs/routes";
import { imEvent } from "./ImEvent";

const getCurrentRouter = (path: string) => {
  let router = null as any;
  routes.forEach((item) => {
    if (matchPath(item.path, path)) {
      router = item;
    }
  });
  return router;
};

export const useCheckWallet = () => {
  const { user, setUser, setToken } = useStore();
  const { address, loginSignMessage, loginOut } = useWallet();
  const { chainId } = useAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const router = getCurrentRouter(pathname);
  // Detect wallet switch
  useEffect(() => {
    if (!address || !user?.address) {
      return;
    }
    if (address !== user?.address) {
      setUser(null);
      setToken(null);
      if (router.auth) {
        navigate("/");
      }
      loginSignMessage(address).then(() => {
        imEvent.trigger("address-change");
      });
    }
  }, [address, user?.address]);

  // Detect chain switch
  useEffect(() => {
    if (!chainId) {
      return;
    }
    if (chainId !== chain.id) {
      loginOut(false).then(() => {
        if (router.auth) {
          navigate("/");
        }
      });
    }
  }, [chainId]);
};
