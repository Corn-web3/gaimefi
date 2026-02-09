import CustomTextarea from "@/components/Textarea";
import { useState } from "react";
import { CommentList } from "./CommentList";
import ForgeButton from "@/components/GlowButton";
import { createComment } from "@/services/comments";
import { useParams } from "react-router-dom";
import { imEvent } from "@/utils/ImEvent";
import { toast } from "@/components/Toast";

interface CommentsProps {
  gameDetail: any;
}
const Comments = ({ gameDetail }: CommentsProps) => {
  const [comments, setComments] = useState([]);
  const [value, setValue] = useState("");
  const onSubmit = async () => {
    if (!value) {
      toast?.warning("Please enter your comment");
      return;
    }
    const res = await createComment({
      content: value,
      gameId: gameDetail?.gameId,
    });
    setValue("");

    imEvent.trigger("refreshComments", false);
    imEvent.trigger("reflash-counts");
  };
  return (
    <div className="w-full h-full flex flex-col items-center pt-[16px]">
      <div className="w-full h-[112px] relative">
        <CustomTextarea
          placeholder="Write your comments..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <ForgeButton
          className="!absolute bottom-[14px] right-[16px] !w-[88px] !h-[30px] !text-[12px] !rounded-[8px]"
          onClick={onSubmit}
        >
          Submit
        </ForgeButton>
      </div>

      <CommentList />
    </div>
  );
};

export default Comments;
