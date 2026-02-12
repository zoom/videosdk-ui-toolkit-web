import { useCallback, useContext } from "react";
import { useSnackbar } from "notistack";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { StreamContext } from "@/context/stream-context";
import { setIsShowAudioWarning, setIsShowAVLearnDialog } from "@/store/uiSlice";
import { setIsStartedAudio } from "@/store/sessionSlice";
import { ClientContext } from "@/context/client-context";
import { getErrorMessageFromApiError } from "@/components/util/error";

type ToggleMicOptions = {
  isAuto?: boolean;
};

export const useToggleMic = () => {
  const { stream } = useContext(StreamContext);
  const client = useContext(ClientContext);
  const { isShowAudioWarning, activeMicrophone, activeSpeaker, previewStatus } = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const toggleMic = useCallback(
    async (muteOnEntry?: boolean, options?: ToggleMicOptions): Promise<void> => {
      if (isShowAudioWarning) {
        dispatch(setIsShowAVLearnDialog(true));
        return;
      }

      if (!stream) return;

      const currentUser = client.getCurrentUserInfo();
      const isJoinedAudio = !!currentUser?.audio;

      if (isJoinedAudio && typeof currentUser?.muted === "boolean") {
        if (currentUser.muted) await stream?.unmuteAudio();
        else await stream?.muteAudio();
        return;
      }

      const microphoneId = activeMicrophone || stream.getActiveMicrophone?.() || undefined;
      const speakerId = activeSpeaker || stream.getActiveSpeaker?.() || undefined;

      try {
        const startAudioOptions: { microphoneId?: string; speakerId?: string; mute: boolean } = {
          mute: muteOnEntry !== undefined ? muteOnEntry : previewStatus.isMicMuted,
        };
        if (microphoneId) startAudioOptions.microphoneId = microphoneId;
        if (speakerId) startAudioOptions.speakerId = speakerId;

        await stream?.startAudio(startAudioOptions);
        dispatch(setIsStartedAudio(true));
        await stream?.enableBackgroundNoiseSuppression(true);
      } catch (e: any) {
        const errorMessage = getErrorMessageFromApiError(e, "Start audio failed");

        if (e?.type === "INSUFFICIENT_PRIVILEGES" && e?.reason === "AUDIO_CAPTURE_FAILED") {
          dispatch(setIsShowAudioWarning(true));
        } else if (options?.isAuto !== true) {
          enqueueSnackbar(errorMessage, { variant: "error" });
        }
      }
    },
    [client, dispatch, enqueueSnackbar, isShowAudioWarning, stream, previewStatus, activeMicrophone, activeSpeaker],
  );

  return toggleMic;
};
