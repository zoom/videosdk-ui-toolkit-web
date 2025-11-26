import { useCallback, useContext, useState } from "react";
import { useAppDispatch, useAppSelector, useCaptionSelector } from "@/hooks/useAppSelector";
import { setCurrentSpeakingLanguage, setCurrentTranslationLanguage } from "../captionSlice";
import sessionAdditionalContext from "@/context/session-additional-context";
import { setIsShowStartCaptionsWindow } from "@/store/uiSlice";
import { enqueueSnackbar } from "notistack";

const useCaptionMenuLogic = (setIsMenuOpen) => {
  const { captionClient } = useContext(sessionAdditionalContext);
  const dispatch = useAppDispatch();
  const { isTranslationFeatureEnabled, isTranscriptionInitiated, currentSpeakingLanguage, currentTranslationLanguage } =
    useAppSelector(useCaptionSelector);

  const [showSpeakingLanguagesMenu, setShowSpeakingLanguagesMenu] = useState(false);
  const [showTranslateLanguagesMenu, setShowTranslateLanguagesMenu] = useState(false);

  const getSpeakingLanguagesList = useCallback(() => {
    if (!captionClient) return [];
    const { transcriptionLanguage } = captionClient.getLiveTranscriptionStatus();
    if (!transcriptionLanguage) return [];
    return transcriptionLanguage.split(";").filter(Boolean);
  }, [captionClient]);

  const getTranslationLanguagesList = useCallback(
    (speakingLanguage) => {
      if (!captionClient) return [];
      const { translationLanguage } = captionClient.getLiveTranscriptionStatus();
      if (!translationLanguage) return [];
      const languageObj = translationLanguage.find((language) => language.speakingLanguage === speakingLanguage);
      return languageObj ? languageObj.translatedToLanguage.split(";").filter(Boolean) : [];
    },
    [captionClient],
  );

  const handleSpeakingLanguageSelect = useCallback(
    async (language) => {
      if (!isTranscriptionInitiated) {
        dispatch(setIsShowStartCaptionsWindow(true));
        setIsMenuOpen(false);
        return;
      }

      dispatch(setCurrentTranslationLanguage(undefined));
      dispatch(setCurrentSpeakingLanguage(language));

      if (isTranslationFeatureEnabled) {
        try {
          await captionClient?.setTranslationLanguage(undefined);
        } catch (error) {
          dispatch(setCurrentTranslationLanguage(currentTranslationLanguage));
          dispatch(setCurrentSpeakingLanguage(currentSpeakingLanguage));
          enqueueSnackbar(error.reason, {
            variant: "error",
            autoHideDuration: 5000,
          });
          return;
        }
      }

      try {
        await captionClient?.setSpeakingLanguage(language);
      } catch (error) {
        dispatch(setCurrentSpeakingLanguage(currentSpeakingLanguage));
        enqueueSnackbar(error.reason, {
          variant: "error",
          autoHideDuration: 5000,
        });
      }
    },
    [
      isTranscriptionInitiated,
      dispatch,
      isTranslationFeatureEnabled,
      setIsMenuOpen,
      captionClient,
      currentTranslationLanguage,
      currentSpeakingLanguage,
    ],
  );

  const handleTranslateToLanguageSelect = useCallback(
    async (language) => {
      dispatch(setCurrentTranslationLanguage(language));
      try {
        await captionClient?.setTranslationLanguage(language);
      } catch (error) {
        dispatch(setCurrentTranslationLanguage(currentTranslationLanguage));
        enqueueSnackbar(error.reason, {
          variant: "error",
          autoHideDuration: 5000,
        });
      }
    },
    [captionClient, currentTranslationLanguage, dispatch],
  );

  const toggleIsTranslationOn = useCallback(async () => {
    if (!isTranscriptionInitiated) {
      dispatch(setIsShowStartCaptionsWindow(true));
      setIsMenuOpen(false);
      return;
    }

    if (currentTranslationLanguage !== undefined) {
      try {
        dispatch(setCurrentTranslationLanguage(undefined));
        await captionClient?.setTranslationLanguage(undefined); // turn off translations
      } catch (error) {
        dispatch(setCurrentTranslationLanguage(currentTranslationLanguage));
        enqueueSnackbar(error.reason, {
          variant: "error",
          autoHideDuration: 5000,
        });
      }
    } else {
      try {
        dispatch(setCurrentTranslationLanguage(getTranslationLanguagesList(currentSpeakingLanguage)[0]));
        await captionClient?.setTranslationLanguage(getTranslationLanguagesList(currentSpeakingLanguage)[0]);
      } catch (error) {
        dispatch(setCurrentTranslationLanguage(undefined));
        enqueueSnackbar(error.reason, {
          variant: "error",
          autoHideDuration: 5000,
        });
      }
    }
  }, [
    captionClient,
    currentSpeakingLanguage,
    currentTranslationLanguage,
    dispatch,
    getTranslationLanguagesList,
    isTranscriptionInitiated,
    setIsMenuOpen,
  ]);

  return {
    isTranslationFeatureEnabled,
    isTranscriptionInitiated,
    currentSpeakingLanguage,
    currentTranslationLanguage,
    showSpeakingLanguagesMenu,
    showTranslateLanguagesMenu,
    setShowSpeakingLanguagesMenu,
    setShowTranslateLanguagesMenu,
    getSpeakingLanguagesList,
    getTranslationLanguagesList,
    handleSpeakingLanguageSelect,
    handleTranslateToLanguageSelect,
    toggleIsTranslationOn,
  };
};

export default useCaptionMenuLogic;
