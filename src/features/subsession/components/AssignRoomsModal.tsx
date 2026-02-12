import { useTranslation } from "react-i18next";
import { SelectOption } from "../subsession-constants";
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
}> = ({ roomId, roomName, onClose, rooms, assignRoom, themeName }) => {
  const { t } = useTranslation();

  const roomOptions: SelectOption[] = rooms.map(
    (room: any) =>
      ({
        value: room.subsessionId,
        label: translateSubsessionName(room.subsessionName, t),
      }) as SelectOption,
  );

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
