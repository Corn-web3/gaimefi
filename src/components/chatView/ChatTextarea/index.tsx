import GlowButton from "@/components/GlowButton";
import { ArrowUp } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = "Ask anything from here",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto adjust height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 100)}px`;
    }
  }, [value]);

  return (
    <div className="relative flex items-center w-[443px]">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder={placeholder}
        style={{
          border: "1.5px solid #323737",
          padding: "11px 10px",
          paddingRight: "50px",
        }}
        className="w-[443px] min-h-[42px] max-h-[50px] rounded-[12px] text-[14px] bg-[#1c2121] border border-[#323737] resize-none  outline-none text-white hide-scrollbar 
        pr-[50px] "
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <GlowButton
          onClick={onSend}
          className="!w-[34px] !h-[34px] rounded-[12px]"
        >
          <ArrowUp className="text-[#000606]" />
        </GlowButton>
      </div>
    </div>
  );
};

export default ChatInput;
