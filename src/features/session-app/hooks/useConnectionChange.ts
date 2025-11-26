import React, { useEffect, useCallback } from "react";
import { SessionClient, SessionStatus } from "../../../types/index.d";
import { setMaximumVideosInGalleryView } from "@/store/uiSlice";
import { setSessionStatus } from "@/store/sessionSlice";
import { ExposedEvents } from "@/events/event-constant";
import { emit } from "@/events/event-bus";

export function useConnectionChange(
  client: SessionClient,
  dispatch: React.Dispatch<any>,
  setupApp: () => void,
  resetApp: () => void,
  // apiProps: ApiPropsType
) {
  // const { updateDownLoadedVbImageList, resetApiProps } = apiProps;
  const onConnectionChange = useCallback(
    async (payload: any) => {
      if (payload.state === SessionStatus.Reconnecting) {
        // eslint-disable-next-line no-console
        console.log("reconnecting", payload);
        emit(ExposedEvents.EVENT_SESSION_RECONNECTING, "reconnecting");
        resetApp();
        // resetApiProps();
      } else if (payload.state === SessionStatus.Closed) {
        dispatch(setSessionStatus(SessionStatus.Closed));
        sessionStorage.removeItem("UIKIT_SDK_MAXIMUM_VIDEOS");
        emit(ExposedEvents.EVENT_SESSION_CLOSED, "closed");
      } else if (payload.state === SessionStatus.Connected) {
        dispatch(setSessionStatus(SessionStatus.Connected));
        setupApp();

        const sessionValue = sessionStorage.getItem("UIKIT_SDK_MAXIMUM_VIDEOS");
        const maxVideos = sessionValue && Number(sessionValue) ? Number(sessionValue) : undefined;
        if (maxVideos) {
          dispatch(setMaximumVideosInGalleryView(Math.min(maxVideos, 25)));
        }
        emit(ExposedEvents.EVENT_SESSION_JOINED, "joined");
      } else if (payload.state === SessionStatus.Fail) {
        dispatch(setSessionStatus(SessionStatus.Fail));
        emit(ExposedEvents.EVENT_SESSION_FAILED, "failed");
      }
    },
    [resetApp, dispatch, setupApp],
  );

  useEffect(() => {
    client.on("connection-change", onConnectionChange);
    return () => {
      client.off("connection-change", onConnectionChange);
    };
  }, [client, onConnectionChange]);
}
