import React, { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { isPortrait } from "../util/service";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";

interface CommonPopperProps {
  isOpen: boolean;
  onClose: (e: React.MouseEvent) => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  closePosition?: "left" | "right";
  ref?: React.RefObject<HTMLDivElement>;
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
  ref,
}) => {
  const CommonPopperRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(!isPortrait());

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(!isPortrait());
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${THEME_COLOR_CLASS}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      ref={ref}
    >
      <header className="uikit-mobile-popper-header py-4 px-4 flex items-center justify-between border-b border-gray-200">
        {closePosition === "left" && (
          <button onClick={onClose} className="">
            <X size={24} />
          </button>
        )}
        <div className="font-semibold truncate" title={title}>
          {title}
        </div>
        <div className="w-6"></div> {/* Placeholder for balance */}
        {closePosition === "right" && (
          <button onClick={onClose} className="">
            <X size={24} />
          </button>
        )}
      </header>
      <div
        className={`flex-grow uikit-custom-scrollbar overflow-y-auto  sm:h-auto ${isLandscape ? "max-h-[calc(100vh-1rem)]" : "max-h-[calc(100vh-3rem)]"}`}
      >
        {children}
      </div>
    </div>
  );
};
