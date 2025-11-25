import React, { useContext, useState } from "react";
import { StreamContext } from "@/context/stream-context";
import { ParticipantState } from "@/features/participant/participantSlice";
import ParticipantsPanel from "@/features/participant/ParticipantsPanel";
import { useAppDispatch, useAppSelector, useParticipantSelector } from "@/hooks/useAppSelector";
import {
  setIsRenameModalOpen,
  setParticipantToRename,
  setParticipantToAdjustVolume,
  setIsAdjustVolumeModalOpen,
} from "@/store/uiSlice";
import { Participant } from "@/types";

const UsersKit: React.FC<{ options: any }> = ({ options }) => {
  const stream = useContext(StreamContext);
  const mediaStream = stream.stream;
  const [searchTerm, setSearchTerm] = useState("");

  const { participants }: ParticipantState = useAppSelector(useParticipantSelector);
  const muteAll = () => {
    mediaStream.muteAllAudio();
  };

  const [isUsersOpen, setIsUsersOpen] = useState(true);

  const dispatch = useAppDispatch();
  const handleRenameClick = (participant: Participant) => {
    dispatch(setParticipantToRename(participant));
    dispatch(setIsRenameModalOpen(true));
  };

  const handleAdjustLocalVolumeClick = (participant: Participant) => {
    dispatch(setParticipantToAdjustVolume(participant));
    dispatch(setIsAdjustVolumeModalOpen(true));
  };

  return (
    <ParticipantsPanel
      participants={participants}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      muteAll={muteAll}
      onRenameClick={handleRenameClick}
      onAdjustLocalVolumeClick={handleAdjustLocalVolumeClick}
      isControlByCustomizeLayout={isUsersOpen}
      onClose={() => setIsUsersOpen(false)}
      isDraggable={options?.draggable}
      width={options?.width || 400}
      height={options?.height || 600}
    />
  );
};
export default UsersKit;
