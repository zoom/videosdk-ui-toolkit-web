import React from "react";
import { ChevronDown } from "lucide-react";
import { THEME_COLOR_CLASS } from "@/constant";
import { useTranslation } from "react-i18next";

export interface Playback {
  title: string;
  url: string;
}

interface CommonPlaybacksProps {
  label: string;
  playbacks: Playback[];
  selectedPlayback: string;
  selectedName: string;
  customFile: File | null;
  onPlaybackChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onCustomFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCustomFile: () => void;
  acceptedFormats: string;
  disabled?: boolean;
}

const CommonPlaybacks: React.FC<CommonPlaybacksProps> = ({
  label,
  playbacks,
  selectedPlayback,
  selectedName,
  customFile,
  onPlaybackChange,
  onCustomFileChange,
  onRemoveCustomFile,
  acceptedFormats,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const selectClass = `${THEME_COLOR_CLASS} w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none`;

  return (
    <div className="flex items-center">
      <label htmlFor={`${label.toLowerCase()}Select`} className="w-1/4 text-sm font-semibold">
        {t("settings.playback_select_label", { media: label })}
      </label>
      <div className="w-3/4 flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <select
            id={`${label.toLowerCase()}Select`}
            className={`${selectClass} flex-grow`}
            value={customFile ? "custom" : selectedPlayback}
            onChange={onPlaybackChange}
            disabled={disabled || !!customFile}
          >
            {playbacks.map((playback, index) => (
              <option key={`${label.toLowerCase()}-playback-${index}`} value={playback.url}>
                {playback.title}
              </option>
            ))}
            {customFile && <option value="custom">{t("settings.playback_custom_option", { media: label })}</option>}
          </select>
          <input
            type="file"
            accept={acceptedFormats}
            onChange={onCustomFileChange}
            className="hidden"
            id={`custom${label}File`}
            disabled={disabled}
          />
          {/* <label
            htmlFor={`custom${label}File`}
            className={`cursor-pointer bg-blue-500 text-theme-text-button px-2 py-1 rounded text-sm hover:bg-blue-600 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Upload
          </label>
          {customFile && !disabled && (
            <button
              onClick={onRemoveCustomFile}
              className="bg-red-500 text-theme-text-button px-2 py-1 rounded text-sm hover:bg-red-600"
            >
              Remove
            </button>
          )} */}
        </div>
        {/* {selectedName && <p className="text-sm text-gray-600">Selected: {selectedName}</p>} */}
      </div>
    </div>
  );
};

export default CommonPlaybacks;
