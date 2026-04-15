import React, { useCallback, useContext, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Users, MessageSquare, BadgeHelp } from "lucide-react";
import { AudioButton } from "../../features/audio/components/AudioButton";
import { ShareScreenButton } from "../../features/share/components/ShareScreenButton";
import { WhiteboardButton } from "../../features/whiteboard/components/WhiteboardButton";
import { RecordButton } from "../../features/recording/RecordButton";
import { IconCountButton } from "../widget/IconCountButton";

import { LeaveButton } from "./LeaveButton";
import CaptionButton from "@/features/caption/components/CaptionButton";
import { MoreButton } from "./MoreButton";
import { VideoButton } from "@/features/video/components/VideoButton";
import { RealTimeMediaStreamsButton } from "@/features/real-time-media-streams/components/RealTimeMediaStreamsButton";
import { useResponsiveFooter, type FooterButtonId } from "./useResponsiveFooter";
import {
  useAppDispatch,
  useAppSelector,
  useSessionUISelector,
  useSessionSelector,
  useSubsessionSelector,
  useCaptionSelector,
  useChatSelector,
  useWhiteboardSelector,
  useRtmsSelector,
} from "@/hooks/useAppSelector";
import {
  SessionUIState,
  setIsAskSubsessionHelpConfirm,
  setIsChatPoppedOut,
  setIsJoinSubsessionConfirm,
  setIsParticipantsPoppedOut,
  setIsShowCaptionHistory,
  setIsShowHostCaptionSettings,
  setIsSubsessionPoppedOut,
  setIsShowCaption,
  setIsShowStartCaptionsWindow,
  setActivePopper,
  setIsJoinSubsessionConfirmRemind,
} from "@/store/uiSlice";
import { useAudioChange } from "@/features/audio/hooks/useAudioChange";
import { SubsessionIcon } from "@/features/subsession/components/SubsessionIcon";
import sessionAdditionalContext from "@/context/session-additional-context";
import { MediaDevice, SubsessionUserStatus, SubsessionStatus, RealTimeMediaStreamsStatus } from "@zoom/videosdk";
import { setRtmsLoading } from "@/features/real-time-media-streams/rtmsSlice";
import DraggableToast from "../widget/toast/Toast";
import { isMobileDevice } from "../util/service";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";
import { SessionStatus, RecordingStatus } from "@/types/index.d";
import { useWindowSizeCallback } from "@/hooks/useSizeCallback";
import { useRecording } from "@/features/recording/hooks/useRecording";
import { useCurrentUser } from "@/features/participant/hooks";
import { useWhiteboardToggle } from "@/features/whiteboard/hooks/useWhiteboardToggle";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";

interface FooterProps {
  setIsSettingsOpen: (isOpen: boolean) => void;
  isSettingsOpen: boolean;
  // setActiveSidePanel: any;
  cameraList: MediaDevice[];
  microphoneList: MediaDevice[];
  speakerList: MediaDevice[];
  changeCamera: (deviceId: string) => Promise<void>;
  changeMicrophone: (deviceId: string) => Promise<void>;
  changeSpeaker: (deviceId: string) => Promise<void>;
  orientation?: "vertical" | "horizontal";
  autoClose?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  setIsSettingsOpen,
  isSettingsOpen,
  cameraList,
  microphoneList,
  speakerList,
  changeCamera,
  changeMicrophone,
  changeSpeaker,
  orientation = "horizontal",
  autoClose = true,
  // setActiveSidePanel,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    participantSize,
    isParticipantsPoppedOut,
    isChatPoppedOut,
    isSubsessionPoppedOut,
    activeSidePanel,
    isShowCaption,
    isShowCaptionHistory,
    isShowHostCaptionSettings,
    isJoinSubsessionConfirm,
    isAskSubsessionHelpConfirm,
    themeName,
  }: SessionUIState = useAppSelector(useSessionUISelector);
  const {
    isHost,
    isManager,
    config: {
      featuresOptions: {
        leave: { enable: isSupportLeaveFeature },
        audio: { enable: isSupportAudioFeature },
        video: { enable: isSupportVideoFeature },
        chat: { enable: isSupportChatFeature },
        users: { enable: isSupportUserFeature },
        share: { enable: isSupportShareFeature },
        whiteboard: { enable: isSupportWhiteboardFeature },
        subsession: { enable: isSupportSubsessionFeature },
        settings: { enable: isSupportSettingsFeature },
        realTimeMediaStreams: { enable: isSupportRealTimeMediaStreamsFeature },
        recording: { enable: isSupportRecordingFeature },
      },
    },
    status,
  } = useAppSelector(useSessionSelector);

  const isHostOrManager = isHost || isManager;

  const [isShowCaptionTimeoutError, setIsShowCaptionTimeoutError] = useState(false);

  const {
    currentSubRoom,
    subUserStatus,
    subsessionType,
    subsessionOptions: { isSubsessionSelectionEnabled },
    subStatus,
    isSubsessionEnabled,
  } = useAppSelector(useSubsessionSelector);
  const whiteboard = useAppSelector(useWhiteboardSelector);
  const { enabled: whiteboardEnabled } = whiteboard;
  const isInSubsession = currentSubRoom && subUserStatus === SubsessionUserStatus.InSubsession;
  const currentUser = useCurrentUser();

  const { isTranscriptionInitiated, isTranscriptionFeatureEnabled, isHostDisableCaptions } =
    useAppSelector(useCaptionSelector);

  const dispatch = useAppDispatch();
  const { subsessionClient, realTimeMediaStreamsClient } = useContext(sessionAdditionalContext);

  const { unreadCount } = useAppSelector(useChatSelector);

  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isWhiteboardMenuOpen, setIsWhiteboardMenuOpen] = useState(false);

  // Track viewport width for responsive features
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const MIN_WIDTH_FOR_WHITEBOARD = 680; // Minimum viewport width for whiteboard feature

  useWindowSizeCallback(({ width }) => {
    setViewportWidth(width);
  });

  // Recording hooks
  const { recordingStatus, startRecording, pauseRecording, resumeRecording, stopRecording } = useRecording();

  // Real-Time Media Streams hooks
  const { status: rtmsStatus, isLoading: rtmsIsLoading } = useAppSelector(useRtmsSelector);

  const handleStartRtms = useCallback(async () => {
    dispatch(setRtmsLoading(true));
    await realTimeMediaStreamsClient?.startRealTimeMediaStreams();
  }, [dispatch, realTimeMediaStreamsClient]);

  const handlePauseRtms = useCallback(async () => {
    await realTimeMediaStreamsClient?.pauseRealTimeMediaStreams();
  }, [realTimeMediaStreamsClient]);

  const handleResumeRtms = useCallback(async () => {
    await realTimeMediaStreamsClient?.resumeRealTimeMediaStreams();
  }, [realTimeMediaStreamsClient]);

  const handleStopRtms = useCallback(async () => {
    await realTimeMediaStreamsClient?.stopRealTimeMediaStreams();
  }, [realTimeMediaStreamsClient]);

  // Whiteboard handler
  const {
    handleWhiteboardToggle,
    showScreenShareConfirm: showWhiteboardScreenShareConfirm,
    setShowScreenShareConfirm: setShowWhiteboardScreenShareConfirm,
    handleConfirmStartWhiteboard,
  } = useWhiteboardToggle();

  useAudioChange();
  const handleLeave = () => {
    // Implement leave meeting logic here
  };

  const handleCaptionClick = useCallback(async () => {
    if (isHost && isHostDisableCaptions) {
      dispatch(setIsShowHostCaptionSettings(true));
      return;
    }
    if (!isTranscriptionInitiated) {
      dispatch(setIsShowStartCaptionsWindow(true));
      return;
    }
    dispatch(setIsShowCaption(!isShowCaption));
  }, [dispatch, isHost, isHostDisableCaptions, isShowCaption, isTranscriptionInitiated]);

  const toggleParticipant = () => {
    dispatch(setIsParticipantsPoppedOut(!isParticipantsPoppedOut));
    dispatch(setActivePopper("Participants"));

    // if (activeSidePanel === "participants") {
    //   dispatch(setActiveSidePanel(null));
    // } else if (isParticipantsPoppedOut) {
    //   dispatch(setIsParticipantsPoppedOut(!isParticipantsPoppedOut));
    // } else {
    //   dispatch(setActiveSidePanel("participants"));
    // }
  };

  const toggleChat = () => {
    dispatch(setIsChatPoppedOut(!isChatPoppedOut));
    dispatch(setActivePopper("Chat"));
    // if (activeSidePanel === "chat") {
    //   dispatch(setActiveSidePanel(null));
    // } else if (isChatPoppedOut) {
    //   dispatch(setIsChatPoppedOut(!isChatPoppedOut));
    // } else {
    //   dispatch(setActiveSidePanel("chat"));
    // }
  };

  const toggleSubsession = () => {
    if (isHostOrManager) {
      dispatch(setIsSubsessionPoppedOut(!isSubsessionPoppedOut));
      dispatch(setActivePopper("Subsession"));
    } else {
      if (isSubsessionSelectionEnabled) {
        dispatch(setIsSubsessionPoppedOut(!isSubsessionPoppedOut));
      } else {
        dispatch(setIsJoinSubsessionConfirmRemind(true));
        dispatch(setIsJoinSubsessionConfirm(true));
      }
    }
  };

  const askSubsessionHelp = () => {
    dispatch(setIsAskSubsessionHelpConfirm(!isAskSubsessionHelpConfirm));
  };

  // Build list of enabled buttons for responsive layout
  // Order matters: higher priority buttons (Participants, Chat) come first
  const enabledButtons = useMemo(() => {
    const buttons: FooterButtonId[] = [];

    // High priority - core communication features
    if (isSupportUserFeature) {
      buttons.push("participants");
    }
    if (isSupportChatFeature) {
      buttons.push("chat");
    }

    if (
      isSupportWhiteboardFeature &&
      whiteboardEnabled &&
      !isMobileDevice() &&
      viewportWidth >= MIN_WIDTH_FOR_WHITEBOARD
    ) {
      buttons.push("whiteboard");
    }
    if (isSupportRecordingFeature && isHostOrManager && !isInSubsession) {
      buttons.push("record");
    }
    if (isSupportRealTimeMediaStreamsFeature) {
      buttons.push("realTimeMediaStreams");
    }
    if (isTranscriptionFeatureEnabled && (!isHostDisableCaptions || isHost)) {
      buttons.push("caption");
    }
    if (
      (isHostOrManager ||
        (isSubsessionSelectionEnabled && subStatus === SubsessionStatus.InProgress) ||
        (subUserStatus === SubsessionUserStatus.Invited && subStatus === SubsessionStatus.InProgress)) &&
      isSupportSubsessionFeature &&
      isSubsessionEnabled
    ) {
      buttons.push("subsession");
    }
    if (isInSubsession && !isHostOrManager && isSupportSubsessionFeature) {
      buttons.push("subsessionHelp");
    }

    return buttons;
  }, [
    isSupportUserFeature,
    isSupportChatFeature,
    isSupportWhiteboardFeature,
    whiteboardEnabled,
    isHostOrManager,
    isInSubsession,
    isSupportRecordingFeature,
    isSupportRealTimeMediaStreamsFeature,
    isTranscriptionFeatureEnabled,
    isHostDisableCaptions,
    isHost,
    isSubsessionSelectionEnabled,
    subStatus,
    subUserStatus,
    isSupportSubsessionFeature,
    isSubsessionEnabled,
    viewportWidth,
  ]);

  // Use responsive footer hook to determine which buttons are visible
  const { visibleButtons, overflowButtons } = useResponsiveFooter({
    containerRef,
    enabledButtons,
    orientation,
  });

  const footerClasses =
    orientation === "vertical"
      ? "fixed left-0 top-1/2 -translate-y-1/2 flex flex-col py-4 px-2 border rounded-lg border-theme-border shadow-lg bg-theme-surface"
      : `py-2 px-6 border-t border-theme-border shadow-lg bg-theme-surface ${THEME_COLOR_CLASS}`;

  const containerClasses =
    orientation === "vertical" ? "flex flex-col space-y-4" : "max-w-7xl mx-auto flex justify-between items-center";

  const buttonGroupClasses = orientation === "vertical" ? "flex flex-col space-y-4" : "flex space-x-4";

  const controlsGroupClasses = orientation === "vertical" ? "flex flex-col space-y-2" : "flex";

  if (status !== SessionStatus.Connected) {
    return null;
  }

  return (
    <footer className={`uikit-footer ${footerClasses}`} id={"zoom-ui-toolkit-controls"}>
      <div className={containerClasses} ref={containerRef}>
        <div className={controlsGroupClasses}>
          {isSupportAudioFeature && (
            <div className={orientation === "vertical" ? "mb-2" : "px-1"}>
              <AudioButton
                changeMicrophone={changeMicrophone}
                changeSpeaker={changeSpeaker}
                microphoneList={microphoneList}
                speakerList={speakerList}
                id="uikit-footer-audio"
                orientation={orientation}
                autoClose={autoClose}
              />
            </div>
          )}
          {isSupportVideoFeature && (
            <div className={orientation === "vertical" ? "mb-2" : "px-1"}>
              <VideoButton
                cameraList={cameraList}
                changeCamera={changeCamera}
                orientation={orientation}
                autoClose={autoClose}
              />
            </div>
          )}
        </div>

        <div className={buttonGroupClasses}>
          {/* Share button is ALWAYS visible */}
          {isSupportShareFeature && !isMobileDevice() && (
            <ShareScreenButton
              isMenuOpen={isShareMenuOpen}
              setIsMenuOpen={setIsShareMenuOpen}
              orientation={orientation}
            />
          )}
          {/* Conditionally render buttons based on available space - ordered by priority */}
          {/* High priority - core communication features */}
          {visibleButtons.has("participants") && isSupportUserFeature && (
            <IconCountButton
              icon={Users}
              count={participantSize}
              isActive={isParticipantsPoppedOut || activeSidePanel === "participants"}
              onClick={toggleParticipant}
              id="uikit-footer-participants-button"
              countId="uikit-footer-participant-size"
              themName={themeName}
              orientation={orientation}
            />
          )}
          {visibleButtons.has("chat") && isSupportChatFeature && (
            <IconCountButton
              icon={MessageSquare}
              count={unreadCount}
              isActive={isChatPoppedOut || activeSidePanel === "chat"}
              onClick={toggleChat}
              id="uikit-footer-chat-button"
              countId="uikit-footer-chat-unread"
              themName={themeName}
              orientation={orientation}
            />
          )}
          {visibleButtons.has("whiteboard") && isSupportWhiteboardFeature && whiteboardEnabled && !isMobileDevice() && (
            <WhiteboardButton
              isMenuOpen={isWhiteboardMenuOpen}
              setIsMenuOpen={setIsWhiteboardMenuOpen}
              orientation={orientation}
            />
          )}
          {visibleButtons.has("record") && isSupportRecordingFeature && isHostOrManager && !isInSubsession && (
            <RecordButton orientation={orientation} />
          )}
          {visibleButtons.has("realTimeMediaStreams") && isSupportRealTimeMediaStreamsFeature && (
            <RealTimeMediaStreamsButton orientation={orientation} />
          )}
          {visibleButtons.has("caption") && isTranscriptionFeatureEnabled && (!isHostDisableCaptions || isHost) && (
            <CaptionButton
              isCaptionOn={isShowCaption}
              handleCaptionClick={handleCaptionClick}
              onViewTranscript={() => {
                dispatch(setIsShowCaptionHistory(!isShowCaptionHistory));
              }}
              onCaptionSettings={() => {
                dispatch(setIsShowHostCaptionSettings(!isShowHostCaptionSettings));
              }}
              orientation={orientation}
            />
          )}

          {visibleButtons.has("subsession") &&
            (isHostOrManager ||
              (isSubsessionSelectionEnabled && subStatus === SubsessionStatus.InProgress) ||
              (subUserStatus === SubsessionUserStatus.Invited && subStatus === SubsessionStatus.InProgress)) &&
            isSupportSubsessionFeature &&
            isSubsessionEnabled && (
              <IconCountButton
                icon={SubsessionIcon}
                isActive={isSubsessionPoppedOut}
                onClick={toggleSubsession}
                id="uikit-footer-subsession-button"
                themName={themeName}
                orientation={orientation}
              />
            )}
          {visibleButtons.has("subsessionHelp") && isInSubsession && !isHostOrManager && isSupportSubsessionFeature && (
            <IconCountButton
              icon={BadgeHelp}
              isActive={isAskSubsessionHelpConfirm}
              onClick={askSubsessionHelp}
              id="uikit-footer-subsession-help-button"
              themName={themeName}
              orientation={orientation}
              className="hover:bg-gray-100 transition-colors"
            />
          )}

          {/* Show MoreButton if settings are enabled OR if there are overflow buttons */}
          {(isSupportSettingsFeature || overflowButtons.length > 0) && (
            <MoreButton
              onOpenSettings={() => {
                setIsSettingsOpen(true);
                dispatch(setActivePopper("More"));
              }}
              isSettingsOpen={isSettingsOpen}
              themeName={themeName}
              orientation={orientation}
              overflowButtons={overflowButtons}
              showSettings={isSupportSettingsFeature}
              // Pass button data needed for overflow menu
              buttonData={{
                participantSize,
                unreadCount,
                isParticipantsPoppedOut,
                isChatPoppedOut,
                isSubsessionPoppedOut,
                isAskSubsessionHelpConfirm,
                isShowCaption,
                activeSidePanel,
                toggleParticipant,
                toggleChat,
                toggleSubsession,
                askSubsessionHelp,
                handleCaptionClick,
                onViewTranscript: () => {
                  dispatch(setIsShowCaptionHistory(!isShowCaptionHistory));
                },
                onCaptionSettings: () => {
                  dispatch(setIsShowHostCaptionSettings(!isShowHostCaptionSettings));
                },
                isMenuOpen: isWhiteboardMenuOpen,
                setIsMenuOpen: setIsWhiteboardMenuOpen,
                isShareMenuOpen,
                setIsShareMenuOpen,
                recordingStatus,
                startRecording,
                pauseRecording,
                resumeRecording,
                stopRecording,
                rtmsStatus,
                rtmsIsLoading,
                startRtms: handleStartRtms,
                pauseRtms: handlePauseRtms,
                resumeRtms: handleResumeRtms,
                stopRtms: handleStopRtms,
                isWhiteboardOpen: whiteboard.isWhiteboardOpen,
                isWhiteboardPresenting: whiteboard.presenterID === currentUser?.userId,
                toggleWhiteboard: handleWhiteboardToggle,
              }}
            />
          )}
        </div>

        {isSupportLeaveFeature && (
          <div className={orientation === "vertical" ? "mt-auto" : ""}>
            <LeaveButton isHostOrManager={isHostOrManager} orientation={orientation} />
          </div>
        )}

        {isShowCaptionTimeoutError && (
          <DraggableToast
            message={t("caption.purchase_plan_message")}
            type="error"
            onClose={() => setIsShowCaptionTimeoutError(false)}
            isVisible={true}
          />
        )}

        {showWhiteboardScreenShareConfirm && (
          <ConfirmDialog
            onClose={() => setShowWhiteboardScreenShareConfirm(false)}
            onConfirm={handleConfirmStartWhiteboard}
            title={t("share.stop_screen_share_title")}
            message={t("whiteboard.stop_screen_share_confirm")}
            confirmText={t("whiteboard.start_button")}
            cancelText={t("common.cancel")}
          />
        )}
      </div>
    </footer>
  );
};

export default Footer;
