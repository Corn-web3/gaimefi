import ChatView from "@/components/chatView";
import EditorView from "@/components/EditorView";
import EditGameHeader from "./EditGameHeader";
import clearIcon from "@/assets/fun/clearIcon.png";
import { CustomSelect } from "@/components/CustomSelect";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearChatHistory,
  getGameDetailByAddress,
} from "@/services/gameService";
import ModelPopup from "@/components/ModelPopup";
import { toast } from "@/components/Toast";
import emitter from "@/utils/useEventBus";

const GameDetail = () => {
  const [showClearMemory, setShowClearMemory] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [gameDetail, setGameDetail] = useState<any>(null);

  const getGame = async () => {
    const res = await getGameDetailByAddress(id as string);
    setGameDetail(res);
  };

  useEffect(() => {
    getGame();
  }, []);
  const [codeData, setCodeData] = useState<any>("");

  const handleClearChatHistory = async () => {
    const res = await clearChatHistory(gameDetail?.id as string);
    emitter.emit("clearChatHistory");
    toast.success("Clear memory successfully");
  };

  const goBack = () => {
    navigate("/coin/" + id);
  };

  const handleApplyCode = (code: any) => {
    setCodeData(code);
    emitter.emit("previewCodeshowLoading");
  };

  return (
    <div className="flex items-center w-full flex-col">
      <EditGameHeader onBack={goBack} gameDetail={gameDetail}></EditGameHeader>
      <div className="flex items-center w-full mt-[16px]">
        <div className="w-[491px] h-[701px] rounded-[16px] p-[24px] bg-[#0f1515]">
          <div className="w-full flex items-center justify-between h-[42px] mb-[24px]">
            {/* <CustomSelect
              options={options}
              value={selectedValue}
              onChange={setSelectedValue}
            ></CustomSelect> */}
            <div></div>
            <div
              className="text-[#cfd0d0] text-[12px] flex items-center cursor-pointer"
              onClick={() => setShowClearMemory(true)}
            >
              <img
                src={clearIcon}
                alt="clearIcon"
                className="w-[16px] h-[16px] mr-[8px]"
              />
              Clear Memory
            </div>
          </div>
          <ChatView
            reloadDetail={getGame}
            gameDetail={gameDetail}
            setCodeData={handleApplyCode}
          ></ChatView>
        </div>

        <div className="w-[693px] h-[701px] rounded-[16px] bg-[#0b1111] ml-[16px]">
          <EditorView codeData={codeData} gameDetail={gameDetail}></EditorView>
        </div>
      </div>

      <ModelPopup
        open={showClearMemory}
        onClose={() => setShowClearMemory(false)}
        title={"Clear Memory? "}
        onClickSubmit={() => {
          handleClearChatHistory();
          setShowClearMemory(false);
        }}
        showCancel={true}
        onCancel={() => setShowClearMemory(false)}
      >
        <div className="text-[14px] text-[#d0d1d1] mt-[14px]">
          Are you sure you want to clear the memory?
        </div>
      </ModelPopup>
    </div>
  );
};

export default GameDetail;
