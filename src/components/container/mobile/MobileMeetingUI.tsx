import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import {
  ArrowLeft,
  Info,
  Circle,
  Pause,
  Square,
  CirclePlay,
  Minimize2,
  BadgeHelp,
  LogOut,
  Radio,
  FileVideo2,
  Captions,
  Settings,
} from "lucide-react";
import SelfPreview from "../../../features/video/components/SelfPreview";

import { ParticipantState } from "@/features/participant/participantSlice";
import {
  useAppDispatch,
  useAppSelector,
  useChatSelector,
  useCaptionSelector,
  useParticipantSelector,
  useSessionSelector,
  useSessionUISelector,
  useSubsessionSelector,
} from "@/hooks/useAppSelector";
import { Participant, SuspensionViewType, RecordingStatus } from "@/types/index.d";
import { SessionState } from "@/store/sessionSlice";
import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import {
  SessionUIState,
  setIsActionSheetOpen,
  setIsControlsVisible,
  setIsSessionInfoOpen,
  setIsSettingsOpen,
  setIsShowCaptionHistory,
  setIsShowHostCaptionSettings,
  setIsSubsessionPoppedOut,
  setIsShowCaption,
  setViewType,
  setIsAskSubsessionHelpConfirm,
  setIsInviteDialogOpen,
  setIsShowStartCaptionsWindow,
  setIsShowAVLearnDialog,
  setIsShowLiveStreamPanel,
} from "@/store/uiSlice";
import { FooterMobile } from "@/components/footer/FooterMobile";
import { ChatPanel } from "../../../features/chat/ChatPanel";
import { SettingsPanel } from "@/features/setting/SettingsPanel";
import SessionInfoDropdown from "@/components/header/SessionInfoDropdown";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";
import ParticipantsPanel from "@/features/participant/ParticipantsPanel";
import GalleryViewMobile from "@/features/video/GalleryViewMobile";
import Button from "@/components/widget/CommonButton";
import { SubsessionIcon } from "@/features/subsession/components/SubsessionIcon";
import SubsessionPanel from "@/features/subsession/SubsessionPanel";
import { CaptionContainer } from "@/features/caption/CaptionContainer";
import Swiper, { TouchEventData } from "@/components/widget/Swiper";
import { usePagination } from "@/features/video/hooks";
import ShareViewMobile from "@/features/share/ShareViewMobile";
import PageIndicator from "@/features/video/PageIndicator";
import RecordingNotification from "@/components/notification/RecordingNotification";
import { useRecording } from "@/features/recording/hooks/useRecording";
import ParticipantRenameModal from "@/features/participant/components/ParticipantRenameModal";
import ParticipantAdjustVolumeModal from "@/features/participant/components/ParticipantAdjustVolumeModal";
import { LiveStreamStatus, SubsessionStatus, SubsessionUserStatus } from "@zoom/videosdk";
import MobileMeetingToolbar from "./MobileMeetingToolbar";
import sessionAdditionalContext from "@/context/session-additional-context";
import SubsessionConfirmDialogs from "@/features/subsession/components/SubsessionConfirmDialogs";
import InviteAudioPanel from "@/features/audio/components/InviteAudioPanel";
import { useChatMessage } from "@/features/chat/hook/useChatMessage";
import NewMessageNotification from "@/features/chat/NewMessageNotification";
import LinkOpenConfirmDialog from "@/components/dialog/LinkOpenConfirmDialog";
import useCaptionMenuLogic from "@/features/caption/hooks/useCaptionMenuLogic";
import { SelectLanguageMenuMobile } from "@/features/caption/components/SelectLanguageMenu";
import AVLearnMoreDialog from "@/components/warning/AVLearnMoreDialog";
import { useDevice } from "@/features/setting/hooks/useDevice";
import JoinAudioConsentPanelWithPEPC from "@/components/notification/JoinAudioConsentPanelWithPEPC";
import UnmuteConsentPanel from "@/components/notification/UnmuteConsentPanel";
import { THEME_COLOR_CLASS } from "@/constant";
import RecordingNotificationIcon from "@/components/svg-icon/recordingNotificationIcon";
import { emit } from "@/events/event-bus";
import { ExposedEvents } from "@/events/event-constant";
import LiveStreamPanel from "@/features/live-stream/LiveStreamPanel";
import { useScreenshot } from "@/features/session-app/hooks";
import AnnotationToolbar from "@/features/share/components/AnnotationToolbar";
import { useToggleScreenShare } from "@/features/share/hooks";
import { DialogContainer } from "@/components/widget/dialog/DialogContainer";

const ActionSheet = ({
  isOpen,
  onClose,
  children,
  themeName,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  themeName: string;
}) => {
  if (!isOpen) return null;
  const borderColor = themeName === "dark" ? "border border-theme-border" : "";

  return (
    <div className={`fixed inset-x-0 bottom-0 z-50 flex items-end  w-full justify-center`}>
      <div className={`rounded-t-xl w-full max-w-md overflow-hidden shadow-lg ${THEME_COLOR_CLASS} ${borderColor}`}>
        <div className={`px-4 py-2 space-y-1 `}>{children}</div>
        <button
          onClick={onClose}
          className="w-full px-4 py-3 text-center text-blue-500 font-semibold border-t border-gray-200"
        >
          Cancel
        </button>
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

const ActionItem = ({
  icon: Icon,
  label,
  onClick,
  color = "black",
  className = "",
  id,
  textColor = "text-theme-text",
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  color?: string;
  className?: string;
  id: string;
  textColor?: string;
}) => (
  <button id={id} className={`flex items-center w-full py-3 ${className}`} onClick={onClick}>
    <div className="w-8 h-8 mr-4 flex items-center justify-center">
      <Icon size={24} className={`text-theme-text`} color={color} />
    </div>
    <span className={`${textColor} text-lg`}>{label}</span>
  </button>
);

const MobileMeetingUI = () => {
  const dispatch = useAppDispatch();
  const client = useContext(ClientContext);
  const stream = useContext(StreamContext);
  const { captionClient, liveStreamClient } = useContext(sessionAdditionalContext);
  const timerRef = useRef(0);

  const session: SessionState = useAppSelector(useSessionSelector);
  const sessionUI: SessionUIState = useAppSelector(useSessionUISelector);
  const currentUser: Participant = client.getCurrentUserInfo();
  const { unreadCount, receiveMessage, messages, isEnabledChatInSessionNotifications } =
    useAppSelector(useChatSelector);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCaptionActionSheetOpen, setIsCaptionActionSheetOpen] = useState(false);
  const [mainContentHeight, setMainContentHeight] = useState(0);
  const [mainContentWidth, setMainContentWidth] = useState(0);

  const { cameraList, microphoneList, speakerList, changeCamera, changeMicrophone, changeSpeaker } = useDevice();
  const mainContentRef = useRef(null);

  const { isActionSheetOpen, isControlsVisible, isShowCaption, isParticipantsPoppedOut, viewType } = sessionUI;

  const isMinimized = viewType === "minimized";
  const { participants }: ParticipantState = useAppSelector(useParticipantSelector);
  const { isHost, isManager, liveStreamStatus } = useAppSelector(useSessionSelector);
  const isHostOrManager = isHost || isManager;
  const { currentPage, totalPages, currentParticipants, goToNextPage, goToPreviousPage } = usePagination();
  const [offsetX, setOffsetX] = useState(0);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [participantToRename, setParticipantToRename] = useState<Participant | null>(null);
  const [participantToAdjustVolume, setParticipantToAdjustVolume] = useState<Participant | null>(null);
  const [isAdjustVolumeModalOpen, setIsAdjustVolumeModalOpen] = useState<boolean>(false);

  useScreenshot();

  const {
    config: {
      featuresOptions: {
        leave: { enable: isSupportLeaveFeature },
        audio: { enable: isSupportAudioFeature },
        video: { enable: isSupportVideoFeature },
        chat: { enable: isSupportChatFeature },
        users: { enable: isSupportUserFeature },
        share: { enable: isSupportShareFeature },
        subsession: { enable: isSupportSubsessionFeature },
        settings: { enable: isSupportSettingsFeature },
      },
    },
  } = session;

  const { subsessionClient } = useContext(sessionAdditionalContext);
  const {
    currentSubRoom,
    subStatus,
    subUserStatus,
    subsessionType,
    subsessionOptions: { isSubsessionSelectionEnabled, isBackToMainSessionEnabled },
  } = useAppSelector(useSubsessionSelector);
  const isInSubsession =
    subStatus === SubsessionStatus.InProgress && subUserStatus === SubsessionUserStatus.InSubsession;

  const { isHostDisableCaptions, isTranscriptionFeatureEnabled } = useAppSelector(useCaptionSelector);

  const { handleSendMessage, uploadFileCallback } = useChatMessage();
  const { startCameraShare, stopShare } = useToggleScreenShare();

  useEffect(() => {
    if (
      isControlsVisible &&
      !sessionUI.isShowJoinAudioConsent &&
      !sessionUI.isSessionInfoOpen &&
      !isConfirmDialogOpen
    ) {
      timerRef.current = window.setTimeout(() => {
        dispatch(setIsControlsVisible(false));
        dispatch(setIsSessionInfoOpen(false));
      }, 7000); // Hide controls after 5 seconds of inactivity
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = 0;
      }
    };
  }, [dispatch, isControlsVisible, sessionUI.isSessionInfoOpen, sessionUI.isShowJoinAudioConsent, isConfirmDialogOpen]);

  useEffect(() => {
    const updateDimension = () => {
      if (mainContentRef.current) {
        setMainContentHeight(mainContentRef.current.clientHeight);
        setMainContentWidth(mainContentRef.current.clientWidth);
      }
    };

    updateDimension();
    window.addEventListener("resize", updateDimension);
    return () => window.removeEventListener("resize", updateDimension);
  }, []);

  useEffect(() => {
    if (mainContentRef.current) {
      setMainContentHeight(mainContentRef.current.clientHeight);
      setMainContentWidth(mainContentRef.current.clientWidth);
    }
  }, [isMinimized]);

  useEffect(() => {
    // Save original viewport
    const originalViewport = document.querySelector("meta[name=viewport]")?.getAttribute("content");

    // Update viewport to prevent resizing
    const viewportMeta = document.querySelector("meta[name=viewport]");
    if (viewportMeta) {
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, height=device-height",
      );
    }

    // Add class to prevent scrolling on body
    document.body.classList.add("uikit-keyboard-open");

    return () => {
      // Restore original viewport
      if (viewportMeta && originalViewport) {
        viewportMeta.setAttribute("content", originalViewport);
      }
      document.body.classList.remove("uikit-keyboard-open");
    };
  }, []);

  const showControls = useCallback(() => {
    dispatch(setIsControlsVisible(true));
  }, [dispatch]);

  useEffect(() => {
    const handleTouch = () => {
      showControls();
    };

    document.addEventListener("touchstart", handleTouch);
    return () => {
      document.removeEventListener("touchstart", handleTouch);
    };
  }, [showControls]);

  const closeActionSheet = useCallback(() => {
    dispatch(setIsActionSheetOpen(false));
  }, [dispatch]);

  const toggleSessionInfo = () => {
    dispatch(setIsSessionInfoOpen(!sessionUI.isSessionInfoOpen));
  };

  const handleTouchSwipeEnd = useCallback(
    (payload: TouchEventData) => {
      const { event, direction } = payload;
      if (direction === "left") {
        goToNextPage();
      } else if (direction === "right") {
        goToPreviousPage();
      }
      setOffsetX(0);
    },
    [goToNextPage, goToPreviousPage],
  );

  const handleTouchSwipeMove = useCallback((payload: TouchEventData) => {
    const { offsetX } = payload;
    let moveOffset = 0;
    if (offsetX > 0) {
      moveOffset = Math.min(offsetX, window.innerWidth * 0.7);
    } else {
      moveOffset = -Math.min(Math.abs(offsetX), window.innerWidth * 0.7);
    }
    setOffsetX(moveOffset);
  }, []);

  const confirmLeaveOrEnd = (isEnd: boolean) => {
    client.leave(isEnd);
    setIsConfirmDialogOpen(false);
  };

  const confirmLeaveSubsession = () => {
    subsessionClient.leaveSubsession();
    setIsConfirmDialogOpen(false);
  };

  const handleRenameClick = (participant: Participant) => {
    setParticipantToRename(participant);
    setIsRenameModalOpen(true);
  };

  const handleAdjustLocalVolumeClick = (participant: Participant) => {
    setParticipantToAdjustVolume(participant);
    setIsAdjustVolumeModalOpen(true);
  };

  const handleRename = (newName: string) => {
    if (participantToRename && newName !== participantToRename.displayName) {
      client?.changeName(newName, participantToRename.userId);
    }
    setIsRenameModalOpen(false);
    setParticipantToRename(null);
  };

  const {
    recordingStatus,
    isRecording,
    isRecordingSessionActive,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useRecording();

  const {
    isTranslationFeatureEnabled,
    isTranscriptionInitiated,
    currentSpeakingLanguage,
    currentTranslationLanguage,
    showSpeakingLanguagesMenu,
    showTranslateLanguagesMenu,
    setShowSpeakingLanguagesMenu,
    setShowTranslateLanguagesMenu,
    getSpeakingLanguagesList,
    getTranslationLanguagesList,
    handleSpeakingLanguageSelect,
    handleTranslateToLanguageSelect,
    toggleIsTranslationOn,
  } = useCaptionMenuLogic(setIsCaptionActionSheetOpen);

  const hostTip = "Are you sure you want to leave/end the session for all participants? End action cannot be undone.";
  const participantTip = "Are you sure you want to leave the session?";

  const subHostTip =
    "Are you sure you want to leave/end the subsession for all participants? End action cannot be undone.";
  const subParticipantTip = "Are you sure you want to leave the subsession?";

  const isRecordingSupported = session.featuresOptions?.recording?.enable;
  const isSupportLivestream = session.featuresOptions?.livestream?.enable;
  const isSupportMinimizedView = session?.featuresOptions?.viewMode?.viewModes?.includes(SuspensionViewType.Minimized);
  const handleCaptionClick = useCallback(async () => {
    if (isHost && isHostDisableCaptions) {
      dispatch(setIsShowHostCaptionSettings(true));
      setIsCaptionActionSheetOpen(false);
      closeActionSheet();
      return;
    }
    if (!isTranscriptionInitiated) {
      dispatch(setIsShowStartCaptionsWindow(true));
      setIsCaptionActionSheetOpen(false);
      closeActionSheet();
      return;
    }
    dispatch(setIsShowCaption(!isShowCaption));
  }, [closeActionSheet, dispatch, isHost, isHostDisableCaptions, isShowCaption, isTranscriptionInitiated]);

  const iconColor = sessionUI.themeName === "dark" ? "white" : "black";

  return (
    <div style={{ position: "relative", height: "100svh", width: "100vw" }}>
      {isMinimized && (
        <div className="z-50">
          <MobileMeetingToolbar
            cameraList={cameraList}
            microphoneList={microphoneList}
            speakerList={speakerList}
            changeCamera={changeCamera}
            changeMicrophone={changeMicrophone}
            changeSpeaker={changeSpeaker}
            isHostOrManager={isHostOrManager}
            themeName={sessionUI.themeName}
          />
        </div>
      )}
      <div
        className={`${isMinimized ? "hidden" : "flex flex-col h-screen bg-white relative overflow-hidden"}`}
        onClick={showControls}
        style={{ height: "100svh", overflowY: "hidden" }}
      >
        {/* Toast chat new message container */}
        <NewMessageNotification />
        <UnmuteConsentPanel />
        <JoinAudioConsentPanelWithPEPC />
        <RecordingNotification />

        <header
          className={`uikit-mobile-header ${THEME_COLOR_CLASS} py-2 px-4 flex items-center justify-between absolute top-0 left-0 right-0 shadow-[0_2px_10px_-1px_rgba(0,0,0,0.05)] transition-transform duration-300 ${
            isControlsVisible ? "translate-y-0" : "-translate-y-full"
          }`}
          style={{ zIndex: 2 }}
          id="uikit-mobile-header"
        >
          <div className="flex items-center gap-2">
            {isSupportMinimizedView && (
              <button
                className="p-2 rounded-full transition-colors duration-200 border border-theme-border"
                onClick={() => {
                  dispatch(setViewType(SuspensionViewType.Minimized));
                  emit(ExposedEvents.EVENT_VIEW_TYPE_CHANGE, SuspensionViewType.Minimized);
                }}
              >
                <Minimize2 size={18} className="text-theme-text" />
              </button>
            )}
            <button className="p-2 rounded-full transition-colors duration-200" onClick={toggleSessionInfo}>
              <Info size={24} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1">
            <h1 className="text-lg font-semibold truncate max-w-[180px]" title={session?.sessionInfo?.topic}>
              {session?.sessionInfo?.topic}
            </h1>
            {liveStreamStatus === LiveStreamStatus.InProgress && <Radio className="text-red-500 animate-pulse mx-2" />}
            {isInSubsession && (
              <div className="flex items-center space-x-1 max-w-[100px]" title={currentSubRoom.subsessionName}>
                (<span className="truncate">{currentSubRoom.subsessionName}</span>)
              </div>
            )}
            {isRecording && <RecordingNotificationIcon className="text-red-500 animate-pulse ml-1" size="sm" />}
          </div>

          <div className="flex items-center">
            {isSupportLeaveFeature && (
              <button
                className="text-theme-text-button bg-red-500 p-2 rounded-full"
                onClick={() => {
                  setIsConfirmDialogOpen(!isConfirmDialogOpen);
                }}
              >
                <LogOut size={20} />
              </button>
            )}
          </div>

          <SessionInfoDropdown
            isOpen={sessionUI.isSessionInfoOpen}
            onClose={() => setIsSessionInfoOpen(false)}
            sessionInfo={session.sessionInfo}
            themeName={sessionUI.themeName}
          />
        </header>
        <Swiper
          className="h-full"
          minTriggerWidth={100}
          onTouchEnd={handleTouchSwipeEnd}
          onTouchMove={handleTouchSwipeMove}
          disabled={session?.isAnnotationStarted}
        >
          <main
            className={`uikit-main-content ${THEME_COLOR_CLASS} flex-grow overflow-hidden relative h-full transition-transform duration-100 ease-linear`}
            ref={mainContentRef}
            style={{ transform: `translateX(${offsetX}px)` }}
          >
            <GalleryViewMobile
              mainContentWidth={mainContentWidth}
              mainContentHeight={mainContentHeight}
              currentPage={currentPage}
              totalPages={totalPages}
              currentParticipants={currentParticipants}
              currentUser={currentUser}
              avatarUrl={session.avatarUrl}
            />
            <ShareViewMobile mainContentWidth={mainContentWidth} mainContentHeight={mainContentHeight} />
          </main>
        </Swiper>
        {sessionUI?.canDoAnnotation && currentPage === -1 && (
          <AnnotationToolbar position="absolute left-[10px] bottom-[60px] z-10" />
        )}
        <PageIndicator totalPages={totalPages} currentPage={currentPage} />
        <SelfPreview mainContentWidth={mainContentWidth} />
        {!isMinimized && (
          <FooterMobile
            cameraList={cameraList}
            microphoneList={microphoneList}
            speakerList={speakerList}
            changeCamera={changeCamera}
            changeMicrophone={changeMicrophone}
            changeSpeaker={changeSpeaker}
          />
        )}
        <ChatPanel
          handleImageClick={() => {}}
          handleSendMessage={handleSendMessage}
          height={mainContentHeight}
          uploadFileCallback={uploadFileCallback}
        />
        <LinkOpenConfirmDialog />
        <SettingsPanel
          cameraList={cameraList}
          microphoneList={microphoneList}
          speakerList={speakerList}
          changeCamera={changeCamera}
          changeMicrophone={changeMicrophone}
          changeSpeaker={changeSpeaker}
        />
        {isConfirmDialogOpen &&
          isInSubsession &&
          ReactDOM.createPortal(
            <div className="zoom-ui-toolkit-root">
              <ConfirmDialog
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={() => {
                  if (session.isHost) {
                    confirmLeaveOrEnd(true);
                  } else {
                    confirmLeaveOrEnd(false);
                  }
                }}
                title={session.isHost ? "End/Leave Subsession" : "Leave Subsession"}
                confirmText={session.isHost ? "End" : "Leave"}
                message={session.isHost ? subHostTip : subParticipantTip}
              >
                {isInSubsession && (
                  <>
                    {session.isHost && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          confirmLeaveOrEnd(false);
                        }}
                        title="Leave Session"
                      >
                        Leave
                      </Button>
                    )}
                    {(isBackToMainSessionEnabled || isHostOrManager) && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          confirmLeaveSubsession();
                        }}
                        title="Go Back to Main Session"
                      >
                        To Main
                      </Button>
                    )}
                  </>
                )}
              </ConfirmDialog>
            </div>,
            document.body,
          )}

        {isConfirmDialogOpen &&
          !isInSubsession &&
          ReactDOM.createPortal(
            <div className="zoom-ui-toolkit-root">
              {/* order: cancel, close, confirm */}
              <ConfirmDialog
                onCancel={() => setIsConfirmDialogOpen(false)}
                onClose={() => {
                  confirmLeaveOrEnd(false);
                }}
                title={session.isHost ? "End/Leave Session" : "Leave Session"}
                closeText="Leave"
                closeVariant="outline"
                closeClassName="text-red-500"
                message={session.isHost ? hostTip : participantTip}
                onConfirm={() => {
                  if (session.isHost) {
                    confirmLeaveOrEnd(true);
                  } else if (!session.isHost && session.isManager) {
                    client.reclaimHost();
                  }
                }}
                confirmText={session.isHost ? "End" : session.isManager ? "Reclaim Host" : ""}
                confirmVariant={session.isHost ? "danger" : session.isManager ? "danger" : "secondary"}
              ></ConfirmDialog>
            </div>,
            document.body,
          )}

        <ParticipantsPanel
          participants={participants}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          muteAll={() => {}}
          onRenameClick={handleRenameClick}
          onAdjustLocalVolumeClick={handleAdjustLocalVolumeClick}
        />
        <InviteAudioPanel
          isOpen={sessionUI.isInviteDialogOpen}
          onClose={() => dispatch(setIsInviteDialogOpen(false))}
        />
        {isRenameModalOpen && participantToRename && (
          <ParticipantRenameModal
            isOpen={isRenameModalOpen}
            onClose={() => setIsRenameModalOpen(false)}
            onRename={handleRename}
            initialName={participantToRename.displayName}
          />
        )}
        {isAdjustVolumeModalOpen && participantToAdjustVolume && (
          <ParticipantAdjustVolumeModal
            isOpen={isAdjustVolumeModalOpen}
            onClose={() => {
              setIsAdjustVolumeModalOpen(false);
              setParticipantToAdjustVolume(null);
            }}
            userID={participantToAdjustVolume?.userId}
            displayName={participantToAdjustVolume?.displayName}
          />
        )}
        <SubsessionPanel participants={participants} />
        <SubsessionConfirmDialogs subsessionClient={subsessionClient} />
        <CaptionContainer />
        <LiveStreamPanel />
        {sessionUI.isShowAVlearnDialog && (
          <AVLearnMoreDialog
            open={true}
            handleClose={() => {
              dispatch(setIsShowAVLearnDialog(false));
            }}
          />
        )}
        <ActionSheet
          isOpen={isCaptionActionSheetOpen}
          onClose={() => setIsCaptionActionSheetOpen(false)}
          themeName={sessionUI.themeName}
        >
          <ActionItem
            id="uikit-mobile-caption-back"
            icon={ArrowLeft}
            label="Back"
            color={iconColor}
            onClick={() => {
              setIsCaptionActionSheetOpen(false);
              dispatch(setIsActionSheetOpen(true));
            }}
          />
          <div className="border-t border-gray-200 my-2"></div>
          {!isHostDisableCaptions && (
            <ActionItem
              id="uikit-mobile-caption-show-captions"
              icon={Captions}
              color={iconColor}
              label={isShowCaption ? "Hide Captions" : "Show Captions"}
              onClick={handleCaptionClick}
            />
          )}
          <div className="border-t border-gray-200 my-2"></div>
          <ActionItem
            id="uikit-mobile-caption-set-speaking-language"
            icon={Captions}
            label={`Set Speaking language (${currentSpeakingLanguage})`}
            color={iconColor}
            onClick={() => {
              if (!isTranscriptionInitiated) {
                dispatch(setIsShowStartCaptionsWindow(true));
                setIsCaptionActionSheetOpen(false);
                closeActionSheet();
                return;
              }
              setShowSpeakingLanguagesMenu(true);
              setIsCaptionActionSheetOpen(false);
            }}
          />
          {currentTranslationLanguage !== undefined && <div className="border-t border-gray-200 my-2"></div>}
          {currentTranslationLanguage !== undefined && (
            <ActionItem
              id="uikit-mobile-caption-set-translation-language"
              icon={Captions}
              label={`Set Translation language (${currentTranslationLanguage})`}
              color={iconColor}
              onClick={() => {
                setShowTranslateLanguagesMenu(true);
                setIsCaptionActionSheetOpen(false);
                closeActionSheet();
              }}
            />
          )}
          <div className="border-t border-gray-200 my-2"></div>
          <ActionItem
            id="uikit-mobile-caption-view-full-transcript"
            icon={Captions}
            label="View Full Transcript"
            color={iconColor}
            onClick={() => {
              setIsCaptionActionSheetOpen(false);
              closeActionSheet();
              dispatch(setIsShowCaptionHistory(!sessionUI.isShowCaptionHistory));
            }}
          />

          {isTranslationFeatureEnabled && getTranslationLanguagesList(currentSpeakingLanguage).length > 0 && (
            <div className="border-t border-gray-200 my-2"></div>
          )}
          {isTranslationFeatureEnabled && getTranslationLanguagesList(currentSpeakingLanguage).length > 0 && (
            <ActionItem
              id="uikit-mobile-caption-toggle-translation"
              icon={Captions}
              label={currentTranslationLanguage !== undefined ? "Turn off translation" : "Turn on translation"}
              color={iconColor}
              onClick={toggleIsTranslationOn}
            />
          )}
          {isHost && <div className="border-t border-gray-200 my-2"></div>}
          {isHost && (
            <ActionItem
              id="uikit-mobile-caption-host-caption-settings"
              icon={Captions}
              label="Host Caption Settings"
              color={iconColor}
              className=""
              onClick={() => {
                dispatch(setIsShowHostCaptionSettings(!sessionUI.isShowHostCaptionSettings));
                setIsCaptionActionSheetOpen(false);
                closeActionSheet();
              }}
            />
          )}
        </ActionSheet>
        <ActionSheet
          isOpen={showSpeakingLanguagesMenu}
          onClose={() => setShowSpeakingLanguagesMenu(false)}
          themeName={sessionUI.themeName}
        >
          <ActionItem
            id="uikit-mobile-caption-back-to-speaking-language"
            icon={ArrowLeft}
            label="Back"
            color={iconColor}
            onClick={() => {
              setShowSpeakingLanguagesMenu(false);
              setIsCaptionActionSheetOpen(true);
            }}
          />
          <div className="border-t border-gray-200 my-2"></div>
          <SelectLanguageMenuMobile
            languages={getSpeakingLanguagesList()}
            setShowLanguagesMenu={setShowSpeakingLanguagesMenu}
            selectedLanguage={currentSpeakingLanguage}
            handleLanguageSelect={handleSpeakingLanguageSelect}
          />
        </ActionSheet>
        <ActionSheet
          isOpen={showTranslateLanguagesMenu}
          onClose={() => setShowTranslateLanguagesMenu(false)}
          themeName={sessionUI.themeName}
        >
          <ActionItem
            id="uikit-translate-action-sheet-back"
            icon={ArrowLeft}
            label="Back"
            color={iconColor}
            onClick={() => {
              setShowTranslateLanguagesMenu(false);
              setIsCaptionActionSheetOpen(true);
            }}
          />
          <SelectLanguageMenuMobile
            languages={getTranslationLanguagesList(currentSpeakingLanguage)}
            setShowLanguagesMenu={setShowTranslateLanguagesMenu}
            selectedLanguage={currentTranslationLanguage}
            handleLanguageSelect={handleTranslateToLanguageSelect}
          />
        </ActionSheet>
        <ActionSheet isOpen={isActionSheetOpen} onClose={closeActionSheet} themeName={sessionUI.themeName}>
          {isTranscriptionFeatureEnabled && (
            <ActionItem
              id="uikit-mobile-captions"
              icon={Captions}
              label="Captions"
              color={iconColor}
              onClick={() => {
                setIsCaptionActionSheetOpen(true);
                closeActionSheet();
              }}
              className="border-b border-theme-border"
            />
          )}
          {(isSubsessionSelectionEnabled || isHostOrManager || subUserStatus === SubsessionUserStatus.Invited) &&
            isSupportSubsessionFeature && (
              <ActionItem
                id="uikit-mobile-subsession"
                icon={SubsessionIcon}
                label="Subsession"
                color={iconColor}
                className="border-b border-theme-border"
                onClick={() => {
                  dispatch(setIsSubsessionPoppedOut(!sessionUI.isSubsessionPoppedOut));
                  closeActionSheet();
                }}
              />
            )}

          {isInSubsession && !isHostOrManager && (
            <ActionItem
              id="uikit-mobile-ask-for-help"
              icon={BadgeHelp}
              label="Ask for Help"
              color={iconColor}
              onClick={() => {
                dispatch(setIsAskSubsessionHelpConfirm(!sessionUI.isAskSubsessionHelpConfirm));
                closeActionSheet();
              }}
            />
          )}

          {isHostOrManager && isRecordingSupported && !isInSubsession && (
            <>
              <ActionItem
                id="uikit-mobile-recording"
                icon={isRecordingSessionActive ? Square : Circle}
                label={isRecordingSessionActive ? "Stop Recording" : "Start Recording"}
                color={iconColor}
                onClick={() => {
                  if (isRecordingSessionActive) {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                }}
                className="border-b border-theme-border"
              />
              {isRecordingSessionActive && (
                <ActionItem
                  id="uikit-mobile-recording-pause"
                  icon={recordingStatus === RecordingStatus.Paused ? CirclePlay : Pause}
                  label={recordingStatus === RecordingStatus.Paused ? "Resume Recording" : "Pause Recording"}
                  color={iconColor}
                  onClick={() => {
                    if (recordingStatus === RecordingStatus.Paused) {
                      resumeRecording();
                    } else {
                      pauseRecording();
                    }
                  }}
                />
              )}
            </>
          )}
          {isSupportLivestream && isHost && liveStreamClient?.isLiveStreamEnabled() && (
            <ActionItem
              id="uikit-mobile-live-stream"
              icon={Radio}
              label="Live stream"
              color={iconColor}
              onClick={() => {
                dispatch(setIsShowLiveStreamPanel(true));
                closeActionSheet();
              }}
              className="border-b border-theme-border"
            />
          )}
          {(session.featuresOptions as any)?.cameraShare?.enable && !session.isSendingScreenShare && (
            <ActionItem
              id="uikit-mobile-share-camera"
              icon={FileVideo2}
              label="Share camera"
              color={iconColor}
              className=""
              onClick={async () => {
                await startCameraShare();
                closeActionSheet();
              }}
            />
          )}
          {session.isSendingScreenShare && (
            <ActionItem
              id="uikit-mobile-share-camera"
              icon={FileVideo2}
              label="Stop share"
              color={"red"}
              className=""
              onClick={async () => {
                await stopShare();
                closeActionSheet();
              }}
              textColor="text-red-500"
            />
          )}
          {isSupportSettingsFeature && (
            <ActionItem
              id="uikit-mobile-settings"
              icon={Settings}
              label="Settings"
              color={iconColor}
              className=""
              onClick={() => {
                dispatch(setIsSettingsOpen(!sessionUI.isSettingsOpen));
                closeActionSheet();
              }}
            />
          )}
        </ActionSheet>
        <DialogContainer />
      </div>
    </div>
  );
};
export default MobileMeetingUI;
