import React, { useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import MoveIcon from "./move-icon.svg";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { useToggleScreenShare } from "../hooks";
import { setIsScreenSharePaused, setIsEnableViewerAnnotation } from "@/store/sessionSlice";
import { useDrag } from "@/hooks/useDrag";
import { Pause, Pen, PenOff, Play } from "lucide-react";
import { SharePrivilege } from "@/constant/stream-constant";

type ShareBarBaseProps = {
  actions?: ReactNode;
};

const ShareBarBase = ({ actions }: ShareBarBaseProps) => {
  const { t } = useTranslation();
  const { stream } = useContext(StreamContext);
  const { isScreenSharePaused, isEnableViewerAnnotation, sharePrivilege } = useAppSelector(useSessionSelector);
  const dispatch = useAppDispatch();
  const [isOptimizeEnabled, setIsOptimizeEnabled] = useState(false);
  const shareBarRef = useRef(null);
  const { canDoAnnotation } = useAppSelector(useSessionUISelector);
  const { toggleScreenShare } = useToggleScreenShare();
  const initPosition = useMemo(() => ({ y: 100 }), []);
  const { position, handleMouseDown } = useDrag(shareBarRef, initPosition);

  const onPauseClick = useCallback(async () => {
    if (stream) {
      try {
        if (!isScreenSharePaused) {
          await stream.pauseShareScreen();
          dispatch(setIsScreenSharePaused(true));
        } else {
          await stream.resumeShareScreen();
          dispatch(setIsScreenSharePaused(false));
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
      }
    }
  }, [dispatch, isScreenSharePaused, stream]);

  const onOptimizeCheck = useCallback(async () => {
    if (stream) {
      if (!isOptimizeEnabled) {
        await stream.enableOptimizeForSharedVideo(true);
        setIsOptimizeEnabled(stream.isOptimizeForSharedVideoEnabled());
      } else {
        await stream.enableOptimizeForSharedVideo(false);
        setIsOptimizeEnabled(stream.isOptimizeForSharedVideoEnabled());
      }
    }
  }, [isOptimizeEnabled, stream]);

  const handleAnnotationPrivilegeChange = useCallback(async () => {
    await stream?.changeAnnotationPrivilege(!isEnableViewerAnnotation);
    dispatch(setIsEnableViewerAnnotation(!isEnableViewerAnnotation));
  }, [dispatch, isEnableViewerAnnotation, stream]);

  const shareBarText = isScreenSharePaused ? t("share.bar_paused") : t("share.bar_active");
  const stopShareButtonText = t("share.bar_stop_sharing");
  const playPauseButtonClass = isScreenSharePaused
    ? "bg-blue-500 hover:bg-blue-600 text-theme-text-button py-2 px-4 rounded-lg text-sm"
    : "bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg text-sm";

  return ReactDOM.createPortal(
    <div className="zoom-ui-toolkit-root">
      <div
        className="fixed flex items-center justify-between bg-theme-background rounded-lg shadow-lg p-2 w-[760px] z-50"
        id="screen-share-bar"
        ref={shareBarRef}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <div className="flex items-center space-x-3">
          <button className="text-gray-600 hover:text-gray-800 p-1 cursor-move" onMouseDown={handleMouseDown}>
            <svg className="w-4 h-4 text-theme-text">
              <MoveIcon />
            </svg>
          </button>
          <span className="text-sm font-semibold text-theme-text" id="share-bar-text">
            {shareBarText}
          </span>
        </div>
        <div className="flex space-x-2 items-center">
          {stream?.isSupportOptimizedForSharedVideo() && sharePrivilege !== SharePrivilege.MultipleShare && (
            <div className="flex space-x-2 items-center text-sm text-gray-700">
              <input
                type="checkbox"
                name="optimize video"
                id="share-bar-optimize-video"
                checked={isOptimizeEnabled}
                onChange={onOptimizeCheck}
                disabled={isScreenSharePaused}
              />
              <label htmlFor="optimize video" className="text-theme-text">
                {t("share.bar_optimize_video")}
              </label>
            </div>
          )}
          {canDoAnnotation && (
            <button
              onClick={handleAnnotationPrivilegeChange}
              className={`relative w-12 h-8 rounded-full transition-colors duration-100 ${isEnableViewerAnnotation ? "bg-green-200" : "bg-gray-300"}`}
            >
              <div
                className={`absolute top-0 left-0 w-8 h-8 rounded-full shadow-md flex items-center justify-center transform transition-transform duration-100 text-theme-text ${isEnableViewerAnnotation ? "translate-x-4 bg-green-500 hover:bg-green-600" : "translate-x-0 bg-gray-300 hover:bg-gray-400"}`}
                style={{
                  boxShadow: isEnableViewerAnnotation
                    ? "-4px 0 8px rgba(0, 0, 0, 0.25)"
                    : "4px 0 8px rgba(0, 0, 0, 0.25)",
                }}
              >
                {isEnableViewerAnnotation ? <Pen size={15} /> : <PenOff size={15} />}
              </div>
            </button>
          )}
          <button className={playPauseButtonClass} onClick={onPauseClick} id="pause-screen-share-btn">
            {isScreenSharePaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          {actions}
          <button
            className="bg-red-500 hover:bg-red-600 text-theme-text-button py-2 px-4 rounded-lg text-sm"
            id="stop-screen-share-btn"
            onClick={() => toggleScreenShare()}
          >
            {stopShareButtonText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ShareBarBase;
