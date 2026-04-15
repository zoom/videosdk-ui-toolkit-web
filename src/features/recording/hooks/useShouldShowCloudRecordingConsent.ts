import { useState, useEffect, useRef } from "react";
import { useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { RecordingStatus } from "@/types/index.d";

export const useShouldShowCloudRecordingConsent = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { recordingStatus, hasPreconsented, isHost, isManager } = useAppSelector(useSessionSelector);
  const { hasShowRecordingAlert } = useAppSelector(useSessionUISelector);

  useEffect(() => {
    initializationTimerRef.current = setTimeout(() => setIsInitialized(true), 1000);
    return () => {
      if (initializationTimerRef.current) clearTimeout(initializationTimerRef.current);
    };
  }, []);

  const isRecording = recordingStatus === RecordingStatus.Recording;
  const isCloudRecordingPaused = recordingStatus === RecordingStatus.Paused;
  const isHostOrManager = isHost || isManager;
  const isShowRecordButton = isHostOrManager && !isRecording && !isCloudRecordingPaused;
  return (
    isInitialized &&
    (hasPreconsented || hasShowRecordingAlert) &&
    isRecording &&
    !isShowRecordButton &&
    !isHostOrManager
  );
};
