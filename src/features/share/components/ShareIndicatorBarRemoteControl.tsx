import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { setIsOriginalShareContentSize } from "@/store/uiSlice";
import { ApprovedState, RemoteControlSessionStatus } from "@zoom/videosdk";
import { useSnackbar } from "notistack";
import { useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { useTranslation } from "react-i18next";

import ShareIndicatorBarBase from "@/features/share/components/ShareIndicatorBarBase";

enum RemoteControlState {
  Idle = "idle",
  Requesting = "requesting",
  Active = "active",
  Controlling = "controlling",
  PendingGrab = "pending-grab",
  PendingGiveUp = "pending-give-up",
}

type RemoteControlEvent =
  | { type: "REQUEST_START" }
  | { type: "REQUEST_FAILED" }
  | { type: "APPROVED" }
  | { type: "START_FAILED" }
  | { type: "REJECTED" }
  | { type: "SESSION_ENDED" }
  | { type: "IN_CONTROL_TRUE" }
  | { type: "IN_CONTROL_FALSE" }
  | { type: "GRAB_START" }
  | { type: "GRAB_DONE" }
  | { type: "GIVEUP_START" }
  | { type: "GIVEUP_DONE" }
  | { type: "GIVEUP_FAILED" }
  | { type: "RESET" };

const remoteControlReducer = (state: RemoteControlState, event: RemoteControlEvent) => {
  switch (event.type) {
    case "REQUEST_START":
      return state === RemoteControlState.Idle ? RemoteControlState.Requesting : state;
    case "REQUEST_FAILED":
    case "REJECTED":
    case "START_FAILED":
    case "SESSION_ENDED":
    case "RESET":
      return RemoteControlState.Idle;
    case "APPROVED":
      return RemoteControlState.Active;
    case "IN_CONTROL_TRUE":
      return RemoteControlState.Controlling;
    case "IN_CONTROL_FALSE":
      if (state === RemoteControlState.Idle || state === RemoteControlState.Requesting) {
        return state;
      }
      return RemoteControlState.Active;
    case "GRAB_START":
      return RemoteControlState.PendingGrab;
    case "GRAB_DONE":
      return state === RemoteControlState.PendingGrab ? RemoteControlState.Active : state;
    case "GIVEUP_START":
      return RemoteControlState.PendingGiveUp;
    case "GIVEUP_DONE":
      return RemoteControlState.Idle;
    case "GIVEUP_FAILED":
      return RemoteControlState.Controlling;
    default:
      return state;
  }
};

const ShareIndicatorBarRemoteControl = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const { activeShareId, userId } = useAppSelector(useSessionSelector);
  const dispatch = useAppDispatch();

  const [remoteControlState, dispatchRemoteControl] = useReducer(remoteControlReducer, RemoteControlState.Idle);
  const isRemoteControlRequesting = remoteControlState === RemoteControlState.Requesting;
  const isRemoteControlActionPending =
    remoteControlState === RemoteControlState.PendingGrab || remoteControlState === RemoteControlState.PendingGiveUp;
  const isRemoteControlInControl =
    remoteControlState === RemoteControlState.Controlling || remoteControlState === RemoteControlState.PendingGiveUp;
  const isRemoteControlSessionActive =
    remoteControlState !== RemoteControlState.Idle && remoteControlState !== RemoteControlState.Requesting;

  const isRemoteControlSupported = useMemo(() => {
    if (!stream || activeShareId === 0) return false;
    if (typeof stream.isRemoteControlEnabled === "function" && !stream.isRemoteControlEnabled()) return false;
    if (typeof stream.isTargetShareSupportRemoteControl !== "function") return false;
    return stream.isTargetShareSupportRemoteControl(activeShareId);
  }, [activeShareId, stream]);

  const handleRemoteControlClick = useCallback(async () => {
    if (!stream) return;

    if (!isRemoteControlSessionActive) {
      if (!isRemoteControlSupported) {
        enqueueSnackbar({ message: t("share.remote_control_not_supported"), variant: "warning" });
        return;
      }
      if (isRemoteControlRequesting) return;
      dispatchRemoteControl({ type: "REQUEST_START" });
      try {
        await stream.requestRemoteControl();
      } catch (e) {
        dispatchRemoteControl({ type: "REQUEST_FAILED" });
        // eslint-disable-next-line no-console
        console.warn(e);
        enqueueSnackbar({ message: t("share.remote_control_request_failed"), variant: "error" });
      }
      return;
    }

    if (isRemoteControlInControl) {
      if (isRemoteControlActionPending) return;
      dispatchRemoteControl({ type: "GIVEUP_START" });
      try {
        await stream.giveUpRemoteControl();
        dispatchRemoteControl({ type: "GIVEUP_DONE" });
      } catch (e) {
        dispatchRemoteControl({ type: "GIVEUP_FAILED" });
        // eslint-disable-next-line no-console
        console.warn(e);
        enqueueSnackbar({ message: t("share.remote_control_give_up_failed"), variant: "error" });
      }
    } else {
      if (isRemoteControlActionPending) return;
      dispatchRemoteControl({ type: "GRAB_START" });
      try {
        await stream.grabRemoteControl();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
        enqueueSnackbar({ message: t("share.remote_control_grab_failed"), variant: "warning" });
      } finally {
        dispatchRemoteControl({ type: "GRAB_DONE" });
      }
    }
  }, [
    enqueueSnackbar,
    isRemoteControlInControl,
    isRemoteControlSessionActive,
    isRemoteControlSupported,
    stream,
    t,
    isRemoteControlRequesting,
    isRemoteControlActionPending,
  ]);

  const handleBeforeSetOriginalSize = useCallback(() => {
    if (isRemoteControlInControl) {
      enqueueSnackbar({ message: t("share.remote_control_fit_required"), variant: "info" });
      return false;
    }
    return true;
  }, [enqueueSnackbar, isRemoteControlInControl, t]);

  useEffect(() => {
    if (!client || !stream) return;

    const onApprovedChange = async (payload: { state: ApprovedState }) => {
      if (payload?.state === ApprovedState.Approved) {
        const canvas = document.getElementById("ZOOM_VIDEO_SDK_RECEIVE_SHARE_CANVAS") as HTMLElement | null;
        if (!canvas) {
          enqueueSnackbar({ message: t("share.remote_control_canvas_missing"), variant: "warning" });
          dispatchRemoteControl({ type: "START_FAILED" });
          return;
        }
        dispatch(setIsOriginalShareContentSize(false));
        try {
          await stream.startRemoteControl(canvas);
          dispatchRemoteControl({ type: "APPROVED" });
        } catch (e) {
          dispatchRemoteControl({ type: "START_FAILED" });
          // eslint-disable-next-line no-console
          console.warn(e);
          enqueueSnackbar({ message: t("share.remote_control_start_failed"), variant: "error" });
        }
      } else {
        dispatchRemoteControl({ type: "REJECTED" });
        enqueueSnackbar({ message: t("share.remote_control_rejected"), variant: "warning" });
      }
    };

    const onInControlChange = (payload: { isControlling: boolean }) => {
      if (payload?.isControlling) {
        dispatchRemoteControl({ type: "IN_CONTROL_TRUE" });
        dispatch(setIsOriginalShareContentSize(false));
      } else {
        dispatchRemoteControl({ type: "IN_CONTROL_FALSE" });
      }
    };

    const onSessionStatusChange = (payload: RemoteControlSessionStatus) => {
      if (payload === RemoteControlSessionStatus.Ended) {
        dispatchRemoteControl({ type: "SESSION_ENDED" });
      }
    };

    client.on("remote-control-approved-change", onApprovedChange);
    client.on("remote-control-in-control-change", onInControlChange);
    client.on("remote-control-controlled-status-change", onSessionStatusChange);
    return () => {
      client.off("remote-control-approved-change", onApprovedChange);
      client.off("remote-control-in-control-change", onInControlChange);
      client.off("remote-control-controlled-status-change", onSessionStatusChange);
    };
  }, [client, dispatch, enqueueSnackbar, stream, t]);

  useEffect(() => {
    if (!isRemoteControlSessionActive || !stream) return;
    const canvas = document.getElementById("ZOOM_VIDEO_SDK_RECEIVE_SHARE_CANVAS") as HTMLElement | null;
    if (!canvas) return;

    const onViewportClick = async (event: MouseEvent) => {
      if (!isRemoteControlSessionActive) return;
      if (isRemoteControlInControl) return;
      if (typeof stream.isControllingUserRemotely === "function" && stream.isControllingUserRemotely()) return;
      if (isRemoteControlActionPending) return;

      event.preventDefault();
      event.stopPropagation();
      dispatchRemoteControl({ type: "GRAB_START" });
      try {
        await stream.grabRemoteControl();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
        enqueueSnackbar({ message: t("share.remote_control_grab_failed"), variant: "warning" });
      } finally {
        dispatchRemoteControl({ type: "GRAB_DONE" });
      }
    };

    canvas.addEventListener("click", onViewportClick, true);
    return () => {
      canvas.removeEventListener("click", onViewportClick, true);
    };
  }, [
    enqueueSnackbar,
    isRemoteControlActionPending,
    isRemoteControlInControl,
    isRemoteControlSessionActive,
    stream,
    t,
  ]);

  useEffect(() => {
    return () => {
      dispatchRemoteControl({ type: "RESET" });
    };
  }, []);

  const remoteControlButtonLabel = isRemoteControlRequesting
    ? t("share.remote_control_requesting")
    : !isRemoteControlSessionActive
      ? t("share.remote_control_request")
      : isRemoteControlInControl
        ? t("share.remote_control_give_up")
        : t("share.remote_control_grab");

  const actions =
    isRemoteControlSupported && userId !== activeShareId ? (
      <button
        className="uikit-share-bar-no-drag rounded-lg bg-theme-surface px-2 py-1 text-sm font-medium text-theme-text hover:bg-theme-background border border-theme-border disabled:opacity-50"
        onClick={handleRemoteControlClick}
        disabled={isRemoteControlRequesting || isRemoteControlActionPending}
        title={t("share.remote_control_title")}
      >
        {remoteControlButtonLabel}
      </button>
    ) : null;

  return <ShareIndicatorBarBase actions={actions} onBeforeSetOriginalSize={handleBeforeSetOriginalSize} />;
};

export default ShareIndicatorBarRemoteControl;
