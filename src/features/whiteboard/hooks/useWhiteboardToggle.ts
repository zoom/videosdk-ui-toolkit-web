import { useState, useCallback, useContext } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useSessionSelector,
  useWhiteboardSelector,
  useSubsessionSelector,
} from "@/hooks/useAppSelector";
import { useCurrentUser } from "@/features/participant/hooks";
import { setWhiteboardLoading, setWhiteboardError } from "../whiteboardSlice";
import { setIsSendingScreenShare } from "@/store/sessionSlice";
import sessionAdditionalContext from "@/context/session-additional-context";
import { StreamContext } from "@/context/stream-context";
import { SubsessionUserStatus } from "@zoom/videosdk";
import {
  WHITEBOARD_STATUS,
  WHITEBOARD_CONTAINER_INNER_ID,
  ERROR_START_WHITEBOARD,
  WHITEBOARD_ERROR_MESSAGE,
} from "../constant";
import { Participant } from "@/types";

export const useWhiteboardToggle = () => {
  const dispatch = useAppDispatch();
  const { whiteboardClient } = useContext(sessionAdditionalContext);
  const { stream } = useContext(StreamContext);
  const whiteboard = useAppSelector(useWhiteboardSelector);
  const session = useAppSelector(useSessionSelector);
  const currentUser: Participant = useCurrentUser();
  const { subUserStatus } = useAppSelector(useSubsessionSelector);
  const isInSubsession = subUserStatus === SubsessionUserStatus.InSubsession;
  const isHostOrManager = currentUser?.isHost || currentUser?.isManager;

  const [showScreenShareConfirm, setShowScreenShareConfirm] = useState(false);

  const canStartWhiteboard = useCallback((): boolean => {
    if (!whiteboardClient) return false;
    if (whiteboard.enabled && isHostOrManager) return true;
    if (whiteboard.isLock && !isHostOrManager) return false;
    if (isInSubsession) return false;
    if (!isHostOrManager) return false;
    return whiteboardClient.canStartWhiteboard();
  }, [whiteboardClient, whiteboard.enabled, whiteboard.isLock, isHostOrManager, isInSubsession]);

  const startWhiteboard = useCallback(async () => {
    dispatch(setWhiteboardLoading(true));
    await whiteboardClient
      .startWhiteboardScreen(document.getElementById(WHITEBOARD_CONTAINER_INNER_ID), {
        isDisableExport: whiteboard.isDisableExport,
      })
      .catch(() => {
        dispatch(
          setWhiteboardError({
            errorCode: ERROR_START_WHITEBOARD,
            errorMessage: WHITEBOARD_ERROR_MESSAGE[ERROR_START_WHITEBOARD],
          }),
        );
        dispatch(setWhiteboardLoading(false));
      });
  }, [dispatch, whiteboardClient, whiteboard.isDisableExport]);

  const handleWhiteboardToggle = useCallback(async () => {
    if (!currentUser) return;
    if (!canStartWhiteboard()) return;
    if (whiteboard.status === WHITEBOARD_STATUS.Pending) return;

    if (whiteboard.isWhiteboardOpen) {
      if (whiteboard.presenterID === currentUser.userId || isHostOrManager) {
        await whiteboardClient.stopWhiteboardScreen();
      } else {
        await whiteboardClient.stopWhiteboardView();
      }
    } else {
      if (session.isSendingScreenShare || session.isReceivingScreenShare) {
        setShowScreenShareConfirm(true);
      } else {
        await startWhiteboard();
      }
    }
  }, [
    currentUser,
    canStartWhiteboard,
    whiteboard.status,
    whiteboard.isWhiteboardOpen,
    whiteboard.presenterID,
    isHostOrManager,
    whiteboardClient,
    session.isSendingScreenShare,
    session.isReceivingScreenShare,
    startWhiteboard,
  ]);

  const handleConfirmStartWhiteboard = useCallback(async () => {
    setShowScreenShareConfirm(false);
    try {
      await stream.stopShareScreen();
      dispatch(setIsSendingScreenShare(false));
      await startWhiteboard();
    } catch {
      // Failed to stop screen share and start whiteboard
    }
  }, [stream, dispatch, startWhiteboard]);

  return {
    canStartWhiteboard,
    handleWhiteboardToggle,
    showScreenShareConfirm,
    setShowScreenShareConfirm,
    handleConfirmStartWhiteboard,
  };
};
