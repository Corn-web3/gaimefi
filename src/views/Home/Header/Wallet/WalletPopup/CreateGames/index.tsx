import { getMyGameHold, getMyGameToken } from "@/services/gameService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Copy } from "lucide-react";
import NoData from "@/components/NoData";
import { Pagination } from "@/components/Pagination";
import { Loading } from "@/components/Loading";
import dayjs from "dayjs";

const CreateGames = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<any>({
    page: 1,
    pageSize: 6,
  });
  const [total, setTotal] = useState<number>(0);
  const [createGamesList, setCreateGamesList] = useState<any[]>([]);

  const getMyGameTokenApi = async () => {
    setLoading(true);
    const res = await getMyGameToken(params);
    const gamesList = res?.data?.filter((item) => item?.address);
    setCreateGamesList(gamesList);
    setTotal(res?.extra?.count);
    setLoading(false);
  };

  useEffect(() => {
    getMyGameTokenApi();
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
        (createGamesList?.length > 0 ? (
          <div className="h-[287px]">
            <div className="h-[215px] w-[368px] flex flex-col items-center overflow-y-auto hide-scrollbar">
              {createGamesList?.map((game, index) => (
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
      {createGamesList?.length > 0 && (
        <div className="flex justify-center items-center mt-[24px]">
          <Pagination
            count={Math.ceil(total / 6)}
            onChange={(page) => setParams({ ...params, page })}
          ></Pagination>
        </div>
      )}
    </>
  );
};

export default CreateGames;

interface ITokenItem {
  item: any;
  index: number;
  goToTokenTradeView: (address: string) => void;
}

export const TokenItem = ({ item, index, goToTokenTradeView }: ITokenItem) => {
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
          <div className=" text-[#ffffff] w-[full] truncate">
            {item?.name}
          </div>
          <div className=" text-[#ffffff] opacity-[0.6] w-[full] truncate">
            {/* {dayjs(item?.createdAt).format("MM DD, YYYY")} */}
            {dayjs(item?.createdAt).format("YYYY.MM.DD")}
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
