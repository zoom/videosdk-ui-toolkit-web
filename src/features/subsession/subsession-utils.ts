import { ReconnectReason, Subsession } from "@zoom/videosdk";

import { Participant } from "@/types";

/**
 * Maps a `connection-change` reconnect reason to the message describing the subsession transition.
 *
 * Moving into or out of a subsession reconnects the client, which empties the participant list, so
 * without this the UI falls back to its "no other participants" empty state while the move is in
 * flight. Reasons that are not subsession moves (such as a failover) return `null`, leaving the
 * caller's own empty state in place.
 *
 * @param reason Reconnect reason from the SDK's `connection-change` payload
 * @param subsessionName Name of the subsession being joined, when the SDK reports one
 * @returns The i18n key and interpolation values, or null when not a subsession transition
 */
export const getSubsessionTransitionMessage = (
  reason: string | undefined,
  subsessionName?: string,
): { key: string; values?: Record<string, string> } | null => {
  if (reason === ReconnectReason.JoinSubsession || reason === ReconnectReason.MoveToSubsession) {
    return subsessionName
      ? { key: "subsession.joining_rooms2", values: { number: subsessionName } }
      : { key: "subsession.joining_rooms" };
  }
  if (reason === ReconnectReason.BackToMainSession) {
    return { key: "subsession.returning_to_main_session" };
  }
  return null;
};

/**
 * Merges the SDK's unassigned user list with users that are not present in any subsession room.
 *
 * `userId` is only unique within a single session context, so a user assigned to a room can carry a
 * different `userId` in `allParticipants`. `userGuid` is stable across contexts, so it is matched
 * first and `userId` is used as the fallback for entries that do not expose a GUID.
 *
 * @param sdkUnassigned Unassigned users reported by `subsessionClient.getUnassignedUserList()`
 * @param rooms Subsession rooms with their assigned user lists
 * @param allParticipants Participants of the session context the local user is currently in
 * @param excludeUserId User ID of the local user, who is never listed as unassigned
 * @returns The unassigned participants, de-duplicated
 */
export function mergeUnassignedWithRoomAssignments(
  sdkUnassigned: Participant[],
  rooms: Subsession[],
  allParticipants: Participant[],
  excludeUserId: number | undefined,
): Participant[] {
  if (!rooms.length) {
    return sdkUnassigned;
  }

  const assignedIds = new Set<number>();
  const assignedGuids = new Set<string>();
  rooms.forEach((room) => {
    room.userList?.forEach((user) => {
      if (!user) return;
      assignedIds.add(user.userId);
      if (user.userGuid) {
        assignedGuids.add(user.userGuid);
      }
    });
  });

  const isAssigned = (participant: Participant) =>
    assignedIds.has(participant.userId) || (!!participant.userGuid && assignedGuids.has(participant.userGuid));

  const derived = allParticipants.filter((p) => p.userId !== excludeUserId && !isAssigned(p));

  const byId = new Map<number, Participant>();
  sdkUnassigned.forEach((p) => {
    if (p && !isAssigned(p)) {
      byId.set(p.userId, p);
    }
  });
  derived.forEach((p) => {
    if (p && !byId.has(p.userId)) {
      byId.set(p.userId, p);
    }
  });

  return Array.from(byId.values());
}

/**
 * Determines whether a user listed in a subsession room has actually joined it.
 *
 * The SDK derives `isInSubsession` by comparing the user's `bid` against the room ID, reading that
 * user from its main-session attendee list. For the room the local user is already sitting in, that
 * record is not refreshed when somebody joins afterwards, so the flag stays `false` even though the
 * user is in the room. `getAllUser()` is authoritative there: the SDK stamps every participant it
 * returns with the local user's current room, so being in that list means being in that room.
 *
 * This only ever upgrades "not joined" to "joined", and only for the local user's own room, so a
 * missing `userGuid` leaves the SDK's own answer untouched.
 *
 * @param user Entry from a subsession room's `userList`
 * @param roomId ID of the room the entry belongs to
 * @param localUserRoomId ID of the room the local user is in, or undefined if in the main session
 * @param localRoomParticipantGuids GUIDs of the participants currently visible to the local user
 * @returns Whether the user has joined the room
 */
export const hasUserJoinedSubsession = (
  user: { isInSubsession?: boolean; userGuid?: string } | undefined,
  roomId: string,
  localUserRoomId: string | undefined,
  localRoomParticipantGuids: Set<string>,
): boolean => {
  if (user?.isInSubsession) {
    return true;
  }
  if (!localUserRoomId || roomId !== localUserRoomId) {
    return false;
  }
  return !!user?.userGuid && localRoomParticipantGuids.has(user.userGuid);
};

type SubsessionIdentity = {
  userId?: number;
  userGuid?: string;
};

/**
 * Whether a subsession roster entry is the local user.
 *
 * A room roster can carry a user id from a different session context than the one the local client
 * is in. `moveBackToMainSession` only accepts the main-session id, so acting on that roster id does
 * not move the local user. `userGuid` stays the same across those contexts and is compared first.
 * `userId` is used only when a guid is missing on either side.
 *
 * @param user Entry from a subsession room or the unassigned list
 * @param localUser The local user in the session context they are currently in
 * @returns Whether the roster entry is the local user
 */
export const isLocalSubsessionUser = (
  user: SubsessionIdentity | undefined,
  localUser: SubsessionIdentity | undefined,
): boolean => {
  if (!user || !localUser) {
    return false;
  }
  if (user.userGuid && localUser.userGuid) {
    return user.userGuid === localUser.userGuid;
  }
  return user.userId !== undefined && user.userId === localUser.userId;
};

export const isCurrentUserAbleToManageSubsession = (currentUser: Participant | null) => {
  if (currentUser?.isHost) return true;
  if (currentUser?.isManager) {
    return true;
  }
  return false;
};

export const checkIsSupportCoHostStartOrStopSubsessionByCaps = (caps: number | undefined) => {
  return true;
  // if (!caps) return false;
  // return !!(caps & CAPS_OPTION_SUPPORT_COHOST_START_STOP_BO);
};

/**
 * Utility function to map a Subsession attendee list to participant list
 *
 * To improve runtime efficiency, it first builds a set of user IDs to search for from the subRoomUserList, then
 * filters the full participant list for them. This does not guarantee the same order between the two lists
 *
 * @param fullParticipantList A list of all participants
 * @param subRoomUserList Subsession Room user to map to participants
 * @throws Will error out if the lists do not have the same length for some reason
 */
export const getSubsessionParticipantListFromUserList = (
  fullParticipantList: Participant[],
  subRoomUserList: Participant[],
) => {
  const userIds = new Set<number>();
  subRoomUserList.forEach((subAttendee) => userIds.add(subAttendee.userId));

  const boParticipantList = fullParticipantList.filter((participant) => userIds.has(participant.userId));

  if (boParticipantList.length !== subRoomUserList.length) {
    throw new Error("Could not map subRoomUserList to participant list");
  }

  return boParticipantList;
};
