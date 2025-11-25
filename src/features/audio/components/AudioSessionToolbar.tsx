import React, { useCallback, useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
import { AudioButton } from "@/features/audio/components/AudioButton";
import { LeaveButton } from "@/components/footer/LeaveButton";
import { AudioWaves } from "./AudioWaves";
import { MediaDevice } from "@zoom/videosdk";

export const AudioSessionToolbar = ({
  microphoneList,
  speakerList,
  changeMicrophone,
  changeSpeaker,
  isHostOrManager,
}: {
  microphoneList: MediaDevice[];
  speakerList: MediaDevice[];
  changeMicrophone: (deviceId: string) => Promise<void>;
  changeSpeaker: (deviceId: string) => Promise<void>;
  isHostOrManager: boolean;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragBarVisible, setIsDragBarVisible] = useState(true);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const hideTimeoutRef = useRef(null);
  const nodeRef = useRef(null);

  const startHideTimer = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsDragBarVisible(false);
    }, 5000);
  }, []);

  useEffect(() => {
    startHideTimer();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [startHideTimer]);

  const handleInteraction = useCallback(() => {
    setIsDragBarVisible(true);
    startHideTimer();
  }, [startHideTimer]);

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
    setIsDragBarVisible(true);
    startHideTimer();
  };

  const _handleAudioToggle = () => {
    setIsAudioActive(!isAudioActive);
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".handle" bounds="body" position={position} onDrag={handleDrag}>
      <div
        ref={nodeRef}
        className="bg-white rounded-2xl shadow-lg transition-all duration-300 w-[250px]"
        onTouchStart={handleInteraction}
        onMouseEnter={handleInteraction}
        onClick={handleInteraction}
      >
        <div
          className={`handle h-6 bg-gray-200 rounded-t-2xl cursor-move flex items-center justify-center ${
            isDragBarVisible ? "" : "hidden"
          }`}
        >
          <div className="w-20 h-1 bg-gray-400 rounded-full"></div>
        </div>
        <div className="p-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <AudioButton
                microphoneList={microphoneList}
                speakerList={speakerList}
                changeMicrophone={changeMicrophone}
                changeSpeaker={changeSpeaker}
                id="uikit-footer-audio-minimized"
              />
            </div>
            <AudioWaves />
            <LeaveButton isHostOrManager={isHostOrManager} />
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default AudioSessionToolbar;
