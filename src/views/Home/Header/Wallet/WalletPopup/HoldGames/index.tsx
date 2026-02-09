import { getMyGameHold } from "@/services/gameService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Copy } from "lucide-react";
import NoData from "@/components/NoData";
import { Pagination } from "@/components/Pagination";
import { Loading } from "@/components/Loading";

import { readContract } from "@wagmi/core";
import { getBalance } from "viem/actions";
import { wagmiConfig } from "@/config/wagmiConfig";
import { ROUTER_ABI as v2RouterAbi } from "@/contract/abi/v2-abi";
import { GAME_TOKEN_ADDRESS, SWAP_ROUTER_ADDRESS } from "@/contract/address";
import { formatEther, parseEther } from "ethers";
import { formatNumber } from "@/utils/formatNumber";

interface ITokenItem {
  item: any;
  index: number;
  goToTokenTradeView: (address: string) => void;
}


const HoldGames = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<any>({
    page: 1,
    pageSize: 6,
  });
  const [total, setTotal] = useState<number>(0);
  const [holdGamesList, setHoldGamesList] = useState<any[]>([]);
  const getGameHold = async () => {
    setLoading(true);
    const res = await getMyGameHold(params);
    setHoldGamesList(res?.data);
    setTotal(res?.extra?.count);
    setLoading(false);
  };

  useEffect(() => {
    getGameHold();
  }, [params]);

  const goToTokenTradeView = (address: string) => {
    navigate(`/coin/${address}`);
  };
  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-[287px]">
          <Loading></Loading>
        </div>
      )}
      {!loading &&
        (holdGamesList?.length > 0 ? (
          <div className="h-[287px]">
            <div className="h-[215px] w-[368px] flex flex-col items-center overflow-y-auto hide-scrollbar">
              {holdGamesList?.map((game, index) => (
                <TokenItem
                  key={index}
                  item={game}
                  index={index}
                  goToTokenTradeView={goToTokenTradeView}
                />
              ))}
            </div>
          </div>
        ) : (
          <NoData className="!h-[287px]" />
        ))}
      {holdGamesList?.length > 0 && (
        <div className="flex justify-center items-center mt-[24px]">
          <Pagination
            count={Math.ceil(total / 6)}
            siblingCount={0}
            // count={10}
            onChange={(page) => setParams({ ...params, page })}
            // showText
          ></Pagination>
        </div>
      )}
    </>
  );
};

export const TokenItem = ({ item, index, goToTokenTradeView }: ITokenItem) => {
  const [gameValue, setGameValue] = useState<any>(0);

  const getGameValue = async () => {
    if (item.stage === "outside") {
      //  return item?.gaimeValue
      try {
        const res = (await readContract(wagmiConfig, {
          address: SWAP_ROUTER_ADDRESS,
          abi: v2RouterAbi,
        functionName: "getAmountsOut",
        args: [
          parseEther(String(item?.balance)),
          [item.address, GAME_TOKEN_ADDRESS],
        ],
        })) as any;
        setGameValue(Number(formatEther(res[1])).toFixed(3));
      } catch (error) {
        // console.log(error);
        setGameValue(0);
      }
    } else {
      setGameValue(item?.gaimeValue);
    }
  };

  useEffect(() => {
    getGameValue();
  }, []);
  
  return (
    <div
      key={index}
      className="flex items-center justify-between h-[43px] text-[12px] w-full"
      onClick={() => {
        goToTokenTradeView(item?.address);
      }}
    >
      <div className="flex items-center">
        <div className="w-[28px] h-[28px] rounded-full mr-[8px] ">
          <img src={item?.coverImageUrl} className="w-full h-full" alt="" />
        </div>
        <div className="w-[215px]">
          <div className="">
            {formatNumber(item?.balance)} ${item?.ticker}
          </div>
          <div className=" text-[#fff] opacity-[0.6] w-[full] truncate">
            {formatNumber(gameValue)} GAIME
          </div>
        </div>
      </div>
      <button className="text-[#00ffcc] hover:text-[#00ffcc]/80 flex items-center gap-1 ">
        <div className="flex items-center w-[90px] justify-between">
          <span>View</span> <span>${item?.ticker}</span>
        </div>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default HoldGames;
