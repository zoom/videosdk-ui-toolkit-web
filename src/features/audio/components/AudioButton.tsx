import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Headphones, LoaderCircle, Mic, MicOff, TriangleAlert } from "lucide-react";

import { StreamContext } from "@/context/stream-context";
import { ClientContext } from "@/context/client-context";
import DraggableToast from "@/components/widget/toast/Toast";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import ToggleButton from "@/components/widget/ToggleButton";
import AnimatedMicVolume from "./AnimatedMicVolume";
import { FooterMenuOption } from "@/components/footer/FooterMenuOption";
import {
  setIsSettingsOpen,
  setSettingsActiveTab,
  setActiveStatistics,
  setIsInviteDialogOpen,
  setPreviewAVStatus,
  setShowJoinAudioConsent,
} from "@/store/uiSlice";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { usePrevious } from "@/hooks";
import { isSupportSecondMicrophone } from "@/components/util/service";
import { MediaDevice, SuspensionViewType } from "@/types/index.d";
import { setIsEnablePhone, setIsStartedAudio } from "@/store/sessionSlice";
import { useCurrentUser } from "@/features/participant/hooks";
import { useToggleMic } from "../hooks/useToggleMic";
import { canUsePEPCPermissionQuery, checkExistingPermissions } from "@/components/util/pepcDetection";
import { AudioChangeAction } from "@zoom/videosdk";

async function _shouldShowAudioConsent(): Promise<boolean> {
  const isPEPCSupported = await canUsePEPCPermissionQuery();

  if (isPEPCSupported) {
    // For PEPC browsers, only show consent dialog if permissions are not already granted
    const permissions = await checkExistingPermissions();
    return !permissions.camera && !permissions.microphone;
  }

  // For non-PEPC browsers, check if permissions were already granted via native prompt
  try {
    const cameraPermission = await navigator.permissions.query({ name: "camera" as PermissionName });
    const micPermission = await navigator.permissions.query({ name: "microphone" as PermissionName });

    // Only show consent if permissions are not granted
    return cameraPermission.state !== "granted" && micPermission.state !== "granted";
  } catch (error) {
    // If permission query fails, show consent panel as fallback
    return true;
  }
}

export const AudioButton = ({
  changeMicrophone,
  changeSpeaker,
  microphoneList,
  speakerList,
  id,
  disableAutoJoin = false,
  orientation = "horizontal",
  autoClose = true,
}: {
  changeMicrophone: (deviceId: string) => Promise<void>;
  changeSpeaker: (deviceId: string) => Promise<void>;
  microphoneList: MediaDevice[];
  speakerList: MediaDevice[];
  id: string;
  disableAutoJoin?: boolean;
  orientation?: "horizontal" | "vertical";
  autoClose?: boolean;
}) => {
  const session = useAppSelector(useSessionSelector);
  const sessionUI = useAppSelector(useSessionUISelector);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const client = useContext(ClientContext);

  const [isMicActive, setIsMicActive] = useState<boolean>(true);
  const [isAudioMenuOpen, setIsAudioMenuOpen] = useState<boolean>(false);
  const [isMicDisabled, setIsMicDisabled] = useState<boolean>(false);
  const [isMicLoading, setIsMicLoading] = useState<boolean>(false);
  const [isShowSpeakingWhileMutedToast, setIsShowSpeakingWhileMutedToast] = useState<boolean>(false);
  const audioButtonRef = useRef<HTMLDivElement>(null);
  const preIsShowAudioWarning = usePrevious(sessionUI.isShowAudioWarning);

  const { enqueueSnackbar } = useSnackbar();
  let waringContext = "";
  if (sessionUI.isShowAudioWarning && sessionUI.isShowVideoWarning) {
    waringContext = t("join_media_preview_warning_denied_both");
  } else if (sessionUI.isShowAudioWarning) {
    waringContext = t("join_media_preview_warning_denied_mic");
  } else if (sessionUI.isShowVideoWarning) {
    waringContext = t("join_media_preview_warning_denied_camera");
  } else {
    waringContext = t("join_media_preview_warning_denied");
  }

  const currentUser = useCurrentUser();
  const isJoinedAudio = currentUser?.audio !== "";
  const [isMuted, setIsMuted] = useState<boolean>(currentUser?.muted || true);
  const {
    stream,
    audio: { encode: audioEncode, decode: audioDecode },
  } = useContext(StreamContext);

  const toggleMic = useToggleMic();

  useEffect(() => {
    setIsMuted(currentUser?.muted === true);
    setIsMicActive(currentUser?.muted === false);
  }, [currentUser?.muted]);

  useEffect(() => {
    dispatch(setIsEnablePhone(stream?.isSupportPhoneFeature()));
  }, [dispatch, stream]);

  useEffect(() => {
    if (preIsShowAudioWarning !== sessionUI.isShowAudioWarning && sessionUI.isShowAudioWarning) {
      enqueueSnackbar(waringContext, { variant: "error" });
    }
  }, [enqueueSnackbar, preIsShowAudioWarning, sessionUI.isShowAudioWarning, waringContext]);

  useEffect(() => {
    const handleSpeakingWhileMuted = () => {
      setIsShowSpeakingWhileMutedToast(true);
    };

    client.on("speaking-while-muted", handleSpeakingWhileMuted);
    return () => {
      client.off("speaking-while-muted", handleSpeakingWhileMuted);
    };
  }, [client]);

  useEffect(() => {
    const handleAudioChange = (payload: any) => {
      if (payload.action === AudioChangeAction.Unmuted) {
        setIsShowSpeakingWhileMutedToast(false);
      }
    };

    client.on("current-audio-change", handleAudioChange);
    return () => {
      client.off("current-audio-change", handleAudioChange);
    };
  }, [client]);

  const handleUnmute = useCallback(async () => {
    try {
      await stream?.unmuteAudio();
      setIsShowSpeakingWhileMutedToast(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to unmute:", error);
    }
  }, [stream]);

  const openAudioSettings = useCallback(() => {
    setIsAudioMenuOpen(false);
    dispatch(setSettingsActiveTab("audio"));
    dispatch(setIsSettingsOpen(true));
  }, [dispatch, setIsAudioMenuOpen]);

  const openAudioStatistics = useCallback(() => {
    setIsAudioMenuOpen(false);
    dispatch(setSettingsActiveTab("statistics"));
    dispatch(setActiveStatistics("audio"));
    dispatch(setIsSettingsOpen(true));
  }, [dispatch, setIsAudioMenuOpen]);

  const isLoading = false; //session?.isAudioBridge ? isMicLoading : !audioEncode || !audioDecode || isMicLoading;
  let audioIcon = Headphones;
  if (isLoading) {
    audioIcon = LoaderCircle;
  } else if (sessionUI.isShowAudioWarning) {
    audioIcon = TriangleAlert;
  } else if (!isJoinedAudio) {
    audioIcon = Headphones;
  } else if (typeof isMuted === "boolean") {
    audioIcon = currentUser?.muted ? MicOff : Mic;
  }

  const previousLoading = usePrevious(isLoading);
  useEffect(() => {
    const timeoutId: NodeJS.Timeout | null = null;

    if (sessionUI.previewStatus.isAudioOn && !isJoinedAudio && !disableAutoJoin) {
      // auto join audio when preview joined audio
      dispatch(setShowJoinAudioConsent(false));
      async function startAudio() {
        await toggleMic();
      }
      startAudio().then(() => {
        dispatch(setPreviewAVStatus({ isAudioOn: false, auto: true }));
      });
    } else if (!sessionUI.previewStatus.isAudioOn && !sessionUI.previewStatus?.auto && !isJoinedAudio) {
      // checkAudioConsent();
      dispatch(setPreviewAVStatus({ auto: true }));
    }

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    sessionUI.previewStatus,
    isLoading,
    microphoneList,
    previousLoading,
    isJoinedAudio,
    dispatch,
    id,
    disableAutoJoin,
    session?.featuresOptions?.audio?.joinAudioConsent,
    toggleMic,
  ]);

  const iconColor = sessionUI.themeName === "dark" ? "white" : "black";

  return (
    <>
      <ToggleButton
        ref={audioButtonRef}
        icon={audioIcon}
        isActive={isMicActive}
        onClick={() => {
          toggleMic(session?.featuresOptions?.audio?.muteEntry);
        }}
        disabled={session.audioPlaybackFile !== ""}
        isLoading={isLoading}
        id={id}
        themeName={sessionUI.themeName}
        iconColor={iconColor}
        chevronUpColor={iconColor}
        hoverColor="hover:bg-theme-background"
        isShowChevron={sessionUI.viewType !== SuspensionViewType.Minimized}
        orientation={orientation}
        activeButton={
          isMicActive ? (
            <AnimatedMicVolume
              disabled={session.audioPlaybackFile !== ""}
              onClick={toggleMic}
              isLoading={isLoading}
              id={"audio-unmuted"}
              themeName={sessionUI.themeName}
              orientation={orientation}
            />
          ) : null
        }
        onChevronUpClick={(e: React.MouseEvent) => {
          setIsAudioMenuOpen(!isAudioMenuOpen);
          e.stopPropagation();
        }}
        isWarning={sessionUI.isShowAudioWarning}
        title={"audio"}
        menuContent={
          <FooterMenuOption
            autoClose={autoClose}
            title="Audio settings"
            orientation={orientation}
            activeDevice={{
              microphoneList: sessionUI.activeMicrophone,
              speakerList: sessionUI.activeSpeaker,
            }}
            setSettings={(deviceId: string, type: string) => {
              if (type === "microphoneList") {
                changeMicrophone(deviceId);
              } else {
                changeSpeaker(deviceId);
              }
              setIsAudioMenuOpen(false);
            }}
            options={{
              microphoneList,
              speakerList,
            }}
            menuName="audio-list"
            labels={{
              microphoneList: "Select a microphone",
              speakerList: "Select a speaker",
            }}
            isOpen={isAudioMenuOpen}
            setIsOpen={(isOpen) => {
              setIsAudioMenuOpen(isOpen);
            }}
            excludeRefs={[audioButtonRef]}
            clickSettingsLink={openAudioSettings}
            otherButtons={[
              {
                text: "Invite by phone",
                click: () => {
                  dispatch(setIsInviteDialogOpen(true));
                  setIsAudioMenuOpen(false);
                },
                key: "footer-audio-menu-invite-phone",
                checked: false,
                disabled: !session.isEnablePhone,
              },
              {
                text: "Select second audio",
                click: () => {
                  dispatch(setSettingsActiveTab("second audio"));
                  dispatch(setIsSettingsOpen(true));
                  setIsAudioMenuOpen(false);
                },
                key: "footer-audio-menu-select-secondary-audio",
                checked: false,
                disabled: !isSupportSecondMicrophone(isJoinedAudio),
              },
              {
                text: "Audio statistics",
                click: () => {
                  openAudioStatistics();
                },
                key: "footer-audio-audio-statistics",
                id: "audio-statistics",
                checked: false,
                disabled: !isJoinedAudio,
              },
              {
                text: "Leave audio",
                click: async () => {
                  await stream?.stopAudio();
                  setIsAudioMenuOpen(false);
                  dispatch(setIsStartedAudio(false));
                },
                key: "footer-audio-menu-leave-audio",
                id: "leave-audio",
                checked: false,
                disabled: !isJoinedAudio,
              },
            ].filter((item) => !item?.disabled)}
          />
        }
      />

      {isShowSpeakingWhileMutedToast && (
        <div className="fixed left-1/2 transform -translate-x-1/2 top-[50px] z-50">
          <DraggableToast
            message="You are muted now."
            type="info"
            id="uikit-speaking-while-muted-toast"
            isVisible={isShowSpeakingWhileMutedToast}
            duration={5000}
            onClose={() => setIsShowSpeakingWhileMutedToast(false)}
            action={
              <button
                className="ml-2 flex-shrink-0 focus:outline-none text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                onClick={handleUnmute}
              >
                Unmute
              </button>
            }
          />
        </div>
      )}
    </>
  );
};
