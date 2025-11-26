import React, { useRef, useMemo } from "react";
import { X } from "lucide-react";
import Draggable from "react-draggable";
import { CommonPopperMobile } from "./CommonPopperMobile";
import { isMobileDeviceNotIpad } from "../util/service";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setActivePopper } from "@/store/uiSlice";
import { THEME_COLOR_CLASS } from "@/constant";

interface CommonPopperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  sidePanel?: boolean | null;
  id?: string;
  isDraggable?: boolean;
}

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

export const CommonPopper: React.FC<CommonPopperProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width,
  height,
  sidePanel = false,
  id = "",
  isDraggable = true,
}) => {
  const nodeRef = useRef(null);
  const dispatch = useAppDispatch();
  const { activePopper, themeName } = useAppSelector(useSessionUISelector);
  const contentWidth = width || DEFAULT_WIDTH;
  const contentHeight = height || DEFAULT_HEIGHT;
  const initPosition = useMemo(() => {
    const x = (window.innerWidth - contentWidth) / 2;
    const y = (window.innerHeight - contentHeight) / 2;
    return { x, y };
  }, [contentHeight, contentWidth]);

  if (!isOpen) return null;

  if (isMobileDeviceNotIpad()) {
    return (
      <CommonPopperMobile
        isOpen={isOpen}
        title={title}
        onClose={(e) => {
          onClose();
          e.stopPropagation();
        }}
      >
        {children}
      </CommonPopperMobile>
    );
  }

  const borderColor = "border border-theme-border rounded-lg";

  let tmpTitle = title;
  if (title.indexOf("Subsession") !== -1) {
    tmpTitle = "Subsession";
  }
  const childrenContent = (
    <div
      ref={nodeRef}
      id={id}
      className={`fixed flex flex-col font-sans shadow-lg ${activePopper === tmpTitle ? "z-20" : "z-10"} ${THEME_COLOR_CLASS} ${borderColor}`}
      style={{
        width: `${contentWidth}px`,
        height: `${contentHeight}px`,
      }}
      onClick={() => {
        dispatch(setActivePopper(tmpTitle));
      }}
    >
      {!sidePanel && title && (
        <div
          className={`uikit-common-popper-header handle relative flex items-center justify-center px-6 py-4 cursor-move border-b border-theme-border`}
        >
          {/* <button
            onClick={onClose}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Minimize2 size={20} />
          </button> */}
          <h2 className={`text-lg ${THEME_COLOR_CLASS} font-medium `}>{title}</h2>
          {onClose && (
            <button
              onClick={(e) => {
                onClose();
                e.stopPropagation();
              }}
              onTouchEnd={(e) => {
                onClose();
                e.stopPropagation();
              }}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors p-2`}
              id={`${id ? `${id}-close-button` : ""}`}
            >
              <X size={20} />
            </button>
          )}
        </div>
      )}
      <div className="flex-grow overflow-hidden pb-1">{children}</div>
    </div>
  );
  if (sidePanel || !isDraggable) {
    return childrenContent;
  }
  return (
    <Draggable
      bounds="body"
      nodeRef={nodeRef}
      handle=".handle"
      defaultPosition={{ x: initPosition.x, y: initPosition.y }}
    >
      {childrenContent}
    </Draggable>
  );
};
