import React, { useEffect, useCallback } from "react";
import { Settings, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProcessorOperations } from "@/hooks/useProcessorOperations";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";

type ProcessorInfo = {
  isAudioOn: boolean;
};

function WhiteNoiseProcessor({ isAudioOn }: ProcessorInfo) {
  const { t } = useTranslation();
  const { handleAddProcessor, handleRemoveProcessor, isLoading, isActive, hasActiveProcessor } =
    useProcessorOperations("audio");

  // Get processor config from session
  const {
    config: {
      featuresOptions: {
        rawData: { audio: audioConfig },
      },
    },
  } = useAppSelector(useSessionSelector);

  const isProcessorActive = audioConfig ? isActive(audioConfig.name) : false;
  const isProcessorLoading = audioConfig ? isLoading(audioConfig.name) : false;

  // Check if any other audio processor is active (same-type exclusion only)
  const hasOtherProcessorActive = hasActiveProcessor() && !isProcessorActive;

  const startProcessor = useCallback(async () => {
    if (!isAudioOn || !audioConfig) return;

    try {
      await handleAddProcessor(audioConfig);

      // eslint-disable-next-line no-console
      console.log("White noise processor started successfully");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to start processor:", error);
    }
  }, [isAudioOn, audioConfig, handleAddProcessor]);

  const stopProcessor = useCallback(async () => {
    if (!isProcessorActive || !audioConfig) {
      return;
    }

    try {
      await handleRemoveProcessor(audioConfig.name);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Failed to remove processor:", error);
    }
  }, [handleRemoveProcessor, isProcessorActive, audioConfig]);

  useEffect(() => {
    if (!isAudioOn && isProcessorActive) {
      stopProcessor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudioOn, isProcessorActive]); // stopProcessor intentionally omitted to prevent infinite loops

  // Get the processor title from config
  const processorTitle = audioConfig?.title || t("processor.white_noise_title");

  // Don't render if config is not available
  if (!audioConfig) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">{processorTitle}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isProcessorActive ? "bg-green-500 animate-pulse" : "bg-gray-400 dark:bg-gray-500"
              }`}
            />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {isProcessorActive ? t("processor.status_active") : t("processor.status_inactive")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={startProcessor}
            disabled={!isAudioOn || isProcessorActive || isProcessorLoading || hasOtherProcessorActive}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 transition-colors"
          >
            <Settings className="w-4 h-4" />
            {isProcessorLoading
              ? t("processor.button_starting")
              : hasOtherProcessorActive
                ? t("processor.button_other_active")
                : t("processor.button_start")}
          </button>

          <button
            onClick={stopProcessor}
            disabled={!isProcessorActive || isProcessorLoading}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Square className="w-4 h-4" />
            {isProcessorLoading ? t("processor.button_stopping") : t("processor.button_stop")}
          </button>
        </div>
      </div>
    </>
  );
}

export default WhiteNoiseProcessor;
