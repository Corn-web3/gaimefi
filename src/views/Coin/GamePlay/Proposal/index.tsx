import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { Loading } from "@/components/Loading";
import GameModal from "@/components/Modal/GameModal";
import NoData from "@/components/NoData";
import { Pagination } from "@/components/Pagination";
import { toast } from "@/components/Toast";
import { Underline } from "@/components/Underline";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  createProposal,
  deleteProposal,
  getProposal,
  voteProposal,
} from "@/services/proposal";
import { classNames } from "@/utils/classNames";
import { imEvent, useEvent } from "@/utils/ImEvent";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import successIcon from "@/assets/icon/success_icon.png";
import { useWallet } from "@/utils/useWallet";
import { calculateCreateTime2 } from "../../TokenTradeView";
import { VoteNeedToken } from "@/components/NeedToken/VoteNeedToken";
import { useCustomToken } from "@/contract/useCustomToken";
import { formatEther } from "ethers";
import { useStore } from "@/stores";
import { trackEvent } from "@/utils/trackEvent";

const CountdownBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-[#101515] text-[12px] bg-[#09FFF0] rounded-[5px] h-[26px] px-[6px] flex items-center w-fit">
      {children}
    </div>
  );
};

const Countdown = ({
  endTime,
  onEnd,
}: {
  endTime: number;
  onEnd?: () => void;
}) => {
  const targetTime = dayjs(endTime);
  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    let timer: any = null;
    // Timer function
    const calculateTimeRemaining = () => {
      const now = dayjs();
      const diff = targetTime.diff(now);

      // If countdown ends
      if (diff <= 0) {
        onEnd?.();
        setRemainingTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        clearInterval(timer);
        return;
      }

      // Use duration to calculate remaining time
      const duration = dayjs.duration(diff);

      setRemainingTime({
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });
    };

    // Execute immediately once
    calculateTimeRemaining();

    // Update every second
    timer = setInterval(calculateTimeRemaining, 1000);

    // Clear timer
    return () => clearInterval(timer);
  }, [endTime]);
  return (
    <div className="flex items-center gap-[8px] text-[#09FFF0]">
      <CountdownBox>{remainingTime.days}D</CountdownBox>:
      <CountdownBox>{remainingTime.hours}H</CountdownBox>:
      <CountdownBox>{remainingTime.minutes}M</CountdownBox>
    </div>
  );
};

const Content = ({ description }: { description: string }) => {
  const ref = useRef<any>(null);
  const [readMore, setReadMore] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setIsOverflow(ref.current.scrollHeight > ref.current.clientHeight);
    }
  }, [ref]);
  return (
    <div>
      <div
        ref={ref}
        className={classNames(
          !readMore ? "multi-line-ellipsis" : "",
          "break-all",
          "opacity-[0.6] text-[#fff]"
        )}
      >
        {description}
      </div>
      {isOverflow && (
        <div
          className="text-[#fff] text-[12px] mt-[8px] opacity-[0.8] cursor-pointer"
          onClick={() => setReadMore(true)}
        >
          Read More
        </div>
      )}
    </div>
  );
};

const VoteButton = ({ item, onVoteSuccess, voted, gameDetail }) => {
  // const disabled = item?.isVoted === 1;
  const { id } = useParams();
  const { balance } = useCustomToken({
    tokenAddress: id,
  });

  const [needCountToken] = useState(420000);
  const [open, setOpen] = useState(false);
  const isVote = item?.isVoted === 1;
  const disabled = voted;
  const onVote = () => {
    const balanceEth = formatEther(balance);

    if (Number(balanceEth) < needCountToken) {
      setOpen(true);
      return;
    }

    voteProposal({
      proposalId: item?.id,
    }).then((res) => {
      toast.success("Vote successfully");
      onVoteSuccess();
    });
  };
  return (
    <>
      <Button
        variant="outlined"
        className={classNames(
          "h-[30px] !text-[#09FFF0] !text-[12px] !border-[#FFFFFF33] !rounded-[8px] flex items-center",
          disabled && !isVote ? "opacity-[0.4]" : ""
        )}
        color="#FFFFFF33"
        disabled={disabled}
        onClick={onVote}
      >
        {isVote && (
          <img src={successIcon} className="w-[16px] h-[16px] mr-[4px]"></img>
        )}
        {item?.voteCount} Vote
      </Button>
      <VoteNeedToken
        open={open}
        onClose={() => setOpen(false)}
        gameDetail={gameDetail}
        needCountToken={needCountToken}
      ></VoteNeedToken>
    </>
  );
};

const ProposalItem = ({ item, onVoteSuccess, voted, gameDetail }) => {
  const { address } = useWallet();
  const isSelf = item?.user?.address.toLowerCase() === address?.toLowerCase();
  const { id } = useParams();
  const { balance } = useCustomToken({
    tokenAddress: id,
  });
  const [needCountToken, setNeedCountToken] = useState(420000);
  const [voteNeedTokenOpen, setVoteNeedTokenOpen] = useState(false);
  const onResubmit = async () => {
    const balanceEth = formatEther(balance);
    if (
      Number(balanceEth) < needCountToken &&
      gameDetail?.user?.address.toLowerCase() != address?.toLowerCase()
    ) {
      setVoteNeedTokenOpen(true);
    } else {
      deleteProposal(item?.id);
      await createProposal({
        name: item?.name,
        description: item?.description,
        chatRecordId: item?.chatRecordId,
      });
      toast.success("Resubmit successfully");
      imEvent.trigger("refresh-proposal-list");
    }
  };
  const onDelete = async () => {
    await deleteProposal(item?.id);
    toast.success("Delete successfully");
    imEvent.trigger("refresh-proposal-list");
  };

  const { user } = useStore();

  const onClickPlay = () => {
    if (!user?.address) {
      imEvent.trigger("login");

      return;
    }
    imEvent.trigger("proposal-play", item);
  };

  return (
    <div className="w-full">
      <Underline></Underline>
      <div className="flex justify-between mt-[16px] items-start">
        <div className="flex flex-col max-w-[650px] w-full">
          <div className="text-[#fff] text-[14px] font-medium mb-[8px] truncate flex items-center justify-between w-full">
            <div>{item?.name}</div>
            <div className="text-[12px] font-normal text-[#fff] opacity-[0.6] flex items-center gap-[10px]">
              <div>{dayjs(item?.createdAt).format("YYYY.MM.DD")}</div>
              <div>{calculateCreateTime2(item?.createdAt)}</div>
            </div>
          </div>
          <Content description={item?.description}></Content>
        </div>

        <div className="flex items-center gap-[8px]">
          {item?.proposalStatus === 0 && (
            <>
              <VoteButton
                item={item}
                voted={voted}
                onVoteSuccess={onVoteSuccess}
                gameDetail={gameDetail}
              ></VoteButton>
            </>
          )}
          {item?.proposalStatus === 0 && (
            <Button
              variant="outlined"
              className="h-[30px] !text-[#fff] !text-[12px] !border-[#FFFFFF33] !rounded-[8px]"
              color="#FFFFFF33"
              onClick={onClickPlay}
            >
              Play
            </Button>
          )}
          {isSelf && item?.proposalStatus === -1 && (
            <Button
              variant="outlined"
              className="h-[30px] !text-[#fff] !text-[12px] !border-[#FFFFFF33] !rounded-[8px]"
              color="#FFFFFF33"
              onClick={onResubmit}
            >
              Resubmit
            </Button>
          )}

          {isSelf && item?.proposalStatus === -1 && (
            <Button
              variant="outlined"
              className="h-[30px] !text-[#FF227F] !text-[12px] !border-[#FFFFFF33] !rounded-[8px]"
              color="#FF227F"
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <VoteNeedToken
        open={voteNeedTokenOpen}
        onClose={() => setVoteNeedTokenOpen(false)}
        gameDetail={gameDetail}
        needCountToken={needCountToken}
      ></VoteNeedToken>
    </div>
  );
};

const ProposalList = ({
  params,
  setParams,
  gameDetail,
}: {
  params: any;
  setParams: any;
  gameDetail: any;
}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [proposalList, setProposalList] = useState([]);
  const [total, setTotal] = useState(0);
  const [voted, setVoted] = useState(false);

  const getProposalList = async () => {
    setLoading(true);
    const res = await getProposal(params);
    setProposalList(res?.data);
    setTotal(res?.extra?.count);
    setVoted(!!res?.extra?.votedProposalIds?.[0]);
    setLoading(false);
  };

  useEvent("refresh-proposal-list", getProposalList, [params]);

  useEffect(() => {
    getProposalList();
  }, [params]);
  return (
    <div className="flex flex-col gap-[24px] overflow-y-auto flex-1 items-center w-full">
      <div className="h-[550px] overflow-y-auto hide-scrollbar w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loading></Loading>
          </div>
        ) : proposalList?.length > 0 ? (
          proposalList?.map((item: any, index) => (
            <ProposalItem
              voted={voted}
              onVoteSuccess={getProposalList}
              item={item}
              key={index}
              gameDetail={gameDetail}
            ></ProposalItem>
          ))
        ) : (
          <div className="text-[#fff] h-full flex items-center justify-center text-[14px]">
            <NoData></NoData>
          </div>
        )}
      </div>

      {total > 0 && (
        <Pagination
          page={params?.page}
          count={Math.ceil(total / 4)}
          onChange={(page) => setParams({ ...params, page })}
          showText
        ></Pagination>
      )}
    </div>
  );
};

const Tags = ({
  activeTag,
  setActiveTag,
  params,
  setParams,
}: {
  activeTag: any;
  setActiveTag: any;
  params: any;
  setParams: any;
}) => {
  return (
    <div className="flex items-center gap-[16px] mb-[16px]">
      <div
        className={classNames(
          " text-[14px] h-[38px]  px-[16px] py-[8px] leading-[22px] cursor-pointer font-medium justify-center rounded-[12px] text-[#FFFFFFCC] flex items-center bg-[#FFFFFF0D]",
          activeTag === 0 ? "!bg-[#09FFF01A] !text-[#09FFF0]" : ""
        )}
        onClick={() => {
          setActiveTag(0);
          setParams({ ...params, proposalStatus: 0, myProposal: 0, page: 1 });
        }}
      >
        Ongoing
      </div>
      <div
        className={classNames(
          " text-[14px] h-[38px]  px-[16px] py-[8px] leading-[22px] cursor-pointer font-medium justify-center rounded-[12px] text-[#FFFFFFCC] flex items-center bg-[#FFFFFF0D]",
          activeTag === 1 ? "!bg-[#09FFF01A] !text-[#09FFF0]" : ""
        )}
        onClick={() => {
          setActiveTag(1);
          setParams({ ...params, proposalStatus: 1, myProposal: 0, page: 1 });
        }}
      >
        Approved
      </div>
      <div
        className={classNames(
          " text-[14px] h-[38px]  px-[16px] py-[8px] leading-[22px] cursor-pointer font-medium justify-center rounded-[12px] text-[#FFFFFFCC] flex items-center bg-[#FFFFFF0D]",
          activeTag === 2 ? "!bg-[#09FFF01A] !text-[#09FFF0]" : ""
        )}
        onClick={() => {
          setActiveTag(2);
          const newParams = { ...params, myProposal: 1, page: 1 };
          delete newParams.proposalStatus;
          setParams(newParams);
        }}
      >
        My proposal
      </div>
    </div>
  );
};

const Proposal = ({ gameDetail }: { gameDetail: any }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState(0);
  const [params, setParams] = useState({
    proposalStatus: 0,
    myProposal: 0,
    address: id,
    page: 1,
    pageSize: 4,
  });
  const [open, setOpen] = useState(false);
  const [currentProposal, setCurrentProposal] = useState<any>(null);
  useEvent("proposal-play", (data) => {
    trackEvent("proposal_play", {
      game_id: data?.id,
      game_name: data?.name,
    });
    setOpen(true);
    setCurrentProposal(data);
  });
  const [endTime, setEndTime] = useState(new Date().getTime() + 5000);

  const { user } = useStore();
  const { balance } = useCustomToken({
    tokenAddress: id,
  });
  const [needCountToken, setNeedCountToken] = useState(420000);
  const { address } = useWallet();
  const [voteNeedTokenOpen, setVoteNeedTokenOpen] = useState(false);
  const onClickProposal = () => {
    if (!user?.address) {
      imEvent.trigger("login");
      return;
    }
    const balanceEth = formatEther(balance);
    if (
      Number(balanceEth) < needCountToken &&
      gameDetail?.user?.address.toLowerCase() != address?.toLowerCase()
    ) {
      setVoteNeedTokenOpen(true);
    } else {
      navigate(`/game-detail/${id}`);
    }
  };
  return (
    <div className="h-[668px] flex flex-col">
      <Tags
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        params={params}
        setParams={setParams}
      ></Tags>
      {activeTag === 0 && (
        <div className="flex items-center justify-between h-[58px]">
          <div className="flex items-center gap-[8px]">
            <div className="text-[#fff] text-[12px]">Left Time</div>
            <Countdown
              endTime={gameDetail?.nextProposalPassTime}
              // endTime={endTime}
              onEnd={() => {
                setTimeout(() => {
                  imEvent.trigger("refresh-game-detail");
                }, 5000);
              }}
            ></Countdown>
          </div>
          {gameDetail?.stage == "outside" && (
            <div>
              <Link onClick={onClickProposal}> Submit Proposal</Link>
            </div>
          )}
        </div>
      )}
      <ProposalList
        params={params}
        setParams={setParams}
        gameDetail={gameDetail}
      ></ProposalList>
      <GameModal
        title={currentProposal?.name}
        code={currentProposal?.code}
        open={open}
        onClose={() => {
          setOpen(false);
          setCurrentProposal(null);
        }}
      ></GameModal>

      <VoteNeedToken
        open={voteNeedTokenOpen}
        onClose={() => setVoteNeedTokenOpen(false)}
        gameDetail={gameDetail}
        needCountToken={needCountToken}
      ></VoteNeedToken>
    </div>
  );
};

export default Proposal;
