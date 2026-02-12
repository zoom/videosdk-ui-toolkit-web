import React, { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector, useWhiteboardSelector } from "@/hooks/useAppSelector";
import { ClientContext } from "@/context/client-context";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";
import { setWhiteboardError, setWhiteboardLoading } from "../whiteboardSlice";
import { ERROR_START_WHITEBOARD, WHITEBOARD_CONTAINER_INNER_ID, WHITEBOARD_ERROR_MESSAGE } from "../constant";

const WhiteboardErrorDialog: React.FC = () => {
  const { t } = useTranslation();
  const client = useContext(ClientContext);
  const dispatch = useAppDispatch();
  const whiteboard = useAppSelector(useWhiteboardSelector);

  const handleRetry = useCallback(async () => {
    dispatch(setWhiteboardError(null));
    dispatch(setWhiteboardLoading(true));

    // Get whiteboard client and retry starting whiteboard
    const whiteboardClient = (client as any)?.getWhiteboardClient();
    if (whiteboardClient) {
      await whiteboardClient
        .startWhiteboardScreen(document.getElementById(WHITEBOARD_CONTAINER_INNER_ID), {
          isDisableExport: whiteboard.isDisableExport,
        })
        .catch(() => {
          dispatch(
            setWhiteboardError({
              errorCode: ERROR_START_WHITEBOARD,
              errorMessage: WHITEBOARD_ERROR_MESSAGE[ERROR_START_WHITEBOARD],
            }),
          );
          dispatch(setWhiteboardLoading(false));
        });
    }
  }, [client, dispatch, whiteboard.isDisableExport]);

  if (!whiteboard.error) {
    return null;
  }

  return (
    <ConfirmDialog
      title={t("whiteboard.error_title")}
      message={`${whiteboard.error?.errorMessage}:${whiteboard.error?.errorCode}`}
      onConfirm={handleRetry}
      confirmText={t("common.retry")}
      confirmVariant="primary"
      onCancel={() => {
        dispatch(setWhiteboardError(null));
        dispatch(setWhiteboardLoading(false));
      }}
      cancelText={t("common.close")}
      id="uikit-whiteboard-error-dialog"
    />
  );
};

export default WhiteboardErrorDialog;
