import { Participant } from "@/types";

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
