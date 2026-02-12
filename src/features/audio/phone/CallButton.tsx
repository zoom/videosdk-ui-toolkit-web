import React from "react";
import { useTranslation } from "react-i18next";
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
  callText,
}) => {
  const { t } = useTranslation();
  const displayCallText = callText || t("phone.call");
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
          {displayCallText}
        </button>
      ) : (
        <button
          className="w-full bg-red-500 text-theme-text-button py-2 px-4 rounded-md hover:bg-red-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={onCancel}
        >
          {t("phone.cancel_call")}
        </button>
      )}
    </div>
  );
};

export const getDialoutStateText = (state: DialoutState | null | any, t: (key: string) => string): string => {
  switch (state) {
    case DialoutState.Calling:
      return t("phone.calling");
    case DialoutState.Ringing:
      return t("phone.ringing");
    case DialoutState.Accepted:
      return t("phone.call_accepted");
    case DialoutState.Fail:
      return t("phone.call_failed");
    case DialoutState.Canceled:
      return t("phone.call_cancelled");
    case DialoutState.Busy:
      return t("phone.line_busy");
    case DialoutState.Timeout:
      return t("phone.call_timed_out");
    default:
      return state as string;
  }
};
