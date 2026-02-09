// import MarkdownRenderer from "../MarkdownRenderer";
// components/MarkdownRenderer.tsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import GlowButton from "@/components/GlowButton";
// Stream response component
const StreamResponse: React.FC<{
  content: string;
  onClickApply: (content: string) => void;
  onTypingComplete?: () => void;
  onTyping?: () => void;
}> = ({ content, onClickApply, onTypingComplete, onTyping }) => {
  return (
    <div className="stream-response">
      <MarkdownRenderer
        content={content}
        onClickApply={() => {
          onClickApply(content);
        }}
        onTypingComplete={onTypingComplete}
        onTyping={onTyping}
      />
      {/* <span className="inline-block w-[2px] h-[16px] bg-gray-400 animate-pulse ml-1" /> */}
    </div>
  );
};

export default StreamResponse;

interface MarkdownRendererProps {
  content: string;
  className?: string;
  onClickApply: () => void;
  typingSpeed?: number; // Typing speed (ms)
  onTypingComplete?: () => void;
  onTyping?: () => void;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
  onClickApply,
  typingSpeed = 2, // Default typing speed
  onTypingComplete,
  onTyping,
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Typing effect
  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
        onTyping?.();
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else if (!isTypingComplete) {
      // When typing is complete but event not triggered yet
      const completeTimer = setTimeout(() => {
        setIsTypingComplete(true);
        onTypingComplete?.(); // Call completion callback
      }, 1000);

      return () => clearTimeout(completeTimer);
    }
  }, [currentIndex, content, typingSpeed, isTypingComplete, onTypingComplete]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  // Custom cursor component
  const Cursor = () => (
    <span
      className={`inline-block w-[2px] h-[16px] ml-[2px] align-middle ${
        showCursor ? "opacity-100" : "opacity-0"
      } transition-opacity duration-100`}
      style={{
        backgroundColor: "#d1d3d3",
        animation: "blink 1s step-end infinite",
      }}
    />
  );

  return (
    <div className={`prose prose-slate w-full ${className} relative`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({
            className,
            children,
            ...props
          }: {
            className?: string | undefined;
            children?: React.ReactNode;
            [key: string]: any;
          }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = props.inline;
            return !isInline && match ? (
              <div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: "0.5rem",
                    width: "100%",
                    background: "#1E1E1E",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    tabSize: "2",
                  }}
                  codeTagProps={{
                    style: {
                      fontSize: "14px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                    },
                  }}
                  className="rounded-md w-full"
                  {...props}
                >
                  {String(children).replace(/\n$/, "").replace(/    /g, "  ")}
                </SyntaxHighlighter>
                {isTypingComplete && (
                  <div className="flex items-center gap-2 mt-[8px]">
                    <GlowButton
                      className="!w-[59px] !h-[30px] !rounded-[8px] !text-[12px] !font-semibold !text-[#000]"
                      onClick={onClickApply}
                    >
                      Apply
                    </GlowButton>
                  </div>
                )}
              </div>
            ) : (
              <code
                className={`${className} bg-gray-100 rounded-md px-1 py-0.5`}
                {...props}
              >
                {children}
              </code>
            );
          },
          p: ({ node, children, ...props }) => (
            <p
              className="my-[2px] text-[#d1d3d3] text-[16px] relative"
              {...props}
            >
              {children}
              {/* {!isTypingComplete && <Cursor />} */}
            </p>
          ),
          li: ({ node, ...props }) => (
            <li
              className="my-[2px] text-[#d1d3d3] text-[16px] relative"
              {...props}
            >
              {props.children}
              {/* {!isTypingComplete && <Cursor />} */}
            </li>
          ),
        }}
      >
        {displayedContent}
      </ReactMarkdown>
      {!isTypingComplete && <Cursor />}
    </div>
  );
};
