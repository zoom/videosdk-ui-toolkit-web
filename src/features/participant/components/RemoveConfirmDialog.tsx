import React, { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsRemoveParticipantDialogOpen, setParticipantToRemove } from "@/store/uiSlice";
import { ClientContext } from "@/context/client-context";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";

const RemoveConfirmDialog: React.FC = () => {
  const { t } = useTranslation();
  const client = useContext(ClientContext);
  const dispatch = useAppDispatch();
  const sessionUI = useAppSelector(useSessionUISelector);
  const { isRemoveParticipantDialogOpen, participantToRemove } = sessionUI;

  const handleConfirmRemove = useCallback(() => {
    if (participantToRemove?.userId) {
      client?.removeUser(participantToRemove.userId);
    }
    dispatch(setIsRemoveParticipantDialogOpen(false));
    dispatch(setParticipantToRemove(null));
  }, [client, participantToRemove, dispatch]);

  const handleCancelRemove = useCallback(() => {
    dispatch(setIsRemoveParticipantDialogOpen(false));
    dispatch(setParticipantToRemove(null));
  }, [dispatch]);

  if (!isRemoveParticipantDialogOpen || !participantToRemove) {
    return null;
  }

  return (
    <ConfirmDialog
      title={t("participant.remove_title")}
      message={t("participant.remove_confirmation", { name: participantToRemove.displayName })}
      onConfirm={handleConfirmRemove}
      confirmText={t("participant.remove_button")}
      confirmVariant="danger"
      onCancel={handleCancelRemove}
      cancelText={t("common.cancel")}
      id="uikit-remove-participant-dialog"
    />
  );
};

export default RemoveConfirmDialog;
