import { useEffect, useState } from "react";
import logo from "@/assets/fun/logo.png";
import SearchInput from "@/components/input";
import ConnectButton from "@/assets/fun/ConnectButton.png";
import { Search } from "lucide-react";
import HowToFun from "./HowToFun";
import ForgeButton from "../../../components/GlowButton";
import SearchPopup from "./SearchPopup";
import WalletAddress from "./Wallet";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import baseIcon from "@/assets/fun/baseIcon.png";
import {
  useActiveWallet,
  usePrivy,
  useSendTransaction,
} from "@privy-io/react-auth";
import { useWallet } from "@/utils/useWallet";
import { LoginModal } from "@/components/Modal/LoginModal";
import { useStore } from "@/stores";
import { imEvent, useEvent } from "@/utils/ImEvent";
import { useAccount } from "wagmi";
import xIcon from "@/assets/fun/xIcon.png";
import discord from "@/assets/fun/discord.png";
import whitebook from "@/assets/icon/whitebook.png";
import { trackEvent } from "@/utils/trackEvent";
import CustomSelect from "@/components/CustomSelect";
import { getGameType } from "@/services/gameService";
import SonicTest from "@/views/SonicTest";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [showHowToFun, setShowHowToFun] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const navigate = useNavigate();
  const togoHome = () => {
    navigate("/");
  };
  const onConnect = () => {
    setOpen(true);
    trackEvent("connect_wallet");
  };

  const { user } = useStore();
  const { address } = useAccount();
  const userAddress = user?.address;
  const { sonicAddress } = useStore.getState();

  useEvent("login", () => {
    setOpen(true);
  });

  const [showBuyBaseGame, setShowBuyBaseGame] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.includes("game-detail") ||
      location.pathname.includes("coin")
    ) {
      setShowBuyBaseGame(true);
    } else {
      setShowBuyBaseGame(false);
    }
  }, [location.pathname]);

  const toGoBuyBaseGame = () => {
    window?.open(
      "https://app.uniswap.org/explore/tokens/base/0x191364ade309d53af07ea7db6a809d43ba9eceaf",
      "_blank"
    );
  };
  const { setSonicAddress, setCurrentSelectChainType, currentSelectChainType } =
    useStore.getState();
  const options = [
    { value: "Sonic", label: "Sonic" },
    { value: "Base", label: "Base" },
  ];

  const handleSelect = (value: string) => {
    setCurrentSelectChainType(value);
    if (value === "Sonic") {
      imEvent.trigger("chooseSonicThenLogout");
    } else if (value === "Base") {
      setSonicAddress(null);
    }
  };

  return (
    <>
      <div className="w-full h-[88px] flex items-center justify-between px-[120px]">
        <div className="flex items-center text-[18px] text-[#fff] font-bold">
          <img
            src={logo}
            className="w-[36px] h-[36px] cursor-pointer"
            onClick={togoHome}
            alt=""
          />
          <div
            className="ml-[14px] cursor-pointer text-[#09FFF0]"
            onClick={togoHome}
          >
            gAlme.fun
          </div>
          <div
            className="ml-[96px] text-[14px] font-medium cursor-pointer"
            onClick={() => setShowHowToFun(true)}
          >
            How to have fun
          </div>
        </div>

        <div className="flex items-center">
          {showBuyBaseGame ? (
            <ForgeButton
              className="!w-[133px] !h-[42px] !text-[14px] flex items-center justify-center mr-[16px]"
              onClick={toGoBuyBaseGame}
            >
              <img
                src={baseIcon}
                alt=""
                className="w-[16px] h-[16px] mr-[4px]"
              />
              Buy GAIME
            </ForgeButton>
          ) : (
            <div
              className="relative mr-[24px]"
              onClick={() => setShowSearchPopup(true)}
            >
              <SearchInput
                icon={
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666a6a] w-[16px] h-[18px]" />
                }
              />
            </div>
          )}

          <div className="">
            <CustomSelect
              className="!w-[100px] !h-[42px] !rounded-[12px] !text-[14px] !font-medium !border-none !px-[10px]"
              options={options}
              value={currentSelectChainType || "Sonic"}
              onChange={handleSelect}
            ></CustomSelect>
          </div>

          {(userAddress && address) || sonicAddress ? (
            <WalletAddress address={userAddress || sonicAddress} />
          ) : (
            <>
              <div
                className=""
                style={{
                  display:
                    currentSelectChainType === "Sonic" ? "block" : "none",
                }}
              >
                <SonicTest></SonicTest>
              </div>

              <div
                className=""
                style={{
                  display: currentSelectChainType === "Base" ? "block" : "none",
                }}
              >
                <img
                  onClick={onConnect}
                  src={ConnectButton}
                  className="w-[133px] h-[42px] ml-[24px] cursor-pointer "
                  alt=""
                />
              </div>
            </>
          )}
          <img
            src={xIcon}
            className="w-[42px] h-[42px] cursor-pointer ml-[25px]"
            onClick={() => {
              window.open("https://x.com/gAImedotfun", "_blank");
            }}
            alt=""
          />
          <img
            src={discord}
            className="w-[42px] h-[42px] cursor-pointer ml-[8px]"
            onClick={() => {
              window.open("https://discord.gg/GuDxCKGNP9", "_blank");
            }}
            alt=""
          />
          <img
            src={whitebook}
            className="w-[42px] h-[42px] cursor-pointer ml-[8px]"
            onClick={() => {
              window.open(
                "https://gaime-fun.gitbook.io/gaime.fun-whitepaper",
                "_blank"
              );
            }}
            alt=""
          />
        </div>
      </div>

      {/* <div className="flex items-center">
            <ForgeButton
              onClick={() => setIsLogin(true)}
              className="!w-[100px] !h-[42px] !text-[14px]"
            >
              Buy Game
            </ForgeButton>
          </div> */}

      <HowToFun show={showHowToFun} setShow={setShowHowToFun}></HowToFun>

      <SearchPopup show={showSearchPopup} setShow={setShowSearchPopup} />
      <LoginModal open={open} onClose={() => setOpen(false)}></LoginModal>
    </>
  );
};

export default Header;
