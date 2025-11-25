import React, { useCallback, useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
import { Maximize2 } from "lucide-react";
import { MediaDevice, SuspensionViewType } from "@/types/index.d";
import { setIsChatPoppedOut, setIsParticipantsPoppedOut, setViewType } from "@/store/uiSlice";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { AudioButton } from "@/features/audio/components/AudioButton";
import { VideoButton } from "@/features/video/components/VideoButton";
import { LeaveButton } from "@/components/footer/LeaveButton";
import ControlButton from "@/components/widget/ControlButton";
import { useClickOutside } from "@/hooks/useClickOutside";
import { emit } from "@/events/event-bus";
import { ExposedEvents } from "@/events/event-constant";

export const MobileMeetingToolbar = ({
  cameraList,
  microphoneList,
  speakerList,
  changeCamera,
  changeMicrophone,
  changeSpeaker,
  isHostOrManager,
  themeName,
}: {
  cameraList: MediaDevice[];
  microphoneList: MediaDevice[];
  speakerList: MediaDevice[];
  changeCamera: (deviceId: string) => Promise<void>;
  changeMicrophone: (deviceId: string) => Promise<void>;
  changeSpeaker: (deviceId: string) => Promise<void>;
  isHostOrManager: boolean;
  themeName: string;
}) => {
  const dispatch = useAppDispatch();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragBarVisible, setIsDragBarVisible] = useState(true);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const hideTimeoutRef = useRef(null);
  const nodeRef = useRef(null);
  const dropdownRef = useRef(null);

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
  const handleMaximize = () => {
    dispatch(setViewType(SuspensionViewType.Gallery));
    emit(ExposedEvents.EVENT_VIEW_TYPE_CHANGE, SuspensionViewType.Gallery);
  };
  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
    setIsDragBarVisible(true);
    startHideTimer();
  };

  const handleMoreClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleOptionClick = (option: string) => {
    if (option === "chat") {
      dispatch(setIsChatPoppedOut(true));
    } else if (option === "participants") {
      dispatch(setIsParticipantsPoppedOut(true));
    }
    setIsDropdownVisible(false);
  };

  useClickOutside({
    callback: () => {
      // setIsDropdownVisible(false);
    },
    excludeRefs: [dropdownRef],
  });

  return (
    <Draggable nodeRef={nodeRef} handle=".handle" bounds="body" position={position} onDrag={handleDrag}>
      <div
        ref={nodeRef}
        className={`rounded-lg shadow-lg transition-all duration-300 w-[250px] bg-theme-surface border border-theme-border`}
        onTouchStart={handleInteraction}
        onMouseEnter={handleInteraction}
        onClick={handleInteraction}
      >
        <div
          className={`handle h-6 bg-theme-background rounded-t-lg cursor-move flex items-center justify-center ${
            isDragBarVisible ? "" : "hidden"
          }`}
        >
          <div className="w-20 h-1 bg-gray-400 rounded-full"></div>
        </div>
        <div className="p-2">
          <div className="flex justify-between items-center">
            <ControlButton
              icon={Maximize2}
              iconColor={themeName === "dark" ? "white" : "black"}
              isActive={false}
              onClick={handleMaximize}
              className={`bg-theme-surface hover:bg-theme-background text-theme-text border border-theme-border rounded-full `}
              id="uikit-mobile-meeting-toolbar-maximize-button"
            />
            <AudioButton
              microphoneList={microphoneList}
              speakerList={speakerList}
              changeMicrophone={changeMicrophone}
              changeSpeaker={changeSpeaker}
              id="uikit-footer-audio-mobile-minimized"
              disableAutoJoin={true}
            />
            <VideoButton cameraList={cameraList} changeCamera={changeCamera} />

            {/* <ControlButton
              icon={MoreHorizontal}
              isActive={isDropdownVisible}
              onClick={handleMoreClick}
              className="bg-gray-100 text-black hover:bg-gray-200 rounded-lg"
              id="uikit-mobile-meeting-toolbar-more-button"
            /> */}
            <LeaveButton isHostOrManager={isHostOrManager} />
          </div>
          {isDropdownVisible && (
            <div ref={dropdownRef} className="mt-2 bg-white rounded-lg shadow-md border border-gray-200">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                onClick={() => handleOptionClick("chat")}
              >
                Chat
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                onClick={() => handleOptionClick("participants")}
              >
                Participants
              </button>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default MobileMeetingToolbar;
