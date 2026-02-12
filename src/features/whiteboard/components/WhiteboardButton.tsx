import React, { useRef, useEffect, useCallback, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  useAppSelector,
  useSessionUISelector,
  useSessionSelector,
  useAppDispatch,
  useWhiteboardSelector,
  useSubsessionSelector,
} from "@/hooks/useAppSelector";
import ToggleButton from "@/components/widget/ToggleButton";
import { Participant } from "@/types";
import { useCurrentUser } from "@/features/participant/hooks";
import { setWhiteboardLoading, WHITEBOARD_STATUS, setWhiteboardError } from "../whiteboardSlice";
import WhiteboardIcon from "@/components/svg-icon/WhiteboardIcon";
import sessionAdditionalContext from "@/context/session-additional-context";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";
import { StreamContext } from "@/context/stream-context";
import { setIsSendingScreenShare } from "@/store/sessionSlice";
import { ERROR_START_WHITEBOARD, WHITEBOARD_CONTAINER_INNER_ID, WHITEBOARD_ERROR_MESSAGE } from "../constant";
import { SubsessionUserStatus } from "@zoom/videosdk";

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
  const dispatch = useAppDispatch();
  const { whiteboardClient } = useContext(sessionAdditionalContext);
  const whiteboard = useAppSelector(useWhiteboardSelector);
  const { themeName } = useAppSelector(useSessionUISelector);
  const session = useAppSelector(useSessionSelector);
  const currentUser: Participant = useCurrentUser();
  const [showScreenShareConfirm, setShowScreenShareConfirm] = useState(false);
  const { stream } = useContext(StreamContext);
  const isHostOrManager = currentUser?.isHost || currentUser?.isManager;
  const { subUserStatus } = useAppSelector(useSubsessionSelector);
  const isInSubsession = subUserStatus === SubsessionUserStatus.InSubsession;

  // Check if user can start whiteboard based on privilege
  const canStartWhiteboard = useCallback(() => {
    if (whiteboard.enabled && isHostOrManager) {
      return true;
    }
    if (whiteboard.isLock && !isHostOrManager) {
      return false;
    }
    if (isInSubsession) {
      return false;
    }
    if (!isHostOrManager) {
      return false;
    }
    return whiteboardClient.canStartWhiteboard();
  }, [whiteboardClient, whiteboard.enabled, isHostOrManager, isInSubsession, whiteboard.isLock]);

  const handleWhiteboardClick = useCallback(async () => {
    if (!currentUser) {
      return;
    }
    if (!canStartWhiteboard()) {
      return;
    }

    // Don't allow clicking if whiteboard is not initialized yet
    if (whiteboard.status === WHITEBOARD_STATUS.Pending) {
      return;
    }

    if (whiteboard.isWhiteboardOpen) {
      // If we're presenting, stop whiteboard
      if (whiteboard.presenterID === currentUser.userId || isHostOrManager) {
        await whiteboardClient.stopWhiteboardScreen();
      } else {
        // If viewing someone else's whiteboard, leave it
        await whiteboardClient.stopWhiteboardView();
      }
    } else {
      // Check if screen sharing is active
      if (session.isSendingScreenShare || session.isReceivingScreenShare) {
        setShowScreenShareConfirm(true);
      } else {
        dispatch(setWhiteboardLoading(true));

        await whiteboardClient
          .startWhiteboardScreen(document.getElementById(WHITEBOARD_CONTAINER_INNER_ID), {
            isDisableExport: whiteboard.isDisableExport,
          })
          .catch(() => {
            dispatch(
              setWhiteboardError({
                errorCode: ERROR_START_WHITEBOARD,
                errorMessage: WHITEBOARD_ERROR_MESSAGE[ERROR_START_WHITEBOARD],
              }),
            );
            dispatch(setWhiteboardLoading(false));
          });
      }
    }
  }, [
    currentUser,
    canStartWhiteboard,
    whiteboard.status,
    whiteboard.isWhiteboardOpen,
    whiteboard.presenterID,
    whiteboard.isDisableExport,
    whiteboardClient,
    session.isSendingScreenShare,
    session.isReceivingScreenShare,
    dispatch,
    isHostOrManager,
  ]);

  const handleConfirmStartWhiteboard = useCallback(async () => {
    setShowScreenShareConfirm(false);
    try {
      // Stop screen sharing first
      await stream.stopShareScreen();
      dispatch(setIsSendingScreenShare(false));

      // Start whiteboard
      dispatch(setWhiteboardLoading(true));

      await whiteboardClient
        .startWhiteboardScreen(document.getElementById(WHITEBOARD_CONTAINER_INNER_ID), {
          isDisableExport: whiteboard.isDisableExport,
        })
        .catch(() => {
          dispatch(
            setWhiteboardError({
              errorCode: ERROR_START_WHITEBOARD,
              errorMessage: WHITEBOARD_ERROR_MESSAGE[ERROR_START_WHITEBOARD],
            }),
          );
          dispatch(setWhiteboardLoading(false));
        });
    } catch {
      // Failed to stop screen share and start whiteboard
    }
  }, [stream, dispatch, whiteboardClient, whiteboard.isDisableExport]);

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
