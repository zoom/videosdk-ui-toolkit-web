import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import {
  setIsRemoveParticipantDialogOpen,
  setParticipantToRemove,
  setIsMakeHostDialogOpen,
  setParticipantToMakeHost,
  setIsPTZControlPadOpen,
  setPTZControlTargetUser,
} from "@/store/uiSlice";
import { Participant } from "@/types";
import { useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export function useParticipantMenu(
  participant: Participant,
  currentUser: Participant,
  onRenameClick?: (participant: Participant) => void,
  onAdjustLocalVolumeClick?: (participant: Participant) => void,
) {
  const { t } = useTranslation();
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const dispatch = useAppDispatch();
  const { spotlightUserList } = useAppSelector(useSessionSelector);
  const isManager = currentUser?.isManager;
  const isHost = currentUser?.isHost;
  const currentUserId = currentUser?.userId;
  const isHostOrManager = isHost || isManager;
  const isSelf = currentUserId === participant?.userId;

  const CHANGE_NAME_TEXT = t("participant.menu_change_name");
  const ASK_TO_UNMUTE_TEXT = t("participant.menu_ask_to_unmute");
  const REMOVE_FROM_SESSION_TEXT = t("participant.menu_remove");
  const MUTE_TEXT = t("participant.menu_mute");
  const MAKE_HOST_TEXT = t("participant.menu_make_host");
  const MAKE_MANAGER_TEXT = t("participant.menu_make_manager");
  const REVOKE_MANAGER_TEXT = t("participant.menu_revoke_manager");
  const SPOTLIGHT = t("participant.menu_spotlight"); // https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#spotlightVideo
  const REMOVE_SPOTLIGHT = t("participant.menu_remove_spotlight"); //https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#removeSpotlightedVideo
  const REPLACE_SPOTLIGHT = t("participant.menu_replace_spotlight");
  const ADJUST_AUDIO_LOCAL = t("participant.menu_adjust_audio_local"); //https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#adjustUserAudioVolumeLocally
  const REQUEST_CAMERA_CONTROL = t("participant.menu_request_camera_control"); // https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#requestFarEndCameraControl
  const GIVE_UP_CAMERA_CONTROL = t("participant.menu_give_up_camera_control"); // https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#giveUpFarEndCameraControl
  const SCREENSHOT_TEXT = t("participant.menu_screenshot"); // https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#screenshotVideo

  const { featuresOptions } = useAppSelector(useSessionSelector);
  const isVideoScreenshotEnabled = featuresOptions?.screenshot?.video?.enable;

  const [isScreenshotCapturing, setIsScreenshotCapturing] = useState(false);

  const takeVideoScreenshot = useCallback(async () => {
    if (!stream || !isVideoScreenshotEnabled || participant?.userId === undefined || isScreenshotCapturing) return;

    setIsScreenshotCapturing(true);
    try {
      const blob = await stream.screenshotVideo(participant.userId);
      if (blob instanceof Blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "screenshot.png";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // eslint-disable-next-line no-console
        console.error("Screenshot failed:", blob);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Screenshot threw", err);
    } finally {
      setIsScreenshotCapturing(false);
    }
  }, [stream, isVideoScreenshotEnabled, participant?.userId, isScreenshotCapturing]);

  const handleMenuItemClick = useCallback(
    async (action: string) => {
      if (participant?.isHost && isManager) {
        // Prevent managers from taking actions on hosts
        if (action === CHANGE_NAME_TEXT || action === ASK_TO_UNMUTE_TEXT || action === REMOVE_FROM_SESSION_TEXT) {
          return; // Do nothing
        }
      }
      switch (action) {
        // NOTE: Ask to start video is not supported
        // case "Toggle video":
        //   if (participant.bVideoOn) {
        //     console.log("stop video", participant.bVideoOn);
        //     stream?.stopVideo();
        //   } else {
        //     console.log("start video", participant.bVideoOn);
        //     stream?.startVideo();
        //   }
        // NOTE: Video SDK Bug, calling unmuteAudio does not trigger the host-ask-unmute-audio event
        case ASK_TO_UNMUTE_TEXT:
          if (stream) {
            try {
              await stream.unmuteAudio(participant?.userId);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(`Error calling audio action for participant ${participant?.userId}:`, error);
            }
          }
          break;
        case SPOTLIGHT:
          if (stream) {
            try {
              await stream.spotlightVideo(participant?.userId, true);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(error);
            }
          }
          break;
        case REMOVE_SPOTLIGHT:
          if (stream) {
            try {
              await stream.removeSpotlightedVideo(participant?.userId);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(error);
            }
          }
          break;
        case MUTE_TEXT:
          stream?.muteAudio(participant?.userId);
          break;
        case MAKE_HOST_TEXT:
          dispatch(setParticipantToMakeHost(participant));
          dispatch(setIsMakeHostDialogOpen(true));
          break;
        case MAKE_MANAGER_TEXT:
          client?.makeManager(participant?.userId);
          break;
        case REVOKE_MANAGER_TEXT:
          client?.revokeManager(participant?.userId);
          break;
        case CHANGE_NAME_TEXT:
          if (onRenameClick && (isHostOrManager || isSelf)) {
            onRenameClick(participant);
          }
          break;
        case REMOVE_FROM_SESSION_TEXT:
          dispatch(setParticipantToRemove(participant));
          dispatch(setIsRemoveParticipantDialogOpen(true));
          break;
        case ADJUST_AUDIO_LOCAL:
          if (onAdjustLocalVolumeClick) {
            onAdjustLocalVolumeClick(participant);
          }
          break;
        case REQUEST_CAMERA_CONTROL:
          if (participant) {
            dispatch(setPTZControlTargetUser(participant));
            dispatch(setIsPTZControlPadOpen(true));
          }
          break;
        case GIVE_UP_CAMERA_CONTROL:
          if (stream && participant?.userId) {
            try {
              await (stream as any).giveUpFarEndCameraControl(participant.userId);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error("Failed to give up camera control:", error);
            }
          }
          break;
        case SCREENSHOT_TEXT: {
          takeVideoScreenshot();
          break;
        }
        default:
          // eslint-disable-next-line no-console
          console.warn(`Unhandled menu action: ${action}`);
      }
    },
    [
      participant,
      isManager,
      stream,
      client,
      onRenameClick,
      isHostOrManager,
      isSelf,
      onAdjustLocalVolumeClick,
      takeVideoScreenshot,
      dispatch,
      CHANGE_NAME_TEXT,
      ASK_TO_UNMUTE_TEXT,
      REMOVE_FROM_SESSION_TEXT,
      MUTE_TEXT,
      MAKE_HOST_TEXT,
      MAKE_MANAGER_TEXT,
      REVOKE_MANAGER_TEXT,
      SPOTLIGHT,
      REMOVE_SPOTLIGHT,
      ADJUST_AUDIO_LOCAL,
      REQUEST_CAMERA_CONTROL,
      GIVE_UP_CAMERA_CONTROL,
      SCREENSHOT_TEXT,
    ],
  );

  const getButtonLayoutData = useCallback(
    (action: string, className?: string, alternativeLabel?: string) => {
      return {
        label: alternativeLabel || action,
        className,
        onClick: () => handleMenuItemClick(action),
      };
    },
    [handleMenuItemClick],
  );

  const isUserSpotlighted = useMemo(
    () => spotlightUserList.some((user) => user.userId === participant?.userId),
    [participant, spotlightUserList],
  );

  const menuItems = useMemo(() => {
    const canShowAdjustLocalVolumeDialog =
      participant?.audio !== "" && onAdjustLocalVolumeClick && getButtonLayoutData(ADJUST_AUDIO_LOCAL);
    const hostMenu = [
      participant?.audio === "computer" && !participant?.muted && getButtonLayoutData(MUTE_TEXT),
      participant?.audio === "computer" && participant?.muted && getButtonLayoutData(ASK_TO_UNMUTE_TEXT),
      getButtonLayoutData(MAKE_HOST_TEXT),
      getButtonLayoutData(participant?.isManager ? REVOKE_MANAGER_TEXT : MAKE_MANAGER_TEXT),
      onRenameClick && getButtonLayoutData(CHANGE_NAME_TEXT),
      canShowAdjustLocalVolumeDialog,
      participant?.bVideoOn &&
        !isUserSpotlighted &&
        getButtonLayoutData(SPOTLIGHT, undefined, spotlightUserList?.length > 0 && REPLACE_SPOTLIGHT),
      isUserSpotlighted && getButtonLayoutData(REMOVE_SPOTLIGHT),
      isVideoScreenshotEnabled &&
        participant?.bVideoOn &&
        !isScreenshotCapturing &&
        getButtonLayoutData(SCREENSHOT_TEXT),
      participant?.bVideoOn && getButtonLayoutData(REQUEST_CAMERA_CONTROL),
      getButtonLayoutData(REMOVE_FROM_SESSION_TEXT, "text-red-500"),
    ].filter(Boolean);

    const managerMenu = [
      !participant?.isHost && participant?.audio === "computer" && !participant.muted && getButtonLayoutData(MUTE_TEXT),
      !participant?.isHost &&
        participant?.audio === "computer" &&
        participant?.muted &&
        getButtonLayoutData(ASK_TO_UNMUTE_TEXT),
      onRenameClick && getButtonLayoutData(CHANGE_NAME_TEXT),
      participant?.bVideoOn &&
        !isUserSpotlighted &&
        getButtonLayoutData(SPOTLIGHT, undefined, spotlightUserList?.length > 0 && REPLACE_SPOTLIGHT),
      isUserSpotlighted && getButtonLayoutData(REMOVE_SPOTLIGHT),
      isVideoScreenshotEnabled &&
        participant?.bVideoOn &&
        !isScreenshotCapturing &&
        getButtonLayoutData(SCREENSHOT_TEXT),
      participant?.bVideoOn && getButtonLayoutData(REQUEST_CAMERA_CONTROL),
      !participant?.isHost && getButtonLayoutData(REMOVE_FROM_SESSION_TEXT, "text-red-500"),
      canShowAdjustLocalVolumeDialog,
    ].filter(Boolean);

    const selfMenu = [
      onRenameClick && getButtonLayoutData(CHANGE_NAME_TEXT),
      participant?.bVideoOn &&
        (isHost || isManager) &&
        !isUserSpotlighted &&
        getButtonLayoutData(SPOTLIGHT, undefined, spotlightUserList?.length > 0 && REPLACE_SPOTLIGHT),
      (isHost || isManager) && isUserSpotlighted && getButtonLayoutData(REMOVE_SPOTLIGHT),
      isVideoScreenshotEnabled &&
        participant?.bVideoOn &&
        !isScreenshotCapturing &&
        getButtonLayoutData(SCREENSHOT_TEXT),
    ].filter(Boolean);

    if (isSelf) return selfMenu;
    if (isHost) return hostMenu;
    if (isManager && !participant?.isHost) return managerMenu;
    return [
      canShowAdjustLocalVolumeDialog,
      isVideoScreenshotEnabled &&
        participant?.bVideoOn &&
        !isScreenshotCapturing &&
        getButtonLayoutData(SCREENSHOT_TEXT),
    ].filter(Boolean);
  }, [
    participant?.audio,
    participant?.muted,
    participant?.isManager,
    participant?.bVideoOn,
    participant?.isHost,
    onAdjustLocalVolumeClick,
    getButtonLayoutData,
    onRenameClick,
    isUserSpotlighted,
    spotlightUserList?.length,
    isHost,
    isManager,
    isSelf,
    isScreenshotCapturing,
    isVideoScreenshotEnabled,
    CHANGE_NAME_TEXT,
    ASK_TO_UNMUTE_TEXT,
    REMOVE_FROM_SESSION_TEXT,
    MUTE_TEXT,
    MAKE_HOST_TEXT,
    MAKE_MANAGER_TEXT,
    REVOKE_MANAGER_TEXT,
    SPOTLIGHT,
    REMOVE_SPOTLIGHT,
    REPLACE_SPOTLIGHT,
    ADJUST_AUDIO_LOCAL,
    REQUEST_CAMERA_CONTROL,
    SCREENSHOT_TEXT,
  ]);

  return {
    menuItems,
  };
}
