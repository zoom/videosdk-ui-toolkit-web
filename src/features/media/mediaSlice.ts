import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MediaState {
  audio: {
    encode: boolean;
    decode: boolean;
  };
  video: {
    encode: boolean;
    decode: boolean;
  };
  share: {
    encode: boolean;
    decode: boolean;
  };
}

const initialState: MediaState = {
  audio: {
    encode: false,
    decode: false,
  },
  video: {
    encode: false,
    decode: false,
  },
  share: {
    encode: false,
    decode: false,
  },
};

export type MediaStatePayload = {
  type: "audio-encode" | "audio-decode" | "video-encode" | "video-decode" | "share-encode" | "share-decode";
  payload: boolean;
};

const mediaSlice = createSlice({
  name: "media",
  initialState: initialState,
  reducers: {
    setMediaState: (state, action: PayloadAction<MediaStatePayload>) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "audio-encode":
          state.audio.encode = payload;
          break;
        case "audio-decode":
          state.audio.decode = payload;
          break;
        case "video-encode":
          state.video.encode = payload;
          break;
        case "video-decode":
          state.video.decode = payload;
          break;
        case "share-encode":
          state.share.encode = payload;
          break;
        case "share-decode":
          state.share.decode = payload;
          break;
        default:
          break;
      }
    },
    resetMedia: () => initialState,
  },
});

export const { setMediaState, resetMedia } = mediaSlice.actions;

export default mediaSlice.reducer;
