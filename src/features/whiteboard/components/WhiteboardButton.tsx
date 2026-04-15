import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useAppSelector,
  useSessionUISelector,
  useSessionSelector,
  useWhiteboardSelector,
  useSubsessionSelector,
} from "@/hooks/useAppSelector";
import ToggleButton from "@/components/widget/ToggleButton";
import { Participant } from "@/types";
import { useCurrentUser } from "@/features/participant/hooks";
import { WHITEBOARD_STATUS } from "../whiteboardSlice";
import WhiteboardIcon from "@/components/svg-icon/WhiteboardIcon";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";
import { SubsessionUserStatus } from "@zoom/videosdk";
import { useWhiteboardToggle } from "../hooks/useWhiteboardToggle";

interface WhiteboardButtonProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orientation: "horizontal" | "vertical";
}

export const WhiteboardButton: React.FC<WhiteboardButtonProps> = ({
  isMenuOpen: isWhiteboardMenuOpen,
  setIsMenuOpen: setIsWhiteboardMenuOpen,
  orientation = "horizontal",
}) => {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLDivElement>(null);
  const whiteboard = useAppSelector(useWhiteboardSelector);
  const { themeName } = useAppSelector(useSessionUISelector);
  const session = useAppSelector(useSessionSelector);
  const currentUser: Participant = useCurrentUser();
  const { subUserStatus } = useAppSelector(useSubsessionSelector);
  const isInSubsession = subUserStatus === SubsessionUserStatus.InSubsession;

  const {
    canStartWhiteboard,
    handleWhiteboardToggle: handleWhiteboardClick,
    showScreenShareConfirm,
    setShowScreenShareConfirm,
    handleConfirmStartWhiteboard,
  } = useWhiteboardToggle();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsWhiteboardMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsWhiteboardMenuOpen]);

  // const handlePrivilegeChange = useCallback(
  //   (isLock: boolean) => {
  //     dispatch(setIsLockWhiteboard(isLock));
  //     setIsWhiteboardMenuOpen(false);
  //   },
  //   [dispatch, setIsWhiteboardMenuOpen, whiteboardClient],
  // );

  // Don't render if current user is not available yet or whiteboard feature is disabled
  if (
    !currentUser ||
    !session.featuresOptions?.whiteboard?.enable ||
    (!canStartWhiteboard() && whiteboard.presenterID !== currentUser.userId)
  ) {
    return null;
  }

  if (isInSubsession) {
    return null;
  }

  const iconColor = themeName === "dark" ? "white" : "black";
  const isActive = whiteboard.isWhiteboardOpen && whiteboard.presenterID === currentUser.userId;
  const isViewing = whiteboard.isWhiteboardOpen && whiteboard.presenterID !== currentUser.userId;

  const getButtonTitle = () => {
    if (whiteboard.status === WHITEBOARD_STATUS.Pending) {
      return t("whiteboard.loading_message");
    }
    if (isActive) return t("whiteboard.presenting_tooltip");
    if (isViewing) return t("whiteboard.viewing_tooltip");
    // Show tooltip for attendees when whiteboard is host-only
    if (!canStartWhiteboard()) {
      return t("whiteboard.restricted_tooltip");
    }
    return t("whiteboard.start_tooltip");
  };

  const getButtonColor = () => {
    if (isActive) return "bg-green-500";
    return "";
  };

  const getHoverColor = () => {
    if (isActive) return "hover:bg-green-600";
    return "hover:bg-theme-background";
  };

  return (
    <div className="relative" ref={buttonRef}>
      <ToggleButton
        id={"uikit-footer-whiteboard"}
        icon={(props: any) => <WhiteboardIcon {...props} isDark={themeName === "dark"} />}
        isActive={isActive || isViewing}
        onClick={handleWhiteboardClick}
        onChevronUpClick={(e: React.MouseEvent<HTMLDivElement>) => {
          setIsWhiteboardMenuOpen(!isWhiteboardMenuOpen);
          e.stopPropagation();
        }}
        themeName={themeName}
        bgColor={getButtonColor()}
        iconColor={iconColor}
        chevronUpColor={iconColor}
        hoverColor={getHoverColor()}
        isShowChevron={false}
        orientation={orientation}
        title={getButtonTitle()}
        disabled={
          whiteboard.isLoading ||
          !canStartWhiteboard() ||
          session.isReceivingScreenShare ||
          WHITEBOARD_STATUS.Pending === whiteboard.status ||
          isActive ||
          isViewing
        }
        ref={toggleButtonRef}
        // menuContent={
        //   <WhiteboardMenuOption
        //     title="Whiteboard Settings"
        //     orientation={orientation}
        //     isLock={whiteboard.isLock}
        //     onPrivilegeChange={handlePrivilegeChange}
        //     isOpen={isWhiteboardMenuOpen}
        //     setIsOpen={setIsWhiteboardMenuOpen}
        //     excludeRefs={[toggleButtonRef]}
        //   />
        // }
      />
      {showScreenShareConfirm && (
        <ConfirmDialog
          onClose={() => setShowScreenShareConfirm(false)}
          onConfirm={handleConfirmStartWhiteboard}
          title={t("share.stop_screen_share_title")}
          message={t("whiteboard.stop_screen_share_confirm")}
          confirmText={t("whiteboard.start_button")}
          cancelText={t("common.cancel")}
        />
      )}
    </div>
  );
};
