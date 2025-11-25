import { useState } from "react";
import ConfirmDialog from "../widget/dialog/ConfirmDialog";
import { ErrorContainerProps } from "./error-types";
import { ErrorKeyMap, getKeyByValue } from "./lang-util";

const ErrorContainer = (props: ErrorContainerProps) => {
  const {
    onRetry,
    errorStatus: { errorCode, reason, result },
  } = props;
  const [open, setOpen] = useState(true);

  const isKicked = reason === "kicked by host" || reason === "expeled by host";

  const FREE_SESSION_ENDED = "free session ended";
  const getTitle = () => {
    if (isKicked) {
      return "You are removed";
    } else if (reason === "ended by host") {
      return "Session ended";
    } else if (reason === FREE_SESSION_ENDED) {
      return "Free session ended";
    } else if (reason === "rejoin_timeout") {
      return "Network error";
    } else {
      return "Join Session Failed";
    }
  };

  const getContent = () => {
    const errorKey = getKeyByValue(ErrorKeyMap, result);
    if (errorKey) {
      return ErrorKeyMap[errorKey];
    }
    if (isKicked) {
      return "You have been removed from the session by the host.";
    } else if (reason === FREE_SESSION_ENDED) {
      return "Your free session has ended.";
    } else if (reason === "rejoin_timeout") {
      return "Unable to reconnect to the session due to network issues.";
    }
    return reason || `An error occurred (Error Code: ${errorCode})`;
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
    if (showRetry) return "Retry";
    return "OK";
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
      cancelText={showSingleOkButton ? undefined : "Cancel"}
    />
  );
};

export default ErrorContainer;
