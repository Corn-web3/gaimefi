import { useImperativeHandle, useRef, useState } from "react";
import ImageGrid from "../../ImageGrid";
import { useInfiniteScroll } from "ahooks";
import { getGameAssetsByAddress } from "@/services/gameService";
import NoData from "@/components/NoData";

interface OrdiAssetsProps {
  handleSearch: () => void;
  address: string;
  onRef: any;
}
const OrdiAssets = ({ handleSearch, address, onRef }: OrdiAssetsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  let [params, setParams] = useState({
    address: address as string,
    fileName: "",
    pageSize: 6,
  });

  const getAssets = async (page: number) => {
    const data = await getGameAssetsByAddress({
      ...params,
      page,
    });
    return {
      list: data.data,
      total: data.extra?.count,
    };
  };

  const { data, reload: reloadAssets } = useInfiniteScroll(
    (d) => {
      const page = d ? Math.ceil(d.list.length / 6) + 1 : 1;
      return getAssets(page);
    },
    {
      target: containerRef,
      isNoMore: (d: any) => {
        return d?.total <= d?.list?.length || d?.page * 6 > d?.total;
      },
    }
  );

  const onSearch = (value: string) => {
    params.fileName = value;
    setParams({
      ...params,
      fileName: value,
    });
    reloadAssets();
  };

  useImperativeHandle(onRef, () => ({
    reload: onSearch,
  }));

  return (
    <div
      className="w-full mt-[24px] h-[430px] overflow-x-hidden hide-scrollbar"
      ref={containerRef}
    >
      {data?.list?.length > 0 ? (
        <ImageGrid onRefresh={handleSearch} assets={data?.list} />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <NoData />
        </div>
      )}
    </div>
  );
};

export default OrdiAssets;
