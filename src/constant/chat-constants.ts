export enum ChatPrivilege {
  All = 1,
  NoOne = 4,
  EveryonePublicly = 5,
}

export enum ChatMsgType {
  All = 0,
  Panelist = 1,
  SilentModeUsers = 4,
}

export const DLPCheckType = {
  keyword: 1,
  regex: 2,
};

export const DLPActionType = {
  confirm: 2,
  block: 3,
};
