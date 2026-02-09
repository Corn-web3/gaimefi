import {
  closeSnackbar,
  useSnackbar,
  enqueueSnackbar,
  SnackbarContent,
} from "notistack";
import React, { forwardRef, useEffect, useState } from "react";
import WarnningIcon from "@/assets/icon/warnning_icon.png";
import SuccessIcon from "@/assets/icon/success_icon.png";
import ErrorIcon from "@/assets/icon/error_icon.png";
import LoadingIcon from "@/assets/icon/loading_icon.png";
import CloseIcon from "@/assets/icon/close.png";
import Card from "../Card";
import { Button } from "../Button";
import { useWaitForTransactionReceipt } from "wagmi";
import { SCAN_URL } from "@/contract/address";

const CustomSnackbar = forwardRef<HTMLDivElement, any>(
  (
    {
      title,
      tx,
      message,
      type,
      snackbarId,
      success,
      error,
      showTx = true,
      autoHide = false,
    },
    ref
  ) => {
    const [currentTitle, setCurrentTitle] = useState(title);
    const [currentMessage, setCurrentMessage] = useState(message);
    const [currentType, setCurrentType] = useState(type);
    const { data: receipt, status } = useWaitForTransactionReceipt({
      hash: tx,
      query: {
        retry: true,
        retryDelay: 1000,
      },
    });

    const getIcon = () => {
      switch (currentType) {
        case "success":
          return SuccessIcon;
        case "error":
          return ErrorIcon;
        case "loading":
          return LoadingIcon;
        default:
          return "#2196f3";
      }
    };

    useEffect(() => {
      if (status === "success") {
        setCurrentType("success");
        setCurrentTitle(success.title);
        setCurrentMessage(success.message);
        if (success.callback) {
          success.callback();
        }
        setTimeout(() => {
          onClose();
        }, 5000);
      } else if (status === "error") {
        setCurrentType("error");
        setCurrentTitle(error.title);
        setCurrentMessage(error.message);
        if (error.callback) {
          error.callback();
        }
      }
    }, [status]);
    const onClose = () => {
      closeSnackbar(snackbarId);
    };

    const onViewTx = () => {
      window.open(`${SCAN_URL}/tx/${tx}`, "_blank");
    };

    useEffect(() => {
      if (autoHide) {
        setTimeout(() => {
          onClose();
        }, 5000);
      }
    }, [autoHide]);

    return (
      <SnackbarContent
        ref={ref} // Key: Forward ref
      >
        <Card
          className="!bg-[#232B2B80] px-[16px] py-[16px] flex  justify-between  w-[280px]"
          style={{ backdropFilter: `blur(40px)` }}
        >
          <div className="flex ">
            <img
              className="w-[24px] h-[24px] mr-[8px]"
              src={getIcon()}
              alt=""
            />
            <div className="text-[14px] w-[185px] text-[#fff]">
              <div className="text-[16px] leading-[25.6px] font-bold">
                {currentTitle}
              </div>
              <div className="text-[#FFFFFF99] w-full break-words leading-[22.4px] mt-[8px] text-[14px]">
                {currentMessage}
              </div>
              {tx && showTx && (
                <div className="mt-[14px]" onClick={onViewTx}>
                  <Button
                    variant="outlined"
                    className="h-[30px] w-[90px] !text-[#09FFF0] !text-[12px] !border-[#FFFFFF33] !rounded-[8px]"
                    color="#FFFFFF33"
                  >
                    View tx
                  </Button>
                </div>
              )}
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
  type?: "success" | "error" | "loading";
  duration?: number;
  content?: React.ReactNode;
  onAction?: () => void;
}

class WalletToastService {
  private enqueueSnackbar: any;

  public init(enqueueSnackbar: any) {
    this.enqueueSnackbar = enqueueSnackbar;
  }

  public show(data: any, options: ToastOptions = {}) {
    const { type = "success", duration = 3000, content, onAction } = options;

    const snackbarId = enqueueSnackbar("", {
      // Custom content
      content: (key) =>
        content || (
          <CustomSnackbar {...data} type={type} snackbarId={snackbarId} />
        ),
      // Configuration
      autoHideDuration: duration,
      persist: true,
      anchorOrigin: {
        vertical: "bottom", // Vertical position set to bottom
        horizontal: "right", // Horizontal position set to right
      },
    });
    return snackbarId;
  }

  // Shortcut method
  public success(data: any, options: Omit<ToastOptions, "type"> = {}) {
    this.show(data, { ...options, type: "success" });
  }

  // Shortcut method
  public loading(data: any, options: Omit<ToastOptions, "type"> = {}) {
    this.show(data, { ...options, type: "loading" });
  }

  public error(data: any, options: Omit<ToastOptions, "type"> = {}) {
    this.show(data, { ...options, type: "error" });
  }
}
export const walletToast = new WalletToastService();
