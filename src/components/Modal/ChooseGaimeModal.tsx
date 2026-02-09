import { CardModal, Modal } from ".";
import Card from "../Card";
import LogoImg from "@/assets/icon/logo.png";
import { TextField } from "../input";
import { useState } from "react";
import { Underline } from "../Underline";
import { EM } from "../EM";
import GlowButton from "../GlowButton";
import { Button } from "../Button";
import { useGameEntry } from "@/contract/useGameEntry";
import { useGaimeToken } from "@/contract/useGaimeToken";
import { formatEther, parseEther } from "viem";
import { formatNumber } from "@/utils/formatNumber";
import { toast } from "../Toast";
import { useReadContract } from "wagmi";
import { useLaunchFee, useReceiveAmount } from "@/contract/useRouter";

// const useAgentCreationFee = ()=>{
//   const {data:decimals} = useReadContract({
//     address:GAME_TOKEN_ADDRESS,
//     abi:ERC20_ABI,
//     functionName:'decimals'
//   })
// }

const Coast = ({ amount = 0 }) => {
  // const { data: agentFee = 0 } = usePrepareLaunch(amount * 0.99) as any;
  const { launchFee = 0 }: any = useLaunchFee();
  const total = Number(formatEther(launchFee)) + Number(amount);
  return (
    <div className=" text-[12px]">
      <div className=" flex justify-between items-center text-[#fff]">
        <div className="opacity-[0.6]">Game Creation Fee</div>
        <div className=" font-bold ">{formatEther(launchFee)}</div>
      </div>
      <div className=" flex justify-between items-center text-[#fff] mt-[8px]">
        <div className="opacity-[0.6]">Your Initial Buy</div>
        <div className=" font-bold ">{amount}</div>
      </div>
      <div className=" flex justify-between items-center text-[#fff] text-[18px] mt-[8px]">
        <div className="opacity-[0.6]">Total</div>
        <div className=" font-bold text-[#09FFF0]">{total}</div>
      </div>
    </div>
  );
};

export const ChooseGameModal = ({ open, onClose, values, onSubmit }) => {
  const [amount, setAmount] = useState<any>();
  const { balance } = useGaimeToken();
  const { handleLaunch } = useGameEntry();
  const { data: receiveAmount, percent } = useReceiveAmount(amount);
  const { launchFee = 0 }: any = useLaunchFee();
  const onClick = async () => {
    let _amount = amount ?? 0;
    if (Number(percent) > 80) {
      toast.error("The percentage of gAIme you want to spend is too high");
      return;
    }
    if (
      parseEther(String(Number(_amount) + Number(formatEther(launchFee)))) >
      balance
    ) {
      toast.error("You do not have enough GAIME to spend");
      return;
    }
    const gameId = await onSubmit();
    if (!gameId) {
      return;
    }
    handleLaunch({ ...values, gameId, amount: String(_amount) });
  };
  return (
    // <BasicModal></BasicModal>
    <div>
      <CardModal
        title={"Choose the amount of GAIME you want to spend"}
        open={open}
        onClose={onClose}
        cardClassName={"w-[640px] h-[565px]"}
      >
        <Card className="text-[#FFFFFFCC] text-[14px]">
          <div className="mb-[24px]">
            It's optional, but spending some GAlME can help protect your game
            token from snipers.
          </div>
          <div className="mb-[24px]">
            <div className=" text-end mb-[8px]">
              Balance: {formatNumber(formatEther(balance))} GAIME
            </div>
            <TextField
              placeholder="0"
              type="number"
              value={amount}
              max={392000}
              onChange={(e) => setAmount(e.target.value)}
              startAdornment={
                <div className="mr-[8px]">
                  <img
                    src={LogoImg}
                    alt="logo"
                    className="w-[16px] h-[16px]"
                  ></img>
                </div>
              }
              endAdornment={<div className="text-[#fff]">GAIME</div>}
            ></TextField>
          </div>
          <div className="text-[#fff] ">
            Your will receive{" "}
            <EM className="text-[#09FFF0]">
              {formatNumber(Number(formatEther(receiveAmount)).toFixed(2))}{" "}
              {values.ticker} ({percent}%)
            </EM>
          </div>
          <Underline className="my-[24px]"></Underline>
          <Coast amount={amount}></Coast>
        </Card>
        <div className="flex  justify-between mt-[24px]">
          <Button
            onClick={onClose}
            variant="outlined"
            className="h-[56px] w-[176px] !text-[#fff] !text-[18px] !border-[#FFFFFF33]"
            color="#FFFFFF33"
          >
            Back
          </Button>
          <GlowButton className="w-[400px] h-[56px]" onClick={onClick}>
            Creat Game & Launch Token
          </GlowButton>
        </div>
      </CardModal>
    </div>
  );
};
