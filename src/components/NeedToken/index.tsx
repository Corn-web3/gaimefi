import { formatNumber } from "@/utils/formatNumber";
import ModelPopup from "../ModelPopup";

export const gotoBuyToken = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

export const NeedToken = ({ open, onClose, gameDetail, needCountToken }) => {
  
    return (
      <ModelPopup
        open={open}
        onClose={onClose}
        title={"Join to Play"}
        onClickSubmit={() => {
          onClose()
          gotoBuyToken();
        }}
        showCancel={true}
        onCancel={onClose}
        confirmText={
          <div className="text-[18px] ">Get ${gameDetail?.ticker}</div>
        }
      >
        <div className="text-[14px] text-[#d0d1d1] mt-[14px] w-[432px] h-[205px] bg-[#252a25] rounded-[16px] flex items-center justify-center flex-col">
          <div className="font-thin text-[12px]">
            To play/edit this game, you need to hold at least
          </div>
          <div className="text-[36px] font-medium text-[#09fff0] mt-[4px]">
            {/* <span className="text-[16px] mr-[4px]">$</span> */}
            {formatNumber(needCountToken)}
            <span className="text-[16px] ml-[4px]">{gameDetail?.ticker}</span>
          </div>
  
          <div className="w-[384px] h-[1px] bg-[#3c3f3c] mt-[16px]"></div>
  
          <div className="flex items-center justify-center mt-[24px] text-center w-[384px]">
            These tokens will stay in your wallet and grant you permanent game
            access. By holding tokens, you become part of the game's community.
          </div>
        </div>
      </ModelPopup>
    );
  };