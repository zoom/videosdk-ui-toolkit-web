import React, { useEffect, useState } from "react";
import { useHardwareAcceleration } from "../hooks/useHardwareAcceleration";
import { useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { ChevronDown } from "lucide-react";
import { MediaDevice } from "@/types";
import { THEME_COLOR_CLASS } from "@/constant";
import { useMirrorVideo } from "@/features/video/hooks";

interface VideoSettingsProps {
  cameraList: MediaDevice[];
  changeCamera: (deviceId: string) => Promise<void>;
}

export const VideoSettings: React.FC<VideoSettingsProps> = ({ cameraList, changeCamera }) => {
  // const activeCamera = useAppSelector((state) => state.ui.activeCamera);
  const { activeCamera } = useAppSelector(useSessionUISelector);
  const { videoPlaybackFile } = useAppSelector(useSessionSelector);
  const { isMirrorVideo, updateMirrorVideo, canMirrorVideo } = useMirrorVideo();

  const [selectedCamera, setSelectedCamera] = useState(activeCamera);

  const {
    isEnableHardwareAccelerationReceiving,
    isEnableHardwareAccelerationSending,
    isStartedHardwareAcceleration,
    onHardwareAccelerationReceivingCheck,
    onHardwareAccelerationSendingCheck,
  } = useHardwareAcceleration();

  const [localReceiving, setLocalReceiving] = useState(isEnableHardwareAccelerationReceiving);
  const [localSending, setLocalSending] = useState(isEnableHardwareAccelerationSending);
  const [isMirrorPending, setIsMirrorPending] = useState(false);

  useEffect(() => {
    setSelectedCamera(activeCamera);
  }, [activeCamera]);

  useEffect(() => {
    setLocalReceiving(isEnableHardwareAccelerationReceiving);
    setLocalSending(isEnableHardwareAccelerationSending);
  }, [isEnableHardwareAccelerationReceiving, isEnableHardwareAccelerationSending]);

  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCameraId = event.target.value;
    setSelectedCamera(newCameraId);
    changeCamera(newCameraId);
  };

  const handleReceivingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setLocalReceiving(newValue);
    onHardwareAccelerationReceivingCheck();
  };

  const handleSendingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setLocalSending(newValue);
    onHardwareAccelerationSendingCheck();
  };

  const handleMirrorChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.checked;
    setIsMirrorPending(true);
    try {
      await updateMirrorVideo(nextValue);
    } finally {
      setIsMirrorPending(false);
    }
  };

  const selectClass = `${THEME_COLOR_CLASS} w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none`;

  return (
    <div className={`flex flex-col ${THEME_COLOR_CLASS}`}>
      <div className="space-y-4">
        <div className="flex items-center">
          <label htmlFor="cameraSelect" className="w-1/4 text-sm font-semibold ">
            Camera:
          </label>
          <div className="w-3/4 relative">
            <select
              id="cameraSelect"
              value={selectedCamera || ""}
              onChange={handleCameraChange}
              className={selectClass}
              disabled={videoPlaybackFile ? true : false}
            >
              {cameraList.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${camera.deviceId}`}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="w-1/4 text-sm font-semibold ">Video Settings:</span>
          <label className="flex items-center gap-2 text-sm ">
            <input
              type="checkbox"
              checked={localReceiving}
              onChange={handleReceivingChange}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            Enable Hardware Acceleration (Receiving)
          </label>
          <label className="flex items-center gap-2 text-sm ">
            <input
              type="checkbox"
              checked={localSending}
              onChange={handleSendingChange}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            Enable Hardware Acceleration (Sending)
          </label>
          <label className="flex items-center gap-2 text-sm ">
            <input
              type="checkbox"
              checked={isMirrorVideo}
              onChange={handleMirrorChange}
              className="form-checkbox h-4 w-4 text-blue-600"
              disabled={!canMirrorVideo || isMirrorPending}
            />
            Mirror my video
          </label>
        </div>
        {!isStartedHardwareAcceleration && (
          <p className="text-sm text-yellow-600">
            Note: Hardware acceleration is not currently active. Changes may not take effect until it&apos;s started.
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoSettings;
