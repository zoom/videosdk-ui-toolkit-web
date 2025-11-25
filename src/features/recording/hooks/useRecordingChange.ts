import React, { useEffect, useCallback } from "react";
import { RecordingStatus, SessionClient } from "@/types/index.d";
import { setRecordingStatus } from "@/store/sessionSlice";
import { setHasShowRecordingAlert } from "@/store/uiSlice";

export function useRecordingChange(sessionClient: SessionClient, dispatch: React.Dispatch<any>) {
  const onRecordingChange = useCallback(
    (status: RecordingStatus) => {
      dispatch(setRecordingStatus(status));
      if (status === RecordingStatus.Recording) {
        dispatch(setHasShowRecordingAlert(true));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    sessionClient.on("recording-change", onRecordingChange);

    return () => {
      sessionClient.off("recording-change", onRecordingChange);
    };
  }, [sessionClient, onRecordingChange]);
}
