import { useState } from "react";
import { Crown, User } from "lucide-react";
import { Participant } from "@/types";
import { Button } from "@/components/widget/CommonButton";
import { AssignRoomsModal } from "./AssignRoomsModal";
import { Subsession } from "@zoom/videosdk";
import { getInitialsFirstLetter } from "@/components/util/util";
import { getAvatarColor } from "@/features/chat/util";

const SubsessionParticipantItem: React.FC<{
  participant: Participant;
  style: any;
  rooms?: Subsession[];
  isUnassigned: boolean;
  roomId: string;
  assignRoom: (newRoomId: string) => void;
  isJoinSubsession: boolean;
  themeName: string;
}> = ({ participant, style, rooms, isUnassigned, roomId, assignRoom, isJoinSubsession, themeName }) => {
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
              {!isJoinSubsession && <span className="text-xs ml-2"> (No Join)</span>}
            </p>
            {participant.isHost && (
              <p className="text-xs flex items-center">
                <Crown size={10} className="mr-1" />
                Host
              </p>
            )}
            {participant.isManager && !participant.isHost && (
              <p className="text-xs flex items-center">
                <User size={10} className="mr-1" />
                Manager
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
            {isHovered && (
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
                  {isUnassigned ? "Assign" : "Move to"}
                </Button>
              </>
            )}
            {isAssignModalOpen && (
              <AssignRoomsModal
                roomId={roomId}
                roomName={""}
                onClose={() => setIsAssignModalOpen(false)}
                rooms={rooms}
                assignRoom={assignRoom}
                themeName={themeName}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubsessionParticipantItem;
