import { useState, useRef, useCallback, useEffect } from "react";
import { chatWithAiApi } from "@/services/gameService";

export const useStreamChat = ({}) => {
  const [streamingMessage, setStreamingMessage] = useState<any | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const abortController = useRef<AbortController>();

  const sendMessageWithChat = useCallback(
    async (prompt: string, gameId: string) => {
      if (!prompt?.trim()) return;
      setIsChatLoading(true);
      try {
        const response = await chatWithAiApi({
          gameId: gameId,
          prompt,
        });
        if (response) {
          setStreamingMessage({
            id: response.id,
            position: "left",
            text: response?.answer,
            code: response?.code,
          });
        } else {
          setStreamingMessage(null);
        }
        setIsChatLoading(false);
      } catch (error) {
        console.error("Chat error:", error);
        setIsChatLoading(false);
        setStreamingMessage(null);
      }
    },
    []
  );

  // Cleanup function
  useEffect(() => {
    return () => {
      abortController.current?.abort();
    };
  }, []);

  return {
    streamingMessage,
    setStreamingMessage,
    isChatLoading,
    sendMessageWithChat,
  };
};
