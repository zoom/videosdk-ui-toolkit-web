import { useContext, useEffect, useCallback } from "react";
import { ClientContext } from "@/context/client-context";
import { useSnackbar } from "notistack";
import { AudioChangeAction, MutedSource } from "@zoom/videosdk";

export function useAudioChange() {
  const client = useContext(ClientContext);
  const { enqueueSnackbar } = useSnackbar();
  const mutedNotification1 = "The host muted you";
  const mutedNotification2 = "The host muted everyone";

  const onAudioChange = useCallback(
    (payload: any) => {
      if (payload.action === AudioChangeAction.Muted && payload.source === MutedSource.PassiveByMuteOne) {
        enqueueSnackbar(mutedNotification1, { variant: "info" });
      }
      if (payload.action === AudioChangeAction.Muted && payload.source === MutedSource.PassiveByMuteAll) {
        enqueueSnackbar(mutedNotification2, { variant: "info" });
      }
    },
    [enqueueSnackbar, mutedNotification1, mutedNotification2],
  );

  useEffect(() => {
    client.on("current-audio-change", onAudioChange);
    return () => {
      client.off("current-audio-change", onAudioChange);
    };
  }, [client, onAudioChange]);
}
