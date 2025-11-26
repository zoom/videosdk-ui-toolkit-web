import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSessionSelector = (state: RootState) => {
  return state?.session;
};

export const useSessionUISelector = (state: RootState) => {
  return state?.ui;
};

export const useParticipantSelector = (state: RootState) => {
  return state?.participant;
};

export const useChatSelector = (state: RootState) => {
  return state?.chat;
};

export const useSettingSelector = (state: RootState) => {
  return state?.setting;
};

export const useCaptionSelector = (state: RootState) => {
  return state?.caption;
};

export const useMediaSelector = (state: RootState) => {
  return state?.media;
};

export const useSubsessionSelector = (state: RootState) => {
  return state?.subsession;
};

export const useWhiteboardSelector = (state: RootState) => {
  return state?.whiteboard;
};
