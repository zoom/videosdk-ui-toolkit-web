import { useAppSelector, useParticipantSelector, useSessionSelector } from "@/hooks/useAppSelector";
import React, {
  DetailedHTMLProps,
  DOMAttributes,
  HTMLAttributes,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import Draggable from "react-draggable";
import { type VideoPlayer, type VideoPlayerContainer } from "@zoom/videosdk";
import { usePrevious } from "@/hooks";
import { StreamContext } from "@/context/stream-context";
import { isPortrait } from "@/components/util/service";
type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["video-player"]: DetailedHTMLProps<HTMLAttributes<VideoPlayer>, VideoPlayer> & { className?: string };
      ["video-player-container"]: CustomElement<VideoPlayerContainer> & { className?: string };
    }
  }
}

const SelfPreview = ({ mainContentWidth }: { mainContentWidth: number }) => {
  const { stream } = useContext(StreamContext);
  const { userId, trackingId, debug, isVideoWebRTC, spotlightUserList } = useAppSelector(useSessionSelector);
  const { participants } = useAppSelector(useParticipantSelector);
  const nodeRef = useRef(null);
  const selfVideoRef = useRef<VideoPlayer>(null);
  const [position, setPosition] = useState({ x: mainContentWidth - 264, y: 80 });

  const isSelfSpotlighted = useMemo(() => {
    const spotlightUserIdList = spotlightUserList.map((p) => p.userId);
    return spotlightUserIdList.includes(userId);
  }, [spotlightUserList, userId]);

  const isSelfVideoOn = useMemo(() => {
    return participants.find((p) => p.userId === userId)?.bVideoOn;
  }, [participants, userId]);

  const handleDrag = useCallback((e, data) => {
    setPosition({ x: data.x, y: data.y });
  }, []);

  const resetPosition = useCallback(() => {
    if (isPortrait()) {
      setPosition({ x: mainContentWidth - 153, y: 80 });
    } else {
      setPosition({ x: mainContentWidth - 264, y: 80 });
    }
  }, [mainContentWidth]);

  useEffect(() => {
    resetPosition();
  }, [resetPosition]);

  // Handle self video on and off with <video-player-container />
  const prevIsSelfVideoOn = usePrevious(isSelfVideoOn);
  useEffect(() => {
    if (stream && selfVideoRef.current) {
      if (prevIsSelfVideoOn !== isSelfVideoOn && isSelfVideoOn) {
        stream.attachVideo(userId, 3, selfVideoRef.current);
      }
      if (prevIsSelfVideoOn !== isSelfVideoOn && !isSelfVideoOn) {
        stream.detachVideo(userId);
      }
    }
  }, [isSelfVideoOn, prevIsSelfVideoOn, stream, userId]);

  return (
    <Draggable bounds="parent" position={position} onDrag={handleDrag} nodeRef={nodeRef}>
      <div
        className="absolute rounded-lg overflow-hidden shadow-lg cursor-move"
        style={{
          visibility: isSelfVideoOn && !isSelfSpotlighted ? "visible" : "hidden",
          width: isPortrait() ? "143px" : "254px",
          height: isPortrait() ? "254px" : "143px",
        }}
        ref={nodeRef}
      >
        {/* Use startVideo() with <video> to render self video */}
        {/* <video className="w-full h-full object-cover" id="ZOOM_SELF_VIDEO" /> */}
        {/* Use attachVideo and detachVideo to render self video */}
        <video-player-container>
          {isSelfVideoOn && (
            <div className="w-full">
              <div>
                <video-player
                  ref={selfVideoRef}
                  className="rounded-lg aspect-video overflow-hidden"
                  style={{ width: isPortrait() ? "143px" : "254px", height: isPortrait() ? "254px" : "143px" }}
                />
              </div>
            </div>
          )}
        </video-player-container>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-theme-text-button px-2 py-1 text-sm rounded">
          You
          <span className="text-red-500 text-sm ml-2">{trackingId && debug ? `${trackingId}` : ""}</span>
          {debug && isVideoWebRTC && <span className="text-white"> (WebRTC)</span>}
        </div>
      </div>
    </Draggable>
  );
};

export default SelfPreview;
