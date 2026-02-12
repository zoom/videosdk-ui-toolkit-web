import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { RemoteControlSessionStatus } from "@zoom/videosdk";
import { useSnackbar } from "notistack";
import { useCallback, useContext, useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";

import ShareBarBase from "@/features/share/components/ShareBarBase";

enum RemoteControlSessionState {
  Inactive = "inactive",
  Active = "active",
  Stopping = "stopping",
}

type RemoteControlSessionEvent =
  | { type: "SESSION_STARTED" }
  | { type: "SESSION_ENDED" }
  | { type: "STOP_START" }
  | { type: "STOP_DONE" }
  | { type: "RESET" };

const remoteControlSessionReducer = (state: RemoteControlSessionState, event: RemoteControlSessionEvent) => {
  switch (event.type) {
    case "SESSION_STARTED":
      return RemoteControlSessionState.Active;
    case "SESSION_ENDED":
    case "RESET":
      return RemoteControlSessionState.Inactive;
    case "STOP_START":
      return state === RemoteControlSessionState.Active ? RemoteControlSessionState.Stopping : state;
    case "STOP_DONE":
      return state === RemoteControlSessionState.Stopping ? RemoteControlSessionState.Active : state;
    default:
      return state;
  }
};

const ShareBarRemoteControl = () => {
  const { t } = useTranslation();
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const { enqueueSnackbar } = useSnackbar();
  const [sessionState, dispatchSessionState] = useReducer(
    remoteControlSessionReducer,
    RemoteControlSessionState.Inactive,
  );
  const isRemoteControlActive = sessionState !== RemoteControlSessionState.Inactive;
  const isStoppingRemoteControl = sessionState === RemoteControlSessionState.Stopping;

  useEffect(() => {
    if (!client) return;
    const onSessionStatusChange = (payload: RemoteControlSessionStatus) => {
      if (payload === RemoteControlSessionStatus.Started) {
        dispatchSessionState({ type: "SESSION_STARTED" });
        return;
      }
      if (payload === RemoteControlSessionStatus.Ended) {
        dispatchSessionState({ type: "SESSION_ENDED" });
      }
    };
    client.on("remote-control-controlled-status-change", onSessionStatusChange);
    return () => {
      client.off("remote-control-controlled-status-change", onSessionStatusChange);
    };
  }, [client]);

  const onStopRemoteControl = useCallback(async () => {
    if (!stream || isStoppingRemoteControl) return;
    dispatchSessionState({ type: "STOP_START" });
    try {
      await stream.stopRemoteControl();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
      enqueueSnackbar({ message: t("share.remote_control_stop_failed"), variant: "error" });
    } finally {
      dispatchSessionState({ type: "STOP_DONE" });
    }
  }, [enqueueSnackbar, isStoppingRemoteControl, stream, t]);

  const actions = isRemoteControlActive ? (
    <button
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg text-sm disabled:cursor-not-allowed disabled:opacity-60"
      id="stop-remote-control-btn"
      onClick={onStopRemoteControl}
      disabled={isStoppingRemoteControl}
    >
      {t("share.remote_control_stop")}
    </button>
  ) : null;

  return <ShareBarBase actions={actions} />;
};

export default ShareBarRemoteControl;
