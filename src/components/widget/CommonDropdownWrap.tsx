import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface CommonDropdownWrapProps {
  children: React.ReactNode;
  isOpen: boolean;
  buttonRef: React.RefObject<HTMLElement>;
  position?: "bottom" | "top" | "left" | "right" | "bottom-start" | "bottom-end" | "top-start" | "top-end" | string;
  onClickOutside?: () => void;
  wrapperClass?: string;
}

const CommonDropdownWrap = ({
  children,
  isOpen,
  buttonRef,
  position = "bottom",
  onClickOutside,
  wrapperClass = "",
}: CommonDropdownWrapProps) => {
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClickOutside?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
      window.addEventListener("orientationchange", onClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
      window.removeEventListener("orientationchange", onClickOutside);
      setIsPositionCalculated(false);
    };
  }, [buttonRef, isOpen, onClickOutside]);

  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const calculatePosition = () => {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        const availableSpace = {
          top: buttonRect.top,
          bottom: windowHeight - buttonRect.bottom,
          left: buttonRect.left,
          right: windowWidth - buttonRect.right,
        };

        const dropdownHeight = dropdownRect.height;
        const dropdownWidth = dropdownRect.width;
        const MARGIN = 8;

        let finalPosition = position;
        if (position.includes("bottom") && availableSpace.bottom < dropdownHeight + MARGIN) {
          finalPosition = finalPosition.replace("bottom", "top");
        } else if (position.includes("top") && availableSpace.top < dropdownHeight + MARGIN) {
          finalPosition = finalPosition.replace("top", "bottom");
        }

        let top = 0;
        let left = 0;

        switch (finalPosition) {
          case "bottom":
          case "bottom-start":
          case "bottom-end":
            top = Math.min(windowHeight - dropdownHeight - MARGIN, buttonRect.bottom + MARGIN);
            break;
          case "top":
          case "top-start":
          case "top-end":
            top = Math.max(MARGIN, buttonRect.top - dropdownHeight - MARGIN);
            break;
          case "left":
            top = Math.min(windowHeight - dropdownHeight - MARGIN, Math.max(MARGIN, buttonRect.top));
            left = Math.max(MARGIN, buttonRect.left - dropdownWidth - MARGIN);
            break;
          case "right":
            top = Math.min(windowHeight - dropdownHeight - MARGIN, Math.max(MARGIN, buttonRect.top));
            left = Math.min(windowWidth - dropdownWidth - MARGIN, buttonRect.right + MARGIN);
            break;
          default:
            // No default case
            break;
        }

        if (["bottom", "top"].includes(finalPosition)) {
          left = Math.min(
            windowWidth - dropdownWidth - MARGIN,
            Math.max(MARGIN, buttonRect.left + (buttonRect.width - dropdownWidth) / 2),
          );
        } else if (finalPosition.endsWith("-start")) {
          left = Math.min(windowWidth - dropdownWidth - MARGIN, Math.max(MARGIN, buttonRect.left));
        } else if (finalPosition.endsWith("-end")) {
          left = Math.min(windowWidth - dropdownWidth - MARGIN, Math.max(MARGIN, buttonRect.right - dropdownWidth));
        }

        setDropdownPosition({
          top: top + window.scrollY,
          left: left + window.scrollX,
        });
        setIsPositionCalculated(true);
      };

      calculatePosition();

      const handleReposition = () => {
        requestAnimationFrame(calculatePosition);
      };

      window.addEventListener("scroll", handleReposition, true);
      window.addEventListener("resize", handleReposition);

      return () => {
        window.removeEventListener("scroll", handleReposition, true);
        window.removeEventListener("resize", handleReposition);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, position]);

  if (!isOpen) return null;
  return createPortal(
    <div className="zoom-ui-toolkit-root">
      <div
        ref={dropdownRef}
        style={{
          position: "absolute",
          visibility: isPositionCalculated ? "visible" : "hidden",
          top: dropdownPosition?.top,
          left: dropdownPosition?.left,
          zIndex: 1000,
        }}
        className={`w-[200px] shadow-lg text-theme-text ${wrapperClass}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default CommonDropdownWrap;
