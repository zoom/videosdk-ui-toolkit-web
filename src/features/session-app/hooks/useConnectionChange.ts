import React, { useEffect, useCallback } from "react";
import { SessionClient, SessionStatus } from "../../../types/index.d";
import { resetAudioConsentForAdmission, setMaximumVideosInGalleryView } from "@/store/uiSlice";
import { setReconnectInfo, setIsJoinResolved, setSessionStatus } from "@/store/sessionSlice";
import { resetHold, setIsSelfOnHold } from "@/features/hold/holdSlice";
import { readIsSelfOnHoldIfReady } from "@/features/hold/util";
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

        if (payload.reason === "on hold") {
          dispatch(resetAudioConsentForAdmission());
          dispatch(setIsJoinResolved(true));
        }
        // resetApiProps();
        // Dispatched after resetApp, which resets the session slice, so the reason survives and the
        // UI can explain the transition (for example moving into or out of a subsession).
        dispatch(setReconnectInfo({ reason: payload.reason, subsessionName: payload.subsessionName }));
      } else if (payload.state === SessionStatus.Closed) {
        dispatch(setReconnectInfo({}));
        dispatch(setSessionStatus(SessionStatus.Closed));
        dispatch(resetHold());
        sessionStorage.removeItem("UIKIT_SDK_MAXIMUM_VIDEOS");
        emit(ExposedEvents.EVENT_SESSION_CLOSED, "closed");
      } else if (payload.state === SessionStatus.Connected) {
        dispatch(setReconnectInfo({}));
        dispatch(setSessionStatus(SessionStatus.Connected));
        setupApp();

        const isOnHold = readIsSelfOnHoldIfReady(client);
        if (isOnHold !== undefined) {
          dispatch(setIsSelfOnHold(isOnHold));
        }

        const sessionValue = sessionStorage.getItem("UIKIT_SDK_MAXIMUM_VIDEOS");
        const maxVideos = sessionValue && Number(sessionValue) ? Number(sessionValue) : undefined;
        if (maxVideos) {
          dispatch(setMaximumVideosInGalleryView(Math.min(maxVideos, 25)));
        }
        emit(ExposedEvents.EVENT_SESSION_JOINED, "joined");
      } else if (payload.state === SessionStatus.Fail) {
        dispatch(setReconnectInfo({}));
        dispatch(setSessionStatus(SessionStatus.Fail));
        emit(ExposedEvents.EVENT_SESSION_FAILED, "failed");
      }
    },
    [client, resetApp, dispatch, setupApp],
  );

  useEffect(() => {
    client.on("connection-change", onConnectionChange);
    return () => {
      client.off("connection-change", onConnectionChange);
    };
  }, [client, onConnectionChange]);
}
