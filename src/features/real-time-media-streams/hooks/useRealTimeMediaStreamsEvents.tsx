import { RealTimeMediaStreamsClient, SessionClient } from "@/types";
import { setRtmsStatus } from "../rtmsSlice";
import { RealTimeMediaStreamsStatus } from "@zoom/videosdk";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppSelector";

export const useRealTimeMediaStreamsEvents = (
  client: SessionClient,
  realTimeMediaStreamsClient: RealTimeMediaStreamsClient | undefined,
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (client && realTimeMediaStreamsClient) {
      const onRealTimeMediaStreamsStatusChange = (status: RealTimeMediaStreamsStatus) => {
        dispatch(setRtmsStatus(status));
      };
      try {
        client.on("real-time-media-streams-status-change", onRealTimeMediaStreamsStatusChange);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error in useRealTimeMediaStreamsEvents", error);
      }
      return () => {
        client.off("real-time-media-streams-status-change", onRealTimeMediaStreamsStatusChange);
      };
    }
  }, [client, realTimeMediaStreamsClient, dispatch]);
};
