import Tab from "@/components/Tab";
import { useEffect, useState } from "react";
import GameView from "./GameView";
import Comments from "./Comments";
import Proposal from "./Proposal";
import ForgeButton from "@/components/GlowButton";
import { useNavigate, useParams } from "react-router-dom";
import ModelPopup from "@/components/ModelPopup";
import { formatNumber } from "@/utils/formatNumber";
import { formatEther, parseEther } from "viem";
import { addPlayRecord } from "@/services/gameService";
import { useCustomToken } from "@/contract/useCustomToken";
import { useStore } from "@/stores";
import { getComments } from "@/services/comments";
import { getProposal } from "@/services/proposal";
import { GAME_TOKEN_ADDRESS } from "@/contract/address";
import { useGameEntry } from "@/contract/useGameEntry";
import { imEvent, useEvent } from "@/utils/ImEvent";
import { useWallet } from "@/utils/useWallet";
import { gotoBuyToken, NeedToken } from "@/components/NeedToken";
import {
  VoteNeedToken,
} from "@/components/NeedToken/VoteNeedToken";
import { trackEvent } from "@/utils/trackEvent";
interface GamePlayProps {
  gameDetail: any;
  onReload: () => void;
  isLoading: boolean;
}

const GamePlay = (props: GamePlayProps) => {
  const { gameDetail } = props;

  const { address } = useWallet();
  const [tabs, setTabs] = useState([
    {
      name: "Game",
    },
    {
      name: "Comments",
      num: 0,
    },
  ]);

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [proposalCount, setProposalCount] = useState(0);
  useEffect(() => {
    if (
      gameDetail?.stage === "outside" &&
      tabs.findIndex((item) => item.name === "Proposal") === -1
    ) {
      setTabs([...tabs, { name: "Proposal" }]);
    }
  }, [gameDetail?.stage]);

  const getCount = async () => {
    const getCommentsList = async () => {
      const res = await getComments({
        address: id,
        page: 1,
        pageSize: 4,
      });
      setCommentsCount(res?.extra?.count);
    };

    const getProposalList = async () => {
      const params = {
        proposalStatus: 0,
        myProposal: 0,
        address: id,
        page: 1,
        pageSize: 4,
      };
      const res = await getProposal(params);
      setProposalCount(res?.extra?.count);
    };

    getCommentsList();
    getProposalList();
  };

  useEvent("reflash-counts", getCount);

  useEffect(() => {
    getCount();
  }, []);

  const [code, setCode] = useState("");
  const onChange = (tab: any) => {
    setActiveTab(tab);
  };
  const navigate = useNavigate();

  const [voteOpen, setVoteOpen] = useState(false);
  const onEdit = () => {
    const balanceEth = formatEther(balance);
    if (
      Number(balanceEth) < needCountToken &&
      gameDetail?.user?.address.toLowerCase() != address?.toLowerCase()
    ) {
      setVoteOpen(true);
    } else {
      setShowStartButton(false);
      navigate(`/game-detail/${gameDetail?.address}`);
      trackEvent("submit_proposal");
    }
  };
  const [needCountToken, setNeedCountToken] = useState(420000);
  // const { gotoBuyToken } = useBuyToken({ gameDetail, value: needCountToken });

  const { id } = useParams();

  const [showStartButton, setShowStartButton] = useState(true);

  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };
  const { balance } = useCustomToken({
    tokenAddress: id,
  });

  const { user } = useStore();

  const onStart = () => {
    // if (gameDetail?.stage === "outside") {
    //   return;
    // }

    if (!user) {
      imEvent.trigger("login");

      return;
    }
    addPlayRecord({
      gameId: gameDetail?.id,
    });

    const balanceEth = formatEther(balance);

    if (Number(balanceEth) < needCountToken) {
      setOpen(true);
    } else {
      setShowStartButton(false);
      // addPlayRecord({
      //   gameId: gameDetail?.id,
      // });
      trackEvent("start_game", {
        game_id: gameDetail?.id,
        game_name: gameDetail?.name,
      });
    }
  };

  const getTabs = () => {
    return tabs.map((item) => {
      if (item.name === "Comments") {
        return {
          ...item,
          num: commentsCount,
        };
      }
      if (item.name === "Proposal") {
        return {
          ...item,
          num: proposalCount,
        };
      }
      return item;
    });
  };
  return (
    <div className="w-full h-[765px] bg-[#0f1515] rounded-[16px]  flex items-center flex-col p-[24px] mt-[16px] relative ">
      <Tab tabs={getTabs()} activeTab={activeTab} onChange={onChange} />

      <div className="absolute right-[24px] top-[15px]">
        {gameDetail?.stage === "inner" &&
          user?.address === gameDetail?.user?.address && (
            <ForgeButton
              className="w-[52px] !h-[30px] !rounded-[8px] !text-[12px] !font-medium"
              onClick={onEdit}
              style={{
                width: gameDetail?.stage === "inner" ? "52px" : "82px",
              }}
            >
              Edit
            </ForgeButton>
          )}
        {gameDetail?.stage === "outside" && (
          <ForgeButton
            className="!w-[140px] !h-[30px] !rounded-[8px] !text-[12px] !font-medium"
            onClick={onEdit}
            style={{
              width: gameDetail?.stage === "inner" ? "52px" : "82px",
            }}
          >
            Submit Proposal
          </ForgeButton>
        )}
      </div>

      <div className="w-full pt-[24px] flex flex-col flex-1">
        {activeTab?.name === "Game" && (
          <GameView
            setShowStartButton={setShowStartButton}
            showStartButton={showStartButton}
            onStart={onStart}
            gotoBuyToken={gotoBuyToken}
            {...props}
            code={gameDetail?.code}
            gameDetail={gameDetail}
          />
        )}
        {activeTab?.name === "Comments" && <Comments gameDetail={gameDetail} />}
        {activeTab?.name === "Proposal" && <Proposal gameDetail={gameDetail} />}
      </div>
      <NeedToken
        open={open}
        onClose={onClose}
        gameDetail={gameDetail}
        needCountToken={needCountToken}
      />
      <VoteNeedToken
        open={voteOpen}
        onClose={() => setVoteOpen(false)}
        gameDetail={gameDetail}
        needCountToken={needCountToken}
      />
    </div>
  );
};

export default GamePlay;
