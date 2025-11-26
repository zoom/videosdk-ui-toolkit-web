import { useCallback, useEffect, useState } from "react";

import { Subsession, SubsessionStatus } from "@zoom/videosdk";
import { useMount, usePrevious } from "../../../hooks";

import { getSubsessionParticipantListFromUserList } from "../subsession-utils";

import { useAppSelector, useParticipantSelector, useSubsessionSelector } from "@/hooks/useAppSelector";
import { Participant } from "@/types";
import { useCurrentUser } from "@/features/participant/hooks";

export const useLocalSubsessionRooms = () => {
  const { participants } = useAppSelector(useParticipantSelector);
  const currentUser = useCurrentUser();
  const { subRoomList, subUnassignedUsers, subStatus } = useAppSelector(useSubsessionSelector);

  const [localSubsessionRoomList, setLocalSubsessionRoomList] = useState<Subsession[]>([]);
  const [localSubsessionUnassignedUsers, setLocalSubsessionUnassignedUsers] = useState<Participant[]>([]);

  const [prevSubsessionControlStatus, setPrevSubsessionControlStatus] = useState<SubsessionStatus>(
    SubsessionStatus.NotStarted,
  );

  const prevParticipants = usePrevious(participants);
  const prevSubsessionRoomList = usePrevious(subRoomList);

  const syncLocalRoomList = useCallback(() => {
    if (subRoomList) {
      setLocalSubsessionRoomList(subRoomList);
    }
    if (subUnassignedUsers) {
      setLocalSubsessionUnassignedUsers(subUnassignedUsers);
    }
  }, [subRoomList, subUnassignedUsers]);

  useEffect(() => {
    syncLocalRoomList();
  }, [subRoomList, syncLocalRoomList]);

  useMount(() => {
    syncLocalRoomList();
    setPrevSubsessionControlStatus(subStatus);
  });

  // Helps sync Subsession room list to local list
  useEffect(() => {
    if (prevSubsessionControlStatus !== subStatus) {
      if (
        (prevSubsessionControlStatus === SubsessionStatus.InProgress ||
          prevSubsessionControlStatus === SubsessionStatus.Closing) &&
        (subStatus === SubsessionStatus.Closed || subStatus === SubsessionStatus.NotStarted)
      ) {
        syncLocalRoomList();
      }
      setPrevSubsessionControlStatus(subStatus);
    }
  }, [prevSubsessionControlStatus, subStatus, syncLocalRoomList]);

  useEffect(() => {
    if (
      (subStatus === SubsessionStatus.Closed || subStatus === SubsessionStatus.NotStarted) &&
      participants &&
      prevParticipants
    ) {
      if (participants.length > prevParticipants.length) {
        // New participants joined while creating sub session rooms, so they need to be added to the unassigned list
        const assignedIds = new Set();
        localSubsessionRoomList.forEach(({ userList }) => {
          userList.forEach(({ userId }) => assignedIds.add(userId));
        });

        const unassignedAttendees = participants.filter(
          ({ userId }: Participant) => !assignedIds.has(userId) && userId !== currentUser.userId,
        );
        setLocalSubsessionUnassignedUsers(unassignedAttendees);
      } else if (participants.length < prevParticipants.length) {
        // Participants left, so they are removed from the sub room and unassigned participants lists
        const currentUserIds = new Set<number>();
        participants.forEach(({ userId }) => currentUserIds.add(userId));

        const roomList = localSubsessionRoomList.map((subsession) => ({
          ...subsession,
          userList: subsession.userList.filter(({ userId }) => currentUserIds.has(userId)),
        }));

        const unassignedAttendees = localSubsessionUnassignedUsers.filter(({ userId }) => currentUserIds.has(userId));

        setLocalSubsessionRoomList(roomList);
        setLocalSubsessionUnassignedUsers(unassignedAttendees);
      }
    }
  }, [
    currentUser?.userId,
    localSubsessionRoomList,
    localSubsessionUnassignedUsers,
    participants,
    prevParticipants,
    subStatus,
  ]);

  // Effect triggered on recreate
  useEffect(() => {
    if (
      prevSubsessionRoomList !== subRoomList &&
      (subStatus === SubsessionStatus.Closed || subStatus === SubsessionStatus.NotStarted)
    ) {
      syncLocalRoomList();
    }
  }, [subRoomList, localSubsessionRoomList, prevSubsessionRoomList, syncLocalRoomList, subStatus]);

  const localAssignOrMoveUserToRoom = useCallback(
    (userIds: number | number[], subsessionId: string) => {
      const userIdArray = Array.isArray(userIds) ? userIds : [userIds];

      const newRooms = localSubsessionRoomList.map((room) => {
        const { userList } = room;
        let newAttendeeList = userList ? [...userList] : [];

        // Remove users from wrong subsession room
        if (room.subsessionId !== subsessionId) {
          newAttendeeList = userList.filter(({ userId: attendeeUserId }) => !userIdArray.includes(attendeeUserId));
        }

        // Add users to correct subsession room
        if (room.subsessionId === subsessionId) {
          userIdArray.forEach((userId) => {
            if (!userList.find((attendee) => attendee.userId === userId)) {
              const targetParticipant = participants.find((participant) => participant.userId === userId);
              if (targetParticipant) {
                newAttendeeList.push({
                  userId,
                  displayName: targetParticipant.displayName,
                  avatar: targetParticipant.avatar,
                });
              }
            }
          });
        }

        return { ...room, userList: newAttendeeList };
      });

      const newUnassignedAttendees = localSubsessionUnassignedUsers.filter(
        (attendee) => !userIdArray.includes(attendee.userId),
      );

      setLocalSubsessionRoomList(newRooms);
      setLocalSubsessionUnassignedUsers(newUnassignedAttendees);
    },
    [localSubsessionRoomList, localSubsessionUnassignedUsers, participants],
  );

  const localUnassignUserInRoom = useCallback(
    async (userId: number) => {
      const newRooms = localSubsessionRoomList.map((room) => {
        const { userList } = room;
        if (userList.find((attendee) => attendee.userId === userId)) {
          const newAttendeeList = userList.filter(({ userId: attendeeUserId }) => attendeeUserId !== userId);
          return { ...room, userList: newAttendeeList };
        }
        return room;
      });
      setLocalSubsessionRoomList(newRooms);

      if (!localSubsessionUnassignedUsers.some((attendee) => attendee.userId === userId)) {
        const targetParticipant = participants.find((participant) => participant.userId === userId);
        if (targetParticipant) {
          const newUnassignedAttendees = localSubsessionUnassignedUsers ? [...localSubsessionUnassignedUsers] : [];
          newUnassignedAttendees.push(targetParticipant);
          setLocalSubsessionUnassignedUsers(newUnassignedAttendees);
        }
      }
    },
    [localSubsessionRoomList, localSubsessionUnassignedUsers, participants],
  );

  const addLocalRooms = useCallback(
    (subRooms: Subsession[]) => {
      setLocalSubsessionRoomList([...localSubsessionRoomList, ...subRooms]);
    },
    [localSubsessionRoomList],
  );

  const removeLocalRoom = useCallback(
    (roomIndex: number) => {
      const { userList } = localSubsessionRoomList[roomIndex];
      const attendeesToUnassign = getSubsessionParticipantListFromUserList(participants, userList as Participant[]);
      const newLocalSubsessionUnassignedAttendees = localSubsessionUnassignedUsers
        ? [...localSubsessionUnassignedUsers]
        : [];
      newLocalSubsessionUnassignedAttendees.push(...attendeesToUnassign);

      const newLocalRoomList = localSubsessionRoomList.filter((_, index) => index !== roomIndex);

      setLocalSubsessionRoomList(newLocalRoomList);
      setLocalSubsessionUnassignedUsers(newLocalSubsessionUnassignedAttendees);
    },
    [localSubsessionRoomList, localSubsessionUnassignedUsers, participants],
  );

  const renameLocalRoom = useCallback(
    (roomIndex: number, newName: string) => {
      const newLocalRoomList = localSubsessionRoomList.map((subsession, index) => {
        if (index === roomIndex) {
          const renamedSubRoom: Subsession = { ...subsession, subsessionName: newName };
          return renamedSubRoom;
        }
        return subsession;
      });
      setLocalSubsessionRoomList(newLocalRoomList);
    },
    [localSubsessionRoomList],
  );

  return {
    localSubsessionRoomList,
    localSubsessionUnassignedUsers,
    localAssignOrMoveUserToRoom,
    localUnassignUserInRoom,
    addLocalRooms,
    removeLocalRoom,
    renameLocalRoom,
  };
};
