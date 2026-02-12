import React, { useRef, useEffect, useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { MonitorUp } from "lucide-react";
import { ShareMenuOption } from "./ShareMenuOption";
import {
  useAppDispatch,
  useAppSelector,
  useSessionSelector,
  useSessionUISelector,
  useWhiteboardSelector,
} from "@/hooks/useAppSelector";
import ToggleButton from "@/components/widget/ToggleButton";
import { Participant } from "@/types";
import { useCurrentUser } from "@/features/participant/hooks";
import { setSharePrivilege } from "@/store/sessionSlice";
import { useToggleScreenShare } from "../hooks";
import { SharePrivilege, SubsessionStatus } from "@zoom/videosdk";
import sessionAdditionalContext from "@/context/session-additional-context";
import { setIsShareTypeMenuOpen } from "@/store/uiSlice";
import { useSubsessionRoom } from "@/features/subsession/hooks/useSubsessionRoom";
import { StreamContext } from "@/context/stream-context";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";
import { setWhiteboardStatus, WHITEBOARD_STATUS } from "@/features/whiteboard/whiteboardSlice";

interface ShareScreenButtonProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orientation: "horizontal" | "vertical";
}

export const ShareScreenButton: React.FC<ShareScreenButtonProps> = ({
  isMenuOpen: isShareMenuOpen,
  setIsMenuOpen: setIsShareMenuOpen,
  orientation = "horizontal",
}) => {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLDivElement>(null);
  const shareTypeMenuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const isShareTypeMenuOpen = useAppSelector((state) => state.ui.isShareTypeMenuOpen);
  const { stream } = useContext(StreamContext);
  const [showWhiteboardConfirm, setShowWhiteboardConfirm] = useState(false);
  const [pendingShareToSubsession, setPendingShareToSubsession] = useState<boolean | undefined>(undefined);
  const whiteboard = useAppSelector(useWhiteboardSelector);
  const { whiteboardClient } = useContext(sessionAdditionalContext);

  const { isSendingScreenShare } = useAppSelector(useSessionSelector);
  const { themeName } = useAppSelector(useSessionUISelector);
  const { subsessionClient } = useContext(sessionAdditionalContext);
  const currentUser: Participant = useCurrentUser();
  const isHostOrManager = currentUser?.isHost || currentUser?.isManager;

  const { toggleScreenShare } = useToggleScreenShare();
  const { isInSubsession } = useSubsessionRoom();

  const { sharePrivilege } = useAppSelector(useSessionSelector);

  const canShareToSubsession =
    isHostOrManager && subsessionClient?.getSubsessionStatus() === SubsessionStatus.InProgress && !isInSubsession;
  const isPresentingWhiteboard = whiteboard.isWhiteboardOpen && whiteboard.presenterID === currentUser.userId;
  const isViewingWhiteboard = whiteboard.isWhiteboardOpen && whiteboard.presenterID !== currentUser.userId;

  const handleShareClick = (e?: React.MouseEvent) => {
    if (!isSendingScreenShare && whiteboard.isWhiteboardOpen) {
      // Show confirmation dialog if whiteboard is open
      setShowWhiteboardConfirm(true);
      setPendingShareToSubsession(undefined);
    } else if (canShareToSubsession && !isSendingScreenShare) {
      dispatch(setIsShareTypeMenuOpen(true));
      e?.stopPropagation();
    } else {
      toggleScreenShare();
    }
  };

  const handleConfirmStartScreenShare = useCallback(async () => {
    setShowWhiteboardConfirm(false);
    if (!isHostOrManager) {
      return;
    }

    if (!whiteboard.isWhiteboardOpen) {
      return;
    }
    try {
      // Stop whiteboard first
      await whiteboardClient.stopWhiteboardScreen();

      dispatch(setWhiteboardStatus(WHITEBOARD_STATUS.Closed));

      // Start screen share
      if (pendingShareToSubsession !== undefined) {
        toggleScreenShare(pendingShareToSubsession);
      } else if (canShareToSubsession) {
        dispatch(setIsShareTypeMenuOpen(true));
      } else {
        toggleScreenShare();
      }
    } catch {
      // Failed to stop whiteboard and start screen share
    }
  }, [
    whiteboardClient,
    pendingShareToSubsession,
    canShareToSubsession,
    toggleScreenShare,
    dispatch,
    isHostOrManager,
    whiteboard.isWhiteboardOpen,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle share menu
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsShareMenuOpen(false);
      }

      // Handle share type menu
      if (
        shareTypeMenuRef.current &&
        !shareTypeMenuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        dispatch(setIsShareTypeMenuOpen(false));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch, setIsShareMenuOpen]);

  useEffect(() => {
    const subsessionStatus = subsessionClient?.getSubsessionStatus();
    if (subsessionStatus !== SubsessionStatus.InProgress) {
      dispatch(setIsShareTypeMenuOpen(false));
    }
  }, [subsessionClient, dispatch]);

  const iconColor = themeName === "dark" ? "white" : "black";

  const handlePrivilegeChange = useCallback(
    (newPrivilege: SharePrivilege) => {
      stream.setSharePrivilege(newPrivilege);
      dispatch(setSharePrivilege(newPrivilege));
      setIsShareMenuOpen(false);
    },
    [dispatch, setIsShareMenuOpen, stream],
  );

  const shareTypeMenu = isShareTypeMenuOpen && (
    <div
      ref={shareTypeMenuRef}
      className="absolute bottom-full left-0 mb-2 bg-theme-surface border border-theme-border text-theme-text rounded-lg shadow-lg w-64 z-50"
    >
      <div className="py-1">
        <button
          className="w-full px-4 py-2 text-left hover:bg-theme-background text-sm text-theme-text"
          onClick={() => {
            if (whiteboard.isWhiteboardOpen) {
              setPendingShareToSubsession(false);
              setShowWhiteboardConfirm(true);
            } else {
              toggleScreenShare(false);
            }
            dispatch(setIsShareTypeMenuOpen(false));
          }}
        >
          Share to Main Session Only
        </button>
        <button
          className="w-full px-4 py-2 text-left hover:bg-theme-background text-sm "
          onClick={() => {
            if (whiteboard.isWhiteboardOpen) {
              setPendingShareToSubsession(true);
              setShowWhiteboardConfirm(true);
            } else {
              toggleScreenShare(true);
            }
            dispatch(setIsShareTypeMenuOpen(false));
          }}
        >
          Share to Main Session and Subsessions
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative" ref={buttonRef}>
      <ToggleButton
        id={"uikit-footer-share-screen"}
        icon={MonitorUp}
        isActive={isSendingScreenShare}
        onClick={handleShareClick}
        onChevronUpClick={(e: React.MouseEvent<HTMLDivElement>) => {
          setIsShareMenuOpen(!isShareMenuOpen);
          e.stopPropagation();
        }}
        themeName={themeName}
        bgColor={isSendingScreenShare ? "bg-green-500" : ""}
        iconColor={iconColor}
        chevronUpColor={iconColor}
        hoverColor={isSendingScreenShare ? "hover:bg-green-600" : "hover:bg-theme-background"}
        isShowChevron={isHostOrManager}
        orientation={orientation}
        title="share-screen"
        ref={toggleButtonRef}
        disabled={!isPresentingWhiteboard && isViewingWhiteboard && isHostOrManager}
        menuContent={
          <ShareMenuOption
            title={t("share.screen_settings_title")}
            orientation={orientation}
            privilege={sharePrivilege}
            onPrivilegeChange={handlePrivilegeChange}
            isOpen={isShareMenuOpen}
            setIsOpen={setIsShareMenuOpen}
            excludeRefs={[toggleButtonRef]}
          />
        }
      />
      {shareTypeMenu}
      {showWhiteboardConfirm && (
        <ConfirmDialog
          onClose={() => {
            setShowWhiteboardConfirm(false);
            setPendingShareToSubsession(undefined);
          }}
          onConfirm={handleConfirmStartScreenShare}
          title={t("share.stop_whiteboard_title")}
          message={
            isHostOrManager
              ? "Starting screen share will stop the current whiteboard session. Do you want to continue?"
              : "Other are sharing with whiteboard. Please ask the host to stop whiteboard."
          }
          confirmText={isHostOrManager ? "Start Screen Share" : "OK"}
          cancelText="Cancel"
        />
      )}
    </div>
  );
};
