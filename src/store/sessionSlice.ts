import { isValidUrl } from "@/components/util/util";
import { defaultConfig } from "@/constant";
import { CountryType } from "@/features/audio/phone/types";
import {
  CustomizationOptions,
  networkQualityMapType,
  Participant,
  RecordingStatus,
  SessionStatus,
  // RecordingStatus, // Removed
} from "@/types/index.d";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveStreamStatus, SessionInfo, SharePrivilege } from "@zoom/videosdk";

export interface SessionState {
  debug: boolean;
  isJoined: boolean;
  sessionId: string | null;
  userId: number;
  status: SessionStatus;
  config: CustomizationOptions;
  isHost: boolean;
  isOriginHost: boolean;
  isManager: boolean;
  isStartedAudio: boolean;
  isStartedVideo: boolean;
  isShareAudioMuted: boolean;
  isMuted: boolean;
  isSupportMultipleVideos: boolean;
  isDisableReceivingVideo: boolean;
  sessionNumber: number;
  isAudioBridge: boolean;
  isVideoWebRTC: boolean;
  recordingStatus: RecordingStatus;
  sessionInfo: SessionInfo;
  isLockedSession: boolean;
  isEnableShare: boolean;
  isEnableChat: boolean;
  isEnableStartVideo: boolean;
  isScreenSharingWithAudio: boolean;
  hasPreconsented: boolean;
  isSupportVideoEncodeHardwareAcceleration: boolean;
  isSupportVideoDecodeHardwareAcceleration: boolean;
  userSubscribeQos: { audio: boolean; video: boolean; share: boolean };
  networkQualityMap: networkQualityMapType;
  pinUserList: any[];
  spotlightUserList: Participant[];
  isSendingScreenShare: boolean;
  isScreenSharePaused: boolean;
  isReceivingScreenShare: boolean;
  activeShareId: number;
  activeSharerName: string;
  avatarUrl: string | null;
  isEnablePhone: boolean; // Add this line
  trackingId: string;
  featuresOptions: CustomizationOptions["featuresOptions"];
  inviteLink: string | null;
  videoPlaybackFile: string;
  audioPlaybackFile: string;
  isMediaFilePlaying: boolean;
  isUseVideoFileAudio: boolean;
  callInInfo: any;
  callOutCountry: CountryType[];
  activeSpeakerId: number;
  liveStreamStatus: LiveStreamStatus;
  liveStreamConfig: { streamUrl: string; streamKey: string; broadcastUrl: string };
  isAnnotationStarted: boolean;
  isEnableViewerAnnotation: boolean;
  sharePrivilege: SharePrivilege;
}

const initialState: SessionState = {
  debug: false,
  isJoined: false,
  sessionId: null,
  userId: 0,
  status: SessionStatus.Default,
  config: defaultConfig as CustomizationOptions, // defaultConfig as CustomizationOptions,
  isHost: false,
  isOriginHost: false,
  isManager: false,
  isStartedAudio: false,
  isAudioBridge: false,
  isVideoWebRTC: false,
  isStartedVideo: false,
  isShareAudioMuted: false,
  isMuted: true,
  isSupportMultipleVideos: false,
  isDisableReceivingVideo: false,
  sessionNumber: 0,
  recordingStatus: RecordingStatus.Stopped,

  sessionInfo: {} as any,
  isLockedSession: false,
  isEnableShare: true,
  isEnableChat: true,
  isEnableStartVideo: true,
  isScreenSharingWithAudio: false,
  hasPreconsented: false,
  isSupportVideoEncodeHardwareAcceleration: false,
  isSupportVideoDecodeHardwareAcceleration: false,
  userSubscribeQos: { audio: false, video: false, share: false },
  networkQualityMap: {},
  pinUserList: [],
  spotlightUserList: [],
  isSendingScreenShare: false,
  isScreenSharePaused: false,
  isReceivingScreenShare: false,
  activeShareId: 0,
  activeSharerName: "",
  avatarUrl: null,
  isEnablePhone: true, // Add this line with a default value of true
  trackingId: "",
  featuresOptions: defaultConfig.featuresOptions as CustomizationOptions["featuresOptions"],
  inviteLink: null,
  videoPlaybackFile: "",
  audioPlaybackFile: "",
  isMediaFilePlaying: false,
  isUseVideoFileAudio: false,
  callInInfo: null,
  callOutCountry: null,
  activeSpeakerId: 0,
  liveStreamStatus: LiveStreamStatus.Ended,
  liveStreamConfig: { streamUrl: "", streamKey: "", broadcastUrl: "" },
  isAnnotationStarted: false,
  isEnableViewerAnnotation: true,
  sharePrivilege: SharePrivilege.MultipleShare,
};

const isEnabled = (obj: any): boolean => {
  if (!obj || typeof obj !== "object") return false;

  if (typeof obj.enable === "boolean") return obj.enable;

  return Object.values(obj).some(isEnabled);
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    joinSession: (state, action: PayloadAction<string>) => {
      state.isJoined = true;
      state.sessionId = action.payload;
    },
    leaveSession: (state) => {
      state.isJoined = false;
      state.sessionId = null;
    },
    setUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload;
    },
    setSessionStatus: (state, action: PayloadAction<SessionStatus>) => {
      state.status = action.payload;
    },
    setIsHost: (state, action: PayloadAction<boolean>) => {
      state.isHost = action.payload;
    },
    setIsOriginHost: (state, action: PayloadAction<boolean>) => {
      state.isOriginHost = action.payload;
    },
    setIsManager: (state, action: PayloadAction<boolean>) => {
      state.isManager = action.payload;
    },
    setIsStartedAudio: (state, action: PayloadAction<boolean>) => {
      state.isStartedAudio = action.payload;
    },
    setIsStartedVideo: (state, action: PayloadAction<boolean>) => {
      state.isStartedVideo = action.payload;
    },
    setIsShareAudioMuted: (state, action: PayloadAction<boolean>) => {
      state.isShareAudioMuted = action.payload;
    },
    setIsMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    setSessionNumber: (state, action: PayloadAction<number>) => {
      state.sessionNumber = action.payload;
    },
    setSessionInfo: (state, action: PayloadAction<any>) => {
      state.sessionInfo = action.payload;
    },
    setIsLockedSession: (state, action: PayloadAction<boolean>) => {
      state.isLockedSession = action.payload;
    },
    setIsEnableShare: (state, action: PayloadAction<boolean>) => {
      state.isEnableShare = action.payload;
    },
    setIsEnableChat: (state, action: PayloadAction<boolean>) => {
      state.isEnableChat = action.payload;
    },
    setIsAudioBridge: (state, action: PayloadAction<boolean>) => {
      state.isAudioBridge = action.payload;
    },
    setIsVideoWebRTC: (state, action: PayloadAction<boolean>) => {
      state.isVideoWebRTC = action.payload;
    },
    setIsEnableStartVideo: (state, action: PayloadAction<boolean>) => {
      state.isEnableStartVideo = action.payload;
    },
    setIsScreenSharingWithAudio: (state, action: PayloadAction<boolean>) => {
      state.isScreenSharingWithAudio = action.payload;
    },
    setHasPreconsented: (state, action: PayloadAction<boolean>) => {
      state.hasPreconsented = action.payload;
    },
    setIsSupportMultipleVideos: (state, action: PayloadAction<boolean>) => {
      state.isSupportMultipleVideos = action.payload;
    },
    setIsSupportVideoEncodeHardwareAcceleration: (state, action: PayloadAction<boolean>) => {
      state.isSupportVideoEncodeHardwareAcceleration = action.payload;
    },
    setIsSupportVideoDecodeHardwareAcceleration: (state, action: PayloadAction<boolean>) => {
      state.isSupportVideoDecodeHardwareAcceleration = action.payload;
    },
    setUserSubscribeQos: (state, action: PayloadAction<{ audio: boolean; video: boolean; share: boolean }>) => {
      state.userSubscribeQos = action.payload;
    },
    setNetworkQualityMap: (state, action: PayloadAction<{ userId: number; level: number }>) => {
      state.networkQualityMap = {
        ...state.networkQualityMap,
        [action.payload.userId]: { level: action.payload.level },
      };
    },
    setPinUserList: (state, action: PayloadAction<any[]>) => {
      state.pinUserList = action.payload;
    },
    setSpotlightUserList: (state, action: PayloadAction<any[]>) => {
      state.spotlightUserList = action.payload;
    },
    setIsSendingScreenShare: (state, action: PayloadAction<boolean>) => {
      state.isSendingScreenShare = action.payload;
    },
    setIsScreenSharePaused: (state, action: PayloadAction<boolean>) => {
      state.isScreenSharePaused = action.payload;
    },
    setIsReceivingScreenShare: (state, action: PayloadAction<boolean>) => {
      state.isReceivingScreenShare = action.payload;
    },
    setActiveShareId: (state, action: PayloadAction<number>) => {
      state.activeShareId = action.payload;
    },
    setActiveSharerName: (state, action: PayloadAction<string>) => {
      state.activeSharerName = action.payload;
    },
    setConfig: (state, action: PayloadAction<CustomizationOptions>) => {
      state.config = action.payload;
      state.debug = state.config?.debug || false;

      if (action.payload?.featuresOptions) {
        const enabledFeatures = Object.entries(action.payload.featuresOptions).reduce(
          (acc, [key, val]) => {
            if (isEnabled(val)) acc[key] = val;
            return acc;
          },
          {} as CustomizationOptions["featuresOptions"],
        );

        state.featuresOptions = enabledFeatures;
      }
    },

    removeFeature: (state, action: PayloadAction<string>) => {
      if (state.featuresOptions[action.payload]) {
        state.featuresOptions[action.payload].enable = false;
      }
    },
    addFeature: (state, action: PayloadAction<string>) => {
      if (!state.featuresOptions[action.payload]) {
        state.featuresOptions[action.payload] = { enable: true };
      }
    },
    setRecordingStatus: (state, action: PayloadAction<RecordingStatus>) => {
      state.recordingStatus = action.payload;
    },
    setAvatarUrl: (state, action: PayloadAction<string | null>) => {
      state.avatarUrl = action.payload;
    },
    setTrackingId: (state, action: PayloadAction<string>) => {
      state.trackingId = action.payload;
    },
    setVideoPlaybackFile: (state, action: PayloadAction<string>) => {
      state.videoPlaybackFile = action.payload;
    },
    setAudioPlaybackFile: (state, action: PayloadAction<string>) => {
      state.audioPlaybackFile = action.payload;
    },
    setIsMediaFilePlaying: (state, action: PayloadAction<boolean>) => {
      state.isMediaFilePlaying = action.payload;
    },
    setIsUseVideoFileAudio: (state, action: PayloadAction<boolean>) => {
      state.isUseVideoFileAudio = action.payload;
    },
    setIsEnablePhone: (state, action: PayloadAction<boolean>) => {
      state.isEnablePhone = action.payload;
    },
    setInviteLink: (state, action: PayloadAction<string | null>) => {
      const url = action.payload;
      if (!isValidUrl(url)) {
        // eslint-disable-next-line no-console
        console.error("Invalid URL provided for invite link");
        state.inviteLink = null;
        return;
      }
      state.inviteLink = url;
    },
    setCallInInfo: (state, action: PayloadAction<any>) => {
      state.callInInfo = action.payload;
    },
    setCallOutCountry: (state, action: PayloadAction<any[]>) => {
      state.callOutCountry = action.payload;
    },
    setActiveSpeakerId: (state, action: PayloadAction<number>) => {
      state.activeSpeakerId = action.payload;
    },
    setLiveStreamStatus: (state, action: PayloadAction<LiveStreamStatus>) => {
      state.liveStreamStatus = action.payload;
    },
    setLiveStreamConfig: (
      state,
      action: PayloadAction<{ streamUrl: string; streamKey: string; broadcastUrl: string }>,
    ) => {
      state.liveStreamConfig = action.payload;
    },
    setIsAnnotationStarted: (state, action: PayloadAction<boolean>) => {
      state.isAnnotationStarted = action.payload;
    },
    setIsEnableViewerAnnotation: (state, action: PayloadAction<boolean>) => {
      state.isEnableViewerAnnotation = action.payload;
    },
    setSharePrivilege: (state, action: PayloadAction<SharePrivilege>) => {
      state.sharePrivilege = action.payload;
    },
    resetSession: () => {
      return initialState;
    },
  },
});

export const {
  joinSession,
  leaveSession,
  setUserId,
  setSessionStatus,
  setIsHost,
  setIsOriginHost,
  setIsManager,
  setIsStartedAudio,
  setIsStartedVideo,
  setIsShareAudioMuted,
  setIsMuted,
  setSessionNumber,
  setRecordingStatus,
  setSessionInfo,
  setIsLockedSession,
  setIsEnableShare,
  setIsEnableChat,
  setIsEnableStartVideo,
  setIsScreenSharingWithAudio,
  setHasPreconsented,
  setIsSupportMultipleVideos,
  setIsSupportVideoEncodeHardwareAcceleration,
  setIsSupportVideoDecodeHardwareAcceleration,
  setUserSubscribeQos,
  setIsAudioBridge,
  setIsVideoWebRTC,
  setNetworkQualityMap,
  setPinUserList,
  setSpotlightUserList,
  setIsSendingScreenShare,
  setIsScreenSharePaused,
  setIsReceivingScreenShare,
  setActiveShareId,
  setActiveSharerName,
  setConfig,
  setTrackingId,
  setAvatarUrl,
  setIsEnablePhone,
  removeFeature,
  addFeature,
  setInviteLink,
  setVideoPlaybackFile,
  setAudioPlaybackFile,
  setIsMediaFilePlaying,
  setIsUseVideoFileAudio,
  resetSession,
  setCallInInfo,
  setCallOutCountry,
  setActiveSpeakerId,
  setLiveStreamStatus,
  setLiveStreamConfig,
  setIsAnnotationStarted,
  setIsEnableViewerAnnotation,
  setSharePrivilege,
} = sessionSlice.actions;

export default sessionSlice.reducer;
