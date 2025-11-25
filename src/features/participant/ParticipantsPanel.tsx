import React, { useState } from "react";
import { Search, Phone, Mic, MicOff } from "lucide-react";
import { AutoSizer, List } from "react-virtualized";
import ParticipantItem from "./ParticipantItem";
import { CommonPopper } from "@/components/widget/CommonPopper";
import { Participant } from "@/types";
import { setActivePopper, setIsInviteDialogOpen, setIsParticipantsPoppedOut } from "@/store/uiSlice";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";

interface ParticipantsPanelProps {
  participants: Participant[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  muteAll: () => void;
  onRenameClick: (participant: Participant) => void;
  onAdjustLocalVolumeClick: (participant: Participant) => void;
  width?: number;
  height?: number;
  isDraggable?: boolean;
  isControlByCustomizeLayout?: boolean;
  onClose?: () => void;
}

const ParticipantsPanel: React.FC<ParticipantsPanelProps> = ({
  participants,
  searchTerm,
  setSearchTerm,
  muteAll,
  onRenameClick,
  onAdjustLocalVolumeClick,
  width = 400,
  height = 600,
  isDraggable = true,
  isControlByCustomizeLayout,
  onClose,
}) => {
  const { isHost } = useAppSelector(useSessionSelector);
  const { isParticipantsPoppedOut, activeSidePanel } = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();
  const { avatarUrl, isEnablePhone, config } = useAppSelector(useSessionSelector);

  const isInviteEnabled = config?.featuresOptions?.invite?.enable;
  const isEnableInvitePhone =
    (config?.featuresOptions?.phone?.enable && isEnablePhone) || config?.featuresOptions?.crc?.enable;
  const filteredParticipants = participants.filter((participant) =>
    participant.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const rowRenderer = ({ index, key, style }: { index: number; key: string; style: any }) => {
    const participant = filteredParticipants[index];
    return (
      <ParticipantItem
        key={key}
        participant={participant}
        style={style}
        avatarUrl={avatarUrl}
        index={index}
        onRenameClick={onRenameClick}
        onAdjustLocalVolumeClick={onAdjustLocalVolumeClick}
      />
    );
  };

  const MuteAllButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-3 py-2 bg-theme-surface hover:bg-theme-background border border-theme-border rounded-md transition-colors duration-200 text-theme-text"
    >
      <Mic size={18} className="text-theme-text" />
      <span>Mute All</span>
    </button>
  );

  const InviteButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-3 py-2 bg-theme-surface hover:bg-theme-background border border-theme-border rounded-md transition-colors duration-200 text-theme-text"
    >
      <Phone size={18} className="text-theme-text" />
      <span>Invite</span>
    </button>
  );

  return (
    <CommonPopper
      isOpen={onClose ? isControlByCustomizeLayout : isParticipantsPoppedOut || activeSidePanel === "participants"}
      title="Participants"
      onClose={onClose || (() => dispatch(setIsParticipantsPoppedOut(false)))}
      width={width}
      height={height}
      sidePanel={activeSidePanel === "participants"}
      isDraggable={isDraggable}
      id={"zoom-ui-toolkit-users-popper"}
    >
      <div className="w-full h-full flex flex-col font-sans">
        <div className="p-3">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search participants"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
          <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider">
            In this session • {filteredParticipants.length}
          </h3>
        </div>
        <div className="flex-grow uikit-custom-scrollbar">
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height} // Adjust for footer height
                rowCount={filteredParticipants.length}
                rowHeight={70}
                rowRenderer={rowRenderer}
              />
            )}
          </AutoSizer>
        </div>
        <div
          className={`p-3 flex justify-between items-center ${isHost || isEnablePhone ? "border-t border-gray-200" : ""}`}
        >
          <div className="flex justify-left space-x-2">{isHost && <MuteAllButton onClick={muteAll} />}</div>
          <div className="flex justify-end space-x-2">
            {isEnableInvitePhone && isInviteEnabled && (
              <InviteButton
                onClick={() => {
                  dispatch(setIsInviteDialogOpen(true));
                  // dispatch(setActivePopper("Invite Participants"));
                  dispatch(setIsParticipantsPoppedOut(false));
                  onClose?.();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </CommonPopper>
  );
};

export default ParticipantsPanel;
