import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MuiModal from "@mui/material/Modal";
import Card from "../Card";
import { classNames } from "@/utils/classNames";
import CloseImg from "@/assets/modal/close.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  p: 4,
};

export const CardModal = ({
  open,
  onClose,
  children,
  title = '',
  cardClassName = "",
  ...props
}) => {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
        },
      }}
      {...props}
    >
      <Card
        className={classNames(
          "bg-[#232B2B80] flex flex-col !border-[#FFFFFF1A] rounded-[16px] p-[24px] absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[600px]",
          cardClassName
        )}
      >
        {title && (
          <div className=" flex mb-[24px] justify-between h-[50px] min-h-[50px] border-b-[#FFFFFF1A] border-b-[1px] font-medium text-[20px] text-[#FFFFFF]">
            <div>{title}</div>
            <img
              src={CloseImg}
              alt="close"
              className="w-[24px] h-[24px] cursor-pointer"
              onClick={onClose}
            ></img>
          </div>
        )}
        <div className="flex-1 no-scrollbar">{children}</div>
      </Card>
    </MuiModal>
  );
};

export const Modal = ({ open, onClose, children }) => {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <Box sx={style}>{children}</Box>
    </MuiModal>
  );
};
