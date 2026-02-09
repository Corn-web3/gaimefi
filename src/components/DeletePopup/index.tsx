import ModelPopup from "../ModelPopup";

interface DeletePopupProps {
  open: boolean;
  onClose: () => void;
  onClickSubmit: () => void;
}
const DeletePopup = ({ open, onClose, onClickSubmit }: DeletePopupProps) => {
  return (
    <ModelPopup
      open={open}
      onClose={onClose}
      title={"Delete Image? "}
      onClickSubmit={onClickSubmit}
      showCancel={true}
      onCancel={onClose}
    >
      <div className="text-[14px] text-[#d0d1d1] mt-[14px]">
        Are you sure you want to delete this image?
      </div>
    </ModelPopup>
  );
};

export default DeletePopup;
