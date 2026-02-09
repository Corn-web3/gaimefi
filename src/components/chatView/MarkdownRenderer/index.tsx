// components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import GlowButton from "@/components/GlowButton";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  onClickApply: () => void;
  showFixButton?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
  onClickApply,
  showFixButton = false,
}) => {
  return (
    <div className={`prose prose-slate w-full ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code block rendering
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
                    padding: "0.5rem", // Decrease padding
                    width: "100%",
                    background: "#1E1E1E",
                    whiteSpace: "pre-wrap", // Add this line
                    wordWrap: "break-word", // Add this line
                    tabSize: "2", // Control indentation size
                  }}
                  codeTagProps={{
                    style: {
                      fontSize: "14px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap", // Add this line
                      wordBreak: "break-all", // Add this line
                    },
                  }}
                  className="rounded-md w-full"
                  {...props}
                >
                  {String(children).replace(/\n$/, "").replace(/    /g, "  ")}{" "}
                  // Replace 4 spaces with 2 spaces
                </SyntaxHighlighter>
                <div className="flex items-center gap-2 mt-[8px]">
                  <GlowButton
                    className="!w-[59px] !h-[30px] !rounded-[8px] !text-[12px] !font-semibold !text-[#000]"
                    onClick={onClickApply}
                  >
                    {showFixButton ? "Fix" : "Apply"}
                  </GlowButton>
                </div>
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
          // Paragraph style
          p: ({ node, children, ...props }) => (
            <p className="my-[2px] text-[#d1d3d3] text-[16px]" {...props}>
              {children}
            </p>
          ),
          li: ({ node, ...props }) => (
            <li className="my-[2px] text-[#d1d3d3] text-[16px]" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="w-[100px] h-[100px]" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
