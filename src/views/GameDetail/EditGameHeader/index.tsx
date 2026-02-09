import ForgeButton from "@/components/GlowButton";
import { ChevronLeft } from "lucide-react";
import MakeProposal from "../MakeProposal";
import { useEffect, useMemo, useState } from "react";
import { getAwakenRecord, publishGame } from "@/services/gameService";
import { useEventBus } from "@/utils/useEventBus";
import { toast } from "@/components/Toast";
import { useStore } from "@/stores";
import { transferBigNumber } from "@/utils/transferBigNumber";
import { Button } from "@/components/Button";
import { ElizaModal } from "@/components/Modal/ElizaModal";
import { useEvent } from "@/utils/ImEvent";
interface EditGameHeaderProps {
  onBack: () => void;
  gameDetail: any;
}
const EditGameHeader = ({ onBack, gameDetail }: EditGameHeaderProps) => {
  const { user } = useStore();
  const [showMakeProposal, setShowMakeProposal] = useState(false);
  const [showEliza, setShowEliza] = useState(false);
  const [cacheCurrentGame, setCacheCurrentGame] = useState<any>();
  const [awakenRecord, setAwakenRecord] = useState<any>(false);
  useEventBus("canchePublish", (data) => {
    setCacheCurrentGame(data);
  });

  const [loading, setLoading] = useState(false);

  // Inner/Outer market judgment
  const handlePublish = (type: string) => {
    if (type == "proposal") {
      setShowMakeProposal(true);
      return;
    }
    if (!cacheCurrentGame?.id) {
      toast.error("Without any changes");
      return;
    }
    setLoading(true);
    publishGame({
      chatId: cacheCurrentGame?.id,
    })
      .then((res) => {
        setCacheCurrentGame(null);
        setLoading(false);
        toast.success("Publish successfully");
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getAwaken = async () => {
    const res = await getAwakenRecord(gameDetail?.address);
    setAwakenRecord(res);
  };

  useEffect(() => {
    if (gameDetail?.address) {
      getAwaken();
    }
  }, [gameDetail]);

  useEvent("awaken-reflash", () => {
    setShowEliza(false);
  });

  const canAwaken = useMemo(() => {
    if (awakenRecord || awakenRecord === false) {
      return false;
    }

    if (gameDetail?.stage !== "inner") {
      return true;
    } else {
      if (gameDetail?.user?.address !== user?.address) {
        return false;
      }
    }

    return true;
  }, [awakenRecord, gameDetail]);
  return (
    <div className="w-full h-[74px] bg-[#101616] px-[24px] flex items-center justify-between rounded-[16px]">
      <div className="flex items-center gap-4">
        {/* Back Button */}
        <div
          onClick={onBack}
          className="flex items-center text-[#707373] cursor-pointer"
        >
          <ChevronLeft className="text-[10px]" />
          <span className="text-[14px] ml-[6px] leading-[14px]">Back</span>
        </div>

        {/* Game Info */}
        <div className="flex items-center gap-6 text-[#ffffff]">
          <h1 className="text-white font-medium">
            {gameDetail?.name} <span className="">(${gameDetail?.ticker})</span>
          </h1>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#767A7A]">Created by</span>
            <span className="text-white">
              {gameDetail?.user?.address?.slice(0, 4)}...
              {gameDetail?.user?.address?.slice(-4)}
            </span>
            <span className="text-[#767A7A]">•</span>
            <span className="text-[#767A7A]">{gameDetail?.createdTime}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[#767A7A]">Marketcap</span>
              <span className="text-[#09fff0]">
                {transferBigNumber(gameDetail?.marketCap) || 0}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#767A7A]">Plays</span>
              <span className="text-white">{gameDetail?.plays}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-[24px]">
        {canAwaken && (
          <Button
            // onClick={onClose}
            onClick={() => setShowEliza(true)}
            variant="outlined"
            className="h-[42px] !px-[10px] !py-[12px] !text-[#fff] !text-[14px] font-bold !border-[#FFFFFF33] !rounded-[12px]"
            color="#FFFFFF33"
          >
            Awaken eliza
          </Button>
        )}

        {gameDetail?.stage === "inner" && gameDetail?.user?.id === user?.id && (
          <ForgeButton
            isSpin={loading}
            disabled={
              cacheCurrentGame?.id != "errorId" && cacheCurrentGame?.id
                ? false
                : true
            }
            className="!w-[100px] !h-[42px] !text-[14px]"
            onClick={() => handlePublish("publish")}
          >
            Publish
          </ForgeButton>
        )}

        {gameDetail?.stage === "outside" && (
          <ForgeButton
            className="!w-[150px] !h-[42px] !text-[14px]"
            onClick={() => handlePublish("proposal")}
          >
            Submit Proposal
          </ForgeButton>
        )}
      </div>
      <MakeProposal
        cacheCurrentGame={cacheCurrentGame}
        open={showMakeProposal}
        onClose={() => {
          setShowMakeProposal(false);
          setCacheCurrentGame(null);
        }}
      />
      <ElizaModal
        gameDetail={gameDetail}
        open={showEliza}
        onClose={() => setShowEliza(false)}
      />
    </div>
  );
};

export default EditGameHeader;
