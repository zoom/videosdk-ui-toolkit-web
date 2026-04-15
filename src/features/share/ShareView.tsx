import { StreamContext } from "@/context/stream-context";
import { useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { useRef, useEffect, useMemo, useContext, useCallback, CSSProperties, useState } from "react";
import { useTranslation } from "react-i18next";
import { useShareChange } from "./hooks";
import AnnotationToolbar from "./components/AnnotationToolbar";
import { useAnnotationEvents } from "./hooks/useAnnotationEvents";
import { Camera } from "lucide-react";
import SharePlayer from "./SharePlayer";

interface ShareCanvasProps {
  isStartShareScreenWithVideoElement: boolean;
  isSendingScreenShare: boolean;
  isReceivingScreenShare: boolean;
  mainContentHeight: number;
  mainContentWidth: number;
  isOriginalSize: boolean;
}

const ShareCanvas = (props: ShareCanvasProps) => {
  const {
    isStartShareScreenWithVideoElement,
    isSendingScreenShare,
    isReceivingScreenShare,
    mainContentHeight,
    mainContentWidth,
    isOriginalSize,
  } = props;
  const { t } = useTranslation();
  const { activeShareId } = useAppSelector(useSessionSelector);
  const selfCanvasRef = useRef(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { shareContentDimension } = useShareChange();
  const [renderedShareContentDimension, setRenderedShareContentDimension] = useState({ width: 0, height: 0 });
  const [canvasDimension, setCanvasDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvasHeight = Math.min(mainContentHeight * 0.8, ((mainContentWidth * 0.8) / 16) * 9);
    const canvasWidth = (canvasHeight / 9) * 16;
    setCanvasDimension({ width: canvasWidth, height: canvasHeight });
    const ratio = Math.max(shareContentDimension.width / canvasWidth, shareContentDimension.height / canvasHeight);
    if (isSendingScreenShare && selfCanvasRef.current) {
      const newCanvasHeight = shareContentDimension.height / ratio;
      const newCanvasWidth = shareContentDimension.width / ratio;
      selfCanvasRef.current.style.width = `${newCanvasWidth}px`;
      selfCanvasRef.current.style.height = `${newCanvasHeight}px`;
      canvasContainerRef.current.style.height = `${0}px`;
      canvasContainerRef.current.style.width = `${0}px`;
    }
    if (isReceivingScreenShare) {
      if (canvasContainerRef.current) {
        canvasContainerRef.current.style.height = `${canvasHeight}px`;
        canvasContainerRef.current.style.width = `${(canvasHeight / 9) * 16}px`;
      }
      const newCanvasHeight = isOriginalSize ? shareContentDimension.height : shareContentDimension.height / ratio;
      const newCanvasWidth = isOriginalSize ? shareContentDimension.width : shareContentDimension.width / ratio;
      setRenderedShareContentDimension({ width: newCanvasWidth, height: newCanvasHeight });
    }
  }, [
    isReceivingScreenShare,
    isSendingScreenShare,
    mainContentHeight,
    mainContentWidth,
    shareContentDimension,
    isOriginalSize,
  ]);

  const getCanvasStyle = useCallback((isActive: boolean, isOriginalSize: boolean) => {
    return {
      display: isActive ? "flex" : "none",
      height: isActive ? `100%` : 0,
      pointerEvents: isOriginalSize ? "auto" : "none",
    };
  }, []);

  if (isStartShareScreenWithVideoElement) {
    return (
      <>
        <video
          ref={selfCanvasRef}
          id="ZOOM_VIDEO_SDK_SELF_SHARE_CANVAS"
          className={`aspect-[16/9] rounded-[12px]`}
          style={getCanvasStyle(isSendingScreenShare, isOriginalSize) as CSSProperties}
          muted
          aria-label={t("share.screen_share_preview")}
        />
        <div
          className={`relative overflow-hidden flex items-center rounded-lg ${isOriginalSize ? "" : "justify-center"}`}
          ref={canvasContainerRef}
        >
          <SharePlayer
            activeSharerUserId={activeShareId}
            isReceivingScreenShare={isReceivingScreenShare}
            className={`rounded-[12px] ${isOriginalSize ? "cursor-move" : "cursor-default"} flex items-center justify-center`}
            style={getCanvasStyle(isReceivingScreenShare, isOriginalSize) as CSSProperties}
            shareContentDimension={renderedShareContentDimension}
            containerDimension={canvasDimension}
            isOriginalSize={isOriginalSize}
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <canvas
          ref={selfCanvasRef}
          id="ZOOM_VIDEO_SDK_SELF_SHARE_CANVAS"
          className={`aspect-[16/9] rounded-[12px]`}
          style={getCanvasStyle(isSendingScreenShare, isOriginalSize) as CSSProperties}
        />
        <div
          className={`relative overflow-hidden flex items-center rounded-lg ${isOriginalSize ? "" : "justify-center"}`}
          ref={canvasContainerRef}
        >
          <SharePlayer
            activeSharerUserId={activeShareId}
            isReceivingScreenShare={isReceivingScreenShare}
            className={`rounded-[12px] relative ${isOriginalSize ? "cursor-move" : "cursor-default"} flex items-center justify-center`}
            style={getCanvasStyle(isReceivingScreenShare, isOriginalSize) as CSSProperties}
            shareContentDimension={renderedShareContentDimension}
            containerDimension={canvasDimension}
            isOriginalSize={isOriginalSize}
          />
        </div>
      </>
    );
  }
};
const ShareView = ({
  mainContentHeight,
  mainContentWidth,
}: {
  mainContentHeight: number;
  mainContentWidth: number;
}) => {
  const { t } = useTranslation();
  const { isSendingScreenShare, isReceivingScreenShare, userId, activeShareId, activeSharerName } =
    useAppSelector(useSessionSelector);
  const { isOriginalShareContentSize, canDoAnnotation } = useAppSelector(useSessionUISelector);
  const isScreenSharing = useMemo(
    () => isSendingScreenShare || isReceivingScreenShare,
    [isReceivingScreenShare, isSendingScreenShare],
  );
  const { stream } = useContext(StreamContext);
  const isStartShareScreenWithVideoElement = !!stream?.isStartShareScreenWithVideoElement();
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useAnnotationEvents();

  useEffect(() => {
    if (canvasContainerRef.current) {
      const canvasHeight = Math.min(mainContentHeight * 0.8, ((mainContentWidth * 0.8) / 16) * 9);
      canvasContainerRef.current.style.height = `${canvasHeight}px`;
      canvasContainerRef.current.style.width = `${(canvasHeight / 9) * 16}px`;
    }
  }, [mainContentHeight, mainContentWidth]);

  const activeShareUserName = useMemo(() => {
    return userId === activeShareId ? `${activeSharerName}'s (myself)` : `${activeSharerName}'s`;
  }, [activeShareId, activeSharerName, userId]);

  const [isScreenshotCapturing, setIsScreenshotCapturing] = useState(false);
  const { featuresOptions } = useAppSelector(useSessionSelector);
  const isShareScreenshotEnabled = featuresOptions?.screenshot?.share?.enable;

  const takeShareScreenshot = useCallback(async () => {
    if (!stream || !isShareScreenshotEnabled || activeShareId === undefined) return;

    setIsScreenshotCapturing(true);
    try {
      const result = await stream.screenshotShareView();
      if (!(result instanceof Blob)) {
        // eslint-disable-next-line no-console
        console.error("Screenshot failed:", result);
        return;
      }
      const url = URL.createObjectURL(result);
      const a = document.createElement("a");
      a.href = url;
      a.download = "screenshot.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Screenshot threw`, err);
    } finally {
      setIsScreenshotCapturing(false);
    }
  }, [activeShareId, isShareScreenshotEnabled, stream]);

  return (
    <div
      className="m-2 w-full h-full flex items-center justify-center"
      style={{ visibility: isScreenSharing ? "visible" : "hidden", height: isScreenSharing ? `85%` : 0 }}
    >
      <div
        ref={canvasContainerRef}
        className="relative flex items-center justify-center rounded-lg bg-black bg-opacity-50 group"
      >
        {isShareScreenshotEnabled && isReceivingScreenShare && !isScreenshotCapturing && (
          <div className="absolute top-2 right-2 z-30 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={takeShareScreenshot}
              className="bg-gray-800/80 hover:bg-gray-700/90 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={t("share.screenshot_title")}
            >
              <Camera size={18} className="text-white" />
            </button>
          </div>
        )}
        <ShareCanvas
          isStartShareScreenWithVideoElement={isStartShareScreenWithVideoElement}
          isSendingScreenShare={isSendingScreenShare}
          isReceivingScreenShare={isReceivingScreenShare}
          mainContentHeight={mainContentHeight}
          mainContentWidth={mainContentWidth}
          isOriginalSize={isOriginalShareContentSize}
        />
        {activeSharerName && (
          <div className="absolute left-[10px] bottom-[10px] bg-gray-900 bg-opacity-50 rounded flex items-center">
            <div className="text-theme-text-button pl-2 max-w-[250px] truncate">
              <span>{`${activeShareUserName}`}</span>
            </div>
            <span className="text-theme-text-button px-2">{`content`}</span>
          </div>
        )}
        {canDoAnnotation && <AnnotationToolbar position="absolute left-[10px] bottom-[40px] z-10" />}
      </div>
    </div>
  );
};

export default ShareView;
