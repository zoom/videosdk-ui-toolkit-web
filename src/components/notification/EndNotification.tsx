import { useTranslation } from "react-i18next";
import { ErrorKeyMap, getKeyByValue } from "../error/lang-util";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useCallback } from "react";
import { usePrevious } from "../../hooks";
import FeedbackDialog from "@/features/feedback/FeedbackDialog";
import { emit } from "@/events/event-bus";
import { ExposedEvents } from "@/events/event-constant";

const EndNotification = (props: { reason?: string; isEnableFeedback: boolean; setIsJoined?: () => void }) => {
  const { t } = useTranslation();
  const { reason, isEnableFeedback, setIsJoined } = props;
  const preReason = usePrevious(reason);
  const { enqueueSnackbar } = useSnackbar();

  const handleSessionDestroyed = useCallback((isEnableFeedback: boolean) => {
    // Use setTimeout to ensure this runs after React's current execution
    setTimeout(() => {
      if (!isEnableFeedback) {
        emit(ExposedEvents.EVENT_SESSION_DESTROYED, "closed");
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (reason === preReason || reason === "") {
      return;
    }

    let variantValue = "error";
    let content = "";

    switch (reason) {
      case undefined: {
        variantValue = "info";
        content = `${t("session.disconnected")}: ${t("leave.session")}`;
        break;
      }
      case "ended by host": {
        variantValue = "info";
        content = t("dialog.host_end_meeting", { name: "jack" });
        break;
      }
      default: {
        const langKey = getKeyByValue(ErrorKeyMap, reason || "")?.toString() || "errorcodes_fail";
        content = t(langKey);
      }
    }

    enqueueSnackbar(content, {
      variant: variantValue as "info" | "error",
      onExit: () => handleSessionDestroyed(isEnableFeedback),
      autoHideDuration: 2000,
    });
  }, [enqueueSnackbar, preReason, reason, t, isEnableFeedback, handleSessionDestroyed]);

  if (!isEnableFeedback) return null;
  return <FeedbackDialog setIsJoined={setIsJoined} />;
};

export default EndNotification;
