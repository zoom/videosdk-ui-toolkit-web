import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/widget/CommonButton";
import { translateSubsessionName } from "../utils/translateSubsessionName";

export const RoomConfirm = ({ isOpen, onClose, onConfirm, roomName, action }) => {
  const { t } = useTranslation();
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Get translated action text
  const getActionText = () => {
    switch (action) {
      case "Join":
        return t("subsession.join_button");
      default:
        return action;
    }
  };

  const actionText = getActionText();
  const translatedRoomName = translateSubsessionName(roomName, t);
  const confirmMessage =
    action === "Join"
      ? t("subsession.join_room__confirm_tip_sdk", { roomName: translatedRoomName })
      : t("subsession.room_action_confirm_tip", { action: actionText, roomName: translatedRoomName });

  return (
    <div
      ref={dialogRef}
      className="relative right-0 border border-gray-200 rounded-md shadow-lg p-4 z-10 w-full justify-center"
    >
      <p className="mb-4">{confirmMessage}</p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={onClose} id={`uikit-subsession-room-confirm-cancel-button`}>
          {t("common.cancel")}
        </Button>
        <Button variant="primary" size="sm" onClick={onConfirm} id={`uikit-subsession-room-confirm-confirm-button`}>
          {actionText}
        </Button>
      </div>
    </div>
  );
};

export default RoomConfirm;
