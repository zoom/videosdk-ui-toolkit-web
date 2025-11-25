import React from "react";
import { Check, ChevronLeft } from "lucide-react";
import { LANGUAGE_CODES } from "../caption-constant";

const menuStyles =
  "absolute bottom-full left-0 mb-2 w-72 rounded-lg shadow-lg z-20 text-gray-800 overflow-hidden bg-theme-surface border border-theme-border";
const buttonStyles = "w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-150 ease-in-out";

const SelectLanguageMenu = ({ languages, setShowLanguagesMenu, selectedLanguage, handleLanguageSelect }) => {
  return (
    <div className={menuStyles}>
      <div className="flex items-center p-2">
        <button
          className=" rounded-full hover:bg-theme-background/50 transition-colors duration-150 ease-in-out"
          onClick={() => setShowLanguagesMenu(false)}
        >
          <ChevronLeft size={24} className="text-theme-text" />
        </button>
        <h3 className="text-xl font-semibold ml-2 text-theme-text">Select Language</h3>
      </div>
      <div className="max-h-96 overflow-y-auto uikit-custom-scrollbar">
        {languages.map((lang) => (
          <button
            key={lang}
            className={`${buttonStyles} flex items-center text-theme-text hover:bg-theme-background justify-between`}
            onClick={() => {
              handleLanguageSelect(lang);
              setShowLanguagesMenu(false);
            }}
          >
            {LANGUAGE_CODES[lang]}
            {selectedLanguage === lang && <Check size={20} className="text-blue-500" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export const SelectLanguageMenuMobile = ({
  languages,
  setShowLanguagesMenu,
  selectedLanguage,
  handleLanguageSelect,
}) => {
  return (
    <div className="max-h-96 overflow-y-auto uikit-custom-scrollbar">
      {languages.map((lang) => (
        <button
          key={lang}
          className={`${buttonStyles} flex items-center justify-between`}
          onClick={() => {
            handleLanguageSelect(lang);
            setShowLanguagesMenu(false);
          }}
        >
          {LANGUAGE_CODES[lang]}
          {selectedLanguage === lang && <Check size={20} className="text-blue-500" />}
        </button>
      ))}
    </div>
  );
};

export default SelectLanguageMenu;
