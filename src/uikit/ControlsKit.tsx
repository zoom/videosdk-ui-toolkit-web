import Footer from "@/components/footer/Footer";
import { useDevice } from "@/features/setting/hooks/useDevice";
import { useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsSettingsOpen } from "@/store/uiSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ControlsKit: React.FC<{ options: any }> = ({ options }) => {
  const dispatch = useDispatch();
  const sessionUI = useSelector(useSessionUISelector);
  const { cameraList, microphoneList, speakerList, changeCamera, changeMicrophone, changeSpeaker } = useDevice();

  return (
    <Footer
      isSettingsOpen={sessionUI.isSettingsOpen}
      setIsSettingsOpen={() => {
        dispatch(setIsSettingsOpen(!sessionUI.isSettingsOpen));
      }}
      cameraList={cameraList}
      microphoneList={microphoneList}
      speakerList={speakerList}
      changeCamera={changeCamera}
      changeMicrophone={changeMicrophone}
      changeSpeaker={changeSpeaker}
      orientation={options?.orientation || "horizontal"}
      autoClose={false}
    />
  );
};

export default ControlsKit;
