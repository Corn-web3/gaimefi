import { useState } from "react";
import ArrowDownImg from "@/assets/arrow/arrow-down.png";
import { FormItem } from "@/components/Form/FormItem";
export const MoreOptions = ({ getConfigItem }) => {
  const [showMore, setShowMore] = useState(true);
  return (
    <>
      {!showMore && (
        <div
          className="flex items-center cursor-pointer mb-[24px] mt-[18px]"
          onClick={() => setShowMore(true)}
        >
          <div className="text-[14px] text-white mr-[10px]">
            show more options
          </div>
          <img src={ArrowDownImg} className="w-[16px] h-[16px]"></img>
        </div>
      )}
      {showMore && (
        <>
          <div className="flex items-center mb-[24px] mt-[18px]">
            <FormItem
              {...getConfigItem("twitterLink")}
              className="!mr-[12px] !mt-[0] !mb-[0]"
            />
            <FormItem
              {...getConfigItem("telegramLink")}
              className="!mt-[0] !mb-[0]"
            />
          </div>
          <div className="flex items-center mb-[24px]">
            <FormItem
              {...getConfigItem("discordLink")}
              className="!mr-[12px] !mt-[0] !mb-[0]"
            />
            <FormItem
              {...getConfigItem("websiteLink")}
              className="!mt-[0] !mb-[0]"
            />
          </div>
          <div className="text-[12px] text-white mb-[24px]">
            Game's data cannot be changed after creation.
          </div>
        </>
      )}
    </>
  );
};
