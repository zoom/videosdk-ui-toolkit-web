import React, { useState, useCallback, useMemo } from "react";
import { SnackbarProvider, MaterialDesignContent } from "notistack";
import {
  SessionClient,
  MediaStream,
  ChatClient,
  RecordingClient,
  CustomizationOptions,
  CaptionClient,
  SessionStatus,
  SubsessionClient,
  LiveStreamClient,
  WhiteboardClient,
  RealTimeMediaStreamsClient,
  BroadcastStreamingClient,
} from "@/types/index.d";
import { useMount, useParticipantsChange } from "../../hooks";
import i18n from "../../i18n";
import { StreamContext } from "../../context/stream-context";
import { ClientContext } from "../../context/client-context";
import SessionAdditionalContext from "../../context/session-additional-context";

import {
  setIsOriginHost,
  setIsSupportMultipleVideos,
  setIsManager,
  setIsHost,
  setSessionStatus,
  setSessionInfo,
  setConfig,
  resetSession,
  setUserId,
  setIsAudioBridge,
  setIsEnablePhone,
  setTrackingId,
  setInviteLink,
  setCallInInfo,
  setCallOutCountry,
  setIsVideoWebRTC,
  setLiveStreamStatus,
} from "@/store/sessionSlice";

import { useConnectionChange, useMediaSDKChange, useNetworkQuality, useSharePrivilege } from "./hooks";
import { useRecordingChange } from "../recording/hooks/useRecordingChange";
import { useCaption } from "../caption/hooks/useCaption";
import { useWhiteboardEvents } from "../whiteboard/hooks/useWhiteboardEvents";
import { useRealTimeMediaStreamsEvents } from "../real-time-media-streams/hooks/useRealTimeMediaStreamsEvents";
import { useBroadcastStreaming } from "@/features/broadcast-streaming/hooks";

import {
  useAppDispatch,
  useAppSelector,
  useMediaSelector,
  useSessionSelector,
  useSessionUISelector,
} from "@/hooks/useAppSelector";
import {
  resetSessionUI,
  setActiveVbImage,
  setFooterEnable,
  setHeaderEnable,
  setIsSupportVB,
  setIsSupportAudioProcessor,
  setIsSupportVideoProcessor,
  setIsSupportShareProcessor,
  setParticipantSize,
  setVbImageList,
  setViewType,
} from "@/store/uiSlice";
import { resetWhiteboard, setIsDisableExport, setWhiteboardEnabled } from "../whiteboard/whiteboardSlice";
import { resetRtms } from "../real-time-media-streams/rtmsSlice";
import { resetMedia } from "../media/mediaSlice";
import { setParticipants } from "../participant/participantSlice";
import { checkIsFeatureEnable, decodeJWTPlayload } from "@/components/util/util";
import { getZoomImgPath, isIpadOS, isMobileDevice } from "@/components/util/service";

interface SessionAppProps {
  client: SessionClient;
  children: React.ReactNode;
  config: CustomizationOptions;
}

declare global {
  interface Window {
    sessionClient: any | undefined;
    caption: any | undefined;
  }
}

const SessionAppInner = (props: SessionAppProps) => {
  const { client, children, config } = props;
  const dispatch = useAppDispatch();

  const session = useAppSelector(useSessionSelector);
  const sessionUI = useAppSelector(useSessionUISelector);
  const mediaState = useAppSelector(useMediaSelector);

  const [chatClient, setChatClient] = useState<ChatClient>();
  const [recordingClient, setRecordingClient] = useState<RecordingClient>();
  const [captionClient, setCaptionClient] = useState<CaptionClient>();
  const [subsessionClient, setSubsessionClient] = useState<SubsessionClient>();
  const [liveStreamClient, setLiveStreamClient] = useState<LiveStreamClient>();
  const [whiteboardClient, setWhiteboardClient] = useState<WhiteboardClient>();
  const [realTimeMediaStreamsClient, setRealTimeMediaStreamsClient] = useState<RealTimeMediaStreamsClient>();
  const [broadcastStreamingClient, setBroadcastStreamingClient] = useState<BroadcastStreamingClient>();
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);

  const streamContextValue = useMemo(() => ({ ...mediaState, stream }), [stream, mediaState]);

  const sessionAdditionalContextValue = useMemo(
    () => ({
      chatClient,
      recordingClient,
      captionClient,
      subsessionClient,
      liveStreamClient,
      whiteboardClient,
      realTimeMediaStreamsClient,
      broadcastStreamingClient,
    }),
    [
      chatClient,
      recordingClient,
      captionClient,
      subsessionClient,
      liveStreamClient,
      whiteboardClient,
      realTimeMediaStreamsClient,
      broadcastStreamingClient,
    ],
  );

  const setupApp = useCallback(() => {
    if (!stream) {
      const mediaStream = client.getMediaStream();
      setStream(mediaStream);
      dispatch(setIsSupportMultipleVideos(mediaStream.isSupportMultipleVideos()));
      dispatch(setIsSupportVB(mediaStream?.isSupportVirtualBackground()));

      const rawDataEnabled = config.featuresOptions?.rawData?.enable ?? false;
      const isAudioProcessorSupported =
        mediaStream?.isSupportAudioProcessor() &&
        rawDataEnabled &&
        (config.featuresOptions?.rawData?.audio?.enable ?? false);
      const isVideoProcessorSupported =
        mediaStream?.isSupportVideoProcessor() &&
        rawDataEnabled &&
        (config.featuresOptions?.rawData?.video?.enable ?? false);
      const isShareProcessorSupported =
        mediaStream?.isSupportShareProcessor() &&
        rawDataEnabled &&
        (config.featuresOptions?.rawData?.share?.enable ?? false);

      dispatch(setIsSupportAudioProcessor(isAudioProcessorSupported));
      dispatch(setIsSupportVideoProcessor(isVideoProcessorSupported));
      dispatch(setIsSupportShareProcessor(isShareProcessorSupported));

      if (mediaStream?.isSupportPhoneFeature()) {
        dispatch(setIsEnablePhone(true));
        dispatch(setCallInInfo(mediaStream.getCurrentSessionCallinInfo()));
        dispatch(setCallOutCountry(mediaStream.getSupportCountryInfo()));
      }
    }
    const sessionOptions = {
      isChatEnabled: true,
      isRecordingEnabled: true,
      isCaptionEnabled: true,
      isLiveStreamEnabled: true,
    };
    const chatClient = client.getChatClient();
    if (chatClient && sessionOptions.isChatEnabled) {
      setChatClient(chatClient);
    } else {
      setChatClient(undefined);
    }

    const recordingClient = client.getRecordingClient();
    if (recordingClient && sessionOptions.isRecordingEnabled) {
      setRecordingClient(recordingClient);
    }

    const captionClient = client.getLiveTranscriptionClient();
    if (captionClient && sessionOptions.isCaptionEnabled) {
      setCaptionClient(captionClient);
    }

    const whiteboardClient: WhiteboardClient | undefined =
      typeof (client as any)?.getWhiteboardClient === "function" ? (client as any).getWhiteboardClient() : undefined;
    if (whiteboardClient && whiteboardClient?.isWhiteboardEnabled()) {
      setWhiteboardClient(whiteboardClient);
      dispatch(setWhiteboardEnabled(true));
      dispatch(setIsDisableExport(!config.featuresOptions?.whiteboard?.enableExport));
    } else {
      dispatch(setWhiteboardEnabled(false));
    }

    const realTimeMediaStreamsClient: RealTimeMediaStreamsClient | undefined =
      typeof (client as any)?.getRealTimeMediaStreamsClient === "function"
        ? (client as any).getRealTimeMediaStreamsClient()
        : undefined;
    if (realTimeMediaStreamsClient) {
      setRealTimeMediaStreamsClient(realTimeMediaStreamsClient);
    }

    const subsessionClient = client.getSubsessionClient();
    if (subsessionClient) {
      setSubsessionClient(subsessionClient);
    }
    const liveStreamClient = client.getLiveStreamClient();
    if (liveStreamClient && sessionOptions.isLiveStreamEnabled) {
      setLiveStreamClient(liveStreamClient);
      setLiveStreamStatus(liveStreamClient.getLiveStreamStatus());
    } else {
      setLiveStreamClient(liveStreamClient);
    }

    const broadcastClient = (client as any)?.getBroadcastStreamingClient?.();
    if (broadcastClient && broadcastClient?.isBroadcastStreamingEnable?.()) {
      setBroadcastStreamingClient(broadcastClient);
    } else {
      setBroadcastStreamingClient(undefined);
    }

    dispatch(setConfig(config));
    if (config?.featuresOptions?.viewMode?.defaultViewMode) {
      dispatch(setViewType(config.featuresOptions.viewMode.defaultViewMode));
    }
    if (config?.featuresOptions?.header) {
      dispatch(setHeaderEnable(config?.featuresOptions?.header?.enable));
    }
    if (config?.featuresOptions?.footer) {
      dispatch(setFooterEnable(config?.featuresOptions?.footer?.enable));
    }
    const decodeJWT = decodeJWTPlayload(config.videoSDKJWT);
    if (decodeJWT?.audio_compatible_mode) {
      dispatch(setIsAudioBridge(true));
    } else if (isMobileDevice() || isIpadOS()) {
      dispatch(setIsAudioBridge(true));
    }

    let rwgAgent = null;
    const clientSymbol = Reflect.ownKeys(client).find((key) => typeof key === "symbol");
    if (clientSymbol) {
      const originalClient = (client as any)[clientSymbol];
      if (originalClient) {
        const { mediaStream } = originalClient;
        const mediaContextSymbol = Reflect.ownKeys(mediaStream).find(
          (key) => typeof key === "symbol" && String(key) === "Symbol(mediaContext)",
        );
        // eslint-disable-next-line prefer-destructuring
        if (mediaContextSymbol) rwgAgent = mediaStream[mediaContextSymbol].rwgAgent;
      }
    }
    const isWebRTC = new URLSearchParams(rwgAgent?.websocket?.url).get("useWBVideo") === "1";
    dispatch(setIsVideoWebRTC(isWebRTC));

    // console.log(decodeJWTPlayload(config.videoSDKJWT));
    if (decodeJWT?.telemetry_tracking_id) {
      dispatch(setTrackingId(decodeJWT?.telemetry_tracking_id));
    }

    if (config.featuresOptions?.invite?.inviteLink && config.featuresOptions.invite.enable) {
      dispatch(setInviteLink(config.featuresOptions.invite.inviteLink));
    }

    const sessionInfo = client.getSessionInfo();
    dispatch(setIsOriginHost(client.isOriginalHost()));
    dispatch(setSessionInfo(sessionInfo));

    if (config.language !== "en-US") {
      i18n.changeLanguage(config.language);
    }
  }, [client, config, dispatch, stream]);

  const resetApp = useCallback(() => {
    dispatch(setSessionStatus(SessionStatus.Reconnecting));
    dispatch(resetSession());
    dispatch(resetSessionUI());
    dispatch(resetMedia());
    dispatch(resetWhiteboard());
    dispatch(resetRtms());
    setStream(undefined);
    setChatClient(undefined);
    setRecordingClient(undefined);
    // dispatch(setVbImageList([]));
    dispatch(setActiveVbImage(""));
    dispatch(setParticipants([]));
  }, [dispatch]);

  useConnectionChange(client, dispatch, setupApp, resetApp);
  useMediaSDKChange(client, dispatch);
  useRecordingChange(client, dispatch);
  useCaption(client, captionClient, setCaptionClient);
  useWhiteboardEvents(client, whiteboardClient);
  useRealTimeMediaStreamsEvents(client, realTimeMediaStreamsClient);

  useMount(() => {
    const sessionInfo = client?.getSessionInfo();
    if (sessionInfo?.isInMeeting) {
      setupApp();
    }
    // error
    // dispatch(
    //   setSessionStatus(
    //     sessionInfo.isInMeeting
    //       ? SessionStatus.Connected
    //       : SessionStatus.Closed,
    //   ),
    // );
  });
  useParticipantsChange(client, (participants) => {
    const currentUser = client?.getCurrentUserInfo();
    dispatch(setIsHost(!!currentUser?.isHost));
    dispatch(setIsManager(!!currentUser?.isManager));
    dispatch(setUserId(currentUser?.userId));
    dispatch(setParticipants(participants));
    dispatch(setParticipantSize(participants.length));
  });

  useNetworkQuality(client, dispatch);
  useSharePrivilege(client, dispatch);
  useBroadcastStreaming(client, dispatch);

  return (
    <ClientContext.Provider value={client}>
      <StreamContext.Provider value={streamContextValue}>
        <SessionAdditionalContext.Provider value={sessionAdditionalContextValue}>
          {children}
        </SessionAdditionalContext.Provider>
      </StreamContext.Provider>
    </ClientContext.Provider>
  );
};

export const SessionApp = (props: SessionAppProps) => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      Components={{
        success: MaterialDesignContent,
        warning: MaterialDesignContent,
        info: MaterialDesignContent,
        error: MaterialDesignContent,
        default: MaterialDesignContent,
      }}
    >
      <SessionAppInner {...props} />
    </SnackbarProvider>
  );
};
