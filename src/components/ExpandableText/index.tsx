import React, { useState, useRef, useEffect } from "react";

interface ExpandableTextProps {
  text: string;
  maxHeight?: number; // Max height, default can be set to e.g. 60px
}

const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  maxHeight = 50,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if content height exceeds max height
    if (textRef.current) {
      const isOverflowing = textRef.current.scrollHeight > maxHeight;
      setShowReadMore(isOverflowing);
    }
  }, [text, maxHeight]);

  return (
    <div className="w-full max-w-[880px] text-[#707373] mt-[24px] break-words">
      <div
        ref={textRef}
        style={{
          maxHeight: isExpanded ? "none" : `${maxHeight}px`,
          overflow: "hidden",
          transition: "max-height 0.3s ease-out",
        }}
      >
        {text}
      </div>
      {showReadMore && (
        <div
          className="text-[#cfd0d0] text-[12px] cursor-pointer hover:text-[#a0a1a1]"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Read more"}
        </div>
      )}
    </div>
  );
};
export default ExpandableText;
