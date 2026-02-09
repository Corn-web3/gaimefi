import { useEffect, useState } from "react";
import { debounce, Modal } from "@mui/material";
import { ChevronLeft } from "lucide-react";
import SearchInput from "@/components/input";
import { getGameListApi } from "@/services/gameService";
import { useNavigate } from "react-router-dom";
import { calculateCreateTime } from "@/views/Coin/TokenTradeView";
import { transferBigNumber } from "@/utils/transferBigNumber";
import NoData from "@/components/NoData";
import { useDebounce, useDebounceFn } from "ahooks";

interface SearchPopupProps {
  show: boolean;
  setShow: (show: boolean) => void;
}
const SearchPopup = ({ show, setShow }: SearchPopupProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const getSearchResults = async (e: any) => {
    if (e.key === "Enter") {
      const res = await getGameListApi({
        page: 1,
        pageSize: 5,
        keyword: searchValue,
      });

      res?.data?.sort((a: any, b: any) => {
        return b?.marketCap - a?.marketCap;
      });

      setSearchResults(res?.data);
    }
  };

  const navigate = useNavigate();

  const onCLose = () => {
    setSearchValue("");
    setSearchResults([]);
    setShow(false);
  };

  const SearchGameList = async () => {
    const res = await getGameListApi({
      page: 1,
      pageSize: 5,
      keyword: searchValue,
    });

    res?.data?.sort((a: any, b: any) => {
      return b?.marketCap - a?.marketCap;
    });

    setSearchResults(res?.data);
  };
  
  const { run: onSubmit } = useDebounceFn(SearchGameList, { wait: 500 });
  const onSearchChange = (value) => {
    setSearchValue(value);
    onSubmit();
  };

  return (
    <Modal open={show} onClose={onCLose}>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none">
        <div
          className="w-[640px] h-[600px] bg-[#111919] bg-opacity-50 rounded-[16px] border-[1px] border-solid border-[#292e2e] p-[24px]"
          style={{
            backdropFilter: "blur(40px)",
          }}
        >
          <div className="flex items-center justify-between w-full">
            <div
              className="flex items-center w-[90px] h-[42px] border-[1px] border-solid border-[#292d2d] rounded-[12px]  justify-center cursor-pointer"
              onClick={onCLose}
            >
              <ChevronLeft className="text-[12px] text-[#fff]" />
              <div className="text-[#fff] text-[14px] font-medium">Back</div>
            </div>

            <SearchInput
              autoFocus={true}
              onClear={() => {
                setSearchValue("");
                setSearchResults([]);
              }}
              onKeyDown={(e) => getSearchResults(e)}
              className="flex-1 h-[42px] border-[1px] border-solid border-[#292d2d] rounded-[12px]  justify-center ml-[16px]"
              showClear={true}
              value={searchValue}
              onChange={(value) => {
                onSearchChange(value);
              }}
            />
          </div>
          <div className="mt-[24px] w-full flex flex-col gap-[16px] overflow-y-auto h-[500px] hide-scrollbar">
            {searchResults?.length > 0 ? (
              <>
                {searchResults?.length > 0 &&
                  searchResults.map((item, index) => (
                    <div
                      onClick={() => {
                        onCLose();
                        navigate(`/coin/${item?.address}`);
                      }}
                      key={index}
                      className="w-full h-[141px] bg-[#111919] bg-opacity-50 rounded-[16px] p-[24px] flex items-center cursor-pointer"
                      style={{
                        backdropFilter: "blur(40px)",
                      }}
                    >
                      <img
                        src={item?.coverImageUrl}
                        className="w-[93px] h-[93px] rounded-[4px]"
                        alt=""
                      />
                      <div className="ml-[24px]">
                        <div className="text-[#09FFF0]">
                          {item?.name} (${item?.ticker})
                        </div>
                        <div className="flex items-center">
                          <div className="text-[#838585] flex items-center">
                            Created By{" "}
                            <span className="text-[#fff] ml-[8px]">
                              {item?.user?.address?.slice(0, 4)}...
                              {item?.user?.address?.slice(-4)}
                            </span>{" "}
                            <span className="inline-block w-[3px] h-[3px] bg-[#09FFF0] rounded-full mx-[8px]"></span>
                            <span className="text-[#fff]">
                              {calculateCreateTime(item?.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-[#838585]">
                            Marketcap{" "}
                            <span className="text-[#09FFF0] ml-[8px]">
                              ${transferBigNumber(item?.marketCap) || 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-[#838585]">
                            Plays{" "}
                            <span className="text-[#fff] ml-[8px]">
                              {item?.plays}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <div className="w-full h-[460px] flex items-center justify-center">
                <NoData />
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SearchPopup;
