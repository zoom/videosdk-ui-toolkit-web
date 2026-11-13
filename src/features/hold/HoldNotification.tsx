import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DraggableToast from "@/components/widget/toast/Toast";
import Button from "@/components/widget/CommonButton";
import { useAppDispatch, useAppSelector, useHoldSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setActivePopper, setIsParticipantsPoppedOut } from "@/store/uiSlice";
import { clearLatestArrival } from "./holdSlice";
import { useHoldActions } from "./hooks";

/**
 * Toast shown to a host or manager when someone enters the hold.
 *
 * Like `NewMessageNotification`, this renders a single state-driven toast rather than stacking one
 * per arrival, so a burst of joins collapses into a count instead of burying the UI.
 *
 * Note: `DraggableToast` only applies its surface/border styles when no custom `icon` is passed,
 * and ignores `onClick` once `action` is set — hence the default icon and the explicit action
 * button below.
 */
export const HoldNotification: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { latestArrival, onHoldParticipants } = useAppSelector(useHoldSelector);
  const { isParticipantsPoppedOut, activeSidePanel } = useAppSelector(useSessionUISelector);
  const { canManage, admit } = useHoldActions();

  const handleClose = useCallback(() => {
    dispatch(clearLatestArrival());
  }, [dispatch]);

  const handleAdmit = useCallback(() => {
    if (latestArrival) {
      admit(latestArrival.userId);
    }
    dispatch(clearLatestArrival());
  }, [admit, dispatch, latestArrival]);

  const handleOpenPanel = useCallback(() => {
    dispatch(setIsParticipantsPoppedOut(true));
    dispatch(setActivePopper(t("participant.panel_title")));
    dispatch(clearLatestArrival());
  }, [dispatch, t]);

  const isPanelOpen = isParticipantsPoppedOut || activeSidePanel === "participants";

  // The host is already looking at the list, so the announcement is spent. Clearing it here means
  // closing the panel does not bring the toast back for someone they have already seen.
  useEffect(() => {
    if (canManage && isPanelOpen && latestArrival) {
      dispatch(clearLatestArrival());
    }
  }, [canManage, dispatch, isPanelOpen, latestArrival]);

  // Nothing to announce, or the host is already looking at the list.
  if (!canManage || !latestArrival || isPanelOpen) {
    return null;
  }

  const waitingCount = onHoldParticipants.length;
  const isSingle = waitingCount <= 1;
  const message = isSingle
    ? t("hold.arrival_toast", { name: latestArrival.displayName })
    : t("hold.arrival_toast_many", { count: waitingCount });

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 top-full z-10 text-theme-text">
      <DraggableToast
        key={`uikit-toast-hold-${latestArrival.userId}`}
        id="uikit-toast-hold"
        type="info"
        isVisible={true}
        duration={15000}
        message={message}
        // Wider than the default toast, and wrapping rather than truncating, because the message
        // carries a display name of unbounded length — an ellipsis here hides who is waiting.
        maxWidth="min(520px, calc(100vw - 32px))"
        wrapMessage={true}
        onClose={handleClose}
        action={
          isSingle ? (
            <Button
              variant="primary"
              size="xs"
              onClick={handleAdmit}
              aria-label={t("hold.admit_aria", { name: latestArrival.displayName })}
            >
              {t("hold.admit")}
            </Button>
          ) : (
            <Button variant="primary" size="xs" onClick={handleOpenPanel}>
              {t("hold.view_waiting")}
            </Button>
          )
        }
      />
    </div>
  );
};

export default HoldNotification;
