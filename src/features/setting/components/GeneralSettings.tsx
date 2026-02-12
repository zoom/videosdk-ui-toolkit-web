import React, { useEffect, useState } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import Select, { SingleValue } from "react-select";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setThemeName, setLanguage } from "@/store/uiSlice";
import i18n, { resources } from "@/i18n";

interface LanguageOption {
  value: string;
  label: string;
}

const GeneralSettings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { themeName: theme, language, languageList } = useAppSelector(useSessionUISelector);

  useEffect(() => {
    document.documentElement.setAttribute("zoom-data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const themes = [
    { name: "light", label: t("settings.theme_light"), icon: <Sun size={18} /> },
    { name: "dark", label: t("settings.theme_dark"), icon: <Moon size={18} /> },
    { name: "blue", label: t("settings.theme_blue"), icon: <Palette size={18} /> },
    { name: "green", label: t("settings.theme_green"), icon: <Palette size={18} /> },
  ];

  // Use languageList from Redux state if available, otherwise fall back to resources
  const availableLanguages = languageList.length > 0 ? languageList : Object.keys(resources);

  // Filter to only include languages that have translation resources
  // const languagesWithResources = availableLanguages.filter((lang) => i18n.hasResourceBundle(lang, "translation"));

  const languageOptions: LanguageOption[] = availableLanguages.map((key) => {
    return { value: key, label: t(`settings.language.${key}`) };
  }) as LanguageOption[];

  const selectedLanguage = languageOptions.find((option) => option.value === language) || languageOptions[0];

  const handleLanguageChange = (option: SingleValue<LanguageOption>) => {
    if (option) {
      dispatch(setLanguage(option.value));
    }
  };

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      minWidth: "200px",
      backgroundColor: "var(--zoom-color-surface)",
      borderColor: "var(--zoom-color-border)",
      "&:hover": {
        borderColor: "var(--zoom-color-primary)",
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "var(--zoom-color-surface)",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--zoom-color-primary)"
        : state.isFocused
          ? "var(--zoom-color-background)"
          : "var(--zoom-color-surface)",
      color: state.isSelected ? "var(--zoom-color-background)" : "var(--zoom-color-text)",
      "&:hover": {
        backgroundColor: state.isSelected ? "var(--zoom-color-primary)" : "var(--zoom-color-background)",
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "var(--zoom-color-text)",
    }),
    input: (base: any) => ({
      ...base,
      color: "var(--zoom-color-text)",
    }),
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-theme-text text-lg font-medium">{t("settings.theme_title")}</h3>
          <div className="flex gap-3">
            {themes.map(({ name, label, icon }) => (
              <div key={name} className="justify-center">
                <button
                  onClick={() => {
                    dispatch(setThemeName(name));
                  }}
                  className={`
                  flex items-center justify-center
                  w-10 h-10 rounded-lg
                  transition-all duration-200
                  ${
                    theme === name
                      ? "bg-theme-primary text-theme-background shadow-md"
                      : "bg-theme-surface hover:bg-theme-background text-theme-text hover:shadow-sm"
                  }
                `}
                  title={label}
                  aria-label={label}
                  aria-pressed={theme === name}
                >
                  {icon}
                </button>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-theme-text text-lg font-medium">{t("settings.language_title")}</h3>
          <Select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            options={languageOptions}
            styles={customSelectStyles}
            isSearchable={true}
            maxMenuHeight={230}
            classNamePrefix="uikit-custom-scrollbar"
            aria-label={t("settings.language_title")}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
