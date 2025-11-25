import {
  VideoClient,
  Stream,
  Participant,
  ChatClient as SDKChatClient,
  SubsessionClient as SDKSubsessionClient,
  RecordingClient as SDKRecordingClient,
  LiveTranscriptionClient as SDKLiveTranscriptionClient,
  CommandChannel,
  LiveStreamClient as SDKLiveStreamClient,
  LoggerClient as SDKLoggerClient,
  CaptionClient as SDKCaptionClient,
  ConnectionChangePayload as SDKConnectionChangePayload,
  ChatMessage,
  WhiteboardClient as SDKWhiteboardClient,
} from "@zoom/videosdk";

// BEGIN VideoClientEvent union (auto-generated)
export type VideoClientEvent =
  | "connection-change"
  | "user-added"
  | "user-updated"
  | "user-removed"
  | "video-active-change"
  | "video-dimension-change"
  | "active-speaker"
  | "host-ask-unmute-audio"
  | "current-audio-change"
  | "dialout-state-change"
  | "audio-statistic-data-change"
  | "video-statistic-data-change"
  | "chat-on-message"
  | "chat-privilege-change"
  | "command-channel-status"
  | "command-channel-message"
  | "recording-change"
  | "individual-recording-change"
  | "auto-play-audio-failed"
  | "device-change"
  | "video-capturing-change"
  | "active-share-change"
  | "share-content-dimension-change"
  | "peer-share-state-change"
  | "share-privilege-change"
  | "passively-stop-share"
  | "share-content-change"
  | "peer-video-state-change"
  | "share-audio-change"
  | "subsession-invite-to-join"
  | "subsession-countdown"
  | "subsession-time-up"
  | "closing-subsession-countdown"
  | "subsession-broadcast-message"
  | "subsession-ask-for-help"
  | "subsession-ask-for-help-response"
  | "subsession-state-change"
  | "main-session-user-updated"
  | "video-virtual-background-preload-change"
  | "media-sdk-change"
  | "video-detailed-data-change"
  | "caption-status"
  | "caption-message"
  | "caption-enable"
  | "caption-language-lock"
  | "share-can-see-screen"
  | "far-end-camera-request-control"
  | "far-end-camera-response-control"
  | "far-end-camera-in-control-change"
  | "far-end-camera-capability-change"
  | "network-quality-change"
  | "share-statistic-data-change"
  | "caption-host-disable"
  | "remote-control-approved-change"
  | "remote-control-in-control-change"
  | "remote-control-clipboard-change"
  | "remote-control-request-change"
  | "remote-control-app-status-change"
  | "remote-control-controlled-status-change"
  | "live-stream-status"
  | "video-aspect-ratio-change"
  | "device-permission-change"
  | "chat-file-upload-progress"
  | "chat-file-download-progress"
  | "summary-status-change"
  | "meeting-query-status-change"
  | "subsession-invite-back-to-main-session"
  | "subsession-user-update"
  | "subsession-broadcast-voice"
  | "crc-call-out-state-change"
  | "current-audio-level-change"
  | "active-media-failed"
  | "video-spotlight-change"
  | "video-screenshot-taken"
  | "share-content-screenshot-taken"
  | "annotation-privilege-change"
  | "annotation-redo-status"
  | "annotation-undo-status"
  | "annotation-viewer-draw-request"
  | "share-camera-request"
  | "share-camera-approve-change"
  | "share-camera-status"
  | "broadcast-streaming-status"
  | "whiteboard-status-change"
  | "whiteboard-privilege-change"
  | "speaking-while-muted"
  | "system-resource-usage-change"
  | "webrtc-statistic-data-change";
// END VideoClientEvent union (auto-generated)

export type VideoClientOn = typeof VideoClient.on;
export type VideoClientOff = typeof VideoClient.off;

export type SessionClient = typeof VideoClient;
export type MediaStream = typeof Stream;
export type Participant = Participant;
export type ChatClient = typeof SDKChatClient;
export type CommandChannelClient = typeof CommandChannel;
export type SubsessionClient = typeof SDKSubsessionClient;
export type RecordingClient = typeof SDKRecordingClient;
export type LiveTranscriptionClient = typeof SDKLiveTranscriptionClient;
export type LiveStreamClient = typeof SDKLiveStreamClient;
export type LoggerClient = typeof SDKLoggerClient;
export type CaptionClient = typeof SDKCaptionClient;
export type SessionChatMessage = typeof ChatMessage;
export type ConnectionChangePayload = SDKConnectionChangePayload;
export type WhiteboardClient = typeof SDKWhiteboardClient;

export type RoomParticipant = Pick<Participant, "userId" | "displayName" | "avatar" | "userGuid">[];

export type OldUIkitFeature =
  | "preview"
  | "video"
  | "audio"
  | "share"
  | "chat"
  | "livestream"
  | "users"
  | "pstn"
  | "crc"
  | "ltt"
  | "recording"
  | "settings"
  | "feedback";

export type UIkitFeature =
  | "video"
  | "audio"
  | "secondaryAudio"
  | "share"
  | "chat"
  | "users"
  | "settings"
  | "preview"
  | "feedback"
  // | "cameraControl" // coming soon
  // | "remoteControl" // coming soon
  // | "annotation" // coming soon
  | "whiteboard"
  | "troubleshoot"
  | "phone"
  | "caption"
  | "playback"
  | "subsession"
  | "virtualBackground"
  | "invite"
  | "recording"
  | "livestream"
  | "crc";

/**
 * List of audio/video playbacks to be used in the playback feature.
 */
export interface AudioVideoPlaybacks {
  title: string;
  url: string;
}

export type CustomizationOptions = {
  /**
   * zoom videosdk jwt token
   */
  videoSDKJWT: string;
  /**
   * sessionName
   */
  sessionName: string;
  /**
   * userName
   */
  userName: string;
  /**
   * sessionPasscode
   */
  sessionPasscode: string;
  /**
   * sessionIdleTimeoutMins
   */
  sessionIdleTimeoutMins: number;
  /**
   * webEndpoint
   */
  webEndpoint: string;
  /**
   * leaveOnPageUnload
   */
  leaveOnPageUnload?: boolean;
  /**
   * @deprecated Please use featuresOptions instead
   */
  features?: OldUIkitFeature[];
  /**
   * @deprecated please use featuresOptions.audio/video/share/virtualBackground and webEndpoint instead
   */
  options?: {
    /**
     * @deprecated
     */
    init: {
      /**
       * @deprecated please use featuresOptions.video.enforceMultipleVideos instead
       */
      enforceMultipleVideos;
      /**
       * @deprecated please use featuresOptions.virtualBackground.enforceVirtualBackground instead
       */
      enforceVirtualBackground;
      /**
       * @deprecated please use webEndpoint instead
       */
      webEndpoint;
    };
    /**
     * @deprecated please use featuresOptions.audio instead
     */
    audio: {
      backgroundNoiseSuppression: boolean;
      originalSound: boolean;
      syncButtonsOnHeadset: boolean;
      joinAudioConsent: boolean;
    };
    /**
     * @deprecated please use featuresOptions.video instead
     */
    video: {
      originalRatio: boolean;
      virtualBackground: boolean;
    };
    /**
     * @deprecated please use featuresOptions.share instead
     */
    share: {
      controls: boolean;
      displaySurface: boolean;
      hideShareAudioOption: boolean;
      optimizedForSharedVideo: boolean;
    };
  };
  /**
   * @deprecated please use featuresOptions.virtualBackground instead
   */
  virtualBackground?: {
    allowVirtualBackground: boolean;
    allowVirtualBackgroundUpload: boolean;
    virtualBackgrounds: string[];
  };
  /**
   * features options
   */
  featuresOptions?: {
    video?: {
      enable: boolean;
      /**
       * @default false
       * @see https://marketplacefront.zoom.us/sdk/custom/web/interfaces/ZoomVideo.InitOptions.html#enforceMultipleVideos
       */
      enforceMultipleVideos?: boolean;
      originalRatio?: boolean;
      /**
       * @default false
       * @see https://marketplacefront.zoom.us/sdk/custom/web/interfaces/ZoomVideo.InitOptions.html#enforceMultipleVideos disableRenderLimits
       */
      disableRenderLimits?: boolean;
    };
    audio?: {
      enable: boolean;
      backgroundNoiseSuppression?: boolean;
      originalSound?: boolean;
      syncButtonsOnHeadset?: boolean;
      joinAudioConsent?: boolean;
      muteEntry?: boolean; // mute entry after join session audio
    };
    secondaryAudio?: {
      enable: boolean;
    };
    share?: {
      enable: boolean;
      /**
       * Enables configuring specific content to share within supported browsers https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_controller_option
       */
      controls?: boolean;
      /**
       * Enables configuring specific share surfaces within supported browsers. https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_monitortypesurfaces_option
       */
      displaySurface?: boolean;
      /**
       * Enables or disables the share computer audio option within supported browsers. https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_systemaudio_option
       */
      hideShareAudioOption?: boolean;
      /**
       * Prioritizes frame rate over resolution for better screen sharing of videos.
       */
      optimizedForSharedVideo?: boolean;
    };
    chat?: {
      enable: boolean;
      enableEmoji: boolean;
    };
    users?: {
      enable: boolean;
    };
    settings?: {
      enable: boolean;
    };
    recording?: {
      enable: boolean;
    };
    livestream?: {
      enable: boolean;
    };
    invite?: {
      enable: boolean;
      inviteLink?: string;
    };
    theme?: {
      enable: boolean;
      defaultTheme?: "light" | "dark" | "blue" | "green";
    };
    viewMode?: {
      enable: boolean; // enable switch view mode
      defaultViewMode: SuspensionViewValue;
      viewModes: SuspensionViewValue[];
    };
    phone?: {
      enable: boolean;
    };
    crc?: {
      enable: boolean;
    };
    preview?: {
      enable: boolean;
      isAllowModifyName?: boolean;
    };
    feedback?: {
      // feedback after end/leave session
      enable: boolean;
    };
    // cameraControl?: {
    //   enable: boolean;
    // };
    // remoteControl?: {
    //   enable: boolean;
    // };
    // annotation?: {
    //   enable: boolean;
    // };
    whiteboard?: {
      enable: boolean;
      enableExport?: boolean;
      enableViewerUserExport?: boolean;
    };
    troubleshoot?: {
      enable: boolean;
    };
    caption?: {
      enable: boolean;
    };
    playback?: {
      enable: boolean;
      /**
       * List of audio/video playbacks to be used in the playback feature.
       */
      audioVideoPlaybacks: AudioVideoPlaybacks[];
    };
    subsession?: {
      enable: boolean;
    };
    leave?: {
      enable: boolean;
    };
    virtualBackground?: {
      enable: boolean;
      enforceVirtualBackground?: boolean; // only for WASM test
      allowVirtualBackgroundUpload?: boolean;
      virtualBackgrounds?: {
        url: string;
        displayName?: string;
      }[];
    };
    header?: {
      enable: boolean;
    };
    footer?: {
      enable: boolean;
    };
    livestream?: {
      enable: boolean;
    };
    screenshot?: {
      video?: { enable: boolean };
      share?: { enable: boolean };
    };
    rawData?: {
      enable: boolean;
      video?: {
        enable: boolean;
        name: string;
        type: "video";
        url: string;
        title: string;
        options: any;
      };
      audio?: {
        enable: boolean;
        name: string;
        type: "audio";
        url: string;
        title: string;
        options: any;
      };
      share?: {
        enable: boolean;
        name: string;
        type: "share";
        url: string;
        title: string;
        options: any;
      };
    };
    cameraShare?: {
      enable: boolean;
    };
  };
  /**
   * dependent assets
   */
  dependentAssets: string;
  /**
   * language
   */
  language: string;
  /**
   * debug mode
   */
  debug: boolean;
};

export enum SessionStatus {
  Default = "",
  Closed = "Closed",
  Connected = "Connected",
  Reconnecting = "Reconnecting",
  Fail = "Fail",
}

export enum RecordingStatus {
  Recording = "Recording",
  Paused = "Paused",
  Stopped = "Stopped",
  Ask = "Ask",
  Accept = "Accept",
  Decline = "Decline",
}

export const SESSIONSTORAGE_KEYS = {
  recent_selected_translate: "RecentSelectedTranslateLang",
};

export interface VbImageInfoType {
  id: string;
  fileName: string;
  displayName: string;
  url: string;
}
/**
 * List of suspension view types.
 */
export const SuspensionViewType = {
  Minimized: "minimized",
  // Fullscreen: "fullscreen", // coming soon
  // Pip: "pip", // coming soon
  Speaker: "speaker",
  Gallery: "gallery",
};
export type SuspensionViewValue = (typeof SuspensionViewType)[keyof typeof SuspensionViewType];

export interface MediaDevice {
  label: string;
  deviceId: string;
}

export type Theme = "light" | "dark";

export interface UIKitConfig {
  video?: boolean;
  chat?: boolean;
  controls?: boolean;
  users?: boolean;
  settings?: boolean;
}

// Add these type definitions to your existing types
export type EventCallback = (event: CustomEvent) => void;
export interface ChatFileDownloadProgress {
  fileName: string;
  fileSize: number;
  fileUrl: string;
  id: string;
  progress: number;
  senderId: number;
  status: number;
  cancelCallback?: () => void;
}

export interface ChatFileUploadProgress {
  fileName: string;
  fileSize: number;
  progress: number;
  receiverGuid: string;
  receiverId: number;
  status: number;
}

export interface networkQualityMapType {
  [key: number]: { level: number };
}

export interface MediaFailedPayload {
  code: string;
  message: string;
  type: "audio" | "video" | "sharing";
}

export interface ErrorStatus {
  errorCode: string | number;
  reason: string | undefined;
  result: string;
}
