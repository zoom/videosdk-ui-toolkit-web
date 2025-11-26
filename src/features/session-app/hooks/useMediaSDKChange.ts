import React, { useEffect, useCallback } from "react";
import { MediaFailedPayload, SessionClient } from "../../../types";
import {
  setIsEnableHardwareAccelerationReceiving,
  setIsEnableHardwareAccelerationSending,
  setIsStartedHardwareAcceleration,
  setMediaError,
} from "@/store/uiSlice";
import { MediaStatePayload, setMediaState } from "@/features/media/mediaSlice";

export function useMediaSDKChange(client: SessionClient, dispatch: React.Dispatch<any>) {
  const onMediaSDKChange = useCallback(
    async (payload: any) => {
      const { action, type, result } = payload;
      dispatch(
        setMediaState({
          type: `${type}-${action}`,
          payload: result === "success",
        } as MediaStatePayload),
      );
      if (type === "video" && result === "success") {
        const stream = client.getMediaStream();
        if (action === "encode") {
          const result = await stream.enableHardwareAcceleration({
            encode: true,
          });
          if (result) {
            dispatch?.(setIsEnableHardwareAccelerationSending(true));
          }
          dispatch?.(setIsStartedHardwareAcceleration(true));
        } else if (action === "decode") {
          const result = await stream.enableHardwareAcceleration({
            decode: true,
          });
          if (result) {
            dispatch?.(setIsEnableHardwareAccelerationReceiving(true));
          }
        }
      }
    },
    [client, dispatch],
  );

  const handleMediaFailed = useCallback(
    (payload: MediaFailedPayload) => {
      dispatch(
        setMediaError({
          errorCode: payload.code,
          reason: payload.message,
          type: payload.type,
        }),
      );
    },
    [dispatch],
  );

  const handleErrorRetry = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    if (!client) return;

    client.on("media-sdk-change", onMediaSDKChange);
    client.on("active-media-failed", handleMediaFailed);

    return () => {
      client.off("media-sdk-change", onMediaSDKChange);
      client.off("active-media-failed", handleMediaFailed);
    };
  }, [client, onMediaSDKChange, handleMediaFailed]);

  return {
    onRetry: handleErrorRetry,
    clearError: useCallback(() => {
      dispatch(
        setMediaError({
          errorCode: "",
          reason: "",
          type: "",
        }),
      );
    }, [dispatch]),
  };
}
