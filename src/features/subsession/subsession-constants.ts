export enum SubsessionAllocationPattern {
  Automatically = 1,
  Manually = 2,
  SelfSelect = 3,
}

export interface Room {
  id: string | number;
  name: string;
}

export interface SelectOption {
  value: string | number | null;
  label: string;
}
