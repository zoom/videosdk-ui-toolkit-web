import React, { useCallback, useEffect } from "react";
import { SessionClient } from "@/types/index.d";
import { setIsSelfOnHold } from "@/features/hold/holdSlice";
import { readIsSelfOnHold } from "@/features/hold/util";

/**
 * Tracks whether the local user is waiting to be admitted.
 *
 * The `on-hold-change` event only ever describes the local user, so this is the participant-side
 * signal. The listener is registered on mount — before `join()` — so no event is missed, and the
 * initial read is best-effort because the SDK throws if hold state is read before the client has
 * joined. See {@link readHoldState}.
 *
 *
 * @param client - The session client.
 * @param dispatch - The Redux dispatch function.
 */
export function useHoldChange(client: SessionClient, dispatch: React.Dispatch<any>) {
  const onHoldChange = useCallback(
    (payload: { isOnHold: boolean }) => {
      if (payload?.isOnHold) {
        dispatch(setIsSelfOnHold(true));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (readIsSelfOnHold(client)) {
      dispatch(setIsSelfOnHold(true));
    }

    client.on("on-hold-change", onHoldChange);
    return () => {
      client.off("on-hold-change", onHoldChange);
    };
  }, [client, dispatch, onHoldChange]);
}
