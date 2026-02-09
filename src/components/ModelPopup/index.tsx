import { Modal } from "@mui/material";
import React from "react";
import { X } from "lucide-react";
import ForgeButton from "@/components/GlowButton";

interface ModelPopupProps {
  className?: string;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
  onClickSubmit: () => void;
  showCancel?: boolean;
  cancelText?: string;
  confirmText?: string | React.ReactNode;
  onCancel?: () => void;
}
const ModelPopup = ({
  className,
  children,
  open,
  onClose,
  title,
  onClickSubmit,
  showCancel = false,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onCancel,
}: ModelPopupProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none">
        <div
          className={`w-[480px] relative bg-[#111919] border-[1px] border-sold border-[#2a3030] rounded-[16px]  p-[24px] flex flex-col ${className}`}
        >
          <div className="flex items-center justify-between w-full pb-[24px] border-b-[1px] border-solid border-[#293030]">
            <div className="text-[#fff] text-[20px] font-medium">{title}</div>
            <div className="text-[#fff] text-[16px] font-thin">
              <X
                className="text-[24px] text-[#fff] cursor-pointer"
                onClick={onClose}
              />
            </div>
          </div>
          {children}

          <div className="w-full flex items-center justify-between  mt-[24px] gap-[16px]">
            {showCancel && (
              <div
                className="!flex-1 !h-[56px] rounded-[12px] text-[18px]  bg-[#0f1515] text-[#fff] border-[1px] border-solid border-[#404444] flex items-center justify-center cursor-pointer"
                onClick={onCancel}
              >
                {cancelText}
              </div>
            )}
            <ForgeButton
              className="!flex-1 !h-[56px] rounded-[12px] text-[18px]  bg-[#0f1515] text-[#000] hover:bg-[#fff] hover:text-[#0f1515] border-[1px] border-solid border-[#404444]"
              onClick={onClickSubmit}
            >
              {confirmText}
            </ForgeButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModelPopup;
