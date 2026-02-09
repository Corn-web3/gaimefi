import ExpandableText from "@/components/ExpandableText";
import BaseTokenChart from "./TradeChart";
import twitter from "@/assets/fun/twitter.png";
import discord from "@/assets/fun/discord.png";
import telegram from "@/assets/fun/telegram.png";
import { Copy } from "lucide-react";
import { Laptop } from "lucide-react";
import { readContract } from "@wagmi/core";
import { ROUTER_ABI as v2RouterAbi } from "@/contract/abi/v2-abi";
import { transferBigNumber } from "@/utils/transferBigNumber";
import { toast } from "@/components/Toast";
import { useParams } from "react-router-dom";
import NoData from "@/components/NoData";
import { Loading } from "@/components/Loading";
import { useEffect, useMemo, useState } from "react";
import { getTokenPrice } from "@/services/gameService";
import { GAME_TOKEN_ADDRESS, SWAP_ROUTER_ADDRESS } from "@/contract/address";
import { wagmiConfig } from "@/config/wagmiConfig";
import { formatEther, parseEther } from "ethers";
interface TokenTradeViewProps {
  gameDetail: any;
}
const TokenTradeView = ({ gameDetail }: TokenTradeViewProps) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(gameDetail?.address);
    toast.success("Copied to clipboard");
  };

  const { id } = useParams();
  const [marketCap, setMarketCap] = useState<any>("0");

  const getMarketCap = async () => {
    try {
      const res = await getTokenPrice(GAME_TOKEN_ADDRESS);
      const prices = (await readContract(wagmiConfig, {
        address: SWAP_ROUTER_ADDRESS,
        abi: v2RouterAbi,
        functionName: "getAmountsOut",
        args: [parseEther(String(1)), [gameDetail.address, GAME_TOKEN_ADDRESS]],
      })) as any;
      const usdPrice = Number(res?.usdPrice);
      const price = Number(formatEther(prices[1]));
      const _marketCap = usdPrice * price * 1000000000;
      setMarketCap(transferBigNumber(_marketCap));
    } catch {}
  };
  useEffect(() => {
    if (!gameDetail?.stage) {
      return;
    }
    if (gameDetail?.stage == "inner") {
      setMarketCap(transferBigNumber(gameDetail?.marketCap) || 0);
    } else {
      getMarketCap();
    }
  }, [gameDetail]);

  const iframeUrl = useMemo(() => {
    if (id) {
      return `https://www.geckoterminal.com/base/pools/${id}?embed=1&info=0&swaps=0&grayscale=1`;
    }
    return "";
  }, [id]);
  return (
    <div className="w-full  bg-[#111616] rounded-[16px] flex items-center flex-col p-[24px]">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={gameDetail?.coverImageUrl}
            className="w-[96px] h-[96px] rounded-[4px]"
            alt=""
          />
          <div className="ml-[24px]">
            <div className="flex items-center">
              <div className="text-[#09FFF0]">{gameDetail?.name}</div>
              <div className="text-[#09FFF0] ml-[8px] ">
                (${gameDetail?.ticker})
              </div>
              <Copy
                className="w-[16px] h-[16px] ml-[8px] cursor-pointer text-[#0ba198] hover:text-[#09FFF0]"
                onClick={copyAddress}
              />
            </div>
            <div className="flex items-center">
              <div className="text-[#838585] flex items-center">
                Created By{" "}
                <span className="text-[#fff] ml-[8px]">
                  {gameDetail?.user?.address?.slice(0, 4)}...
                  {gameDetail?.user?.address?.slice(-4)}
                </span>{" "}
                <span className="inline-block w-[3px] h-[3px] bg-[#09FFF0] rounded-full mx-[8px]"></span>
                <span className="text-[#fff]">
                  {calculateCreateTime2(gameDetail?.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-[#838585]">
                Market Cap:{" "}
                <span className="text-[#09FFF0] ml-[8px]">${marketCap}</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-[#838585]">
                Total Plays:{" "}
                <span className="text-[#fff] ml-[8px]">
                  {gameDetail?.plays}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[93px] flex">
          {gameDetail?.socialLinks?.twitterLink && (
            <div
              className="w-[28px] h-[28px] bg-[#1b2121] rounded-[50%] flex items-center justify-center cursor-pointer"
              onClick={() => {
                window.open(gameDetail?.socialLinks?.twitterLink, "_blank");
              }}
            >
              <img src={twitter} className="w-[16px] h-[16px]" alt="" />
            </div>
          )}

          {gameDetail?.socialLinks?.discordLink && (
            <div
              className="w-[28px] h-[28px] bg-[#1b2121] rounded-[50%] flex items-center justify-center mx-[12px] cursor-pointer"
              onClick={() => {
                window.open(gameDetail?.socialLinks?.discordLink, "_blank");
              }}
            >
              <img src={discord} className="w-[16px] h-[16px]" alt="" />
            </div>
          )}

          {gameDetail?.socialLinks?.telegramLink && (
            <div
              className="w-[28px] h-[28px] bg-[#1b2121] rounded-[50%] flex items-center justify-center cursor-pointer "
              onClick={() => {
                window.open(gameDetail?.socialLinks?.telegramLink, "_blank");
              }}
            >
              <img src={telegram} className="w-[16px] h-[16px]" alt="" />
            </div>
          )}
          {gameDetail?.socialLinks?.websiteLink && (
            <div
              className="w-[28px] h-[28px] bg-[#1b2121] rounded-[50%] flex items-center justify-center cursor-pointer ml-[12px]"
              onClick={() => {
                window.open(gameDetail?.socialLinks?.websiteLink, "_blank");
              }}
            >
              <Laptop className="w-[16px] h-[16px] text-[#fff]" />
            </div>
          )}
        </div>
      </div>

      <ExpandableText text={gameDetail?.description} />

      <div className="w-full  text-[#707373] mt-[24px]">
        {gameDetail?.id ? (
          <>
            {gameDetail?.stage == "inner" ? (
              <BaseTokenChart
                alchemyApiKey="8gYq6L9rOiommECA08gq2b8Wu5bapBY8"
                tokenAddress="0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
                tokenSymbol="DEGEN/WETH"
                height="600px"
                gameDetail={gameDetail}
              />
            ) : (
              <>
                {iframeUrl && id && (
                  <iframe
                    height="600px"
                    width="100%"
                    id="geckoterminal-embed"
                    title="GeckoTerminal Embed"
                    src={`https://www.geckoterminal.com/base/pools/${id}?embed=1&info=0&swaps=0&grayscale=1`}
                    // src={`https://www.geckoterminal.com/base/pools/0x03de3ab2f687e69fef56dc6c274be25387d93967?embed=1&info=0&swaps=0&grayscale=1`}
                    // src={
                    //   "https://www.geckoterminal.com/solana/pools/4AZRPNEfCJ7iw28rJu5aUyeQhYcvdcNm8cswyL51AY9i?embed=1&info=0&swaps=0&grayscale=1"
                    // }
                    allow="clipboard-write"
                    allowFullScreen
                  ></iframe>
                )}
              </>
            )}
          </>
        ) : (
          <div className="w-full h-[600px] flex items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};
export default TokenTradeView;

// Calculate how long ago from now
export function calculateCreateTime(time: number) {
  const now = new Date();
  const diffTime = now.getTime() - time;
  // Ensure time difference is non-negative
  if (diffTime < 0) return "1s ago";
  // Minimal unit, return seconds if less than 1 minute
  // Return minutes if less than 1 hour
  // Return hours if less than 1 day
  // Return days if less than 1 month
  // Return months if less than 1 year
  // Return years if greater than 1 year
  if (diffTime < 60 * 1000) {
    return `${Math.floor(diffTime / 1000)}s ago`;
  }

  if (diffTime < 60 * 60 * 1000) {
    return `${Math.floor(diffTime / (60 * 1000))}m ago`;
  }

  if (diffTime < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diffTime / (60 * 60 * 1000))}h ago`;
  }

  if (diffTime < 30 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diffTime / (24 * 60 * 60 * 1000))}d ago`;
  }

  if (diffTime < 12 * 30 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diffTime / (30 * 24 * 60 * 60 * 1000))}m ago`;
  }

  return `${Math.floor(diffTime / (12 * 30 * 24 * 60 * 60 * 1000))}y ago`;
}

// Calculate how long ago from now
export function calculateCreateTime2(time: number) {
  const now = new Date();
  const diffTime = now.getTime() - time;
  // Ensure time difference is non-negative
  if (diffTime < 0) return "1 second ago";
  // Minimal unit, return seconds if less than 1 minute
  // Return minutes if less than 1 hour
  // Return hours if less than 1 day
  // Return days if less than 1 month
  // Return months if less than 1 year
  // Return years if greater than 1 year
  if (diffTime < 60 * 1000) {
    const num = Math.floor(diffTime / 1000);
    return `${num} second${num > 1 ? "s" : ""} ago`;
  }

  if (diffTime < 60 * 60 * 1000) {
    const num = Math.floor(diffTime / (60 * 1000));
    return `${num} minute${num > 1 ? "s" : ""} ago`;
  }

  if (diffTime < 24 * 60 * 60 * 1000) {
    const num = Math.floor(diffTime / (60 * 60 * 1000));
    return `${num} hour${num > 1 ? "s" : ""} ago`;
  }

  if (diffTime < 30 * 24 * 60 * 60 * 1000) {
    const num = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    return `${num} day${num > 1 ? "s" : ""} ago`;
  }

  if (diffTime < 12 * 30 * 24 * 60 * 60 * 1000) {
    const num = Math.floor(diffTime / (30 * 24 * 60 * 60 * 1000));
    return `${num} month${num > 1 ? "s" : ""} ago`;
  }

  const num = Math.floor(diffTime / (12 * 30 * 24 * 60 * 60 * 1000));
  return `${num} year${num > 1 ? "s" : ""} ago`;
}
