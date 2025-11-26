import { useCallback, useContext, useEffect, useRef } from "react";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { setIsMirrorVideo } from "@/store/uiSlice";

export const useMirrorVideo = () => {
  const dispatch = useAppDispatch();
  const isMirrorVideo = useAppSelector((state) => state.ui.isMirrorVideo);
  const { stream } = useContext(StreamContext);
  const mirrorStateRef = useRef(isMirrorVideo);

  useEffect(() => {
    mirrorStateRef.current = isMirrorVideo;
  }, [isMirrorVideo]);

  useEffect(() => {
    if (!stream || typeof stream.isVideoMirrored !== "function") {
      return;
    }

    const syncMirrorFromStream = async () => {
      const mirrored = stream.isVideoMirrored();
      if (typeof mirrored !== "boolean") {
        return;
      }

      // Case 1: SDK is already mirrored, sync redux to match.
      if (mirrored && mirrored !== mirrorStateRef.current) {
        mirrorStateRef.current = mirrored;
        dispatch(setIsMirrorVideo(mirrored));
        return;
      }

      // Case 2: Redux prefers true but SDK reports false.
      // Try to push mirror=true into SDK
      if (!mirrored && mirrorStateRef.current) {
        if (typeof stream.mirrorVideo === "function") {
          try {
            await stream.mirrorVideo(true);
            return;
          } catch {
            // fall through to sync Redux with the SDK
          }
        }

        mirrorStateRef.current = false;
        dispatch(setIsMirrorVideo(false));
      }
    };

    syncMirrorFromStream();
  }, [dispatch, stream]);

  const updateMirrorVideo = useCallback(
    async (nextValue: boolean) => {
      if (!stream || typeof stream.mirrorVideo !== "function") {
        throw new Error("Mirror video API is unavailable.");
      }

      const previousValue = isMirrorVideo;
      dispatch(setIsMirrorVideo(nextValue));

      try {
        await stream.mirrorVideo(nextValue);
      } catch (error) {
        dispatch(setIsMirrorVideo(previousValue));
        throw error as Error;
      }
    },
    [dispatch, isMirrorVideo, stream],
  );

  return {
    isMirrorVideo,
    updateMirrorVideo,
    canMirrorVideo: Boolean(stream && typeof stream.mirrorVideo === "function"),
  };
};
