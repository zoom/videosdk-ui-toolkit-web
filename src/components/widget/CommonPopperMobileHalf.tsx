//todo: half screen popper
import React, { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { isPortrait } from "../util/service";

interface CommonPopperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  closePosition?: "left" | "right";
}

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

export const CommonPopperMobile: React.FC<CommonPopperProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width,
  height,
  closePosition = "left",
}) => {
  const CommonPopperRef = useRef(null);
  const [portrait, setPortrait] = useState(isPortrait());

  useEffect(() => {
    const handleResize = () => {
      setPortrait(isPortrait());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-white z-50 flex flex-col"
      style={{
        width: `${width}px`,
        height: portrait ? "50vh" : `${height}px`,
        top: portrait ? "50%" : "0",
      }}
    >
      <header className="uikit-mobile-popper-header bg-white py-4 px-4 flex items-center justify-between border-b border-gray-200">
        {closePosition === "left" && (
          <button onClick={onClose} className="text-gray-600">
            <X size={24} />
          </button>
        )}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="w-6"></div> {/* Placeholder for balance */}
        {closePosition === "right" && (
          <button onClick={onClose} className="text-gray-600">
            <X size={24} />
          </button>
        )}
      </header>
      <div className="flex-grow overflow-auto">{children}</div>
    </div>
  );
};
