import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import TokenTradeView from "./TokenTradeView";
import SellOrBuy from "./SellOrBuy";
import BondingCurve from "./BondingCurve";
import GamePlay from "./GamePlay";
import Distribution from "./Distribution";
import { useEffect, useRef, useState } from "react";
import {
  getChatHistoryApi,
  getGameDetailByAddress,
} from "@/services/gameService";
import { useEvent } from "@/utils/ImEvent";

const Coin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gameDetail, setGameDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cacheCode = useRef<any>(null);
  
  const [progressMap, setProgressMap] = useState<any>({});

  const getGameDetail = async () => {
    setIsLoading(true);
    const res = await getGameDetailByAddress(id as string);
    cacheCode.current = res?.code;
    setGameDetail(res);
    setIsLoading(false);
  };

  useEvent("buy-success", () => {
    getGameDetail();
  });

  useEvent("sell-success", () => {
    getGameDetail();
  });
  useEvent("refresh-game-detail", () => {
    getGameDetail();
  });

  useEffect(() => {
    let timer: any = null;
    if (id) {
      setGameDetail(null);
      getGameDetail();

      timer = setInterval(() => {
        if (cacheCode.current) {
          clearInterval(timer);
        } else {
          getChatHistoryApi(id as string).then((res) => {
            if (res?.length > 0) {
              const code = res?.[0]?.code;
              cacheCode.current = code;
              getGameDetail();
            }
          });
        }
      }, 5000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [id]);
  
  return (
    <div className="w-full h-full flex items-center flex-col mb-[20px]">
      <div className="text-[14px] text-[#666a6a] w-full mt-[20px] flex items-center cursor-pointer">
        <ChevronLeft className="w-[16px] h-[18px] mr-[8px]" />
        <div
          onClick={() => {
            navigate("/");
          }}
        >
          Back
        </div>
      </div>

      <div className="w-full flex justify-between mt-[20px]">
        <div className="flex-1 flex-shrink-0">
          <TokenTradeView gameDetail={gameDetail} />
          <GamePlay
            gameDetail={gameDetail}
            isLoading={isLoading}
            onReload={() => {
              getGameDetail();
            }}
          />
        </div>
        <div className="flex flex-col w-[304px] ml-[16px]">
          <SellOrBuy gameDetail={gameDetail} progressMap={progressMap} />
          <BondingCurve
            progressMap={progressMap}
            setProgressMap={setProgressMap}
            gameDetail={gameDetail}
            onReloadGameDetail={() => {
              getGameDetail();
            }}
          />
          <Distribution gameDetail={gameDetail} />
        </div>
      </div>
    </div>
  );
};

export default Coin;
