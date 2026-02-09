import React, { InputHTMLAttributes } from "react";
import { TextField as MuiTextField } from "@mui/material";
import { Search, X } from "lucide-react";
import { classNames } from "@/utils/classNames";
import { isNumber } from "@/utils/formatNumber";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
  showClear?: boolean;
  value?: string;
  type?: string;
  onChange?: (value: any) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  min?: any;
  autoFocus?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search for tokens",
  className,
  icon,
  showIcon = true,
  showClear,
  value,
  onChange = () => {},
  onKeyDown,
  onClear,
  min,
  type = "text",
  autoFocus = false,
  ...props
}) => {
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (type === "number") {
      if (value === "" || /^\d*\.?\d{0,6}$/.test(val)) {
        // Convert to number to verify if it is greater than 0
        const num = Number(val);
        if (val === "" || (num > 0 && !isNaN(num))) {
          onChange(val);
        }
      } else {
        e.target.value = value as string;
      }
      return;
    } else {
      onChange?.(val);
    }
  };
  return (
    <div
      className={`relative w-full max-w-[500px]  border-[1px] border-[#2c3030] rounded-[12px] h-[40px]  flex items-center ${className}`}
    >
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={onChangeInput}
        type={"text"}
        className={classNames(
          ` w-full 
        h-full 
        pl-10 
        pr-4  
        bg-[#141919] 
        rounded-[12px] 
        flex
        items-center
        setFontRobotoMono 
        text-white 
        placeholder-gray-500 
        text-[14px]
        placeholder:text-[14px]
        focus:outline-none 
        focus:ring-0
                  `,
          !showIcon && "!pl-4"
        )}
        placeholder={placeholder}
        {...props}
        onKeyDown={onKeyDown}
      />
      {showIcon &&
        (icon ? (
          icon
        ) : (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666a6a] w-[16px] h-[18px]" />
        ))}
      {showClear && value && (
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666a6a] cursor-pointer"
          onClick={() => {
            onClear?.();
          }}
        >
          <X className="w-[16px] text-[#fff]" />
        </div>
      )}
    </div>
  );
};

export const TextField = ({
  height = "42px",
  errorMessage = "",
  startAdornment,
  endAdornment,
  max,
  onChange,
  toUppercase = false,
  maxLength,
  minLength,
  showCount = false,
  type,
  sx,
  rootSx,
  inputSx,
  ...props
}: any) => {
  const _onChange = (e: any) => {
    let value = e.target.value;
    if (type === "number") {
      if (!isNumber(value)) {
        return;
      }
      if (!/^\d*\.?\d{0,6}$/.test(value)) {
        return;
      }
    }
    if (max) {
      if (Number(e.target.value) > max) {
        e.target.value = max;
        value = max;
      }
    }
    if (toUppercase) {
      if (!/^[a-zA-Z]+$/.test(value) && value.length > 0) {
        return;
      }

      e.target.value = value.toUpperCase();
    }
    onChange?.(e);
  };
  return (
    <div>
      <MuiTextField
        onChange={_onChange}
        variant="outlined"
        {...props}
        helperText={
          showCount && (
            <div className="text-[12px] text-[#cccc] absolute right-[6px] bottom-[-22px]">
              {props.value?.length}/{maxLength}
            </div>
          )
        }
        fullWidth
        inputProps={{
          autoComplete: "off",
          maxLength,
        }}
        slotProps={{
          input: {
            ...(startAdornment && { startAdornment: startAdornment }),
            ...(endAdornment && { endAdornment: endAdornment }),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root input": {
            height: "100%",
            padding: startAdornment ? "0 16px 0 2px" : "0 16px",
            ...inputSx,
          },
          "& .MuiOutlinedInput-root": {
            height: height,
            fontSize: "14px",
            color: "white",
            fontFamily: "RobotoMono",
            borderRadius: "12px", // Custom border radius
            backgroundColor: "#FFFFFF0D",
            "& fieldset": {
              borderColor: "#FFFFFF1A", // Default border color
            },
            "&:hover fieldset": {
              borderColor: "#09FFF0", // Border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#09FFF0", // Border color on focus
            },
            ...rootSx,
          },
          ...sx,
        }}
      />
    </div>
  );
};

export const TlTextField = ({
  height = "30px",
  errorMessage = "",
  startAdornment,
  endAdornment,
  max,
  onChange,
  toUppercase = false,
  maxLength,
  minLength,
  showCount = false,
  type,
  sx,
  rootSx,
  inputSx,
  ...props
}: any) => {
  const _onChange = (e: any) => {
    let value = e.target.value;
    if (type === "number") {
      if (!isNumber(value)) {
        return;
      }
      if (!/^\d*\.?\d{0,6}$/.test(value)) {
        return;
      }
    }
    if (max) {
      if (Number(e.target.value) > max) {
        e.target.value = max;
        value = max;
      }
    }
    if (toUppercase) {
      if (!/^[a-zA-Z]+$/.test(value) && value.length > 0) {
        return;
      }

      e.target.value = value.toUpperCase();
    }
    onChange?.(e);
  };
  return (
    <div>
      <MuiTextField
        onChange={_onChange}
        variant="outlined"
        {...props}
        helperText={
          showCount && (
            <div className="text-[12px] text-[#cccc] absolute right-[6px] bottom-[-22px]">
              {props.value?.length}/{maxLength}
            </div>
          )
        }
        fullWidth
        inputProps={{
          autoComplete: "off",
          maxLength,
        }}
        slotProps={{
          input: {
            ...(startAdornment && { startAdornment: startAdornment }),
            ...(endAdornment && { endAdornment: endAdornment }),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root input": {
            height: "100%",
            padding: startAdornment ? "0 12px 0 2px" : "0 12px",
            ...inputSx,
          },
          "& .MuiOutlinedInput-root": {
            height: height,
            fontSize: "12px",
            color: "white",
            fontFamily: "RobotoMono",
            borderRadius: "4px", // Custom border radius
            backgroundColor: "#FFFFFF0D",
            "& fieldset": {
              borderColor: "#ccc", // Default border color
            },
            "&:hover fieldset": {
              borderColor: "#09FFF0", // Border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#09FFF0", // Border color on focus
            },
            ...rootSx,
          },
          ...sx,
        }}
      />
    </div>
  );
};

export default SearchInput;
