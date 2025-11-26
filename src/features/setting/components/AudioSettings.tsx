import React, { useContext, useState } from "react";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { ChevronDown } from "lucide-react";
import { MediaDevice } from "@/types";
import { isMobileDevice, isSupportAudioPlayback } from "@/components/util/service";
import { useCurrentUser } from "@/features/participant/hooks";
import { setAudioProcessingMode, setOriginalSoundOptions, setNoiseSuppressionEnabled } from "@/store/uiSlice";
import { THEME_COLOR_CLASS } from "@/constant";

interface AudioSettingsProps {
  changeMicrophone: (deviceId: string) => Promise<void>;
  changeSpeaker: (deviceId: string) => Promise<void>;
  microphoneList: MediaDevice[];
  speakerList: MediaDevice[];
}

const AudioSettings: React.FC<AudioSettingsProps> = ({
  changeMicrophone,
  changeSpeaker,
  microphoneList,
  speakerList,
}) => {
  const sessionUI = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();
  const { audioPlaybackFile, isMuted } = useAppSelector(useSessionSelector);
  const { stream } = useContext(StreamContext);

  const currentUser = useCurrentUser();
  const isJoinedAudio = currentUser?.audio !== "";

  // Primary Audio Device Handlers
  const handleMicrophoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = event.target.value;
    changeMicrophone(deviceId);
  };

  const handleSpeakerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = event.target.value;
    changeSpeaker(deviceId);
  };

  // Audio Processing States
  const audioProcessing = sessionUI.audioProcessing.mode;
  const { originalSoundOptions } = sessionUI.audioProcessing;
  const { isNoiseSuppressionEnabled } = sessionUI.audioProcessing;

  // todo: Additional Options States
  const [syncButtonsOnHeadset, setSyncButtonsOnHeadset] = useState(false);
  const [highBitrate, setHighBitrate] = useState(false);
  const [isAudioPlaybackEnabled, setIsAudioPlaybackEnabled] = useState(false);

  // Handlers
  const handleAudioProcessingChange = async (value: "originalSound" | "backgroundNoiseSuppression") => {
    try {
      await stream.enableOriginalSound(value === "originalSound" && originalSoundOptions);
      await stream.enableBackgroundNoiseSuppression(value === "backgroundNoiseSuppression");
      dispatch(setAudioProcessingMode(value));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to change audio processing mode:", error);
    }
  };

  const handleOriginalSoundOptionChange = async (option: "hifi" | "stereo") => {
    try {
      const newOptions = { ...originalSoundOptions, [option]: !originalSoundOptions[option] };
      await stream.enableOriginalSound(newOptions);
      dispatch(setOriginalSoundOptions(newOptions));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to change original sound options:", error);
    }
  };

  const handleNoiseSuppressionChange = async (enabled: boolean) => {
    try {
      await stream.enableBackgroundNoiseSuppression(enabled);
      dispatch(setNoiseSuppressionEnabled(enabled));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to toggle noise suppression:", error);
    }
  };

  // const handleSyncButtonsOnHeadsetChange = () => {
  //   setSyncButtonsOnHeadset(!syncButtonsOnHeadset);
  // };

  // const handleHighBitrateChange = () => {
  //   setHighBitrate(!highBitrate);
  // };

  // const handleAudioPlaybackToggle = () => {
  //   setIsAudioPlaybackEnabled(!isAudioPlaybackEnabled);
  // };

  // UI States
  const radioGroupClass = "space-y-3 mt-1";
  const radioOptionClass = "flex items-center space-x-2";
  const subOptionsClass = "ml-6 mt-2 space-y-2";
  const isOtherOptionsDisabled = isAudioPlaybackEnabled && isSupportAudioPlayback(isJoinedAudio);
  const isOtherOptionsDisabledClass = isOtherOptionsDisabled ? "opacity-50 pointer-events-none" : "";
  const selectClass = `${THEME_COLOR_CLASS} w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none`;

  return (
    <div className={`${THEME_COLOR_CLASS}`}>
      {/* Primary Audio Controls */}
      <div className={`space-y-4`}>
        <div className="flex items-center">
          <label htmlFor="microphone" className="w-1/4 text-sm font-medium">
            Microphone:
          </label>
          <div className={`w-3/4 relative ${isOtherOptionsDisabledClass}`}>
            <select
              id="settings-microphone"
              value={sessionUI.activeMicrophone}
              onChange={handleMicrophoneChange}
              className={selectClass}
              disabled={audioPlaybackFile !== ""}
            >
              {microphoneList.map((mic) => (
                <option key={mic.deviceId} value={mic.deviceId}>
                  {mic.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="speaker" className="w-1/4 text-sm font-medium ">
            Speaker:
          </label>
          <div className={`w-3/4 relative ${isOtherOptionsDisabledClass}`}>
            <select id="speaker" value={sessionUI.activeSpeaker} onChange={handleSpeakerChange} className={selectClass}>
              {speakerList.map((speaker) => (
                <option key={speaker.deviceId} value={speaker.deviceId}>
                  {speaker.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop-only Options */}
      {!isMobileDevice() && (
        <>
          <div className="border-t border-gray-200 pt-4 mt-4"></div>

          {/* Additional Options Section */}
          {/* <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-1/4 text-sm font-medium ">Additional Options:</label>
              <div className={`w-3/4 space-y-2 ${isOtherOptionsDisabledClass}`}>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="syncButtonsOnHeadset"
                    checked={syncButtonsOnHeadset}
                    onChange={handleSyncButtonsOnHeadsetChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="syncButtonsOnHeadset"
                    className="ml-2 block text-sm "
                    title="Sync mute or unmute state for the audio devices made by these manufacturers: AVer, Crestron, Jabra, Logitech, Plantronics, Polycom, Shure, Yamaha, and Yealink."
                  >
                    Sync buttons on headset
                  </label>
                </div>

                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="highBitrate"
                    checked={highBitrate}
                    onChange={handleHighBitrateChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="highBitrate" className="ml-2 block text-sm ">
                    High bitrate
                  </label>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="border-t border-gray-200 pt-4 mt-4"></div> */}
          {/* Audio Processing Section */}
          <div className="space-y-4">
            <div className="flex items-start">
              {" "}
              {/* Changed to items-start for better alignment */}
              <label className="w-1/4 text-sm font-medium  pt-1">Audio Processing:</label>
              <div className={`w-3/4 ${isOtherOptionsDisabledClass}`}>
                <div className={radioGroupClass}>
                  {/* Original Sound Option */}
                  <div className={radioOptionClass}>
                    <input
                      type="radio"
                      id="originalSound"
                      name="audioProcessing"
                      value="originalSound"
                      checked={audioProcessing === "originalSound"}
                      onChange={() => handleAudioProcessingChange("originalSound")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="originalSound" className="text-sm ">
                      Original Sound
                    </label>
                  </div>

                  {/* Original Sound Options */}
                  {audioProcessing === "originalSound" && (
                    <div className={subOptionsClass}>
                      <div className={radioOptionClass}>
                        <input
                          type="checkbox"
                          id="hifi"
                          checked={originalSoundOptions.hifi}
                          onChange={() => handleOriginalSoundOptionChange("hifi")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="hifi" className="text-sm ">
                          High Fidelity Audio
                        </label>
                      </div>
                      <div className={radioOptionClass}>
                        <input
                          type="checkbox"
                          id="stereo"
                          checked={originalSoundOptions.stereo}
                          onChange={() => handleOriginalSoundOptionChange("stereo")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="stereo" className="text-sm ">
                          Stereo Audio
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Background Noise Suppression Option */}
                  <div className={radioOptionClass}>
                    <input
                      type="radio"
                      id="backgroundNoiseSuppression"
                      name="audioProcessing"
                      value="backgroundNoiseSuppression"
                      checked={audioProcessing === "backgroundNoiseSuppression"}
                      onChange={() => handleAudioProcessingChange("backgroundNoiseSuppression")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="backgroundNoiseSuppression" className="text-sm ">
                      Background Noise Suppression
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AudioSettings;
