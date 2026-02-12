import { CustomizationOptions, SuspensionViewType } from "@/types/index.d";

export * from "./chat-constants";
// export * from "./session-status";
export * from "./stream-constant";
export * from "./component-constants";
export * from "./ui-constant";

export const defaultConfig: CustomizationOptions = {
  sessionName: "",
  userName: "",
  sessionPasscode: "",
  videoSDKJWT: "",
  sessionIdleTimeoutMins: 40,
  webEndpoint: "zoom.us",
  featuresOptions: {
    video: {
      enable: true,
      enforceMultipleVideos: false, // only for WASM test
      ptz: false, // Enable PTZ camera support (only works with PTZ-capable cameras)
    },
    audio: {
      enable: true,
      joinAudioConsent: true,
      backgroundNoiseSuppression: true,
      originalSound: true,
      syncButtonsOnHeadset: true,
      muteEntry: false,
    },
    secondaryAudio: {
      enable: true,
    },
    share: {
      enable: true,
    },
    chat: {
      enable: true,
      enableEmoji: true,
    },
    users: {
      enable: true,
    },
    settings: {
      enable: true,
    },
    invite: {
      enable: true,
      inviteLink: "",
      broadcastLink: "",
    },
    theme: {
      enable: true,
      defaultTheme: null, // null means auto
    },
    viewMode: {
      enable: true,
      defaultViewMode: SuspensionViewType.Gallery,
      viewModes: [SuspensionViewType.Gallery, SuspensionViewType.Speaker, SuspensionViewType.Minimized],
    },
    recording: {
      enable: true,
    },
    phone: {
      enable: true,
    },
    crc: {
      enable: true,
    },
    preview: {
      enable: true,
      isAllowModifyName: false,
    },
    feedback: {
      enable: true,
    },
    livestream: {
      enable: false,
    },
    // cameraControl?: {
    //   enable: boolean;
    // };
    // remoteControl?: {
    //   enable: boolean;
    // },
    // annotation?: {
    //   enable: boolean;
    // };
    troubleshoot: {
      // settings/troubleshooting in session
      enable: true,
    },
    caption: {
      enable: true,
    },
    playback: {
      // play an audio/video file in session
      enable: false,
      audioVideoPlaybacks: [],
    },
    subsession: {
      enable: true,
    },
    leave: {
      enable: true,
    },
    virtualBackground: {
      enable: true,
      enforceVirtualBackground: false,
      allowVirtualBackgroundUpload: false,
      virtualBackgrounds: [],
    },
    header: {
      enable: true,
    },
    footer: {
      enable: true,
    },
    screenshot: {
      video: { enable: false },
      share: { enable: false },
    },
    whiteboard: {
      enable: true,
      enableExport: true,
      enableViewerUserExport: true,
    },
    rawData: {
      enable: false, // Processors are opt-in - see demo app for usage examples
    },
    realTimeMediaStreams: {
      enable: true,
    },
  },
  dependentAssets: "Global",
  language: "en-US",
  debug: false,
};

export const enum CustomizeLayout {
  video = "video",
  chat = "chat",
  users = "users",
  settings = "settings",
  invite = "invite",
  preview = "preview",
  subsession = "subsession",
  controls = "footer",
}

export type CustomizeLayoutType = typeof CustomizeLayout;
