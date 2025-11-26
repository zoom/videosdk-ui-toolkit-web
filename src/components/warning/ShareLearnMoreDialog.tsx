import React from "react";
import { ZOOM_GLOBAL_IMAGE } from "../util/service";

const SHARE_INSTRUCTION_IMG_URL1 = `${ZOOM_GLOBAL_IMAGE}/av/share_disallow_image_1.png`;
const SHARE_INSTRUCTION_IMG_URL2 = `${ZOOM_GLOBAL_IMAGE}/av/share_disallow_image_2.png`;

const ShareLearnMoreDialog = ({ open, handleClose }) => {
  if (!open) return null;

  const SHARE_WARNING_DIALOG_TITLE = "Allow Screen Recording access in System Setting";
  const SHARE_WARNING_DIALOG_CONTENT1 = `In your device's System Preferences, give your web browser privacy permissions.`;
  const SHARE_WARNING_DIALOG_CONTENT2 = `You can click "Quit & Reopen".`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">{SHARE_WARNING_DIALOG_TITLE}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <p className="mb-2">1. {SHARE_WARNING_DIALOG_CONTENT1}</p>
          <p className="mb-2">2. {SHARE_WARNING_DIALOG_CONTENT2}</p>
          <img src={SHARE_INSTRUCTION_IMG_URL1} className="w-full h-auto" alt="permission instruction" />
          <img src={SHARE_INSTRUCTION_IMG_URL2} className="w-full h-auto" alt="permission instruction" />
        </div>
      </div>
    </div>
  );
};

export default ShareLearnMoreDialog;
