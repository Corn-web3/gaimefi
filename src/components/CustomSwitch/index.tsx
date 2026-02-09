// components/Switch.tsx
import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const CustomSwitch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative 
        w-[48px] 
        h-[24px] 
        rounded-full 
        transition-all 
        duration-300
        cursor-pointer
        ${
          disabled
            ? "bg-[#323737] cursor-not-allowed"
            : checked
            ? "bg-[#09FFF0]"
            : "bg-[#323737] hover:bg-[#404444]"
        }
        ${className}
      `}
    >
      <div
        className={`
          absolute 
          w-[18px] 
          h-[18px] 
          rounded-full 
          bg-white
          shadow-lg
          top-[3px]
          transition-all 
          duration-300
          ${checked ? "left-[27px]" : "left-[3px]"}
          ${disabled && "bg-[#6F7373]"}
        `}
      />
    </div>
  );
};

export default CustomSwitch;
