import { isMobileDeviceNotIpad } from "@/components/util/service";
import {
  useAppDispatch,
  useAppSelector,
  useParticipantSelector,
  useSessionSelector,
  useSessionUISelector,
} from "@/hooks/useAppSelector";
import { setCurrentPage } from "@/store/uiSlice";
import { useCallback, useMemo, useEffect } from "react";

export const usePagination = () => {
  const dispatch = useAppDispatch();
  const { currentPage, viewType } = useAppSelector(useSessionUISelector);
  const {
    isSendingScreenShare,
    isReceivingScreenShare,
    userId,
    isSupportMultipleVideos,
    activeSpeakerId,
    spotlightUserList,
  } = useAppSelector(useSessionSelector);
  const { participants } = useAppSelector(useParticipantSelector);

  const isScreenSharing = useMemo(
    () => isSendingScreenShare || isReceivingScreenShare,
    [isReceivingScreenShare, isSendingScreenShare],
  );

  const participantsPerPage = useMemo(() => {
    if (!isSupportMultipleVideos) {
      return 1;
    }
    if (isMobileDeviceNotIpad()) {
      return 4;
    }
    if (viewType === "speaker") {
      return 5;
    }
    return isScreenSharing ? 6 : 9;
  }, [isScreenSharing, isSupportMultipleVideos, viewType]);

  const totalPages =
    viewType === "speaker" || (spotlightUserList.length === 0 && (isMobileDeviceNotIpad() || !isSupportMultipleVideos))
      ? Math.ceil((participants.length - 1) / participantsPerPage)
      : Math.ceil(participants.length / participantsPerPage);

  const spotlightUserIdList = useMemo(() => spotlightUserList.map((user) => user.userId), [spotlightUserList]);

  const goToNextPage = useCallback(() => {
    const newPage = Math.min(currentPage + 1, totalPages - 1);
    if (newPage >= 0) {
      dispatch(setCurrentPage(newPage));
    }
  }, [currentPage, dispatch, totalPages]);

  const goToPreviousPage = useCallback(() => {
    const minPageNumber = isMobileDeviceNotIpad() && (isReceivingScreenShare || isSendingScreenShare) ? -1 : 0;
    dispatch(setCurrentPage(Math.max(currentPage - 1, minPageNumber)));
  }, [currentPage, dispatch, isReceivingScreenShare, isSendingScreenShare]);

  const currentParticipants = useMemo(() => {
    if (currentPage < 0) {
      return [];
    }
    // Sort current page participant [spotlight]/[active] -> [self] -> [video on] -> [video off]
    const spotlightedUsers = participants.filter((user) => spotlightUserIdList.includes(user.userId));
    let remnantParticipants = participants.filter((user) => !spotlightUserIdList.includes(user.userId));
    const currentUser = remnantParticipants.find((user) => user.userId === userId);
    remnantParticipants = remnantParticipants.filter((user) => user.userId !== userId);
    const activeSpeaker = remnantParticipants.find((user) => user.userId === activeSpeakerId);
    if ((viewType === "speaker" || participantsPerPage === 1) && spotlightedUsers.length === 0) {
      remnantParticipants = remnantParticipants.filter((user) => user.userId !== activeSpeakerId);
    }
    remnantParticipants = remnantParticipants.sort((user1, user2) => Number(user2.bVideoOn) - Number(user1.bVideoOn));
    if (!isMobileDeviceNotIpad() && currentUser && isSupportMultipleVideos) {
      // if (currentUser) {
      if (viewType === "speaker" || participantsPerPage === 1) {
        remnantParticipants.splice(0, 0, currentUser);
      } else {
        remnantParticipants.splice(1, 0, currentUser);
      }
    }
    const p =
      viewType === "gallery"
        ? participantsPerPage === 1
          ? [
              ...(spotlightedUsers.length > 0 ? spotlightedUsers : activeSpeaker ? [activeSpeaker] : []),
              ...remnantParticipants,
            ]
          : [...spotlightedUsers, ...remnantParticipants]
        : remnantParticipants;
    // Filter current page user
    let pageParticipant = p.filter((_user, index) => Math.floor(index / participantsPerPage) === currentPage);
    // Pad page participant
    if (pageParticipant.length < participantsPerPage) {
      const vacantSize = participantsPerPage - pageParticipant.length;
      const paddingParticipants = p.filter(
        (_user, index) =>
          index >= participantsPerPage * (totalPages - 1) - vacantSize &&
          index < participantsPerPage * (totalPages - 1),
      );
      pageParticipant = paddingParticipants.concat(pageParticipant);
    }

    if (viewType === "speaker") {
      if (spotlightedUsers.length > 0) {
        pageParticipant = [...spotlightedUsers, ...pageParticipant];
      } else {
        if (activeSpeaker) {
          pageParticipant.splice(0, 0, activeSpeaker);
        }
      }
    }
    return pageParticipant;
  }, [
    activeSpeakerId,
    currentPage,
    participants,
    participantsPerPage,
    totalPages,
    userId,
    viewType,
    spotlightUserIdList,
    isSupportMultipleVideos,
  ]);

  useEffect(() => {
    // Reset current to the last page if the total pages number decreased
    if (currentPage >= totalPages) {
      dispatch(setCurrentPage(Math.max(0, totalPages - 1)));
    }
  }, [totalPages, currentPage, dispatch]);

  return {
    currentPage,
    totalPages,
    currentParticipants,
    goToNextPage,
    goToPreviousPage,
  };
};
