import { formatNumber } from "@/utils/formatNumber";
import ModelPopup from "../ModelPopup";
import { gotoBuyToken } from ".";

export const VoteNeedToken = ({
  open,
  onClose,
  gameDetail,
  needCountToken,
}) => {
  return (
    <ModelPopup
      open={open}
      onClose={onClose}
      title={"Submit/Vote Proposal"}
      onClickSubmit={() => {
        onClose();
        setTimeout(() => {
          gotoBuyToken();
        }, 0);
      }}
      showCancel={true}
      onCancel={onClose}
      confirmText={
        <div className="text-[18px] ">Get ${gameDetail?.ticker}</div>
      }
    >
      <div className="text-[14px] text-[#d0d1d1] mt-[14px] w-[432px] h-[205px] bg-[#252a25] rounded-[16px] flex items-center justify-center flex-col">
        <div className="font-thin text-[12px]">
          To submit/vote the proposal, you need to hold at least
        </div>
        <div className="text-[36px] font-medium text-[#09fff0] mt-[4px]">
          {/* <span className="text-[16px] mr-[4px]">$</span> */}
          {formatNumber(needCountToken)}
          <span className="text-[16px] ml-[4px]">{gameDetail?.ticker}</span>
        </div>

        <div className="w-[384px] h-[1px] bg-[#3c3f3c] mt-[16px]"></div>

        <div className="flex items-center justify-center mt-[24px] text-center w-[384px]">
          By holding tokens, you become part of the game's community.
        </div>
      </div>
    </ModelPopup>
  );
};
