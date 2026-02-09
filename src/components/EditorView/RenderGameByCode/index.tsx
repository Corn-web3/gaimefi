import Formation from "@/components/Formation";
import { useEffect, useState, useImperativeHandle } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import emitter, { useEventBus } from "@/utils/useEventBus";

import { Loader } from "lucide-react";
const RenderGameByCode = ({ code, onRef }: { code: string; onRef?: any }) => {
  const iframeRef = useRef<any>();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { id } = useParams();
  const messageNumIndex = useRef(0);
  useEffect(() => {
    window.addEventListener("message", (e) => {
      if (messageNumIndex.current === 0) {
        messageNumIndex.current++;
        const { type, data } = e.data;
        if (type?.includes("game-error")) {
          const parseData = JSON.parse(data);
          emitter.emit("game-error", parseData.message);
        }
      }
    });
  }, []);

  const [loading, setLoading] = useState(false);

  useEventBus("resetMessageNum", (data) => {
    messageNumIndex.current = 0;
  });

  useEffect(() => {
    return () => {
      messageNumIndex.current = 0;
    };
  }, []);

  useEventBus("previewCodeshowLoading", (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  });

  const runCode = () => {
    setLoading(true);
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const iframeDocument =
        iframe?.contentDocument || iframe?.contentWindow?.document;
      iframeDocument.open();
      const filterCodeData = extractCode(code);
      iframeRef.current.srcdoc = filterCodeData; // Write code to iframe
      iframeDocument.close();
      // return
    } catch (error) {
      console.error("iframe error:", error);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (code && iframeRef.current) {
      runCode();
    }
  }, [code, iframeRef.current]);

  useEffect(() => {
    if (!code) return;
    const handleFullScreenChange = () => {
      if (document?.fullscreenElement) {
      } else {
        setIsFullScreen(false);
        runCode();
      }
    };
    document?.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document?.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [code]);

  const fullScreen = () => {
    iframeRef.current.requestFullscreen();
    setIsFullScreen(true);
    runCode();
  };

  useImperativeHandle(onRef, () => ({
    fullScreen,
  }));

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className=" w-full h-full flex items-center justify-center absolute left-0 top-0 z-[12] bg-black">
          <Loader className="w-[24px] h-[24px] animate-spin text-white" />
        </div>
      )}

      {code ? (
        <iframe
          ref={iframeRef}
          {...{ gameId: id }}
          title="output"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          referrerPolicy="no-referrer"
          allow="cross-origin-isolated"
          onError={() => {}}
          loading="lazy"
          style={{
            position: isFullScreen ? "fixed" : "relative",
            width: isFullScreen ? "100vw" : "100%",
            height: isFullScreen ? "100vh" : "100%",
            top: isFullScreen ? "0" : "0",
            left: isFullScreen ? "0" : "0",
          }}
        ></iframe>
      ) : (
        <Formation />
      )}
    </div>
  );
};

export default RenderGameByCode;

export const extractCode = (message: string): string => {
  // Remove starting ```javascript and ending ```
  const htmlString = message.replace("```javascript", "").replace("```", "");
  // validateHTMLAndScript(htmlString);
  return htmlString;
};

function validateHTMLAndScript(htmlString) {
  let isValidHTML = true;
  const scriptContents = [] as any;

  try {
    // Use DOMParser to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Check if HTML has parse errors
    if (doc.querySelector("parsererror")) {
      isValidHTML = false;
    }

    // Extract all <script> tag content
    const scripts = doc.querySelectorAll("script");
    scripts.forEach((script: any) => {
      if (script.textContent) {
        scriptContents.push(script?.textContent);
      }
    });
  } catch (error) {
    isValidHTML = false;
  }
  // Check JavaScript syntax in <script>
  const isValidScripts = scriptContents.every((script) => {
    try {
      new Function(script); // Check if syntax is valid
      return true;
    } catch (error) {
      return false;
    }
  });

  return isValidHTML && isValidScripts;
}
