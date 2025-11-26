import React from "react";
import { LucideIcon, Video, Mic, Speaker } from "lucide-react";
import Button from "./CommonButton";

interface DeviceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  devices: Array<{ deviceId: string; label: string }>;
  deviceType: string;
  id: string;
  themeColorClass: string;
  clickIcon?: () => void;
  iconId?: string;
  TestIcon?: LucideIcon;
  testTitle?: string;
  disabled?: boolean;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  value,
  onChange,
  devices,
  deviceType,
  id,
  themeColorClass,
  clickIcon,
  iconId,
  testTitle,
  disabled = false,
}) => {
  const getDeviceIcon = () => {
    switch (deviceType.toLowerCase()) {
      case "camera":
        return <Video className="w-4 h-4" />;
      case "microphone":
      case "mic":
        return <Mic className="w-4 h-4" />;
      case "speaker":
        return <Speaker className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className={`w-1/3 ${themeColorClass} px-1`}>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <div className="rounded-full p-1">{getDeviceIcon()}</div>
          </div>
          <select
            value={value}
            onChange={(e) => {
              if (!disabled) {
                onChange(e.target.value);
              }
            }}
            className={`py-2 pr-2 text-sm rounded border transition-colors duration-200 w-full appearance-none ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            } ${themeColorClass}`}
            style={{
              paddingLeft: "2.5rem",
              textOverflow: "ellipsis",
            }}
            id={id}
            title={disabled ? "Before changing the device, please stop testing" : ""}
            disabled={disabled}
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId} className="text-ellipsis overflow-hidden">
                {device.label || `${deviceType} ${device.deviceId.slice(0, 5)}`}
              </option>
            ))}
          </select>
        </div>
        {clickIcon && (
          <Button
            variant="outline"
            size="xs"
            className={`w-full hover:cursor-pointer ${themeColorClass}`}
            onClick={clickIcon}
            title={testTitle}
            id={`uikit-preview-${iconId}`}
          >
            {testTitle}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DeviceSelector;
