import { useTranslation } from "react-i18next";
import { MAIN_SESSION_ROOM_ID, SelectOption } from "../subsession-constants";
import { CommonAssignModal } from "./CommonAssignModal";
import { Subsession } from "@zoom/videosdk";
import { translateSubsessionName } from "../utils/translateSubsessionName";

export const AssignRoomsModal: React.FC<{
  roomId: string;
  roomName: string;
  onClose: () => void;
  rooms: Subsession[];
  assignRoom: (roomId: string) => void;
  themeName: string;
  /**
   * Whether the main session can be picked as a destination. Only meaningful for a participant who
   * is currently in a subsession room.
   */
  allowMainSession?: boolean;
}> = ({ roomId, roomName, onClose, rooms, assignRoom, themeName, allowMainSession = false }) => {
  const { t } = useTranslation();

  const roomOptions: SelectOption[] = rooms.map(
    (room: any) =>
      ({
        value: room.subsessionId,
        label: translateSubsessionName(room.subsessionName, t),
      }) as SelectOption,
  );

  if (allowMainSession) {
    roomOptions.unshift({
      value: MAIN_SESSION_ROOM_ID,
      // A destination, like the room names beside it. Before rooms open this unassigns the
      // participant; "Return to Main Session" is the attendee's own action.
      label: t("subsession.main_session"),
    });
  }

  const handleAssign = (selectedRoom: SelectOption) => {
    if (selectedRoom.value) {
      assignRoom(selectedRoom.value as string);
    }
  };

  return (
    <CommonAssignModal
      id={`uikit-subsession-assign-rooms-modal`}
      title={t("subsession.move_participant_title")}
      onClose={onClose}
      options={roomOptions}
      onAssign={handleAssign}
      isMulti={false}
      placeholder={t("subsession.select_room_placeholder")}
      noOptionsMessage={t("subsession.no_rooms_available")}
      themeName={themeName}
    />
  );
};

export default AssignRoomsModal;
