import React from "react";
import { useTranslation } from "react-i18next";
import { Video } from "lucide-react";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";

interface ISORecordingModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const ISORecordingBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-theme-surface border border-theme-border rounded-lg py-2 px-4 shadow-lg backdrop-blur-sm"
      id="uikit-iso-recording-banner"
      role="status"
      aria-live="polite"
    >
      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" aria-hidden="true" />
      <span className="text-sm font-medium text-theme-text">{t("recording.iso_recording_active")}</span>
    </div>
  );
};

export const ISORecordingModal: React.FC<ISORecordingModalProps> = ({ onAccept, onDecline }) => {
  const { t } = useTranslation();

  return (
    <ConfirmDialog
      id="uikit-iso-recording-consent"
      title={t("recording.iso_consent_title")}
      message={t("recording.iso_consent_message")}
      icon={<Video size={26} className="text-blue-500 drop-shadow-sm" strokeWidth={1.5} />}
      iconClassName="bg-blue-50 dark:bg-blue-950/30"
      onConfirm={onAccept}
      confirmText={t("recording.iso_consent_allow")}
      confirmVariant="primary"
      confirmId="uikit-iso-recording-allow"
      onCancel={onDecline}
      cancelText={t("recording.iso_consent_decline")}
      cancelId="uikit-iso-recording-decline"
    />
  );
};

export default ISORecordingModal;
