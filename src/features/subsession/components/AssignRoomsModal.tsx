import { SelectOption } from "../subsession-constants";
import { CommonAssignModal } from "./CommonAssignModal";
import { Subsession } from "@zoom/videosdk";

export const AssignRoomsModal: React.FC<{
  roomId: string;
  roomName: string;
  onClose: () => void;
  rooms: Subsession[];
  assignRoom: (roomId: string) => void;
  themeName: string;
}> = ({ roomId, roomName, onClose, rooms, assignRoom, themeName }) => {
  const roomOptions: SelectOption[] = rooms.map(
    (room: any) =>
      ({
        value: room.subsessionId,
        label: room.subsessionName,
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
      title={`Move Participant to another room`}
      onClose={onClose}
      options={roomOptions}
      onAssign={handleAssign}
      isMulti={false}
      placeholder="Select a room"
      noOptionsMessage="No rooms available"
      themeName={themeName}
    />
  );
};

export default AssignRoomsModal;
