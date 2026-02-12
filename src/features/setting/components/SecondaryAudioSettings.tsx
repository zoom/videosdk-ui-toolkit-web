import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { useDevice } from "@/features/setting/hooks/useDevice";
import { ChevronDown } from "lucide-react";
import { isSupportSecondMicrophone } from "@/components/util/service";
import { useCurrentUser } from "@/features/participant/hooks";
import { THEME_COLOR_CLASS } from "@/constant";
import { useSnackbar } from "notistack";
import { setActiveSecondaryMicrophone, setSelectedSecondaryMicrophone } from "@/store/uiSlice";

const SecondaryAudioSettings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { activeSecondaryMicrophone, selectedSecondaryMicrophone, noiseCancellationOptions, activeMicrophone } =
    useAppSelector(useSessionUISelector);
  const { microphoneList, startSecondaryAudio, stopSecondaryAudio, updateNoiseCancellationOptions } = useDevice();
  const currentUser = useCurrentUser();
  const isJoinedAudio = currentUser?.audio !== "";
  const { enqueueSnackbar } = useSnackbar();
  const [isUpdatingOptions, setIsUpdatingOptions] = useState(false);

  const noiseOptions = [
    { key: "autoGainControl", label: t("settings.secondary_mic_agc") },
    { key: "noiseSuppression", label: t("settings.secondary_mic_noise_suppression") },
    { key: "echoCancellation", label: t("settings.secondary_mic_echo_cancellation") },
  ] as const;

  const handleSecondMicrophoneChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = event.target.value;
    dispatch(setSelectedSecondaryMicrophone(deviceId || null));

    if (!deviceId) {
      await stopSecondaryAudio();
    }
  };

  const handleSecondMicrophoneToggle = async () => {
    try {
      if (activeSecondaryMicrophone) {
        await stopSecondaryAudio();
        dispatch(setActiveSecondaryMicrophone(false));
      } else if (selectedSecondaryMicrophone) {
        await startSecondaryAudio(selectedSecondaryMicrophone, noiseCancellationOptions);
        dispatch(setActiveSecondaryMicrophone(true));
      }
    } catch (error: any) {
      enqueueSnackbar(error?.reason || "An error occurred", {
        variant: "error",
      });
    }
  };

  const handleNoiseCancellationChange = async (option: keyof typeof noiseCancellationOptions) => {
    try {
      await updateNoiseCancellationOptions(
        option,
        selectedSecondaryMicrophone,
        noiseCancellationOptions,
        setIsUpdatingOptions,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating noise cancellation options:", error);
    }
  };
  const availableSecondMicrophones = useMemo(() => {
    return microphoneList.filter((mic) => mic.deviceId !== activeMicrophone && mic.deviceId !== "default");
  }, [microphoneList, activeMicrophone]);

  const selectClass = `${THEME_COLOR_CLASS} w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none`;

  return (
    <div className={`${THEME_COLOR_CLASS}`}>
      {isSupportSecondMicrophone(isJoinedAudio) ? (
        <div className="space-y-4">
          {/* Second Microphone Selection */}
          <div className="flex items-center">
            <label htmlFor="secondMicrophone" className="w-1/4 text-sm font-medium ">
              {t("settings.secondary_mic_label")}
            </label>
            <div className="w-3/4 flex gap-2">
              <div className="relative flex-1">
                <select
                  id="uikit-secondary-microphone-select"
                  value={selectedSecondaryMicrophone || ""}
                  onChange={handleSecondMicrophoneChange}
                  className={selectClass}
                >
                  <option value="" id="uikit-secondary-microphone-default-option">
                    {t("settings.secondary_mic_select")}
                  </option>
                  {availableSecondMicrophones.map((mic) => (
                    <option
                      key={mic.deviceId}
                      value={mic.deviceId}
                      id={`uikit-secondary-microphone-option-${mic.label}`}
                    >
                      {mic.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
                  <ChevronDown size={16} />
                </div>
              </div>
              <button
                id="uikit-secondary-microphone-toggle"
                onClick={handleSecondMicrophoneToggle}
                disabled={!selectedSecondaryMicrophone || isUpdatingOptions}
                className={`px-3 py-2 text-sm rounded-md w-20 flex items-center justify-center ${
                  activeSecondaryMicrophone
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isUpdatingOptions ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : activeSecondaryMicrophone ? (
                  t("settings.secondary_mic_stop")
                ) : (
                  t("settings.secondary_mic_start")
                )}
              </button>
            </div>
          </div>

          {/* Noise Cancellation Options */}
          <div className="flex items-center">
            <label id="uikit-noise-cancellation-label" className="w-1/4 text-sm font-medium">
              {t("settings.secondary_mic_noise_cancellation")}
            </label>
            <div className="w-3/4 space-y-2">
              {noiseOptions.map(({ key, label }) => (
                <div key={key} className="flex items-center" id={`uikit-noise-cancellation-option-container`}>
                  <input
                    type="checkbox"
                    id={`uikit-noise-cancellation-${key}-checkbox`}
                    checked={noiseCancellationOptions[key as keyof typeof noiseCancellationOptions]}
                    onChange={() => handleNoiseCancellationChange(key as keyof typeof noiseCancellationOptions)}
                    disabled={isUpdatingOptions}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label
                    htmlFor={`uikit-noise-cancellation-${key}-checkbox`}
                    id={`uikit-noise-cancellation-${key}-label`}
                    className={`ml-2 block text-sm ${isUpdatingOptions ? "opacity-50" : ""}`}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-sm ">{t("settings.secondary_mic_not_supported")}</span>
        </div>
      )}
    </div>
  );
};

export default SecondaryAudioSettings;
