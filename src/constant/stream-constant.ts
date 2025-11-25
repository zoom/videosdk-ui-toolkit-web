import { VbImageInfoType } from "@/types";

export const SHARER_CANVAS_ID = "ZOOM_WEB_SDK_SHARER_CANVAS";
export const SELF_VIDEO_ID = "ZOOM_WEB_SDK_SELF_VIDEO";
export const VIRTUAL_BACKGROUND_IMAGE_FOLDER = "background";
export enum SharePrivilege {
  Unlocked = 0,
  Locked = 1,
  MultipleShare = 3,
}

export enum VideoActiveState {
  Active = "Active",
  Inactive = "Inactive",
}
export enum VideoQuality {
  Video_90P = 0,
  Video_180P = 1,
  Video_360P = 2,
  Video_720P = 3,
}

export const DefaultVirtualBackgrounds: VbImageInfoType[] = [
  {
    id: "blur",
    displayName: "blur",
    fileName: "blur.png",
    url: "",
  },
  {
    id: "background0",
    displayName: "SanFrancisco",
    fileName: "SanFrancisco.jpg",
    url: "",
  },
  {
    id: "background1",
    displayName: "grass",
    fileName: "grass.jpg",
    url: "",
  },
  {
    id: "background2",
    displayName: "earth",
    fileName: "earth.jpg",
    url: "",
  },
];

export enum VirtualBackgroundPreloadState {
  Loading = "loading",
  Success = "success",
  Fail = "fail",
  Unknow = "unknow",
}

export const SPEAKER_CELL_ADDITIONAL_KEY = "zmSpeakerViewCellAdditionalKey";

export const GRANT_PERMISSION_MESSAGE = {
  microphone: "Microphone access is required. Please grant permissions in your browser settings.",
  camera: "Camera access is required. Please grant permissions in your browser settings.",
  microphoneAndCamera: "Camera and microphone access is required. Please grant permissions in your browser settings.",
};
