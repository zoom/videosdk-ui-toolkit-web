import React, { useState, useContext, useCallback, useRef } from "react";
import { LogOut } from "lucide-react";
import { ClientContext } from "@/context/client-context";
import {
  useAppSelector,
  useSessionSelector,
  useSubsessionSelector,
  useWhiteboardSelector,
} from "@/hooks/useAppSelector";
import { SubsessionStatus, SubsessionUserStatus } from "@zoom/videosdk";
import sessionAdditionalContext from "@/context/session-additional-context";
import CommonDropdownWrap from "../widget/CommonDropdownWrap";
import { useWhiteboardExportDialog } from "@/features/whiteboard/components/WhiteboardExportConfirmDialog";
import { useCurrentUser } from "@/features/participant/hooks";
import { WHITEBOARD_STATUS } from "@/features/whiteboard/constant";

export const LeaveButton = ({
  isHostOrManager,
  orientation = "horizontal",
}: {
  isHostOrManager: boolean;
  orientation?: "horizontal" | "vertical";
}) => {
  const client = useContext(ClientContext);
  const session = useAppSelector(useSessionSelector);
  const { subsessionClient } = useContext(sessionAdditionalContext);
  const { currentSubRoom, subStatus, subsessionOptions } = useAppSelector(useSubsessionSelector);
  const whiteboard = useAppSelector(useWhiteboardSelector);
  const currentUser = useCurrentUser();
  const { openExportDialog } = useWhiteboardExportDialog();
  const isInRoom =
    subStatus === SubsessionStatus.InProgress && currentSubRoom.userStatus === SubsessionUserStatus.InSubsession;
  const [isOpen, setIsOpen] = useState(false);

  // Check if current user is presenting whiteboard
  const isPresenter = currentUser && whiteboard.presenterID === currentUser.userId;
  const shouldCheckExport = !whiteboard.isDisableExport && isPresenter;
  const isWhiteboardOpen = whiteboard?.status === WHITEBOARD_STATUS.InProgress;

  const onLeave = useCallback(
    (isEnd: boolean) => {
      // If user is presenting whiteboard and export is enabled, show export dialog
      if (shouldCheckExport && isWhiteboardOpen) {
        openExportDialog(true); // true = export and close
        setIsOpen(false);
        return;
      }

      // Normal leave logic
      if (session.isHost) {
        client.leave(isEnd);
      } else {
        client.leave(isEnd);
      }
      setIsOpen(false);
    },
    [client, session.isHost, shouldCheckExport, isWhiteboardOpen, openExportDialog],
  );

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const normalClass =
    "w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 transition-colors duration-200 rounded-lg";

  const dangerClass =
    "w-full px-4 py-2 text-left text-theme-text-button bg-red-500 hover:bg-red-600 transition-colors duration-200";
  const normalLeave = (
    <>
      {!isInRoom && session.isManager && (
        <button
          className={dangerClass}
          onClick={() => {
            client.reclaimHost();
          }}
          id="reclaim-host-button"
        >
          Reclaim Host
        </button>
      )}
      {session.isHost && (
        <button
          className={dangerClass}
          onClick={() => {
            onLeave(true);
          }}
          id="end-for-all-button"
        >
          End Session
        </button>
      )}
    </>
  );

  const subsessionLeave = isInRoom && (isHostOrManager || subsessionOptions?.isBackToMainSessionEnabled) && (
    <button
      className="w-full px-4 py-2 text-left text-theme-text-button bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
      onClick={() => {
        subsessionClient.leaveSubsession();
        setIsOpen(false);
      }}
      id="leave-subsession-button"
    >
      Leave Subsession
    </button>
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative">
      <button
        className={`h-10 ${
          orientation === "vertical" ? "rounded-lg w-full justify-center" : "rounded-full w-10"
        } flex items-center justify-center transition-all duration-200 border border-theme-border bg-red-500 shadow-md hover:bg-red-600 hover:shadow-lg active:bg-red-800 active:shadow-inner`}
        onClick={handleButtonClick}
        id="leave-button"
        ref={buttonRef}
      >
        <LogOut size={24} className="text-white" />
      </button>
      <CommonDropdownWrap
        isOpen={isOpen}
        buttonRef={buttonRef}
        position={orientation === "vertical" ? "bottom-end" : "top-end"}
        wrapperClass={`${orientation === "vertical" ? "rounded-lg" : "rounded-full"}`}
        onClickOutside={() => setIsOpen(false)}
      >
        <div
          className="bg-white rounded-lg bg-theme-surface border border-theme-border shadow-xl overflow-hidden"
          style={{ width: "200px" }}
        >
          {normalLeave}
          <button
            className={normalClass}
            onClick={() => {
              onLeave(false);
            }}
            id="leave-meeting-button"
          >
            Leave Session
          </button>
          {subsessionLeave}
        </div>
      </CommonDropdownWrap>
    </div>
  );
};
