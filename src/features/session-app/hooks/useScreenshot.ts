import { useCallback, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { useSnackbar } from "notistack";
import { ClientContext } from "@/context/client-context";
export interface Toast {
  id: string;
  message: string;
}

export function useScreenshot() {
  const { featuresOptions } = useAppSelector(useSessionSelector);
  const isVideoScreenshotEnabled = featuresOptions?.screenshot?.video?.enable;
  const isShareScreenshotEnabled = featuresOptions?.screenshot?.share?.enable;

  const client = useContext(ClientContext);

  const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const onVideoScreenshotTaken = useCallback(
    ({ displayName, userId }: { displayName: string; userId: number }) => {
      enqueueSnackbar(`${displayName} took a screenshot of your video`, {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    },
    [enqueueSnackbar],
  );

  useEffect(() => {
    if (!client || !isVideoScreenshotEnabled) return;
    client.on("video-screenshot-taken", onVideoScreenshotTaken);
    return () => client.off("video-screenshot-taken", onVideoScreenshotTaken);
  }, [client, dispatch, isVideoScreenshotEnabled, onVideoScreenshotTaken]);

  const onShareScreenshotTaken = useCallback(
    ({ displayName, userId }: { displayName: string; userId: number }) => {
      enqueueSnackbar(`${displayName} took a screenshot of your shared screen.`, {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    },
    [enqueueSnackbar],
  );

  useEffect(() => {
    if (!client || !isShareScreenshotEnabled) return;
    client.on("share-content-screenshot-taken", onShareScreenshotTaken);
    return () => client.off("share-content-screenshot-taken", onShareScreenshotTaken);
  }, [client, dispatch, isShareScreenshotEnabled, onShareScreenshotTaken]);
}
