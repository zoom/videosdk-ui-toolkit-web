import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { useMediaSDKChange } from "@/features/session-app/hooks/useMediaSDKChange";
import ConfirmDialog from "../widget/dialog/ConfirmDialog";
import { setIsShowAVLearnDialog, setMediaError } from "@/store/uiSlice";
import { ActiveMediaFailedCode, ActiveMediaFailedCodeType } from "@/constant/error-codes";

const PERMISSION_ERRORS = [
  ActiveMediaFailedCode.MicrophonePermissionReset,
  ActiveMediaFailedCode.CameraPermissionReset,
] as const;

// Group all stream failures that require browser restart
const STREAM_FAILURE_ERRORS = [
  ActiveMediaFailedCode.VideoConnectionFailed,
  ActiveMediaFailedCode.VideoStreamFailed,
  ActiveMediaFailedCode.VideoStreamEnded,
  ActiveMediaFailedCode.AudioStreamFailed,
  ActiveMediaFailedCode.AudioConnectionFailed,
  ActiveMediaFailedCode.AudioStreamEnded,
  ActiveMediaFailedCode.SharingStreamFailed,
  ActiveMediaFailedCode.WasmOutOfMemory,
] as const;

const FULL_RESTART_ERRORS = [
  ActiveMediaFailedCode.AudioStreamFailed,
  ActiveMediaFailedCode.SharingStreamFailed,
  ActiveMediaFailedCode.WasmOutOfMemory,
  ActiveMediaFailedCode.VideoStreamFailed,
] as const;

const AUDIO_PLAYBACK_ERRORS = [
  ActiveMediaFailedCode.AudioStreamMuted,
  ActiveMediaFailedCode.AudioPlaybackInterrupted,
] as const;

type PermissionErrorType = (typeof PERMISSION_ERRORS)[number];
type StreamFailureErrorType = (typeof STREAM_FAILURE_ERRORS)[number];
type AudioPlaybackErrorType = (typeof AUDIO_PLAYBACK_ERRORS)[number];
type FullRestartErrorType = (typeof FULL_RESTART_ERRORS)[number];

const isAudioPlaybackError = (code: ActiveMediaFailedCodeType): code is AudioPlaybackErrorType => {
  return AUDIO_PLAYBACK_ERRORS.includes(code as AudioPlaybackErrorType);
};

const needsFullRestart = (code: StreamFailureErrorType): code is FullRestartErrorType => {
  return FULL_RESTART_ERRORS.includes(code as FullRestartErrorType);
};

export const MediaErrorDialog = () => {
  const dispatch = useAppDispatch();
  const sessionUI = useAppSelector(useSessionUISelector);
  const { mediaError } = sessionUI;
  const { onRetry } = useMediaSDKChange(window.zmClient, dispatch);

  const mediaType =
    {
      audio: "microphone",
      video: "camera",
      sharing: "screen sharing",
    }[mediaError?.type] || "media stream";

  const { reason, errorCode } = mediaError;

  const getErrorContent = () => {
    if (!errorCode) return null;

    const code = errorCode as ActiveMediaFailedCodeType;

    // Permission reset cases
    if (PERMISSION_ERRORS.includes(code as PermissionErrorType)) {
      const deviceType = code === ActiveMediaFailedCode.MicrophonePermissionReset ? "microphone" : "camera";
      return {
        title: `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} Permission Required`,
        message: `Grant the necessary ${deviceType} permissions to continue.`,
        okText: "View Instructions",
        onOk: () => dispatch(setIsShowAVLearnDialog(true)),
      };
    }

    // Stream failure cases that require browser refresh
    if (STREAM_FAILURE_ERRORS.includes(code as StreamFailureErrorType)) {
      const requiresFullRestart = needsFullRestart(code as StreamFailureErrorType);
      let message = "";

      if (requiresFullRestart) {
        message = "Please close all browsers and rejoin the meeting to resolve this issue.";
      } else {
        switch (code) {
          case ActiveMediaFailedCode.VideoConnectionFailed:
            message = "Refresh the browser to resolve the connection issue.";
            break;
          case ActiveMediaFailedCode.VideoStreamEnded:
            message = "Refresh the browser; the camera stream may have been blocked.";
            break;
          case ActiveMediaFailedCode.AudioConnectionFailed:
            message = "Refresh the browser to reconnect.";
            break;
          case ActiveMediaFailedCode.AudioStreamEnded:
            message =
              "Refresh the browser; the audio stream was interrupted (possibly due to device issues or another app).";
            break;
          default:
            message = "Please refresh the browser to resolve the connection issue.";
        }
      }

      return {
        title: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Connection Failed`,
        message,
        okText: requiresFullRestart ? "OK" : "Refresh",
        onOk: requiresFullRestart ? () => dispatch(setMediaError({ errorCode: "", reason: "", type: "" })) : onRetry,
      };
    }

    // Audio playback interruption cases
    if (isAudioPlaybackError(code)) {
      const isTemporary = code === ActiveMediaFailedCode.AudioStreamMuted;
      return {
        title: "Audio Playback Issue",
        message: isTemporary
          ? "The microphone was temporarily occupied. Click anywhere on the page to restore audio."
          : "Audio playback was interrupted. Click anywhere on the page to resume.",
        okText: "Resume Audio",
        onOk: () => document.body.click(),
      };
    }

    // Specific cases that need unique handling
    switch (code) {
      case ActiveMediaFailedCode.MicrophoneMuted:
        return {
          title: "Microphone Muted",
          message: "Unmute the mic via system or browser settings.",
          okText: "OK",
          onOk: () => dispatch(setMediaError({ errorCode: "", reason: "", type: "" })),
        };

      case ActiveMediaFailedCode.WebGLContextInvalid:
        return {
          title: "Video Rendering Issue",
          message:
            "Issue with video rendering due to WebGL compatibility. Please verify browser compatibility or try a different browser.",
          okText: "OK",
          onOk: () => dispatch(setMediaError({ errorCode: "", reason: "", type: "" })),
        };

      default:
        return {
          title: "Active Media Failed",
          message: `We detected an issue with the ${mediaType} that we cannot resolve.
                    ${reason}.
                    Please refresh the page to try to fix it. ${errorCode ? `error code: ${errorCode}` : ""}`,
          okText: "Refresh",
          onOk: onRetry,
        };
    }
  };

  const errorContent = getErrorContent();
  if (!errorContent) return null;

  const showCancel = errorContent.okText !== "OK";

  if (!mediaError?.errorCode) {
    return null;
  }

  return (
    <ConfirmDialog
      title={errorContent.title}
      message={errorContent.message}
      onConfirm={errorContent.onOk}
      confirmText={errorContent.okText}
      onCancel={showCancel ? () => dispatch(setMediaError({ errorCode: "", reason: "", type: "" })) : undefined}
      cancelText={showCancel ? "Cancel" : undefined}
      id="uikit-media-error-dialog"
    />
  );
};

export default MediaErrorDialog;
