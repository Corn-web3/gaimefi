import LoadingImg from "@/assets/icon/loading_1.png";

export const Loading = ({ text = "Loading...", showText = true }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img src={LoadingImg} className="w-[24px] h-[24px] animate-spin"></img>
      {showText && <div className="text-[#fff] opacity-[0.6] mt-[16px] text-[12px] leading-[19px]">{text}</div>}
    </div>
  );
};
