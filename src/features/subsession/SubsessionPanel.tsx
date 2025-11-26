import React, { useContext, useEffect, useState } from "react";

import { Button } from "@/components/widget/CommonButton";
import { CommonPopper } from "@/components/widget/CommonPopper";
import SubsessionRoomsSettingsDialog from "./components/SubsessionRoomsSettingsDialog";
import {
  useAppDispatch,
  useAppSelector,
  useSessionSelector,
  useSessionUISelector,
  useSubsessionSelector,
} from "@/hooks/useAppSelector";
import { setIsJoinSubsessionConfirm, setIsSubsessionPoppedOut } from "@/store/uiSlice";
import SubsessionChoice from "./components/SubsessionChoice";
import { Subsession, SubsessionStatus, SubsessionUserStatus } from "@zoom/videosdk";
import { Participant } from "@/types";
import { RoomsView } from "./components/RoomsView";
import { BroadcastDialog } from "./components/BroadcastDialog";
import { useLocalSubsessionRooms, useManageSubsessionRooms, useOnSubsessionEvents, useSubsessionRoom } from "./hooks";
import { SubsessionAllocationPattern } from "./subsession-constants";
import {
  setIsOpenByYourself,
  setIsRecreate,
  setIsSelectedType,
  setSubRoomCountdown,
  setSubsessionOptions,
  setSubsessionType,
  setSubStatus,
} from "./subsessionSlice";
import sessionAdditionalContext from "@/context/session-additional-context";
import { enqueueSnackbar } from "notistack";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";
import { usePrevious } from "@/hooks/usePrevious";

export const SubsessionPanel = ({ participants }: { participants: Participant[] }) => {
  const dispatch = useAppDispatch();
  const { subsessionClient } = useContext(sessionAdditionalContext);
  const { isHost, isManager, userId } = useAppSelector(useSessionSelector);

  const isHostOrManager = isHost || isManager;

  useSubsessionRoom();
  useOnSubsessionEvents();
  const {
    localAssignOrMoveUserToRoom,
    localUnassignUserInRoom,
    addLocalRooms,
    removeLocalRoom,
    renameLocalRoom,
    localSubsessionUnassignedUsers: unassignedParticipants,
    localSubsessionRoomList,
  } = useLocalSubsessionRooms();

  const { handleCreateSubsession, handleOpenSubsession, handleCloseSubsession } = useManageSubsessionRooms();
  const { isSubsessionPoppedOut, isShowSubsessionBroadcast, subsessionBroadcastMsg, themeName } =
    useAppSelector(useSessionUISelector);
  const {
    subStatus,
    isSelectedType,
    subsessionType,
    currentSubRoom,
    subUserStatus,
    subsessionOptions,
    subRoomCountdown,
    isRecreate,
    isOpenByYourself,
  } = useAppSelector(useSubsessionSelector);

  const inProgress = subStatus === SubsessionStatus.InProgress;
  const preSubStatus = usePrevious(subStatus);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    subsessionId: null,
    action: "",
  });
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  useEffect(() => {
    if (currentSubRoom.userStatus === SubsessionUserStatus.Invited && subStatus === SubsessionStatus.InProgress) {
      dispatch(setIsJoinSubsessionConfirm(true));
    }
    if (subStatus === SubsessionStatus.Closed) {
      dispatch(setIsRecreate(true));
    }
    if (preSubStatus !== subStatus && subStatus === SubsessionStatus.Closed) {
      dispatch(setIsOpenByYourself(false));
    }
  }, [currentSubRoom.userStatus, subStatus, dispatch, isOpenByYourself, preSubStatus]);

  useEffect(() => {
    if (isShowSubsessionBroadcast) {
      enqueueSnackbar(subsessionBroadcastMsg, {
        variant: "info",
        autoHideDuration: 5000, // 5 seconds
      });
    }
  }, [isShowSubsessionBroadcast, subsessionBroadcastMsg]);

  const addRoom = async () => {
    try {
      const newRoom = await subsessionClient.createSubsessions(
        1,
        subsessionOptions.isSubsessionSelectionEnabled ? SubsessionAllocationPattern.Manually : (subsessionType as any),
      );
      addLocalRooms(newRoom as Subsession[]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
    }
  };

  const openAllRooms = async () => {
    try {
      dispatch(setIsOpenByYourself(true));
      await handleOpenSubsession(localSubsessionRoomList);
      dispatch(setSubStatus(SubsessionStatus.InProgress));
    } catch (e) {
      enqueueSnackbar("Failed to open subsession rooms", { variant: "error" });
    }
  };

  const closeAllRooms = async () => {
    try {
      await handleCloseSubsession();
      dispatch(setSubStatus(SubsessionStatus.Closed));
    } catch (e) {
      enqueueSnackbar("Failed to close subsession rooms", { variant: "error" });
    }
  };

  const handleActionClick = (subsessionId, action) => {
    setConfirmationState({ isOpen: true, subsessionId, action });
  };

  const handleConfirmAction = () => {
    // Implement the logic for joining or assigning to a room here
    if (confirmationState.action === "Join") {
      subsessionClient.joinSubsession(confirmationState.subsessionId);
    }
    setConfirmationState({ isOpen: false, subsessionId: null, action: "" });
  };

  const handleBroadcast = (message) => {
    // Implement the logic for broadcasting the message here
    subsessionClient.broadcast(message);
    setIsBroadcastOpen(false);
  };

  const mainSubsessionDialog =
    isSelectedType || inProgress ? (
      <>
        <RoomsView
          handleActionClick={handleActionClick}
          confirmationState={confirmationState}
          setConfirmationState={setConfirmationState}
          handleConfirmAction={handleConfirmAction}
          inProgress={inProgress}
          participants={participants}
          isHostOrManager={isHostOrManager}
          themeName={themeName}
          rooms={localSubsessionRoomList}
          localAssignOrMoveUserToRoom={localAssignOrMoveUserToRoom}
          localUnassignUserInRoom={localUnassignUserInRoom}
          addLocalRooms={addLocalRooms}
          removeLocalRoom={removeLocalRoom}
          renameLocalRoom={renameLocalRoom}
          unassignedParticipants={unassignedParticipants}
        />

        <div className="flex flex-col sm:flex-row justify-between  items-center border-gray-200 space-y-2 sm:space-y-0 flex-shrink-0 absolute bottom-0 w-full">
          {!inProgress && isHostOrManager && (
            <>
              <div className="flex justify-between items-center p-2 border-t border-gray-200 w-full">
                <Button
                  variant="outline"
                  // icon={Settings}
                  size="sm"
                  className="inline-flex"
                  color="blue"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  id="uikit-subsession-settings-button"
                >
                  Settings
                </Button>
                <div className={`flex space-x-3 ${THEME_COLOR_CLASS}`}>
                  <Button
                    variant="outline"
                    // icon={RefreshCcw}
                    size="sm"
                    className="inline-flex"
                    color="blue"
                    onClick={() => {
                      dispatch(setIsSelectedType(false));
                    }}
                    id="uikit-subsession-recreate-button"
                  >
                    Recreate
                  </Button>
                  <Button
                    variant="outline"
                    // icon={PlusCircle}
                    size="sm"
                    className="inline-flex"
                    color="blue"
                    onClick={addRoom}
                    id="uikit-subsession-add-room-button"
                  >
                    Add Room
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="inline-flex"
                    color="blue"
                    onClick={openAllRooms}
                    id="uikit-subsession-open-all-rooms-button"
                  >
                    Open All Rooms
                  </Button>
                </div>
              </div>
            </>
          )}
          {inProgress && isHostOrManager && !isBroadcastOpen && (
            <div className="flex flex-col justify-center sm:flex-row gap-2 w-full p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setIsBroadcastOpen(true)}
                id="uikit-subsession-broadcast-button"
              >
                Broadcast
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="w-full sm:w-auto"
                onClick={closeAllRooms}
                id="uikit-subsession-close-all-rooms-button"
              >
                Close All Rooms
              </Button>
            </div>
          )}
          {isBroadcastOpen && (
            <BroadcastDialog
              isOpen={isBroadcastOpen}
              onClose={() => setIsBroadcastOpen(false)}
              onSend={handleBroadcast}
            />
          )}
        </div>
      </>
    ) : null;

  // console.log("localSubsessionRoomList", localSubsessionRoomList, isSelectedType, inProgress);

  return (
    <>
      <CommonPopper
        isOpen={isSubsessionPoppedOut}
        onClose={() => dispatch(setIsSubsessionPoppedOut(false))}
        title={`Subsession Rooms - ${inProgress ? "In Progress" : "Not Started"}`}
        width={500}
        height={500}
        id="uikit-subsession-popper"
      >
        {mainSubsessionDialog}
        {!inProgress && !isSelectedType && (
          <SubsessionChoice
            isOpen={isSubsessionPoppedOut && !inProgress && !isSelectedType}
            onClose={() => dispatch(setIsSubsessionPoppedOut(false))}
            initialRoomCount={subRoomCountdown}
            subsessionType={subsessionType}
            onSubmit={async (initialRoomCount: number, subsessionType: SubsessionAllocationPattern) => {
              dispatch(setIsSelectedType(true));
              dispatch(setSubsessionType(subsessionType));
              dispatch(setSubRoomCountdown(initialRoomCount));
              const isSelfSelectSubsession = subsessionType === SubsessionAllocationPattern.SelfSelect;
              dispatch(
                setSubsessionOptions({
                  isSubsessionSelectionEnabled: isSelfSelectSubsession,
                }),
              );

              if (isSelfSelectSubsession) {
                try {
                  await handleCreateSubsession(
                    initialRoomCount,
                    SubsessionAllocationPattern.Manually,
                    isRecreate,
                    localSubsessionRoomList,
                    participants.filter((participant) => participant.userId !== userId),
                  );
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.warn("Error creating subsession rooms", e);
                }
              } else {
                try {
                  await handleCreateSubsession(
                    initialRoomCount,
                    subsessionType,
                    isRecreate,
                    localSubsessionRoomList,
                    participants.filter((participant) => participant.userId !== userId),
                  );
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.warn("Error creating subsession rooms", e);
                }
              }
            }}
          />
        )}

        {isHostOrManager && (
          <SubsessionRoomsSettingsDialog
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            themeName={themeName}
          />
        )}
      </CommonPopper>
    </>
  );
};
export default SubsessionPanel;
