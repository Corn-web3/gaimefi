import { Loading } from "@/components/Loading";
import ModelPopup from "@/components/ModelPopup";
import NoData from "@/components/NoData";
import { Pagination } from "@/components/Pagination";
import CustomTextarea from "@/components/Textarea";
import { getComments } from "@/services/comments";
import { useEvent } from "@/utils/ImEvent";
import { calculateCreateTime } from "@/views/Coin/TokenTradeView";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Comment type definition
type Comment = {
  id: string;
  username: string;
  content: string;
  createdAt: string | number;
  replies?: Comment[];
  isCreator?: number;
  avatarUrl?: string;
};

// Single comment component
const CommentItem = ({
  comment,
  onReply,
  level = 0,
}: {
  comment: Comment;
  onReply: (parentId: string, content: string) => void;
  level?: number;
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReplyInput(false);
    }
  };

  return (
    <div className={`${level > 0 ? "ml-[20px]" : " "} mt-[24px]`}>
      <div className="flex items-start gap-3 pb-[16px] border-b-[1px] border-solid border-[#272c2c]">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <img src={comment?.avatarUrl} className="w-[30px] h-[30px] "></img>
            <span className="font-medium text-[#09fff0] text-[14px]">
              {comment?.username?.slice(0, 4) +
                "..." +
                comment?.username?.slice(-4)}
            </span>
            {comment?.isCreator != 0 && (
              <span className="text-[#09fff0] text-[12px] rounded-[6px]  px-[10px] h-[23px] bg-[#0f2c2b] font-thin flex items-center justify-center">
                Creator
              </span>
            )}
            <span className="text-[#767A7A] text-sm">
              {calculateCreateTime(comment?.createdAt as number)}
            </span>
          </div>
          <p
            className="mt-[8px] text-[12px] text-[#9fa1a1]"
            style={{ wordBreak: "break-word" }}
          >
            {comment.content}
          </p>
        </div>
        {/* <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="w-[51px] h-[30px] rounded-[8px] text-[12px] bg-[#0f1515] text-[#fff] hover:bg-[#323737] border-[1px] border-solid border-[#404444]"
        >
          Reply
        </button> */}

        <ModelPopup
          open={showReplyInput}
          onClose={() => setShowReplyInput(false)}
          title="Reply"
          onClickSubmit={handleReply}
        >
          <div className="w-full h-[100px]">
            <CustomTextarea
              className="!w-full !h-[100px]"
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            ></CustomTextarea>
          </div>
        </ModelPopup>
      </div>

      {comment?.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onReply={onReply}
          level={level + 1}
        />
      ))}
    </div>
  );
};

// Comment list component
export const CommentList = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState<Comment[]>([
    // ... Other comments
  ]);
  const [total, setTotal] = useState(0);
  const getCommentsList = async (canLoading = true) => {
    if (canLoading) {
      setLoading(true);
    }
    const res = await getComments({
      address: id,
      page: page,
      pageSize: 4,
    });

    setComments(res?.data);
    setTotal(res?.extra?.count);
    setLoading(false);
  };

  useEffect(() => {
    getCommentsList();
  }, [page]);

  useEvent("refreshComments", getCommentsList);

  const handleReply = (parentId: string, content: string) => {
    setComments((prevComments) => {
      const newComments = [...prevComments];
      const addReply = (comments: Comment[]) => {
        for (let comment of comments) {
          if (comment.id === parentId) {
            comment.replies = [
              ...(comment.replies || []),
              {
                id: Date.now().toString(),
                username: "User", // This can be replaced with the actual username
                content,
                createdAt: "just now",
                replies: [],
              },
            ];
            return true;
          }
          if (comment.replies?.length) {
            if (addReply(comment.replies)) return true;
          }
        }
        return false;
      };
      addReply(newComments);
      return newComments;
    });
  };

  return (
    <div className="w-full">
      <div className="h-[450px] overflow-y-auto hide-scrollbar">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <Loading></Loading>
          </div>
        )}
        {!loading &&
          (comments?.length > 0 ? (
            <>
              {comments?.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                />
              ))}
            </>
          ) : (
            <>
              <NoData></NoData>
            </>
          ))}
      </div>

      {comments?.length > 0 && (
        <div className="flex justify-center items-center mt-[24px]">
          <Pagination
            count={Math.ceil(total / 4)}
            onChange={(page) => setPage(page)}
            showText
          ></Pagination>
        </div>
      )}
    </div>
  );
};
