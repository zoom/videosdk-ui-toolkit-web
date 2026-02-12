import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import ConfirmDialog from "../widget/dialog/ConfirmDialog";
import { setChatLinkUrl, setIsJoinSubsessionConfirm } from "@/store/uiSlice";

export const LinkOpenConfirmDialog = () => {
  const { t } = useTranslation();
  const { chatLinkUrl } = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();

  if (!chatLinkUrl) return null;
  return (
    <ConfirmDialog
      onClose={() => dispatch(setChatLinkUrl(""))}
      onConfirm={() => {
        window.open(chatLinkUrl, "_blank");
        dispatch(setChatLinkUrl(""));
      }}
      title={t("dialog.confirm_open_link")}
      confirmText={t("common.open")}
      message={chatLinkUrl}
      className="uikit-link-open-confirm-dialog break-words"
    />
  );
};

export default LinkOpenConfirmDialog;
