import { CardModal, Modal } from ".";
import Card from "../Card";
import LogoImg from "@/assets/icon/logo.png";
import EmailImg from "@/assets/icon/email.png";
import PrivyImg from "@/assets/icon/privy.png";
import OkxImg from "@/assets/icon/okx.png";
import LoadingImg from "@/assets/icon/loading.png";
import MetamaskImg from "@/assets/icon/metamask.png";
import CoinbaseImg from "@/assets/icon/coinbase.png";
import { TextField } from "../input";
import { useEffect, useState } from "react";
import { Underline, UnderLineText } from "../Underline";
import { EM } from "../EM";
import GlowButton from "../GlowButton";
import { Button } from "../Button";
import RightArrowImg from "@/assets/forgeGame/right-arrow.png";
import { useWallet } from "@/utils/useWallet";
import { useStore } from "@/stores";
import { useLoginStore } from "@/stores/useLogin";
import { useEvent } from "@/utils/ImEvent";

const Loading = () => {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center">
        <img
          style={{ animation: "spin 2s linear infinite" }}
          src={LoadingImg}
          alt="loading"
          className="w-[24px] h-[24px]"
        ></img>
        <div className="mt-[10px] text-[#FFFFFF] leading-[22px]">
          Confirm in your wallet
        </div>
      </div>
    </Card>
  );
};

const SignMessage = ({ loginSignMessage }) => {
  return (
    <Card className="flex items-center justify-center cursor-pointer" onClick={() => loginSignMessage()}>
      <div
        className="flex items-center text-[#09FFF0] text-[14px] leading-[22px]"
        
      >
        <div>Sign message</div>
        <img className="w-[16px] h-[16px]" src={RightArrowImg}></img>
      </div>
    </Card>
  );
};

const Login = ({ connectWallet, login }) => {
  const [email, setEmail] = useState("");
  const onClick = () => {
    login({
      loginMethods: ["email"],
      prefill: {
        value: email,
        type: "email",
      },
    });
  };
  return (
    <>
      <TextField
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        startAdornment={
          <div className="mr-[8px]">
            <img
              src={EmailImg}
              alt="email"
              className="w-[16px] h-[16px] max-w-fit"
            ></img>
          </div>
        }
        endAdornment={
          <GlowButton
            className="!w-[65px] !h-[30px] !text-[12px] text-[#001E1C] !font-medium"
            onClick={onClick}
          >
            Submit
          </GlowButton>
        }
      ></TextField>
      <UnderLineText className="my-[24px]">
        <div className=" flex items-center w-max text-[#FFFFFF]">
          <div className="mr-[10px] leading-[19px]">Protected by</div>
          <img src={PrivyImg} alt="privy" className="w-[50px] max-w-fit"></img>
        </div>
      </UnderLineText>
      <Card className="text-[#FFFFFFCC] text-[14px] flex items-center justify-between">
        <div>OR</div>
        <div className="flex items-center">
          <img
            src={MetamaskImg}
            onClick={() => connectWallet("metamask")}
            className="w-[34px] h-[34px] cursor-pointer"
          ></img>
          <img
            src={CoinbaseImg}
            onClick={() => connectWallet("coinbase")}
            className="w-[36px] h-[36px] ml-[16px] cursor-pointer"
          ></img>
          <img
            src={OkxImg}
            onClick={() => connectWallet("okx")}
            className="w-[36px] h-[36px] ml-[16px] cursor-pointer"
          ></img>
        </div>
      </Card>
    </>
  );
};

export const LoginModal = ({ open, onClose }) => {
  const [type, setType] = useState("login");
  const { connectWallet, login, loginSignMessage, address } = useWallet();
  const { user } = useStore();
  useEffect(() => {
    if (user) {
      onClose();
      setType("login");
    }
  }, [user]);

  useEffect(() => {
    if (!user && address) {
      setType("sign");
      return;
    }
    if (!address) {
      setType("login");
    }
  }, [address]);
  useEvent("onConnect", () => {
    setType("loading");
  });

  useEvent("onSettled", () => {
    setType("sign");
  });
  return (
    <div id="login-modal">
      <CardModal
        container={() => document.getElementById("login-modal")}
        title={"Log in or sign up"}
        open={open}
        showClose={type !== "sign"}
        onClose={onClose}
        cardClassName={"w-[480px]"}
        JSX
        disableEnforceFocus
        disableAutoFocus
        disableRestoreFocus
      >
        {type === "login" && (
          <Login connectWallet={connectWallet} login={login}></Login>
        )}
        {type === "loading" && <Loading></Loading>}
        {type === "sign" && (
          <SignMessage loginSignMessage={loginSignMessage}></SignMessage>
        )}
      </CardModal>
    </div>
  );
};
