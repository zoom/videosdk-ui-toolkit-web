import { useTranslation } from "react-i18next";
import { ActiveMediaFailedCode } from "@zoom/videosdk";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { useMediaSDKChange } from "@/features/session-app/hooks/useMediaSDKChange";
import ConfirmDialog from "../widget/dialog/ConfirmDialog";
import { setIsShowAVLearnDialog } from "@/store/uiSlice";

const PERMISSION_ERRORS = [
  ActiveMediaFailedCode.MicrophonePermissionReset,
  ActiveMediaFailedCode.CameraPermissionReset,
];

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
];

const FULL_RESTART_ERRORS = [
  ActiveMediaFailedCode.AudioStreamFailed,
  ActiveMediaFailedCode.SharingStreamFailed,
  ActiveMediaFailedCode.WasmOutOfMemory,
  ActiveMediaFailedCode.VideoStreamFailed,
];

const AUDIO_PLAYBACK_ERRORS = [ActiveMediaFailedCode.AudioStreamMuted, ActiveMediaFailedCode.AudioPlaybackInterrupted];

export const MediaErrorDialog = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sessionUI = useAppSelector(useSessionUISelector);
  const { mediaError } = sessionUI;
  const { onRetry, clearError } = useMediaSDKChange(window.zmClient, dispatch);

  // The SDK resumes interrupted media on the next click on the page.
  const resumeMedia = () => {
    document.body.click();
    clearError();
  };

  const mediaType =
    {
      audio: t("media.error_microphone"),
      video: t("media.error_camera"),
      sharing: t("media.error_screen_sharing"),
    }[mediaError?.type] || t("media.error_media_stream");

  const { reason, errorCode } = mediaError;

  const getErrorContent = () => {
    if (!errorCode) return null;

    // Permission reset cases
    if (PERMISSION_ERRORS.includes(errorCode)) {
      const deviceType =
        errorCode === ActiveMediaFailedCode.MicrophonePermissionReset
          ? t("media.error_microphone")
          : t("media.error_camera");
      const capitalizedDeviceType = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
      return {
        title: t("media.error_permission_required", { deviceType: capitalizedDeviceType }),
        message: t("media.error_grant_permission", { deviceType }),
        okText: t("media.error_view_instructions"),
        onOk: () => {
          clearError();
          dispatch(setIsShowAVLearnDialog(true));
        },
      };
    }

    // Stream failure cases that require browser refresh
    if (STREAM_FAILURE_ERRORS.includes(errorCode)) {
      const requiresFullRestart = FULL_RESTART_ERRORS.includes(errorCode);
      let message = "";

      if (requiresFullRestart) {
        message = t("media.error_close_browser");
      } else {
        switch (errorCode) {
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
        onOk: requiresFullRestart ? clearError : onRetry,
      };
    }

    // Audio playback interruption cases
    if (AUDIO_PLAYBACK_ERRORS.includes(errorCode)) {
      const isTemporary = errorCode === ActiveMediaFailedCode.AudioStreamMuted;
      return {
        title: t("media.error_audio_playback_issue"),
        message: isTemporary ? t("media.error_mic_temporarily_occupied") : t("media.error_audio_interrupted"),
        okText: t("media.error_resume_audio"),
        onOk: resumeMedia,
      };
    }

    // Specific cases that need unique handling
    switch (errorCode) {
      case ActiveMediaFailedCode.MicrophoneMuted:
        return {
          title: t("media.error_microphone_muted"),
          message: t("media.error_unmute_mic"),
          okText: t("common.ok"),
          onOk: clearError,
        };

      case ActiveMediaFailedCode.VideoStreamMuted:
        return {
          title: t("media.error_camera_interrupted"),
          message: t("media.error_camera_interrupted_resume"),
          okText: t("media.error_resume_video"),
          onOk: resumeMedia,
        };

      case ActiveMediaFailedCode.WebGlContextInvalid:
        return {
          title: t("media.error_video_rendering_issue"),
          message: t("media.error_webgl_compatibility"),
          okText: t("common.ok"),
          onOk: clearError,
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
      onCancel={showCancel ? clearError : undefined}
      cancelText={showCancel ? t("common.cancel") : undefined}
      id="uikit-media-error-dialog"
    />
  );
};

export default MediaErrorDialog;
