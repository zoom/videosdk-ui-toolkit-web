import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsSettingsOpen, setSettingsActiveTab } from "@/store/uiSlice";
import { useCallback, useRef } from "react";
import Draggable from "react-draggable";

const PlaybackBar = () => {
  const { isMediaFilePlaying } = useAppSelector(useSessionSelector);
  const { isSettingsOpen } = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();
  const nodeRef = useRef(null);
  const openVideoPlaybackSettings = useCallback(() => {
    dispatch(setSettingsActiveTab("playback"));
    dispatch(setIsSettingsOpen(true));
  }, [dispatch]);

  if (!isMediaFilePlaying || isSettingsOpen) return null;
  return (
    <div className="fixed">
      <Draggable bounds="body" defaultPosition={{ x: (window.innerWidth - 400) / 2, y: 100 }} nodeRef={nodeRef}>
        <div
          className="flex justify-between items-center gap-2 bg-theme-surface border border-theme-divider rounded-lg py-2 px-4 shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-opacity-70 backdrop-blur-sm w-[350px]"
          ref={nodeRef}
        >
          <div>
            <span className="text-sm font-bold">Media file is playing</span>
          </div>
          <button
            className="bg-blue-500 text-theme-text-button p-2 rounded-md text-sm"
            onClick={openVideoPlaybackSettings}
          >
            Open Settings
          </button>
        </div>
      </Draggable>
    </div>
  );
};

export default PlaybackBar;
