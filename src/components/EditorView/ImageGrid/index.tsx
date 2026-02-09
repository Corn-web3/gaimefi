// components/ImageGrid.tsx
import React, { useState } from "react";
import { Copy, Plus, Trash2, Pencil, CirclePlus } from "lucide-react"; // Use lucide-react icons
import treeIcon from "@/assets//fun/treeIcon.png";
import { createGameAssetApi, deleteGameAssetApi } from "@/services/gameService";
import emitter from "@/utils/useEventBus";
import { toast } from "@/components/Toast";
import DeletePopup from "@/components/DeletePopup";
import EditImageNamePopup from "@/components/EditImageNamePopup";
import { transferImage } from "@/utils/nftTransferLocalImg";

interface ImageGridProps {
  assets: any[];
  onRefresh: () => void;
  isNFT?: boolean;
  gameDetail?: any;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  assets,
  onRefresh,
  isNFT = false,
  gameDetail,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>("1");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [HoverAddPlus, setHoverAddPlus] = useState(false);

  const handleDelete = (id: string) => {
    setShowDeletePopup(true);
    setDeleteId(id);
    // deleteGameAssetApi(id).then((res) => {
    //   onRefresh();
    // });
  };

  const handleDeleteSubmit = () => {
    if (deleteId) {
      deleteGameAssetApi(deleteId).then((res) => {
        onRefresh();
      });
    }
    setShowDeletePopup(false);
  };

  const handleCopy = (url) => {
    // Copy URL
    toast.success("Copied to clipboard");
    navigator.clipboard.writeText(url);
  };

  const [cacheImg, setCacheImg] = useState<any[]>([]);

  const handleAddtoChat = (item: any) => {
    if (isNFT) {
      const findItem = cacheImg.find((i) => i.id == item.id);
      if (findItem) {
        emitter.emit("addImgToChat", {
          data: {
            isNft: true,
            ...findItem,
          },
        });
        return;
      }
      transferImage(item.url).then((res) => {
        if (res) {
          setCacheImg([...cacheImg, item]);
          emitter.emit("addImgToChat", {
            data: {
              isNft: true,
              id: res?.id,
            },
          });
        } else {
          toast?.error("Transfer failed");
        }
      });
    } else {
      emitter.emit("addImgToChat", {
        data: {
          isNft: false,
          ...item,
        },
      });
    }
  };

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [editId, setEditId] = useState<string>("");
  const [isEditFileName, setIsEditFileName] = useState(false);

  const onEditSubmit = () => {
    setIsEditFileName(false);
    setEditId("");
    onRefresh();
  };

  return (
    <div className="grid grid-cols-3 gap-[16px]">
      {assets?.map((item, index) => (
        <div
          key={index}
          className="relative group "
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Image container */}
          <div className="w-[206px] h-[154px] border-[1px] border-[#191f1f] bg-[#010606]  rounded-[12px] flex items-center justify-center relative">
            <img
              src={item.url || treeIcon}
              alt={item.name}
              className="w-[148px] max-h-[148px] object-cover outline-none border-none"
            />

            {/* Image name */}
            <div
              className="w-[206px]  h-[31px] justify-center px-[12px] leading-[31px] truncate overflow-hidden absolute bottom-0 left-0 text-[#dcd4d1] text-[12px] bg-[#010606] text-center "
              style={{
                background:
                  "linear-gradient(180deg, rgba(0, 6, 6, 0.5) 0%, rgba(0, 6, 6, 0) 100%)",
              }}
            >
              {item.fileName}
            </div>
          </div>

          {hoveredId == item.id && (
            <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center bg-black/50">
              <CirclePlus
                onClick={() => handleAddtoChat(item)}
                onMouseEnter={() => setHoverAddPlus(true)}
                onMouseLeave={() => setHoverAddPlus(false)}
                style={{
                  color: HoverAddPlus ? "#09fff0" : "#dad8d6",
                }}
                className="text-black text-[32px] cursor-pointer"
              />

              <div className="absolute top-2 right-2 flex flex-col gap-2">
                {/* <button
                  onClick={() => {
                    handleCopy(item.url);
                  }}
                  className="p-2 rounded-full bg-[#1A1D1D] hover:bg-[#2A2D2D] transition-colors"
                >
                  <Copy size={16} className="text-white" />
                </button> */}
                {!isNFT && (
                  <button
                    onClick={() => {
                      setIsEditFileName(true);
                      setEditId(item.id);
                    }}
                    className="p-2 rounded-full bg-[#1A1D1D] hover:bg-[#2A2D2D] transition-colors"
                  >
                    <Pencil size={16} className="text-white" />
                  </button>
                )}
                {!isNFT && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-full bg-[#1A1D1D] hover:bg-[#2A2D2D] transition-colors"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      <DeletePopup
        onClickSubmit={handleDeleteSubmit}
        open={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
      />

      <EditImageNamePopup
        open={isEditFileName}
        onClose={() => setIsEditFileName(false)}
        onClickSubmit={onEditSubmit}
        assetId={editId}
      />
    </div>
  );
};

export default ImageGrid;
