import spinIcon from "@/assets/fun/spinIcon.png";

const ForgeButton = ({
  isSpin = false,
  className,
  onClick,
  children,
  border = "1px solid #09FFF0",
  disabled = false,
  style,
  ref,
  background = "linear-gradient(0deg, #09FFF0, #09FFF0),radial-gradient(126.12% 111.11% at 50% -11.11%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 57.04%)",
  boxShadow = "0px 18px 52px -13px #09FFF099, 0px 0px 8px 2px #09FFF04F",
  borderImageSource = "linear-gradient(0deg, rgba(9, 255, 240, 0.15), rgba(9, 255, 240, 0.15)),radial-gradient(107.05% 92.73% at 50.34% 50.91%, rgba(9, 255, 240, 0.5) 0%, rgba(9, 255, 240, 0) 100%)",
}: {
  isSpin?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  background?: string;
  boxShadow?: string;
  borderImageSource?: string;
  border?: string;
  style?: React.CSSProperties;
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      ref={ref}
      onClick={disabled ? () => {} : onClick}
      className={`w-[240px] h-[56px]  rounded-[12px] flex cursor-pointer items-center text-[18px] justify-center font-bold   transition-all duration-300 relative
        overflow-hidden
                  ${disabled ? "buttonDisabled" : ""}
                   hover:shadow-[0_0_25px_rgba(64,231,209,0.8)]
                  ${className}`}
      style={{
        ...style,
        // border: border,
        background: background,
        boxShadow: boxShadow,
        borderImageSource: borderImageSource,
      }}
    >
      {isSpin ? (
        <div className="animate-spin">
          <img src={spinIcon} className="w-[24px] h-[24px]" alt="" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ForgeButton;
