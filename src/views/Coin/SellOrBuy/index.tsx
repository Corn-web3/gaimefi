import SearchInput, { TextField } from "@/components/input";
import tokenIcon from "@/assets/fun/tokenIcon.png";
import CircleAlertWhite from "@/assets/fun/CircleAlertWhite.png";
import { useEffect, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import ForgeButton from "@/components/GlowButton";
import FeeNotification from "@/components/FeeNotification";
import { useGameEntry } from "@/contract/useGameEntry";
import { useGaimeToken } from "@/contract/useGaimeToken";
import { formatEther, parseEther } from "viem";
import { formatNumber } from "@/utils/formatNumber";
import { useCustomToken } from "@/contract/useCustomToken";
import { toast } from "@/components/Toast";
import { getTokenAmountIn, useTokenAmountOut } from "@/contract/useRouter";
import { useV2Swap } from "@/contract/useV2Swap";
import { GAME_TOKEN_ADDRESS } from "@/contract/address";
import { getReserve } from "@/services/gameService";
import { fixed } from "@/utils/fixed";
import { imEvent, useEvent } from "@/utils/ImEvent";

const SellOrBuy = ({ gameDetail, progressMap }: any) => {
  const [currentType, setCurrentType] = useState<"buy" | "sell">("buy");
  return (
    <div className="w-[304px] pb-[16px] bg-[#0f1515] rounded-[16px] flex items-center flex-col ">
      <div className="w-full h-[56px] flex items-center relative cursor-pointer">
        <div
          className="w-[50%] h-[56px] flex items-center justify-center font-bold text-[18px] rounded-[16px]"
          onClick={() => setCurrentType("buy")}
          style={{
            backgroundColor: currentType === "buy" ? "#111616" : "#0b1111",
            color: currentType === "buy" ? "#09FFF0" : "#595d5d",
          }}
        >
          Buy
        </div>
        <div
          className="w-[50%] h-[56px] flex items-center justify-center font-bold text-[18px] rounded-[16px]"
          onClick={() => setCurrentType("sell")}
          style={{
            backgroundColor: currentType === "buy" ? "#0b1111" : "#111616",
            color: currentType === "buy" ? "#595d5d" : "#ff227f",
          }}
        >
          Sell
        </div>
        <div
          className="w-[29px] h-[3px]  absolute bottom-[-3px]"
          style={{
            left: currentType === "buy" ? "62px" : "215px",
            backgroundColor: currentType === "buy" ? "#09FFF0" : "#ff227f",
          }}
        ></div>
      </div>
      {currentType === "buy" ? (
        <Buy gameDetail={gameDetail} progressMap={progressMap}></Buy>
      ) : (
        <Sell gameDetail={gameDetail}></Sell>
      )}
    </div>
  );
};

const Buy = ({ gameDetail, progressMap }: any) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<any>();
  const [error, setError] = useState<any>();
  const { handleSwap } = useV2Swap({
    tokenAddressA: GAME_TOKEN_ADDRESS,
    tokenAddressB: gameDetail?.address,
  });
  const [showFee, setShowFee] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [GAIMEList, setGAIMEList] = useState([
    {
      num: "10",
    },
    {
      num: "100",
    },
    {
      num: "1000",
    },
  ]);
  const { balance } = useGaimeToken();
  const { handleBuy } = useGameEntry({ sellTokenAddress: gameDetail?.address });

  const { data: amountOut } = useTokenAmountOut(
    gameDetail?.address,
    value,
    gameDetail?.stage === "outside"
  );

  const onChange = (value: any) => {
    setValue(value);
  };
  const onBuy = () => {
    // if (loading) {
    //   toast.error("Loading...");
    //   return;
    // }
    if (!!error) {
      return;
    }
    if (!value) {
      toast.error("Please enter the number of tokens to buy");
      return;
    }
    if (Number(value) > Number(formatEther(balance))) {
      toast.error("Insufficient balance");
      return;
    }
    if (gameDetail?.stage === "outside") {
      handleSwap(value);
    } else {
      handleBuy(value, gameDetail?.address);
    }
  };
  const check = async () => {
    setLoading(true);
    let errorMsg = "";
    if (balance < parseEther(String(value ?? 0))) {
      errorMsg = "Insufficient GAIME balance";
      setError(errorMsg);
      return;
    } else {
      errorMsg = "";
    }

    if (gameDetail?.stage !== "outside") {
      try {
        const res = await getReserve(gameDetail?.address);
        const reserve = res.find(
          (item) => item.wallet_address === gameDetail?.address
        );
        const Reserve0 = reserve?.on_chain_info?.Reserve0;
        if (BigInt(Reserve0) - parseEther("200000000") < amountOut) {
          errorMsg = "Insufficient liquidity for this trade";
        }
      } catch (error) {
        setLoading(false);
      }
    }
    setError(errorMsg);
    setLoading(false);
  };

  const getMax = async () => {
    const res = await getReserve(gameDetail?.address);
    const reserve = res?.find(
      (item) => item?.wallet_address === gameDetail?.address
    );
    if (!reserve) {
      return;
    }

    const Reserve0 = reserve?.on_chain_info?.Reserve0;
    const max = (BigInt(Reserve0) - parseEther("200000000")) as any;
    const result = (await getTokenAmountIn(max, gameDetail?.address)) as any;
    setValue(Number(formatEther(result)).toFixed(6));
  };

  useEvent(
    "buy-success",
    () => {
      setValue("");
    },
    []
  );

  useEffect(() => {
    check();
  }, [amountOut, gameDetail?.stage]);
  return (
    <div className="w-full px-[24px]">
      <div className="w-full flex justify-end text-[12px] mt-[24px] text-[#fff]">
        Balance: {formatNumber(formatEther(balance))} GAIME
      </div>

      <div className="w-full  bg-[#111515] mt-[16px] relative">
        <SearchInput
          type="number"
          min={0}
          value={value}
          onChange={onChange}
          className="!h-[56px]"
          icon={
            <img
              src={tokenIcon}
              alt=""
              className="absolute left-3 top-1/2 -translate-y-1/2 w-[24px] h-[24px]"
            />
          }
          placeholder=""
        />
        <div className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[16px] text-[#fff]">
          GAIME
        </div>
      </div>

      <div className="w-full h-[28px] bg-[#111515] flex items-center mt-[16px] justify-between">
        {GAIMEList?.map((item, index) => (
          <div
            key={index}
            style={{
              background: activeIndex === index ? "#0f2c2b" : "#0f1716",
              color: activeIndex === index ? "#09fff0" : "#fff",
            }}
            className="h-[28px] cursor-pointer font-thin px-[4px] justify-center bg-[#1b2121] rounded-[10px] text-[#fff] flex items-center text-[10px]"
            onClick={() => {
              setActiveIndex(index);
              setValue(item.num);
            }}
          >
            {item.num} <span className="ml-[8px] ">GAIME</span>
          </div>
        ))}
        {gameDetail?.stage !== "outside" && progressMap.progress !== 100 && (
          <div
            style={{
              background: activeIndex === 4 ? "#0f2c2b" : "#0f1716",
              color: activeIndex === 4 ? "#09fff0" : "#fff",
            }}
            className="h-[28px]  px-[4px]  cursor-pointer font-thin justify-center bg-[#1b2121] rounded-[10px] text-[#fff] flex items-center text-[12px]"
            onClick={() => {
              setActiveIndex(4);
              // setValue(item.num);
              getMax();
            }}
          >
            MAX
          </div>
        )}
      </div>
      {error && (
        <div className="w-full h-[28px] bg-[#111515] flex items-center mt-[2px]">
          <div className="h-[28px]  rounded-[10px]  flex items-center text-[12px] text-[#ff227f]">
            {error}
          </div>
        </div>
      )}
      {amountOut > 0 && (
        <div className="w-full h-[28px] bg-[#111515] flex items-center mt-[8px]">
          <div className="h-[28px]  rounded-[10px] text-[#fff] flex items-center text-[12px] mr-[16px]">
            {Number(formatEther(amountOut)).toFixed(5)} {gameDetail?.ticker}
          </div>
        </div>
      )}
      {gameDetail?.stage === "inner" && (
        <div className="flex items-center mt-[25px] font-thin text-[12px] text-[#838585] ">
          Trading Fee
          <div className="relative">
            {showFee ? (
              <img
                src={CircleAlertWhite}
                onMouseEnter={() => setShowFee(true)}
                onMouseLeave={() => setShowFee(false)}
                className="w-[16px] h-[16px] ml-[8px] cursor-pointer"
              />
            ) : (
              <CircleAlert
                className="w-[16px] h-[16px] text-[#575b5b] ml-[8px] cursor-pointer"
                onMouseEnter={() => setShowFee(true)}
                onMouseLeave={() => setShowFee(false)}
              />
            )}

            {showFee && (
              <FeeNotification className="absolute left-[40px] top-[50%] translate-y-[-50%] z-[1]">
                1% trading fee applies to all buys and sells.
              </FeeNotification>
            )}
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-[16px]">
        <ForgeButton
          onClick={onBuy}
          border="1px solid #09FFF0"
          className="!text-[18px] "
        >
          Buy Tokens
        </ForgeButton>
      </div>
    </div>
  );
};

const Sell = ({ gameDetail }: any) => {
  const [value, setValue] = useState<any>("");
  const { handleSwap } = useV2Swap({
    tokenAddressA: gameDetail?.address,
    tokenAddressB: GAME_TOKEN_ADDRESS,
  });
  const [showFee, setShowFee] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [percentList] = useState([20, 50, 100]);
  const { balance, symbol } = useCustomToken({
    tokenAddress: gameDetail?.address,
  });
  const { handleSell } = useGameEntry({
    sellTokenAddress: gameDetail?.address,
  });
  const onChange = (value: any) => {
    setValue(value);
  };
  const onSell = () => {
    if (value === 0 || !value) {
      toast.error("Please enter the number of tokens to sell");
      return;
    }

    if (Number(value) > Number(formatEther(balance))) {
      toast.error("Insufficient balance");
      return;
    }
    if (gameDetail?.stage === "outside") {
      handleSwap(value, false);
    } else {
      handleSell(value, gameDetail?.address);
    }
  };
  return (
    <div className="w-full px-[24px]">
      <div className="w-full flex justify-end text-[12px] mt-[24px] text-[#fff]">
        Balance: {formatNumber(formatEther(balance))} {symbol}
      </div>

      <div className="w-full  bg-[#111515] mt-[16px] relative">
        <SearchInput
          value={value}
          onChange={onChange}
          className="!h-[56px]"
          type="number"
          icon={
            <img
              src={tokenIcon}
              alt=""
              className="absolute left-3 top-1/2 -translate-y-1/2 w-[24px] h-[24px]"
            />
          }
          showIcon={false}
          placeholder=""
        />
        <div className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[16px] text-[#fff] font-medium">
          {symbol}
        </div>
      </div>

      <div className="w-full h-[28px] bg-[#111515] flex items-center mt-[16px]">
        {percentList?.map((item, index) => (
          <div
            key={index}
            style={{
              background: activeIndex === index ? "#0f2c2b" : "#0f1716",
              color: activeIndex === index ? "#09fff0" : "#fff",
            }}
            className="h-[28px] w-[108px] cursor-pointer font-thin justify-center bg-[#1b2121] rounded-[10px] text-[#fff] flex items-center text-[12px] mr-[16px] !bg-[#FFFFFF0D]"
            onClick={() => {
              const val = (item * Number(formatEther(balance))) / 100;
              setValue(Number(fixed(val, 6)));
            }}
          >
            {item}%
          </div>
        ))}
      </div>

      {gameDetail?.stage === "inner" && (
        <div className="flex items-center mt-[25px] font-thin text-[12px] text-[#838585] ">
          Trading Fee
          <div className="relative">
            {showFee ? (
              <img
                src={CircleAlertWhite}
                onMouseEnter={() => setShowFee(true)}
                onMouseLeave={() => setShowFee(false)}
                className="w-[16px] h-[16px] ml-[8px] cursor-pointer"
              />
            ) : (
              <CircleAlert
                className="w-[16px] h-[16px] text-[#575b5b] ml-[8px] cursor-pointer"
                onMouseEnter={() => setShowFee(true)}
                onMouseLeave={() => setShowFee(false)}
              />
            )}

            {showFee && (
              <FeeNotification className="absolute left-[40px] top-[50%] translate-y-[-50%] z-[1]">
                1% trading fee applies to all buys and sells.
              </FeeNotification>
            )}
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-[16px]">
        <ForgeButton
          onClick={onSell}
          border="1px solid #ff227f"
          className="!text-[18px] text-[#fff]"
          boxShadow="0px 18px 52px -13px #FF227F99,0px 0px 8px 2px #FF227F4F"
          borderImageSource="linear-gradient(0deg, rgba(255, 34, 127, 0.15), rgba(255, 34, 127, 0.15)),radial-gradient(107.05% 92.73% at 50.34% 50.91%, rgba(255, 34, 127, 0.5) 0%, rgba(255, 34, 127, 0) 100%)"
          background=" linear-gradient(0deg, #FF227F, #FF227F),radial-gradient(126.12% 111.11% at 50% -11.11%, rgba(255, 208, 228, 0.9) 0%, rgba(255, 208, 228, 0) 57.04%)"
        >
          Sell Tokens
        </ForgeButton>
      </div>
    </div>
  );
};

export default SellOrBuy;
