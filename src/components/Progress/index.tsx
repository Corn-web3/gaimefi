import React from "react";

interface ProgressProps {
  className?: string;
  progress: number;
}
const Progress = ({ className, progress }: ProgressProps) => {
  return (
    <div
      className={`w-[260px] h-[10px] rounded-[5px] bg-[#374151] ${className} `}
    >
      <div
        className=" bg-[#4a23cc] h-[10px] rounded-[24px]"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default Progress;
