import "@/components/theme/theme.css";
import ErrorContainer from "@/components/error/ErrorContainer";
import EndNotification from "@/components/notification/EndNotification";

import LoadingScreen from "@/components/LoadingScreen";
import { useCallback, useEffect, useRef, useState } from "react";
import { SessionApp } from "@/features/session-app";
import { ConnectionChangePayload, CustomizationOptions, SessionClient, SessionStatus } from "./types/index.d";
import { SessionState, setAvatarUrl, setIsAudioBridge, setSessionInfo, setSessionStatus } from "@/store/sessionSlice";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { useMount } from "@/hooks";
import {
  SessionUIState,
  setActiveCamera,
  setActiveMicrophone,
  setActiveSpeaker,
  setMaximumVideosInGalleryView,
  setPreviewAVStatus,
  setThemeName,
  setVbImageList,
} from "@/store/uiSlice";

import MeetingUI from "@/components/container/desktop/MeetingUI";
import MobileMeetingUI from "@/components/container/mobile/MobileMeetingUI";
import DeviceManager, { DeviceManagerEvents } from "@/components/util/DeviceManager";
import "./i18n";

import { decodeJWTPlayload } from "./components/util/util";
import { useTranslation } from "react-i18next";
import { getZoomImgPath, isMobileDevice, isMobileDeviceNotIpad } from "./components/util/service";
import AvatarPicker from "./components/widget/AvatarPicker";
import PreviewPageAvatar from "./features/preview/PreviewPage";
import { getBrowserTheme } from "./components/util/platform";
import { ExposedEvents } from "./events/event-constant";
import { emit } from "@/events/event-bus";

const MOBILE_BREAKPOINT = 768;
function isMobileFunction(): boolean {
  if (typeof window !== "undefined") {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  return false;
}
declare global {
  interface Window {
    zmClient: SessionClient;
  }
}
interface ErrorStatus {
  errorCode: string | number;
  reason: string | undefined;
  result: string;
}

let hadJoined = false;

export const SessionApplication = ({
  client,
  config,
  options,
}: {
  client: SessionClient;
  config: CustomizationOptions;
  options?: { onClickJoin: () => void };
}) => {
  const dispatch = useAppDispatch();
  const { status, featuresOptions } = useAppSelector(useSessionSelector);

  const sessionUI: SessionUIState = useAppSelector(useSessionUISelector);

  const [, setState] = useState({});
  const forceUpdate = useCallback(() => setState({}), []);
  const { t, i18n } = useTranslation();
  const [errorStatus, setErrorStatus] = useState<ErrorStatus>({
    errorCode: "",
    reason: "",
    result: "",
  });
  const [isClientInit, setIsClientInit] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(config.featuresOptions?.preview?.enable);

  const isOnlyPreview = typeof options?.onClickJoin === "function";

  const timerRef = useRef(0);
  // Used to delay setting isJoined to false, allowing notifications to show properly
  const onConnectionCloseTimeout = 5000;
  // find and disable feature
  useMount(() => {
    Object.keys(config.featuresOptions).forEach((feature) => {
      if (!config.featuresOptions[feature].enable) {
        switch (feature) {
          case "audio":
            break;
          case "video":
            break;
          case "share":
            break;
          case "settings":
            break;
          case "preview":
            setIsPreview(false);
            break;
          case "chat":
            break;
          case "users":
            break;

          default:
            break;
        }
      }
    });
  });
  /**
   * Used for obtaining the video container ref
   */
  useEffect(() => {
    switch (status) {
      case SessionStatus.Connected:
        forceUpdate();
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = 0;
        }
        setIsJoined(true);

        break;
      case SessionStatus.Reconnecting:
      case SessionStatus.Fail:
        hadJoined = false;
        setIsJoined(false);
        break;
      case SessionStatus.Closed:
        // Delays state update, so that notifications are shown properly
        if (!featuresOptions?.feedback?.enable) {
          timerRef.current = window.setTimeout(() => setIsJoined(false), onConnectionCloseTimeout);
        }
        hadJoined = false;
        break;
      default:
        break;
    }
  }, [status, client, forceUpdate, featuresOptions?.feedback?.enable]);

  useEffect(() => {
    i18n.changeLanguage("en-US");
  }, [config.language, i18n]);

  useEffect(() => {
    if (status === SessionStatus.Connected) {
      setIsLoading(false);
    }
  }, [status]);

  useMount(() => {
    const setupClient = async () => {
      const sessionValue = sessionStorage.getItem("UIKIT_SDK_MAXIMUM_VIDEOS");
      let value;
      if (sessionValue && Number(sessionValue)) {
        value = Number(sessionValue);
      } else {
        if (sessionUI.maximumVideosInGalleryView) {
          value = sessionUI.maximumVideosInGalleryView;
        }
      }
      if (value) {
        dispatch(setMaximumVideosInGalleryView(Math.min(value, 25)));
      }
      const vbImageFolder = getZoomImgPath();
      const vbImages =
        config.featuresOptions?.virtualBackground?.virtualBackgrounds?.length > 0
          ? config.featuresOptions?.virtualBackground?.virtualBackgrounds
          : [
              {
                url: `${vbImageFolder}/earth.jpg`,
                displayName: "Earth",
              },
              {
                url: `${vbImageFolder}/grass.jpg`,
                displayName: "Grass",
              },
              {
                url: `${vbImageFolder}/SanFrancisco.jpg`,
                displayName: "San Francisco",
              },
            ];
      dispatch(setVbImageList(vbImages));

      const videoSDKInitArgs = {
        webEndpoint: config.webEndpoint,
        enforceMultipleVideos: config.featuresOptions?.video?.enforceMultipleVideos,
        enforceVirtualBackground: config.featuresOptions?.virtualBackground?.enforceVirtualBackground,
        stayAwake: true,
        isUIToolkit: true,
        leaveOnPageUnload: config.leaveOnPageUnload ?? false,
      } as any;
      if (config.featuresOptions?.video?.disableRenderLimits) {
        videoSDKInitArgs.enforceMultipleVideos = {
          disableRenderLimits: config.featuresOptions?.video?.disableRenderLimits,
        };
      }
      await client.init(config.language, config?.dependentAssets || "Global", videoSDKInitArgs);
      setIsClientInit(true);
    };
    setupClient();
  });

  // This onConnectionChange only checks for errors, since the primary logic is already handled in SessionApp
  const onConnectionChange = useCallback(
    (payload: ConnectionChangePayload | any) => {
      const payloadState = payload.state as SessionStatus;
      if (payloadState === SessionStatus.Fail) {
        const { errorCode, reason, result, sessionInfo } = payload;
        dispatch(setSessionInfo(sessionInfo));
        setErrorStatus({
          errorCode: errorCode,
          reason: reason,
          result: result,
        });
      } else if (payloadState === SessionStatus.Closed) {
        setErrorStatus({ errorCode: "", reason: payload?.reason, result: "" });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    client.on("connection-change", onConnectionChange);
    return () => client.off("connection-change", onConnectionChange);
  }, [client, onConnectionChange]);

  useEffect(() => {
    let themeName;
    if (config.featuresOptions?.theme?.defaultTheme) {
      themeName = config.featuresOptions?.theme?.defaultTheme;
    } else if (localStorage.getItem("theme")) {
      themeName = localStorage.getItem("theme");
    } else {
      themeName = getBrowserTheme();
    }
    document.documentElement.setAttribute("zoom-data-theme", themeName);
    dispatch(setThemeName(themeName));
  }, [dispatch, config.featuresOptions?.theme]);

  const retryJoin = useCallback(() => {
    setErrorStatus({ errorCode: "", reason: "", result: "" });
    client
      ?.join(
        config?.sessionName,
        config.videoSDKJWT,
        config?.userName,
        config?.sessionPasscode,
        config?.sessionIdleTimeoutMins,
      )
      .then((e: any) => {
        return Promise.resolve(e);
      })
      .catch((e: any) => {
        return Promise.reject(e);
      });
  }, [client, config]);

  const handleJoinSession = async ({
    displayName,
    avatarUrl,
    isCameraOn,
    isAudioOn,
    isMicMuted,
    selectedCamera,
    selectedMic,
    selectedSpeaker,
  }: {
    displayName: string;
    avatarUrl: string;
    isCameraOn: boolean;
    isAudioOn: boolean;
    isMicMuted: boolean;
    selectedCamera: string;
    selectedMic: string;
    selectedSpeaker: string;
  }) => {
    setIsPreview(false);
    setIsLoading(true);
    config.userName = displayName;

    if (hadJoined) {
      return;
    }

    hadJoined = true;
    await client?.join(
      config.sessionName,
      config.videoSDKJWT,
      config.userName,
      config?.sessionPasscode,
      config?.sessionIdleTimeoutMins,
    );

    if (avatarUrl) dispatch(setAvatarUrl(avatarUrl));
  };
  useEffect(() => {
    const joinSession = async () => {
      if (isClientInit) {
        if (!isPreview && !isOnlyPreview) {
          setIsLoading(true);
          await handleJoinSession({
            displayName: config.userName,
            avatarUrl: "",
            isCameraOn: false,
            isAudioOn: false,
            isMicMuted: false,
            selectedCamera: "",
            selectedMic: "",
            selectedSpeaker: "",
          });
        }
      }
    };
    joinSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.userName, isPreview, isClientInit]);

  useMount(() => {});
  switch (status) {
    case SessionStatus.Closed:
      if (isJoined) {
        // host kicked
        if (errorStatus.reason === "kicked by host" || errorStatus.reason === "expeled by host") {
          return <ErrorContainer errorStatus={errorStatus} onRetry={() => retryJoin()} />;
        }
        // host end or click leave
        return (
          <EndNotification
            reason={errorStatus.reason}
            isEnableFeedback={featuresOptions?.feedback?.enable}
            setIsJoined={() => setIsJoined(false)}
          />
        );
      } else if (!isJoined) {
        return <div />;
      }
      break;
    case SessionStatus.Fail:
      if (errorStatus.errorCode) {
        return <ErrorContainer errorStatus={errorStatus} onRetry={() => retryJoin()} />;
      }
      break;
    case SessionStatus.Reconnecting:
      break;
    case SessionStatus.Connected:
      window.zmClient = client;
      break;
    default:
    // console.log("Unknown connection status: ", status);
  }

  if (isPreview || isOnlyPreview) {
    window.zmClient = client;
    const decodeJWT = decodeJWTPlayload(config.videoSDKJWT);
    const isSupportVirtualBackground =
      config.featuresOptions?.virtualBackground?.enable &&
      (config.featuresOptions?.virtualBackground?.enforceVirtualBackground || decodeJWT?.video_webrtc_mode === 1) &&
      !isMobileDevice();
    // const isSupportVirtualBackground = client.getMediaStream().isSupportVirtualBackground();
    return (
      <PreviewPageAvatar
        onJoinSession={
          isOnlyPreview
            ? () => {
                options?.onClickJoin();
                emit(ExposedEvents.EVENT_SESSION_CLICK_JOIN, "");
              }
            : handleJoinSession
        }
        displayName={config?.userName}
        isSupportVirtualBackground={isSupportVirtualBackground}
        isAllowModifyName={config.featuresOptions?.preview?.isAllowModifyName}
        isClientInit={isClientInit}
      />
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }
  return isMobileDeviceNotIpad() ? <MobileMeetingUI /> : <MeetingUI />;
};

const App = (props: { client: SessionClient; config: CustomizationOptions | any }) => {
  return <SessionApplication client={props.client} config={props.config} />;
};

export default App;
