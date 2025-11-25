export const UPDATE_VIRTUAL_BACKGROUND_IMAGE_LIST = "zmwebsdkUpdateVirtualBackgroundImageList";
export const SET_VIRTUAL_BACKGROUND_IMAGE = "zmwebsdkSetVirtualBackgroundImage";
export const ADD_PIN = "zmwebsdkAddPin";
export const REMOVE_PIN = "zmwebsdkRemovePin";
export const REMOVE_ALL_PINS = "zmwebsdkRemoveAllPins";

export enum ExposedEvents {
  EVENT_CONNECTION_CHANGE = "connection-change",
  EVENT_AUDIO_STATISTIC_DATA_CHANGE = "audio-statistic-data-change",
  EVENT_VIDEO_STATISTIC_DATA_CHANGE = "video-statistic-data-change",
  EVENT_SHARE_STATISTIC_DATA_CHANGE = "share-statistic-data-change",
  EVENT_CAPTION_MESSAGE = "caption-message",
  EVENT_RECORDING_CHANGE = "recording-change",
  EVENT_LOCAL_RECORDING_CHANGE = "local-recording-change",
  EVENT_USER_ADDED = "user-added",
  EVENT_USER_REMOVED = "user-removed",
  EVENT_USER_UPDATED = "user-updated",
  EVENT_VIEW_TYPE_CHANGE = "view-type-change",
  EVENT_PEER_SHARE_STATE_CHANGE = "peer-share-state-change",
  EVENT_ACTIVE_SPEAKER = "active-speaker",
  EVENT_ROOM_STATE_CHANGE = "room-state-change",
  EVENT_MAIN_SESSION_USER_UPDATED = "main-session-user-updated",
  EVENT_BROADCAST_MESSAGE = "broadcast-message",
  EVENT_MEDIA_CAPTURE_STATUE_CHANGE = "media-capture-status-change",
  EVENT_MEDIA_CAPTURE_PERMISSION_CHANGE = "media-capture-permission-change",
  EVENT_NETWORK_QUALITY_CHANGE = "network-quality-change",
  EVENT_SESSION_JOINED = "uikit-session-joined",
  EVENT_SESSION_CLOSED = "uikit-session-closed",
  EVENT_SESSION_CLICK_JOIN = "uikit-session-click-join",
  EVENT_SESSION_DESTROYED = "uikit-session-destroyed",
  EVENT_SESSION_RECONNECTING = "uikit-session-reconnecting",
  EVENT_SESSION_FAILED = "uikit-session-failed",
  EVENT_FAR_END_CAMERA_REQUEST_CONTROL = "far-end-camera-request-control",
  EVENT_FAR_END_CAMERA_RESPONSE_CONTROL = "far-end-camera-response-control",
  EVENT_FAR_END_CAMERA_IN_CONTROL_CHANGE = "far-end-camera-in-control-change",
  EVENT_FAR_END_CAMERA_CAPABILITY_CHANGE = "far-end-camera-capability-change",
}

export const supportEventsList = Object.values(ExposedEvents);
