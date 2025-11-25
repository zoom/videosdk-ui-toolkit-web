import { useContext } from "react";
import { useUnmuteConsent } from "./hooks";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import CommonNotification from "@/components/widget/CommonNotification";
import { StreamContext } from "@/context/stream-context";
import { useToggleMic } from "@/features/audio/hooks/useToggleMic";
import { setShowUnmuteConsent } from "@/store/uiSlice";

const UnmuteConsentPanel = () => {
  const { isShowUnmuteConsent } = useAppSelector(useSessionUISelector);
  const { title, content, content2, okText, cancelText } = useUnmuteConsent();
  const dispatch = useAppDispatch();

  const toggleMic = useToggleMic();

  const onOkClick = async () => {
    await toggleMic();
    dispatch(setShowUnmuteConsent(false));
  };

  const onCancelClick = () => {
    dispatch(setShowUnmuteConsent(false));
  };

  return (
    <CommonNotification isOpen={isShowUnmuteConsent} onClose={onCancelClick} width={400} height={200}>
      <div className="flex flex-col h-full justify-center space-y-4 pt-8">
        <h2 className="text-lg font-semibold text-theme-text">{title}</h2>
        <p className="text-sm text-theme-text">{content}</p>
        {content2 && <p className="text-sm text-theme-text">{content2}</p>}
        <div className="flex justify-end space-x-2 mt-2">
          <button
            className="px-4 py-2 text-theme-text bg-theme-background rounded hover:bg-theme-background-hover transition-colors border border-theme-border"
            onClick={onCancelClick}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-theme-text-button rounded hover:bg-blue-700 transition-colors border border-theme-border"
            onClick={onOkClick}
          >
            {okText}
          </button>
        </div>
      </div>
    </CommonNotification>
  );
};

export default UnmuteConsentPanel;
