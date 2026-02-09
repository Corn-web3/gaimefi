import { formatNumber } from "@/utils/formatNumber";
import { CardModal } from "./index";
import ForgeButton from "../GlowButton";
import { Button } from "../Button";
import { createAwakenRecord, getAwakenCost } from "@/services/gameService";
import { useEffect, useState } from "react";
import { CreateElizaForm } from "../Form/CreateElizaForm";
export const gotoBuyToken = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const ElizaModal = ({ open, onClose, gameDetail }) => {
  const [cost, setCost] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const getCost = async () => {
    const response = await getAwakenCost();
    setCost(response);
  };

  useEffect(() => {
    if (open) {
      getCost();
    }
  }, [open]);

  

  useEffect(() => {
    if (!open) {
      setLoading(false);
    }
  }, [open]);
  return (
    <CardModal
      open={open}
      onClose={onClose}
      cardClassName="!max-h-fit"
      title={"Awaken your X-agent"}
      onClickSubmit={() => {
        onClose();
        gotoBuyToken();
      }}
      showCancel={true}
      onCancel={onClose}
      confirmText={<div className="text-[18px] ">Get ${42000000}</div>}
    >
      {showForm ? (
        <>
        <CreateElizaForm cost={cost} gameDetail={gameDetail} onClose={onClose}/>
        </>
      ) : (
        <>
          <div className="text-[14px] text-[#d0d1d1] mt-[14px] w-[432px] h-[235px] bg-[#252a25] rounded-[16px] flex items-center justify-center flex-col">
          <div className="font-thin text-[12px] w-[384px] text-center">
            To summon eliza as your game's social media Agent, you'll need.
          </div>
          <div className="text-[36px] font-medium text-[#09fff0] mt-[4px]">
            {formatNumber(cost)}
            <span className="text-[16px] ml-[4px]">GAIME</span>
          </div>

          <div className="w-[384px] h-[1px] bg-[#3c3f3c] mt-[16px]"></div>

          <div className="flex items-center justify-center mt-[24px] text-center w-[384px]">
            Awakening takes 72 hoursThe Agent will automatically promote your
            game on X Tokens are used as one-time activation fee
          </div>
        </div>
        <div className="w-full flex items-center justify-between  mt-[24px] gap-[16px]">
          <Button
            onClick={onClose}
            //   onClick={() => setShowEliza(true)}
            variant="outlined"
            className="h-[56px] !px-[20px] !py-[12px] !text-[#fff] !text-[14px] font-bold !border-[#FFFFFF33] !rounded-[12px]"
            color="#FFFFFF33"
          >
            Cancel
          </Button>
          <ForgeButton
            className="!flex-1 !h-[56px] rounded-[12px] text-[18px]  bg-[#0f1515] text-[#000] hover:bg-[#fff] hover:text-[#0f1515] border-[1px] border-solid border-[#404444]"
            onClick={() => setShowForm(true)}
          >
            Awaken eliza
          </ForgeButton>
          </div>
        </>
      )}
    </CardModal>
  );
};

