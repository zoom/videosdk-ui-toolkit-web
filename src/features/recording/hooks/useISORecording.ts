import { useCallback, useContext, useEffect, useState } from "react";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { ClientContext } from "@/context/client-context";
import SessionAdditionalContext from "@/context/session-additional-context";
import { RecordingStatus } from "@/types/index.d";

export const useISORecording = () => {
  const client = useContext(ClientContext);
  const { recordingClient } = useContext(SessionAdditionalContext);
  const { userId, isHost, isManager } = useAppSelector(useSessionSelector);
  const [recordingIsoStatus, setRecordingIsoStatus] = useState<RecordingStatus | null>(null);

  const handleISORecordingChange = useCallback(
    (payload: { state?: RecordingStatus; status?: RecordingStatus; userId?: number }) => {
      // Runtime payload uses `status` field at runtime (SDK types incorrectly declare `state`)
      const isoStatus = payload?.state ?? payload?.status;
      // Filter to events for the current user (event broadcasts to all participants)
      if (payload?.userId !== undefined && payload.userId !== userId) return;
      // Host initiated the recording — they do not need to consent
      if (isoStatus === RecordingStatus.Ask && (isHost || isManager)) return;
      switch (isoStatus) {
        case RecordingStatus.Ask:
          setRecordingIsoStatus(RecordingStatus.Ask);
          break;
        case RecordingStatus.Accept:
          setRecordingIsoStatus(RecordingStatus.Accept);
          break;
        case RecordingStatus.Decline:
          setRecordingIsoStatus(null);
          break;
        default:
          break;
      }
    },
    [userId, isHost, isManager],
  );

  // Clear local ISO status when the host stops the cloud recording session
  const handleRecordingChange = useCallback((status: RecordingStatus) => {
    if (status === RecordingStatus.Stopped) {
      setRecordingIsoStatus(null);
    }
  }, []);

  useEffect(() => {
    if (!client) return;

    client.on("individual-recording-change", handleISORecordingChange);
    client.on("recording-change", handleRecordingChange);

    return () => {
      client.off("individual-recording-change", handleISORecordingChange);
      client.off("recording-change", handleRecordingChange);
    };
  }, [client, handleISORecordingChange, handleRecordingChange]);

  const acceptISORecording = useCallback(async () => {
    try {
      await recordingClient?.acceptIndividualRecording();
      // Optimistically show the active banner; the Accept event will confirm
      setRecordingIsoStatus(RecordingStatus.Accept);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to accept individual recording:", error);
      setRecordingIsoStatus(null);
    }
  }, [recordingClient]);

  const declineISORecording = useCallback(async () => {
    try {
      await recordingClient?.declineIndividualRecording();
      setRecordingIsoStatus(null);
    } catch (error: any) {
      // 7202 (RECORDING_MISMATCH_STATE): the SDK's state has already moved past Ask
      if (error?.errorCode !== 7202) {
        // eslint-disable-next-line no-console
        console.error("Failed to decline individual recording:", error);
      }
      setRecordingIsoStatus(null);
    }
  }, [recordingClient]);

  return {
    recordingIsoStatus,
    isISORecordingActive: recordingIsoStatus === RecordingStatus.Accept,
    acceptISORecording,
    declineISORecording,
  };
};
