import { wagmiConfig } from "@/config/wagmiConfig";
import { GAME_TOKEN_ADDRESS, SWAP_ROUTER_ADDRESS } from "@/contract/address";
import { transferBigNumber } from "@/utils/transferBigNumber";
import { calculateCreateTime } from "@/views/Coin/TokenTradeView";
import { readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_ABI as v2RouterAbi } from "@/contract/abi/v2-abi";
import { formatEther, parseEther } from "viem";

const GameItem = ({
  game,
  isAlmoseJeet,
  usdPrice,
}: {
  game?: any;
  isAlmoseJeet?: boolean;
  usdPrice?: any;
}) => {
  const navigate = useNavigate();
  const [marketCap, setMarketCap] = useState<any>("0");
  const toGoGame = () => {
    if (game?.address) {
      navigate(`/coin/${game?.address}`);
    }
  };

  const getMarketCap = async () => {
    if (game?.stage === "inner" || !usdPrice) {
      setMarketCap(transferBigNumber(game?.marketCap) || 0);
      return;
    }
    try {
      const prices = (await readContract(wagmiConfig, {
        address: SWAP_ROUTER_ADDRESS,
        abi: v2RouterAbi,
        functionName: "getAmountsOut",
        args: [parseEther(String(1)), [game.address, GAME_TOKEN_ADDRESS]],
      })) as any;
      const price = Number(formatEther(prices[1]));
      const _marketCap = usdPrice * price * 1000000000;
      setMarketCap(transferBigNumber(_marketCap));
    } catch {}
  };

  useEffect(() => {
    getMarketCap();
  }, [usdPrice, game]);

  return (
    <div
      className="relative flex items-center  justify-center  w-[596px] h-[207px] rounded-[16px] p-[2px] overflow-hidden "
      style={{
        background: isAlmoseJeet ? "#052926" : "#101515",
      }}
    >
      {isAlmoseJeet && (
        <div
          className="absolute left-[50%] top-[50%]  rounded-[16px] z-[9] gameItem "
          style={{
            width: "100%",
            height: "30%",
            background: `#05413e`,
          }}
        ></div>
      )}
      <div
        className="w-[592px] h-[203px]  rounded-[16px] flex items-center px-[24px] cursor-pointer relative z-10 bg-[#101515]"
        onClick={toGoGame}
      >
        {game?.coverImageUrl ? (
          <img
            src={game?.coverImageUrl}
            className="w-[152px] h-[152px] rounded-[12px]"
            alt=""
          />
        ) : (
          <div className="w-[152px] h-[152px] rounded-[16px] bg-[#191e1e]"></div>
        )}

        {game?.name ? (
          <div className="ml-[24px]">
            <div className="text-[#09FFF0]">
              {game?.name} (${game?.ticker})
            </div>
            <div className="flex items-center">
              <div className="text-[#838585] flex items-center">
                Created By{" "}
                <span className="text-[#fff] ml-[8px]">
                  {game?.user?.address?.slice(0, 4)}...
                  {game?.user?.address?.slice(-4)}
                </span>{" "}
                <span className="inline-block w-[3px] h-[3px] bg-[#09FFF0] rounded-full mx-[8px]"></span>
                <span className="text-[#fff]">
                  {calculateCreateTime(game?.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-[#838585]">
                Marketcap{" "}
                <span className="text-[#09FFF0] ml-[8px]">${marketCap}</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-[#838585]">
                Total Plays{" "}
                <span className="text-[#fff] ml-[8px]">{game?.plays}</span>
              </div>
            </div>

            <div className="w-[368px] h-[50px] border-t border-[#2d3131] text-[#6f7373] mt-[12px] pt-[12px] truncate">
              {game?.description}
            </div>
          </div>
        ) : (
          <div className="ml-[24px]">
            <div className="w-[116px] h-[24px] bg-[#191e1e] rounded-[16px]"></div>
            <div className="w-[368px] h-[16px] bg-[#191e1e] rounded-[16px] my-[24px]"></div>
            <div className="w-[368px] h-[16px] bg-[#191e1e] rounded-[16px]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameItem;
