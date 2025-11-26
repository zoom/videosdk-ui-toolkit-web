import { useCallback, useContext, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { ClientContext } from "@/context/client-context";
import SessionAdditionalContext from "@/context/session-additional-context";
import { RecordingStatus } from "@/types/index.d";
import { addFeature, removeFeature } from "@/store/sessionSlice";

export const useRecording = () => {
  const { recordingClient } = useContext(SessionAdditionalContext);
  const client = useContext(ClientContext);

  const session = useAppSelector(useSessionSelector);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>(RecordingStatus.Stopped);
  const dispatch = useAppDispatch();
  const isHostOrManager = session.isHost || session.isManager;

  const updateRecordingStatus = useCallback(() => {
    if (!recordingClient) return;

    const canRecord = recordingClient.canStartRecording();

    if (canRecord) {
      if (!session.featuresOptions?.recording) {
        dispatch(addFeature("recording"));
      }
      const status = recordingClient.getCloudRecordingStatus();
      setRecordingStatus(status);
    } else {
      dispatch(removeFeature("recording"));
    }
  }, [dispatch, recordingClient, session.featuresOptions?.recording]);

  useEffect(() => {
    updateRecordingStatus();

    if (client) {
      const handleRecordingChange = ({ state }: { state: RecordingStatus }) => {
        setRecordingStatus(state);
        updateRecordingStatus();
      };

      client.on("recording-change", handleRecordingChange);

      return () => {
        client.off("recording-change", handleRecordingChange);
      };
    }
  }, [client, updateRecordingStatus]);

  const isRecording = recordingStatus === RecordingStatus.Recording;
  const isPaused = recordingStatus === RecordingStatus.Paused;
  const isRecordingSessionActive = isRecording || isPaused;

  const startRecording = useCallback(async () => {
    if (recordingClient?.canStartRecording()) {
      try {
        await recordingClient?.startCloudRecording();
        updateRecordingStatus();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to start recording:", error);
      }
    }
  }, [recordingClient, updateRecordingStatus]);

  const stopRecording = useCallback(async () => {
    if (recordingClient && isRecordingSessionActive) {
      try {
        await recordingClient?.stopCloudRecording();
        setRecordingStatus(RecordingStatus.Stopped);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to stop recording:", error);
      }
    }
  }, [recordingClient, isRecordingSessionActive]);

  const pauseRecording = useCallback(async () => {
    if (recordingClient && isRecording) {
      try {
        await recordingClient.pauseCloudRecording();
        updateRecordingStatus();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to pause recording:", error);
      }
    }
  }, [recordingClient, isRecording, updateRecordingStatus]);

  const resumeRecording = useCallback(async () => {
    if (recordingClient && isPaused) {
      try {
        await recordingClient.resumeCloudRecording();
        updateRecordingStatus();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to resume recording:", error);
      }
    }
  }, [recordingClient, isPaused, updateRecordingStatus]);

  return {
    recordingStatus,
    isRecording,
    isPaused,
    isRecordingSessionActive,
    isHostOrManager,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
};
