import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { Button } from "@/components/widget/CommonButton";
import { ChevronDown, ChevronUp, Users, Check, X, XCircle } from "lucide-react";
import { RoomConfirm } from "./RoomConfirm";
import SubsessionParticipantItem from "./SubsessionParticipantItem";
import CommonTab from "@/components/widget/CommonTab";
import { AssignParticipantsModal } from "./AssignParticipantsModal";
import { isLandscape, isMobileDeviceNotIpad, isPortrait } from "@/components/util/service";
import { Subsession, Subsession2 } from "@zoom/videosdk";
import sessionAdditionalContext from "@/context/session-additional-context";
import { Participant } from "@/types";
import Dropdown from "@/components/widget/Dropdown";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";

interface Room {
  id: string;
  name: string;
  participants: Participant[];
}

interface RoomsViewProps {
  handleActionClick: (roomId: string, action: string) => void;
  confirmationState: {
    isOpen: boolean;
    subsessionId: string;
    action: string;
  };
  setConfirmationState: (state: { isOpen: boolean; subsessionId: string; action: string }) => void;
  handleConfirmAction: (roomId: string, action: string) => void;
  inProgress: boolean;
  participants: Participant[];
  isHostOrManager: boolean;
  themeName: string;
  rooms: Subsession[];
  unassignedParticipants: Participant[];
  localAssignOrMoveUserToRoom: (participantId: number | number[], roomId: string) => void;
  localUnassignUserInRoom: (participantId: number, roomId: string) => void;
  addLocalRooms: (rooms: Subsession[]) => void;
  removeLocalRoom: (index: number) => void;
  renameLocalRoom: (index: number, name: string) => void;
}

export const RoomsView: React.FC<RoomsViewProps> = ({
  handleActionClick,
  confirmationState,
  setConfirmationState,
  handleConfirmAction,
  inProgress,
  participants,
  isHostOrManager,
  themeName,
  rooms,
  unassignedParticipants,
  localAssignOrMoveUserToRoom,
  localUnassignUserInRoom,
  addLocalRooms,
  removeLocalRoom,
  renameLocalRoom,
}) => {
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const [assignModalOpen, setAssignModalOpen] = useState<Subsession | null>(null);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editedRoomName, setEditedRoomName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [hoveredRoom, setHoveredRoom] = useState<Subsession | string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { subsessionClient } = useContext(sessionAdditionalContext);

  useEffect(() => {
    if (editingRoomId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingRoomId]);

  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  useEffect(() => {
    if (editingRoomId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingRoomId]);

  const toggleRoomExpansion = (roomId: string) => {
    setExpandedRooms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roomId)) {
        newSet.delete(roomId);
      } else {
        newSet.add(roomId);
      }
      return newSet;
    });
  };

  const toggleAllRooms = () => {
    if (expandedRooms.size === rooms.length + 1) {
      // +1 for unassigned
      setExpandedRooms(new Set());
    } else {
      setExpandedRooms(new Set([...rooms.map((room) => room.subsessionId), "unassigned"]));
    }
  };

  const handleAssignClick = (room: Subsession) => {
    setAssignModalOpen(room);
  };

  const handleRename = (index: number) => {
    const room = rooms[index];
    if (room) {
      setEditingRoomId(room.subsessionId);
      setEditedRoomName(room.subsessionName);
    }
  };

  const handleSaveRename = (index: number) => {
    const room = rooms[index];
    if (room) {
      setEditingRoomId(room.subsessionId);
      renameLocalRoom(index, editedRoomName);
      setEditingRoomId(null);
    }
  };

  const handleCancelRename = () => {
    setEditingRoomId(null);
  };

  const handleDelete = (index: number) => {
    const room = rooms[index];
    if (room) {
      removeLocalRoom(index);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const filteredParticipants = (participants: Participant[]) => {
    return participants.filter((participant) =>
      participant.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const allParticipants = [...unassignedParticipants, ...rooms.flatMap((room) => room.userList)];

  const assignRoom = useCallback(
    async (participantId: number, newRoomId: string) => {
      if (inProgress) {
        if (unassignedParticipants.some((user) => user.userId === participantId)) {
          subsessionClient.assignUserToSubsession(participantId, newRoomId);
        } else {
          subsessionClient.moveUserToSubsession(participantId, newRoomId);
        }
      } else {
        localAssignOrMoveUserToRoom(participantId, newRoomId);
      }
    },
    [inProgress, unassignedParticipants, subsessionClient, localAssignOrMoveUserToRoom],
  );

  const RoomActions = ({
    room,
    index,
    inProgress,
    isHostOrManager,
    handleRename,
    handleDelete,
    handleAssignClick,
    handleActionClick,
  }) => {
    const isEnableEdit = isHostOrManager && !inProgress;
    if (isMobileDeviceNotIpad() && isPortrait()) {
      return (
        <Dropdown
          position="bottom-start"
          menuItems={[
            isEnableEdit && {
              label: "Rename",
              onClick: () => handleRename(index),
            },
            isEnableEdit && {
              label: "Delete",
              onClick: () => handleDelete(index),
            },
            {
              label: "Assign",
              onClick: () => handleAssignClick(room),
            },
            inProgress && {
              label: "Join",
              onClick: () => handleActionClick(room.subsessionId, "Join"),
            },
          ]}
        ></Dropdown>
      );
    }

    return (
      <>
        {isEnableEdit &&
          hoveredRoom &&
          (hoveredRoom as Subsession)?.subsessionId === room.subsessionId &&
          editingRoomId !== room.subsessionId && (
            <>
              <Button variant="secondary" size="sm" onClick={() => handleRename(index)} className="mr-2">
                Rename
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleDelete(index)} className="mr-2">
                Delete
              </Button>
            </>
          )}
        {isHostOrManager && (
          <Button variant="secondary" size="sm" onClick={() => handleAssignClick(room)} className="mr-2">
            Assign
          </Button>
        )}
        {inProgress && (
          <Button variant="secondary" size="sm" onClick={() => handleActionClick(room.subsessionId, "Join")}>
            Join
          </Button>
        )}
      </>
    );
  };

  return (
    <div
      className={`w-full flex flex-col  ${
        isMobileDeviceNotIpad() ? (isLandscape() ? "h-[86%]" : "h-[95%]") : "h-[89%]"
      } overflow-y-auto ${THEME_COLOR_CLASS}`}
      id="uikit-subsession-rooms-view"
    >
      <div className="p-0 border-b border-gray-200">
        <CommonTab
          tabs={[
            { name: "collapse", title: "Collapse All", id: "uikit-subsession-rooms-view-collapse-tab" },
            { name: "expand", title: "Expand All", id: "uikit-subsession-rooms-view-expand-tab" },
            { name: "search", title: "Search", id: "uikit-subsession-rooms-view-search-tab" },
          ]}
          orientation="horizontal"
          activeTab={isSearching ? "search" : expandedRooms.size === rooms.length + 1 ? "expand" : "collapse"}
          setActiveTab={(tabName) => {
            if (tabName === "search") {
              setExpandedRooms(new Set([...rooms.map((room) => room.subsessionId), "unassigned"]));
              setIsSearching(true);
            } else if (tabName === "collapse") {
              setExpandedRooms(new Set());
              setIsSearching(false);
            } else if (tabName === "expand") {
              setExpandedRooms(new Set([...rooms.map((room) => room.subsessionId), "unassigned"]));
              setIsSearching(false);
            }
          }}
          className="justify-center p-0"
        />
      </div>

      {isSearching && (
        <div className="p-2 ml-2 mr-4 pb-0 relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pr-8 border border-gray-300 text-theme-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-theme-surface"
            id="uikit-subsession-rooms-view-search-input"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 mt-1 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              id="uikit-subsession-rooms-view-search-clear-button"
            >
              <XCircle size={20} className="text-theme-text" />
            </button>
          )}
        </div>
      )}

      <div className="flex-grow overflow-y-auto uikit-custom-scrollbar p-4 space-y-4">
        <div
          className="rounded-lg shadow-sm overflow-hidden"
          onMouseEnter={() => setHoveredRoom("unassigned")}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          {isHostOrManager && (
            <div className="flex justify-between items-center p-4 border-b border-theme-border">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => toggleRoomExpansion("unassigned")}
                id="uikit-subsession-rooms-view-unassigned-expand-button"
              >
                {expandedRooms.has("unassigned") ? (
                  <ChevronDown className="w-5 h-5 mr-3 text-theme-text" />
                ) : (
                  <ChevronUp className="w-5 h-5 mr-3 text-theme-text" />
                )}
                <span className="text-base font-medium">Unassigned Participants</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-theme-text" />
                <span className="mr-4 text-sm text-theme-text">{unassignedParticipants.length}</span>
              </div>
            </div>
          )}
          {expandedRooms.has("unassigned") && (
            <div className=" p-4 border-t">
              <ul className="space-y-1">
                {filteredParticipants(unassignedParticipants).map((participant: Participant) => (
                  <SubsessionParticipantItem
                    roomId="unassigned"
                    key={participant.userId}
                    participant={participant as Participant}
                    style={{}}
                    rooms={rooms}
                    isUnassigned={true}
                    isJoinSubsession={false}
                    assignRoom={(newRoomId: string) => {
                      assignRoom(participant.userId, newRoomId);
                    }}
                    themeName={themeName}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>

        {rooms.map((room: Subsession2, index) => (
          <div
            key={room.subsessionId}
            className="rounded-lg shadow-sm overflow-hidden"
            onMouseEnter={() => setHoveredRoom(room)}
            onMouseLeave={() => setHoveredRoom(null)}
          >
            <div className="flex justify-between items-center p-4 border-b border-theme-border">
              <div className="flex items-center cursor-pointer" onClick={() => toggleRoomExpansion(room.subsessionId)}>
                {expandedRooms.has(room.subsessionId) ? (
                  <ChevronDown className="w-5 h-5 mr-3 text-theme-text" />
                ) : (
                  <ChevronUp className="w-5 h-5 mr-3 text-theme-text" />
                )}
                {editingRoomId === room.subsessionId ? (
                  <div className="flex items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={editedRoomName}
                      onChange={(e) => setEditedRoomName(e.target.value)}
                      className="text-base font-medium px-2 py-0 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-theme-surface"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveRename(index);
                      }}
                      className={`ml-2 text-green-600 hover:text-green-700 ${
                        editedRoomName === room.subsessionName ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={editedRoomName === room.subsessionName}
                      title={editedRoomName === room.subsessionName ? "Room name not changed" : ""}
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelRename();
                      }}
                      className="ml-2 text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <span className="text-base font-medium">{room.subsessionName}</span>
                )}
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-theme-text" />
                <span className="mr-4 text-sm text-theme-text">{room.userList.length}</span>
                <RoomActions
                  room={room}
                  index={index}
                  inProgress={inProgress}
                  isHostOrManager={isHostOrManager}
                  handleRename={handleRename}
                  handleDelete={handleDelete}
                  handleAssignClick={handleAssignClick}
                  handleActionClick={handleActionClick}
                />
              </div>
            </div>
            {expandedRooms.has(room.subsessionId) && (
              <div className="p-4 border-t border-gray-200">
                <ul className="space-y-1">
                  {filteredParticipants(room.userList).map((participant: any) => (
                    <SubsessionParticipantItem
                      key={participant.userId}
                      participant={participant}
                      style={{}}
                      rooms={rooms}
                      isUnassigned={false}
                      roomId={room.subsessionId}
                      isJoinSubsession={participant?.isInSubsession as boolean}
                      assignRoom={(newRoomId: string) => {
                        assignRoom(participant.userId, newRoomId);
                      }}
                      themeName={themeName}
                    />
                  ))}
                </ul>
              </div>
            )}
            {confirmationState.isOpen && confirmationState.subsessionId === room.subsessionId && (
              <RoomConfirm
                isOpen={true}
                onClose={() =>
                  setConfirmationState({
                    isOpen: false,
                    subsessionId: null,
                    action: "",
                  })
                }
                onConfirm={handleConfirmAction}
                roomName={room.subsessionName}
                action={confirmationState.action}
              />
            )}
          </div>
        ))}
      </div>
      {assignModalOpen && (
        <AssignParticipantsModal
          roomId={assignModalOpen.subsessionId}
          roomName={assignModalOpen.subsessionName}
          onClose={() => setAssignModalOpen(null)}
          unassignedParticipants={unassignedParticipants}
          assignParticipant={localAssignOrMoveUserToRoom}
          themeName={themeName}
        />
      )}
    </div>
  );
};
