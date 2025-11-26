import React, { useContext, useRef, useCallback } from "react";
import { Presentation, Users, Crown, X, User, Download } from "lucide-react";
import { useCurrentUser } from "@/features/participant/hooks";
import {
  useAppSelector,
  useParticipantSelector,
  useSessionSelector,
  useWhiteboardSelector,
} from "@/hooks/useAppSelector";
import SessionAdditionalClientContext from "@/context/session-additional-context";
import Draggable from "react-draggable";
import { Participant } from "@/types";
import { useWhiteboardExportDialog } from "./WhiteboardExportConfirmDialog";

const WhiteboardIndicatorBar: React.FC = () => {
  const {
    config: {
      featuresOptions: {
        whiteboard: { enableExport, enableViewerUserExport },
      },
    },
  } = useAppSelector(useSessionSelector);

  const { whiteboardClient } = useContext(SessionAdditionalClientContext);
  const { participants }: { participants: Participant[] } = useAppSelector(useParticipantSelector);
  const whiteboard = useAppSelector(useWhiteboardSelector);
  const currentUser = useCurrentUser();
  const { openExportDialog } = useWhiteboardExportDialog();

  const nodeRef = useRef(null);

  // Calculate derived state
  const isPresenter = currentUser ? whiteboard.presenterID === currentUser.userId : false;
  const isViewing = currentUser ? whiteboard.presenterID !== currentUser.userId : false;
  const isHostOrManager = currentUser ? currentUser.isHost || currentUser.isManager : false;

  // Define callbacks before conditional return (React Hooks rules)
  const handleExportOnly = useCallback(() => {
    openExportDialog(false); // false = export only, don't close
  }, [openExportDialog]);

  const handleStopWhiteboard = async () => {
    // If user is presenting, show export confirmation dialog
    if (isPresenter) {
      if (enableExport) {
        openExportDialog(true); // true = export and close
      } else {
        await whiteboardClient.stopWhiteboardScreen();
      }
    }
  };

  // Don't render if current user is not available yet
  if (!currentUser) {
    return null;
  }

  const presenter = participants.find((p) => p.userId === whiteboard.presenterID);
  return (
    <div className="fixed z-40">
      <Draggable
        bounds="body"
        defaultPosition={{ x: (window.innerWidth - 400) / 2, y: 220 }}
        nodeRef={nodeRef}
        cancel=".uikit-whiteboard-bar-no-drag"
      >
        <div
          className="flex items-center gap-2 bg-theme-surface rounded-lg py-2 px-4 shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-opacity-70 backdrop-blur-sm border border-theme-border cursor-move"
          ref={nodeRef}
        >
          {isPresenter && <Presentation size={12} className="text-green-600 uikit-whiteboard-bar-no-drag" />}
          <div className="flex text-sm font-medium text-theme-text">
            {isPresenter ? (
              <span>You are presenting whiteboard</span>
            ) : (
              <>
                {presenter?.isHost && (
                  <span className="text-xs flex items-center">
                    <Crown size={10} className="mr-1" />
                  </span>
                )}
                {presenter?.isManager && (
                  <span className="text-xs flex items-center">
                    <User size={10} className="mr-1" />
                  </span>
                )}
                <span className="whitespace-nowrap max-w-[150px] truncate" title={presenter?.displayName || "Unknown"}>
                  {presenter?.displayName || "Unknown"}
                </span>
                <span>&nbsp;&apos;s whiteboard</span>
              </>
            )}
          </div>

          {whiteboard.docName && (
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">{whiteboard.docName}</span>
          )}

          {isViewing && (enableViewerUserExport || (isHostOrManager && enableExport)) && (
            <button
              onClick={handleExportOnly}
              className="uikit-whiteboard-bar-no-drag rounded-lg bg-green-600 hover:bg-green-700 px-3 py-1 text-xs font-medium text-white flex items-center gap-1 transition-colors border border-green-700 cursor-pointer"
            >
              <Download size={12} />
              <span>Export</span>
            </button>
          )}

          {isPresenter && (
            <button
              onClick={handleStopWhiteboard}
              className="uikit-whiteboard-bar-no-drag rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1 text-xs font-medium text-white flex items-center gap-1 transition-colors border border-red-700 cursor-pointer"
              disabled={whiteboard.isLoading}
            >
              <X size={12} />
              <span>Stop</span>
            </button>
          )}
        </div>
      </Draggable>
    </div>
  );
};

export default WhiteboardIndicatorBar;
