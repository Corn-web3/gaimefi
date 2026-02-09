import { getGameOwners } from "@/services/gameService";
import { useStore } from "@/stores";
import { useEvent } from "@/utils/ImEvent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface DistributionProps {
  gameDetail: any;
}
const Distribution = (props: DistributionProps) => {
  const { gameDetail } = props;
  const [holders, setHolders] = useState<any[]>([]);
  const { id } = useParams();
  const { user } = useStore();

  const getGameOwnersApi = (id: string) => {
    getGameOwners(id).then((res) => {
      setHolders(res);
    });
  };

  useEvent("buy-success", () => {
    getGameOwnersApi(id as string);
  });

  useEvent("sell-success", () => {
    getGameOwnersApi(id as string);
  });

  useEffect(() => {
    let timer: any;
    if (id) {
      getGameOwnersApi(id as string);

      timer = setInterval(() => {
        getGameOwnersApi(id as string);
      }, 5000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [id]);
  return (
    <div className="w-full h-[665px] bg-[#0f1515] rounded-[16px]  flex items-center flex-col p-[24px] mt-[16px]">
      <div className="text-[16px] text-[#fff] font-medium w-full flex items-center">
        Holder Distribution{" "}
        <span className="text-[#707373] ml-[8px]">({holders?.length})</span>
      </div>

      <div className="w-full h-[1px] bg-[#1a2121] mt-[24px]"></div>

      <div className="flex items-center flex-col w-full mt-[24px] overflow-y-scroll h-[500px] hide-scrollbar">
        {holders?.map((holder, index) => (
          <div
            key={index}
            className="w-full flex items-center mt-[12px] justify-between"
          >
            <div className="flex items-center text-[#fff]">
              <div>{index + 1}</div>
              <div
                className="text-[12px] ml-[8px]"
                style={{
                  color:
                    index === 0
                      ? "#FFE249"
                      : index === 1
                      ? "#D7F3F6"
                      : index === 2
                      ? "#CD8E75"
                      : "#fff",
                }}
              >
                {holder?.ownerAddress?.slice(0, 4) +
                  "..." +
                  holder?.ownerAddress?.slice(-4)}
                {holder?.bondingCurve === 1 ? "(🏡)" : ""}
                {holder?.dev == 1 ? "(dev)" : ""}
              </div>
            </div>

            <div
              style={{
                color:
                  index === 0
                    ? "#FFE249"
                    : index === 1
                    ? "#D7F3F6"
                    : index === 2
                    ? "#CD8E75"
                    : "#fff",
              }}
            >
              {holder?.percentage?.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Distribution;
