import MarkdownRenderer from "../MarkdownRenderer";
import StreamResponse from "../StreamResponse";
import blackLogo from "@/assets/fun/blacklogo.png";

interface MessageProps {
  text: string;
  isResponse?: boolean;
  image?: string;
  onClickApply: (content: string) => void;
  isStreaming?: boolean;
  onTypingComplete?: () => void;
  onTyping?: () => void;
  showFixButton?: boolean;
}

const Message: React.FC<MessageProps> = ({
  text,
  isResponse = false,
  image,
  onClickApply,
  isStreaming = false,
  onTypingComplete,
  onTyping,
  showFixButton = false,
}) => {
  return (
    <div className="flex flex-col gap-2 mb-[16px]">
      <div
        className={`flex items-start gap-2 ${
          isResponse ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {isResponse && (
          <div className="w-8 h-8 bg-cyan-400 rounded-full flex-shrink-0 flex items-center justify-center">
            <img src={blackLogo} className="w-[80%]" alt="" />
          </div>
        )}

        {isStreaming ? (
          // Use stream response component
          <StreamResponse
            onTyping={onTyping}
            onTypingComplete={onTypingComplete}
            content={text}
            onClickApply={onClickApply}
          />
        ) : (
          <>
            {isResponse ? (
              <MarkdownRenderer
                showFixButton={showFixButton}
                onClickApply={() => {
                  onClickApply(text);
                }}
                content={text}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: text }}
                style={{
                  borderRadius: "12px 0 12px 12px",
                }}
                className={`px-4 py-2 max-w-[80%] bg-teal-900 text-white   break-words overflow-hidden`}
              ></div>
            )}
          </>
        )}
      </div>

      {image && isResponse && (
        <div
          className="flex items-start gap-2"
          style={{
            borderRadius: "0 12px 12px 12px",
          }}
        >
          <div className="w-8 h-8 flex-shrink-0" />{" "}
          {/* Empty placeholder to keep image indentation aligned */}
          <div className="max-w-[80%]">
            <img src={image} alt="Response content" className="rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
