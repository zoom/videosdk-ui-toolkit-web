import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Crown, User } from "lucide-react";
import { Participant } from "@/types";
import { Button } from "@/components/widget/CommonButton";
import { AssignRoomsModal } from "./AssignRoomsModal";
import { Subsession } from "@zoom/videosdk";
import { getInitialsFirstLetter } from "@/components/util/util";
import { getAvatarColor } from "@/features/chat/util";

type SubsessionRosterUser = Pick<Participant, "userId" | "displayName" | "userGuid"> &
  Partial<Pick<Participant, "isHost" | "isManager">>;

const SubsessionParticipantItem: React.FC<{
  participant: SubsessionRosterUser;
  style: any;
  rooms?: Subsession[];
  isUnassigned: boolean;
  roomId: string;
  assignRoom: (newRoomId: string) => void;
  isJoinSubsession: boolean;
  themeName: string;
  /**
   * Whether this row can be assigned or moved. Hidden for the local user while rooms are open,
   * because that move uses a room user id the main session cannot resolve.
   */
  showMoveAction?: boolean;
}> = ({
  participant,
  style,
  rooms,
  isUnassigned,
  roomId,
  assignRoom,
  isJoinSubsession,
  themeName,
  showMoveAction = true,
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  return (
    <div style={style}>
      <div
        className="py-2 px-3 hover:bg-theme-background transition duration-150 ease-in-out relative border-b border-theme-border"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        id={`uikit-subsession-participant-item-${participant.userId}`}
      >
        <div className="flex items-center">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-theme-text-button text-sm font-semibold ${getAvatarColor(participant?.userId)}`}
          >
            {getInitialsFirstLetter(participant.displayName)}
          </div>
          <div className="ml-3 flex-grow w-3/5 overflow-hidden">
            <p className="text-sm font-medium  w-full text-ellipsis overflow-hidden">
              {participant.displayName}
              {!isJoinSubsession && <span className="text-xs ml-2">{t("subsession.no_join_suffix")}</span>}
            </p>
            {participant.isHost && (
              <p className="text-xs flex items-center">
                <Crown size={10} className="mr-1" />
                {t("participant.host_label")}
              </p>
            )}
            {participant.isManager && !participant.isHost && (
              <p className="text-xs flex items-center">
                <User size={10} className="mr-1" />
                {t("participant.manager_label")}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 w-20 justify-end">
            {!isHovered && (
              <>
                {/* {participant.sharerOn && <MonitorUp size={16} className="text-green-500" />}
                {participant.audio ? (
                  participant.muted ? (
                    <MicOff size={16} className="text-red-500" />
                  ) : (
                    <Mic size={16} className="text-gray-500" />
                  )
                ) : null}
                {participant.bVideoOn ? (
                  <Video size={16} className="text-gray-500" />
                ) : (
                  <VideoOff size={16} className="text-red-500" />
                )} */}
              </>
            )}
            {isHovered && showMoveAction && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsAssignModalOpen(true);
                  }}
                  className="mr-2"
                  id={`uikit-subsession-participant-item-${participant.userId}-assign-button`}
                >
                  {isUnassigned ? t("subsession.assign") : t("subsession.move_to_button")}
                </Button>
              </>
            )}
            {isAssignModalOpen && showMoveAction && (
              <AssignRoomsModal
                roomId={roomId}
                roomName={""}
                onClose={() => setIsAssignModalOpen(false)}
                rooms={rooms}
                assignRoom={assignRoom}
                themeName={themeName}
                allowMainSession={!isUnassigned}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubsessionParticipantItem;
