import React from "react";
import { useTranslation } from "react-i18next";

import { isChrome, isMobileDevice, isSafari, ZOOM_GLOBAL_IMAGE } from "../util/service";
import { isAndroidBrowser } from "../util/platform";

const INSTRUCTION_IMG_URL = `${ZOOM_GLOBAL_IMAGE}/av/chrome-operation.jpg`;
const SAFARI_INSTRUCTION_IMG_URL1 = `${ZOOM_GLOBAL_IMAGE}/av/safari-operation1.png`;
const SAFARI_INSTRUCTION_IMG_URL2 = `${ZOOM_GLOBAL_IMAGE}/av/safari-operation2.png`;
const IOS_INSTRUCTION_IMG_ASK_URL = `${ZOOM_GLOBAL_IMAGE}/av/ios/ios-permission-ask.png`;
const ANDROID_INSTRUCTION_IMG_ASK_URL = `${ZOOM_GLOBAL_IMAGE}/av/android/android-permission-ask.png`;
const ANDROID_INSTRUCTION_IMG_URL1 = `${ZOOM_GLOBAL_IMAGE}/av/android/android-permission-1.png`;
const ANDROID_INSTRUCTION_IMG_URL2 = `${ZOOM_GLOBAL_IMAGE}/av/android/android-permission-2.png`;
const ANDROID_INSTRUCTION_IMG_URL3 = `${ZOOM_GLOBAL_IMAGE}/av/android/android-permission-3.png`;

const AVLearnMoreDialog = ({ open, handleClose }) => {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center text-black ">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">{t("how_to_allow")}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto uikit-custom-scrollbar">
          {!isMobileDevice() && (
            <>
              <p className="mb-2">1. {t("click_address_bar")}</p>
              <p className="mb-2">2. {t("click_microphone_camera_option")}</p>
              <p className="mb-4">3. {t("select_allow")}</p>
            </>
          )}
          {!isMobileDevice() && isChrome() && (
            <img src={INSTRUCTION_IMG_URL} className="w-full h-auto" alt="permission instruction" />
          )}
          {!isMobileDevice() && isSafari() && (
            <>
              <img src={SAFARI_INSTRUCTION_IMG_URL1} className="w-full h-auto" alt="permission instruction" />
              <img src={SAFARI_INSTRUCTION_IMG_URL2} className="w-full h-auto" alt="permission instruction" />
            </>
          )}
          {isMobileDevice() && isAndroidBrowser() && (
            <>
              <p className="mb-2">1. Allow when asked for microphone and camera access</p>
              <img src={ANDROID_INSTRUCTION_IMG_ASK_URL} className="w-full h-auto" alt="permission instruction" />
              <p className="mb-2">2. If not allowed, go to Settings and allow access</p>
              <img src={ANDROID_INSTRUCTION_IMG_URL1} className="w-full h-auto" alt="permission instruction" />
              <img src={ANDROID_INSTRUCTION_IMG_URL2} className="w-full h-auto" alt="permission instruction" />
              <img src={ANDROID_INSTRUCTION_IMG_URL3} className="w-full h-auto" alt="permission instruction" />
            </>
          )}
          {isMobileDevice() && isSafari() && (
            <>
              <img src={IOS_INSTRUCTION_IMG_ASK_URL} className="w-full h-auto" alt="permission instruction" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AVLearnMoreDialog;
