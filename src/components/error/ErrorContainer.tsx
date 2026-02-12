import { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "../widget/dialog/ConfirmDialog";
import { ErrorContainerProps } from "./error-types";
import { ErrorKeyMap, getKeyByValue } from "./lang-util";

const ErrorContainer = (props: ErrorContainerProps) => {
  const { t } = useTranslation();
  const {
    onRetry,
    errorStatus: { errorCode, reason, result },
  } = props;
  const [open, setOpen] = useState(true);

  const isKicked = reason === "kicked by host" || reason === "expeled by host";

  const FREE_SESSION_ENDED = "free session ended";
  const getTitle = () => {
    if (isKicked) {
      return t("error.you_are_removed_title");
    } else if (reason === "ended by host") {
      return t("error.session_ended_title");
    } else if (reason === FREE_SESSION_ENDED) {
      return t("error.free_session_ended_title");
    } else if (reason === "rejoin_timeout") {
      return t("error.network_error_title");
    } else {
      return t("error.join_session_failed_title");
    }
  };

  const getContent = () => {
    const errorKey = getKeyByValue(ErrorKeyMap, result);
    if (errorKey) {
      return ErrorKeyMap[errorKey];
    }
    if (isKicked) {
      return t("error.removed_by_host_message");
    } else if (reason === FREE_SESSION_ENDED) {
      return t("error.free_session_ended_message");
    } else if (reason === "rejoin_timeout") {
      return t("error.network_reconnect_message");
    }
    return reason || t("error.occurred_with_code", { errorCode });
  };
  const onOkClick = () => {
    setOpen(false);
  };

  const showRetry = ["internal_server_error", "network_error"].includes(reason);
  const showSingleOkButton =
    errorCode === 200 ||
    [
      "session_expired",
      "kicked by host",
      FREE_SESSION_ENDED,
      "errorcodes_session_locked",
      "errorcodes_session_ended",
      "errorcodes_session_capacity_reached",
    ].includes(reason);

  const getOkText = () => {
    if (showRetry) return t("common.retry");
    return t("common.ok");
  };

  if (!open) {
    return null;
  }

  return (
    <ConfirmDialog
      title={getTitle()}
      message={getContent()}
      onConfirm={showRetry ? onRetry : onOkClick}
      confirmText={getOkText()}
      onCancel={showSingleOkButton ? undefined : () => setOpen(false)}
      cancelText={showSingleOkButton ? undefined : t("common.cancel")}
    />
  );
};

export default ErrorContainer;
