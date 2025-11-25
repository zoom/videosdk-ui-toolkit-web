import { useEffect, useRef, useCallback } from "react";
import { useMount } from "./useMount";
import { SessionClient, Participant } from "../types";
export function useParticipantsChange(sessionClient: SessionClient, fn: (participants: Participant[]) => void) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const callback = useCallback(() => {
    const participants = sessionClient.getAllUser();
    fnRef.current?.(participants);
  }, [sessionClient]);
  useEffect(() => {
    sessionClient.on("user-added", callback);
    sessionClient.on("user-removed", callback);
    sessionClient.on("user-updated", callback);
    return () => {
      sessionClient.off("user-added", callback);
      sessionClient.off("user-removed", callback);
      sessionClient.off("user-updated", callback);
    };
  }, [sessionClient, callback]);
  useMount(() => {
    callback();
  });
}
