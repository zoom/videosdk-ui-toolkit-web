import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

import CommonNotification from "@/components/widget/CommonNotification";
import { detectOS } from "@/components/util/platform";
import { getRemoteControlEnabled } from "@/components/util/util";
import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { RemoteControlAppStatus, RemoteControlSessionStatus } from "@zoom/videosdk";

type RemoteControlRequestPayload = {
  userId: number;
  displayName: string;
  isSharingEntireScreen: boolean;
};

const shouldPromptForApp = (status: RemoteControlAppStatus) => {
  return (
    status === RemoteControlAppStatus.Uninstalled ||
    status === RemoteControlAppStatus.Unlaunched ||
    status === RemoteControlAppStatus.Unknown
  );
};

const RemoteControlConsentNotification = (props: {
  requestorName: string;
  onDecline: () => void;
  onApprove: (runAsAdmin: boolean) => void;
  isPending: boolean;
}) => {
  const { t } = useTranslation();
  const [runAsAdmin, setRunAsAdmin] = useState(false);
  const isWindows = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const [os] = detectOS();
    return /^windows/i.test(os);
  }, []);

  return (
    <CommonNotification isOpen={true} onClose={props.onDecline} width={420} height={"auto"}>
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-semibold text-theme-text">
            {t("notification.remote_control_request_title", { requestorName: props.requestorName })}
          </h2>
          <p className="text-sm text-theme-text">{t("notification.remote_control_content")}</p>
          {isWindows && (
            <label className="flex items-center gap-2 text-sm text-theme-text">
              <input type="checkbox" checked={runAsAdmin} onChange={(event) => setRunAsAdmin(event.target.checked)} />
              <span>{t("notification.remote_control_run_as_admin_label")}</span>
            </label>
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-4 pb-2">
          <button
            className="px-4 py-2 text-theme-text bg-theme-background rounded hover:bg-theme-background-hover transition-colors border border-theme-border whitespace-nowrap disabled:opacity-50"
            onClick={props.onDecline}
            disabled={props.isPending}
          >
            {t("notification.remote_control_decline")}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-theme-text-button rounded hover:bg-blue-700 transition-colors border border-theme-border whitespace-nowrap disabled:opacity-50"
            onClick={() => props.onApprove(runAsAdmin)}
            disabled={props.isPending}
          >
            {t("notification.remote_control_allow")}
          </button>
        </div>
      </div>
    </CommonNotification>
  );
};

const RemoteControlAppRequiredNotification = (props: {
  requestorName: string;
  appStatus: RemoteControlAppStatus;
  hasDownloadedApp: boolean;
  onDecline: () => void;
  onApprove: () => void;
  isPending: boolean;
}) => {
  const { t } = useTranslation();
  const title = t("notification.remote_control_request_title", { requestorName: props.requestorName });
  const content = t("notification.remote_control_app_uninstalled_content");
  const primaryLabel =
    props.hasDownloadedApp || props.appStatus === RemoteControlAppStatus.Unlaunched
      ? t("notification.remote_control_app_launch")
      : t("notification.remote_control_app_download");

  return (
    <CommonNotification isOpen={true} onClose={props.onDecline} width={460} height={"auto"} allowClose={true}>
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-semibold text-theme-text">{title}</h2>
          <p className="text-sm text-theme-text">{content}</p>
        </div>
        <div className="flex justify-end space-x-2 mt-4 pb-2">
          <button
            className="px-4 py-2 text-theme-text bg-theme-background rounded hover:bg-theme-background-hover transition-colors border border-theme-border whitespace-nowrap disabled:opacity-50"
            onClick={props.onDecline}
            disabled={props.isPending}
          >
            {t("notification.remote_control_decline")}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-theme-text-button rounded hover:bg-blue-700 transition-colors border border-theme-border whitespace-nowrap disabled:opacity-50"
            onClick={props.onApprove}
            disabled={props.isPending}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </CommonNotification>
  );
};

const RemoteControlNotifications = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const { featuresOptions } = useAppSelector(useSessionSelector);
  const isRemoteControlFeatureEnabled = getRemoteControlEnabled(featuresOptions);

  const [requestingUser, setRequestingUser] = useState<{ userId: number; displayName: string } | null>(null);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [appStatus, setAppStatus] = useState<RemoteControlAppStatus | null>(null);
  const [hasDownloadedApp, setHasDownloadedApp] = useState(false);
  const [isConsentActionPending, setIsConsentActionPending] = useState(false);
  const [isAppActionPending, setIsAppActionPending] = useState(false);

  const requestorName = requestingUser?.displayName || t("notification.remote_control_requestor_fallback");
  const isAppDialogOpen = appStatus !== null && shouldPromptForApp(appStatus);

  const closeConsent = useCallback(() => {
    setIsConsentOpen(false);
  }, []);

  const resetAppDialog = useCallback(() => {
    setAppStatus(null);
    setHasDownloadedApp(false);
  }, []);

  const onDeclineConsentRequest = useCallback(async () => {
    if (isConsentActionPending) return;
    if (!stream || !requestingUser?.userId) {
      closeConsent();
      resetAppDialog();
      return;
    }
    setIsConsentActionPending(true);
    try {
      await stream.declineRemoteControl(requestingUser.userId);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
    } finally {
      setIsConsentActionPending(false);
      closeConsent();
      resetAppDialog();
    }
  }, [closeConsent, isConsentActionPending, requestingUser?.userId, resetAppDialog, stream]);

  const onApproveConsentRequest = useCallback(
    async (runAsAdmin: boolean) => {
      if (isConsentActionPending) return;
      if (!stream || !requestingUser?.userId) return;
      setIsConsentActionPending(true);
      try {
        await stream.approveRemoteControl(requestingUser.userId, runAsAdmin);
        closeConsent();
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error("Failed to approve remote control:", error);
      } finally {
        setIsConsentActionPending(false);
      }
    },
    [closeConsent, isConsentActionPending, requestingUser?.userId, stream],
  );

  const onAppRequiredPrimaryAction = useCallback(async () => {
    if (isAppActionPending) return;
    if (!stream) return;
    setIsAppActionPending(true);
    try {
      if (!hasDownloadedApp && appStatus !== RemoteControlAppStatus.Unlaunched) {
        let latestUrl = "";
        try {
          latestUrl =
            typeof stream.getRemoteControlAppDownloadUrl === "function" ? stream.getRemoteControlAppDownloadUrl() : "";
        } catch {
          latestUrl = "";
        }
        if (!latestUrl) return;
        const isChrome = typeof navigator !== "undefined" && /chrome/i.test(navigator.userAgent);
        const aLink = document.createElement("a");
        aLink.href = latestUrl;
        aLink.target = isChrome ? "_self" : "_blank";
        aLink.rel = "noreferrer";
        if (!isChrome) {
          aLink.download = "true";
        }
        aLink.click();
        setHasDownloadedApp(true);
        return;
      }
      await stream.launchRemoteControlApp();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
    } finally {
      setIsAppActionPending(false);
    }
  }, [appStatus, hasDownloadedApp, isAppActionPending, stream]);

  useEffect(() => {
    if (!client || !stream || !isRemoteControlFeatureEnabled) return;

    const onRemoteControlRequest = async (payload: RemoteControlRequestPayload) => {
      if (!payload?.userId) return;

      const displayName = payload.displayName || t("notification.remote_control_requestor_fallback");
      setRequestingUser({ userId: payload.userId, displayName });
      setHasDownloadedApp(false);

      if (!payload.isSharingEntireScreen) {
        enqueueSnackbar({ message: t("notification.remote_control_entire_screen_required"), variant: "warning" });
        try {
          await stream.declineRemoteControl(payload.userId);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(e);
        } finally {
          closeConsent();
        }
        return;
      }

      setIsConsentOpen(true);
    };

    const onAppStatusChange = (payload: RemoteControlAppStatus) => {
      if (payload === RemoteControlAppStatus.Launched) {
        resetAppDialog();
        return;
      }
      setAppStatus(payload);
    };

    const onSessionStatusChange = (payload: RemoteControlSessionStatus) => {
      if (payload === RemoteControlSessionStatus.Ended) {
        closeConsent();
        resetAppDialog();
      }
    };

    client.on("remote-control-request-change", onRemoteControlRequest);
    client.on("remote-control-app-status-change", onAppStatusChange);
    client.on("remote-control-controlled-status-change", onSessionStatusChange);
    return () => {
      client.off("remote-control-request-change", onRemoteControlRequest);
      client.off("remote-control-app-status-change", onAppStatusChange);
      client.off("remote-control-controlled-status-change", onSessionStatusChange);
    };
  }, [client, closeConsent, enqueueSnackbar, isRemoteControlFeatureEnabled, resetAppDialog, stream, t]);

  if (!isRemoteControlFeatureEnabled) return null;

  return (
    <>
      {isConsentOpen && (
        <RemoteControlConsentNotification
          requestorName={requestorName}
          onDecline={onDeclineConsentRequest}
          onApprove={onApproveConsentRequest}
          isPending={isConsentActionPending}
        />
      )}
      {isAppDialogOpen && (
        <RemoteControlAppRequiredNotification
          requestorName={requestorName}
          appStatus={appStatus ?? RemoteControlAppStatus.Unknown}
          hasDownloadedApp={hasDownloadedApp}
          onDecline={onDeclineConsentRequest}
          onApprove={onAppRequiredPrimaryAction}
          isPending={isAppActionPending}
        />
      )}
    </>
  );
};

export default RemoteControlNotifications;
