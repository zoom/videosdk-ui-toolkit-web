import React, { useEffect, useCallback, useRef } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { SessionClient } from "@/types";
import { setNetworkQualityMap } from "@/store/sessionSlice";

const UNSTABLE_NETWORK_TOAST_INTERVAL = 60000;

export function useNetworkQuality(client: SessionClient, sessionDispatch: React.Dispatch<any>) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const lastUnstableToastTime = useRef(0);
  const onNetworkQualityChange = useCallback(
    (payload: { level: number; type: string; userId: number }) => {
      if (payload.type === "uplink") {
        const payloadData = {
          userId: payload.userId,
          level: payload.level,
        };
        sessionDispatch?.(setNetworkQualityMap(payloadData));
      }
      // 0 and 1 are bad, -1 is unknown
      const isUnstable = payload.level >= 0 && payload.level <= 1;
      if (
        isUnstable &&
        payload.userId === client.getCurrentUserInfo()?.userId &&
        Date.now() - lastUnstableToastTime.current > UNSTABLE_NETWORK_TOAST_INTERVAL
      ) {
        lastUnstableToastTime.current = Date.now();
        enqueueSnackbar(t("notification.network_unstable"), { variant: "warning" });
      }
    },
    [client, enqueueSnackbar, sessionDispatch, t],
  );

  useEffect(() => {
    client.on("network-quality-change", onNetworkQualityChange);
    return () => {
      client.off("network-quality-change", onNetworkQualityChange);
    };
  });
}
