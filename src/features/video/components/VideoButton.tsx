import { TriangleAlert, Video, VideoOff } from "lucide-react";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { useCallback, useContext, useEffect, useState, useRef } from "react";
import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { FooterMenuOption } from "@/components/footer/FooterMenuOption";
import { useMirrorVideo } from "@/features/video/hooks";
import {
  setIsShowAVLearnDialog,
  setIsShowVideoWarning,
  setIsSettingsOpen,
  setSettingsActiveTab,
  setActiveStatistics,
  setPreviewAVStatus,
  setActiveVbImage,
} from "@/store/uiSlice";
import ToggleButton from "@/components/widget/ToggleButton";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { usePrevious } from "@/hooks";
import { isSupportVideoPlayback } from "@/components/util/service";
import { MediaDevice, SuspensionViewType } from "@/types/index.d";
import { getErrorMessageFromApiError } from "@/components/util/error";
import { setIsStartedVideo } from "@/store/sessionSlice";

export const VideoButton = ({
  cameraList,
  changeCamera,
  orientation = "horizontal",
  autoClose = true,
}: {
  cameraList: MediaDevice[];
  changeCamera: (deviceId: string) => Promise<void>;
  orientation?: "horizontal" | "vertical";
  autoClose?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const sessionUI = useAppSelector(useSessionUISelector);
  const {
    videoPlaybackFile,
    isJoinResolved,
    config: {
      featuresOptions: {
        playback: { audioVideoPlaybacks, enable: isUserEnablePlayback },
        video: { ptz: isPTZEnabled },
      },
    },
  } = useAppSelector(useSessionSelector);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const videoButtonRef = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const preIsShowVideoWarning = usePrevious(sessionUI.isShowVideoWarning);

  const [isVideoMenuOpen, setIsVideoMenuOpen] = useState(false);
  const client = useContext(ClientContext);
  const currentUser = client.getCurrentUserInfo();
  const [isVideoOn, setIsVideoOn] = useState(currentUser?.bVideoOn || false);
  const {
    stream,
    video: { encode: videoEncode, decode: videoDecode },
  } = useContext(StreamContext);
  const { updateMirrorVideo, canMirrorVideo } = useMirrorVideo();
  const [isMirrorMenuBusy, setIsMirrorMenuBusy] = useState(false);

  let waringContext = "";
  if (sessionUI.isShowAudioWarning && sessionUI.isShowVideoWarning) {
    waringContext = t("join.media_preview_warning_denied_both");
  } else if (sessionUI.isShowAudioWarning) {
    waringContext = t("join.media_preview_warning_denied_mic");
  } else if (sessionUI.isShowVideoWarning) {
    waringContext = t("join.media_preview_warning_denied_camera");
  } else {
    waringContext = t("join.media_preview_warning_denied");
  }

  useEffect(() => {
    if (preIsShowVideoWarning !== sessionUI.isShowVideoWarning && sessionUI.isShowVideoWarning) {
      enqueueSnackbar(waringContext, { variant: "error" });
    }
  }, [enqueueSnackbar, preIsShowVideoWarning, sessionUI.isShowVideoWarning, waringContext]);

  const videoErrorFunc = useCallback(
    (e: any) => {
      setIsCameraLoading(false);
      dispatch(setIsShowVideoWarning(true));
      if (e?.type === "VIDEO_USER_FORBIDDEN_CAPTURE") {
        throw e;
      } else {
        const message = getErrorMessageFromApiError(e, t("video.start_failed"));
        enqueueSnackbar(message, { variant: "error" });
        throw e;
      }
    },
    [dispatch, enqueueSnackbar, t],
  );

  const toggleVideo = useCallback(async () => {
    if (sessionUI.isShowVideoWarning) {
      dispatch(setIsShowAVLearnDialog(true));
      setIsCameraLoading(false);
      return;
    }
    setIsCameraLoading(true);

    if (currentUser?.bVideoOn) {
      try {
        await stream?.stopVideo();
        dispatch(setIsStartedVideo(false));
        setIsCameraLoading(false);
      } catch (e) {
        videoErrorFunc(e);
      }
    } else {
      const captureOptions = { hd: true, cameraId: sessionUI.activeCamera, mirrored: sessionUI.isMirrorVideo };
      if (sessionUI.isSupportVB && sessionUI.activeVbImage) {
        Object.assign(captureOptions, { virtualBackground: { imageUrl: sessionUI.activeVbImage } });
      }
      // Enable PTZ camera support if configured
      if (isPTZEnabled) {
        Object.assign(captureOptions, { ptz: true });
      }
      try {
        await stream?.startVideo(captureOptions);
        dispatch(setIsStartedVideo(true));
        setIsCameraLoading(false);
      } catch (e: any) {
        videoErrorFunc(e);
      }
    }
  }, [currentUser?.bVideoOn, dispatch, sessionUI, stream, videoErrorFunc, isPTZEnabled]);
  useEffect(() => {
    setIsVideoOn(client.getCurrentUserInfo()?.bVideoOn);
  }, [client, currentUser?.bVideoOn]);

  const openVideoSettings = useCallback(() => {
    setIsVideoMenuOpen(false);
    dispatch(setSettingsActiveTab("video"));
    dispatch(setIsSettingsOpen(true));
  }, [dispatch, setIsVideoMenuOpen]);

  const openSelectVideoPlayback = useCallback(() => {
    setIsVideoMenuOpen(false);
    dispatch(setSettingsActiveTab("playback"));
    dispatch(setIsSettingsOpen(true));
  }, [dispatch, setIsVideoMenuOpen]);

  const openVideoStatistics = useCallback(() => {
    setIsVideoMenuOpen(false);
    dispatch(setSettingsActiveTab("statistics"));
    dispatch(setActiveStatistics("video"));
    dispatch(setIsSettingsOpen(true));
  }, [dispatch, setIsVideoMenuOpen]);

  const openVirtualBackground = useCallback(() => {
    setIsVideoMenuOpen(false);
    dispatch(setSettingsActiveTab("background"));
    dispatch(setIsSettingsOpen(true));
  }, [dispatch, setIsVideoMenuOpen]);

  const updateVirtualBackground = useCallback(
    async (vbImage: string) => {
      if (!sessionUI.isSupportVB) {
        enqueueSnackbar(t("video.virtual_background_not_supported"), { variant: "warning" });
        return;
      }
      if (!stream || typeof stream.updateVirtualBackgroundImage !== "function") {
        enqueueSnackbar(t("preview.error_update_vb"), { variant: "error" });
        return;
      }
      try {
        await stream.updateVirtualBackgroundImage(vbImage);
        dispatch(setActiveVbImage(vbImage));
        setIsVideoMenuOpen(false);
      } catch (e) {
        enqueueSnackbar(t("preview.error_update_vb"), { variant: "error" });
      }
    },
    [dispatch, enqueueSnackbar, sessionUI.isSupportVB, setIsVideoMenuOpen, stream, t],
  );

  const toggleBlurVirtualBackground = useCallback(async () => {
    const nextVbImage = sessionUI.activeVbImage === "blur" ? "" : "blur";
    await updateVirtualBackground(nextVbImage);
  }, [sessionUI.activeVbImage, updateVirtualBackground]);

  const handleMirrorVideo = useCallback(async () => {
    if (isMirrorMenuBusy) return;
    setIsMirrorMenuBusy(true);
    try {
      await updateMirrorVideo(!sessionUI.isMirrorVideo);
      setIsVideoMenuOpen(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to toggle mirror setting", e);
      enqueueSnackbar("Unable to update mirror setting. Please try again.", { variant: "error" });
    } finally {
      setIsMirrorMenuBusy(false);
    }
  }, [enqueueSnackbar, isMirrorMenuBusy, sessionUI.isMirrorVideo, updateMirrorVideo]);

  const isLoading = !videoEncode || !videoDecode || isCameraLoading;
  const isVideoAutoStartTriggeredRef = useRef(false);
  useEffect(() => {
    if (!sessionUI.previewStatus.isCameraOn) {
      isVideoAutoStartTriggeredRef.current = false;
      return;
    }

    if (isVideoAutoStartTriggeredRef.current || isLoading || isVideoOn || !stream || !isJoinResolved) return;

    isVideoAutoStartTriggeredRef.current = true;
    dispatch(setPreviewAVStatus({ isCameraOn: false }));

    if (client.getCurrentUserInfo()?.bVideoOn) return;

    void toggleVideo();
  }, [client, dispatch, isJoinResolved, isLoading, isVideoOn, sessionUI.previewStatus.isCameraOn, stream, toggleVideo]);

  const iconColor = sessionUI.themeName === "dark" ? "white" : "black";

  return (
    <>
      <ToggleButton
        id={"uikit-footer-video"}
        ref={videoButtonRef}
        icon={sessionUI?.isShowVideoWarning ? TriangleAlert : isVideoOn ? Video : VideoOff}
        isActive={isVideoOn}
        onClick={toggleVideo}
        isLoading={isLoading}
        iconColor={iconColor}
        themeName={sessionUI.themeName}
        chevronUpColor={iconColor}
        hoverColor="hover:bg-theme-background"
        isShowChevron={sessionUI.viewType !== SuspensionViewType.Minimized}
        onChevronUpClick={(e: React.MouseEvent) => {
          setIsVideoMenuOpen(!isVideoMenuOpen);
          e.stopPropagation();
        }}
        isWarning={sessionUI.isShowVideoWarning}
        title={t("video.button_label")}
        disabled={videoPlaybackFile !== ""}
        orientation={orientation}
        menuContent={
          <FooterMenuOption
            autoClose={autoClose}
            title={t("video.settings_title")}
            orientation={orientation}
            activeDevice={{
              Camera: sessionUI.activeCamera,
            }}
            setSettings={(deviceId: string) => {
              if (deviceId !== sessionUI.activeCamera) {
                setIsCameraLoading(true);
                changeCamera(deviceId).then(() => {
                  setIsCameraLoading(false);
                });
              }
              setIsVideoMenuOpen(false);
            }}
            options={{
              Camera: cameraList,
            }}
            menuName="camera-list"
            labels={{
              Camera: t("video.select_camera"),
            }}
            isOpen={isVideoMenuOpen}
            setIsOpen={(isOpen) => {
              setIsVideoMenuOpen(isOpen);
            }}
            excludeRefs={[videoButtonRef]}
            clickSettingsLink={openVideoSettings}
            otherButtons={[
              {
                text: t("video.mirror_my_video"),
                click: handleMirrorVideo,
                key: "footer-video-menu-mirror",
                checked: sessionUI.isMirrorVideo,
                disabled: !canMirrorVideo || isMirrorMenuBusy,
              },
              {
                text: t("video.select_playback"),
                click: openSelectVideoPlayback,
                key: "footer-video-menu-select-video-playback",
                checked: false,
                disabled:
                  !isSupportVideoPlayback(isVideoOn) || audioVideoPlaybacks?.length === 0 || !isUserEnablePlayback,
              },
              {
                text: t("video.virtual_background_blur"),
                click: toggleBlurVirtualBackground,
                key: "footer-video-menu-blur",
                checked: sessionUI.activeVbImage === "blur",
                disabled: !sessionUI.isSupportVB,
              },
              {
                text: t("video.virtual_background_choose"),
                click: openVirtualBackground,
                key: "footer-video-menu-choose-background",
                checked: sessionUI.activeVbImage !== "" && sessionUI.activeVbImage !== "blur",
                disabled: !sessionUI.isSupportVB,
              },
              {
                text: t("video.statistics"),
                click: () => {
                  openVideoStatistics();
                  setIsVideoMenuOpen(false);
                },
                key: "footer-video-menu-video-statistics",
                checked: false,
                disabled: !isVideoOn,
              },
            ].filter((item) => !item?.disabled)}
          />
        }
      />
    </>
  );
};
