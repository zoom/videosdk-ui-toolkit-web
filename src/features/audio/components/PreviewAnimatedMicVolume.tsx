import React, { useState, useEffect } from "react";
import { Mic } from "lucide-react";

const PreviewAnimatedMicVolume = ({ localAudio, iconColor }: { localAudio: any; iconColor?: string }) => {
  const [volume, setVolume] = useState(0);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (localAudio) {
      const levelInterval = setInterval(() => {
        const newVolumeIntensity = localAudio.getCurrentVolume();
        let newMicFeedbackStyle = 0;

        if (newVolumeIntensity === 0) {
          newMicFeedbackStyle = 0;
        } else if (newVolumeIntensity <= 0.05) {
          newMicFeedbackStyle = 2;
        } else if (newVolumeIntensity <= 0.1) {
          newMicFeedbackStyle = 4;
        } else if (newVolumeIntensity <= 0.15) {
          newMicFeedbackStyle = 6;
        } else if (newVolumeIntensity <= 0.2) {
          newMicFeedbackStyle = 8;
        } else if (newVolumeIntensity <= 0.25) {
          newMicFeedbackStyle = 10;
        } else {
          newMicFeedbackStyle = 10;
        }

        setLevel(newMicFeedbackStyle);
      }, 500);
      return () => clearInterval(levelInterval);
    }
  }, [localAudio]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVolume((prevVolume) => (prevVolume + 1) % 9);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const baseClasses = "flex items-center justify-center w-4 h-4 focus:outline-none transition-colors duration-200";
  const activeClasses = iconColor ? iconColor : "text-gray-700";
  const hoverClasses = "cursor-pointer";

  const micAnimation = [...Array(level)].map((_, index) => (
    <div
      key={index}
      className={`absolute left-1/2 bottom-full w-1 bg-green-500 rounded-full transform -translate-x-1/2 transition-all duration-300 ease-in-out ${
        index < volume ? "opacity-100" : "opacity-0"
      }`}
      style={{
        height: `${(index + 1) * 0.5}px`,
        bottom: `calc(100% + ${index * 1}px)`,
      }}
    ></div>
  ));

  return (
    <div className={`${baseClasses} ${activeClasses} ${hoverClasses}`} id={`uikit-preview-mic-volume-icon`}>
      <Mic size={20} className="text-white" strokeWidth={2} />
      <span
        style={{
          display: "flex",
          position: "relative",
          justifyContent: "center",
          left: "-8px",
          bottom: "-3px",
        }}
      >
        {micAnimation}
      </span>
    </div>
  );
};

export default PreviewAnimatedMicVolume;
