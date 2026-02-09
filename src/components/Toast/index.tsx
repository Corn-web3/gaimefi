import {
  closeSnackbar,
  useSnackbar,
  enqueueSnackbar,
  SnackbarContent,
} from "notistack";
import React, { forwardRef } from "react";
import WarnningIcon from "@/assets/icon/warnning_icon.png";
import SuccessIcon from "@/assets/icon/success_icon.png";
import ErrorIcon from "@/assets/icon/error_icon.png";
import CloseIcon from "@/assets/icon/close.png";
import Card from "../Card";

const CustomSnackbar = forwardRef<HTMLDivElement, any>(
  ({ message, type, snackbarId }, ref) => {
    const getIcon = () => {
      switch (type) {
        case "success":
          return SuccessIcon;
        case "error":
          return ErrorIcon;
        case "warning":
          return WarnningIcon;
        default:
          return "#2196f3";
      }
    };
    const onClose = () => {
      closeSnackbar(snackbarId);
    };

    return (
      <SnackbarContent
        ref={ref} // Key: forward ref
      >
        <Card
          className="!bg-[#232B2B80] px-[16px] py-[9px] flex items-center justify-between"
          style={{ backdropFilter: `blur(40px)` }}
        >
          <div className="flex items-center">
            <img
              className="w-[20px] h-[20px] mr-[8px]"
              src={getIcon()}
              alt=""
            />
            <div className="text-[14px] leading-[22px] text-[#fff] max-w-[500px]">
              {message}
            </div>
          </div>

          <img
            src={CloseIcon}
            className="w-[20px] h-[20px] ml-[16px] cursor-pointer"
            onClick={onClose}
          ></img>
        </Card>
      </SnackbarContent>
    );
  }
);

interface ToastOptions {
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  content?: React.ReactNode;
  onAction?: () => void;
}

class ToastService {
  private enqueueSnackbar: any;

  public init(enqueueSnackbar: any) {
    this.enqueueSnackbar = enqueueSnackbar;
  }

  public show(message: string, options: ToastOptions = {}) {
    const { type = "info", duration = 3000, content, onAction } = options;

    const snackbarId = enqueueSnackbar("", {
      // Custom content
      content: (key) =>
        content || (
          <CustomSnackbar
            snackbarId={snackbarId}
            message={message}
            type={type}
          />
        ),
      // Configuration
      autoHideDuration: duration,
      variant: type,
    });
  }

  // Shortcut method
  public success(message: string, options: Omit<ToastOptions, "type"> = {}) {
    this.show(message, { ...options, type: "success" });
  }

  // Shortcut method
  public warning(message: string, options: Omit<ToastOptions, "type"> = {}) {
    this.show(message, { ...options, type: "warning" });
  }

  public error(message: string, options: Omit<ToastOptions, "type"> = {}) {
    this.show(message, { ...options, type: "error" });
  }
}

// Export singleton
export const toast = new ToastService();
