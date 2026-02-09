import ForgeButton from "@/components/GlowButton";
import { getBondingCurve } from "@/services/gameService";
import { formatNumber } from "@/utils/formatNumber";
import { useEvent } from "@/utils/ImEvent";
import { CircleAlert } from "lucide-react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

interface BondingCurveProps {
  gameDetail: any;
  progressMap: any;
  setProgressMap: any;
  onReloadGameDetail: () => void;
}
const BondingCurve = ({
  progressMap,
  setProgressMap,
  gameDetail,
  onReloadGameDetail,
}: BondingCurveProps) => {
  const { id } = useParams();

  const [sendOutIng, setSendOutIng] = useState(false);

  const gameDetailRef = useRef(null);

  // Save latest value
  useEffect(() => {
    gameDetailRef.current = gameDetail;
  }, [gameDetail]);

  const getBondingCurveApprove = (id: string) => {
    const detail: any = gameDetailRef.current;
    getBondingCurve(id).then((res) => {
      if (res?.progress == 100 && detail?.stage == "inner") {
        onReloadGameDetail();
        setSendOutIng(true);
      } else {
        setSendOutIng(false);
      }
      setProgressMap(res);
    });
  };
  useEffect(() => {
    let timer: any;

    if (id) {
      getBondingCurveApprove(id);

      timer = setInterval(() => {
        getBondingCurveApprove(id);
      }, 3000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [id]);

  useEvent("buy-success", () => {
    getBondingCurveApprove(id as string);
  });

  useEvent("sell-success", () => {
    getBondingCurveApprove(id as string);
  });

  return (
    <div className="w-full min-h-[192px] bg-[#0f1515] rounded-[16px] overflow-hidden flex items-center flex-col p-[16px] px-[24px] mt-[16px]">
      <div className="flex items-center font-thin text-[16px] text-[#fff] w-full">
        Bonding Curve Progress
        {/* <CircleAlert className="w-[16px] h-[16px] text-[#575b5b] ml-[8px]" /> */}
      </div>

      <div className="text-[16px] text-[#09FFF0] font-bold mt-[10px] w-full">
        {progressMap?.progress?.toFixed(2)}%
      </div>

      <div className="w-full h-[16px] bg-[#1b2121] mt-[16px] rounded-full">
        <div
          className="h-[16px]  rounded-full"
          style={{
            width: `${progressMap?.progress}%`,
            background:
              "linear-gradient(90deg, rgba(9, 255, 240, 0.4) 0%, #09FFF0 100%)",
          }}
        ></div>
      </div>

      {gameDetail?.stage == "inner" && !sendOutIng && (
        <div className=" mt-[14px] w-full text-[12px] text-[#707373]">
          To graduate this coin to Uniswap, we still need{" "}
          {progressMap?.graduateMarketCap?.toLocaleString()} more GAIME. There
          is {progressMap?.currentGamieCount?.toLocaleString()} GAIME in the
          bonding curve.
        </div>
      )}

      {sendOutIng && (
        <div className=" mt-[14px] w-full text-[12px] text-[#707373]">
          bonding curve complete! migrating... a uniswap pool will be seeded in
          the next 5-20 minutes. the link will be shared here when ready, only
          trust the link posted here.
        </div>
      )}
      {gameDetail?.stage == "outside" && !sendOutIng && (
        <div className=" mt-[14px] w-full text-[12px] text-[#707373]">
          uniswap pool seeded! view on uniswap{" "}
          <span
            className="text-[#09FFF0] cursor-pointer"
            onClick={() => {
              window?.open(
                `https://app.uniswap.org/explore/tokens/base/${gameDetail?.address}`,
                "_blank"
              );
            }}
          >
            here
          </span>
        </div>
      )}
    </div>
  );
};

export default BondingCurve;
