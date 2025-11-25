import React, { useContext } from "react";
import CommonNotification from "../widget/CommonNotification";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import {
  setShowShareScreenToSubsessionModal,
  setShareScreenToSubsessionDontShowAgain,
  setCanDoAnnotation,
} from "../../store/uiSlice";
import { useToggleScreenShare } from "@/features/share/hooks/useToggleScreenShare";
import { THEME_COLOR_CLASS_TOGGLE_BUTTON } from "@/constant/ui-constant";
import { StreamContext } from "@/context/stream-context";

const ShareScreenToSubsessionModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isShowShareScreenToSubsessionModal, shareScreenToSubsessionDontShowAgain } =
    useAppSelector(useSessionUISelector);
  const { startScreenShare } = useToggleScreenShare();
  const { stream } = useContext(StreamContext);
  const handleClose = () => {
    dispatch(setShowShareScreenToSubsessionModal(false));
  };

  const handleShare = async () => {
    await startScreenShare(true);
    dispatch(setCanDoAnnotation(stream?.canDoAnnotation()));
    handleClose();
  };

  const handleDontShowAgainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setShareScreenToSubsessionDontShowAgain(e.target.checked));
  };

  return (
    <CommonNotification
      isOpen={isShowShareScreenToSubsessionModal}
      onClose={handleClose}
      width={480}
      height="auto"
      allowClose={true}
    >
      <div className={`space-y-4 ${THEME_COLOR_CLASS_TOGGLE_BUTTON} text-theme-text`}>
        <h2 className="text-lg font-semibold text-theme-text">Share screen to all subsessions</h2>

        <ul className="space-y-3 list-disc pl-5 ">
          <li>Your screen will be shared in the main session and in all subsessions</li>
          <li>Your video and audio will not be shared with subsessions</li>
          <li>Screens that others are sharing in the rooms will be stopped</li>
        </ul>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center ">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={shareScreenToSubsessionDontShowAgain}
              onChange={handleDontShowAgainChange}
              className="mr-2"
            />
            <label htmlFor="dontShowAgain" className="select-none">
              Don&apos;t show this again
            </label>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded border border-theme-border text-theme-text hover:bg-theme-background"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded bg-blue-600 text-theme-text-button hover:bg-blue-700 border border-theme-border"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </CommonNotification>
  );
};

export default ShareScreenToSubsessionModal;
