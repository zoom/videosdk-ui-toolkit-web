import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingState {
  theme: "light" | "dark";
  language: string;
}

const initialState: SettingState = {
  theme: "light",
  language: "en",
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const { setTheme, setLanguage } = settingSlice.actions;
export default settingSlice.reducer;
