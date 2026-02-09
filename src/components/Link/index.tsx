import RightArrowImg from "@/assets/forgeGame/right-arrow.png";
export const Link = ({ children ,onClick}: { children: React.ReactNode ,onClick?:()=>void}) => {
  return (
    <a className="text-[#09FFF0] flex items-center cursor-pointer text-[12px]" onClick={onClick}>
      {children} <img src={RightArrowImg} className="w-[16px] h-[16px]"></img>
    </a>
  );
};
