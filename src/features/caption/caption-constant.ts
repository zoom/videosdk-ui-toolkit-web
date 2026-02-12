import { LiveTranscriptionLanguage } from "@zoom/videosdk";

const reverseLiveTranscriptionLanguage = (obj: Record<string, string>): Record<string, string> => {
  const reversed: Record<string, string> = {};
  Object.entries(obj).forEach(([name, code]) => {
    reversed[code] = name;
  });
  return reversed;
};

/**
 * LiveTranscriptionLanguage => { 'Arabic (Gulf)': 'ar-gulf' }
 * LANGUAGE_CODES => { 'ar-gulf': 'Arabic (Gulf)' }
 */
export const LANGUAGE_CODES = reverseLiveTranscriptionLanguage(LiveTranscriptionLanguage);
/**
 * Mapping from language codes to i18n translation keys
 * Used for displaying localized language names in the UI
 */
export const LANGUAGE_CODE_TO_I18N_KEY: Record<string, string> = {
  af: "language.afrikaans",
  ar: "language.arabic",
  "ar-gulf": "language.arabic_gulf",
  "ar-msa": "language.arabic_modern_standard",
  "ar-sy": "language.arabic_syrian",
  bn: "language.bengali",
  "zh-yue": "language.cantonese",
  ca: "language.catalan",
  zh: "language.chinese_simplified",
  "zh-hant": "language.chinese_traditional",
  hr: "language.croatian",
  cs: "language.czech",
  da: "language.danish",
  nl: "language.dutch",
  en: "language.english",
  et: "language.estonian",
  fi: "language.finnish",
  fr: "language.french",
  "fr-ca": "language.french_canadian",
  gl: "language.galician",
  de: "language.german",
  "de-ch": "language.german_switzerland",
  el: "language.greek",
  he: "language.hebrew",
  hi: "language.hindi",
  hu: "language.hungarian",
  id: "language.indonesian",
  it: "language.italian",
  ja: "language.japanese",
  ko: "language.korean",
  lv: "language.latvian",
  ms: "language.malay",
  no: "language.norwegian",
  fa: "language.persian",
  pl: "language.polish",
  pt: "language.portuguese",
  ro: "language.romanian",
  ru: "language.russian",
  sr: "language.serbian",
  sk: "language.slovak",
  so: "language.somali",
  es: "language.spanish",
  sv: "language.swedish",
  tl: "language.tagalog",
  ta: "language.tamil",
  te: "language.telugu",
  th: "language.thai",
  tr: "language.turkish",
  uk: "language.ukrainian",
  vi: "language.vietnamese",
  zu: "language.zulu",
};

/**
 * Get the localized language name for a given language code
 * Falls back to LANGUAGE_CODES (English name) if no i18n key is found
 * @param langCode - The language code (e.g., 'en', 'zh', 'ar-gulf')
 * @param t - The translation function from useTranslation()
 * @returns The localized language name
 */
export const getLocalizedLanguageName = (langCode: string, t: (key: string) => string): string => {
  const i18nKey = LANGUAGE_CODE_TO_I18N_KEY[langCode];
  if (i18nKey) {
    return t(i18nKey);
  }
  // Fallback to the original English name from LANGUAGE_CODES
  return LANGUAGE_CODES[langCode] || langCode;
};
