import { useCallback, useContext, useEffect } from "react";
import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { setCanUndo, setCanRedo, setCanDoAnnotation, resetAnnotationStates } from "@/store/uiSlice";
import { setIsAnnotationStarted } from "@/store/sessionSlice";

export const useAnnotationEvents = () => {
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const dispatch = useAppDispatch();
  const { isAnnotationStarted, isReceivingScreenShare } = useAppSelector(useSessionSelector);

  const onUndoStatusChange = useCallback(
    (payload) => {
      const { status } = payload;
      dispatch(setCanUndo(status));
    },
    [dispatch],
  );

  const onRedoStatusChange = useCallback(
    (payload) => {
      const { status } = payload;
      dispatch(setCanRedo(status));
    },
    [dispatch],
  );

  const onAnnotationViewerDrawRequest = useCallback(async () => {
    if (!isAnnotationStarted) {
      try {
        await stream?.startAnnotation();
        dispatch(setIsAnnotationStarted(true));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to start annotation:", error);
      }
    }
  }, [dispatch, isAnnotationStarted, stream]);

  const onAnnotationPrivilegeChange = useCallback(
    async (payload) => {
      const { isAnnotationEnabled } = payload;
      if (stream && isReceivingScreenShare) {
        dispatch(setCanDoAnnotation(stream?.canDoAnnotation()));
        if (isAnnotationStarted && !isAnnotationEnabled) {
          await stream?.stopAnnotation();
          dispatch(setIsAnnotationStarted(false));
          dispatch(resetAnnotationStates());
        }
      }
    },
    [dispatch, isAnnotationStarted, isReceivingScreenShare, stream],
  );

  useEffect(() => {
    client.on("annotation-undo-status", onUndoStatusChange);
    client.on("annotation-redo-status", onRedoStatusChange);
    client.on("annotation-viewer-draw-request", onAnnotationViewerDrawRequest);
    client.on("annotation-privilege-change", onAnnotationPrivilegeChange);
    return () => {
      client.off("annotation-undo-status", onUndoStatusChange);
      client.off("annotation-redo-status", onRedoStatusChange);
      client.off("annotation-viewer-draw-request", onAnnotationViewerDrawRequest);
      client.off("annotation-privilege-change", onAnnotationPrivilegeChange);
    };
  }, [client, onAnnotationPrivilegeChange, onAnnotationViewerDrawRequest, onRedoStatusChange, onUndoStatusChange]);
};
