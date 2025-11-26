import { CommonPopper } from "@/components/widget/CommonPopper";
import { useAppDispatch, useAppSelector, useCaptionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { useCallback, useContext, useState } from "react";
import { setIsShowStartCaptionsWindow, setIsShowCaption } from "@/store/uiSlice";
import { LANGUAGE_CODES } from "../caption-constant";
import { LiveTranscriptionLanguage } from "@zoom/videosdk";
import {
  setIsTranscriptionInitiated,
  setCurrentSpeakingLanguage,
  setCurrentTranslationLanguage,
  setInitialTranslationLanguage,
} from "../captionSlice";
import sessionAdditionalContext from "@/context/session-additional-context";
import Select from "react-select";
import { enqueueSnackbar } from "notistack";
import { CommonSelectStyle } from "@/components/widget/CommonSelectStyle";

const StartCaptionsWindow = () => {
  const { isShowStartCaptionsWindow, themeName } = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();
  const { captionClient } = useContext(sessionAdditionalContext);

  const { isTranslationFeatureEnabled } = useAppSelector(useCaptionSelector);

  const getSpeakingLanguagesList = useCallback(() => {
    if (!captionClient) return [];
    const { transcriptionLanguage } = captionClient.getLiveTranscriptionStatus();
    if (!transcriptionLanguage) return [];
    return transcriptionLanguage.split(";").filter(Boolean);
  }, [captionClient]);

  const getTranslationLanguagesList = useCallback(
    (speakingLanguage: string) => {
      if (!captionClient) return [];
      const { translationLanguage } = captionClient.getLiveTranscriptionStatus();
      if (!translationLanguage) return [];
      const languageObj = translationLanguage.find((language) => language.speakingLanguage === speakingLanguage);
      return languageObj ? languageObj.translatedToLanguage.split(";").filter(Boolean) : [];
    },
    [captionClient],
  );

  const [selectedLocalSpeakingLanguage, setSelectedLocalSpeakingLanguage] = useState("en");
  const [selectedLocalTranslationLanguage, setSelectedLocalTranslationLanguage] = useState(null);

  const handleSpeakingLanguageSelect = (newValue: { value: string; label: string }) => {
    setSelectedLocalSpeakingLanguage(newValue.value);
    setSelectedLocalTranslationLanguage(null);
  };

  const onToggleTranslations = () => {
    if (selectedLocalTranslationLanguage === null) {
      setSelectedLocalTranslationLanguage(getTranslationLanguagesList(selectedLocalSpeakingLanguage)[0]);
    } else if (selectedLocalTranslationLanguage !== null) {
      setSelectedLocalTranslationLanguage(null);
    }
  };

  const handleTranslationLanguageSelect = (newValue: { value: string; label: string }) => {
    setSelectedLocalTranslationLanguage(newValue.value);
  };

  const onStartCaptions = useCallback(async () => {
    // Start live transcription
    try {
      dispatch(setIsTranscriptionInitiated(true));
      dispatch(setIsShowCaption(true));
      dispatch(setIsShowStartCaptionsWindow(false));
      await captionClient?.startLiveTranscription();
    } catch (error) {
      dispatch(setIsTranscriptionInitiated(false));
      dispatch(setIsShowCaption(false));
      dispatch(setIsShowStartCaptionsWindow(true));
      enqueueSnackbar(error.reason, {
        variant: "error",
        autoHideDuration: 5000,
      });
      return;
    }

    // Set speaking language
    try {
      dispatch(setCurrentSpeakingLanguage(selectedLocalSpeakingLanguage));
      await captionClient?.setSpeakingLanguage(selectedLocalSpeakingLanguage);
    } catch (error) {
      dispatch(setCurrentSpeakingLanguage(null));
      // captionClient?.stopLiveTranscription(); // Will exist in future video sdk release
      dispatch(setIsTranscriptionInitiated(false));
      dispatch(setIsShowCaption(false));
      dispatch(setIsShowStartCaptionsWindow(true));
      enqueueSnackbar(error.reason, {
        variant: "error",
        autoHideDuration: 5000,
      });
      return;
    }

    // Set translation language
    if (selectedLocalTranslationLanguage) {
      try {
        dispatch(setCurrentTranslationLanguage(selectedLocalTranslationLanguage));
        dispatch(setInitialTranslationLanguage(selectedLocalTranslationLanguage));
        await captionClient?.setTranslationLanguage(selectedLocalTranslationLanguage);
      } catch (error) {
        dispatch(setCurrentTranslationLanguage(undefined));
        dispatch(setInitialTranslationLanguage(undefined));
        enqueueSnackbar(error.reason, {
          variant: "error",
          autoHideDuration: 5000,
        });
        return;
      }
    }
  }, [dispatch, captionClient, selectedLocalSpeakingLanguage, selectedLocalTranslationLanguage]);

  const onCloseCaptionStartWindow = useCallback(() => {
    dispatch(setIsShowStartCaptionsWindow(false));
  }, [dispatch]);

  return (
    <CommonPopper
      id="uikit-caption-start-captions-window"
      isOpen={isShowStartCaptionsWindow}
      onClose={() => {
        dispatch(setIsShowStartCaptionsWindow(false));
      }}
      title={
        selectedLocalTranslationLanguage
          ? "You've enabled Translation. Select the language you will read and speak in this session."
          : "Set the caption language for this session"
      }
      width={500}
      height={selectedLocalTranslationLanguage ? 430 : 275}
    >
      <div className="p-6 max-w-xl mx-auto space-y-6">
        {/* Speaking Language Section */}
        <div>
          <h3 className=" font-semibold">My Speaking Language</h3>
          <p className=" text-sm mb-2">Select the language you will be speaking in for this session</p>
          <Select
            value={{ value: selectedLocalSpeakingLanguage, label: LANGUAGE_CODES[selectedLocalSpeakingLanguage] }}
            onChange={handleSpeakingLanguageSelect}
            className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            classNamePrefix="uikit-custom-scrollbar"
            options={getSpeakingLanguagesList().map((lang: LiveTranscriptionLanguage) => ({
              value: lang,
              label: LANGUAGE_CODES[lang],
            }))}
            menuPortalTarget={document.body}
            styles={CommonSelectStyle({ themeName })}
          />
        </div>

        {/* Caption Language Section */}
        {selectedLocalTranslationLanguage && (
          <div>
            <h3 className="font-semibold">My Caption Language</h3>
            <p className="text-sm mb-2">Captions will appear in and translated to this language for you</p>
            <Select
              value={{
                value: selectedLocalTranslationLanguage,
                label: LANGUAGE_CODES[selectedLocalTranslationLanguage],
              }}
              onChange={handleTranslationLanguageSelect}
              className=" w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              classNamePrefix="uikit-custom-scrollbar"
              options={getTranslationLanguagesList(selectedLocalSpeakingLanguage).map(
                (lang: LiveTranscriptionLanguage) => ({
                  value: lang,
                  label: LANGUAGE_CODES[lang],
                }),
              )}
              menuPortalTarget={document.body}
              styles={CommonSelectStyle({ themeName })}
            />
          </div>
        )}

        {/* Enable Translation Checkbox and Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          {isTranslationFeatureEnabled && getTranslationLanguagesList(selectedLocalSpeakingLanguage).length > 0 && (
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLocalTranslationLanguage !== null}
                onChange={onToggleTranslations}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">Enable Translation</span>
            </label>
          )}
          <div className="flex space-x-4 ml-auto">
            <button
              className="px-4 py-1  font-medium rounded-lg border border-gray-300 hover:bg-theme-background transition"
              onClick={onCloseCaptionStartWindow}
            >
              Cancel
            </button>
            <button
              id="uikit-caption-start-captions-from-modal"
              className="px-4 py-1 bg-blue-500 text-theme-text-button font-medium rounded-lg hover:bg-blue-600 transition"
              onClick={onStartCaptions}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </CommonPopper>
  );
};

export { StartCaptionsWindow };
