import { ClientContext } from "@/context/client-context";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { setLiveStreamStatus } from "@/store/sessionSlice";
import { LiveStreamStatus } from "@zoom/videosdk";
import { useSnackbar } from "notistack";
import { useEffect, useCallback, useContext } from "react";

export const useLiveStreamChange = () => {
  const dispatch = useAppDispatch();
  const client = useContext(ClientContext);

  const { enqueueSnackbar } = useSnackbar();

  const onLiveStreamStatusChange = useCallback(
    (status: LiveStreamStatus) => {
      dispatch(setLiveStreamStatus(status));
      if (status === LiveStreamStatus.Timeout) {
        enqueueSnackbar("Start live streaming timeout", {
          variant: "error",
          autoHideDuration: 5000,
        });
      }
    },
    [dispatch, enqueueSnackbar],
  );

  useEffect(() => {
    client.on("live-stream-status", onLiveStreamStatusChange);
    return () => {
      client.off("live-stream-status", onLiveStreamStatusChange);
    };
  }, [client, onLiveStreamStatusChange]);
};
