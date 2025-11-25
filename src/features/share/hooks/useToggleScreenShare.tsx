import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import {
  setActiveShareId,
  setActiveSharerName,
  setIsReceivingScreenShare,
  setIsScreenSharePaused,
  setIsSendingScreenShare,
} from "@/store/sessionSlice";
import { setCanDoAnnotation, setShowShareScreenToSubsessionModal, setViewType } from "@/store/uiSlice";
import { SuspensionViewType } from "@/types/index.d";
import { useCallback, useContext } from "react";
import { useSnackbar } from "notistack";

const errorMessages = {
  INSUFFICIENT_PRIVILEGES: {
    "only host can start screen share": {
      message: "Host disabled attendee screen sharing.",
      variant: "warning",
    },
    "only host can grab screen share": {
      message: "You cannot start screen share while the other participant is sharing.",
      variant: "warning",
    },
  },
  default: {
    message: "Failed to start screen share",
    variant: "error",
  },
} as const;

export const useToggleScreenShare = () => {
  const { isSendingScreenShare, userId, isReceivingScreenShare } = useAppSelector(useSessionSelector);
  const { shareScreenToSubsessionDontShowAgain } = useAppSelector(useSessionUISelector);
  const { stream } = useContext(StreamContext);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const startScreenShare = useCallback(
    async (shareToSubsession?: boolean) => {
      try {
        const shareCanvas = document.querySelector(`#ZOOM_VIDEO_SDK_SELF_SHARE_CANVAS`) as
          | HTMLVideoElement
          | HTMLCanvasElement;

        await stream.startShareScreen(shareCanvas);
        dispatch(setCanDoAnnotation(stream?.canDoAnnotation()));
        if (shareToSubsession) {
          await stream.shareToSubsession();
        }
        if (isReceivingScreenShare) {
          dispatch(setIsReceivingScreenShare(false));
        }
        dispatch(setIsSendingScreenShare(true));
        dispatch(setViewType(SuspensionViewType.Gallery));
        dispatch(setActiveShareId(userId));
        const shareUserList = stream?.getShareUserList();
        const activeShareUserInfo = shareUserList?.[0] ?? undefined;
        dispatch(setActiveSharerName(activeShareUserInfo?.displayName));
      } catch (error) {
        const { type, reason } = error;
        // eslint-disable-next-line no-console
        console.error(error);
        if (type !== "INVALID_OPERATION") {
          const errorConfig = errorMessages[type]?.[reason] || errorMessages.default;
          enqueueSnackbar(errorConfig);
        }
      }
    },
    [dispatch, stream, userId, enqueueSnackbar, isReceivingScreenShare],
  );

  const startCameraShare = useCallback(
    async (shareToSubsession?: boolean) => {
      try {
        const shareCanvas = document.querySelector(`#ZOOM_VIDEO_SDK_SELF_SHARE_CANVAS`) as
          | HTMLVideoElement
          | HTMLCanvasElement;
        await stream?.startShareCamera(shareCanvas, "default", true);
        dispatch(setCanDoAnnotation(stream?.canDoAnnotation()));
        if (shareToSubsession) {
          await stream?.shareToSubsession();
        }
        if (isReceivingScreenShare) {
          dispatch(setIsReceivingScreenShare(false));
        }
        dispatch(setIsSendingScreenShare(true));
        dispatch(setViewType(SuspensionViewType.Gallery));
        dispatch(setActiveShareId(userId));
        const shareUserList = stream?.getShareUserList();
        const activeShareUserInfo = shareUserList?.[0] ?? undefined;
        dispatch(setActiveSharerName(activeShareUserInfo?.displayName));
      } catch (error) {
        const { type, reason } = error;
        // eslint-disable-next-line no-console
        console.error(error);
        if (type !== "INVALID_OPERATION") {
          const errorConfig = errorMessages[type]?.[reason] || errorMessages.default;
          enqueueSnackbar(errorConfig);
        }
      }
    },
    [dispatch, stream, userId, enqueueSnackbar, isReceivingScreenShare],
  );
  const stopShare = useCallback(async () => {
    try {
      await stream?.stopShareScreen();
      dispatch(setIsSendingScreenShare(false));
      dispatch(setIsScreenSharePaused(false));
      dispatch(setActiveShareId(0));
      dispatch(setActiveSharerName(""));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      enqueueSnackbar({
        message: "Failed to stop share",
        variant: "error",
      });
    }
  }, [dispatch, enqueueSnackbar, stream]);

  const toggleScreenShare = useCallback(
    async (shareToSubsession?: boolean) => {
      if (!isSendingScreenShare) {
        if (shareToSubsession && !shareScreenToSubsessionDontShowAgain) {
          dispatch(setShowShareScreenToSubsessionModal(true));
        } else {
          await startScreenShare(shareToSubsession);
          dispatch(setCanDoAnnotation(stream?.canDoAnnotation()));
        }
      } else {
        stopShare();
      }
    },
    [dispatch, isSendingScreenShare, stream, shareScreenToSubsessionDontShowAgain, startScreenShare, stopShare],
  );

  return {
    toggleScreenShare,
    startScreenShare,
    startCameraShare,
    stopShare,
  };
};
