import { useContext, useEffect } from "react";
import additionalContext from "../../../context/session-additional-context";

import { isCurrentUserAbleToManageSubsession } from "../subsession-utils";
import { SubsessionUserStatus, SubsessionStatus } from "@zoom/videosdk";

import { useCurrentUser } from "../../participant/hooks";
import {
  useAppDispatch,
  useAppSelector,
  useSessionSelector,
  useSessionUISelector,
  useSubsessionSelector,
} from "@/hooks/useAppSelector";
import {
  setCanAccessSubsessionRooms,
  setCurrentSubRoom,
  setSubRoomList,
  setSubsessionOptions,
  setSubStatus,
  setSubUnassignedUsers,
  setSubUserStatus,
  setSubsessionEnabled,
  SubsessionState,
} from "../subsessionSlice";
import { setIsJoinSubsessionConfirmRemind, setIsShowSubsessionRoomsPanel } from "@/store/uiSlice";
import { Participant } from "@/types/index.d";

export const useSubsessionRoom = () => {
  const { subsessionClient } = useContext(additionalContext);

  const { isManager, isHost } = useAppSelector(useSessionSelector);

  const { currentSubRoom, subStatus, subUserStatus, isSubsessionEnabled }: SubsessionState =
    useAppSelector(useSubsessionSelector);
  const { isJoinSubsessionConfirmRemind } = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();

  const currentUserInfo: Participant = useCurrentUser();

  const isSubsessionInProgress = subStatus === SubsessionStatus.InProgress;
  const isSubsessionClosing = subStatus === SubsessionStatus.Closing;
  const isUserInvited = subUserStatus === SubsessionUserStatus.Invited;
  const isUserInRoom = subUserStatus === SubsessionUserStatus.InSubsession;
  const isUserTimeUp = subUserStatus === SubsessionUserStatus.Leaving;
  const isCurrentUserCapCanSelfSelect = true;

  const isInSubsession =
    (isSubsessionInProgress || isSubsessionClosing) && (isUserInRoom || isUserTimeUp) && !!currentSubRoom?.subsessionId;

  // Initialize subsession state
  useEffect(() => {
    if (subsessionClient) {
      const roomStatus = subsessionClient.getSubsessionStatus();
      dispatch(setSubStatus(roomStatus as any as SubsessionStatus));
      dispatch(setSubRoomList(subsessionClient.getSubsessionList()));
      dispatch(setCurrentSubRoom(subsessionClient.getCurrentSubsession()));
      dispatch(setSubUserStatus(subsessionClient.getUserStatus()));
      dispatch(setSubsessionOptions(subsessionClient.getSubsessionOptions()));
      dispatch(setSubUnassignedUsers(subsessionClient.getUnassignedUserList()));
      if (typeof subsessionClient.isSubsessionEnabled === "function") {
        dispatch(setSubsessionEnabled(subsessionClient.isSubsessionEnabled()));
      }
    }
  }, [dispatch, subsessionClient]);

  useEffect(() => {
    if (subsessionClient) {
      dispatch(setSubUnassignedUsers(subsessionClient.getUnassignedUserList()));
    }
    if (
      isSubsessionEnabled &&
      (isCurrentUserAbleToManageSubsession(currentUserInfo) ||
        isUserInvited ||
        (isManager && isInSubsession) ||
        ((isHost || isManager) && isSubsessionInProgress) ||
        (!isUserInRoom && isSubsessionInProgress && isCurrentUserCapCanSelfSelect))
    ) {
      dispatch(setCanAccessSubsessionRooms(true));
    } else {
      dispatch(setCanAccessSubsessionRooms(false));
      dispatch(setIsShowSubsessionRoomsPanel(false));
    }

    if (isInSubsession && isJoinSubsessionConfirmRemind) {
      dispatch(setIsJoinSubsessionConfirmRemind(false));
    }
  }, [
    currentUserInfo,
    dispatch,
    isCurrentUserCapCanSelfSelect,
    isSubsessionEnabled,
    isHost,
    isInSubsession,
    isManager,
    isSubsessionInProgress,
    isUserInRoom,
    isUserInvited,
    subsessionClient,
    isJoinSubsessionConfirmRemind,
  ]);

  return { isInSubsession };
};
