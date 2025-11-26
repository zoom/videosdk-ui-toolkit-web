import React, { useEffect } from "react";
import AudioVideoPlaybacks from "./AudioVideoPlaybacks";
import { useCurrentUser } from "@/features/participant/hooks";
import { isSupportVideoPlayback } from "@/components/util/service";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { setAudioPlaybackFile, setIsUseVideoFileAudio, setVideoPlaybackFile } from "@/store/sessionSlice";
import { THEME_COLOR_CLASS } from "@/constant";

const PlaybackSettings = () => {
  const currentUser = useCurrentUser();
  const isStartedVideo = currentUser?.bVideoOn;
  const isMuted = currentUser?.muted === undefined ? true : currentUser?.muted;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isMuted || !isSupportVideoPlayback(isStartedVideo)) {
      dispatch(setIsUseVideoFileAudio(false));
      if (isMuted) {
        dispatch(setAudioPlaybackFile(""));
      }
      if (!isSupportVideoPlayback(isStartedVideo)) {
        dispatch(setVideoPlaybackFile(""));
      }
    }
  }, [dispatch, isMuted, isStartedVideo]);

  if (!isStartedVideo && isMuted) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-sm ">Please turn on your mic or camera to access this feature</span>
      </div>
    );
  }
  return (
    <div className={`${THEME_COLOR_CLASS}`}>
      <AudioVideoPlaybacks
        showAudioPlaybacks={!isMuted}
        showVideoPlaybacks={isSupportVideoPlayback(isStartedVideo)}
        showCheckbox={!isMuted && isSupportVideoPlayback(isStartedVideo)}
      />
      <div className="flex items-center justify-center mt-10 px-4">
        <span className="text-sm ">Note: Mic and Camera buttons will be disabled when media file is selected.</span>
      </div>
    </div>
  );
};

export default PlaybackSettings;
