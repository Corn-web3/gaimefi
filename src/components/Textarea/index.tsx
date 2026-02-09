interface IProps {
  className?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showCount?: boolean;
  maxLength?: number;
}
const CustomTextarea = ({
  className,
  placeholder = "Write your comments...",
  value,
  onChange,
  showCount = true,
  maxLength = 300,
}: IProps) => {
  return (
    <div className={`relative `}>
      <textarea
        maxLength={maxLength}
        className={`w-full h-[112px] rounded-[12px] border-[1px] border-soild border-[#323737]
       bg-[#1c2121] px-[16px] py-[12px] text-[#fff] placeholder:text-[#767a7a] placeholder:text-[14px] placeholder:font-thin resize-none ${className} no-scrollbar `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></textarea>
      {showCount && (
        <div className="absolute bottom-[14px] left-[16px] text-[#767a7a] text-[14px]">
          {value.length}/300
        </div>
      )}
    </div>
  );
};

export default CustomTextarea;
