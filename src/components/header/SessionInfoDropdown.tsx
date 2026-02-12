import React, { useState, useRef, useContext, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Check, Loader } from "lucide-react";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { isMobileDeviceNotIpad, isPortrait, UIKIT_VERSION } from "../util/service";
import { useCurrentUser } from "@/features/participant/hooks";
import { useClickOutside } from "@/hooks/useClickOutside";
import { InfoRowWithCopy } from "./SessionInfoRowWithCopy";
import { THEME_COLOR_CLASS } from "@/constant";
import ZoomVideo, { BroadcastStreamingStatus } from "@zoom/videosdk";

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
  const { t } = useTranslation();
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [trackingIdCopyState, setTrackingIdCopyState] = useState<"idle" | "copied">("idle");
  const [reportState, setReportState] = useState<"idle" | "inProgress" | "done">("idle");
  const [sessionIdCopyState, setSessionIdCopyState] = useState<"idle" | "copied">("idle");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentUser = useCurrentUser();
  const { trackingId, debug, config, channelId, broadcastStreamingStatus, isHost } = useAppSelector(useSessionSelector);
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const maxRenderableVideos = stream?.getMaxRenderableVideos?.();

  const menuRef = useClickOutside({ callback: () => onClose(), excludeRefs: [dropdownRef] });

  const inviteLink = config?.featuresOptions?.invite?.inviteLink || "";
  const broadcastLink = config?.featuresOptions?.invite?.broadcastLink || "";

  const broadcastViewingLink = useMemo(() => {
    if (!channelId) return "";

    const base = broadcastLink || window.location.href;

    try {
      const url = new URL(base);

      url.searchParams.set("channelId", channelId);

      if (config?.videoSDKJWT) {
        url.searchParams.set("signature", config.videoSDKJWT);
      }

      if (config?.webEndpoint) {
        url.searchParams.set("webEndpoint", config.webEndpoint);
      }

      if (config?.language) {
        url.searchParams.set("lang", config.language);
      }

      return url.toString();
    } catch {
      return "";
    }
  }, [channelId, broadcastLink, config?.videoSDKJWT, config?.webEndpoint, config?.language]);

  const shouldShowBroadcastInfo =
    isHost && broadcastStreamingStatus === BroadcastStreamingStatus.InProgress && !!channelId && !!broadcastViewingLink;

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
            <h3 className="text-xl font-semibold">{t("session.info_title")}</h3>

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
                  {reportState === "idle" && <span>{t("session.info_report_button")}</span>}
                  {reportState === "inProgress" && <Loader size={16} className="animate-spin" />}
                  {reportState === "done" && (
                    <span className="flex items-center">
                      {t("session.info_report_submitted")}
                      <Check size={16} />
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="space-y-4 rounded-xl p-4">
            <InfoRowWithCopy label={t("session.info_topic")} value={sessionInfo?.topic} />
            <InfoRowWithCopy label={t("session.info_session_id")} value={sessionInfo?.sessionId} isCopyable={true} />
            <InfoRowWithCopy label={t("session.info_your_name")} value={sessionInfo?.userName} />

            {sessionInfo?.password && (
              <InfoRowWithCopy label={t("session.info_password")} value={sessionInfo?.password} />
            )}
            <InfoRowWithCopy label={t("session.info_user_id")} value={currentUser?.userId.toString()} />
            {debug && (
              <div className="flex flex-col border border-red-200">
                <InfoRowWithCopy
                  label={t("session.info_environment")}
                  value={`${config?.webEndpoint || t("session.info_environment_production")} ${t("session.info_debug_only")}`}
                />
                <InfoRowWithCopy label={t("session.info_videosdk")} value={ZoomVideo?.VERSION} />
                <InfoRowWithCopy label={t("session.info_uikit")} value={UIKIT_VERSION} />
                <InfoRowWithCopy label={t("session.info_media_sdk")} value={window?.JsMediaSDK_Instance?.version} />
                {maxRenderableVideos !== undefined && (
                  <InfoRowWithCopy
                    label={t("session.info_max_renderable")}
                    value={`${maxRenderableVideos} ${t("session.info_renderable_videos")}`}
                  />
                )}
              </div>
            )}

            {trackingId && (
              <InfoRowWithCopy label={t("session.info_tracking_id")} value={trackingId} isCopyable={true} />
            )}

            {inviteLink && (
              <InfoRowWithCopy label={t("session.info_invite_link")} value={inviteLink} isCopyable={true} />
            )}
            {shouldShowBroadcastInfo && (
              <>
                <InfoRowWithCopy
                  label={t("broadcast_streaming_view_label")}
                  value={broadcastViewingLink}
                  isCopyable={true}
                />
                <InfoRowWithCopy
                  label={t("broadcast_streaming_channel_id_label")}
                  value={channelId}
                  isCopyable={true}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
