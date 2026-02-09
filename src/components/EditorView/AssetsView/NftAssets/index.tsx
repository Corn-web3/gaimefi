import { useEffect, useImperativeHandle, useRef, useState } from "react";
import ImageGrid from "../../ImageGrid";
import { useInfiniteScroll } from "ahooks";
import { Network } from "alchemy-sdk";
import { Alchemy } from "alchemy-sdk";
import { useParams } from "react-router-dom";
import { useStore } from "@/stores";
import NoData from "@/components/NoData";

interface NftAssetsProps {
  handleSearch: () => void;
  onRef: any;
  searchValue: string;
  gameDetail?: any;
}
const NftAssets = ({
  handleSearch,
  onRef,
  searchValue,
  gameDetail,
}: NftAssetsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nftList, setNftList] = useState<any>([]);

  const { id } = useParams();

  const { user } = useStore();

  const [pageKey, setPageKey] = useState("");
  const [cacheAllOwner, setCacheAllOwner] = useState<any>([]);

  const getAllOwnerNfts = async () => {
    setNftList([]);
    const alchemy = new Alchemy({
      apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
      network: Network.BASE_MAINNET,
    });
    const data = await alchemy.nft.getNftsForOwner(user?.address, {
      pageKey: pageKey,
      pageSize: 500,
    });
    const filteredData = data.ownedNfts
      .filter((item) => {
        return item?.image?.pngUrl;
      })
      .map((item) => {
        return {
          id: item?.tokenId,
          fileName: item?.name,
          url: item?.image?.pngUrl,
        };
      });
    setCacheAllOwner(filteredData);
  };

  useEffect(() => {
    getAllOwnerNfts();
  }, []);

  const searchNft = async (searchName: string) => {
    const filteredData = cacheAllOwner.filter((item) => {
      return item?.fileName?.toLowerCase().includes(searchName.toLowerCase());
    });
    setNftList(filteredData);
  };

  const getNftList = async (page: number) => {
    const alchemy = new Alchemy({
      apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
      network: Network.BASE_MAINNET,
    });
    const data = await alchemy.nft.getNftsForOwner(user?.address, {
      pageKey: pageKey,
      pageSize: 9,
    });
    setPageKey(data.pageKey || "");
    const filteredData = data.ownedNfts
      .filter((item) => {
        return item?.image?.pngUrl;
      })
      .map((item) => {
        return {
          id: item?.tokenId,
          fileName: item?.name,
          url: item?.image?.pngUrl,
        };
      });
    return {
      list: filteredData,
      total: data.totalCount,
    };
  };

  const { data, reload: nftReload } = useInfiniteScroll(
    (d) => {
      const page = d ? Math.ceil(d.list.length / 9) + 1 : 1;
      return getNftList(page);
    },
    {
      target: containerRef,
      isNoMore: (d: any) => {
        return d?.total <= d?.list?.length || d?.page * 9 > d?.total;
      },
    }
  );

  useEffect(() => {
    if (!searchValue) {
      setNftList(data?.list || []);
    }
  }, [data, searchValue]);
  const onSearch = () => {
    nftReload();
  };

  useImperativeHandle(onRef, () => ({
    reload: onSearch,
    searchNft: searchNft,
  }));
  return (
    <div
      className="w-full mt-[24px] h-[430px] overflow-x-hidden hide-scrollbar"
      ref={containerRef}
    >
      {nftList?.length > 0 ? (
        <ImageGrid
          onRefresh={handleSearch}
          gameDetail={gameDetail}
          isNFT={true}
          assets={nftList}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <NoData />
        </div>
      )}
    </div>
  );
};

export default NftAssets;
