import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useSessionSelector, useSessionUISelector, useAppDispatch } from "@/hooks/useAppSelector";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";
import { AlertCircle } from "lucide-react";
import { RecordingStatus } from "@/types/index.d";
import { useRecordingUI } from "@/features/recording/hooks/useRecordingUI";
import { ClientContext } from "@/context/client-context";
import { setHasShowRecordingAlert } from "@/store/uiSlice";

const RecordingNotification = () => {
  const { t } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { recordingStatus, hasPreconsented, isHost, isManager } = useAppSelector(useSessionSelector);
  const { hasShowRecordingAlert } = useAppSelector(useSessionUISelector);
  const { isShowRecordButton } = useRecordingUI();
  const dispatch = useAppDispatch();
  const client = useContext(ClientContext);

  const isRecording = recordingStatus === RecordingStatus.Recording;
  const isHostOrManager = isHost || isManager;

  useEffect(() => {
    initializationTimerRef.current = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);

    return () => {
      if (initializationTimerRef.current) {
        clearTimeout(initializationTimerRef.current);
      }
    };
  }, []);

  const shouldShowNotification =
    isInitialized &&
    (hasPreconsented || hasShowRecordingAlert) &&
    isRecording &&
    !isShowRecordButton &&
    !isHostOrManager;

  const handleStay = useCallback(() => {
    dispatch(setHasShowRecordingAlert(false));
  }, [dispatch]);

  const handleLeave = useCallback(() => {
    client?.leave(false);
  }, [client]);

  if (!shouldShowNotification) {
    return null;
  }

  return (
    <ConfirmDialog
      title={t("recording.notification_title")}
      message={t("recording.consent_message")}
      icon={<AlertCircle size={26} className="text-red-500 drop-shadow-sm" strokeWidth={1.5} />}
      iconClassName="bg-red-50 dark:bg-red-950/30"
      onCancel={handleLeave}
      cancelText={t("recording.notification_leave")}
      cancelVariant="secondary"
      onConfirm={handleStay}
      confirmText={t("recording.notification_stay")}
      confirmVariant="primary"
      id="uikit-recording-notification"
    />
  );
};

export default RecordingNotification;
