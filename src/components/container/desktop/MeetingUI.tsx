import React, { useState, useEffect, useRef, useContext } from "react";
import ReactDOM from "react-dom";
import { Radio, Tv, TvMinimal } from "lucide-react";
import ConfirmDialog from "../../widget/dialog/ConfirmDialog";
import ViewToggleDropdown from "../../header/ViewToggleDropdown";
import SessionInfoDropdown from "../../header/SessionInfoDropdown";
import ParticipantsPanel from "../../../features/participant/ParticipantsPanel";
import ChatPanel from "../../../features/chat/ChatPanel";
import { PanelHeader } from "../../widget/PanelHeader";
import { SettingsPanel } from "../../../features/setting/SettingsPanel";
import { Footer } from "@/components/footer/Footer";
import ShareView from "@/features/share/ShareView";
import GalleryView from "@/features/video/GalleryView";
import { WhiteboardContainer, WhiteboardIndicatorBar } from "@/features/whiteboard/whiteboard";
import {
  useAppDispatch,
  useAppSelector,
  useParticipantSelector,
  useSessionSelector,
  useSessionUISelector,
  useSubsessionSelector,
  useRtmsSelector,
} from "@/hooks/useAppSelector";
import { SessionState } from "@/store/sessionSlice";
import {
  SessionUIState,
  setActiveSidePanel,
  setIsChatPoppedOut,
  setIsInviteDialogOpen,
  setIsParticipantsPoppedOut,
  setIsRenameModalOpen,
  setIsSessionInfoOpen,
  setIsSettingsOpen,
  setIsShowAVLearnDialog,
  setParticipantToRename,
  setParticipantToAdjustVolume,
  setIsAdjustVolumeModalOpen,
  setIsPTZControlPadOpen,
  setPTZControlTargetUser,
} from "@/store/uiSlice";
import { ParticipantState } from "@/features/participant/participantSlice";
import { ClientContext } from "@/context/client-context";
import { Participant } from "@/types";
import { StreamContext } from "@/context/stream-context";
import AVLearnMoreDialog from "@/components/warning/AVLearnMoreDialog";
import ShareBar from "@/features/share/components/ShareBar";
import {
  UnmuteConsentPanel,
  CameraControlConsentPanel,
  RemoteControlNotifications,
  RecordingNotification,
  ShareScreenToSubsessionPanel,
  JoinAudioConsentPanelWithPEPC,
} from "@/components/notification";
import SubsessionPanel from "@/features/subsession/SubsessionPanel";
import { CaptionContainer } from "@/features/caption/CaptionContainer";
import { useRecording } from "@/features/recording/hooks/useRecording";
import ParticipantRenameModal from "@/features/participant/components/ParticipantRenameModal";
import ParticipantAdjustVolumeModal from "@/features/participant/components/ParticipantAdjustVolumeModal";
import SessionInfoButton from "@/components/header/SessionInfoButton";
import MobileMeetingToolbar from "../mobile/MobileMeetingToolbar";
import sessionAdditionalContext from "@/context/session-additional-context";
import { useTranslation } from "react-i18next";
import {
  BroadcastStreamingStatus,
  LiveStreamStatus,
  RealTimeMediaStreamsStatus,
  SubsessionUserStatus,
} from "@zoom/videosdk";
import SubsessionConfirmDialogs from "../../../features/subsession/components/SubsessionConfirmDialogs";
import InviteAudioPanel from "@/features/audio/components/InviteAudioPanel";
import { SIDE_PANEL_HEADER_HEIGHT, THEME_COLOR_CLASS } from "@/constant/ui-constant";
import { PlaybackBar } from "@/features/setting/components";
import { LinkOpenConfirmDialog } from "@/components/dialog/LinkOpenConfirmDialog";
import { ImagePreview } from "@/components/util/ImagePreview";
import { useChatMessage } from "@/features/chat/hook/useChatMessage";
import { useDevice } from "@/features/setting/hooks/useDevice";
import NewMessageNotification from "@/features/chat/NewMessageNotification";
import RecordingNotificationIcon from "@/components/svg-icon/recordingNotificationIcon";
import ShareIndicatorBar from "@/features/share/components/ShareIndicatorBar";
import LiveStreamPanel from "@/features/live-stream/LiveStreamPanel";
import { useScreenshot } from "@/features/session-app/hooks";
import { DialogContainer } from "@/components/widget/dialog/DialogContainer";
import PTZControlPad from "@/features/video/components/PTZControlPad";
import SelfPreview from "@/features/video/components/SelfPreview";

const MOBILE_BREAKPOINT = 768;
const HEADER_HEIGHT = 49;
const FOOTER_HEIGHT = 59;

const MeetingUI = () => {
  const dispatch = useAppDispatch();
  const client = useContext(ClientContext);
  const stream = useContext(StreamContext);
  const { t } = useTranslation();
  const mediaStream = stream.stream;

  const session: SessionState = useAppSelector(useSessionSelector);
  const whiteboard = useAppSelector((state) => state.whiteboard);
  const { status: rtmsStatus } = useAppSelector(useRtmsSelector);

  const currentUser: Participant = client.getCurrentUserInfo();
  const isRtmsActive =
    rtmsStatus === RealTimeMediaStreamsStatus.Start || rtmsStatus === RealTimeMediaStreamsStatus.Pause;

  useScreenshot();

  const sessionUI = useAppSelector(useSessionUISelector) as SessionUIState;
  const {
    isHeaderEnable,
    isFooterEnable,
    isRenameModalOpen,
    participantToRename,
    participantToAdjustVolume,
    isAdjustVolumeModalOpen,
    isPTZControlPadOpen,
    ptzControlTargetUser,
  } = sessionUI;
  let HEADER_AND_FOOTER_HEIGHT = isHeaderEnable ? HEADER_HEIGHT : 0;
  if (isFooterEnable) {
    HEADER_AND_FOOTER_HEIGHT += FOOTER_HEIGHT;
  }
  const { participants }: ParticipantState = useAppSelector(useParticipantSelector);

  const [searchTerm, setSearchTerm] = useState("");

  const isSidePanelOpen = sessionUI.activeSidePanel !== null;
  const mainContentRef = useRef(null);
  const [mainContentHeight, setMainContentHeight] = useState(0);
  const [mainContentWidth, setMainContentWidth] = useState(0);

  const [windowWidth, setWindowWidth] = useState(MOBILE_BREAKPOINT);

  const isMinimized = sessionUI.viewType === "minimized";
  const { subsessionClient } = useContext(sessionAdditionalContext);
  const {
    currentSubRoom,
    subStatus,
    subUserStatus,
    inviter: subsessionInviter,
  } = useAppSelector(useSubsessionSelector);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { cameraList, microphoneList, speakerList, changeCamera, changeMicrophone, changeSpeaker } = useDevice();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { handleSendMessage, cancelUpload } = useChatMessage();

  useEffect(() => {
    if (windowWidth < MOBILE_BREAKPOINT) {
      if (sessionUI.activeSidePanel === "participants") {
        setIsParticipantsPoppedOut(true);
      } else if (sessionUI.activeSidePanel === "chat") {
        setIsChatPoppedOut(true);
      }
      setActiveSidePanel(null);
    }
  }, [sessionUI.activeSidePanel, windowWidth]);

  useEffect(() => {
    const updateDimension = () => {
      if (mainContentRef.current && wrapperRef.current) {
        const tmpMainHeight = wrapperRef.current.clientHeight - HEADER_AND_FOOTER_HEIGHT;
        const tmpMainWidth = wrapperRef.current.clientWidth;
        setMainContentHeight(tmpMainHeight);
        mainContentRef.current.style.height = `${tmpMainHeight}px`;
        mainContentRef.current.style.width = `${tmpMainWidth}px`;
        setMainContentWidth(tmpMainWidth);
      }
    };

    updateDimension();
    window.addEventListener("resize", updateDimension);
    return () => window.removeEventListener("resize", updateDimension);
  }, [HEADER_AND_FOOTER_HEIGHT]);

  const handleRenameClick = (participant: Participant) => {
    dispatch(setParticipantToRename(participant));
    dispatch(setIsRenameModalOpen(true));
  };

  const handleAdjustLocalVolumeClick = (participant: Participant) => {
    dispatch(setParticipantToAdjustVolume(participant));
    dispatch(setIsAdjustVolumeModalOpen(true));
  };

  const handleRename = (newName: string) => {
    if (participantToRename && newName !== participantToRename.displayName) {
      client?.changeName(newName, participantToRename.userId);
    }
    dispatch(setIsRenameModalOpen(false));
    dispatch(setParticipantToRename(null));
  };

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleEndMeeting = () => {
    setIsConfirmDialogOpen(true);
  };

  const confirmEndMeeting = () => {
    // eslint-disable-next-line no-console
    console.log("Ending the meeting for all");
    // Implement end meeting for all logic here
    setIsConfirmDialogOpen(false);
  };

  const toggleSessionInfo = () => {
    dispatch(setIsSessionInfoOpen(!sessionUI.isSessionInfoOpen));
  };

  const muteAll = () => {
    mediaStream.muteAllAudio();
  };

  const handleImageClick = (imageSrc) => {
    setPreviewImage(imageSrc);
  };

  const { isRecording } = useRecording();

  const speaker = { id: "S1", name: "Phil Harris", image: "/image/2.jpg" };
  const contentWidth = "w-full";
  const contentHeight = "h-full";
  const wrapperClass = `${THEME_COLOR_CLASS} flex flex-col min-w-[${MOBILE_BREAKPOINT}px] min-h-[300px] ${contentHeight} ${contentWidth}`;

  const commonContent = (
    <>
      <InviteAudioPanel isOpen={sessionUI.isInviteDialogOpen} onClose={() => dispatch(setIsInviteDialogOpen(false))} />
      {isRenameModalOpen && participantToRename && (
        <ParticipantRenameModal
          isOpen={isRenameModalOpen}
          onClose={() => {
            dispatch(setIsRenameModalOpen(false));
            dispatch(setParticipantToRename(null));
          }}
          onRename={handleRename}
          initialName={participantToRename.displayName}
        />
      )}
      {isAdjustVolumeModalOpen && participantToAdjustVolume && (
        <ParticipantAdjustVolumeModal
          isOpen={isAdjustVolumeModalOpen}
          onClose={() => {
            dispatch(setIsAdjustVolumeModalOpen(false));
            dispatch(setParticipantToAdjustVolume(null));
          }}
          userID={participantToAdjustVolume?.userId}
          displayName={participantToAdjustVolume?.displayName}
        />
      )}
      <SubsessionConfirmDialogs subsessionClient={subsessionClient} />
      <LinkOpenConfirmDialog />
      <SubsessionPanel participants={participants} />
      {session.isSendingScreenShare && <ShareBar />}
      {session.isReceivingScreenShare && <ShareIndicatorBar />}

      {whiteboard.isWhiteboardOpen && <WhiteboardIndicatorBar />}
      {!isSidePanelOpen && (
        <ChatPanel
          handleImageClick={handleImageClick}
          handleSendMessage={handleSendMessage}
          cancelUpload={cancelUpload}
        />
      )}
      {!isSidePanelOpen && (
        <ParticipantsPanel
          participants={participants}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          muteAll={muteAll}
          onRenameClick={handleRenameClick}
          onAdjustLocalVolumeClick={handleAdjustLocalVolumeClick}
        />
      )}
      <SettingsPanel
        cameraList={cameraList}
        microphoneList={microphoneList}
        speakerList={speakerList}
        changeCamera={changeCamera}
        changeMicrophone={changeMicrophone}
        changeSpeaker={changeSpeaker}
      />
      {isPTZControlPadOpen && ptzControlTargetUser && (
        <PTZControlPad
          targetUserId={ptzControlTargetUser.userId}
          onClose={() => {
            dispatch(setIsPTZControlPadOpen(false));
            dispatch(setPTZControlTargetUser(null));
          }}
        />
      )}
      <RecordingNotification />
      <UnmuteConsentPanel />
      <CameraControlConsentPanel />
      <RemoteControlNotifications />
      <ShareScreenToSubsessionPanel />
      <JoinAudioConsentPanelWithPEPC />
      {isConfirmDialogOpen &&
        ReactDOM.createPortal(
          <div className="zoom-ui-toolkit-root">
            <ConfirmDialog
              onClose={() => setIsConfirmDialogOpen(false)}
              onConfirm={confirmEndMeeting}
              title={t("meeting.ui_end_for_all_title")}
              message={t("meeting.ui_end_for_all_message")}
            />
          </div>,
          document.body,
        )}
      {previewImage && <ImagePreview imageUrl={previewImage} onClose={() => setPreviewImage(null)} />}
      {sessionUI.isShowAVlearnDialog && (
        <AVLearnMoreDialog
          open={true}
          handleClose={() => {
            dispatch(setIsShowAVLearnDialog(false));
          }}
        />
      )}
      <CaptionContainer />
      <PlaybackBar />
      <LiveStreamPanel />
    </>
  );

  return (
    <div className={wrapperClass} ref={wrapperRef} id="uikit-container-app">
      {isMinimized && commonContent}

      {isMinimized && (
        <div className="z-50">
          <MobileMeetingToolbar
            cameraList={cameraList}
            microphoneList={microphoneList}
            speakerList={speakerList}
            changeCamera={changeCamera}
            changeMicrophone={changeMicrophone}
            changeSpeaker={changeSpeaker}
            isHostOrManager={session.isHost || session.isManager}
            themeName={sessionUI.themeName}
          />
        </div>
      )}
      <div className={`${wrapperClass} ${isMinimized ? "hidden" : ""}`}>
        {isHeaderEnable && (
          <header
            className={`uikit-header py-1 px-2 flex justify-between items-center border-b shadow-sm relative ${THEME_COLOR_CLASS}`}
            id="uikit-header"
          >
            <div className="w-1/4 flex items-center">
              <SessionInfoButton onClick={toggleSessionInfo} />
              <SessionInfoDropdown
                isOpen={sessionUI.isSessionInfoOpen}
                onClose={() => setIsSessionInfoOpen(false)}
                sessionInfo={session.sessionInfo}
                themeName={sessionUI.themeName}
              />
              <span className="text-red-500 text-sm max-w-[250px] truncate" title={session?.trackingId}>
                {session?.trackingId && session?.debug ? `${session.trackingId}` : ""}
              </span>
            </div>

            <div className="w-1/2 flex justify-center items-center">
              <div className="flex items-center">
                {session.isHost && session.broadcastStreamingStatus === BroadcastStreamingStatus.InProgress && (
                  <span
                    title={t("broadcast_streaming_live_indicator")}
                    aria-label={t("broadcast_streaming_live_indicator")}
                  >
                    <Radio className="text-emerald-500 animate-pulse mr-2" />
                  </span>
                )}
                <h1 className="text-xl font-semibold truncate flex items-center" id="uikit-header-session-info">
                  <span className="truncate max-w-[400px] inline-block">{session?.sessionInfo?.topic}</span>
                  {session?.debug && session?.isVideoWebRTC && <span className="text-red-500"> (WebRTC)</span>}
                </h1>
                {session.liveStreamStatus === LiveStreamStatus.InProgress && (
                  <Radio className="text-red-500 animate-pulse mx-2" />
                )}

                <div className="flex items-center ml-2">
                  {subUserStatus === SubsessionUserStatus.InSubsession && (
                    <div className="flex items-center space-x-1" id="uikit-header-subsession-name">
                      ({currentSubRoom.subsessionName})
                    </div>
                  )}
                  {isRecording && <RecordingNotificationIcon className="text-red-500 animate-pulse" size="sm" />}
                </div>

                {isRtmsActive && (
                  <span title={rtmsStatus === RealTimeMediaStreamsStatus.Pause ? "RTMS is paused" : "RTMS is active"}>
                    {rtmsStatus === RealTimeMediaStreamsStatus.Pause ? (
                      <TvMinimal className="text-red-500 mx-2" size={14} />
                    ) : (
                      <Tv className="text-red-500 animate-pulse mx-2" size={14} />
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className="w-1/4 flex justify-end">
              <ViewToggleDropdown />
            </div>

            <NewMessageNotification />
          </header>
        )}
        <main className={`uikit-main-content ${THEME_COLOR_CLASS} w-full h-full flex relative`} ref={mainContentRef}>
          <div className={`${isSidePanelOpen ? "flex-grow" : "w-full"} h-full flex flex-col overflow-hidden `}>
            <GalleryView isSidePanelOpen={isSidePanelOpen} mainContentHeight={mainContentHeight} />
            <ShareView mainContentHeight={mainContentHeight} mainContentWidth={mainContentWidth} />
            <WhiteboardContainer mainContentHeight={mainContentHeight} mainContentWidth={mainContentWidth} />
          </div>
          {!session.isSupportMultipleVideos && <SelfPreview mainContentWidth={mainContentWidth} />}
          <div
            className={`${
              isSidePanelOpen ? "w-[400px] border-l" : "w-0"
            } h-full flex flex-col relative overflow-hidden dark:border-bg-300`}
            style={{ height: mainContentHeight }}
          >
            {isSidePanelOpen && (
              <div
                className="w-full  border-l dark:border-bg-300 flex flex-col shadow-lg relative"
                style={{ height: mainContentHeight - SIDE_PANEL_HEADER_HEIGHT }}
              >
                <PanelHeader
                  title={sessionUI.activeSidePanel === "participants" ? "Participants" : "Chat"}
                  onClose={() => dispatch(setActiveSidePanel(null))}
                  onPopOut={() => {
                    if (sessionUI.activeSidePanel === "participants") {
                      dispatch(setIsParticipantsPoppedOut(true));
                    } else if (sessionUI.activeSidePanel === "chat") {
                      dispatch(setIsChatPoppedOut(true));
                    }
                    dispatch(setActiveSidePanel(null));
                  }}
                />
                <div className="flex-grow" style={{ maxHeight: `${mainContentHeight - SIDE_PANEL_HEADER_HEIGHT}px` }}>
                  {sessionUI.activeSidePanel === "participants" && (
                    <ParticipantsPanel
                      participants={participants}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      muteAll={muteAll}
                      onRenameClick={handleRenameClick}
                      onAdjustLocalVolumeClick={handleAdjustLocalVolumeClick}
                      height={mainContentHeight - SIDE_PANEL_HEADER_HEIGHT}
                    />
                  )}
                  {sessionUI.activeSidePanel === "chat" && (
                    <ChatPanel
                      handleImageClick={handleImageClick}
                      height={mainContentHeight - SIDE_PANEL_HEADER_HEIGHT}
                      handleSendMessage={handleSendMessage}
                      cancelUpload={cancelUpload}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
        {isFooterEnable && !isMinimized && (
          <Footer
            isSettingsOpen={sessionUI.isSettingsOpen}
            setIsSettingsOpen={() => {
              dispatch(setIsSettingsOpen(!sessionUI.isSettingsOpen));
            }}
            cameraList={cameraList}
            microphoneList={microphoneList}
            speakerList={speakerList}
            changeCamera={changeCamera}
            changeMicrophone={changeMicrophone}
            changeSpeaker={changeSpeaker}
          />
        )}
        {!isMinimized && commonContent}
      </div>
      <DialogContainer />
    </div>
  );
};
export default MeetingUI;
