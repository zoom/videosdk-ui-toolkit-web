import React from "react";
import {
  Mic,
  Video,
  FlipHorizontal,
  BriefcaseMedical,
  ChartBar,
  Settings,
  BadgeHelp,
  Radio,
  MicVocal,
  TvMinimalPlay,
  MonitorPlay,
  Database,
} from "lucide-react";
import { CommonPopper } from "@/components/widget/CommonPopper";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { setIsSettingsOpen, setSettingsActiveTab } from "@/store/uiSlice";
import {
  AudioSettings,
  VideoSettings,
  BackgroundSettings,
  TroubleshootingContainer,
  StatisticsSettings,
  GeneralSettings,
  HelpContainer,
  PlaybackSettings,
  SecondaryAudioSettings,
  ShareSettings,
  RawDataSettings,
} from "./components";
import VideoMask from "@/features/video/components/VideoMask";
import CommonTab from "@/components/widget/CommonTab";
import { isMobileDevice, isMobileDeviceNotIpad } from "@/components/util/service";
import { ProbeProvider } from "@/features/setting/context/probe-context";
import { MediaTabProvider } from "@/features/setting/context/media-tab-context";
import { DiagnosticTabProvider } from "@/features/setting/context/diagnostic-tab-context";
import { MediaDevice } from "@/types";

interface SettingsPanelProps {
  cameraList: MediaDevice[];
  microphoneList: MediaDevice[];
  speakerList: MediaDevice[];
  changeCamera: (deviceId: string) => Promise<void>;
  changeMicrophone: (deviceId: string) => Promise<void>;
  changeSpeaker: (deviceId: string) => Promise<void>;
  isControlByCustomizeLayout?: boolean;
  onClose?: () => void;
  isDraggable?: boolean;
  width?: number;
  height?: number;
}
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  cameraList,
  microphoneList,
  speakerList,
  changeCamera,
  changeMicrophone,
  changeSpeaker,
  isControlByCustomizeLayout,
  onClose,
  isDraggable = true,
  width = 700,
  height = 500,
}) => {
  const dispatch = useAppDispatch();

  const {
    isSettingsOpen,
    settingsActiveTab,
    isSupportVB,
    activeStatistics,
    isSupportAudioProcessor,
    isSupportVideoProcessor,
    isSupportShareProcessor,
  } = useAppSelector((state) => state.ui);
  const {
    config: {
      featuresOptions: {
        virtualBackground: { enable: isUserEnableVB },
        theme: { enable: isUserEnableTheme },
        secondaryAudio: { enable: isUserEnableSecondaryAudio },
        video: { enable: isUserEnableVideo },
        audio: { enable: isUserEnableAudio },
        playback: { enable: isUserEnablePlayback },
        // live: { enable: isUserEnableLive },
        troubleshoot: { enable: isUserEnableTroubleshooting },
        rawData: { enable: isUserEnableRawData },
      },
    },
  } = useAppSelector(useSessionSelector);

  const handleClose = () => {
    dispatch(setIsSettingsOpen(false));
  };

  const handleTabChange = (tab: string) => {
    dispatch(setSettingsActiveTab(tab));
  };

  const isAnyProcessorSupported = isSupportAudioProcessor || isSupportVideoProcessor || isSupportShareProcessor;

  const tabs = [
    { name: "general", icon: Settings, enabled: isUserEnableTheme },
    { name: "audio", icon: Mic, enabled: isUserEnableAudio },
    { name: "second audio", icon: MicVocal, enabled: !isMobileDevice() && isUserEnableSecondaryAudio },
    { name: "mask", icon: Video, enabled: false },
    { name: "video", icon: Video, enabled: isUserEnableVideo },
    { name: "raw data", icon: Database, enabled: !isMobileDevice() && isUserEnableRawData && isAnyProcessorSupported },
    { name: "playback", icon: TvMinimalPlay, enabled: !isMobileDevice() && isUserEnablePlayback },
    { name: "background", icon: FlipHorizontal, enabled: isSupportVB && isUserEnableVB },
    { name: "statistics", icon: ChartBar, enabled: true },
    { name: "troubleshoot", icon: BriefcaseMedical, enabled: isUserEnableTroubleshooting },
    { name: "help", icon: BadgeHelp, enabled: false },
  ].filter((tab) => tab.enabled);

  const commonNav = (
    <CommonTab
      tabs={tabs}
      activeTab={settingsActiveTab}
      setActiveTab={handleTabChange}
      orientation={isMobileDeviceNotIpad() ? "horizontal" : "vertical"}
      className={`justify-start ${isMobileDeviceNotIpad() ? "px-2 rounded-lg" : "py-2 rounded-lg uikit-custom-scrollbar"}`}
    />
  );

  const settingNav = isMobileDeviceNotIpad() ? (
    <div className="w-full h-[80px]">{commonNav}</div>
  ) : (
    <div className="w-[200px] h-full">{commonNav}</div>
  );

  return (
    <CommonPopper
      isOpen={onClose ? isControlByCustomizeLayout : isSettingsOpen}
      onClose={onClose || handleClose}
      title="Settings"
      width={width}
      height={height}
      isDraggable={isDraggable}
      id={"zoom-ui-toolkit-settings-popper"}
    >
      <ProbeProvider>
        <MediaTabProvider>
          <DiagnosticTabProvider>
            <ProbeProvider>
              <MediaTabProvider>
                <DiagnosticTabProvider>
                  <div className={`w-full h-full font-sans ${isMobileDeviceNotIpad() ? "p-1" : "flex p-2"}`}>
                    {settingNav}
                    <div
                      className={`${isMobileDeviceNotIpad() ? "w-full h-full block" : "w-[490px] h-full flex flex-col"} `}
                    >
                      <div className="flex-grow overflow-y-auto uikit-custom-scrollbar ">
                        <div className="p-4">
                          {settingsActiveTab === "general" && <GeneralSettings />}
                          {settingsActiveTab === "audio" && (
                            <AudioSettings
                              changeMicrophone={changeMicrophone}
                              changeSpeaker={changeSpeaker}
                              microphoneList={microphoneList}
                              speakerList={speakerList}
                            />
                          )}
                          {settingsActiveTab === "second audio" && <SecondaryAudioSettings />}
                          {settingsActiveTab === "mask" && <VideoMask />}
                          {settingsActiveTab === "video" && (
                            <VideoSettings cameraList={cameraList} changeCamera={changeCamera} />
                          )}
                          {settingsActiveTab === "playback" && <PlaybackSettings />}
                          {settingsActiveTab === "background" && (
                            <BackgroundSettings isActive={settingsActiveTab === "background"} />
                          )}
                          {settingsActiveTab === "statistics" && (
                            <StatisticsSettings activeStatistics={activeStatistics} />
                          )}
                          {settingsActiveTab === "troubleshoot" && <TroubleshootingContainer />}
                          {settingsActiveTab === "help" && <HelpContainer />}
                          {settingsActiveTab === "share" && <ShareSettings />}
                          {settingsActiveTab === "raw data" && <RawDataSettings />}
                        </div>
                      </div>
                    </div>
                  </div>
                </DiagnosticTabProvider>
              </MediaTabProvider>
            </ProbeProvider>
          </DiagnosticTabProvider>
        </MediaTabProvider>
      </ProbeProvider>
    </CommonPopper>
  );
};

export default SettingsPanel;
