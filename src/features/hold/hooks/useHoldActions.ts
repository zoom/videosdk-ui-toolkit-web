import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { enqueueSnackbar } from "notistack";
import { ClientContext } from "@/context/client-context";
import { useAppDispatch, useAppSelector, useHoldSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { addPendingUserId, clearLatestArrival, removePendingUserId } from "../holdSlice";

/**
 * Host and manager actions for the hold.
 *
 * The waiting list itself is refreshed from `user-added` / `user-updated` / `user-removed`
 * in `SessionApp`, so these only fire the request and surface failures. There is no deny API in
 * the SDK — removing a waiting participant is the same `removeUser` call used in-session.
 */
export function useHoldActions() {
  const { t } = useTranslation();
  const client = useContext(ClientContext);
  const dispatch = useAppDispatch();
  const { isHost, isManager } = useAppSelector(useSessionSelector);
  const { onHoldParticipants, pendingUserIds } = useAppSelector(useHoldSelector);

  // The hold is switched on or off by the `hold` claim in the JWT, not by a UI option, so there
  // is nothing to gate on here beyond the role. The list is empty unless someone is held, which
  // means the controls only show up when there is something to admit.
  const canManage = isHost || isManager;

  // The SDK reason is an internal string, sometimes naming a user or a claim. Show one generic
  // message instead, including when the rejection carries no reason at all.
  const notifyError = useCallback(() => {
    enqueueSnackbar(t("hold.action_failed"), { variant: "error", autoHideDuration: 5000 });
  }, [t]);

  const admit = useCallback(
    async (userId: number) => {
      dispatch(addPendingUserId(userId));
      try {
        await client?.admit(userId);
      } catch {
        notifyError();
      } finally {
        dispatch(removePendingUserId(userId));
      }
    },
    [client, dispatch, notifyError],
  );

  const admitAll = useCallback(async () => {
    const userIds = onHoldParticipants.map((participant) => participant.userId);
    userIds.forEach((userId) => dispatch(addPendingUserId(userId)));
    try {
      await client?.admitAll();
    } catch {
      notifyError();
    } finally {
      userIds.forEach((userId) => dispatch(removePendingUserId(userId)));
      dispatch(clearLatestArrival());
    }
  }, [client, dispatch, notifyError, onHoldParticipants]);

  const remove = useCallback(
    async (userId: number) => {
      dispatch(addPendingUserId(userId));
      try {
        await client?.removeUser(userId);
      } catch {
        notifyError();
      } finally {
        dispatch(removePendingUserId(userId));
      }
    },
    [client, dispatch, notifyError],
  );

  return {
    canManage,
    onHoldParticipants,
    pendingUserIds,
    admit,
    admitAll,
    remove,
  };
}
