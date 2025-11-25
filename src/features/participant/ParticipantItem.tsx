import { useState } from "react";
import { Crown, User, Mic, MicOff, Video, VideoOff, MonitorUp, MoreVertical } from "lucide-react";
import Dropdown from "@/components/widget/Dropdown";
import { Participant } from "@/types";
import { useParticipantMenu, useCurrentUser } from "./hooks";
import { getInitialsFirstLetter, isShowAvatar } from "@/components/util/util";
import { getAvatarColor } from "../chat/util";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";

interface ParticipantItemProps {
  participant: Participant;
  style: any;
  avatarUrl?: string;
  index: number;
  onRenameClick: (participant: Participant) => void;
  onAdjustLocalVolumeClick: (participant: Participant) => void;
}

export const ParticipantItem: React.FC<ParticipantItemProps> = ({
  participant,
  style,
  avatarUrl,
  index: _index,
  onRenameClick,
  onAdjustLocalVolumeClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const currentUser = useCurrentUser();

  const { menuItems } = useParticipantMenu(participant, currentUser, onRenameClick, onAdjustLocalVolumeClick);

  const showAvatar = isShowAvatar(participant, currentUser, avatarUrl);
  return (
    <>
      <div
        style={style}
        className="py-2 px-3 transition duration-150 ease-in-out relative flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`flex items-center w-full ${THEME_COLOR_CLASS}`}>
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-theme-text-button text-sm font-semibold ${
              showAvatar ? "bg-gray-100" : getAvatarColor(participant?.userId)
            }`}
          >
            {showAvatar ? (
              <img src={participant?.avatar} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-theme-text-button text-lg font-semibold">
                {getInitialsFirstLetter(participant?.displayName)}
              </div>
            )}
          </div>
          <div className="ml-3 flex-grow">
            <p className="text-sm font-medium max-w-[250px] truncate" title={participant?.displayName}>
              {participant?.displayName}
              {participant.userId === currentUser?.userId && " (Me)"}
            </p>
            {participant?.isHost && (
              <p className="text-xs flex items-center">
                <Crown size={10} className="mr-1" />
                Host
              </p>
            )}
            {participant?.isManager && !participant?.isHost && (
              <p className="text-xs flex items-center">
                <User size={10} className="mr-1" />
                Manager
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 w-20 justify-end">
            {!isHovered && (
              <>
                {participant?.sharerOn && <MonitorUp size={16} className="text-green-500" />}
                {participant?.audio ? (
                  participant?.muted ? (
                    <MicOff size={16} className="text-red-500" />
                  ) : (
                    <Mic size={16} className="text-gray-500" />
                  )
                ) : null}
                {participant?.bVideoOn ? (
                  <Video size={16} className="text-gray-500" />
                ) : (
                  <VideoOff size={16} className="text-red-500" />
                )}
              </>
            )}
            {isHovered && menuItems.length > 0 && (
              <Dropdown
                menuItems={menuItems}
                wrapperClass="p-1 hover:bg-theme-background rounded-full bg-theme-surface"
                position="bottom-end"
                trigger={<MoreVertical size={16} className="text-theme-text" />}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ParticipantItem;
