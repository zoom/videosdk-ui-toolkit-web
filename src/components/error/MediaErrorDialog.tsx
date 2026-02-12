import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sessionUI = useAppSelector(useSessionUISelector);
  const { mediaError } = sessionUI;
  const { onRetry } = useMediaSDKChange(window.zmClient, dispatch);

  const mediaType =
    {
      audio: t("media.error_microphone"),
      video: t("media.error_camera"),
      sharing: t("media.error_screen_sharing"),
    }[mediaError?.type] || t("media.error_media_stream");

  const { reason, errorCode } = mediaError;

  const getErrorContent = () => {
    if (!errorCode) return null;

    const code = errorCode as ActiveMediaFailedCodeType;

    // Permission reset cases
    if (PERMISSION_ERRORS.includes(code as PermissionErrorType)) {
      const deviceType =
        code === ActiveMediaFailedCode.MicrophonePermissionReset
          ? t("media.error_microphone")
          : t("media.error_camera");
      const capitalizedDeviceType = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
      return {
        title: t("media.error_permission_required", { deviceType: capitalizedDeviceType }),
        message: t("media.error_grant_permission", { deviceType }),
        okText: t("media.error_view_instructions"),
        onOk: () => dispatch(setIsShowAVLearnDialog(true)),
      };
    }

    // Stream failure cases that require browser refresh
    if (STREAM_FAILURE_ERRORS.includes(code as StreamFailureErrorType)) {
      const requiresFullRestart = needsFullRestart(code as StreamFailureErrorType);
      let message = "";

      if (requiresFullRestart) {
        message = t("media.error_close_browser");
      } else {
        switch (code) {
          case ActiveMediaFailedCode.VideoConnectionFailed:
            message = t("media.error_refresh_connection");
            break;
          case ActiveMediaFailedCode.VideoStreamEnded:
            message = t("media.error_refresh_camera_blocked");
            break;
          case ActiveMediaFailedCode.AudioConnectionFailed:
            message = t("media.error_refresh_reconnect");
            break;
          case ActiveMediaFailedCode.AudioStreamEnded:
            message = t("media.error_refresh_audio_interrupted");
            break;
          default:
            message = t("media.error_refresh_connection");
        }
      }

      const capitalizedMediaType = mediaType.charAt(0).toUpperCase() + mediaType.slice(1);
      return {
        title: t("media.error_connection_failed", { mediaType: capitalizedMediaType }),
        message,
        okText: requiresFullRestart ? t("common.ok") : t("media.error_refresh"),
        onOk: requiresFullRestart ? () => dispatch(setMediaError({ errorCode: "", reason: "", type: "" })) : onRetry,
      };
    }

    // Audio playback interruption cases
    if (isAudioPlaybackError(code)) {
      const isTemporary = code === ActiveMediaFailedCode.AudioStreamMuted;
      return {
        title: t("media.error_audio_playback_issue"),
        message: isTemporary ? t("media.error_mic_temporarily_occupied") : t("media.error_audio_interrupted"),
        okText: t("media.error_resume_audio"),
        onOk: () => document.body.click(),
      };
    }

    // Specific cases that need unique handling
    switch (code) {
      case ActiveMediaFailedCode.MicrophoneMuted:
        return {
          title: t("media.error_microphone_muted"),
          message: t("media.error_unmute_mic"),
          okText: t("common.ok"),
          onOk: () => dispatch(setMediaError({ errorCode: "", reason: "", type: "" })),
        };

      case ActiveMediaFailedCode.WebGLContextInvalid:
        return {
          title: t("media.error_video_rendering_issue"),
          message: t("media.error_webgl_compatibility"),
          okText: t("common.ok"),
          onOk: () => dispatch(setMediaError({ errorCode: "", reason: "", type: "" })),
        };

      default: {
        const errorCodeText = errorCode ? `error code: ${errorCode}` : "";
        return {
          title: t("media.error_active_media_failed"),
          message: t("media.error_issue_detected", { mediaType, reason, errorCodeText }),
          okText: t("media.error_refresh"),
          onOk: onRetry,
        };
      }
    }
  };

  const errorContent = getErrorContent();
  if (!errorContent) return null;

  const showCancel = errorContent.okText !== t("common.ok");

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
      cancelText={showCancel ? t("common.cancel") : undefined}
      id="uikit-media-error-dialog"
    />
  );
};

export default MediaErrorDialog;
