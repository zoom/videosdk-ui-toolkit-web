import React, { useCallback, useContext } from "react";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsRemoveParticipantDialogOpen, setParticipantToRemove } from "@/store/uiSlice";
import { ClientContext } from "@/context/client-context";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";

const RemoveConfirmDialog: React.FC = () => {
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
      title="Remove Participant"
      message={`Are you sure you want to remove ${participantToRemove.displayName} from the session?`}
      onConfirm={handleConfirmRemove}
      confirmText="Remove"
      confirmVariant="danger"
      onCancel={handleCancelRemove}
      cancelText="Cancel"
      id="uikit-remove-participant-dialog"
    />
  );
};

export default RemoveConfirmDialog;
