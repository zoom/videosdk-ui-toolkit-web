import React, { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsMakeHostDialogOpen, setParticipantToMakeHost } from "@/store/uiSlice";
import { ClientContext } from "@/context/client-context";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";

const MakeHostConfirmDialog: React.FC = () => {
  const { t } = useTranslation();
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
      title={t("participant.make_host_title")}
      message={t("participant.make_host_confirmation", { name: participantToMakeHost.displayName })}
      onConfirm={handleConfirmMakeHost}
      confirmText={t("participant.make_host_button")}
      confirmVariant="primary"
      onCancel={handleCancelMakeHost}
      cancelText={t("common.cancel")}
      id="uikit-make-host-dialog"
    />
  );
};

export default MakeHostConfirmDialog;
