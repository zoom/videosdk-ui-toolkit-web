import React, { RefObject, useRef, useState } from "react";
import Select from "react-select";
import { CommonCheckbox } from "@/components/widget/CommonCheckbox";
import { CommonInput } from "@/components/widget/CommonInput";
import { useAppDispatch, useAppSelector, useSubsessionSelector } from "@/hooks/useAppSelector";
import { setSubsessionOptions } from "../subsessionSlice";
import { useClickOutside } from "@/hooks/useClickOutside";
import { CommonSelectStyle } from "@/components/widget/CommonSelectStyle";

const SubsessionRoomsSettingsDialog = ({ isOpen, onClose, themeName }) => {
  const settingRef = useRef<HTMLDivElement>(null);
  const [isCountdownOpen, setIsCountdownOpen] = useState(false);
  const { subsessionOptions, subsessionType } = useAppSelector(useSubsessionSelector);
  const dispatch = useAppDispatch();

  const [settings, setSettings] = useState({
    // isSubsessionSelectionEnabled: subsessionType === SubsessionAllocationPattern.SelfSelect,
    isBackToMainSessionEnabled: subsessionOptions.isBackToMainSessionEnabled,
    isAutoJoinSubsession: subsessionOptions.isAutoJoinSubsession,
    isAutoMoveBackToMainSession: subsessionOptions.isAutoMoveBackToMainSession,
    isTimerAutoEnabled: subsessionOptions.isTimerAutoEnabled,
    timerDuration: subsessionOptions.timerDuration,
    waitSeconds: subsessionOptions.waitSeconds,
  });

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    dispatch(setSubsessionOptions({ ...subsessionOptions, [key]: !settings[key] }));
  };

  const updateSettingValue = (key, value) => {
    setSettings({ ...settings, [key]: value });
    dispatch(setSubsessionOptions({ ...subsessionOptions, [key]: value }));
  };
  const handleClickOutside = (isOutside: boolean) => {
    if (isOutside) {
      onClose(false);
    }
  };
  const menuRef = useClickOutside({ callback: handleClickOutside, excludeRefs: [settingRef] });

  const countdownOptions = [
    { value: 30, label: "30 seconds" },
    { value: 60, label: "60 seconds" },
    { value: 90, label: "90 seconds" },
  ];
  if (!isOpen) return null;

  return (
    <div
      className="absolute flex bottom-10 text-theme-text sm:justify-center space-x-2 w-full p-4 left-0 bg-theme-surface border border-theme-border rounded-md shadow-lg"
      ref={menuRef as RefObject<HTMLDivElement>}
      title="Subsession Rooms Settings"
      id="uikit-subsession-rooms-settings-dialog"
    >
      <div className="space-y-4">
        {/* <CommonCheckbox
          checked={settings.isSubsessionSelectionEnabled}
          onChange={({ target }) => {
            toggleSetting("isSubsessionSelectionEnabled");
            if (target?.checked) {
              dispatch(setSubsessionType(SubsessionAllocationPattern.SelfSelect));
            }
          }}
          label="Allow participants to choose room"
        /> */}
        <CommonCheckbox
          checked={settings.isBackToMainSessionEnabled}
          onChange={() => toggleSetting("isBackToMainSessionEnabled")}
          label="Allow participants to return to the main session at any time"
          id="uikit-subsession-rooms-settings-dialog-back-to-main-session-checkbox"
        />
        <CommonCheckbox
          checked={settings.isAutoJoinSubsession}
          onChange={() => toggleSetting("isAutoJoinSubsession")}
          label="Automatically move all assigned participants into subsession rooms"
          id="uikit-subsession-rooms-settings-dialog-auto-join-subsession-checkbox"
        />
        <CommonCheckbox
          checked={settings.isAutoMoveBackToMainSession}
          onChange={() => toggleSetting("isAutoMoveBackToMainSession")}
          label="Automatically move all selected participants in subsession rooms to main meeting"
          id="uikit-subsession-rooms-settings-dialog-auto-move-back-to-main-session-checkbox"
        />
        <div className="flex items-center space-x-2">
          <CommonCheckbox
            checked={settings.isTimerAutoEnabled}
            onChange={() => toggleSetting("isTimerAutoEnabled")}
            label="Auto close subsession rooms after"
            id="uikit-subsession-rooms-settings-dialog-auto-close-subsession-rooms-checkbox"
          />
          <CommonInput
            type="number"
            value={settings.timerDuration}
            onChange={(e) => updateSettingValue("timerDuration", e.target.value)}
            className="w-20"
            id="uikit-subsession-rooms-settings-dialog-auto-close-subsession-rooms-input"
          />
          <span>minutes</span>
        </div>
        <CommonCheckbox
          checked={settings.waitSeconds !== 0}
          onChange={({ target }) => {
            updateSettingValue("waitSeconds", target.checked ? 30 : 0);
          }}
          label="Countdown after closing subsession room"
          id="uikit-subsession-rooms-settings-dialog-countdown-after-closing-subsession-room-checkbox"
        />
        {settings.waitSeconds !== 0 && (
          <div className="flex items-center space-x-2 ml-6">
            <span>Set Countdown timer</span>
            <Select
              value={countdownOptions.find((option) => option.value === settings.waitSeconds)}
              onChange={(selectedOption) => updateSettingValue("waitSeconds", selectedOption.value)}
              options={countdownOptions}
              className="w-40"
              classNamePrefix="react-select"
              id="uikit-subsession-rooms-settings-dialog-countdown-after-closing-subsession-room-select"
              styles={CommonSelectStyle({ themeName })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubsessionRoomsSettingsDialog;
