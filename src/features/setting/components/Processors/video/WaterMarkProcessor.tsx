import React, { useState, useEffect, useCallback, useRef } from "react";
import { Settings, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProcessorOperations } from "@/hooks/useProcessorOperations";
import { useAppSelector, useSessionUISelector, useSessionSelector } from "@/hooks/useAppSelector";

type ProcessorInfo = {
  isVideoOn: boolean;
};

function WatermarkProcessor({ isVideoOn }: ProcessorInfo) {
  const { t } = useTranslation();
  const {
    handleAddProcessor,
    handleRemoveProcessor,
    isLoading,
    isActive,
    hasActiveProcessor,
    getActiveProcessorInstance,
  } = useProcessorOperations("video");

  // Get processor config from session
  const {
    config: {
      featuresOptions: {
        rawData: { video: videoConfig },
      },
    },
  } = useAppSelector(useSessionSelector);

  const isProcessorActive = videoConfig ? isActive(videoConfig.name) : false;
  const isProcessorLoading = videoConfig ? isLoading(videoConfig.name) : false;

  // Check if any other video processor is active (same-type exclusion only)
  const hasOtherProcessorActive = hasActiveProcessor() && !isProcessorActive;

  // Create a properly positioned watermark for the processor
  const createPositionedWatermark = useCallback(async (imageUrl: string, options: any): Promise<ImageBitmap> => {
    // Load the original Zoom logo
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const originalImage = await createImageBitmap(blob);

    // Create a full-sized transparent canvas (typical video dimensions)
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    // Clear canvas - this creates a transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get positioning options
    const scale = options.scale || 0.2;
    const opacity = options.opacity || 0.7;
    const position = options.position || "bottom-right";

    // Calculate scaled watermark size
    const watermarkWidth = originalImage.width * scale;
    const watermarkHeight = originalImage.height * scale;

    // Calculate position based on the setting
    let x = 0;
    let y = 0;
    const padding = 10;

    switch (position) {
      case "top-left":
        x = padding;
        y = padding;
        break;
      case "top-right":
        x = canvas.width - watermarkWidth - padding;
        y = padding;
        break;
      case "bottom-left":
        x = padding;
        y = canvas.height - watermarkHeight - padding;
        break;
      case "bottom-right":
      default:
        x = canvas.width - watermarkWidth - padding;
        y = canvas.height - watermarkHeight - padding;
        break;
    }

    // Draw the watermark at the calculated position with opacity
    ctx.globalAlpha = opacity;
    ctx.drawImage(originalImage, x, y, watermarkWidth, watermarkHeight);
    ctx.globalAlpha = 1.0; // Reset opacity

    // Convert the positioned canvas to ImageBitmap
    return createImageBitmap(canvas);
  }, []);

  // Start processor
  const startProcessor = useCallback(async () => {
    if (!isVideoOn || !videoConfig) return;

    try {
      // Create and add processor (this will automatically remove any existing processor)
      await handleAddProcessor(videoConfig);

      // Create and send the positioned watermark to the processor
      if (videoConfig.options?.watermarkUrl) {
        try {
          const positionedWatermark = await createPositionedWatermark(
            videoConfig.options.watermarkUrl,
            videoConfig.options,
          );

          // Get the processor instance and send the positioned watermark
          const processor = await getActiveProcessorInstance(videoConfig.name);
          if (processor?.port) {
            processor.port.postMessage({
              cmd: "update_watermark_image",
              data: positionedWatermark,
            });
            // eslint-disable-next-line no-console
            console.log("Positioned Zoom logo created and sent to processor");
          } else {
            // eslint-disable-next-line no-console
            console.warn("Processor instance or port not available");
          }
        } catch (imageError) {
          // eslint-disable-next-line no-console
          console.error("Failed to create or send positioned watermark:", imageError);
        }
      }

      // eslint-disable-next-line no-console
      console.log("Watermark processor started successfully");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to start processor:", error);
    }
  }, [isVideoOn, videoConfig, handleAddProcessor, createPositionedWatermark, getActiveProcessorInstance]);

  // Stop processor
  const stopProcessor = useCallback(async () => {
    if (!isProcessorActive || !videoConfig) {
      return;
    }

    try {
      await handleRemoveProcessor(videoConfig.name);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Failed to remove processor:", error);
    }
  }, [handleRemoveProcessor, isProcessorActive, videoConfig]);

  useEffect(() => {
    if (!isVideoOn && isProcessorActive) {
      stopProcessor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoOn, isProcessorActive]); // stopProcessor intentionally omitted to prevent infinite loops

  // Get the processor title from config
  const processorTitle = videoConfig?.title || t("processor.watermark_title");

  // Don't render if config is not available
  if (!videoConfig) {
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
            disabled={!isVideoOn || isProcessorActive || isProcessorLoading || hasOtherProcessorActive}
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

export default WatermarkProcessor;
