import { Participant } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Subsession, SubsessionUserStatus, SubsessionStatus, SubsessionOption } from "@zoom/videosdk";
import { SubsessionAllocationPattern } from "./subsession-constants";

interface CurrentSubRoom {
  /**
   * User status.
   */
  userStatus: SubsessionUserStatus;
  /**
   * Subsession name.
   */
  subsessionName: string;
  /**
   * Subsession ID.
   */
  subsessionId: string;
}

export interface SubsessionState {
  isSubsessionEnabled: boolean;
  canAccessSubsessionRooms: boolean;
  subRoomList: Subsession[];
  subStatus: SubsessionStatus;
  subUserStatus: SubsessionUserStatus;
  currentSubRoom: CurrentSubRoom | any;
  subsessionOptions: SubsessionOption;
  subRoomCountdown: number;
  subUnassignedUsers: Participant[];
  subOptionsNeedCountdown: boolean;
  subsessionType: SubsessionAllocationPattern;
  inviter: {
    inviterId?: number;
    inviterGuid?: string;
    inviterName?: string;
    inviterSubsessionName?: string;
    inviterSubsessionId?: string;
  };
  isSelectedType: boolean;
  isRecreate: boolean;
  isOpenByYourself: boolean;
}

const initialState: SubsessionState = {
  isSubsessionEnabled: false,
  canAccessSubsessionRooms: false,
  subRoomList: [] as Subsession[],
  subStatus: SubsessionStatus.NotStarted, // subession status
  subUserStatus: SubsessionUserStatus.Initial, // current subsession user status
  currentSubRoom: {} as CurrentSubRoom, // current subsession room
  subsessionOptions: {} as SubsessionOption, // subession options
  subRoomCountdown: 5, // subession countdown
  subUnassignedUsers: [] as Participant[], // subession unassigned users
  subOptionsNeedCountdown: false, // subession need countdown
  subsessionType: SubsessionAllocationPattern.Automatically, // subession allocation pattern
  inviter: {
    inviterId: 0,
    inviterGuid: "",
    inviterName: "",
    inviterSubsessionName: "",
    inviterSubsessionId: "",
  },
  isSelectedType: false,
  isRecreate: false,
  isOpenByYourself: false,
};

export const subsessionSlice = createSlice({
  name: "subsession",
  initialState,
  reducers: {
    setSubsessionEnabled: (state, action: PayloadAction<boolean>) => {
      state.isSubsessionEnabled = action.payload;
    },
    setCanAccessSubsessionRooms: (state, action: PayloadAction<boolean>) => {
      state.canAccessSubsessionRooms = action.payload;
    },
    setSubRoomList: (state, action: PayloadAction<Subsession[]>) => {
      state.subRoomList = action.payload;
    },
    setSubStatus: (state, action: PayloadAction<SubsessionStatus>) => {
      state.subStatus = action.payload;
    },
    setSubUserStatus: (state, action: PayloadAction<SubsessionUserStatus>) => {
      state.subUserStatus = action.payload;
    },
    setCurrentSubRoom: (state, action: PayloadAction<CurrentSubRoom>) => {
      state.currentSubRoom = action.payload;
    },
    setSubsessionOptions: (state, action: PayloadAction<SubsessionOption>) => {
      state.subsessionOptions = {
        ...state.subsessionOptions,
        ...action.payload,
      };

      if (action.payload?.isSubsessionSelectionEnabled) {
        state.subsessionType = SubsessionAllocationPattern.SelfSelect;
      }
    },
    setSubRoomCountdown: (state, action: PayloadAction<number>) => {
      state.subRoomCountdown = action.payload;
    },
    setSubUnassignedUsers: (state, action: PayloadAction<Participant[]>) => {
      state.subUnassignedUsers = action.payload;
    },
    setSubOptionsNeedCountdown: (state, action: PayloadAction<boolean>) => {
      state.subOptionsNeedCountdown = action.payload;
    },
    setSubsessionType: (state, action: PayloadAction<SubsessionAllocationPattern>) => {
      state.subsessionType = action.payload;
    },
    setInviter: (
      state,
      action: PayloadAction<{
        inviterId?: number;
        inviterGuid?: string;
        inviterName?: string;
      }>,
    ) => {
      state.inviter = action.payload;
    },
    setIsSelectedType: (state, action: PayloadAction<boolean>) => {
      state.isSelectedType = action.payload;
    },
    setIsRecreate: (state, action: PayloadAction<boolean>) => {
      state.isRecreate = action.payload;
    },
    setIsOpenByYourself: (state, action: PayloadAction<boolean>) => {
      state.isOpenByYourself = action.payload;
    },
    resetSubsession: (state) => {
      const { isSubsessionEnabled, isRecreate } = state;
      Object.assign(state, initialState, {
        isSubsessionEnabled,
        isRecreate,
      });
    },
  },
});

export const {
  setSubsessionEnabled,
  setCanAccessSubsessionRooms,
  setSubRoomList,
  setSubStatus,
  setSubUserStatus,
  setCurrentSubRoom,
  setSubsessionOptions,
  setSubRoomCountdown,
  setSubUnassignedUsers,
  setSubOptionsNeedCountdown,
  setSubsessionType,
  setInviter,
  setIsSelectedType,
  setIsRecreate,
  setIsOpenByYourself,
} = subsessionSlice.actions;

export default subsessionSlice.reducer;
