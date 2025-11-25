import React, { useEffect, useCallback } from "react";
import { SessionClient } from "@/types";
import { setNetworkQualityMap } from "@/store/sessionSlice";

export function useNetworkQuality(client: SessionClient, sessionDispatch: React.Dispatch<any>) {
  const onNetworkQualityChange = useCallback(
    (payload: { level: number; type: string; userId: number }) => {
      if (payload.type === "uplink") {
        const payloadData = {
          userId: payload.userId,
          level: payload.level,
        };
        sessionDispatch?.(setNetworkQualityMap(payloadData));
      }
    },
    [sessionDispatch],
  );

  useEffect(() => {
    client.on("network-quality-change", onNetworkQualityChange);
    return () => {
      client.off("network-quality-change", onNetworkQualityChange);
    };
  });
}
