import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./sessionSlice";
import uiReducer from "./uiSlice";
import participantReducer from "../features/participant/participantSlice";
import chatReducer from "../features/chat/chatSlice";
import settingReducer from "../features/setting/settingSlice";
import captionReducer from "../features/caption/captionSlice";
import mediaReducer from "../features/media/mediaSlice";
import subsessionReducer from "../features/subsession/subsessionSlice";
import whiteboardReducer from "../features/whiteboard/whiteboardSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    ui: uiReducer,
    participant: participantReducer,
    chat: chatReducer,
    setting: settingReducer,
    caption: captionReducer,
    media: mediaReducer,
    subsession: subsessionReducer,
    whiteboard: whiteboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
