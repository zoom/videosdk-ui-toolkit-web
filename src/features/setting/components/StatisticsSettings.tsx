import React, { useState, useMemo } from "react";
import { formatter, khzFormatter, msFormatter, packetLossFormatter, DEFAULT_VALUE_FORMAT } from "./util";
import { useTranslation } from "react-i18next";
import CommonTab from "@/components/widget/CommonTab";
import { useStatistics } from "../hooks/useStatistics";
import { THEME_COLOR_CLASS } from "@/constant";

const enum StatisticsTabs {
  // OVERALL = "overall",
  AUDIO = "audio",
  VIDEO = "video",
  SHARE = "share",
}
export const StatisticsSettings: React.FC<{ activeStatistics: string }> = ({ activeStatistics }) => {
  const [currentTabId, setCurrentTabId] = useState<StatisticsTabs>(activeStatistics as StatisticsTabs);
  const { t } = useTranslation();

  const {
    audioStatisticsEncodeData,
    audioStatisticsDecodeData,
    videoStatisticsEncodeData,
    videoStatisticsDecodeData,
    shareStatisticsEncodeData,
    shareStatisticsDecodeData,
  } = useStatistics();

  const [audioSending, audioReceiving] = packetLossFormatter(audioStatisticsEncodeData, audioStatisticsDecodeData);
  const [videoSending, videoReceiving] = packetLossFormatter(videoStatisticsEncodeData, videoStatisticsDecodeData);
  const [shareSending, shareReceiving] = packetLossFormatter(shareStatisticsEncodeData, shareStatisticsDecodeData);
  const mult = "\u00D7";

  const ITEM_NAME_TEXT = t("settings.item_name");
  const SEND_TEXT = t("settings.send");
  const RECEIVE_TEXT = t("settings.receive");
  const FREQUENCY_TEXT = t("settings.frequency");
  const LATENCY_TEXT = t("settings.latency");
  const JITTER_TEXT = t("settings.jitter");
  const PACKET_LOSS_TEXT = t("settings.packet_loss");
  const RESOLUTION_TEXT = t("settings.resolution");
  const FRAME_PER_SECOND_TEXT = t("settings.frame_per_second");

  const isDataExists = (value: number) => value !== 0;

  const audioRows = [
    {
      name: FREQUENCY_TEXT,
      send: isDataExists(audioStatisticsEncodeData.sample_rate)
        ? formatter(audioStatisticsEncodeData.sample_rate, khzFormatter)
        : DEFAULT_VALUE_FORMAT,
      receive: isDataExists(audioStatisticsDecodeData.sample_rate)
        ? formatter(audioStatisticsDecodeData.sample_rate, (v: any) => `${v} khz`)
        : DEFAULT_VALUE_FORMAT,
    },
    {
      name: LATENCY_TEXT,
      send: isDataExists(audioStatisticsEncodeData.rtt)
        ? formatter(audioStatisticsEncodeData.rtt, msFormatter)
        : DEFAULT_VALUE_FORMAT,
      receive: isDataExists(audioStatisticsDecodeData.rtt)
        ? formatter(audioStatisticsDecodeData.rtt, msFormatter)
        : DEFAULT_VALUE_FORMAT,
    },
    {
      name: JITTER_TEXT,
      send: isDataExists(audioStatisticsEncodeData.jitter)
        ? formatter(audioStatisticsEncodeData.jitter, msFormatter)
        : DEFAULT_VALUE_FORMAT,
      receive: isDataExists(audioStatisticsDecodeData.jitter)
        ? formatter(audioStatisticsDecodeData.jitter, msFormatter)
        : DEFAULT_VALUE_FORMAT,
    },
    {
      name: PACKET_LOSS_TEXT,
      send:
        isDataExists(audioStatisticsEncodeData.max_loss) && isDataExists(audioStatisticsEncodeData.avg_loss)
          ? audioSending
          : DEFAULT_VALUE_FORMAT,
      receive:
        isDataExists(audioStatisticsDecodeData.max_loss) && isDataExists(audioStatisticsDecodeData.avg_loss)
          ? audioReceiving
          : DEFAULT_VALUE_FORMAT,
    },
  ];

  const videoRows = [
    {
      name: LATENCY_TEXT,
      send: isDataExists(videoStatisticsEncodeData.rtt)
        ? formatter(videoStatisticsEncodeData.rtt, msFormatter)
        : DEFAULT_VALUE_FORMAT,
      receive: isDataExists(videoStatisticsDecodeData.rtt)
        ? formatter(videoStatisticsDecodeData.rtt, msFormatter)
        : DEFAULT_VALUE_FORMAT,
    },
    {
      name: JITTER_TEXT,
      send: isDataExists(videoStatisticsEncodeData.jitter)
        ? formatter(videoStatisticsEncodeData.jitter, msFormatter)
        : DEFAULT_VALUE_FORMAT,
      receive: isDataExists(videoStatisticsDecodeData.jitter)
        ? formatter(videoStatisticsDecodeData.jitter, msFormatter)
        : DEFAULT_VALUE_FORMAT,
    },
    {
      name: PACKET_LOSS_TEXT,
      send:
        isDataExists(videoStatisticsEncodeData.max_loss) && isDataExists(videoStatisticsEncodeData.avg_loss)
          ? videoSending
          : DEFAULT_VALUE_FORMAT,
      receive:
        isDataExists(videoStatisticsDecodeData.max_loss) && isDataExists(videoStatisticsDecodeData.avg_loss)
          ? videoReceiving
          : DEFAULT_VALUE_FORMAT,
    },
    {
      name: RESOLUTION_TEXT,
      send: isDataExists(videoStatisticsEncodeData.width)
        ? formatter(videoStatisticsEncodeData.width, (v: any) => `${v}${mult}${videoStatisticsEncodeData.height}`)
        : DEFAULT_VALUE_FORMAT,
      receive: isDataExists(videoStatisticsDecodeData.width)
        ? formatter(videoStatisticsDecodeData.width, (v: any) => `${v}${mult}${videoStatisticsDecodeData.height}`)
        : DEFAULT_VALUE_FORMAT,
    },
    {
      name: FRAME_PER_SECOND_TEXT,
      send: isDataExists(videoStatisticsEncodeData.fps)
        ? formatter(videoStatisticsEncodeData.fps, (v: any) => `${v} fps`)
        : DEFAULT_VALUE_FORMAT,
      receive: isDataExists(videoStatisticsDecodeData.fps)
        ? formatter(videoStatisticsDecodeData.fps, (v: any) => `${v} fps`)
        : DEFAULT_VALUE_FORMAT,
    },
  ];

  const shareRows = [
    {
      name: LATENCY_TEXT,
      send: isDataExists(shareStatisticsEncodeData.rtt)
        ? formatter(shareStatisticsEncodeData.rtt, msFormatter)
        : DEFAULT_VALUE_FORMAT,
      receive: isDataExists(shareStatisticsDecodeData.rtt)
        ? formatter(shareStatisticsDecodeData.rtt, msFormatter)
        : DEFAULT_VALUE_FORMAT,
    },
    {
      name: JITTER_TEXT,
      send: isDataExists(shareStatisticsEncodeData.jitter)
        ? formatter(shareStatisticsEncodeData.jitter, msFormatter)
        : DEFAULT_VALUE_FORMAT,
      receive: isDataExists(shareStatisticsDecodeData.jitter)
        ? formatter(shareStatisticsDecodeData.jitter, msFormatter)
        : DEFAULT_VALUE_FORMAT,
    },
    {
      name: PACKET_LOSS_TEXT,
      send:
        isDataExists(shareStatisticsEncodeData.max_loss) && isDataExists(shareStatisticsEncodeData.avg_loss)
          ? shareSending
          : DEFAULT_VALUE_FORMAT,
      receive:
        isDataExists(shareStatisticsDecodeData.max_loss) && isDataExists(shareStatisticsDecodeData.avg_loss)
          ? shareReceiving
          : DEFAULT_VALUE_FORMAT,
    },
    {
      name: RESOLUTION_TEXT,
      send: isDataExists(shareStatisticsEncodeData.width)
        ? formatter(shareStatisticsEncodeData.width, (v: any) => `${v}${mult}${shareStatisticsEncodeData.height}`)
        : DEFAULT_VALUE_FORMAT,
      receive: isDataExists(shareStatisticsDecodeData.width)
        ? formatter(shareStatisticsDecodeData.width, (v: any) => `${v}${mult}${shareStatisticsDecodeData.height}`)
        : DEFAULT_VALUE_FORMAT,
    },
    {
      name: FRAME_PER_SECOND_TEXT,
      send: isDataExists(shareStatisticsEncodeData.fps)
        ? formatter(shareStatisticsEncodeData.fps, (v: any) => `${v} fps`)
        : DEFAULT_VALUE_FORMAT,
      receive: isDataExists(shareStatisticsDecodeData.fps)
        ? formatter(shareStatisticsDecodeData.fps, (v: any) => `${v} fps`)
        : DEFAULT_VALUE_FORMAT,
    },
  ];

  const tabs = [
    // { name: StatisticsTabs.OVERALL, title: t("settings.overall_tab_text") },
    { name: StatisticsTabs.AUDIO, title: t("settings.audio_tab_text") },
    { name: StatisticsTabs.VIDEO, title: t("settings.video_tab_text") },
    { name: StatisticsTabs.SHARE, title: t("settings.share_tab_text") },
  ];

  const renderTable = (rows: any[]) => (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="text-left p-2  text-xs">{ITEM_NAME_TEXT}</th>
          <th className="text-left p-2  text-xs">{SEND_TEXT}</th>
          <th className="text-left p-2  text-xs">{RECEIVE_TEXT}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} className="border-b border-gray-200">
            <td className="p-2  text-xs">{row.name}</td>
            <td className="p-2  text-xs">{row.send}</td>
            <td className="p-2  text-xs">{row.receive}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const content = useMemo(() => {
    switch (currentTabId) {
      // case StatisticsTabs.OVERALL:
      //   return renderTable([...audioRows, ...videoRows, ...shareRows]);
      case StatisticsTabs.AUDIO:
        return renderTable(audioRows);
      case StatisticsTabs.VIDEO:
        return renderTable(videoRows);
      case StatisticsTabs.SHARE:
        return renderTable(shareRows);
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTabId, audioRows, videoRows, shareRows]);

  return (
    <div className={`flex flex-col h-full ${THEME_COLOR_CLASS} text-black justify-center`}>
      <CommonTab
        tabs={tabs}
        activeTab={currentTabId}
        setActiveTab={(tabName) => setCurrentTabId(tabName as StatisticsTabs)}
        className="justify-center items-center"
        orientation="horizontal"
      />
      <div className="flex-grow overflow-auto p-1">{content}</div>
    </div>
  );
};

export default StatisticsSettings;
