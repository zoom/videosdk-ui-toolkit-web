// Define whiteboard enums locally since they may not be exported from @zoom/videosdk
export enum WHITEBOARD_STATUS {
  /**
   * Whiteboard session is closed or not started.
   */
  Closed = 0,
  /**
   * Whiteboard is initializing.
   */
  Pending = 1,
  /**
   * Whiteboard session is active and in progress.
   */
  InProgress = 2,
}

export enum WHITEBOARD_EXPORT_FORMAT {
  PDF = "pdf",
}

export enum WHITEBOARD_PRIVILEGE {
  HOST_ONLY = 0,
  ALL_PARTICIPANTS = 2,
}

export const ERROR_START_WHITEBOARD = 0;
export const WHITEBOARD_ERROR_MESSAGE: Record<number, string> = {
  [ERROR_START_WHITEBOARD]: "Failed to start whiteboard",
};

export const WHITEBOARD_CONTAINER_ID = "uikit-whiteboard-container";
export const WHITEBOARD_CONTAINER_INNER_ID = "uikit-whiteboard-container-inner";
