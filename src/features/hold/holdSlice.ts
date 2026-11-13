import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Participant } from "@/types";

export interface HoldState {
  /** Whether the local user is waiting to be admitted. */
  isSelfOnHold: boolean;
  /** Participants waiting to be admitted. Host and manager only; empty for everyone else. */
  onHoldParticipants: Participant[];
  /** Most recent arrival, used to drive the toast. Cleared on dismiss, admit or removal. */
  latestArrival: Participant | null;
  /** User IDs with an admit or remove request in flight, for per-row spinners. */
  pendingUserIds: number[];
}

const initialState: HoldState = {
  isSelfOnHold: false,
  onHoldParticipants: [],
  latestArrival: null,
  pendingUserIds: [],
};

/**
 * Participant add/update/remove events re-read the hold even when it did not change.
 * Same people, same names, and same order means there is nothing to store or announce.
 */
const isSameWaitingList = (current: Participant[], next: Participant[]) =>
  current.length === next.length &&
  current.every((participant, index) => {
    const nextParticipant = next[index];
    return participant.userId === nextParticipant.userId && participant.displayName === nextParticipant.displayName;
  });

const holdSlice = createSlice({
  name: "hold",
  initialState,
  reducers: {
    setIsSelfOnHold: (state, action: PayloadAction<boolean>) => {
      state.isSelfOnHold = action.payload;
    },

    /**
     * Replaces the waiting list from `client.getOnHoldUsers()`.
     * Also maintains `latestArrival` so the toast and the list cannot disagree: a newly seen
     * participant becomes the arrival, and an arrival who is no longer waiting is cleared.
     */
    setOnHoldParticipants: (state, action: PayloadAction<Participant[]>) => {
      if (isSameWaitingList(state.onHoldParticipants, action.payload)) {
        return;
      }

      const previousIds = new Set(state.onHoldParticipants.map((p) => p.userId));
      const arrived = action.payload.filter((p) => !previousIds.has(p.userId));

      state.onHoldParticipants = action.payload;

      if (arrived.length > 0) {
        state.latestArrival = arrived[arrived.length - 1];
      } else if (state.latestArrival && !action.payload.some((p) => p.userId === state.latestArrival?.userId)) {
        state.latestArrival = null;
      }
    },

    clearLatestArrival: (state) => {
      state.latestArrival = null;
    },

    addPendingUserId: (state, action: PayloadAction<number>) => {
      if (!state.pendingUserIds.includes(action.payload)) {
        state.pendingUserIds.push(action.payload);
      }
    },

    removePendingUserId: (state, action: PayloadAction<number>) => {
      state.pendingUserIds = state.pendingUserIds.filter((id) => id !== action.payload);
    },

    resetHold: () => initialState,
  },
});

export const {
  setIsSelfOnHold,
  setOnHoldParticipants,
  clearLatestArrival,
  addPendingUserId,
  removePendingUserId,
  resetHold,
} = holdSlice.actions;

export default holdSlice.reducer;
