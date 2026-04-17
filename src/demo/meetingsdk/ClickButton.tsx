import React from "react";
import { getJwtToken, getNewUrl, validateForm } from "./CopyLink";
import { FormData } from "./types";
import { createMeetingIframe, removeMeetingIframe } from "../iframe";

// Define button configuration types
interface ButtonConfig {
  id: string;
  label: string;
  onClick: () => Promise<void>;
}

interface ClickButtonProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setErrors: (errors: { displayName: string; meetingNumber: string }) => void;
  sdkKey: string;
  sdkSecret: string;
  disableClick: boolean;
  disableTitle: string;
  saveFormDataToLocalStorage: (formData: FormData) => void;
}

// Constants for button definitions
const BUTTON_TYPES = {
  COPY_NAV_LINK: "copy_nav_link",
  COPY_JOIN_LINK: "copy_join_link",
  JOIN_MEETING: "joinMeeting",
  JOIN_MEETING_NO_TAB: "joinMeeting2",
  JOIN_MEETING_IFRAME: "joinMeetingIframe",
  CLOSE_MEETING_IFRAME: "closeMeetingIframe",
  CLEAR_ALL: "clearAll",
} as const;

const BUTTON_LABELS = {
  [BUTTON_TYPES.COPY_NAV_LINK]: "copy nav",
  [BUTTON_TYPES.COPY_JOIN_LINK]: "copy join link",
  [BUTTON_TYPES.JOIN_MEETING]: "Join Meeting",
  [BUTTON_TYPES.JOIN_MEETING_NO_TAB]: "Join Meeting no tab",
  [BUTTON_TYPES.JOIN_MEETING_IFRAME]: "Join Iframe",
  [BUTTON_TYPES.CLOSE_MEETING_IFRAME]: "Close Iframe",
  [BUTTON_TYPES.CLEAR_ALL]: "Clear",
} as const;

export const ClickButton: React.FC<ClickButtonProps> = ({
  formData,
  setFormData,
  setErrors,
  sdkKey,
  sdkSecret,
  disableClick,
  disableTitle,
  saveFormDataToLocalStorage,
}) => {
  // Helper function to handle form validation
  const validateAndGetToken = async () => {
    const { isValid, errors: validationErrors } = validateForm(formData);
    if (!isValid) {
      setErrors(validationErrors as { displayName: string; meetingNumber: string });
      return null;
    }
    return await getJwtToken(formData, sdkKey, sdkSecret);
  };

  const buttons: ButtonConfig[] = [
    {
      id: BUTTON_TYPES.COPY_NAV_LINK,
      label: BUTTON_LABELS[BUTTON_TYPES.COPY_NAV_LINK],
      onClick: async () => {
        try {
          const token = await validateAndGetToken();
          if (!token) return;

          setFormData((prev) => ({ ...prev, zoomSignatureToken: token }));
          const navLink = getNewUrl(formData, token, sdkKey, sdkSecret);
          await navigator.clipboard.writeText(navLink);

          console.log("Nav link copied to clipboard!");
        } catch (error) {
          console.error("Error:", error);

          console.log("Failed to generate nav link");
        }
      },
    },
    {
      id: BUTTON_TYPES.COPY_JOIN_LINK,
      label: BUTTON_LABELS[BUTTON_TYPES.COPY_JOIN_LINK],
      onClick: async () => {
        const { isValid, errors: validationErrors } = validateForm(formData);
        if (!isValid) {
          setErrors(validationErrors as { displayName: string; meetingNumber: string });
          return;
        }

        try {
          const token = await getJwtToken(formData, sdkKey, sdkSecret);
          setFormData((prev) => ({ ...prev, signatureToken: token }));
          const joinLink = getNewUrl(formData, token, sdkKey, sdkSecret);
          await navigator.clipboard.writeText(joinLink);

          console.log("Join link copied to clipboard!: ", joinLink);
        } catch (error) {
          console.error("Error:", error);

          console.log("Failed to generate join link");
        }
      },
    },
    {
      id: BUTTON_TYPES.JOIN_MEETING,
      label: BUTTON_LABELS[BUTTON_TYPES.JOIN_MEETING],
      onClick: async () => {
        const { isValid, errors: validationErrors } = validateForm(formData);
        if (!isValid) {
          setErrors(validationErrors as { displayName: string; meetingNumber: string });
          return;
        }

        try {
          const token = await getJwtToken(formData, sdkKey, sdkSecret);
          setFormData((prev) => ({ ...prev, signatureToken: token }));
          saveFormDataToLocalStorage(formData);
          const joinUrl = getNewUrl(formData, token, sdkKey, sdkSecret);

          // Try to open in new tab, fallback to same window if blocked
          const newWindow = window.open(joinUrl, "_blank");
          if (newWindow === null) {
            // If popup was blocked, open in same window

            console.log("Popup was blocked - opening in same window");
            window.location.href = joinUrl;
          }
        } catch (error) {
          console.error("Error:", error);

          console.log("Failed to join meeting");
        }
      },
    },
    {
      id: BUTTON_TYPES.JOIN_MEETING_NO_TAB,
      label: BUTTON_LABELS[BUTTON_TYPES.JOIN_MEETING_NO_TAB],
      onClick: async () => {
        const { isValid, errors: validationErrors } = validateForm(formData);
        if (!isValid) {
          setErrors(validationErrors as { displayName: string; meetingNumber: string });
          return;
        }

        try {
          const token = await getJwtToken(formData, sdkKey, sdkSecret);
          setFormData((prev) => ({ ...prev, signatureToken: token }));
          saveFormDataToLocalStorage(formData);
          const joinUrl = getNewUrl(formData, token, sdkKey, sdkSecret);
          window.location.href = joinUrl;
        } catch (error) {
          console.error("Error:", error);

          console.log("Failed to join meeting");
        }
      },
    },
    {
      id: BUTTON_TYPES.JOIN_MEETING_IFRAME,
      label: BUTTON_LABELS[BUTTON_TYPES.JOIN_MEETING_IFRAME],
      onClick: async () => {
        const { isValid, errors: validationErrors } = validateForm(formData);
        if (!isValid) {
          setErrors(validationErrors as { displayName: string; meetingNumber: string });
          return;
        }

        try {
          const token = await getJwtToken(formData, sdkKey, sdkSecret);
          setFormData((prev) => ({ ...prev, signatureToken: token }));
          saveFormDataToLocalStorage(formData);
          const joinUrl = getNewUrl(formData, token, sdkKey, sdkSecret);
          createMeetingIframe(joinUrl, formData.iframeSize.value, `Iframe Join Meeting ${formData.meetingNumber}`);
        } catch (error) {
          console.error("Error:", error);

          console.log("Failed to join meeting");
        }
      },
    },
  ];

  const renderButton = ({ id, label, onClick }: ButtonConfig) => (
    <button
      key={id}
      id={id}
      type="button"
      className={`
        flex-1 py-2 px-4 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
        transition-colors duration-300 
        ${disableClick ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} 
        text-white
      `}
      onClick={onClick}
      disabled={disableClick}
      title={disableTitle}
    >
      {label}
    </button>
  );

  return <div className="flex flex-wrap gap-4 mt-6">{buttons.map(renderButton)}</div>;
};

export default ClickButton;
