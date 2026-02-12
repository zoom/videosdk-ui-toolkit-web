import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import sessionAdditionalContext from "@/context/session-additional-context";
import { useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { RecordingStatus } from "@/types/index.d";

export const useRecordingUI = () => {
  const { t } = useTranslation();
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
          text: t("recording.pause_recording"),
          onClick: () => recordingClient?.pauseCloudRecording(),
        },
        isShowResumeRecording && {
          text: t("recording.resume_recording"),
          onClick: () => recordingClient?.startCloudRecording(),
        },
        isShowStopRecording && {
          text: t("recording.stop_recording"),
          onClick: () => recordingClient?.stopCloudRecording(),
        },
      ].filter(Boolean) as any[],
    [isShowPauseRecording, isShowResumeRecording, isShowStopRecording, recordingClient, t],
  );

  return {
    isShowRecordButton,
    isShowPauseRecording,
    isShowResumeRecording,
    isShowStopRecording,
    recordingControlsMenu,
  };
};
