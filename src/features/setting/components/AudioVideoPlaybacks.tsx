import React, { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "@/components/widget/CommonButton";
import CommonPlaybacks, { Playback } from "./CommonPlaybacks";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import {
  setAudioPlaybackFile,
  setIsMediaFilePlaying,
  setIsUseVideoFileAudio,
  setVideoPlaybackFile,
} from "@/store/sessionSlice";
import { MediaPlaybackFile } from "@zoom/videosdk";
import { setPrevActiveCamera, setPrevActiveMicrophone } from "@/store/uiSlice";
import { AudioVideoPlaybacks as AudioVideoPlaybacksType } from "@/types";

const VideoPlaybacks: React.FC<{
  selectedVideo: string;
  selectedVideoName: string;
  customVideoFile: File | null;
  onVideoChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onCustomVideoFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCustomVideo: () => void;
  useZoomNoiseSuppression: boolean;
  onZoomNoiseSuppressionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  audioVideoPlaybacks: AudioVideoPlaybacksType[];
}> = ({
  selectedVideo,
  selectedVideoName,
  customVideoFile,
  onVideoChange,
  onCustomVideoFileChange,
  onRemoveCustomVideo,
  useZoomNoiseSuppression,
  onZoomNoiseSuppressionChange,
  disabled = false,
  audioVideoPlaybacks,
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <CommonPlaybacks
        label={t("settings.video_playback_label")}
        playbacks={audioVideoPlaybacks}
        selectedPlayback={selectedVideo}
        selectedName={selectedVideoName}
        customFile={customVideoFile}
        onPlaybackChange={onVideoChange}
        onCustomFileChange={onCustomVideoFileChange}
        onRemoveCustomFile={onRemoveCustomVideo}
        acceptedFormats="video/*,.mp4,.webm,.ogg"
        disabled={disabled}
      />
    </div>
  );
};

const AudioPlaybacks: React.FC<{
  selectedAudio: string;
  selectedAudioName: string;
  customAudioFile: File | null;
  onAudioChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onCustomAudioFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCustomAudio: () => void;
  useZoomNoiseSuppression: boolean;
  onZoomNoiseSuppressionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  audioVideoPlaybacks: AudioVideoPlaybacksType[];
}> = ({
  selectedAudio,
  selectedAudioName,
  customAudioFile,
  onAudioChange,
  onCustomAudioFileChange,
  onRemoveCustomAudio,
  useZoomNoiseSuppression,
  onZoomNoiseSuppressionChange,
  disabled = false,
  audioVideoPlaybacks,
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <CommonPlaybacks
        label={t("settings.audio_playback_label")}
        playbacks={audioVideoPlaybacks}
        selectedPlayback={selectedAudio}
        selectedName={selectedAudioName}
        customFile={customAudioFile}
        onPlaybackChange={onAudioChange}
        onCustomFileChange={onCustomAudioFileChange}
        onRemoveCustomFile={onRemoveCustomAudio}
        acceptedFormats="audio/*,.mp3,.wav,.ogg"
        disabled={disabled}
      />
    </div>
  );
};

interface AudioVideoPlaybacksProps {
  showAudioPlaybacks?: boolean;
  showVideoPlaybacks?: boolean;
  showCheckbox?: boolean;
}

const AudioVideoPlaybacks: React.FC<AudioVideoPlaybacksProps> = ({
  showAudioPlaybacks = true,
  showVideoPlaybacks = true,
  showCheckbox = false,
}) => {
  const { t } = useTranslation();
  const [customVideoFile, setCustomVideoFile] = useState<File | null>(null);
  const [customAudioFile, setCustomAudioFile] = useState<File | null>(null);
  const [selectedVideoName, setSelectedVideoName] = useState<string>("");
  const [selectedAudioName, setSelectedAudioName] = useState<string>("");
  const [useZoomNoiseSuppressionVideo, setUseZoomNoiseSuppressionVideo] = useState(false);
  const [useZoomNoiseSuppressionAudio, setUseZoomNoiseSuppressionAudio] = useState(false);

  const {
    isMuted,
    audioPlaybackFile,
    videoPlaybackFile,
    isUseVideoFileAudio,
    isMediaFilePlaying,
    config: {
      featuresOptions: { playback },
    },
  } = useAppSelector(useSessionSelector);
  const { activeMicrophone, activeCamera, prevActiveCamera, prevActiveMicrophone } =
    useAppSelector(useSessionUISelector);

  const dispatch = useAppDispatch();
  const { stream } = useContext(StreamContext);

  const handleVideoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    dispatch(setVideoPlaybackFile(newValue));
    setSelectedVideoName(event.target.options[event.target.selectedIndex].text);
    if (isUseVideoFileAudio) {
      dispatch(setAudioPlaybackFile(newValue));
      setSelectedAudioName(event.target.options[event.target.selectedIndex].text);
    }
  };
  const handleAudioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    dispatch(setAudioPlaybackFile(newValue));
    setSelectedAudioName(event.target.options[event.target.selectedIndex].text);
    if (customAudioFile) {
      setCustomAudioFile(null);
    }
  };

  const handleApplyBothChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      dispatch(setIsUseVideoFileAudio(isChecked));

      if (isChecked) {
        dispatch(setAudioPlaybackFile(videoPlaybackFile));
        setSelectedAudioName(selectedVideoName);

        if (isMediaFilePlaying && videoPlaybackFile && stream) {
          const audioSourceObj: MediaPlaybackFile = {
            url: videoPlaybackFile,
            loop: true,
          };
          if (!prevActiveMicrophone) {
            dispatch(setPrevActiveMicrophone(activeMicrophone));
          }
          await stream.switchMicrophone(audioSourceObj);
        }
      } else {
        if (isMediaFilePlaying && stream) {
          await stream.switchMicrophone(prevActiveMicrophone);
        }
        dispatch(setAudioPlaybackFile(""));
        setSelectedAudioName("");
      }
    },
    [
      dispatch,
      selectedVideoName,
      videoPlaybackFile,
      isMediaFilePlaying,
      stream,
      activeMicrophone,
      prevActiveMicrophone,
    ],
  );

  const handlePlaybackToggle = useCallback(async () => {
    if (stream) {
      if (isMediaFilePlaying) {
        if (videoPlaybackFile) {
          await stream.switchCamera(prevActiveCamera);
          dispatch(setVideoPlaybackFile(""));
        }
        if (audioPlaybackFile) {
          await stream.switchMicrophone(prevActiveMicrophone);
          dispatch(setAudioPlaybackFile(""));
        }
      } else {
        if (videoPlaybackFile) {
          const videoSourceObj: MediaPlaybackFile = {
            url: videoPlaybackFile,
            loop: true,
          };
          dispatch(setPrevActiveCamera(activeCamera));
          await stream.switchCamera(videoSourceObj);
        }
        if (audioPlaybackFile) {
          const audioSourceObj: MediaPlaybackFile = {
            url: audioPlaybackFile,
            loop: true,
          };
          dispatch(setPrevActiveMicrophone(activeMicrophone));
          await stream.switchMicrophone(audioSourceObj);
        }
      }
      dispatch(setIsMediaFilePlaying(!isMediaFilePlaying));
    }
  }, [
    stream,
    isMediaFilePlaying,
    dispatch,
    videoPlaybackFile,
    audioPlaybackFile,
    activeCamera,
    activeMicrophone,
    prevActiveCamera,
    prevActiveMicrophone,
  ]);

  const handleCustomVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setCustomVideoFile(file);
      dispatch(setVideoPlaybackFile(URL.createObjectURL(file)));
      setSelectedVideoName(file.name);
      if (isUseVideoFileAudio) {
        setCustomAudioFile(file);
        dispatch(setAudioPlaybackFile(URL.createObjectURL(file)));
        setSelectedAudioName(file.name);
      }
    }
  };

  const handleCustomAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setCustomAudioFile(file);
      dispatch(setAudioPlaybackFile(URL.createObjectURL(file)));
      setSelectedAudioName(file.name);
    }
  };

  const handleRemoveCustomVideo = () => {
    setCustomVideoFile(null);
    dispatch(setVideoPlaybackFile(""));
    setSelectedVideoName("");
    if (isUseVideoFileAudio) {
      dispatch(setAudioPlaybackFile(""));
      setSelectedAudioName("");
    }
  };

  const handleRemoveCustomAudio = () => {
    setCustomAudioFile(null);
    dispatch(setAudioPlaybackFile(""));
    setSelectedAudioName("");
  };

  const handleZoomNoiseSuppressionVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseZoomNoiseSuppressionVideo(event.target.checked);
  };

  const handleZoomNoiseSuppressionAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseZoomNoiseSuppressionAudio(event.target.checked);
  };

  if (!playback.audioVideoPlaybacks.length) {
    return <div className="space-y-4">{t("settings.playback_files_empty")}</div>;
  }
  return (
    <div className="space-y-4">
      {showVideoPlaybacks && (
        <VideoPlaybacks
          audioVideoPlaybacks={playback.audioVideoPlaybacks}
          selectedVideo={videoPlaybackFile}
          selectedVideoName={selectedVideoName}
          customVideoFile={customVideoFile}
          onVideoChange={handleVideoChange}
          onCustomVideoFileChange={handleCustomVideoFileChange}
          onRemoveCustomVideo={handleRemoveCustomVideo}
          useZoomNoiseSuppression={useZoomNoiseSuppressionVideo}
          onZoomNoiseSuppressionChange={handleZoomNoiseSuppressionVideoChange}
          disabled={isMediaFilePlaying}
        />
      )}
      {showAudioPlaybacks && (
        <>
          <AudioPlaybacks
            audioVideoPlaybacks={playback.audioVideoPlaybacks}
            selectedAudio={audioPlaybackFile}
            selectedAudioName={selectedAudioName}
            customAudioFile={customAudioFile}
            onAudioChange={handleAudioChange}
            onCustomAudioFileChange={handleCustomAudioFileChange}
            onRemoveCustomAudio={handleRemoveCustomAudio}
            useZoomNoiseSuppression={useZoomNoiseSuppressionAudio}
            onZoomNoiseSuppressionChange={handleZoomNoiseSuppressionAudioChange}
            disabled={isUseVideoFileAudio || isMediaFilePlaying}
          />
          {showCheckbox && (
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm ">
                <input
                  type="checkbox"
                  checked={isUseVideoFileAudio}
                  onChange={handleApplyBothChange}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                {t("settings.playback_apply_both")}
              </label>
            </div>
          )}
        </>
      )}
      <div className="flex justify-end">
        <CommonButton
          onClick={handlePlaybackToggle}
          disabled={!audioPlaybackFile && !videoPlaybackFile}
          className="px-4 py-2 bg-blue-500 text-theme-text-button rounded hover:bg-blue-600"
        >
          {isMediaFilePlaying ? t("settings.playback_stop") : t("settings.playback_start")}
        </CommonButton>
      </div>
    </div>
  );
};

export default AudioVideoPlaybacks;
