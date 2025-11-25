import { useCallback, useContext } from "react";
import { CommonPopper } from "@/components/widget/CommonPopper";
import sessionAdditionalContext from "@/context/session-additional-context";
import { useAppDispatch, useAppSelector, useCaptionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsShowHostCaptionSettings } from "@/store/uiSlice";
import { setIsHostDisableCaptions } from "./captionSlice";
import { enqueueSnackbar } from "notistack";

export const HostCaptionSettings = () => {
  const { captionClient } = useContext(sessionAdditionalContext);
  const { isShowHostCaptionSettings } = useAppSelector(useSessionUISelector);
  const { isHostDisableCaptions } = useAppSelector(useCaptionSelector);
  const dispatch = useAppDispatch();

  const handleToggleHostEnableCaptions = useCallback(async () => {
    try {
      dispatch(setIsHostDisableCaptions(!isHostDisableCaptions));
      await captionClient?.disableCaptions(!isHostDisableCaptions);
    } catch (error) {
      dispatch(setIsHostDisableCaptions(isHostDisableCaptions));
      enqueueSnackbar(error.reason, {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  }, [captionClient, dispatch, isHostDisableCaptions]);

  return (
    <CommonPopper
      isOpen={isShowHostCaptionSettings}
      onClose={() => dispatch(setIsShowHostCaptionSettings(false))}
      title="Host Captions Control Settings"
      width={500}
      height={280}
    >
      <div className="p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <span className="font-medium">Allow Closed Captioning for this session</span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={!isHostDisableCaptions}
              onChange={handleToggleHostEnableCaptions}
            />
            <div className="w-10 h-6 rounded-full peer-checked:bg-blue-500 peer-focus:ring-2 peer-focus:ring-blue-500 transition-all"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
          </label>
        </div>

        <p className="text-sm mb-6">When this setting is disabled, nobody can use Closed Captioning in the session.</p>

        <div className="flex justify-end">
          <button
            className="px-10 py-2 bg-blue-500 text-theme-text-button font-medium rounded-lg hover:bg-blue-600 transition"
            onClick={() => dispatch(setIsShowHostCaptionSettings(false))}
          >
            OK
          </button>
        </div>
      </div>
    </CommonPopper>
  );
};
