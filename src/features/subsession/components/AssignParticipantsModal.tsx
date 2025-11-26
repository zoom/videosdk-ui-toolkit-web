import { Participant } from "@/types";
import { CommonAssignModal } from "./CommonAssignModal";
import { MultiValue } from "react-select";
import { SelectOption } from "../subsession-constants";

export const AssignParticipantsModal: React.FC<{
  roomId: string;
  roomName: string;
  onClose: () => void;
  unassignedParticipants: Participant[];
  assignParticipant: (participantId: number | number[], roomId: string) => void;
  themeName: string;
}> = ({ roomId, roomName, onClose, unassignedParticipants, assignParticipant, themeName }) => {
  const participantOptions = unassignedParticipants.map((participant) => ({
    value: participant.userId,
    label: participant.displayName,
  }));

  const handleAssign = (selectedParticipants: SelectOption | MultiValue<SelectOption>) => {
    if (Array.isArray(selectedParticipants)) {
      const participantIds = selectedParticipants.map((participant) => participant.value);
      assignParticipant(participantIds, roomId);
    } else if ("value" in selectedParticipants && selectedParticipants.value !== null) {
      assignParticipant(selectedParticipants.value as number, roomId);
    }
  };

  return (
    <CommonAssignModal
      id={`uikit-subsession-assign-participants-modal`}
      title={`Assign Participants to ${roomName}`}
      placeholder="Select participants"
      noOptionsMessage="No other participants"
      onClose={onClose}
      options={participantOptions}
      onAssign={handleAssign}
      isMulti={true}
      themeName={themeName}
    />
  );
};

export default AssignParticipantsModal;
