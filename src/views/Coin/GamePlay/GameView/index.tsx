import { useState, useRef, useEffect } from "react";
import reloadIcon from "@/assets/fun/reloadIcon.png";
import allArrowIcon from "@/assets/fun/allArrowIcon.png";
import RenderGameByCode from "@/components/EditorView/RenderGameByCode";
import Formation from "@/components/Formation";
import ForgeButton from "@/components/GlowButton";
import { rebuildGameCode } from "@/services/gameService";
import { useStore } from "@/stores";
import { trackEvent } from "@/utils/trackEvent";

interface GameViewProps {
  code: string;
  isLoading: boolean;
  onReload: () => void;
  gameDetail: any;
  gotoBuyToken: () => void;
  onStart: () => void;
  showStartButton: boolean;
  setShowStartButton: (show: boolean) => void;
}

const GameView = ({
  code,
  isLoading,
  onReload,
  onStart,
  showStartButton,
  gameDetail,
  setShowStartButton,
}: GameViewProps) => {
  const renderGameByCodeRef = useRef<any>(null);
  const onFullScreen = () => {
    renderGameByCodeRef.current.fullScreen();
  };

  const startButtonRef = useRef<any>(null);

  const { user } = useStore();
  const GamePlayViewRef = useRef<any>(null);

  const onRebuild = () => {
    rebuildGameCode({
      gameId: gameDetail?.id,
    }).then((res) => {});
  };

  const onHideBodyScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const onShowBodyScroll = () => {
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const ref = GamePlayViewRef.current;
    if (!ref) return;
    document.addEventListener("click", (e: any) => {
      // If click is not inside iframe, show body scrollbar
      const target = e.target as Element;
      if (
        !target?.closest("iframe") &&
        !target?.contains(ref) &&
        !target?.closest(".StartbuttonClass")
      ) {
        onShowBodyScroll();
        setShowStartButton(true);
      }
    });
  }, [GamePlayViewRef]);

  return (
    <div
      className="w-full h-full flex-col flex bg-[#0b1111] px-[10px] relative"
      ref={GamePlayViewRef}
    >
      {gameDetail?.createCodeStatus === -1 &&
      gameDetail?.user?.address === user?.address ? (
        <>
          <div
            className="absolute left-0 top-0 w-full h-full bg-[#0b1111] bg-opacity-80 flex items-center justify-center z-[123] flex-col"
            onClick={onRebuild}
          >
            <div className="text-[18px] text-[#fff] font-medium mb-[24px]">
              Your game creation failed
            </div>
            <ForgeButton className="!w-[111px] !h-[56px] !rounded-[12px] !text-[14px] !font-medium">
              Rebuild
            </ForgeButton>
          </div>
        </>
      ) : (
        <>
          {showStartButton && (
            <div
              className="absolute left-0 top-0 w-full h-full bg-[#0b1111] bg-opacity-80 flex items-center justify-center z-[123]"
              onClick={() => {
                onHideBodyScroll();
                onStart();
              }}
            >
              <ForgeButton
                ref={startButtonRef}
                className="!w-[111px] !h-[56px] !rounded-[12px] !text-[14px] !font-medium StartbuttonClass"
              >
                Start
              </ForgeButton>
            </div>
          )}

          <div className="w-full h-[24px]  flex justify-between  pt-[10px]">
            <div className="w-[24px] h-[24px] bg-[#1a1a1a] rounded-[4px] flex items-center justify-center">
              <img
                src={reloadIcon}
                className={`w-[16px] h-[16px] cursor-pointer ${
                  isLoading ? "animate-spin" : ""
                }`}
                style={{
                  transform: "rotate(90deg)",
                }}
                onClick={onReload}
                alt=""
              />
            </div>

            <div
              className="w-[24px] h-[24px] bg-[#1a1a1a] rounded-[4px] flex items-center justify-center"
              onClick={onFullScreen}
            >
              <img
                src={allArrowIcon}
                className="w-[16px] h-[16px] cursor-pointer"
                alt=""
              />
            </div>
          </div>
          <div className="mt-[24px] relative w-full flex-1">
            {code ? (
              <RenderGameByCode onRef={renderGameByCodeRef} code={code} />
            ) : (
              <Formation />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GameView;
