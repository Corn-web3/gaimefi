import React from "react";
interface CustomInputProps {
  placeholder: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}
const CustomInput = ({
  placeholder,
  className,
  value,
  onChange,
  type = "text",
}: CustomInputProps) => {
  return (
    <input
      type={type}
      className={`w-full h-full bg-transparent outline-none border-[1px] border-[#6138ec] rounded-[24px] px-[16px] py-[10px] ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default CustomInput;
