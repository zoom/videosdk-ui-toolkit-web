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
          {t("settings.raw_data_share_processors_not_supported")}
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-theme-text">{t("settings.raw_data_share_processors")}</h4>
          <p className="text-sm text-theme-text-secondary">{t("settings.raw_data_share_processors_description")}</p>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md dark:bg-gray-900/20 dark:border-gray-700/30">
          <PiiMaskProcessor isSharing={isSendingScreenShare} />
        </div>
      </div>
    );
  }, [isSendingScreenShare, isSupportShareProcessor, t]);

  const renderAudioProcessors = useCallback(() => {
    if (!isSupportAudioProcessor) {
      return (
        <div className="p-4 text-center text-theme-text-secondary">
          {t("settings.raw_data_audio_processors_not_supported")}
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-theme-text">{t("settings.raw_data_audio_processors")}</h4>
          <p className="text-sm text-theme-text-secondary">{t("settings.raw_data_audio_processors_description")}</p>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md dark:bg-gray-900/20 dark:border-gray-700/30">
          <WhiteNoiseProcessor isAudioOn={isStartedAudio && !isMuted} />
        </div>
      </div>
    );
  }, [isSupportAudioProcessor, t, isStartedAudio, isMuted]);

  const renderVideoProcessors = useCallback(() => {
    if (!isSupportVideoProcessor) {
      return (
        <div className="p-4 text-center text-theme-text-secondary">
          {t("settings.raw_data_video_processors_not_supported")}
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-theme-text">{t("settings.raw_data_video_processors")}</h4>
          <p className="text-sm text-theme-text-secondary">{t("settings.raw_data_video_processors_description")}</p>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md dark:bg-gray-900/20 dark:border-gray-700/30">
          <WatermarkProcessor isVideoOn={isStartedVideo} />
        </div>
      </div>
    );
  }, [isStartedVideo, isSupportVideoProcessor, t]);

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
        <p className="text-theme-text-secondary text-center">{t("settings.raw_data_no_processor_capabilities")}</p>
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
