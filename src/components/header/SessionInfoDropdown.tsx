import React, { useState, useRef, useContext, useCallback } from "react";
import { Check, Loader } from "lucide-react";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { isMobileDeviceNotIpad, isPortrait, UIKIT_VERSION } from "../util/service";
import { useCurrentUser } from "@/features/participant/hooks";
import { useClickOutside } from "@/hooks/useClickOutside";
import { InfoRowWithCopy } from "./SessionInfoRowWithCopy";
import { THEME_COLOR_CLASS } from "@/constant";
import ZoomVideo from "@zoom/videosdk";

// Simulating the imported types and hooks for the example
type SessionInfo = {
  topic?: string;
  userName?: string;
  password?: string;
  sessionId?: string;
};

interface SessionInfoDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  sessionInfo: SessionInfo;
  themeName: string;
}

export default function SessionInfoDropdown({ isOpen, onClose, sessionInfo, themeName }: SessionInfoDropdownProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [trackingIdCopyState, setTrackingIdCopyState] = useState<"idle" | "copied">("idle");
  const [reportState, setReportState] = useState<"idle" | "inProgress" | "done">("idle");
  const [sessionIdCopyState, setSessionIdCopyState] = useState<"idle" | "copied">("idle");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentUser = useCurrentUser();
  const { trackingId, debug, config } = useAppSelector(useSessionSelector);
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const maxRenderableVideos = stream?.getMaxRenderableVideos?.();

  const menuRef = useClickOutside({ callback: () => onClose(), excludeRefs: [dropdownRef] });

  const inviteLink = config?.featuresOptions?.invite?.inviteLink || "";

  const copyToClipboard = async (copyContent: string) => {
    await navigator.clipboard.writeText(copyContent);
  };

  const reportClick = useCallback(async () => {
    if (client) {
      const loggerClient = client.getLoggerClient();
      setReportState("inProgress");
      let idsText = "";
      // Copy all IDs to clipboard
      if (config?.webEndpoint && debug) {
        idsText = [
          `Session ID: ${sessionInfo?.sessionId || ""}`,
          `User ID: ${currentUser?.userId || ""}`,
          `Tracking ID: ${trackingId || ""}`,
          `Env: ${config?.webEndpoint || "zoom.us"}`,
          `VideoSDK Version: ${ZoomVideo?.VERSION || ""}`,
          `UIKit Version: ${UIKIT_VERSION || ""}`,
          `Media SDK: ${window?.JsMediaSDK_Instance?.version || ""}`,
          `Max: ${maxRenderableVideos} Renderable Videos`,
        ].join("\n");
      } else {
        idsText = [
          `Session ID: ${sessionInfo?.sessionId || ""}`,
          `User ID: ${currentUser?.userId || ""}`,
          `Tracking ID: ${trackingId || ""}`,
        ].join("\n");
      }

      await copyToClipboard(idsText);

      await loggerClient?.reportToGlobalTracing();
      setReportState("done");
      setTimeout(() => setReportState("idle"), 2000);
    }
  }, [
    client,
    config?.webEndpoint,
    debug,
    sessionInfo?.sessionId,
    currentUser?.userId,
    trackingId,
    maxRenderableVideos,
  ]);

  if (!isOpen) return null;

  const borderColor = themeName === "dark" ? "border-solid border border-gray-100" : "";

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full left-0 m-2 min-w-[300px] ${
        isMobileDeviceNotIpad() && isPortrait() ? "max-w-[380px]" : "max-w-[500px]"
      } rounded-xl shadow-lg z-50`}
    >
      <div className={`absolute inset-0 backdrop-blur-xl rounded-xl ${THEME_COLOR_CLASS} ${borderColor}`} />

      <div
        className={`relative z-10 px-6 py-2 ${isMobileDeviceNotIpad() && !isPortrait() ? "max-h-[300px]" : ""} overflow-y-auto`}
      >
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-2 border-b border-theme-border">
            <h3 className="text-xl font-semibold">Session Information</h3>

            {/* Report Button */}
            {trackingId && (
              <div className="flex items-center justify-end mt-2">
                <button
                  className={`
                    px-5 h-8 mb-2 rounded-lg
                    font-medium text-sm
                    transition-all duration-200
                    flex items-center gap-2
                    ${
                      reportState === "idle"
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : reportState === "done"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500/50 text-white"
                    }
                    disabled:cursor-not-allowed
                    shadow-sm hover:shadow-md
                  `}
                  onClick={reportClick}
                  disabled={reportState !== "idle"}
                >
                  {reportState === "idle" && <span>Report</span>}
                  {reportState === "inProgress" && <Loader size={16} className="animate-spin" />}
                  {reportState === "done" && (
                    <span className="flex items-center">
                      Submitted
                      <Check size={16} />
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="space-y-4 rounded-xl p-4">
            <InfoRowWithCopy label="Topic" value={sessionInfo?.topic} />
            <InfoRowWithCopy label="Session ID" value={sessionInfo?.sessionId} isCopyable={true} />
            <InfoRowWithCopy label="Your Name" value={sessionInfo?.userName} />

            {sessionInfo?.password && <InfoRowWithCopy label="Password" value={sessionInfo?.password} />}
            <InfoRowWithCopy label="User ID" value={currentUser?.userId.toString()} />
            {debug && (
              <div className="flex flex-col border border-red-200">
                <InfoRowWithCopy label="Environment" value={`${config?.webEndpoint || "Production"} only debug`} />
                <InfoRowWithCopy label="VideoSDK" value={ZoomVideo?.VERSION} />
                <InfoRowWithCopy label="UIKit" value={UIKIT_VERSION} />
                <InfoRowWithCopy label="Media SDK" value={window?.JsMediaSDK_Instance?.version} />
                {maxRenderableVideos !== undefined && (
                  <InfoRowWithCopy label="Max" value={`${maxRenderableVideos} Renderable Videos`} />
                )}
              </div>
            )}

            {trackingId && <InfoRowWithCopy label="Tracking ID" value={trackingId} isCopyable={true} />}

            {inviteLink && <InfoRowWithCopy label="Invite Link" value={inviteLink} isCopyable={true} />}
          </div>
        </div>
      </div>
    </div>
  );
}
