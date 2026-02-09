import CustomSwitch from "@/components/CustomSwitch";
import SearchInput from "@/components/input";
import { CrosswiseUpfile } from "@/components/Upfile";
import { useEffect, useMemo, useRef, useState } from "react";
import emitter from "@/utils/useEventBus";
import ImageGrid from "../ImageGrid";
import { createGameAssetApi } from "@/services/gameService";
import { useParams } from "react-router-dom";
import { Alchemy, Network } from "alchemy-sdk";
import { useInfiniteScroll } from "ahooks";
import NftAssets from "./NftAssets";
import OrdiAssets from "./OrdiAssets";

interface AssetsViewProps {
  gameDetail: any;
}

const AssetsView = ({ gameDetail }: AssetsViewProps) => {
  let [displayNFTs, setDisplayNFTs] = useState(false);
  const [uploadMap, setUploadMap] = useState<any>(null);

  const { id } = useParams();
  const [searchValue, setSearchValue] = useState("");

  const ordiRef = useRef<any>(null);
  const nftRef = useRef<any>(null);

  const createGameAsset = () => {
    createGameAssetApi({
      gameId: gameDetail?.id,
      fileName: uploadMap?.fileName,
      url: uploadMap?.url,
    }).then((res) => {
      handleSearch();
      setUploadMap(null);
    });
  };

  useEffect(() => {
    if (uploadMap?.url) {
      createGameAsset();
    }
  }, [uploadMap]);

  // useEffect(() => {
  //   setTotalCount((prev) => prev + nftTotalCount);
  // }, [nftTotalCount]);

  // Search reset
  const handleSearch = () => {
    // ordiRef.current?.reload();
    if (displayNFTs) {
      if (searchValue) {
        nftRef.current?.searchNft(searchValue);
      } else {
        nftRef.current?.reload();
      }
    } else {
      ordiRef.current?.reload(searchValue);
    }
  };

  return (
    <div>
      {!displayNFTs && (
        <CrosswiseUpfile
          onChange={(uploadObj) => {
            setUploadMap(uploadObj);
          }}
        ></CrosswiseUpfile>
      )}

      <div className="w-full mt-[24px]  flex items-center justify-between flex-col">
        <div className="flex items-center w-full justify-between">
          <SearchInput
            placeholder={displayNFTs ? "Search for NFTs" : "Search for images"}
            className="!w-[300px]"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e);
              if (e === "") {
                handleSearch();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          ></SearchInput>

          <div className="flex items-center">
            <div className="text-[#cfd0d0] text-[14px] mr-[16px]">
              Display My NFTs
            </div>
            <CustomSwitch
              checked={displayNFTs}
              onChange={(value) => {
                setSearchValue("");
                setDisplayNFTs(value);
              }}
            />
          </div>
        </div>
        {displayNFTs ? (
          <NftAssets
            searchValue={searchValue}
            handleSearch={handleSearch}
            onRef={nftRef}
            gameDetail={gameDetail}
          ></NftAssets>
        ) : (
          <OrdiAssets
            handleSearch={handleSearch}
            address={id as string}
            onRef={ordiRef}
          ></OrdiAssets>
        )}
      </div>
    </div>
  );
};

export default AssetsView;
