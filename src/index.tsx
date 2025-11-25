import { b64DecodeUnicode, b64EncodeUnicode, generateVideoToken } from "./components/util/util";
import { devConfig } from "./config/dev";
import { v7 as uuidv7 } from "uuid";
import UIToolkit from "./uikit/index";
import { useState, useCallback, useRef, useEffect } from "react";
import { AudioVideoPlaybacks, CustomizationOptions, SuspensionViewType } from "./types/index.d";
import { getExploreName } from "./components/util/platform";
import WebApp from "./webapp";
import "./demo.css";
import { usePrevious } from "./hooks";

let urlArgs: any = Object.fromEntries(new URLSearchParams(location.search));
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

  if (urlArgs?.customerJoinId) {
    try {
      urlArgs.customerJoinId = b64DecodeUnicode(urlArgs.customerJoinId);
    } catch (e) {
      console.log("ingore base64 decode", "customerJoinId", urlArgs.customerJoinId);
    }
  } else {
    urlArgs.customerJoinId = "";
  }
}

const getJwtToken = async (data: any) => {
  // TODO: get jwt token from backend
  console.error("getJwtToken from backend not implemented");
  return "";
};
console.log("=====================================");
console.log("urlArgs", urlArgs);
if (!urlArgs.signature || urlArgs.signature === "") {
  if (process.env.NODE_ENV === "development") {
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
      telemetry_tracking_id: urlArgs.telemetry_tracking_id || "",
      enforceWebrtc: 1,
      preview: urlArgs.preview || "0",
      debug: urlArgs.debug || "0",
    };
    console.log("use url args");
    console.log(window.location.origin + "/?" + new URLSearchParams(tmpUrlArgs).toString());
  }
}

urlArgs.dependentAssets = `${window.location.origin}/lib`;

export const audioVideoPlaybacks: AudioVideoPlaybacks[] = [
  { title: "None", url: "" },
  { title: "ZOOM ZWA", url: "https://source.zoom.us/brand/mp4/Using%20the%20Zoom%20PWA.mp4" },
  { title: "ZOOM Cares", url: "https://source.zoom.us/brand/mp4/Zoom%20Cares%20Nonprofit%20Impact.mp4" },
  {
    title: "ZOOM One video",
    url: "https://source.zoom.us/brand/mp4/Zoom%20One%20-%20Team%20Chat%2C%20Phone%2C%20Email%2C%20and%20more.mp4",
  },
];
let isDebug = false;
if (urlArgs?.debug === "1") {
  isDebug = true;
} else if (urlArgs?.debug === "0") {
  isDebug = false;
}
const customization: CustomizationOptions = {
  videoSDKJWT: urlArgs.signature,
  sessionName: urlArgs.topic,
  userName: urlArgs.name,
  sessionPasscode: urlArgs.password,
  webEndpoint: urlArgs.web || urlArgs.webEndpoint,
  dependentAssets: urlArgs.dependentAssets,
  featuresOptions: {
    // audio: {
    //   enable: true,
    // },
    // video: {
    //   enable: true,
    // },
    // share: {
    //   enable: true,
    // },
    // invite: {
    //   enable: true,
    //   inviteLink: "https://zoom.us", // you custom invite link
    // },
    // playback: {
    //   enable: true,
    //   audioVideoPlaybacks: audioVideoPlaybacks,
    // },
    // virtualBackground: {
    //   enable: true,
    //   allowVirtualBackgroundUpload: false,
    // },
    // recording: {
    //   enable: true,
    // },
    // livestream: {
    //   enable: true,
    // },
    preview: {
      enable: urlArgs?.preview === "1",
      isAllowModifyName: true,
    },
    // subsession: {
    //   enable: true,
    // },
    // caption: {
    //   enable: true,
    // },
    // chat: {
    //   enable: true,
    //   enableEmoji: true,
    // },
    // users: {
    //   enable: true,
    // },
    // leave: {
    //   enable: true,
    // },
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
    // feedback: {
    //   enable: true,
    // },
    // header: {
    //   enable: true,
    // },
    // footer: {
    //   enable: true,
    // },
    // screenshot: {
    //  video: { enable: true },
    //  share: { enable: true },
    // },
    // cameraShare: {
    //   enable: true,
    // },
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
    }
  },
  debug: isDebug,
  sessionIdleTimeoutMins: 40, // Set an appropriate value
  language: urlArgs?.language || "en-US", // Set the desired language
};

let joinedCallback: () => void;
let closedCallback: () => void;
let destroyedCallback: () => void;

export default function HomeApp() {
  const [showJoinFlow, setShowJoinFlow] = useState(true);
  const [containerStyle, setContainerStyle] = useState({
    width: "100%",
    height: "100%",
    position: "absolute" as const,
    top: 0,
    left: 0,
    display: "none",
  });

  const hideTimeoutRef = useRef<number>();
  const controlPanelRef = useRef<HTMLDivElement>(null);
  const defaultStyle = useRef({
    width: "100%",
    height: "100%",
    position: "absolute" as const,
    top: 0,
    left: 0,
    display: "block",
  });

  const clickJoinSession = async () => {
    const sessionContainer = document.getElementById("sessionContainer");
    if (sessionContainer) {
      setShowJoinFlow(false);
      // console.log("========clickJoinSession");

      if (customization.videoSDKJWT === "") {
        const signature = await getJwtToken(urlArgs);
        customization.videoSDKJWT = signature;
      }
      // console.log("========customization", customization);
      const newConfig = UIToolkit.migrateConfig(customization as CustomizationOptions);

      UIToolkit.joinSession(sessionContainer, newConfig as CustomizationOptions);

      setContainerStyle({
        ...containerStyle,
        display: "block",
      });
      joinedCallback = () => {
        console.log("session joined");

        setContainerStyle({
          ...containerStyle,
          display: "block",
        });

        (window as any).zmClient = UIToolkit.getClient();
        (window as any).wbClient =
          typeof (UIToolkit.getClient() as any)?.getWhiteboardClient === "function"
            ? (UIToolkit.getClient() as any).getWhiteboardClient()
            : undefined;
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
        setShowJoinFlow(true);
        UIToolkit.offSessionJoined(joinedCallback); // just test offSessionJoined api
        UIToolkit.offSessionClosed(closedCallback); // just test offSessionClosed api
        // off all events callbacks and destroy the toolkit, don't need call offSessionJoined/offSessionClosed
        UIToolkit.destroy();
        console.log("========UIToolkit.destroy");
      };
      UIToolkit.onSessionDestroyed(destroyedCallback);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      // auto click join session
      clickJoinSession();
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [handleTouchStart]);

  const nodeRef = useRef(null);

  if (urlArgs?.webapp === "1") {
    return <WebApp />;
  }

  return (
    <div className="App" style={{ height: "100vh", width: "100vw" }}>
      <main style={{ height: "100%", width: "100%" }} id="uikit-demo-container">
        {showJoinFlow && (
          <div id="join-flow" className="uikit-demo-join-flow">
            <h1 className="uikit-demo-join-title">Zoom Video SDK</h1>
            <p className="uikit-demo-join-description">User interface offered by the Video SDK UI Toolkit</p>
            <button onClick={clickJoinSession} className="uikit-demo-join-button">
              Join Session
            </button>
          </div>
        )}

        <div id="sessionContainer" style={containerStyle} ref={nodeRef}></div>
      </main>
    </div>
  );
}
