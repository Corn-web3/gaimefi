import { useEffect } from "react";
import leftArrow from "@/assets/fun/leftArrow.png";

interface FeeNotificationProps {
  className?: string;
  children?: React.ReactNode;
}

const FeeNotification = ({ className, children }: FeeNotificationProps) => {
  return (
    <div className={` ${className}`}>
      <div
        className={`w-[185px] min-h-[70px] flex bg-[#191e1e] rounded-[16px] border-[2px] border-[#353d3d] items-center justify-center relative text-[#fff] text-[12px] p-[10px] break-words`}
      >
        <img
          src={leftArrow}
          className="absolute left-[-12px] top-[50%] translate-y-[-50%]"
          alt=""
        />
        {children}
      </div>
    </div>
  );
};

export default FeeNotification;
