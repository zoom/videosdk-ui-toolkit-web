import React, { useState } from "react";
import SettingsPanel from "@/features/setting/SettingsPanel";
import { useDevice } from "@/features/setting/hooks/useDevice";

const SettingsKit: React.FC<{ options: any }> = ({ options }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const { cameraList, microphoneList, speakerList, changeCamera, changeMicrophone, changeSpeaker } = useDevice();
  return (
    <SettingsPanel
      cameraList={cameraList}
      microphoneList={microphoneList}
      speakerList={speakerList}
      changeCamera={changeCamera}
      changeMicrophone={changeMicrophone}
      changeSpeaker={changeSpeaker}
      isControlByCustomizeLayout={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      isDraggable={options?.draggable}
      width={options?.width || 700}
      height={options?.height || 500}
    />
  );
};

export default SettingsKit;
