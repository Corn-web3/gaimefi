import React from "react";
import loadingGif from "@/assets/fun/loading-gif.gif";

const Formation = ({ title = "Generating..." }: { title?: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <img src={loadingGif} className="w-[120px] h-[120px]" alt="" />
      <div className="text-[#fff] text-[18px] font-bold ">{title}</div>
    </div>
  );
};

export default Formation;
