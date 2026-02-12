import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/widget/CommonButton";

export const BroadcastDialog = ({ isOpen, onClose, onSend }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  return (
    <div className="relative bottom-full left-0 bg-theme-surface border border-theme-border text-theme-text rounded-md shadow-lg p-4 z-10 w-full pb-2">
      <h4 className="font-semibold mb-2">{t("subsession.broadcast_message_title")}</h4>
      <textarea
        className="w-full h-24 p-2 border border-theme-border text-theme-text bg-theme-background rounded-md mb-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t("subsession.broadcast_placeholder")}
        id="uikit-subsession-broadcast-dialog-message-input"
      />
      <div className="flex justify-center space-x-2">
        <Button variant="outline" size="sm" onClick={onClose} id="uikit-subsession-broadcast-dialog-cancel-button">
          {t("common.cancel")}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSend(message)}
          id="uikit-subsession-broadcast-dialog-send-button"
        >
          {t("settings.send")}
        </Button>
      </div>
    </div>
  );
};
