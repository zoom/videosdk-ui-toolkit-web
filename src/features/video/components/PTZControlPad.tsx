/* eslint-disable no-console */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Circle, Plus, Minus, Sun, Moon } from "lucide-react";
import { CommonPopper } from "@/components/widget/CommonPopper";

const PTZControlPad = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeDirection, setActiveDirection] = useState(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Common class combinations
  const baseButton =
    "transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95";

  const roundButton = `${baseButton} rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-theme-text-button 
    hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-100 dark:active:bg-gray-800`;

  const directionButton = `${baseButton} w-14 h-14 bg-white dark:bg-gray-700 text-gray-700 dark:text-theme-text-button 
    hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-100 dark:active:bg-gray-800 group`;

  const centerButton = `${baseButton} w-20 h-20 rounded-full text-theme-text-button 
    bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700
    hover:from-blue-300 hover:to-blue-500 dark:hover:from-blue-400 dark:hover:to-blue-600
    active:from-blue-500 active:to-blue-700 dark:active:from-blue-600 dark:active:to-blue-800 group`;

  // Clean up intervals and timeouts
  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
    setActiveDirection(null);
    setIsDragging(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleAction = useCallback((action) => {
    // Simulate PTZ actions
    switch (action) {
      case "zoom-in":
        console.log("Zooming in...");
        break;
      case "zoom-out":
        console.log("Zooming out...");
        break;
      case "up":
        console.log("Moving up...");
        break;
      case "right":
        console.log("Moving right...");
        break;
      case "down":
        console.log("Moving down...");
        break;
      case "left":
        console.log("Moving left...");
        break;
      case "reset":
        console.log("Resetting position...");
        break;
      default:
        break;
    }
  }, []);

  // Handle continuous action
  const handleContinuousAction = useCallback(
    (action, isStart) => {
      cleanup();

      if (!isStart) return;

      setActiveDirection(action);
      setIsDragging(true);

      // Initial delay before starting continuous movement
      const startContinuous = () => {
        handleAction(action);
        intervalRef.current = setInterval(() => {
          handleAction(action);
        }, 100); // Adjust interval for smoother or faster continuous movement
      };

      // Start after a short delay
      timeoutRef.current = setTimeout(startContinuous, 200);
    },
    [cleanup, handleAction],
  );

  return (
    <CommonPopper isOpen={true} onClose={() => {}} title="PTZ Controller" width={600} height={500}>
      <div className="flex flex-col items-center gap-8 p-8 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-950 transition-colors duration-300">
        {/* Zoom controls */}
        <div className="flex gap-20 w-full justify-center">
          {[
            { icon: Plus, action: "zoom-in" },
            { icon: Minus, action: "zoom-out" },
          ].map(({ icon: Icon, action }) => (
            <button
              key={action}
              onMouseDown={() => handleContinuousAction(action, true)}
              onMouseUp={() => handleContinuousAction(action, false)}
              onMouseLeave={() => handleContinuousAction(action, false)}
              onTouchStart={() => handleContinuousAction(action, true)}
              onTouchEnd={() => handleContinuousAction(action, false)}
              className={`${roundButton} p-3 ${activeDirection === action ? "scale-95 bg-gray-100 dark:bg-gray-600" : ""}`}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Control wheel */}
        <div className="relative w-64 h-64">
          {/* Rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-white dark:from-gray-700 dark:to-gray-800 shadow-xl" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-inner" />

          {/* Controls */}
          <div className="absolute inset-8">
            {[
              { dir: "up", icon: ChevronUp, pos: "top-0 left-1/2 -translate-x-1/2 rounded-t-2xl" },
              { dir: "right", icon: ChevronRight, pos: "right-0 top-1/2 -translate-y-1/2 rounded-r-2xl" },
              { dir: "down", icon: ChevronDown, pos: "bottom-0 left-1/2 -translate-x-1/2 rounded-b-2xl" },
              { dir: "left", icon: ChevronLeft, pos: "left-0 top-1/2 -translate-y-1/2 rounded-l-2xl" },
            ].map(({ dir, icon: Icon, pos }) => (
              <button
                key={dir}
                onMouseDown={() => handleContinuousAction(dir, true)}
                onMouseUp={() => handleContinuousAction(dir, false)}
                onMouseLeave={() => handleContinuousAction(dir, false)}
                onTouchStart={() => handleContinuousAction(dir, true)}
                onTouchEnd={() => handleContinuousAction(dir, false)}
                className={`${directionButton} absolute ${pos} ${activeDirection === dir ? "scale-95 bg-gray-100 dark:bg-gray-600" : ""}`}
              >
                <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
              </button>
            ))}

            {/* Center button */}
            <button
              onClick={() => handleAction("reset")}
              className={centerButton + " absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}
            >
              <Circle className="w-10 h-10 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mt-2 px-6 py-2 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm shadow-md transition-colors duration-300">
          {activeDirection ? `Moving: ${activeDirection}` : "Ready"}
        </div>
      </div>
    </CommonPopper>
  );
};

export default PTZControlPad;
