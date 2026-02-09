import { classNames } from "@/utils/classNames";

export const Underline = ({ className }: any) => {
  return <div className={classNames("w-full h-[1px] bg-[#FFFFFF1A]", className)}></div>;
};


export const UnderLineText = ({ className ,children}: any) => {
  return <div className={classNames(" flex items-center w-full",className)}>
    
    <Underline></Underline>
    <div className="mx-[10px]">{children}</div>
    <Underline></Underline>
  </div>
};
