import React, { useRef, useEffect, useContext, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsShowCaptionHistory } from "@/store/uiSlice";
import { CommonPopper } from "@/components/widget/CommonPopper";
import { LiveTranscriptionMessage } from "@zoom/videosdk";
import sessionAdditionalContext from "@/context/session-additional-context";
import { ClientContext } from "@/context/client-context";
import { ArrowBigDown } from "lucide-react";

export const CaptionHistoryWindow: React.FC = () => {
  const { t } = useTranslation();
  const { isShowCaptionHistory } = useAppSelector(useSessionUISelector);

  const client = useContext(ClientContext);
  const { captionClient } = useContext(sessionAdditionalContext);

  const [allMessages, setAllMessages] = useState<LiveTranscriptionMessage[]>(
    captionClient?.getFullTranscriptionHistory(),
  );

  const prevLengthRef = useRef(allMessages);

  const [isNearBottom, setIsNearBottom] = useState(true);
  const [isShowScrollDown, setIsShowScrollDown] = useState(true);

  const dispatch = useAppDispatch();

  const historyRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!historyRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = historyRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 5;
    setIsNearBottom(isNearBottom);
  };

  const scrollToBottom = useCallback(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
      setIsShowScrollDown(false);
    } else {
      const currentMessage = allMessages.length > 0 ? allMessages[allMessages.length - 1].text : null;
      const prevMessage =
        prevLengthRef.current.length > 0 ? prevLengthRef.current[prevLengthRef.current.length - 1].text : null;

      if (currentMessage !== prevMessage) {
        setIsShowScrollDown(true);
      }
    }
    prevLengthRef.current = allMessages;
  }, [allMessages, isNearBottom, scrollToBottom]);

  const onCaptionMessage = useCallback(() => {
    const timeoutId = setTimeout(() => {
      const fullHistory = captionClient?.getFullTranscriptionHistory();
      setAllMessages(fullHistory);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [captionClient]);

  useEffect(() => {
    client.on("caption-message", onCaptionMessage);
    return () => {
      client.off("caption-message", onCaptionMessage);
    };
  }, [client, onCaptionMessage]);

  return (
    <CommonPopper
      id="uikit-caption-full-transcript-window"
      isOpen={isShowCaptionHistory}
      onClose={() => {
        dispatch(setIsShowCaptionHistory(false));
      }}
      title={t("caption.history_title")}
      width={400}
      height={500}
    >
      <div
        ref={historyRef}
        className="h-full overflow-y-auto p-4 space-y-4 uikit-custom-scrollbar"
        onScroll={handleScroll}
      >
        {allMessages.map((item) => (
          <div key={item.msgId} className="group transition-all duration-200 ease-in-out">
            <div className="flex items-center justify-between text-xs text-theme-text/40 mb-1">
              <span className="font-medium">{item.displayName}</span>
              <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
            </div>
            <div
              className="bg-theme-background/50 backdrop-blur-sm rounded-lg p-3.5 
                          shadow-sm border border-theme-border/10
                          group-hover:border-theme-border/20 group-hover:bg-theme-background/60
                          transition-all duration-200 ease-in-out"
            >
              <p className="text-theme-text/90 text-sm leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
      {isShowScrollDown && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-white text-gray-600 shadow-md border border-gray-200 hover:shadow-lg hover:bg-gray-50 transition"
        >
          <ArrowBigDown />
        </button>
      )}
    </CommonPopper>
  );
};

export default CaptionHistoryWindow;
