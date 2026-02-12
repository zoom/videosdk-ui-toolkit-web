import { useContext } from "react";
import { useCameraControlConsent } from "./hooks";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import CommonNotification from "@/components/widget/CommonNotification";
import { StreamContext } from "@/context/stream-context";
import { setShowCameraControlConsent } from "@/store/uiSlice";

const CameraControlConsentPanel = () => {
  const { isShowCameraControlConsent } = useAppSelector(useSessionUISelector);
  const { title, content, okText, cancelText, requestingUserId } = useCameraControlConsent();
  const dispatch = useAppDispatch();
  const { stream } = useContext(StreamContext);

  const onOkClick = async () => {
    if (!stream || requestingUserId === null) return;

    try {
      await stream?.approveFarEndCameraControl(requestingUserId);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Failed to approve camera control:", error);
    }
    dispatch(setShowCameraControlConsent(false));
  };

  const onCancelClick = async () => {
    if (!stream || requestingUserId === null) return;

    try {
      await stream?.declineFarEndCameraControl(requestingUserId);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Failed to decline camera control:", error);
    }
    dispatch(setShowCameraControlConsent(false));
  };

  return (
    <CommonNotification isOpen={isShowCameraControlConsent} onClose={onCancelClick} width={400} height={220}>
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-semibold text-theme-text">{title}</h2>
          <p className="text-sm text-theme-text">{content}</p>
        </div>
        <div className="flex justify-end space-x-2 mt-4 pb-2">
          <button
            className="px-4 py-2 text-theme-text bg-theme-background rounded hover:bg-theme-background-hover transition-colors border border-theme-border whitespace-nowrap"
            onClick={onCancelClick}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-theme-text-button rounded hover:bg-blue-700 transition-colors border border-theme-border whitespace-nowrap"
            onClick={onOkClick}
          >
            {okText}
          </button>
        </div>
      </div>
    </CommonNotification>
  );
};

export default CameraControlConsentPanel;
