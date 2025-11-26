import React from "react";
import { DialoutState } from "@zoom/videosdk";

interface CallButtonProps {
  isCalling: boolean;
  isCallButtonDisabled: boolean;
  onCall: () => void;
  onCancel: () => void;
  callText?: string;
}

export const CallButton: React.FC<CallButtonProps> = ({
  isCalling,
  isCallButtonDisabled,
  onCall,
  onCancel,
  callText = "Call",
}) => {
  return (
    <div className="flex gap-2">
      {!isCalling ? (
        <button
          className={`w-full bg-blue-500 text-theme-text-button py-2 px-4 rounded-md hover:bg-blue-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isCallButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isCallButtonDisabled}
          onClick={onCall}
        >
          {callText}
        </button>
      ) : (
        <button
          className="w-full bg-red-500 text-theme-text-button py-2 px-4 rounded-md hover:bg-red-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={onCancel}
        >
          Cancel Call
        </button>
      )}
    </div>
  );
};

export const getDialoutStateText = (state: DialoutState | null | any): string => {
  switch (state) {
    case DialoutState.Calling:
      return "Calling...";
    case DialoutState.Ringing:
      return "Ringing...";
    case DialoutState.Accepted:
      return "Call accepted";
    case DialoutState.Fail:
      return "Call failed";
    case DialoutState.Canceled:
      return "Call cancelled";
    case DialoutState.Busy:
      return "Line is busy";
    case DialoutState.Timeout:
      return "Call timed out";
    default:
      return state as string;
  }
};
