import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { AudioButton } from "@/features/audio/components/AudioButton";
import { VideoButton } from "@/features/video/components/VideoButton";
import {
  useAppDispatch,
  useAppSelector,
  useChatSelector,
  useSessionSelector,
  useSessionUISelector,
} from "@/hooks/useAppSelector";
import { MessageSquare, MoreHorizontal, Users } from "lucide-react";
import { SessionState } from "@/store/sessionSlice";
import { SessionUIState, setIsActionSheetOpen, setIsChatPoppedOut, setIsParticipantsPoppedOut } from "@/store/uiSlice";
import { MediaDevice, Participant, SessionStatus } from "@/types/index.d";
import ControlButton from "../widget/ControlButton";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";

export const FooterMobile = ({
  cameraList,
  microphoneList,
  speakerList,
  changeCamera,
  changeMicrophone,
  changeSpeaker,
}: {
  cameraList: MediaDevice[];
  microphoneList: MediaDevice[];
  speakerList: MediaDevice[];
  changeCamera: (deviceId: string) => Promise<void>;
  changeMicrophone: (deviceId: string) => Promise<void>;
  changeSpeaker: (deviceId: string) => Promise<void>;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const client = useContext(ClientContext);
  const stream = useContext(StreamContext);
  const mediaStream = stream.stream;

  const session: SessionState = useAppSelector(useSessionSelector);
  const sessionUI: SessionUIState = useAppSelector(useSessionUISelector);
  const currentUser: Participant = client.getCurrentUserInfo();
  const { unreadCount } = useAppSelector(useChatSelector);

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
      },
    },
    status,
  } = session;

  const toggleChat = () => {
    dispatch(setIsChatPoppedOut(!sessionUI.isChatPoppedOut));
  };
  const toggleParticipantsList = () => {
    dispatch(setIsParticipantsPoppedOut(!sessionUI.isParticipantsPoppedOut));
  };
  const openActionSheet = () => {
    dispatch(setIsActionSheetOpen(true));
  };

  const iconColor = sessionUI.themeName === "dark" ? "white" : "black";

  if (status !== SessionStatus.Connected) {
    return null;
  }

  return (
    <footer
      className={`uikit-footer-mobile ${THEME_COLOR_CLASS} py-2 px-4 absolute bottom-0 left-0 right-0 shadow-[0_-2px_10px_-1px_rgba(0,0,0,0.05)] transition-transform duration-300 ${
        sessionUI.isControlsVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ zIndex: 2 }}
    >
      <div className="flex justify-between items-center">
        {isSupportAudioFeature && (
          <AudioButton
            microphoneList={microphoneList}
            speakerList={speakerList}
            changeMicrophone={changeMicrophone}
            changeSpeaker={changeSpeaker}
            id="uikit-footer-audio"
          />
        )}
        {isSupportVideoFeature && <VideoButton cameraList={cameraList} changeCamera={changeCamera} />}
        {isSupportChatFeature && (
          <ControlButton
            icon={MessageSquare}
            iconColor={iconColor}
            isActive={true}
            onClick={toggleChat}
            disabled={false}
            isLoading={false}
            className="rounded-full text-theme-text"
            title={"chat"}
            count={unreadCount}
            id="uikit-footer-chat-button"
            showBorder={true}
          />
        )}
        {isSupportUserFeature && (
          <ControlButton
            icon={Users}
            iconColor={iconColor}
            isActive={true}
            onClick={toggleParticipantsList}
            disabled={false}
            isLoading={false}
            className="rounded-full text-theme-text"
            title={t("participant.panel_title")}
            count={sessionUI.participantSize}
            id="uikit-footer-participants-button"
            showBorder={true}
          />
        )}
        <ControlButton
          icon={MoreHorizontal}
          iconColor={iconColor}
          isActive={true}
          onClick={openActionSheet}
          disabled={false}
          isLoading={false}
          className="rounded-full"
          title={t("footer.more")}
          id="uikit-footer-more-button"
          showBorder={true}
        />
      </div>
    </footer>
  );
};
