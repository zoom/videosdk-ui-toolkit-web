import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import ConfirmDialog from "../widget/dialog/ConfirmDialog";
import { setChatLinkUrl, setIsJoinSubsessionConfirm } from "@/store/uiSlice";

export const LinkOpenConfirmDialog = () => {
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
      title="Are you sure you want to open the link?"
      confirmText="Open"
      message={chatLinkUrl}
      className="uikit-link-open-confirm-dialog break-words"
    />
  );
};

export default LinkOpenConfirmDialog;
