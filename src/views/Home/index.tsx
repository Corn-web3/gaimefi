// import homeBg from "@/assets/fun/homeBg.png";
import ForgeButton from "../../components/GlowButton";
import GameItem from "./GameItem";
import SortMenu from "@/components/SortMenu";
import { useNavigate } from "react-router-dom";
import {
  getAlmostGame,
  getGameListApi,
  getTokenPrice,
} from "@/services/gameService";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/Toast";
import { walletToast } from "@/components/Toast/WalletToast";
import { useInfiniteScroll } from "ahooks";
import { GAME_TOKEN_ADDRESS } from "@/contract/address";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const navigate = useNavigate();
  // const [gameList, setGameList] = useState([{}, {}, {}, {}]);
  const [usdPrice, setUsdPrice] = useState<any>("0");
  const [topGame, setTopGame] = useState<any>({});
  const [almostGameList, setAlmostGameList] = useState<any>({});
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sortType: "",
    gameType: "",
  });
  const homeRef = useRef<any>(null);

  const getGameList = async (page: number) => {
    const data = await getGameListApi({
      ...params,
      page,
    });
    return data.data || [];
    // setGameList(data.data || []);
  };

  const { data: gameList, refetch: refetchGameList } = useQuery({
    queryKey: ["gameList", params],
    queryFn: () => getGameListApi(params),
    select: (data) => data.data || [],
  });

  useEffect(() => {
    getGameList(1);
  }, []);

  // const { data, reload } = useInfiniteScroll(
  //   (d) => {
  //     const page = d ? Math.ceil(d.list.length / 10) + 1 : 1;
  //     return getGameList(page);
  //   },
  //   {
  //     target: homeRef,
  //     isNoMore: (d: any) => {
  //       return d?.total <= d?.list?.length || d?.page * 10 > d?.total;
  //     },
  //   }
  // );

  // useEffect(() => {
  //   if (data?.list?.length > 0) {
  //     setGameList(data?.list);
  //   }
  // }, [data]);

  useEffect(() => {
    if (params.sortType || params.gameType) {
      // setGameList([]);
      // reload();
    }
  }, [params.sortType, params.gameType]);

  const getAlmostGameList = async () => {
    const res = await getAlmostGame();
    if (res?.length > 0) {
      setAlmostGameList(res[0]);
    }
  };

  const getUsePrice = async () => {
    const res = await getTokenPrice(GAME_TOKEN_ADDRESS);
    const _usdPrice = Number(res?.usdPrice);
    setUsdPrice(_usdPrice);
  };

  useEffect(() => {
    getAlmostGameList();
    getUsePrice();
    const interval = setInterval(() => {
      getAlmostGameList();
      getUsePrice();
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSortChange = (value: string) => {
    setParams({ ...params, sortType: value, page: 1 });
  };

  const handleGameTypeChange = (value: string) => {
    setParams({ ...params, gameType: value, page: 1 });
  };

  return (
    <div
      style={{
        // backgroundImage: `url(${homeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      ref={homeRef}
      className="max-w-[1440px] h-[100vh] min-h-screen bg-[#020606] flex items-center flex-col overflow-y-scroll hide-scrollbar"
    >
      <div className="mt-[83px] flex items-center flex-col relative">
        <div className="relative">
          <div className="meteor1 "></div>

          <ForgeButton
            className="!z-10 !relative"
            onClick={() => {
              navigate("/forge-game");
            }}
          >
            Create New Game
          </ForgeButton>
        </div>

        {almostGameList?.name && (
          <div className="mt-[40px] text-[#fff] text-[24px] font-bold  ">
            Graduating Soon
          </div>
        )}
        {almostGameList?.name && (
          <div className="mt-[24px] relative">
            <div className="meteor2 "></div>
            <GameItem
              game={almostGameList}
              isAlmoseJeet={true}
              usdPrice={usdPrice}
            ></GameItem>
          </div>
        )}
      </div>

      <div className="mt-[79px] w-full">
        <SortMenu
          onChangeSort={handleSortChange}
          onChangeGameType={handleGameTypeChange}
        ></SortMenu>
      </div>

      <div className="mt-[32px] grid grid-cols-2 gap-[16px] pb-[40px]">
        {gameList?.map((item: any) => (
          <div key={item.gameId}>
            <GameItem game={item} usdPrice={usdPrice}></GameItem>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
