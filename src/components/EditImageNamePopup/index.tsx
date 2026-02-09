import { updateGameAsset } from "@/services/gameService";
import ModelPopup from "../ModelPopup";
import { useState } from "react";
import { toast } from "../Toast";

interface EditImageNamePopupProps {
  open: boolean;
  onClose: () => void;
  onClickSubmit: () => void;
  assetId: string;
}
const EditImageNamePopup = ({
  open,
  onClose,
  onClickSubmit,
  assetId,
}: EditImageNamePopupProps) => {
  const [fileName, setFileName] = useState<string>("");

  const onClickEditSubmit = () => {
    if (!fileName) {
      toast.error("Please enter the new image name");
      return;
    }
    updateGameAsset(assetId, {
      fileName: fileName + ".png",
    }).then((res) => {
      toast.success("Edit Successfully");
      onClickSubmit();
      onClose();
    });
  };

  return (
    <ModelPopup
      open={open}
      onClose={onClose}
      title={"Edit Image Name"}
      onClickSubmit={onClickEditSubmit}
      showCancel={true}
      onCancel={onClose}
    >
      <div className="text-[14px] text-[#d0d1d1] my-[14px]">
        Please enter the new image name
      </div>
      <input
        type="text"
        className="w-full h-[40px] border-[1px] border-[#191f1f] bg-[#010606] rounded-[12px] px-[12px] text-[14px] text-[#d0d1d1]"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
    </ModelPopup>
  );
};

export default EditImageNamePopup;
