import { useEffect, useState, useRef, useMemo, useCallback, useContext } from "react";
import { MoreHorizontal } from "lucide-react";
import { IconCountButton } from "../widget/IconCountButton";
import sessionAdditionalContext from "@/context/session-additional-context";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsShowLiveStreamPanel } from "@/store/uiSlice";
import { useToggleScreenShare } from "@/features/share/hooks";

interface MoreMenuItemProps {
  title: string;
  onClick: () => void;
}

export const MoreButton = ({
  isSettingsOpen,
  onOpenSettings,
  themeName,
  orientation = "horizontal",
}: {
  isSettingsOpen: boolean;
  onOpenSettings: (isOpen: boolean) => void;
  themeName: string;
  orientation?: "horizontal" | "vertical";
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { liveStreamClient } = useContext(sessionAdditionalContext);
  const { isHost, featuresOptions, isSendingScreenShare } = useAppSelector(useSessionSelector);
  const { isShowLiveStreamPanel } = useAppSelector(useSessionUISelector);
  const dropdownRef = useRef(null);
  const moreButtonRef = useRef(null);
  const dispatch = useAppDispatch();
  const { startCameraShare, stopShare } = useToggleScreenShare();

  const isSupportLiveStream = featuresOptions?.livestream?.enable;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !moreButtonRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSettings = useCallback(() => {
    setIsOpen(false);
    onOpenSettings(true);
  }, [onOpenSettings]);

  const menuItems = useMemo(
    () =>
      [
        {
          title: "Settings",
          onClick: () => handleSettings(),
        },
        isSupportLiveStream &&
          isHost &&
          liveStreamClient?.isLiveStreamEnabled() && {
            title: "Live streaming",
            onClick: () => dispatch(setIsShowLiveStreamPanel(!isShowLiveStreamPanel)),
          },
        (featuresOptions as any)?.cameraShare?.enable &&
          !isSendingScreenShare && {
            title: "Share camera",
            onClick: () => startCameraShare(),
          },
        isSendingScreenShare && {
          title: "Stop share",
          onClick: () => stopShare(),
        },
      ].filter(Boolean),
    [
      handleSettings,
      isHost,
      liveStreamClient,
      isShowLiveStreamPanel,
      dispatch,
      isSupportLiveStream,
      isSendingScreenShare,
      startCameraShare,
      stopShare,
      featuresOptions,
    ],
  );

  return (
    <div className="relative">
      <IconCountButton
        icon={MoreHorizontal}
        isActive={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        ref={moreButtonRef}
        id="footer-more-button"
        themName={themeName}
        iconSize={24}
        orientation={orientation}
        className={orientation === "vertical" ? "w-10" : ""}
      />

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute bottom-full ${
            orientation === "vertical" ? "left-0 mb-1" : "right-0 mb-1"
          } bg-theme-surface z-30 border border-theme-border text-theme-text rounded-lg shadow-xl overflow-hidden bg-theme-surface`}
          style={{ width: "200px" }}
        >
          {menuItems.map((item: MoreMenuItemProps, idx) => {
            return (
              <button
                key={idx}
                className="w-full px-4 py-2 text-left text-theme-text hover:bg-theme-background transition-colors duration-200"
                onClick={item.onClick}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
