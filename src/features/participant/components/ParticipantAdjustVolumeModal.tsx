import React, { useState, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StreamContext } from "@/context/stream-context";

interface ParticipantAdjustVolumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userID: number;
  displayName: string;
}

const ParticipantAdjustVolumeModal: React.FC<ParticipantAdjustVolumeModalProps> = ({
  isOpen,
  onClose,
  userID,
  displayName,
}) => {
  // Call all hooks before any conditional returns (React Hooks rules)
  const { t } = useTranslation();
  const { stream } = useContext(StreamContext);
  const [volumeLevel, setVolumeLevel] = useState<number>(stream.getUserVolumeLocally(userID));
  const handleVolumeLevelChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      await stream?.adjustUserAudioVolumeLocally(userID, +event.currentTarget.value);
      setVolumeLevel(stream?.getUserVolumeLocally(userID));
    },
    [stream, userID],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-theme-surface border border-theme-border text-theme-text rounded-lg shadow-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4 truncate">
          {t("participant.volume_level_title")} <span style={{ fontWeight: "Normal" }}>{displayName}:</span>
        </h2>
        <div className="mb-4">
          <input
            type="range"
            id="level"
            min="0"
            max="100"
            value={volumeLevel}
            onChange={handleVolumeLevelChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-theme-text bg-theme-surface border border-theme-border rounded-md hover:bg-theme-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t("participant.volume_done_button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantAdjustVolumeModal;
