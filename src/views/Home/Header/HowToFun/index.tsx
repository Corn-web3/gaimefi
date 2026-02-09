import ModelPopup from "@/components/ModelPopup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HowToFun = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    setShow(false);
    // navigate("/create-token");
  };
  return (
    <>
      <ModelPopup
        open={show}
        onClose={() => setShow(false)}
        title="How to have fun"
        className="!w-[640px] "
        onClickSubmit={handleClick}
        confirmText="Let's Play!"
      >
        <div className="w-full mt-[24px]">
          <div className=" w-[592px] h-[114px] rounded-[16px] bg-[#1e2323] text-[#d2d3d3] text-[14px] p-[24px]">
            gAIme.fun prevents scams by ensuring all created tokens are safe.
            Each game on gAIme.fun has a{" "}
            <span className="text-[#09fff0]">fair-launch</span> with{" "}
            <span className="text-[#09fff0]">no presale</span> and{" "}
            <span className="text-[#09fff0]">no team allocation</span>.
          </div>

          <div className="mt-[24px] flex flex-col leading-[22px]">
            <div className="flex items-start text-[14px] text-[#d2d3d3]">
              <span className="text-[#767979] mr-[20px]">Step1</span>
              <span>pick a game that you like</span>
            </div>
            <div className="flex items-start text-[14px] text-[#d2d3d3] mt-[8px]">
              <span className="text-[#767979] mr-[20px]">Step2</span>
              <span>buy the game coin on the bonding curve</span>
            </div>
            <div className="flex items-start text-[14px] text-[#d2d3d3] mt-[8px]">
              <span className="text-[#767979] mr-[20px]">Step3</span>
              <span>trade anytime to secure your position</span>
            </div>
            <div className="flex items-start text-[14px] text-[#d2d3d3] mt-[8px]">
              <span className="text-[#767979] mr-[20px]">Step4</span>
              <span>
                the game graduates when the market cap reaches about $100K
                through bonding curve purchases
              </span>
            </div>
            <div className="flex items-start text-[14px] text-[#d2d3d3] mt-[8px]">
              <span className="text-[#767979] mr-[20px]">Step5</span>
              <span>
                after graduation, about $20K of liquidity is added to Uniswap
                and locked
              </span>
            </div>
          </div>
        </div>
      </ModelPopup>
    </>
  );
};

export default HowToFun;
