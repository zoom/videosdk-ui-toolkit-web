import React, { useState, useEffect, useRef, useMemo, useContext, useCallback } from "react";
import { useAppDispatch, useAppSelector, useCaptionSelector } from "@/hooks/useAppSelector";
import Draggable from "react-draggable";
import { X } from "lucide-react";
import { setIsShowCaption } from "@/store/uiSlice";
import { ClientContext } from "@/context/client-context";
import { LiveTranscriptionMessage } from "@zoom/videosdk";

export const SubtitleContainer: React.FC = () => {
  const client = useContext(ClientContext);
  const { currentTranslationLanguage } = useAppSelector(useCaptionSelector);
  const dispatch = useAppDispatch();

  const [messageObj, setMessageObj] = useState<LiveTranscriptionMessage | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nodeRef = useRef<HTMLDivElement>(null);
  const contentWidth = window.innerWidth < 768 ? window.innerWidth * 0.9 : 800;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const initPosition = useMemo(() => {
    const x = (window.innerWidth - contentWidth) / 2;
    const y = window.innerHeight - (window.innerWidth < 768 ? 100 : 150);
    return { x, y };
  }, [contentWidth]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageObj]);

  const onCaptionMessage = useCallback(
    (payload: LiveTranscriptionMessage) => {
      if (currentTranslationLanguage !== undefined) {
        // If translation is on, we want only translated messages
        if (payload.language !== 400) {
          setMessageObj(payload);
        }
      } else {
        // If translation is off, we want only original messages
        if (payload.language === 400) {
          setMessageObj(payload);
        }
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setMessageObj(null);
      }, 8000);
    },
    [currentTranslationLanguage],
  );

  useEffect(() => {
    setPosition(initPosition);
  }, [initPosition]);

  useEffect(() => {
    client.on("caption-message", onCaptionMessage);
    return () => {
      client.off("caption-message", onCaptionMessage);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [client, onCaptionMessage]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setIsShowCaption(false));
  };

  const getAvatarLetter = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  return (
    messageObj?.text && (
      <Draggable
        nodeRef={nodeRef}
        bounds="parent"
        position={position}
        onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
        handle=".drag-handle"
      >
        <div
          id="uikit-caption-container"
          ref={nodeRef}
          className="absolute bg-black z-10 bg-opacity-75 text-theme-text-button p-2 rounded w-4/5 max-w-[500px] select-none"
        >
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="drag-handle cursor-move absolute inset-0" />
          <div className="flex items-start pt-1">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2 flex-shrink-0">
              {getAvatarLetter(messageObj.displayName)}
            </div>
            <div className="max-h-[60px] overflow-y-auto" ref={scrollRef}>
              <div className={`text-sm${messageObj.language !== 400 ? " text-yellow-300" : ""}`}>{messageObj.text}</div>
            </div>
          </div>
        </div>
      </Draggable>
    )
  );
};

export default SubtitleContainer;
