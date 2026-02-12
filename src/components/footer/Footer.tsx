import React, { useCallback, useContext, useState } from "react";
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
import {
  useAppDispatch,
  useAppSelector,
  useSessionUISelector,
  useSessionSelector,
  useSubsessionSelector,
  useCaptionSelector,
  useChatSelector,
  useWhiteboardSelector,
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
import { MediaDevice, SubsessionUserStatus, SubsessionStatus } from "@zoom/videosdk";
import DraggableToast from "../widget/toast/Toast";
import { isMobileDevice } from "../util/service";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";
import { SessionStatus } from "@/types/index.d";

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
  const { enabled: whiteboardEnabled } = useAppSelector(useWhiteboardSelector);
  const isInSubsession = currentSubRoom && subUserStatus === SubsessionUserStatus.InSubsession;

  const { isTranscriptionInitiated, isTranscriptionFeatureEnabled, isHostDisableCaptions } =
    useAppSelector(useCaptionSelector);

  const dispatch = useAppDispatch();
  const { subsessionClient } = useContext(sessionAdditionalContext);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const { unreadCount } = useAppSelector(useChatSelector);

  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isWhiteboardMenuOpen, setIsWhiteboardMenuOpen] = useState(false);
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
      <div className={containerClasses}>
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
          {isSupportShareFeature && !isMobileDevice() && (
            <ShareScreenButton
              isMenuOpen={isShareMenuOpen}
              setIsMenuOpen={setIsShareMenuOpen}
              orientation={orientation}
            />
          )}
          {isSupportWhiteboardFeature && whiteboardEnabled && !isMobileDevice() && (
            <WhiteboardButton
              isMenuOpen={isWhiteboardMenuOpen}
              setIsMenuOpen={setIsWhiteboardMenuOpen}
              orientation={orientation}
            />
          )}
          {isHostOrManager && !isInSubsession && <RecordButton orientation={orientation} />}
          {isSupportRealTimeMediaStreamsFeature && <RealTimeMediaStreamsButton orientation={orientation} />}
          {isSupportUserFeature && (
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
          {isSupportChatFeature && (
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
          {isTranscriptionFeatureEnabled && (!isHostDisableCaptions || isHost) && (
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

          {(isHostOrManager ||
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
          {isInSubsession && !isHostOrManager && isSupportSubsessionFeature && (
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

          {isSupportSettingsFeature && (
            <MoreButton
              onOpenSettings={() => {
                setIsSettingsOpen(true);
                dispatch(setActivePopper("More"));
              }}
              isSettingsOpen={isSettingsOpen}
              themeName={themeName}
              orientation={orientation}
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
      </div>
    </footer>
  );
};

export default Footer;
