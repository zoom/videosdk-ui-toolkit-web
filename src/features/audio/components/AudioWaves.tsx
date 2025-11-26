import React, { useContext, useEffect, useState } from "react";
import { ClientContext } from "@/context/client-context";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { useCurrentAudioLevel } from "../hooks/useCurrentAudioLevel";
import "./AudioWaves.scss";

// todohttps://wavesurfer.xyz/examples/?record.js
export const AudioWaves: React.FC = () => {
  const client = useContext(ClientContext);
  const { userId } = useAppSelector(useSessionSelector);
  const level = useCurrentAudioLevel(client, userId, false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (level > 0) {
      setIsActive(true);
    } else {
      const timer = setTimeout(() => {
        setIsActive(false);
      }, 1000); // Delay to start fade-out
      return () => clearTimeout(timer);
    }
  }, [level]);

  if (!isActive) return null;

  return (
    <div className={`relative w-10 h-8 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
        {[...Array(10)].map((_, index) => (
          <div
            key={`sound-animate-wave-${index}`}
            className="sound absolute bottom-0 w-[3px] bg-[#E20074] transition-all duration-500"
            style={{
              left: `${index * 4}px`,
              animation: `sound ${400 + Math.random() * 100}ms -800ms linear infinite alternate`,
              height: "28px", // Max height when active, min height when inactive
            }}
          />
        ))}
      </div>
    </div>
  );
};

const AppleWaveform2 = () => {
  // Generate bars with varying base heights for more natural look
  const bars = Array.from({ length: 40 }, () => ({
    baseHeight: 8 + Math.random() * 8,
    delay: Math.random() * 0.5,
  }));

  return (
    <div className="flex items-center justify-center h-40 bg-gradient-to-b from-gray-900 to-black p-8 rounded-xl shadow-2xl">
      <div className="relative flex items-center space-x-[2px] px-6 py-4">
        {/* Glow effect container */}
        <div className="absolute inset-0 bg-blue-500/20 blur-xl" />

        {/* Bars container */}
        <div className="relative flex items-center space-x-[2px] z-10">
          {bars.map((bar, index) => (
            <div
              key={index}
              className="group"
              style={{
                animation: `pulse 2s ease-in-out infinite`,
                animationDelay: `${bar.delay}s`,
              }}
            >
              <div
                className="w-[3px] bg-gradient-to-t from-blue-600 via-blue-400 to-blue-300 rounded-full 
                          transition-all duration-200 hover:from-blue-500 hover:via-blue-300 hover:to-blue-200"
                style={{
                  height: `${bar.baseHeight}px`,
                  animation: `wave 2s ease-in-out infinite`,
                  animationDelay: `${index * 40}ms`,
                }}
              />
              <style>{`
                @keyframes wave {
                  0%,
                  100% {
                    transform: scaleY(1);
                  }
                  50% {
                    transform: scaleY(${2.5 + Math.random() * 1.5});
                  }
                }
                @keyframes pulse {
                  0%,
                  100% {
                    opacity: 0.95;
                  }
                  50% {
                    opacity: 0.7;
                  }
                }
              `}</style>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
