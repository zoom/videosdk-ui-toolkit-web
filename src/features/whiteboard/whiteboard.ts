// Whiteboard module exports
export { useWhiteboard } from "./hooks/useWhiteboard";
export { useWhiteboardEvents } from "./hooks/useWhiteboardEvents";
export { WhiteboardButton, WhiteboardIndicatorBar } from "./components";
export { default as WhiteboardContainer } from "./WhiteboardContainer";
export {
  setWhiteboardStatus,
  updateWhiteboardInfo,
  setIsLockWhiteboard,
  setWhiteboardOpen,
  setWhiteboardLoading,
  setWhiteboardError,
  setWhiteboardDocument,
  resetWhiteboard,
  WHITEBOARD_STATUS,
  WHITEBOARD_PRIVILEGE,
} from "./whiteboardSlice";
