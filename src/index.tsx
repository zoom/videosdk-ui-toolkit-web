// eslint-disable no-console
import { b64DecodeUnicode, b64EncodeUnicode, generateVideoToken } from "./components/util/util";
import { devConfig } from "./config/dev";
import { v7 as uuidv7 } from "uuid";
import UIToolkit from "./uikit/index";
import { isMobileDeviceNotIpad } from "./components/util/service";
import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import { AudioVideoPlaybacks, CustomizationOptions } from "./types/index.d";
import DebugSettingDraggable from "./demo/debug/DebugSettingDraggable";
import VideoDemoHome from "./demo/videosdk";
import MeetingDemoHome from "./demo/meetingsdk";
import ProbeSDKHome from "./demo/probesdk";
import "./index.css";
import axios from "axios";
import { getExploreName, isLocalhost } from "./components/util/platform";
import WebApp from "./webapp";
import { usePrevious } from "./hooks";
import CustomizeLayout from "./indexCustomized";
import { Logger } from "./uikit/Logger";
import { defaultConfig } from "./constant";
import "./i18n";

let urlArgs: any = Object.fromEntries(new URLSearchParams(location.search));
let isDebug = false;
if (typeof urlArgs?.debug === "undefined") {
  isDebug = true;
} else if (urlArgs?.debug === "1") {
  isDebug = true;
} else if (urlArgs?.debug === "0") {
  isDebug = false;
}

const eventHandlers = {
  onSessionJoined: () => {
    Logger.event("uikit.onSessionJoined session joined for the second time");

    if (isDebug) {
      UIToolkit.i18n.setLanguage("zh-TW", "https://videosdk.zoomdev.us/lang/zh-TW.json").then(() => {
        const enJson = UIToolkit.i18n.getInstance().getResourceBundle("en-US", "translation");
        const jpJson = Object.assign({}, enJson, {
          "notification.enable_audio_button": "参加",
          "notification.enable_audio_content": "このセッションに参加しますか？",
          "notification.enable_audio_title": "参加音声",
          "settings.tab_audio": "音声",
          "settings.tab_background": "背景",
          "settings.tab_general": "一般",
          "settings.tab_help": "ヘルプ",
          "settings.tab_mask": "マスク",
          "settings.tab_playback": "再生",
          "settings.tab_raw_data": "生データ",
          "settings.tab_second_audio": "セカンド音声",
          "settings.tab_statistics": "統計",
          "settings.tab_troubleshoot": "トラブルシューティング",
        });
        UIToolkit.i18n.setLanguage("ja-JP", jpJson);
        UIToolkit.i18n.setLanguageList(["en-US", "zh-CN", "zh-TW", "ja-JP", "ko-KR", "vi-VN"]);
        UIToolkit.i18n.setLanguage(urlArgs?.lang || "en-US");
      });
    }
  },
  onSessionClosed: () => {
    Logger.event("uikit.onSessionClosed");
  },
  onSessionDestroyed: () => {
    Logger.event("uikit.onSessionDestroyed");
  },
  onViewTypeChange: (viewType: any) => {
    Logger.event("uikit.onViewTypeChange", viewType);
  },
  onLanguageChange: (language: string) => {
    Logger.event("uikit.onLanguageChange", language);
    if (language === "ko-KR") {
      UIToolkit.i18n.setLanguage("ko-KR", "https://videosdk.zoomdev.us/lang/ko-KR.json");
    } else if (language === "vi-VN") {
      UIToolkit.i18n.setLanguage("vi-VN", "https://videosdk.zoomdev.us/lang/vi-VN.json");
    } else {
      console.log("language not found", language);
    }
  },
};

urlArgs.listenEvents = urlArgs?.eventListeners ? atob(urlArgs?.eventListeners).split(",") : Object.keys(eventHandlers);
// Add enforceGalleryView to turn on the gallery view without SharedAddayBuffer
if (!urlArgs.sdkKey || !urlArgs.topic || !urlArgs.name || !urlArgs.signature) {
  urlArgs = { ...devConfig, ...urlArgs };
}

if (typeof urlArgs.web !== "undefined") {
  ["topic", "name", "password", "sessionKey", "userIdentity"].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(urlArgs, field)) {
      try {
        urlArgs[field] = b64DecodeUnicode(urlArgs[field]);
      } catch (e) {
        console.log("ingore base64 decode", field, urlArgs[field]);
      }
    }
  });

  if (typeof urlArgs.name === "undefined") {
    urlArgs.name = getExploreName();
  }
  if (urlArgs.role) {
    urlArgs.role = parseInt(urlArgs.role, 10);
  } else {
    urlArgs.role = 1;
  }

  if (urlArgs.enforceAB) {
    urlArgs.enforceAB = parseInt(urlArgs.enforceAB, 10);
  } else {
    urlArgs.enforceAB = 1;
  }

  if (urlArgs.enforceWebrtc) {
    urlArgs.enforceWebrtc = parseInt(urlArgs.enforceWebrtc, 10);
  } else {
    urlArgs.enforceWebrtc = 1;
  }

  ["enforceGalleryView", "enforceVB", "cloud_recording_option", "cloud_recording_election"].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(urlArgs, field)) {
      try {
        urlArgs[field] = Number(urlArgs[field]);
      } catch (e) {
        delete urlArgs[field];
      }
    }
  });
  if (urlArgs?.customerJoinId) {
    try {
      urlArgs.customerJoinId = b64DecodeUnicode(urlArgs.customerJoinId);
    } catch (e) {
      // Ignore base64 decode error for customerJoinId
    }
  } else {
    urlArgs.customerJoinId = "";
  }
}

const getJwtToken = async (data: any) => {
  try {
    const tokenArgs = {
      params: {
        sdkKey: data.sdkKey,
        sdkSecret: data.sdkSecret,
        sdkPassword: data.password ? b64EncodeUnicode(data.password) : "",
        sdkTopic: b64EncodeUnicode(data.topic),
        user_identity: b64EncodeUnicode(data.user_identity),
        session_key: b64EncodeUnicode(data.session_key),
        role: data.role,
        cloud_recording_option: data.cloud_recording_election,
        cloud_recording_election: data.cloud_recording_election,
        telemetry_id: b64EncodeUnicode("uikit-" + uuidv7().slice(6)),
        rc: data.rc,
        auto_transcription: data.auto_transcription,
        geo_regions: data.geo_regions,
        video_webrtc_mode: data.enforceWebRtcVideo,
        audio_compatible_mode: data.enforceWebRtcAudio || "1",
      },
    };

    // Use development token endpoint in localhost, otherwise use same-origin endpoint
    let responseUrl = "https://websdk.zoomdev.us/jwt/index.php";
    if (!isLocalhost) {
      responseUrl = `${window.location.origin}/jwt/index.php`;
    }
    const response = await axios.get(responseUrl, tokenArgs);
    return response.data.signature;
  } catch (error) {
    console.error("Error fetching JWT token:", error);
    throw error;
  }
};
if (!urlArgs.signature || urlArgs.signature === "") {
  if (process.env.NODE_ENV === "development" && !urlArgs.version) {
    urlArgs.signature = generateVideoToken(
      urlArgs.sdkKey,
      urlArgs.sdkSecret,
      urlArgs.topic,
      urlArgs.sessionKey,
      urlArgs.userIdentity,
      Number(urlArgs.role ?? 1),
      urlArgs.cloud_recording_option,
      urlArgs.cloud_recording_election,
      "uikit-" + uuidv7().slice(6),
      urlArgs.enforceAB,
      urlArgs.enforceWebrtc,
    );
    const tmpUrlArgs: any = {
      topic: urlArgs.topic,
      name: urlArgs.name,
      password: urlArgs.password,
      sessionKey: urlArgs.sessionKey,
      userIdentity: urlArgs.userIdentity,
      role: urlArgs.role || 1,
      cloud_recording_option: urlArgs.cloud_recording_option || "",
      cloud_recording_election: urlArgs.cloud_recording_election || "",
      telemetry_tracking_id: urlArgs.telemetry_tracking_id || "",
      enforceGalleryView: 0,
      enforceVB: 0,
      enforceAB: 1,
      enforceWebrtc: 1,
      preview: urlArgs.preview || "0",
      env: urlArgs.env || "dev",
      nav: urlArgs.nav || "0",
      drag: urlArgs.drag || "0",
      lang: urlArgs.lang || "en-US",
    };

    console.log("use url args");

    console.log(window.location.origin + "/?" + new URLSearchParams(tmpUrlArgs).toString());
  }
}

const VersionPath = urlArgs.version || process.env.UIKIT_VERSION.replace(/"/g, "");
const dependentAssets =
  VersionPath && process.env.NODE_ENV !== "development"
    ? `${window.location.origin}/${VersionPath}/lib`
    : `${window.location.origin}/lib`;

const CDN_LIST = ["videosdk.zoomdev.us"];
if (urlArgs.cdn) {
  if (urlArgs.uiKit === "1") {
    if (CDN_LIST.includes(urlArgs.cdn)) {
      urlArgs.dependentAssets = `https://${urlArgs.cdn}/${VersionPath}/uikit/lib`;
    } else {
      urlArgs.dependentAssets = `https://${urlArgs.cdn}/videosdk/${VersionPath}/uikit/lib`;
    }
  } else if (urlArgs.uiKit === "2") {
    if (CDN_LIST.includes(urlArgs.cdn)) {
      urlArgs.dependentAssets = `https://${urlArgs.cdn}/uikit/${VersionPath}/lib`;
    } else {
      urlArgs.dependentAssets = `https://${urlArgs.cdn}/videosdk/uikit/${VersionPath}/lib`;
    }
  } else {
    if (CDN_LIST.includes(urlArgs.cdn)) {
      urlArgs.dependentAssets = `https://${urlArgs.cdn}/${VersionPath}/lib`;
    } else {
      urlArgs.dependentAssets = `https://${urlArgs.cdn}/videosdk/${VersionPath}/lib`;
    }
  }
} else {
  urlArgs.dependentAssets = dependentAssets;
}

if (urlArgs?.mediasdk) {
  urlArgs.dependentAssets = `https://d27xp8zu78jmsf.cloudfront.net/web-media/${urlArgs.mediasdk}`;
}

const removeSignatureParameter = (url: string): string => {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);

  if (params.has("signature")) {
    params.delete("signature");
  }
  if (params.has("name")) {
    params.delete("name");
  }

  urlObj.search = params.toString();
  return urlObj.toString();
};

export const audioVideoPlaybacks: AudioVideoPlaybacks[] = [
  { title: "None", url: "" },
  { title: "ZOOM ZWA", url: "https://source.zoom.us/brand/mp4/Using%20the%20Zoom%20PWA.mp4" },
  { title: "ZOOM Cares", url: "https://source.zoom.us/brand/mp4/Zoom%20Cares%20Nonprofit%20Impact.mp4" },
  {
    title: "ZOOM One video",
    url: "https://source.zoom.us/brand/mp4/Zoom%20One%20-%20Team%20Chat%2C%20Phone%2C%20Email%2C%20and%20more.mp4",
  },
];

// chrome: https://developer.chrome.com/origintrials/#/trials/active
// edge: https://developer.microsoft.com/en-us/microsoft-edge/origin-trials
const exampleMetaTags = [
  {
    "http-equiv": "origin-trial",
    content:
      "AkDBFR3IGFFbXopB0e/7AZHFGAxGs36SjLwcFo+FzPWGYAWm86NNP3nriR7yd0VpFktGvgq2CT+DwWuUZafoPgoAAABoeyJvcmlnaW4iOiJodHRwczovL3pvb21kZXYudXM6NDQzIiwiZmVhdHVyZSI6IlBlcm1pc3Npb25FbGVtZW50IiwiZXhwaXJ5IjoxNzcxODkxMjAwLCJpc1N1YmRvbWFpbiI6dHJ1ZX0=",
  }, // zoomdev.us PEPC(Page Embedded Permission Control - Cam/Mic/Geolocation)
  {
    "http-equiv": "origin-trial",
    content:
      "A+RMjfSbMNCa7MJl5ucFwulBzJYYCcEHkRi2t4NHpdyuZPaUKLZsN2OB0swr5Tc3Y21e1LdDIisN4aFpMAZcmH8AAABoeyJvcmlnaW4iOiJodHRwczovL3pvb21kZXYudXM6NDQzIiwiZmVhdHVyZSI6IlBlcm1pc3Npb25FbGVtZW50IiwiZXhwaXJ5IjoxNzY0MzcwNzA5LCJpc1N1YmRvbWFpbiI6dHJ1ZX0=",
  }, // zoomdev.us PEPC(Page Embedded Permission Control - Cam/Mic/Geolocation) edge
];

if (urlArgs?.pepc === "1") {
  // add exampleMetaTags to the head
  exampleMetaTags.forEach((metaTag) => {
    const meta = document.createElement("meta");
    meta.setAttribute("http-equiv", metaTag["http-equiv"]);
    meta.setAttribute("content", metaTag.content);
    document.head.appendChild(meta);
  });
}

const customization: CustomizationOptions = {
  videoSDKJWT: urlArgs.signature,
  sessionName: urlArgs.topic,
  userName: urlArgs.name,
  sessionPasscode: urlArgs.password,
  webEndpoint: urlArgs.web || urlArgs.webEndpoint,
  dependentAssets: urlArgs.dependentAssets,
  featuresOptions: {
    audio: {
      enable: true,
      // joinAudioConsent: false,
      // muteEntry: true,
    },
    video: {
      enable: true,
      enforceMultipleVideos: Number(urlArgs?.enforceGalleryView) === 1 && !window.crossOriginIsolated,
      disableRenderLimits: Number(urlArgs?.enforceGalleryView) === 1 && !window.crossOriginIsolated,
      ptz: true, // Enable PTZ camera support for testing
    },
    share: {
      enable: true,
    },
    remoteControl: {
      enable: urlArgs?.rc === "1",
    },
    invite: {
      enable: true,
      inviteLink: removeSignatureParameter(window.location.href),
      broadcastLink: window.location.href,
    },
    playback: {
      enable: true,
      audioVideoPlaybacks: audioVideoPlaybacks,
    },
    virtualBackground: {
      enable: true,
      allowVirtualBackgroundUpload: false,
      enforceVirtualBackground: Number(urlArgs?.enforceVB) === 1 && !window.crossOriginIsolated,
      virtualBackgrounds:
        urlArgs?.customizeVb !== "1"
          ? []
          : [
              {
                url: "https://websdk.zoomdev.us/image/vb/JackYang.png",
              },
              {
                url: "https://websdk.zoomdev.us/image/vb/Zoom photo Logo.png",
                displayName: "Zoom photo Logo",
              },
              {
                url: "https://websdk.zoomdev.us/image/vb/Zoom_2022-Hispanic-Heritage-Month_VB.png",
                displayName: "Zoom_2022-Hispanic-Heritage-Month_VB",
              },
              {
                url: "https://websdk.zoomdev.us/image/vb/Zoom Beach Holiday.jpg",
                displayName: "Zoom Beach Holiday",
              },
              {
                url: "https://websdk.zoomdev.us/image/vb/Zoom-care.jpg",
                displayName: "Zoom-care",
              },
              {
                url: "https://websdk.zoomdev.us/image/vb/Zoom-Rebrand_VB_w_label_Option1.jpg",
                displayName: "Zoom-Rebrand_VB_w_label_Option1",
              },
              {
                url: "https://websdk.zoomdev.us/image/vb/Zoom Holiday.jpg",
                displayName: "Zoom Holiday",
              },
              {
                url: "https://websdk.zoomdev.us/image/vb/Zoom-Rebrand_VB_w_label_Option2.jpg",
                displayName: "Zoom-Rebrand_VB_w_label_Option2",
              },
              {
                url: "https://websdk.zoomdev.us/image/vb/Zoom_Ukraine.jpg",
                displayName: "Zoom_Ukraine",
              },
              {
                url: "https://websdk.zoomdev.us/image/vb/Zoom-Rebrand_VB_w_label_Option3.jpg",
                displayName: "Zoom-Rebrand_VB_w_label_Option3",
              },
            ],
    },
    recording: {
      enable: true,
    },
    livestream: {
      enable: true,
    },
    preview: {
      enable: urlArgs?.preview === "1",
      isAllowModifyName: true,
    },
    subsession: {
      enable: true,
    },
    caption: {
      enable: true,
    },
    chat: {
      enable: true,
      enableEmoji: true,
    },
    users: {
      enable: true,
    },
    leave: {
      enable: true,
    },
    // settings: {
    //   enable: true,
    // },
    // viewMode: {
    //   enable: true,
    //   defaultViewMode: SuspensionViewType.Speaker,
    //   viewModes: [SuspensionViewType.Gallery, SuspensionViewType.Speaker, SuspensionViewType.Minimized],
    // },
    // theme: {
    //   enable: true,
    //   // defaultTheme: "dark",
    // },
    // viewMode: {
    //   enable: true,
    //   defaultViewMode: SuspensionViewType.Gallery,
    //   viewModes: [SuspensionViewType.Gallery, SuspensionViewType.Speaker, SuspensionViewType.Minimized],
    // },
    feedback: {
      enable: true,
    },
    header: {
      enable: urlArgs?.header !== "0",
    },
    footer: {
      enable: urlArgs?.footer !== "0",
    },
    screenshot: {
      video: { enable: true },
      share: { enable: true },
    },
    cameraShare: {
      enable: true,
    },
    // Processors are opt-in. Configure them here to enable media processing capabilities.
    rawData: {
      enable: true,
      video: {
        enable: true,
        name: "watermark-processor",
        type: "video",
        url: "https://source.zoom.us/uitoolkit/processors/watermark-processor.js",
        title: "Watermark",
        options: {
          watermarkUrl: "https://source.zoom.us/uitoolkit/image/Zoom_Logo_Bloom_RGB.png",
          position: "bottom-right",
          opacity: 0.7,
          scale: 0.2,
        },
      },
      audio: {
        enable: true,
        name: "white-noise-processor",
        type: "audio",
        url: "https://source.zoom.us/uitoolkit/processors/white-noise-audio-processor.js",
        title: "White Noise",
        options: {},
      },
      share: {
        enable: true,
        name: "share-webgl-pii-processor",
        type: "share",
        url: "https://source.zoom.us/uitoolkit/processors/share-webgl-pii-processor.js",
        title: "WebGL PII Processor",
        options: {
          blurRegionNorm: {
            x: 0,
            y: 0,
            width: 1.0,
            height: 1.0,
          },
          blurRadius: 50,
        },
      },
    },
    // crc: {
    //   enable: false,
    // },
    // phone: {
    //   enable: false,
    // },
    // whiteboard: {
    //   enable: true,
    //   enableExport: false,
    //   enableViewerUserExport: false,
    // },
  } as any,
  debug: isDebug,
  sessionIdleTimeoutMins: 40, // Set an appropriate value
  language: urlArgs?.lang || "en-US", // Set the desired language
};

if (urlArgs.debug === "1") {
  (window as any).isZoomDevEnv = true;
}

urlArgs.customizeLayout = urlArgs?.customizeLayout === "1";
const customizeLayoutContainerIds = {
  parent: "uikit-container-customized",
  preview: "uikit-container-customized-preview",
  chat: "uikit-container-customized-chat",
  users: "uikit-container-customized-users",
  main: "uikit-container-customized-main",
  video: "uikit-container-customized-video",
  settings: "uikit-container-customized-settings",
  controls: "uikit-container-customized-controls",
};
// Replace the RESOLUTIONS constant with this
const STATIC_RESOLUTIONS = {
  "360p": { width: 640, height: 360 },
  "720p": { width: 1280, height: 720 },
  "1080p": { width: 1920, height: 1080 },
  "1440p": { width: 2560, height: 1440 },
} as const;

const POSITIONS = {
  "top-left": { top: 0, left: 0 },
  "top-right": { top: 0, right: 0 },
  "bottom-left": { bottom: 0, left: 0 },
  "bottom-right": { bottom: 0, right: 0 },
};

let joinedCallback: () => void;
let closedCallback: () => void;
let destroyedCallback: () => void;

export default function HomeApp() {
  const { t } = useTranslation();
  const [showJoinFlow, setShowJoinFlow] = useState(true);
  const [containerStyle, setContainerStyle] = useState({
    width: "100%",
    height: "100%",
    position: "absolute" as const,
    top: 0,
    left: 0,
    display: "none",
  });
  const [showControls, setShowControls] = useState(false);
  const isDraggable = urlArgs.drag === "1";
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const hideTimeoutRef = useRef<number>();
  const controlPanelRef = useRef<HTMLDivElement>(null);
  const _preShowJoinFlow = usePrevious(showJoinFlow);

  const defaultStyle = useRef({
    width: "100%",
    height: "100%",
    position: "absolute" as const,
    top: 0,
    left: 0,
    display: "block",
  });

  // Add these state variables inside HomeApp component
  const [currentResolution, setCurrentResolution] = useState<string>("fullscreen");
  const [currentPosition, setCurrentPosition] = useState<string>("top-left");

  // Inside the HomeApp component, add this state
  const [fullscreenResolution, setFullscreenResolution] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Add this new ref at the top of the HomeApp component with other refs
  const _toggleButtonRef = useRef<HTMLButtonElement>(null);

  const updateContainerSize = useCallback(
    (resolution: keyof typeof STATIC_RESOLUTIONS | "fullscreen") => {
      const dimensions = resolution === "fullscreen" ? fullscreenResolution : STATIC_RESOLUTIONS[resolution];

      setContainerStyle((prev) => ({
        ...prev,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        display: "block",
      }));

      // Center the container after resizing
      setPosition({
        x: (window.innerWidth - dimensions.width) / 2,
        y: (window.innerHeight - dimensions.height) / 2,
      });

      // Update current resolution
      setCurrentResolution(resolution);
    },
    [fullscreenResolution],
  );

  const updateContainerPosition = useCallback(
    (positionKey: keyof typeof POSITIONS) => {
      const pos = POSITIONS[positionKey];
      setContainerStyle((prev) => ({
        ...prev,
        display: "block",
      }));

      // Calculate position based on the selected corner
      const width = parseInt(containerStyle.width as string);
      const height = parseInt(containerStyle.height as string);

      let x = 0;
      let y = 0;

      if ("right" in pos) {
        x = window.innerWidth - width;
      }
      if ("bottom" in pos) {
        y = window.innerHeight - height;
      }

      setPosition({ x, y });

      // Update current position
      setCurrentPosition(positionKey);
    },
    [containerStyle.width, containerStyle.height],
  );

  const handleDrag = useCallback((_e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  }, []);

  const resetContainer = useCallback(() => {
    setContainerStyle(defaultStyle.current);
    setPosition({ x: 0, y: 0 });
    setCurrentResolution("fullscreen");
    setCurrentPosition("top-left");
  }, []);

  const clickJoinSession = useCallback(async () => {
    const sessionContainer = document.getElementById("sessionContainer");
    if (sessionContainer) {
      setShowJoinFlow(false);
      if (customization.videoSDKJWT === "") {
        const signature = await getJwtToken(urlArgs);
        customization.videoSDKJWT = signature;
      }
      // console.log("========customization", customization);

      if (isDebug) {
        const newConfig = UIToolkit.migrateConfig(customization as CustomizationOptions);
        UIToolkit.joinSession(sessionContainer, newConfig as CustomizationOptions);
      } else {
        const tempConfig = UIToolkit.migrateConfig({
          videoSDKJWT: urlArgs.signature,
          sessionName: urlArgs.topic,
          userName: urlArgs.name,
          sessionPasscode: urlArgs.password,
          webEndpoint: urlArgs.web || urlArgs.webEndpoint,
          dependentAssets: urlArgs.dependentAssets,
          featuresOptions: defaultConfig.featuresOptions,
          language: urlArgs?.lang || "en-US",
        } as CustomizationOptions);
        UIToolkit.joinSession(sessionContainer, tempConfig as CustomizationOptions);
      }

      if (!isMobileDeviceNotIpad()) {
        setShowControls(true);
      }

      setContainerStyle({
        ...containerStyle,
        display: "block",
      });

      joinedCallback = () => {
        console.log("session joined for the first time");
        setShowControls(true);
        setContainerStyle({
          ...containerStyle,
          display: "block",
        });

        (window as any).zmClient = UIToolkit.getClient();
        (window as any).wbClient = UIToolkit.getClient()?.getWhiteboardClient();
        (window as any).subsessionClient = UIToolkit.getClient()?.getSubsessionClient();
        (window as any).streamClient = UIToolkit.getClient()?.getMediaStream();
        (window as any).chatClient = UIToolkit.getClient()?.getChatClient();
        (window as any).commandClient = UIToolkit.getClient()?.getCommandClient();
      };
      UIToolkit.onSessionJoined(joinedCallback);

      closedCallback = () => {
        console.log("session closed");
      };
      UIToolkit.onSessionClosed(closedCallback);
      destroyedCallback = () => {
        setContainerStyle({
          ...containerStyle,
          display: "none",
        });
        setShowControls(false);
        setShowJoinFlow(true);
        UIToolkit.offSessionJoined(joinedCallback); // just test offSessionJoined api
        UIToolkit.offSessionClosed(closedCallback); // just test offSessionClosed api
        // off all events callbacks and destroy the toolkit, don't need call offSessionJoined/offSessionClosed
        UIToolkit.destroy();

        console.log("========UIToolkit.destroy");
      };
      UIToolkit.onSessionDestroyed(destroyedCallback);

      if (isDebug) {
        urlArgs.listenEvents.forEach((event: string) => {
          Logger.success("listenEvent:", event);

          if (event in eventHandlers) {
            // Use type assertion for dynamic method access
            const toolkit = UIToolkit as any;
            if (typeof toolkit[event] === "function") {
              toolkit[event](eventHandlers[event]);
            } else {
              Logger.error(`Event method ${event} not found on UIToolkit`);
            }
          } else if (event) {
            UIToolkit.on(event, (data: any) => {
              Logger.event(event, data);
            });
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!urlArgs.customizeLayout && !urlArgs.channelId) {
        clickJoinSession();
      }
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [clickJoinSession]);

  // Add touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Prevent default only if touching the control panel
    if (controlPanelRef.current?.contains(e.target as Node)) {
      e.preventDefault();
    }
  }, []);

  // Setup touch events and cleanup
  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentTimeout = hideTimeoutRef.current;
      if (currentTimeout) {
        window.clearTimeout(currentTimeout);
      }
    };
  }, [handleTouchStart]);

  // Add this function inside the HomeApp component
  const handleFullscreen = useCallback(() => {
    updateContainerSize("fullscreen");
    setPosition({ x: 0, y: 0 }); // Reset position when going fullscreen
  }, [updateContainerSize]);

  // Update the useEffect that handles window resizing
  useEffect(() => {
    const handleResize = () => {
      // Update fullscreen resolution when window is resized
      setFullscreenResolution({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // If currently in fullscreen, update the container size
      if (containerStyle.width === `${window.innerWidth}px`) {
        updateContainerSize("fullscreen");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerStyle.width, updateContainerSize]);

  useEffect(() => {
    if (!urlArgs?.channelId) {
      return;
    }

    const sessionContainer = document.getElementById("sessionContainer");
    if (!sessionContainer) {
      return;
    }

    setShowJoinFlow(false);
    setContainerStyle((prev) => ({
      ...prev,
      display: "block",
    }));

    UIToolkit.showBroadcastViewerComponent(sessionContainer, {
      channelId: urlArgs.channelId,
      signature: urlArgs.signature,
      language: urlArgs?.lang,
      webEndpoint: urlArgs?.webEndpoint,
      dependentAssets: urlArgs?.dependentAssets,
    });
  }, []);

  const nodeRef = useRef(null);

  if (urlArgs?.video === "1") {
    return <VideoDemoHome />;
  }

  if (urlArgs?.meeting === "1") {
    return <MeetingDemoHome />;
  }

  if (urlArgs?.webapp === "1") {
    return <WebApp />;
  }

  if (urlArgs?.probesdk === "1") {
    return <ProbeSDKHome />;
  }

  return (
    <div className="App" style={{ height: "100vh", width: "100vw" }}>
      <main style={{ height: "100%", width: "100%" }} id="uikit-demo-container">
        {showJoinFlow && (
          <div id="join-flow" className="uikit-demo-join-flow">
            <h1 className="uikit-demo-join-title">{t("demo.join_flow_title")}</h1>
            <p className="uikit-demo-join-description">{t("demo.join_flow_description")}</p>
            <button onClick={clickJoinSession} className="uikit-demo-join-button">
              {t("join.session_button")}
            </button>
          </div>
        )}

        {!urlArgs.customizeLayout && isDraggable && (
          <Draggable
            position={position}
            onDrag={handleDrag}
            disabled={!isDraggable}
            bounds="body"
            nodeRef={nodeRef}
            handle="#uikit-header"
          >
            <div className="zoom-ui-toolkit-root" id="sessionContainer" style={containerStyle} ref={nodeRef}></div>
          </Draggable>
        )}
        {!urlArgs.customizeLayout && !isDraggable && (
          <div id="sessionContainer" style={containerStyle} ref={nodeRef}></div>
        )}
        {urlArgs.customizeLayout && (
          <CustomizeLayout
            config={customization}
            containerIds={customizeLayoutContainerIds}
            getJwtToken={getJwtToken}
            urlArgs={urlArgs}
            setShowJoinFlow={setShowJoinFlow}
            setShowControls={setShowControls}
          />
        )}

        <div className="zoom-ui-toolkit-root bg-theme-surface" style={{ width: "200px" }}>
          {isDebug && showControls && (
            <DebugSettingDraggable
              isDraggable={isDraggable}
              updateContainerSize={updateContainerSize}
              updateContainerPosition={updateContainerPosition}
              resetContainer={resetContainer}
              handleFullscreen={handleFullscreen}
              currentResolution={currentResolution}
              currentPosition={currentPosition}
              isCustomizeLayout={urlArgs.customizeLayout}
            />
          )}
        </div>
      </main>
    </div>
  );
}
