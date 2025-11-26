import React, { useEffect, useRef } from "react";
import { Button } from "@/components/widget/CommonButton";

export const RoomConfirm = ({ isOpen, onClose, onConfirm, roomName, action }) => {
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

  return (
    <div
      ref={dialogRef}
      className="relative right-0 border border-gray-200 rounded-md shadow-lg p-4 z-10 w-full justify-center"
    >
      <p className="mb-4">
        {action} {roomName}?
      </p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={onClose} id={`uikit-subsession-room-confirm-cancel-button`}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={onConfirm} id={`uikit-subsession-room-confirm-confirm-button`}>
          {action}
        </Button>
      </div>
    </div>
  );
};

export default RoomConfirm;
