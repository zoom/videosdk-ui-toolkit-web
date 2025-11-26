export interface TollNumber {
  country: string;
  countryName: string;
  number: string;
  displayNumber: string;
  dc: string;
  free: boolean;
  numbers?: TollNumber[];
}

export interface CallInInfo {
  meetingId: string;
  participantId: string;
  password: string;
  tollNumbers: TollNumber[];
}

export interface CountryCodeOption {
  label: string;
  value: string;
}

export interface CountryType {
  code: string;
  name: string;
  id: string;
}
