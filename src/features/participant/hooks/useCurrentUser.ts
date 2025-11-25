import { useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector, useParticipantSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { setIsMuted } from "@/store/sessionSlice";

export const useCurrentUser = () => {
  const { participants } = useAppSelector(useParticipantSelector);
  const { userId } = useAppSelector(useSessionSelector);
  const dispatch = useAppDispatch();

  const currentUser = useMemo(() => participants?.find((user) => user?.userId === userId), [participants, userId]);

  useEffect(() => {
    const isUserMuted = currentUser?.muted === undefined ? true : currentUser?.muted;
    dispatch(setIsMuted(isUserMuted));
  }, [currentUser, dispatch]);

  return currentUser;
};
