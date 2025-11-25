import { useCallback, useContext } from "react";

import { setSubRoomList, setSubUnassignedUsers } from "../subsessionSlice";
import { SubsessionAllocationPattern } from "../subsession-constants";
import { Subsession } from "@zoom/videosdk";
import { Participant } from "@/types";
import { useAppDispatch, useAppSelector, useSubsessionSelector } from "@/hooks/useAppSelector";
import sessionAdditionalContext from "@/context/session-additional-context";

export const useManageSubsessionRooms = () => {
  const { subsessionClient } = useContext(sessionAdditionalContext);
  const { subsessionOptions, subOptionsNeedCountdown, subsessionType, isSelectedType } =
    useAppSelector(useSubsessionSelector);
  const isSelfSelect = subsessionType === SubsessionAllocationPattern.SelfSelect && isSelectedType;
  const dispatch = useAppDispatch();
  const handleCreateSubsession = useCallback(
    async (
      numberOfRooms: number,
      pattern?: SubsessionAllocationPattern,
      isRecreate?: boolean,
      localSubsessionRoomList?: Subsession[],
      participants?: Participant[],
    ) => {
      if (subsessionClient) {
        let rooms: Subsession[];
        if (isRecreate) {
          // recreate rooms
          if (numberOfRooms === localSubsessionRoomList.length) {
            rooms = localSubsessionRoomList?.map((room) => ({
              ...room,
              userList: [], // Reset user list for each room
            }));
          } else if (numberOfRooms > localSubsessionRoomList.length) {
            const otherRooms = (await subsessionClient.createSubsessions(
              numberOfRooms - localSubsessionRoomList.length,
              pattern as any,
            )) as Subsession[];
            rooms = [
              ...localSubsessionRoomList.map((room) => ({
                ...room,
                userList: [], // Reset user list for each room
              })),
              ...otherRooms,
            ];
          } else {
            rooms = localSubsessionRoomList?.slice(0, numberOfRooms).map((room) => ({
              ...room,
              userList: [], // Reset user list for each room
            }));
          }

          if (pattern === SubsessionAllocationPattern.Automatically && participants) {
            // For automatic allocation, evenly distribute participants across rooms
            const usersPerRoom = Math.floor(participants.length / rooms.length);
            const extraUsers = participants.length % rooms.length;

            let assignedCount = 0;
            rooms = rooms.map((room, index) => {
              // Add extra user to early rooms if there are remainders
              const userCount = index < extraUsers ? usersPerRoom + 1 : usersPerRoom;
              const roomUsers = participants.slice(assignedCount, assignedCount + userCount);
              assignedCount += userCount;

              return {
                ...room,
                userList: roomUsers,
              };
            });

            dispatch(setSubRoomList(rooms));
            dispatch(setSubUnassignedUsers([]));
          } else {
            dispatch(setSubRoomList(rooms));
            dispatch(setSubUnassignedUsers(participants));
          }
        } else {
          rooms = (await subsessionClient.createSubsessions(numberOfRooms, pattern as any)) as Subsession[];
          dispatch(setSubRoomList(rooms));
          dispatch(setSubUnassignedUsers(subsessionClient.getUnassignedUserList()));
        }
      }
    },
    [subsessionClient, dispatch],
  );

  const handleOpenSubsession = useCallback(
    async (localSubsessionList: Subsession[]) => {
      try {
        await subsessionClient.openSubsessions(localSubsessionList, {
          ...subsessionOptions,
          waitSeconds: subOptionsNeedCountdown ? subsessionOptions.waitSeconds : 0,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Error opening subsession rooms", e);
      }
    },
    [subsessionClient, subsessionOptions, subOptionsNeedCountdown],
  );

  const handleCloseSubsession = useCallback(async () => {
    if (subsessionClient) {
      try {
        await subsessionClient.closeAllSubsessions();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Error closing subsession rooms", e);
      }
    }
  }, [subsessionClient]);

  return {
    handleCreateSubsession,
    handleOpenSubsession,
    handleCloseSubsession,
  };
};
