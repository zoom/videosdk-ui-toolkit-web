import React, { useState, useRef, useEffect } from "react";
import { Grid, UserSquare, ChevronDown, Minimize2 } from "lucide-react";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { SuspensionViewValue, SuspensionViewType } from "@/types/index.d";
import { setViewType } from "@/store/uiSlice";
import { THEME_COLOR_CLASS } from "@/constant";
import { ExposedEvents } from "@/events/event-constant";
import { emit } from "@/events/event-bus";

export default function ViewToggleDropdown() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const session = useAppSelector(useSessionSelector);

  const {
    isSendingScreenShare,
    isReceivingScreenShare,
    debug,
    config: {
      featuresOptions: {
        viewMode: { enable, viewModes },
      },
    },
    isSupportMultipleVideos,
  } = session;
  const { viewType, themeName } = useAppSelector(useSessionUISelector);

  const isScreenShare = isSendingScreenShare || isReceivingScreenShare;
  const isSupportGalleryView = viewModes.includes(SuspensionViewType.Gallery);
  const isSupportSpeakerView = viewModes.includes(SuspensionViewType.Speaker) && isSupportMultipleVideos;
  const isSupportMinimizedView = viewModes.includes(SuspensionViewType.Minimized);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleViewChange = (newView: SuspensionViewValue) => {
    dispatch(setViewType(newView));
    emit(ExposedEvents.EVENT_VIEW_TYPE_CHANGE, newView);
    setIsOpen(false);
  };
  const IconComponent = viewType === SuspensionViewType.Gallery ? Grid : UserSquare;

  const baseButtonClass = `
    flex items-center space-x-2 px-3 py-2 rounded-md
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black
  `;

  const mainButtonClass = `
    ${baseButtonClass}
    ${THEME_COLOR_CLASS}
    shadow-sm
  `;

  const dropdownButtonClass = `
    ${baseButtonClass}
    w-full text-left
  `;

  const activeClass = `bg-blue-100 text-blue-500`;
  const iconColor = themeName === "dark" ? "text-white disabled:text-gray-400" : "text-black disabled:text-gray-400";
  const borderColor = themeName === "dark" ? "border-solid border border-gray-100" : "";

  if (!enable) return null;
  return (
    <div className={`relative`} ref={dropdownRef}>
      <button
        className={mainButtonClass}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <IconComponent size={20} />
        {viewModes.length > 0 && (
          <ChevronDown
            size={16}
            className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isOpen && viewModes.length > 0 && (
        <div
          className={`
          absolute right-0 mt-2 w-48 rounded-md shadow-lg z-30
          transform transition-all duration-200 ease-in-out
          ${THEME_COLOR_CLASS}
          ${borderColor}
        `}
        >
          {isSupportGalleryView && (
            <button
              className={`${dropdownButtonClass} ${viewType === SuspensionViewType.Gallery ? activeClass : iconColor}`}
              onClick={() => handleViewChange(SuspensionViewType.Gallery)}
            >
              <Grid size={20} />
              <span>Gallery</span>
            </button>
          )}
          {isSupportSpeakerView && (
            <button
              className={`${dropdownButtonClass} ${viewType === SuspensionViewType.Speaker ? activeClass : iconColor}`}
              onClick={() => handleViewChange(SuspensionViewType.Speaker)}
              disabled={isScreenShare}
              title={isScreenShare ? "Can't use speaker view when screen sharing" : ""}
            >
              <UserSquare size={20} />
              <span>Speaker</span>
            </button>
          )}

          {isSupportMinimizedView && (
            <button
              className={`${dropdownButtonClass} ${viewType === SuspensionViewType.Minimized ? activeClass : iconColor}`}
              onClick={() => handleViewChange(SuspensionViewType.Minimized)}
              disabled={isScreenShare}
              title={isScreenShare ? "Can't use minimized view when screen sharing" : ""}
            >
              <Minimize2 size={20} />
              <span>Minimize</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
