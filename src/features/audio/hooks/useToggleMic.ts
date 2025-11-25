import { useCallback, useContext } from "react";
import { useSnackbar } from "notistack";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { StreamContext } from "@/context/stream-context";
import { setIsShowAudioWarning, setIsShowAVLearnDialog } from "@/store/uiSlice";
import { setIsStartedAudio } from "@/store/sessionSlice";
import { ClientContext } from "@/context/client-context";
import { getErrorMessageFromApiError } from "@/components/util/error";

export const useToggleMic = () => {
  const { stream } = useContext(StreamContext);
  const client = useContext(ClientContext);
  const { isShowAudioWarning, activeMicrophone, activeSpeaker, previewStatus } = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();
  const currentUser = client.getCurrentUserInfo();

  const { enqueueSnackbar } = useSnackbar();

  const toggleMic = useCallback(
    async (muteOnEntry?: boolean) => {
      if (isShowAudioWarning) {
        dispatch(setIsShowAVLearnDialog(true));
        return;
      }
      if (typeof currentUser?.muted === "boolean") {
        if (currentUser?.muted) {
          await stream?.unmuteAudio();
        } else {
          await stream?.muteAudio();
        }
      } else {
        try {
          await stream?.startAudio({
            microphoneId: activeMicrophone,
            speakerId: activeSpeaker,
            mute: muteOnEntry !== undefined ? muteOnEntry : previewStatus.isMicMuted,
          });
          dispatch(setIsStartedAudio(true));
          await stream?.enableBackgroundNoiseSuppression(true);
        } catch (e: any) {
          const errorMessage = getErrorMessageFromApiError(e, "Start audio failed");
          if (e?.type === "INSUFFICIENT_PRIVILEGES") {
            if (e?.reason === "AUDIO_CAPTURE_FAILED") {
              dispatch(setIsShowAudioWarning(true));
            } else {
              enqueueSnackbar(errorMessage, { variant: "error" });
            }
          } else {
            enqueueSnackbar(errorMessage, { variant: "error" });
          }
        }
      }
    },
    [
      currentUser,
      dispatch,
      enqueueSnackbar,
      isShowAudioWarning,
      stream,
      previewStatus,
      activeMicrophone,
      activeSpeaker,
    ],
  );

  return toggleMic;
};
