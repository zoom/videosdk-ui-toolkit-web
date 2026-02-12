import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RealTimeMediaStreamsStatus } from "@zoom/videosdk";

interface RtmsState {
  status: RealTimeMediaStreamsStatus;
  enabled: boolean;
  isLoading: boolean;
}

const initialState: RtmsState = {
  status: RealTimeMediaStreamsStatus.None,
  enabled: false,
  isLoading: false,
};

const rtmsSlice = createSlice({
  name: "rtms",
  initialState,
  reducers: {
    setRtmsStatus: (state, action: PayloadAction<RealTimeMediaStreamsStatus>) => {
      state.status = action.payload;
      state.isLoading = false; // Reset loading when status changes
    },
    setRtmsEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },
    setRtmsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetRtms: () => initialState,
  },
});

export const { setRtmsStatus, setRtmsEnabled, setRtmsLoading, resetRtms } = rtmsSlice.actions;

export default rtmsSlice.reducer;
