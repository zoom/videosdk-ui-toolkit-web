import React, { useState, useEffect, useCallback, useRef } from "react";
import { Settings, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProcessorOperations } from "@/hooks/useProcessorOperations";
import { useAppSelector, useSessionUISelector, useSessionSelector } from "@/hooks/useAppSelector";

type ProcessorInfo = {
  isSharing: boolean;
};

function PiiMaskProcessor({ isSharing }: ProcessorInfo) {
  const { t } = useTranslation();
  const { handleAddProcessor, handleRemoveProcessor, isLoading, isActive, hasActiveProcessor } =
    useProcessorOperations("share");

  // Get processor config from session
  const {
    config: {
      featuresOptions: {
        rawData: { share: shareConfig },
      },
    },
  } = useAppSelector(useSessionSelector);

  const isProcessorActiveFromStore = shareConfig ? isActive(shareConfig.name) : false;
  const [localProcessorActive, setLocalProcessorActive] = useState(false);

  const isProcessorActive = isProcessorActiveFromStore || localProcessorActive;

  // Track if cleanup is in progress to prevent race conditions
  const cleanupInProgress = useRef(false);
  const isProcessorLoading = shareConfig ? isLoading(shareConfig.name) : false;

  // Check if any other share processor is active (same-type exclusion only)
  const hasOtherProcessorActive = hasActiveProcessor() && !isProcessorActive;

  useEffect(() => {
    setLocalProcessorActive(isProcessorActiveFromStore);
  }, [isProcessorActiveFromStore]);

  // Start processor
  const startProcessor = useCallback(async () => {
    if (!isSharing || !shareConfig) return;

    try {
      setLocalProcessorActive(true);
      await handleAddProcessor(shareConfig);

      cleanupInProgress.current = false;

      // eslint-disable-next-line no-console
      console.log("PII processor started successfully");
    } catch (error) {
      // Reset local state on error
      setLocalProcessorActive(false);
      // eslint-disable-next-line no-console
      console.error("Failed to start processor:", error);
    }
  }, [isSharing, shareConfig, handleAddProcessor]);

  const stopProcessor = useCallback(async () => {
    if (!isProcessorActive || cleanupInProgress.current || !shareConfig) {
      return;
    }

    cleanupInProgress.current = true;

    try {
      setLocalProcessorActive(false);

      await handleRemoveProcessor(shareConfig.name);
      // eslint-disable-next-line no-console
      console.log("PII processor stopped successfully");
    } catch (error: any) {
      if (
        error?.reason?.includes("Processor not found") ||
        error?.message?.includes("not found") ||
        error?.reason?.includes("INVALID_PARAMETERS")
      ) {
        setLocalProcessorActive(false);
      } else {
        setLocalProcessorActive(isProcessorActiveFromStore);
      }
    } finally {
      cleanupInProgress.current = false;
    }
  }, [handleRemoveProcessor, isProcessorActive, isProcessorActiveFromStore, shareConfig]);

  useEffect(() => {
    if (!isSharing && isProcessorActive && !cleanupInProgress.current) {
      stopProcessor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSharing, isProcessorActive]); // stopProcessor intentionally omitted to prevent infinite loops

  // Get the processor title from config
  const processorTitle = shareConfig?.title || t("processor.pii_mask_title");

  // Don't render if config is not available
  if (!shareConfig) {
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
            disabled={!isSharing || isProcessorActive || isProcessorLoading || hasOtherProcessorActive}
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

export default PiiMaskProcessor;
