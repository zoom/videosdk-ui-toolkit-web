import { ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";

import { LANGUAGE_CODES } from "../caption-constant";
import SelectLanguageMenu from "./SelectLanguageMenu";
import { setIsShowStartCaptionsWindow } from "@/store/uiSlice";
import useCaptionMenuLogic from "../hooks/useCaptionMenuLogic";

const menuStyles =
  "absolute bottom-full left-0 mb-1 w-72 rounded-lg shadow-lg z-30 bg-theme-surface border border-theme-border text-theme-text overflow-hidden";

const dividerStyles = "border-b border-theme-border";
const headerStyles = `text-xl font-semibold px-3 pt-2 pb-1 text-theme-text ${dividerStyles}`;
const buttonStyles =
  "w-full px-3 py-2.5 text-left hover:bg-theme-background transition-colors duration-200 flex items-center gap-3 text-sm";
const buttonStylesWithDivider = `${buttonStyles} ${dividerStyles}`;

export const CaptionMenu = ({ setIsMenuOpen, onViewTranscript, onCaptionSettings }) => {
  const dispatch = useAppDispatch();
  const { isHost } = useAppSelector(useSessionSelector);
  const {
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
  } = useCaptionMenuLogic(setIsMenuOpen);

  if (showSpeakingLanguagesMenu) {
    return (
      <SelectLanguageMenu
        languages={getSpeakingLanguagesList()}
        setShowLanguagesMenu={setShowSpeakingLanguagesMenu}
        selectedLanguage={currentSpeakingLanguage}
        handleLanguageSelect={handleSpeakingLanguageSelect}
      />
    );
  }

  if (isTranslationFeatureEnabled && showTranslateLanguagesMenu) {
    return (
      <SelectLanguageMenu
        languages={getTranslationLanguagesList(currentSpeakingLanguage)}
        setShowLanguagesMenu={setShowTranslateLanguagesMenu}
        selectedLanguage={currentTranslationLanguage}
        handleLanguageSelect={handleTranslateToLanguageSelect}
      />
    );
  }

  return (
    <div id="uikit-caption-menu" className={menuStyles}>
      <div className="py-1 px-2">
        <h3 className={headerStyles}>Captions</h3>

        <button
          id="uikit-caption-menu-speaking-language"
          className={buttonStylesWithDivider}
          onClick={() => {
            if (!isTranscriptionInitiated) {
              dispatch(setIsShowStartCaptionsWindow(true));
              setIsMenuOpen(false);
              return;
            }
            setShowSpeakingLanguagesMenu(true);
          }}
        >
          <div className="flex-1">
            <div className="text-theme-text/70">Speaking language</div>
            <div className="font-medium">{LANGUAGE_CODES[currentSpeakingLanguage]}</div>
          </div>
          <ChevronRight size={16} className="text-theme-text/50" />
        </button>

        {currentTranslationLanguage !== undefined && (
          <button
            id="uikit-caption-menu-translate-language"
            className={buttonStylesWithDivider}
            onClick={() => setShowTranslateLanguagesMenu(true)}
          >
            <div className="flex-1">
              <div className="text-theme-text/70">Translate to</div>
              <div className="font-medium">{LANGUAGE_CODES[currentTranslationLanguage]}</div>
            </div>
            <ChevronRight size={16} className="text-theme-text/50" />
          </button>
        )}

        <button
          id="uikit-caption-menu-transcript"
          className={
            isHost ? buttonStylesWithDivider : isTranslationFeatureEnabled ? buttonStylesWithDivider : buttonStyles
          }
          onClick={onViewTranscript}
        >
          View full transcript
        </button>

        {isTranslationFeatureEnabled && getTranslationLanguagesList(currentSpeakingLanguage).length > 0 && (
          <button
            id="uikit-caption-menu-toggle-translation"
            className={isHost ? buttonStylesWithDivider : buttonStyles}
            onClick={toggleIsTranslationOn}
          >
            {currentTranslationLanguage !== undefined ? "Turn off translation" : "Turn on translation"}
          </button>
        )}

        {isHost && (
          <button id="uikit-caption-menu-host-settings" className={buttonStyles} onClick={onCaptionSettings}>
            Host caption control settings
          </button>
        )}
      </div>
    </div>
  );
};

export default CaptionMenu;
