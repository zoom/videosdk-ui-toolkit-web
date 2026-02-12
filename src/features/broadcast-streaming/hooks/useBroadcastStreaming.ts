import { setChannelId, setBroadcastStreamingStatus } from "@/store/sessionSlice";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { BroadcastStreamingStatus } from "@zoom/videosdk";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect } from "react";

export const useBroadcastStreaming = (client: any, dispatch: React.Dispatch<any>) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { broadcastStreamingStatus, isHost } = useAppSelector(useSessionSelector);
  const handleStatusChange = useCallback(
    (payload: { status: BroadcastStreamingStatus }) => {
      const status = payload?.status;
      const state = client?.getBroadcastStreamingClient?.()?.getBroadcastStreamingStatus?.();

      // If we're already Live, ignore a regression to Pending
      // to avoid flickering the "live" indicator during SDK's transient state.
      if (
        status === BroadcastStreamingStatus.Pending &&
        broadcastStreamingStatus === BroadcastStreamingStatus.InProgress
      ) {
        return;
      }

      // Keep channelId fresh even if status is unchanged.
      dispatch(setChannelId(state?.channelId ?? ""));

      const hasStatusChanged = status !== broadcastStreamingStatus;
      if (!hasStatusChanged) return;

      if (status === BroadcastStreamingStatus.Closed && broadcastStreamingStatus === BroadcastStreamingStatus.Init) {
        dispatch(setBroadcastStreamingStatus(status));
        return;
      }

      dispatch(setBroadcastStreamingStatus(status));
    },
    [broadcastStreamingStatus, client, dispatch],
  );

  useEffect(() => {
    if (!client?.on) return;

    client.on("broadcast-streaming-status", handleStatusChange);
    return () => {
      client.off("broadcast-streaming-status", handleStatusChange);
    };
  }, [client, handleStatusChange]);

  useEffect(() => {
    if (!isHost) return;
    if (broadcastStreamingStatus === BroadcastStreamingStatus.InProgress) {
      enqueueSnackbar(t("broadcast_streaming_started_toast"), { variant: "info", autoHideDuration: 2000 });
    }

    if (broadcastStreamingStatus === BroadcastStreamingStatus.Closed) {
      enqueueSnackbar(t("broadcast_streaming_ended_toast"), { variant: "info", autoHideDuration: 2000 });
    }
  }, [broadcastStreamingStatus, enqueueSnackbar, isHost, t]);
};
