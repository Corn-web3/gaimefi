interface CustomButtonProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const CustomButton = ({
  className,
  children = "   Start for Free",
  onClick,
  style,
}: CustomButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={`w-[231px] h-[68px] text-[#fff] text-[24px] flex items-center justify-center font-semibold rounded-[34px]
         bg-[#4a23cc]  hover:bg-[#fff] cursor-pointer hover:text-[#4a23cc] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default CustomButton;
