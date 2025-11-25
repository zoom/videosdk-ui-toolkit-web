import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import {
  setActiveShareId,
  setActiveSharerName,
  setIsReceivingScreenShare,
  setIsScreenSharePaused,
  setIsSendingScreenShare,
  setIsAnnotationStarted,
} from "@/store/sessionSlice";
import { setIsOriginalShareContentSize, setViewType, resetAnnotationStates, setCanDoAnnotation } from "@/store/uiSlice";
import { SuspensionViewType } from "@/types/index.d";
import { VideoActiveState } from "@zoom/videosdk";
import { useEffect, useCallback, useContext, useState } from "react";
import { usePrevious } from "@/hooks/usePrevious";
import { useSubsessionRoom } from "@/features/subsession/hooks/useSubsessionRoom";
import sessionAdditionalContext from "@/context/session-additional-context";

export const useShareChange = () => {
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const { subsessionClient } = useContext(sessionAdditionalContext);
  const { activeShareId, isAnnotationStarted, isScreenSharePaused, isSendingScreenShare, isReceivingScreenShare } =
    useAppSelector(useSessionSelector);
  const dispatch = useAppDispatch();
  const participants = client.getAllUser();
  const { isInSubsession } = useSubsessionRoom();

  const [shareContentDimension, setShareContentDimension] = useState({ width: 0, height: 0 });

  // Track previous states
  const prevIsScreenSharePaused = usePrevious(isScreenSharePaused);
  const prevIsSendingScreenShare = usePrevious(isSendingScreenShare);
  const prevIsReceivingScreenShare = usePrevious(isReceivingScreenShare);
  const prevIsAnnotationStarted = usePrevious(isAnnotationStarted);

  // Memoize the share pause state
  useEffect(() => {
    const activeShareUser = participants?.find((item) => item.userId === activeShareId);
    const isSharePaused = activeShareUser?.sharerOn && activeShareUser?.sharerPause;
    if (isSharePaused !== prevIsScreenSharePaused) {
      dispatch(setIsScreenSharePaused(!!isSharePaused));
    }
  }, [participants, activeShareId, dispatch, prevIsScreenSharePaused]);

  // Update UI states when share pause state changes
  useEffect(() => {
    const handleSharePause = async () => {
      if (isAnnotationStarted && isScreenSharePaused && !prevIsScreenSharePaused) {
        await stream?.stopAnnotation();
        dispatch(setIsAnnotationStarted(false));
        dispatch(resetAnnotationStates());
      }
    };

    handleSharePause();
  }, [dispatch, isScreenSharePaused, prevIsScreenSharePaused, stream, isAnnotationStarted]);

  // Reset annotation states when screen sharing stops
  useEffect(() => {
    if (!isSendingScreenShare && isSendingScreenShare !== prevIsSendingScreenShare) {
      dispatch(setIsAnnotationStarted(false));
      dispatch(resetAnnotationStates());
    }
    if (!isReceivingScreenShare && isReceivingScreenShare !== prevIsReceivingScreenShare) {
      dispatch(setIsAnnotationStarted(false));
      dispatch(resetAnnotationStates());
    }
  }, [isSendingScreenShare, isReceivingScreenShare, prevIsSendingScreenShare, prevIsReceivingScreenShare, dispatch]);

  // Handle the case of sharing already started when the user joins the session.
  useEffect(() => {
    if (stream) {
      const currentActiveSharingUser = stream.getActiveShareUserId();
      if (currentActiveSharingUser) {
        dispatch(setActiveShareId(currentActiveSharingUser));
        const shareUserList = stream?.getShareUserList();
        const activeShareUserId = stream?.getActiveShareUserId();
        const activeShareUserInfo = shareUserList?.find((item) => item.userId === activeShareUserId) ?? undefined;
        dispatch(setActiveSharerName(activeShareUserInfo?.displayName));
        dispatch(setViewType(SuspensionViewType.Gallery));
        dispatch(setIsReceivingScreenShare(true));
      }
    }
  }, [dispatch, stream]);

  // Handles when some participant starts screen sharing 'active-share-change'
  const onActiveShareChange = useCallback(
    async (payload) => {
      const { userId, state } = payload;
      if (state === VideoActiveState.Active) {
        if (stream) {
          const shareCanvas = document.querySelector("#ZOOM_VIDEO_SDK_RECEIVE_SHARE_CANVAS") as HTMLCanvasElement;
          dispatch(setActiveShareId(userId));
          dispatch(setViewType(SuspensionViewType.Gallery));
          dispatch(setIsReceivingScreenShare(true));
          await stream?.startShareView(shareCanvas, userId);
          const shareUserList = stream?.getShareUserList();
          const activeShareUserInfo = shareUserList?.find((item) => item.userId === userId) ?? undefined;
          dispatch(setActiveSharerName(activeShareUserInfo?.displayName || ""));

          if (isInSubsession && subsessionClient) {
            const currentSubsession = subsessionClient.getCurrentSubsession();
            const subsessionList = subsessionClient.getSubsessionList();
            const currentSubsessionInfo = subsessionList.find(
              (s) => s.subsessionId === currentSubsession?.subsessionId,
            );
            const isSharerInSameSubsession = currentSubsessionInfo?.userList.some((p) => p.userId === userId);

            dispatch(setCanDoAnnotation(isSharerInSameSubsession && stream?.canDoAnnotation()));
          } else {
            dispatch(setCanDoAnnotation(stream?.canDoAnnotation()));
          }
        }
      } else if (state === VideoActiveState.Inactive) {
        if (stream) {
          await stream?.stopShareView();
        }
        dispatch(setActiveShareId(0));
        dispatch(setActiveSharerName(""));
        dispatch(setIsReceivingScreenShare(false));
        dispatch(setIsOriginalShareContentSize(false));
      }
    },
    [dispatch, stream, isInSubsession, subsessionClient],
  );
  // Handles when share content changes 'share-content-change'
  const onShareContentChange = useCallback(
    (payload) => {
      const { userId } = payload;
      //reset the annotation states
      dispatch(setIsAnnotationStarted(false));
      dispatch(resetAnnotationStates());
      //update share states
      dispatch(setActiveShareId(userId));
      const shareUserList = stream?.getShareUserList();
      const activeShareUserInfo = shareUserList?.find((item) => item.userId === userId) ?? undefined;
      dispatch(setActiveSharerName(activeShareUserInfo?.displayName));
      dispatch(setCanDoAnnotation(stream?.canDoAnnotation()));
    },
    [dispatch, stream],
  );

  // Handles when current sharing is passively stopped 'passively-stop-share'
  const onPassivelyStopShare = useCallback(
    (payload) => {
      dispatch(setIsSendingScreenShare(false));
      dispatch(setIsScreenSharePaused(false));
      dispatch(setActiveShareId(0));
      dispatch(setActiveSharerName(""));
    },
    [dispatch],
  );

  // Handles when some participant starts or stops screen sharing 'peer-share-state-change'
  const onPeerShareStateChange = useCallback((payload) => {
    const { userId, action } = payload;
    // TODO
  }, []);

  // Handle the case when shared content dimensions change.
  const onShareContentDimensionChange = useCallback((payload) => {
    const { width, height } = payload;
    setShareContentDimension({ width, height });
  }, []);

  useEffect(() => {
    client.on("active-share-change", onActiveShareChange);
    client.on("passively-stop-share", onPassivelyStopShare);
    client.on("peer-share-state-change", onPeerShareStateChange);
    client.on("share-content-change", onShareContentChange);
    client.on("share-content-dimension-change", onShareContentDimensionChange);
    return () => {
      client.off("active-share-change", onActiveShareChange);
      client.off("passively-stop-share", onPassivelyStopShare);
      client.off("peer-share-state-change", onPeerShareStateChange);
      client.off("share-content-change", onShareContentChange);
      client.off("share-content-dimension-change", onShareContentDimensionChange);
    };
  }, [
    client,
    onActiveShareChange,
    onPassivelyStopShare,
    onPeerShareStateChange,
    onShareContentChange,
    onShareContentDimensionChange,
  ]);

  return { shareContentDimension };
};
