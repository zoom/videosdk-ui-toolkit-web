import { CSSProperties, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useShareChange } from "./hooks";
import { useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { isPortrait } from "@/components/util/service";
import { Camera } from "lucide-react";
import { StreamContext } from "@/context/stream-context";
import { useAnnotationEvents } from "./hooks/useAnnotationEvents";
import SharePlayer from "./SharePlayer";

const ShareViewMobile = ({
  mainContentHeight,
  mainContentWidth,
}: {
  mainContentHeight: number;
  mainContentWidth: number;
}) => {
  const shareContainerRef = useRef<HTMLDivElement>(null);
  const selfCanvasRef = useRef(null);
  const { shareContentDimension } = useShareChange();
  const { currentPage, isControlsVisible } = useAppSelector(useSessionUISelector);
  const { activeShareId, userId, activeSharerName, isReceivingScreenShare, isSendingScreenShare } =
    useAppSelector(useSessionSelector);
  const { stream } = useContext(StreamContext);
  const isStartShareScreenWithVideoElement = !!stream?.isStartShareScreenWithVideoElement();
  const [canvasDimension, setCanvasDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (shareContainerRef.current) {
      shareContainerRef.current.style.visibility = currentPage === -1 ? "visible" : "hidden";
      shareContainerRef.current.style.height = currentPage === -1 ? "100%" : "0";
    }
  }, [currentPage]);

  useEffect(() => {
    if (shareContainerRef.current) {
      if (!isPortrait()) {
        const containerWidth = Math.min((mainContentHeight / 9) * 16 - 8 * 2, mainContentWidth - 8 * 2);
        shareContainerRef.current.style.width = `${containerWidth}px`;
        shareContainerRef.current.style.height = `${mainContentHeight}px`;
      } else {
        const containerHeight = mainContentHeight * 0.8;
        const containerWidth = Math.min((containerHeight / 4) * 3 - 8 * 2, mainContentWidth - 8 * 2);
        shareContainerRef.current.style.width = `${containerWidth}px`;
        shareContainerRef.current.style.height = `${containerHeight}px`;
      }
    }
  }, [currentPage, mainContentHeight, mainContentWidth]);

  useEffect(() => {
    if (shareContainerRef.current) {
      const height = shareContainerRef.current?.getBoundingClientRect()?.height;
      const width = shareContainerRef.current?.getBoundingClientRect()?.width;
      const ratio = Math.max(shareContentDimension.width / width, shareContentDimension.height / height);
      const newCanvasHeight = shareContentDimension.height / ratio;
      const newCanvasWidth = shareContentDimension.width / ratio;
      if (isReceivingScreenShare) {
        setCanvasDimension({ width: newCanvasWidth, height: newCanvasHeight });
      }
      if (isSendingScreenShare && selfCanvasRef.current) {
        selfCanvasRef.current.style.width = `${newCanvasWidth}px`;
        selfCanvasRef.current.style.height = `${newCanvasHeight}px`;
      }
    }
  }, [shareContentDimension, mainContentWidth, isReceivingScreenShare, isSendingScreenShare]);

  useAnnotationEvents();

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

  const getCanvasStyle = useCallback((isActive: boolean) => {
    return { display: isActive ? "block" : "none", height: isActive ? `100%` : 0 };
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className="bg-black rounded-[8px] w-full h-full flex justify-center items-center relative"
        ref={shareContainerRef}
      >
        {/* screenshot button – hide if you’re the one sharing */}
        {isShareScreenshotEnabled && userId !== activeShareId && !isScreenshotCapturing && (
          <button
            onClick={takeShareScreenshot}
            className="absolute top-2 right-2 z-30
                       bg-gray-800/80 hover:bg-gray-700/90 p-1 rounded-full
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition-opacity duration-150
                       md:opacity-100
                       sm:opacity-[{{isControlsVisible ? 1 : 0}}]" /* tap-toggles via existing flag */
            title="Screenshot share"
          >
            <Camera size={18} className="text-white" />
          </button>
        )}
        {isStartShareScreenWithVideoElement ? (
          <video
            ref={selfCanvasRef}
            id="ZOOM_VIDEO_SDK_SELF_SHARE_CANVAS"
            className={`rounded-[8px]`}
            muted
            playsInline
            autoPlay
            style={getCanvasStyle(isSendingScreenShare) as CSSProperties}
          />
        ) : (
          <canvas
            ref={selfCanvasRef}
            id="ZOOM_VIDEO_SDK_SELF_SHARE_CANVAS"
            className={`rounded-[8px]`}
            style={getCanvasStyle(isSendingScreenShare) as CSSProperties}
          />
        )}
        <SharePlayer
          activeSharerUserId={activeShareId}
          isReceivingScreenShare={isReceivingScreenShare}
          className={`rounded-[12px] cursor-default flex items-center justify-center`}
          style={{
            display: "flex",
            height: "100%",
            pointerEvents: "none",
          }}
          shareContentDimension={canvasDimension}
          containerDimension={canvasDimension}
          isOriginalSize={false}
        />
        {activeSharerName && (
          <div className="absolute left-[10px] bottom-[10px] bg-neutral-600 opacity-90 rounded flex items-center">
            <div className="text-theme-text-button pl-2 max-w-[150px] truncate">
              <span>{`${activeShareUserName}`}</span>
            </div>
            <span className="text-theme-text-button px-2">{`content`}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareViewMobile;
