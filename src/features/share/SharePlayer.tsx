import {
  useRef,
  useContext,
  useEffect,
  CSSProperties,
  useState,
  useCallback,
  DOMAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
} from "react";
import { VideoPlayerContainer, type VideoPlayer } from "@zoom/videosdk";
import { StreamContext } from "@/context/stream-context";
import { usePrevious } from "@/hooks";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { setCanDoAnnotation } from "@/store/uiSlice";
import Draggable from "react-draggable";
import { Loader } from "lucide-react";
import { setIsLoadingShareRender } from "@/store/sessionSlice";
import { useTranslation } from "react-i18next";

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["video-player"]: DetailedHTMLProps<HTMLAttributes<VideoPlayer>, VideoPlayer> & { className?: string };
      ["video-player-container"]: CustomElement<VideoPlayerContainer> & { className?: string };
    }
  }
}

interface SharePlayerProps {
  activeSharerUserId: number | null;
  isReceivingScreenShare: boolean;
  className: string;
  style: CSSProperties;
  shareContentDimension: { width: number; height: number };
  containerDimension: { width: number; height: number };
  isOriginalSize: boolean;
}

const SharePlayer = (props: SharePlayerProps) => {
  const {
    activeSharerUserId,
    isReceivingScreenShare,
    className,
    style,
    shareContentDimension,
    containerDimension,
    isOriginalSize,
  } = props;
  const videoPlayerRef = useRef<VideoPlayer>(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const { stream } = useContext(StreamContext);
  const { t } = useTranslation();
  const { isLoadingShareRender } = useAppSelector(useSessionSelector);
  const dispatch = useAppDispatch();
  const previousActiveSharerUserId = usePrevious(activeSharerUserId);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = useCallback(
    (e, data) => {
      let newX = data.x;
      let newY = data.y;
      if (data.x > 0) newX = 0;
      if (data.x < -(shareContentDimension.width - containerDimension.width)) {
        newX = -(shareContentDimension.width - containerDimension.width);
      }
      if (data.y > (shareContentDimension.height - containerDimension.height) / 2) {
        newY = (shareContentDimension.height - containerDimension.height) / 2;
      }
      if (data.y < -(shareContentDimension.height - containerDimension.height) / 2) {
        newY = -(shareContentDimension.height - containerDimension.height) / 2;
      }
      setPosition({ x: newX, y: newY });
    },
    [containerDimension, shareContentDimension],
  );

  // Reset the drag position
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [isOriginalSize]);

  useEffect(() => {
    const currentRef = videoPlayerRef.current;
    if (!stream || !currentRef) return;

    const handleShareRender = async () => {
      try {
        if (isReceivingScreenShare) {
          if (previousActiveSharerUserId && previousActiveSharerUserId !== activeSharerUserId) {
            await stream.detachShareView(previousActiveSharerUserId, currentRef);
          }
          if (activeSharerUserId && previousActiveSharerUserId !== activeSharerUserId) {
            await stream.attachShareView(activeSharerUserId, currentRef);
            dispatch(setCanDoAnnotation(stream?.canDoAnnotation()));
          }
        } else if (previousActiveSharerUserId) {
          await stream.detachShareView(previousActiveSharerUserId, currentRef);
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setIsLoadingShareRender(false));
      }
    };
    handleShareRender();
  }, [stream, activeSharerUserId, previousActiveSharerUserId, isReceivingScreenShare, dispatch]);

  return (
    <>
      {isLoadingShareRender && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader size={20} className="animate-spin text-white" aria-hidden />
          <span className="text-white">{t("share.loading_share_content")}</span>
        </div>
      )}
      <Draggable nodeRef={draggableRef} position={position} onDrag={handleDrag} disabled={!isOriginalSize}>
        <div className={`${className}`} ref={draggableRef} style={style}>
          <video-player-container className="w-full h-full">
            <div
              className="w-full h-full"
              style={{ width: `${shareContentDimension.width}px`, height: `${shareContentDimension.height}px` }}
            >
              <video-player style={{ width: "100%", height: "100%" }} ref={videoPlayerRef} />
            </div>
          </video-player-container>
        </div>
      </Draggable>
    </>
  );
};

export default SharePlayer;
