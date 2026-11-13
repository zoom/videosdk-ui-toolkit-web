export enum SubsessionAllocationPattern {
  Automatically = 1,
  Manually = 2,
  SelfSelect = 3,
}

export const MAIN_SESSION_ROOM_ID = "uikit-main-session";

export interface Room {
  id: string | number;
  name: string;
}

export interface SelectOption {
  value: string | number | null;
  label: string;
}
