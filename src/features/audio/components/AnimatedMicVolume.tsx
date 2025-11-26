import React, { useState, useEffect, useContext } from "react";
import { Loader, Mic } from "lucide-react";
import { useCurrentAudioLevel } from "../hooks/useCurrentAudioLevel";
import { ClientContext } from "@/context/client-context";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";

const AnimatedMicVolume = ({ onClick, isLoading, id, disabled = false, themeName, orientation }) => {
  const [volume, setVolume] = useState(0);
  const client = useContext(ClientContext);
  const { userId } = useAppSelector(useSessionSelector);
  const level = useCurrentAudioLevel(client, userId, false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVolume((prevVolume) => (prevVolume + 1) % 9);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const baseClasses = `flex items-center justify-center ${
    orientation === "vertical" ? "w-10 h-10" : "w-10 h-10"
  } focus:outline-none transition-colors duration-200`;
  const activeClasses = "text-gray-700";
  const hoverClasses = !disabled && !isLoading && "hover:bg-theme-background cursor-pointer";
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
    <div className={`${baseClasses} ${activeClasses} ${hoverClasses}`} id={`${id}-button`}>
      <button
        className={`relative ${disabled && "opacity-70 cursor-not-allowed"}`}
        onClick={onClick}
        disabled={disabled}
      >
        {isLoading ? (
          <Loader size={20} className="animate-spin" />
        ) : (
          <Mic size={20} strokeWidth={2} color={themeName === "dark" ? "white" : "black"} />
        )}
        <span
          style={{
            display: "flex",
            position: "relative",
            justifyContent: "center",
            left: "0px",
            bottom: "8px",
          }}
        >
          {micAnimation}
        </span>
      </button>
    </div>
  );
};

export default AnimatedMicVolume;
