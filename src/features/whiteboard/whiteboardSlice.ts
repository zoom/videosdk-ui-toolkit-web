import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WHITEBOARD_STATUS, WHITEBOARD_PRIVILEGE } from "./constant";

interface WhiteboardState {
  // Whiteboard status
  status: WHITEBOARD_STATUS | "";

  // Whiteboard configuration
  enabled: boolean;

  // Current whiteboard info
  docId: string;
  docName: string;
  presenterID: number;
  dcsID: string;

  // Privileges
  isLock: boolean;
  isDisableExport: boolean;

  // UI state
  isWhiteboardOpen: boolean;
  isLoading: boolean;
  isExporting: boolean;
  error: {
    errorCode: number;
    errorMessage: string;
  } | null;
}

const initialState: WhiteboardState = {
  status: "",
  enabled: false,
  isLock: true,
  docId: "",
  docName: "",
  presenterID: 0,
  dcsID: "",
  isDisableExport: false,
  isWhiteboardOpen: false,
  isLoading: false,
  isExporting: false,
  error: null,
};

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    setWhiteboardEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },

    // Set whiteboard status
    setWhiteboardStatus: (state, action: PayloadAction<WHITEBOARD_STATUS>) => {
      state.status = action.payload;
      state.error = null;
    },

    // Update whiteboard info from getStatus()
    updateWhiteboardInfo: (state, action: PayloadAction<any>) => {
      if (action.payload.presenterID !== undefined) {
        state.presenterID = action.payload.presenterID;
      }
      if (action.payload.docId !== undefined) {
        state.docId = action.payload.docId;
      }
      if (action.payload.docName !== undefined) {
        state.docName = action.payload.docName;
      }
    },

    // Set whiteboard privilege
    setIsLockWhiteboard: (state, action: PayloadAction<boolean>) => {
      state.isLock = action.payload;
    },

    // Set whiteboard open/close state
    setWhiteboardOpen: (state, action: PayloadAction<boolean>) => {
      state.isWhiteboardOpen = action.payload;
      if (!action.payload) {
        state.docId = "";
        state.docName = "";
      }
    },

    // Set loading state
    setWhiteboardLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set exporting state
    setIsExporting: (state, action: PayloadAction<boolean>) => {
      state.isExporting = action.payload;
    },

    // Set error
    setWhiteboardError: (state, action: PayloadAction<{ errorCode: number; errorMessage: string } | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Set whiteboard document info
    setWhiteboardDocument: (state, action: PayloadAction<{ docId: string; docName: string }>) => {
      state.docId = action.payload.docId;
      state.docName = action.payload.docName;
    },

    setIsDisableExport: (state, action: PayloadAction<boolean>) => {
      state.isDisableExport = action.payload;
    },

    // Reset whiteboard state
    resetWhiteboard: () => initialState,
  },
});

export const {
  setWhiteboardEnabled,
  setWhiteboardStatus,
  updateWhiteboardInfo,
  setIsLockWhiteboard,
  setWhiteboardOpen,
  setWhiteboardLoading,
  setIsExporting,
  setWhiteboardError,
  setWhiteboardDocument,
  setIsDisableExport,
  resetWhiteboard,
} = whiteboardSlice.actions;

export default whiteboardSlice.reducer;

// Export enums for use in other files
export { WHITEBOARD_STATUS, WHITEBOARD_PRIVILEGE };
