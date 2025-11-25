import { Participant } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ParticipantState {
  participants: Participant[];
}

const initialState: ParticipantState = {
  participants: [],
};

export const participantSlice = createSlice({
  name: "participant",
  initialState,
  reducers: {
    addParticipant: (state, action: PayloadAction<Participant>) => {
      state.participants.push(action.payload);
    },
    removeParticipant: (state, action: PayloadAction<number>) => {
      state.participants = state.participants.filter((p) => p.userId !== action.payload);
    },
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
  },
});

export const { addParticipant, removeParticipant, setParticipants } = participantSlice.actions;
export default participantSlice.reducer;
