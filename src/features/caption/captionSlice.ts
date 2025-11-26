import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CaptionState {
  isTranscriptionFeatureEnabled: boolean;
  isTranslationFeatureEnabled: boolean;
  isHostDisableCaptions: boolean;
  isTranscriptionInitiated: boolean;
  initialTranslationLanguage: string;
  currentTranslationLanguage: string; // if undefined, translation is off
  isTranslationOn: boolean;
  currentSpeakingLanguage: string;
}

const initialState: CaptionState = {
  isTranscriptionFeatureEnabled: false,
  isTranslationFeatureEnabled: false,
  isHostDisableCaptions: false,
  isTranscriptionInitiated: false,
  isTranslationOn: false,
  currentSpeakingLanguage: null,
  currentTranslationLanguage: undefined,
  initialTranslationLanguage: undefined,
};

export const captionSlice = createSlice({
  name: "caption",
  initialState,
  reducers: {
    setIsTranscriptionFeatureEnabled: (state, action: PayloadAction<boolean>) => {
      state.isTranscriptionFeatureEnabled = action.payload;
    },
    setIsTranslationFeatureEnabled: (state, action: PayloadAction<boolean>) => {
      state.isTranslationFeatureEnabled = action.payload;
    },
    setIsHostDisableCaptions: (state, action: PayloadAction<boolean>) => {
      state.isHostDisableCaptions = action.payload;
    },
    setIsTranscriptionInitiated: (state, action: PayloadAction<boolean>) => {
      state.isTranscriptionInitiated = action.payload;
    },
    setInitialTranslationLanguage: (state, action: PayloadAction<string>) => {
      state.initialTranslationLanguage = action.payload;
    },
    setCurrentTranslationLanguage: (state, action: PayloadAction<string>) => {
      state.currentTranslationLanguage = action.payload;
    },
    setIsTranslationOn: (state, action: PayloadAction<boolean>) => {
      state.isTranslationOn = action.payload;
    },
    setCurrentSpeakingLanguage: (state, action: PayloadAction<string>) => {
      state.currentSpeakingLanguage = action.payload;
    },
  },
});

export const {
  setIsTranscriptionFeatureEnabled,
  setIsTranslationFeatureEnabled,
  setIsHostDisableCaptions,
  setIsTranscriptionInitiated,
  setInitialTranslationLanguage,
  setCurrentTranslationLanguage,
  setIsTranslationOn,
  setCurrentSpeakingLanguage,
} = captionSlice.actions;

export default captionSlice.reducer;
