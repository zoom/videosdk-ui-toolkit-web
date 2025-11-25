import React, { useState, useMemo, useCallback } from "react";
import { PiiMaskProcessor, WatermarkProcessor, WhiteNoiseProcessor } from "./Processors";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import CommonTab from "@/components/widget/CommonTab";
import { useTranslation } from "react-i18next";

const enum ProcessorTabs {
  AUDIO = "audio",
  VIDEO = "video",
  SHARE = "share",
}

const RawDataSettings: React.FC = () => {
  const { t } = useTranslation();
  const { isSendingScreenShare, isStartedVideo, isStartedAudio, isMuted } = useAppSelector(useSessionSelector);
  const { isSupportAudioProcessor, isSupportVideoProcessor, isSupportShareProcessor } = useAppSelector(
    (state) => state.ui,
  );

  const availableTabs = [
    {
      name: ProcessorTabs.AUDIO,
      title: t("settings.audio_tab_text") || "Audio",
      enabled: isSupportAudioProcessor,
    },
    {
      name: ProcessorTabs.VIDEO,
      title: t("settings.video_tab_text") || "Video",
      enabled: isSupportVideoProcessor,
    },
    {
      name: ProcessorTabs.SHARE,
      title: t("settings.share_tab_text") || "Share",
      enabled: isSupportShareProcessor,
    },
  ].filter((tab) => tab.enabled);

  const tabs = availableTabs.map(({ name, title }) => ({ name, title }));

  const [currentTabId, setCurrentTabId] = useState<ProcessorTabs>(
    availableTabs.length > 0 ? (availableTabs[0].name as ProcessorTabs) : ProcessorTabs.AUDIO,
  );

  const renderShareProcessors = useCallback(() => {
    if (!isSupportShareProcessor) {
      return (
        <div className="p-4 text-center text-theme-text-secondary">
          Share processors are not supported in this environment.
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-theme-text">Share Processors</h4>
          <p className="text-sm text-theme-text-secondary">Apply visual effects to your shared screen</p>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md dark:bg-gray-900/20 dark:border-gray-700/30">
          <PiiMaskProcessor isSharing={isSendingScreenShare} />
        </div>
      </div>
    );
  }, [isSendingScreenShare, isSupportShareProcessor]);

  const renderAudioProcessors = useCallback(() => {
    if (!isSupportAudioProcessor) {
      return (
        <div className="p-4 text-center text-theme-text-secondary">
          Audio processors are not supported in this environment.
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-theme-text">Audio Processors</h4>
          <p className="text-sm text-theme-text-secondary">Apply audio effects and filters to your microphone input</p>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md dark:bg-gray-900/20 dark:border-gray-700/30">
          <WhiteNoiseProcessor isAudioOn={isStartedAudio && !isMuted} />
        </div>
      </div>
    );
  }, [isStartedAudio, isMuted, isSupportAudioProcessor]);

  const renderVideoProcessors = useCallback(() => {
    if (!isSupportVideoProcessor) {
      return (
        <div className="p-4 text-center text-theme-text-secondary">
          Video processors are not supported in this environment.
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-theme-text">Video Processors</h4>
          <p className="text-sm text-theme-text-secondary">Apply visual effects to your camera feed</p>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md dark:bg-gray-900/20 dark:border-gray-700/30">
          <WatermarkProcessor isVideoOn={isStartedVideo} />
        </div>
      </div>
    );
  }, [isStartedVideo, isSupportVideoProcessor]);

  const content = useMemo(() => {
    switch (currentTabId) {
      case ProcessorTabs.AUDIO:
        return renderAudioProcessors();
      case ProcessorTabs.VIDEO:
        return renderVideoProcessors();
      case ProcessorTabs.SHARE:
        return renderShareProcessors();
      default:
        return null;
    }
  }, [currentTabId, renderAudioProcessors, renderShareProcessors, renderVideoProcessors]);

  if (tabs.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4">
        <p className="text-theme-text-secondary text-center">
          No processor capabilities are supported in this environment.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* <div className="space-y-4 mb-6">
        <section className="space-y-2">
          <h3 className="font-semibold text-lg text-theme-text">Raw Data Processing</h3>
        </section>
      </div> */}

      <CommonTab
        tabs={tabs}
        activeTab={currentTabId}
        setActiveTab={(tabName) => setCurrentTabId(tabName as ProcessorTabs)}
        className="justify-center items-center mb-4"
        orientation="horizontal"
      />

      <div className="flex-grow overflow-auto">
        <div className="p-1">{content}</div>
      </div>
    </div>
  );
};

export default RawDataSettings;
