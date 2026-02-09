import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
// import { Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import GlowButton from "../GlowButton";
import { ArrowUp, Loader } from "lucide-react";
import Message from "./Message";
import { useParams } from "react-router-dom";
import {
  applyGame,
  chatWithAiApi,
  createGameAssetApi,
  getApplyRecord,
  getChatHistoryApi,
} from "@/services/gameService";
import { useStreamChat } from "@/hooks/useStreamChat";
import emitter, { useEventBus } from "@/utils/useEventBus";
import Formation from "../Formation";
import ChatInput from "./ChatTextarea";
import { transferImage } from "@/utils/nftTransferLocalImg";
interface ChatInterfaceProps {
  setCodeData: (data: any) => void;
  gameDetail: any;
  reloadDetail: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  setCodeData,
  gameDetail,
  reloadDetail,
}) => {
  let [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const {
    streamingMessage,
    isChatLoading,
    sendMessageWithChat,
    setStreamingMessage,
  } = useStreamChat({});

  const handleSend = async (test = "") => {
    if (!id || isChatLoading || streamingMessage || (!inputText && !test))
      return;
    // Add user message to history
    setMessages((prev) => [
      ...prev,
      {
        position: "right",
        text: test || inputText,
      },
    ]);

    const content = test || inputText;
    setInputText("");
    await sendMessageWithChat(content, gameDetail?.id);
  };

  useEventBus("addImgToChat", (data) => {
    if (data?.data?.isNft) {
      setInputText(` Please add #${data.data.id}.jpg to the scene`);
    } else {
      setInputText(` Please add @${data.data.id}.jpg to the scene`);
    }
  });

  useEventBus("clearChatHistory", () => {
    setMessages([messages[0]]);
  });

  useEffect(() => {
    if (gameDetail) {
      emitter.emit("applyCode", gameDetail?.code);
      getApplyRecord({
        address: id as string,
      }).then((res) => {
        if (res) {
          emitter.emit("applyCode", res?.code);
          setCodeData(res?.code);
        } else {
          emitter.emit("applyCode", gameDetail?.code);
          setCodeData(gameDetail?.code);
        }
      });
    }
  }, [gameDetail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  let isMouseScroll = useRef(false);

  const onTyping = () => {
    if (!isMouseScroll.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEventBus("game-error", (data) => {
    const errorText =
      "The code has an error, please fix it: \n\n```javascript\n" +
      data +
      "\n```";
    const errorMessage = {
      position: "left",
      text: errorText,
      id: "errorId",
    };
    setMessages((prev) => [...prev, errorMessage]);
  });

  // Control mouse scroll during code typing
  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current?.addEventListener("scroll", () => {
      const scrollContainer = chatContainerRef.current;
      if (scrollContainer) {
        const isAtBottom =
          scrollContainer.scrollHeight - scrollContainer.scrollTop <=
          scrollContainer.clientHeight;
        if (isAtBottom) {
          isMouseScroll.current = false;
        } else {
          isMouseScroll.current = true;
        }
      }
    });
    return () => {
      chatContainerRef.current?.removeEventListener("scroll", () => {});
    };
  }, [chatContainerRef]);

  const getChatHistory = () => {
    getChatHistoryApi(id as string).then((res) => {
      const filterHistoryData = formatHistoryData(res);
      messages = filterHistoryData;
      setMessages(filterHistoryData);
    });
  };

  const handleApplyCode = (message: any) => {
    emitter.emit("resetMessageNum");
    emitter.emit("canchePublish", message);
    if (message?.id === "errorId") {
      handleSend(message?.text);
    } else {
      emitter.emit("applyCode", message?.code);
      setCodeData(message?.code);
      applyCodeApi(message?.id);
    }
  };

  const applyCodeApi = (chatId: string) => {
    applyGame({
      chatId,
    }).then((res) => {});
  };

  const interval = useRef<any>(null);

  useEffect(() => {
    interval.current = setInterval(() => {
      if (!gameDetail?.code) {
        getChatHistoryApi(id as string).then((res) => {
          if (res?.length > 0) {
            const filterHistoryData = formatHistoryData(res);
            messages = filterHistoryData;
            setMessages(filterHistoryData);
            reloadDetail();
          }
        });
      } else {
        clearInterval(interval.current);
      }
    }, 10000);
    return () => clearInterval(interval.current);
  }, [gameDetail]);

  useEffect(() => {
    getChatHistory();
  }, []);

  const MessageMemo = useMemo(() => {
    return messages.map((message, index) => (
      <div key={index}>
        <Message
          showFixButton={message?.id === "errorId"}
          onClickApply={(content) => {
            handleApplyCode(message);
          }}
          text={message.text}
          isResponse={message.position === "left"}
        />
      </div>
    ));
  }, [messages]);

  const onTypingComplete = () => {
    setStreamingMessage(null);
    setMessages((prev) => [...prev, streamingMessage]);
  };

  // Stream message separate rendering
  const StreamingMessageMemo = useMemo(() => {
    if (!streamingMessage) return null;
    return (
      <Message
        onClickApply={() => {
          handleApplyCode(streamingMessage);
        }}
        text={streamingMessage.text}
        isResponse={streamingMessage.position === "left"}
        isStreaming={true}
        onTypingComplete={onTypingComplete}
        onTyping={onTyping}
      />
    );
  }, [streamingMessage]);

  return (
    <div className="flex flex-col flex-1 ">
      {gameDetail?.code ? (
        <>
          <div
            className=" overflow-y-auto h-[521px] hide-scrollbar"
            ref={chatContainerRef}
          >
            {MessageMemo}
            {StreamingMessageMemo}
            {isChatLoading && (
              <Loader className="w-[24px] h-[24px] animate-spin text-white" />
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 pl-0 border-t border-[#323737]">
            <ChatInput
              value={inputText}
              onChange={setInputText}
              onSend={() => {
                handleSend();
              }}
            />
          </div>
        </>
      ) : (
        <Formation />
      )}
    </div>
  );
};

const CustomStyles = `
.rce-container-input{
  background: #1b2121 !important;
  border: 1px solid #323737 !important;
}
  .rce-container-mbox {
    background: transparent;
 
  }
  
  .rce-mbox {
    max-width: 80%;
  }
  
  .rce-mbox-left {
    background: #262929 !important;
    color: white !important;
  }
  
  .rce-mbox-right {
    background: #00FFD1 !important;
    color: black !important;
  }
  
  .rce-mbox-right .rce-mbox-title {
    color: #000 !important;
  }
  
  .rce-mbox-left .rce-mbox-title {
    color: #fff !important;
  }
  
  .rce-input {
    border-color: #323737 !important;
    padding-left: 16px !important;
    color: #fff !important;
  }
  
  .rce-input::placeholder {
    color: #777a7a;
  }

  .rce-mbox-left:before {
    border-right-color: #262929 !important;
  }

  .rce-mbox-right:before {
    border-left-color: #00FFD1 !important;
  }
`;

interface ChatViewProps {
  setCodeData: (data: any) => void;
  gameDetail: any;
  reloadDetail: () => void;
}
const ChatView: React.FC<ChatViewProps> = ({
  setCodeData,
  gameDetail,
  reloadDetail,
}) => {
  return (
    <>
      <style>{CustomStyles}</style>
      <ChatInterface
        gameDetail={gameDetail}
        setCodeData={setCodeData}
        reloadDetail={reloadDetail}
      />
    </>
  );
};

export default ChatView;

interface Message {
  event_type: string;
  content: string;
}
// Parse SSE message function
const parseSSEMessage = (chunk: string) => {
  const lines = chunk.split("\n");
  let parsedContent = "";

  for (const line of lines) {
    if (line.startsWith("data:")) {
      try {
        const jsonData = JSON.parse(line.slice(5));
        if (jsonData.event_type === "message") {
          parsedContent += jsonData.content;
        }
      } catch (e) {
        console.error("Parse error:", e);
      }
    }
  }

  return parsedContent;
};

// Format history data
const formatHistoryData = (data: any) => {
  const historyData: any[] = [
    {
      id: "1",
      position: "left",
      type: "text",
      text: "Welcome to a world of endless possibilities—explore, create, and make it your own!",
    },
  ];
  data = data.reverse();
  data?.forEach((item) => {
    if (item?.isFirst != 1) {
      const askResponse = {
        id: item.id,
        position: "right",
        type: "text",
        text: item.prompt,
      };
      askResponse.text = item.prompt;
      historyData.push(askResponse);

      const codeResponse = {
        id: item.id,
        position: "left",
        type: "text",
        text: item.answer,
        code: item.code,
      };
      historyData.push(codeResponse);
    }
  });
  return historyData;
};
