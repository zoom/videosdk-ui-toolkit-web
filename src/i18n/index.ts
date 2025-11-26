import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LangEn from "./en-US.json";
// import LangDe from './de-DE.json';
// import LangES from './es-ES.json';
// import LangFr from './fr-FR.json';
// import LangJp from './jp-JP.json';
// import LangPt from './pt-PT.json';
// import LangRu from './ru-RU.json';
// import LangZhCN from './zh-CN.json';
// import LangZhTW from './zh-TW.json';
// import LangKo from './ko-KO.json';
// import LangVi from './vi-VN.json';
// import LangIt from './it-IT.json';
// import LangPl from './pl-PL.json';
// import LangTr from './tr-TR.json';
// import LangId from './id-ID.json';
// import LangNL from './nl-NL.json';
// import LangSV from './sv-SE.json';

const resources = {
  "en-US": {
    translation: LangEn,
  },
  // 'de-DE': {
  //   translation: LangDe
  // },
  // 'es-ES': {
  //   translation: LangES
  // },
  // 'fr-FR': {
  //   translation: LangFr
  // },
  // 'jp-JP': {
  //   translation: LangJp
  // },
  // 'pt-PT': {
  //   translation: LangPt
  // },
  // 'ru-RU': {
  //   translation: LangRu
  // },
  // 'zh-CN': {
  //   translation: LangZhCN
  // },
  // 'zh-TW': {
  //   translation: LangZhTW
  // },
  // 'ko-KO': {
  //   translation: LangKo
  // },
  // 'vi-VN': {
  //   translation: LangVi
  // },
  // 'it-IT': {
  //   translation: LangIt
  // },
  // 'pl-PL': {
  //   translation: LangPl
  // },
  // 'tr-TR': {
  //   translation: LangTr
  // },
  // 'id-ID': {
  //   translation: LangId
  // },
  // 'nl-NL': {
  //   translation: LangNL
  // },
  // 'sv-SE': {
  //   translation: LangSV
  // }
};
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en-US",
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
    react: {
      bindI18nStore: "added",
    },
  });

export default i18n;
