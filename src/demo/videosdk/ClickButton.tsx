import React from "react";
import { getJwtToken, getNewUrl, getWatchStreamingUrl, validateForm } from "./CopyLink";
import { FormData } from "./types";
import { createMeetingIframe, removeMeetingIframe } from "../iframe";
import { isLocalhost } from "@/components/util/platform";
interface ButtonConfig {
  id: string;
  label: string;
  onClick: () => Promise<void>;
}

interface ClickButtonProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setErrors: (errors: { displayName: string; topic: string }) => void;
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
  WATCH_STREAMING: "watchStreaming",
  CLOSE_MEETING_IFRAME: "closeMeetingIframe",
  CLEAR_ALL: "clearAll",
} as const;

const BUTTON_LABELS = {
  [BUTTON_TYPES.COPY_NAV_LINK]: "Copy Nav",
  [BUTTON_TYPES.COPY_JOIN_LINK]: "Copy Join Link",
  [BUTTON_TYPES.JOIN_MEETING]: "Join Session",
  [BUTTON_TYPES.JOIN_MEETING_NO_TAB]: "Join Session No Tab",
  [BUTTON_TYPES.JOIN_MEETING_IFRAME]: "Join Iframe",
  [BUTTON_TYPES.WATCH_STREAMING]: "Watch Streaming",
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
  const buttons: ButtonConfig[] = [
    {
      id: BUTTON_TYPES.COPY_NAV_LINK,
      label: BUTTON_LABELS[BUTTON_TYPES.COPY_NAV_LINK],
      onClick: async () => {
        const { isValid, errors: validationErrors } = validateForm(formData);
        if (!isValid) {
          setErrors(validationErrors as { displayName: string; topic: string });
          return;
        }

        try {
          let navLink = "";
          if (formData.zlkJwtToken) {
            navLink = getNewUrl(formData, formData.zlkJwtToken, sdkKey, sdkSecret);
          } else {
            const token = await getJwtToken(formData, sdkKey, sdkSecret);
            setFormData((prev) => ({ ...prev, zoomSignatureToken: token }));
            navLink = getNewUrl(formData, token, sdkKey, sdkSecret);
          }
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
          setErrors(validationErrors as { displayName: string; topic: string });
          return;
        }

        try {
          let joinLink = "";
          if (formData.zlkJwtToken) {
            joinLink = getNewUrl(formData, formData.zlkJwtToken, sdkKey, sdkSecret);
          } else {
            const token = await getJwtToken(formData, sdkKey, sdkSecret);
            setFormData((prev) => ({ ...prev, signatureToken: token }));
            joinLink = getNewUrl(formData, token, sdkKey, sdkSecret);
          }
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
          setErrors(validationErrors as { displayName: string; topic: string });
          return;
        }

        try {
          let joinUrl = "";
          if (formData.zlkJwtToken) {
            joinUrl = getNewUrl(formData, formData.zlkJwtToken, sdkKey, sdkSecret);
          } else {
            const token = await getJwtToken(formData, sdkKey, sdkSecret);
            setFormData((prev) => ({ ...prev, signatureToken: token }));
            saveFormDataToLocalStorage(formData);
            joinUrl = getNewUrl(formData, token, sdkKey, sdkSecret);
          }
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
          setErrors(validationErrors as { displayName: string; topic: string });
          return;
        }

        try {
          let joinUrl = "";
          if (formData.zlkJwtToken) {
            joinUrl = getNewUrl(formData, formData.zlkJwtToken, sdkKey, sdkSecret);
          } else {
            const token = await getJwtToken(formData, sdkKey, sdkSecret);
            joinUrl = getNewUrl(formData, token, sdkKey, sdkSecret);
          }
          saveFormDataToLocalStorage(formData);
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
          setErrors(validationErrors as { displayName: string; topic: string });
          return;
        }

        try {
          let joinUrl = "";
          if (formData.zlkJwtToken) {
            joinUrl = getNewUrl(formData, formData.zlkJwtToken, sdkKey, sdkSecret);
          } else {
            const token = await getJwtToken(formData, sdkKey, sdkSecret);
            joinUrl = getNewUrl(formData, token, sdkKey, sdkSecret);
          }
          saveFormDataToLocalStorage(formData);
          createMeetingIframe(joinUrl, formData.iframeSize?.value, `Iframe Join Session ${formData.topic}`);
        } catch (error) {
          console.error("Error:", error);

          console.log("Failed to join session");
        }
      },
    },
    {
      id: BUTTON_TYPES.WATCH_STREAMING,
      label: BUTTON_LABELS[BUTTON_TYPES.WATCH_STREAMING],
      onClick: async () => {
        const channelId = formData.channelId?.trim();
        if (!channelId) {
          console.log("Please enter a broadcast channel ID.");
          return;
        }
        try {
          let baseUrl = "";
          if (formData.zlkJwtToken) {
            baseUrl = getWatchStreamingUrl(formData, formData.zlkJwtToken, sdkKey, sdkSecret);
          } else {
            const token = await getJwtToken(formData, sdkKey, sdkSecret);
            baseUrl = getWatchStreamingUrl(formData, token, sdkKey, sdkSecret);
          }

          const url = new URL(baseUrl);
          url.searchParams.set("channelId", channelId);

          const viewerUrl = isLocalhost
            ? `${window.location.origin}${url.pathname}?${url.searchParams.toString()}`
            : url.toString();

          const newWindow = window.open(viewerUrl, "_blank");
          if (!newWindow) {
            window.location.href = viewerUrl;
          }
        } catch (error) {
          console.error("Failed to open broadcast viewer", error);
        }
      },
    },
    // {
    //   id: BUTTON_TYPES.CLOSE_MEETING_IFRAME,
    //   label: BUTTON_LABELS[BUTTON_TYPES.CLOSE_MEETING_IFRAME],
    //   onClick: async () => {
    //     removeMeetingIframe();
    //   },
    // },
    // {
    //   id: BUTTON_TYPES.CLEAR_ALL,
    //   label: BUTTON_LABELS[BUTTON_TYPES.CLEAR_ALL],
    //   onClick: async () => {
    //     setFormData({
    //       sdkKey: "",
    //       displayName: "",
    //       topic: "",
    //       password: "",
    //       version: "",
    //       role: 1,
    //       language: "",
    //       web: "",
    //       debug: "",
    //       uiKit: "",
    //       useVideoPlayer: "",
    //       cloudRecordingOption: "",
    //       cloudRecordingElection: "",
    //       customerKey: "",
    //       sessionKey: "",
    //       zlkJwtToken: "",
    //       rc: "",
    //       autoTranscription: "",
    //       enforceWebRtcAudio: "",
    //       enforceWebRtcVideo: "",
    //       geoRegions: [],
    //       telemetryId: "",
    //       mediaVersion: "",
    //       account: "",
    //       preview: "",
    //       cdn: "",
    //       corp: "",
    //       enforceGalleryView: "",
    //       enforceVirtualBackground: "",
    //       signatureToken: "",
    //       customizeLayout: "",
    //       header: "",
    //       footer: "",
    //       iframeSize: { value: "large", label: "Large" },
    //     });
    //     setErrors({ displayName: "", topic: "" });
    //     localStorage.removeItem("zoomFormData");
    //     console.log("Form data cleared");
    //   },
    // },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 w-full">
      {buttons.map(({ id, label, onClick }) => {
        return (
          <div key={id} className="w-full">
            <button
              id={id}
              type="button"
              className={`
                w-full py-2 px-4 rounded-md 
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
          </div>
        );
      })}
    </div>
  );
};

export default ClickButton;
