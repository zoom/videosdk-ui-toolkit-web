import { useEffect, useState, useCallback, useRef } from "react";
import { SessionClient } from "@/types/index";

export function useCurrentAudioLevel(sessionClient: SessionClient, currentUserId: number, muted: boolean) {
  const [level, setLevel] = useState(0);
  const timerRef = useRef<number>();
  const onActiveSpeakerChange = useCallback(
    (payload: { level: number }) => {
      if (!muted) {
        setLevel(payload.level);
      }
    },
    [muted],
  );
  useEffect(() => {
    if (level) {
      timerRef.current = window.setTimeout(() => {
        setLevel(0);
        timerRef.current = 0;
      }, 3000);
    }
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [level]);
  useEffect(() => {
    sessionClient.on("current-audio-level-change", onActiveSpeakerChange);
    return () => {
      sessionClient.off("current-audio-level-change", onActiveSpeakerChange);
    };
  }, [sessionClient, onActiveSpeakerChange]);
  return level;
}
