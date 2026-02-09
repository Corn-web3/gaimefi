import React, { useState, useRef, useEffect } from "react";
import AssetsView from "./AssetsView";
import RenderGameByCode from "./RenderGameByCode";
import emitter, { useEventBus } from "@/utils/useEventBus";
import reloadIcon from "@/assets/fun/reloadIcon.png";
import allArrowIcon from "@/assets/fun/allArrowIcon.png";

interface EditorViewProps {
  codeData: any;
  gameDetail: any;
}
function EditorView({ codeData, gameDetail }: EditorViewProps) {
  const [tabData, setTabData] = useState([
    {
      id: 1,
      name: "Preview",
    },
    {
      id: 2,
      name: "Assets",
    },
  ]);
  const [activeTab, setActiveTab] = useState(tabData[0]);

  useEventBus("applyCode", (data) => {
    if (activeTab?.name === "Assets") {
      setActiveTab(tabData[0]);
    }
  });

  const renderGameByCodeRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const onFullScreen = () => {
    renderGameByCodeRef.current.fullScreen();
  };
  const onReload = () => {
    emitter.emit("previewCodeshowLoading");
  };

  return (
    <div className="w-full flex relative px-[24px] flex-col">
      <div className="flex items-center mt-[16px] mb-[40px] ">
        {tabData?.map((tab) => (
          <div
            onClick={() => {
              setActiveTab(tab);
            }}
            key={tab?.id}
            className="mr-[32px] font-medium w-[194px] text-center text-[#fff] cursor-pointer relative"
            style={{
              fontSize: activeTab?.name === tab?.name ? "18px" : "16px",
              color: activeTab?.name === tab?.name ? "#09fff0" : "#6f7373",
              fontWeight: activeTab?.name === tab?.name ? "bold" : "normal",
            }}
          >
            {tab?.name}
            {activeTab?.name === tab?.name && (
              <div className="absolute bottom-[-16px] left-[50%] translate-x-[-50%] w-[30px] h-[3px] bg-[#09fff0]"></div>
            )}
          </div>
        ))}
      </div>

      <div
        className="w-[645px] h-[597px]"
        style={{
          background: activeTab?.name === "Preview" ? "#000000" : "#0b1111",
        }}
      >
        {activeTab?.name === "Preview" && (
          <div className="w-full h-[24px]  flex justify-between px-[10px]  my-[10px]">
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
        )}

        {activeTab?.name === "Preview" && (
          <div className="w-full h-[550px]">
            <RenderGameByCode code={codeData} onRef={renderGameByCodeRef} />
          </div>
        )}

        {activeTab?.name === "Assets" && <AssetsView gameDetail={gameDetail} />}
      </div>
    </div>
  );
}

export default EditorView;

{
  /* <div className=" flex-1">
        <Editor
          height="100%"
          defaultLanguage="html"
          value={code}
          theme="vs-dark"
          onChange={handleEditorChange}
        />
      </div> */
}
