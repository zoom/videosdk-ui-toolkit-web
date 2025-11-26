import { useState } from "react";
import { Button } from "@/components/widget/CommonButton";

export const BroadcastDialog = ({ isOpen, onClose, onSend }) => {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  return (
    <div className="relative bottom-full left-0 bg-theme-surface border border-theme-border text-theme-text rounded-md shadow-lg p-4 z-10 w-full pb-2">
      <h4 className="font-semibold mb-2">Broadcast Message</h4>
      <textarea
        className="w-full h-24 p-2 border border-theme-border text-theme-text bg-theme-background rounded-md mb-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        id="uikit-subsession-broadcast-dialog-message-input"
      />
      <div className="flex justify-center space-x-2">
        <Button variant="outline" size="sm" onClick={onClose} id="uikit-subsession-broadcast-dialog-cancel-button">
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSend(message)}
          id="uikit-subsession-broadcast-dialog-send-button"
        >
          Send
        </Button>
      </div>
    </div>
  );
};
