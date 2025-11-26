import React, { useRef, useEffect, useCallback, useState, useMemo, useContext } from "react";
import { useWhiteboard } from "./hooks/useWhiteboard";
import { WHITEBOARD_STATUS, updateWhiteboardInfo } from "./whiteboardSlice";
import { useAppSelector, useSessionSelector, useWhiteboardSelector, useAppDispatch } from "@/hooks/useAppSelector";
import { Participant } from "@/types";
import { useCurrentUser } from "@/features/participant/hooks";
import { useWhiteboardEvents } from "./hooks/useWhiteboardEvents";
import SessionAdditionalClientContext from "@/context/session-additional-context";
import { WHITEBOARD_CONTAINER_ID, WHITEBOARD_CONTAINER_INNER_ID } from "./constant";

interface WhiteboardContainerProps {
  mainContentHeight: number;
  mainContentWidth: number;
}

const WhiteboardFrame = ({ children, isWhiteboardOpen }: { children: React.ReactNode; isWhiteboardOpen: boolean }) => (
  <div
    id={WHITEBOARD_CONTAINER_ID}
    className="whiteboard-container whiteboard-sdk-css relative inset-0 flex items-center justify-center flex z-10"
    style={{ visibility: isWhiteboardOpen ? "visible" : "hidden", height: isWhiteboardOpen ? `75%` : 0 }}
  >
    {children}
    <div
      id={WHITEBOARD_CONTAINER_INNER_ID}
      style={{ height: "100%", width: "100%", visibility: isWhiteboardOpen ? "visible" : "hidden" }}
    ></div>
  </div>
);
const WhiteboardContainer: React.FC<WhiteboardContainerProps> = ({ mainContentHeight, mainContentWidth }) => {
  const whiteboardRef = useRef<HTMLDivElement>(null);
  const whiteboard = useAppSelector(useWhiteboardSelector);
  useWhiteboard();
  // Initialize whiteboard events

  const currentUser = useCurrentUser();
  const [isWhiteboardRendered, setIsWhiteboardRendered] = useState(false);
  const isWhiteboardOpen = useMemo(
    () => whiteboard.isLoading || whiteboard.isWhiteboardOpen,
    [whiteboard.isLoading, whiteboard.isWhiteboardOpen],
  );

  // Check if we should show the whiteboard (either we're sharing or receiving)
  const shouldShowWhiteboard =
    whiteboard.isWhiteboardOpen ||
    whiteboard.status === WHITEBOARD_STATUS.InProgress ||
    whiteboard.status === WHITEBOARD_STATUS.Pending;

  // Handle whiteboard container setup
  useEffect(() => {
    if (shouldShowWhiteboard && whiteboardRef.current && !isWhiteboardRendered) {
      // Set up the whiteboard container
      const container = whiteboardRef.current;
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.position = "relative";
      setIsWhiteboardRendered(true);
    }
  }, [shouldShowWhiteboard, isWhiteboardRendered]);

  // Don't render if current user is not available yet
  if (!currentUser) {
    return <WhiteboardFrame isWhiteboardOpen={isWhiteboardOpen}>{null}</WhiteboardFrame>;
  }
  if (!shouldShowWhiteboard) {
    return <WhiteboardFrame isWhiteboardOpen={isWhiteboardOpen}>{null}</WhiteboardFrame>;
  }

  return (
    <WhiteboardFrame isWhiteboardOpen={isWhiteboardOpen}>
      {/* Error display */}
      {whiteboard?.error?.errorMessage && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg z-20">
          <div className="text-sm">Error: {whiteboard?.error?.errorMessage}</div>
        </div>
      )}

      {/* Loading overlay */}
      {whiteboard.isLoading && !whiteboard?.error?.errorMessage && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <div className="text-gray-700">Loading Whiteboard...</div>
          </div>
        </div>
      )}
      {whiteboard.isExporting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <div className="text-gray-700">Exporting Whiteboard...</div>
          </div>
        </div>
      )}
    </WhiteboardFrame>
  );
};

export default WhiteboardContainer;
