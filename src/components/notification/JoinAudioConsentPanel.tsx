import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import CommonNotification from "@/components/widget/CommonNotification";
import { useToggleMic } from "@/features/audio/hooks/useToggleMic";
import { setShowJoinAudioConsent } from "@/store/uiSlice";
import { THEME_COLOR_CLASS, THEME_COLOR_CLASS_TOGGLE_BUTTON } from "@/constant/ui-constant";

const JoinAudioConsentPanel = () => {
  const { isShowJoinAudioConsent } = useAppSelector(useSessionUISelector);
  const title = "Enable Audio";
  const content = "Would you like to enable audio for this session?";
  const okText = "Enable";
  const dispatch = useAppDispatch();
  const toggleMic = useToggleMic();

  const onOkClick = async () => {
    await toggleMic();
    dispatch(setShowJoinAudioConsent(false));
  };

  return (
    <CommonNotification
      isOpen={isShowJoinAudioConsent}
      onClose={() => dispatch(setShowJoinAudioConsent(false))}
      width={360}
      height={190}
    >
      <div className={`flex flex-col h-full justify-between bg-theme-surface p-1`}>
        <div className="space-y-3">
          <h2 className="text-xl font-medium text-theme-text" id="uikit-join-audio-consent-title">
            {title}
          </h2>
          <p className="leading-relaxed text-theme-text" id="uikit-join-audio-consent-content">
            {content}
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-5 py-2 text-sm font-medium  rounded-lg transition-colors duration-200 hover:bg-theme-background text-theme-text border border-theme-border"
            onClick={() => dispatch(setShowJoinAudioConsent(false))}
            id="uikit-join-audio-consent-not-now"
          >
            Not Now
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-theme-text-button rounded hover:bg-blue-700 transition-colors"
            onClick={onOkClick}
            id="uikit-join-audio-consent-enable"
            autoFocus
          >
            {okText}
          </button>
        </div>
      </div>
    </CommonNotification>
  );
};

export default JoinAudioConsentPanel;
