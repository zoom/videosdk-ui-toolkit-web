import { useContext, useMemo } from "react";
import sessionAdditionalContext from "@/context/session-additional-context";
import { useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { RecordingStatus } from "@/types/index.d";

export const useRecordingUI = () => {
  const { isHost, isManager, recordingStatus } = useAppSelector(useSessionSelector);
  const { hasShowRecordingAlert } = useAppSelector(useSessionUISelector);
  const { recordingClient } = useContext(sessionAdditionalContext);

  const coOrHost = isHost || isManager;
  const isCloudRecording = recordingStatus === RecordingStatus.Recording;
  const isCloudRecordingPaused = recordingStatus === RecordingStatus.Paused;

  const isShowRecordButton = useMemo(
    () => coOrHost && !isCloudRecording && !isCloudRecordingPaused,
    [coOrHost, isCloudRecordingPaused, isCloudRecording],
  );

  const isShowPauseRecording = useMemo(() => coOrHost && isCloudRecording, [coOrHost, isCloudRecording]);
  const isShowResumeRecording = useMemo(() => coOrHost && isCloudRecordingPaused, [coOrHost, isCloudRecordingPaused]);

  const isShowStopRecording = useMemo(
    () => coOrHost && (isCloudRecording || isCloudRecordingPaused),
    [coOrHost, isCloudRecordingPaused, isCloudRecording],
  );

  const recordingControlsMenu = useMemo(
    () =>
      [
        isShowPauseRecording && {
          text: "Pause Recording",
          onClick: () => recordingClient?.pauseCloudRecording(),
        },
        isShowResumeRecording && {
          text: "Resume Recording",
          onClick: () => recordingClient?.startCloudRecording(),
        },
        isShowStopRecording && {
          text: "Stop Recording",
          onClick: () => recordingClient?.stopCloudRecording(),
        },
      ].filter(Boolean) as any[],
    [isShowPauseRecording, isShowResumeRecording, isShowStopRecording, recordingClient],
  );

  return {
    isShowRecordButton,
    isShowPauseRecording,
    isShowResumeRecording,
    isShowStopRecording,
    recordingControlsMenu,
  };
};
