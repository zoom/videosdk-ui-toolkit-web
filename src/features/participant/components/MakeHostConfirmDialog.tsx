import React, { useCallback, useContext } from "react";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsMakeHostDialogOpen, setParticipantToMakeHost } from "@/store/uiSlice";
import { ClientContext } from "@/context/client-context";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";

const MakeHostConfirmDialog: React.FC = () => {
  const client = useContext(ClientContext);
  const dispatch = useAppDispatch();
  const sessionUI = useAppSelector(useSessionUISelector);
  const { isMakeHostDialogOpen, participantToMakeHost } = sessionUI;

  const handleConfirmMakeHost = useCallback(() => {
    if (participantToMakeHost?.userId) {
      client?.makeHost(participantToMakeHost.userId);
    }
    dispatch(setIsMakeHostDialogOpen(false));
    dispatch(setParticipantToMakeHost(null));
  }, [client, participantToMakeHost, dispatch]);

  const handleCancelMakeHost = useCallback(() => {
    dispatch(setIsMakeHostDialogOpen(false));
    dispatch(setParticipantToMakeHost(null));
  }, [dispatch]);

  if (!isMakeHostDialogOpen || !participantToMakeHost) {
    return null;
  }

  return (
    <ConfirmDialog
      title="Make Host"
      message={`Are you sure you want to make ${participantToMakeHost.displayName} as host? You will lose host privileges.`}
      onConfirm={handleConfirmMakeHost}
      confirmText="Make Host"
      confirmVariant="primary"
      onCancel={handleCancelMakeHost}
      cancelText="Cancel"
      id="uikit-make-host-dialog"
    />
  );
};

export default MakeHostConfirmDialog;
