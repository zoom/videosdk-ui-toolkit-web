import React from "react";
import { RecordingStatus } from "@/types/index.d";
import { useISORecording } from "./hooks/useISORecording";
import { useShouldShowCloudRecordingConsent } from "./hooks/useShouldShowCloudRecordingConsent";
import { ISORecordingModal, ISORecordingBanner } from "./ISORecordingModal";
import RecordingNotification from "@/components/notification/RecordingNotification";

/**
 * Coordinates recording-related modals with clear priority:
 *   1. Cloud recording consent — must resolve first (Stay or Leave)
 *   2. Individual recording consent (Ask) — shown only after user agrees to cloud recording
 *   3. Individual recording active banner (Accept)
 *   4. Regular cloud recording notification (falls through to RecordingNotification)
 */
const RecordingModals: React.FC = () => {
  const shouldShowCloudRecordingConsent = useShouldShowCloudRecordingConsent();
  const { recordingIsoStatus, acceptISORecording, declineISORecording } = useISORecording();

  // Cloud recording consent first — if user declines (Leave), they leave the meeting
  if (shouldShowCloudRecordingConsent) {
    return <RecordingNotification />;
  }

  if (recordingIsoStatus === RecordingStatus.Ask) {
    return <ISORecordingModal onAccept={acceptISORecording} onDecline={declineISORecording} />;
  }

  if (recordingIsoStatus === RecordingStatus.Accept) {
    return <ISORecordingBanner />;
  }

  // Regular cloud recording — RecordingNotification handles its own visibility logic
  return <RecordingNotification />;
};

export default RecordingModals;
