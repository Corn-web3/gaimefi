import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  frontText?: string | React.ReactNode;
}

export const CustomSelect: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  className = "",
  frontText = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          border: "1px solid #323737",
        }}
        className={`
          w-full px-[16px] py-[12px]
          bg-[#1c2121] 
          rounded-xl
          flex items-center justify-between
          text-white
          focus:outline-none
          focus:border-[#00DC82]
          transition-colors
          ${className}
        `}
      >
        {frontText}
        <div className="flex items-center">
          <span className="text-[14px] font-thin">{selectedOption?.label}</span>
          <ChevronDown
            className={`
            w-5 h-5 text-[#767a7a] transition-transform duration-200
            ml-[10px]
            ${isOpen ? "transform rotate-180" : ""}
          `}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="
          absolute z-50 w-full mt-2
          bg-[#1c2121] 
          border border-[#323737]
          rounded-xl
          overflow-hidden
          shadow-lg
        "
        >
          <div className="max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2
                  text-left text-[15px]
                  hover:bg-[#323737]
                  transition-colors
                  ${
                    option.value === value
                      ? "text-[#00DC82] bg-[#262929]"
                      : "text-white"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
