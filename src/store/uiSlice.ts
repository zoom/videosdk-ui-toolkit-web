import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SuspensionViewValue, Participant } from "../types";
import { VirtualBackgroundPreloadState } from "../constant/stream-constant";
import { CustomizeLayout, CustomizeLayoutType } from "@/constant";
import { WHITEBOARD_EXPORT_FORMAT } from "@/features/whiteboard/constant";

export interface SessionUIState {
  audioProcessing: {
    mode: "originalSound" | "backgroundNoiseSuppression";
    originalSoundOptions: { hifi: boolean; stereo: boolean };
    isNoiseSuppressionEnabled: boolean;
    syncButtonsOnHeadset: boolean;
  };
  mediaError: { errorCode: string; reason: string; type: "audio" | "video" | "sharing" | "" };
  isSkipPreview: boolean;
  isShowParticipant: boolean;
  isShowChat: boolean;
  isShowSessionInfo: boolean;
  isShowLeaveBox: boolean;
  isShowSetting: boolean;
  isShowRecording: boolean;
  participantSize: number;
  activeChatUserId: number;
  isShowAudioWarning: boolean;
  isShowVideoWarning: boolean;
  isShowAVlearnDialog: boolean;
  hasShowRecordingAlert: boolean;
  isShowPanelistConsent: boolean;
  viewType: SuspensionViewValue;
  numUnreadChat: number;
  chatMessage: {
    id: string;
    message: string;
    receiver: { name: string; userId: number };
    sender: { avatar: string; name: string; userId: string };
    timestamp: number;
  };
  isShowChatNotification: boolean;
  customizeLayout: any;
  isShowUnmuteConsent: boolean;
  isShowJoinAudioConsent: boolean;
  isAudioConsentInitialized: boolean;
  isMirrorVideo: boolean;
  virtualBackgroundImageId: string;
  isSupportVB: boolean;
  virtualBackgroundImageList: unknown[];
  isSupportAudioProcessor: boolean;
  isSupportVideoProcessor: boolean;
  isSupportShareProcessor: boolean;
  virtualBackgroundPreloadState: VirtualBackgroundPreloadState;

  isShowQAPanel: boolean;
  numOpenQuestions: number;
  isEnableHardwareAccelerationReceiving: boolean;
  isEnableHardwareAccelerationSending: boolean;
  isStartedHardwareAcceleration: boolean;
  maximumVideosInGalleryView: number;
  isSortMostUpVote: boolean;
  isShowReactions: boolean;
  componentRefs: Record<string, unknown>;
  isShowSharePermissionWarning: boolean;
  isShowSmartSummaryBanner: boolean;
  isShowSmartSummaryConsentPanel: boolean;
  hasShowSmartSummaryConsentPanel: boolean;
  isShowVideoConsent: boolean;
  activeSpeaker: string;
  activeMicrophone: string;
  prevActiveMicrophone: string;
  selectedSecondaryMicrophone: string | null;
  activeSecondaryMicrophone: boolean;
  noiseCancellationOptions: { autoGainControl: boolean; noiseSuppression: boolean; echoCancellation: boolean };
  activeCamera: string;
  prevActiveCamera: string;
  previewStatus: {
    isCameraOn: boolean;
    isAudioOn: boolean;
    isMicMuted: boolean;
    auto: boolean; // is auto join audio triggered
    isCheckedPEPC: boolean;
  };
  isShowReport: boolean;
  isShowSubsessionRoomsPanel: boolean;
  isShowSubsessionDialog: boolean;
  isShowSubsessionBroadcast: boolean;
  isShowInvitedBackToMainSessDialog: boolean;
  subsessionBroadcastMsg: string;
  // isShowPinSpotlightDialog: boolean;
  //
  // pinSpotlightDialogInfo: {
  //   title: string;
  //   content: string;
  //   onOk: () => void;
  //   onClose: () => void;
  // };
  currentPage: number;
  isSettingsOpen: boolean;
  settingsActiveTab: string;
  activeSidePanel: "participants" | "chat" | null;
  isParticipantsPoppedOut: boolean;
  isChatPoppedOut: boolean;
  isSubsessionPoppedOut: boolean;
  vbImageList: Array<{ url: string; displayName?: string }>;
  activeVbImage: string;
  isSessionInfoOpen: boolean;
  isShareTypeMenuOpen: boolean;
  // mobile UI
  isActionSheetOpen: boolean;
  isControlsVisible: boolean;
  isShowCaption: boolean;
  isShowCaptionHistory: boolean;
  isShowHostCaptionSettings: boolean;
  isShowStartCaptionsWindow: boolean;
  activeStatistics: string;
  isJoinSubsessionConfirm: boolean;
  isJoinSubsessionConfirmRemind: boolean; // is show join subsession confirm dialog again
  isAskSubsessionHelpConfirm: boolean;
  isInviteDialogOpen: boolean;
  chatLinkUrl: string;
  activePopper: string | null;
  isShowShareScreenToSubsessionModal: boolean;
  shareScreenToSubsessionDontShowAgain: boolean;
  themeName: string;
  isOriginalShareContentSize: boolean;
  isHeaderEnable: boolean;
  isFooterEnable: boolean;
  isRenameModalOpen: boolean;
  participantToRename: Participant | null;
  participantToAdjustVolume: Participant | null;
  isAdjustVolumeModalOpen: boolean;
  isRemoveParticipantDialogOpen: boolean;
  participantToRemove: Participant | null;
  isMakeHostDialogOpen: boolean;
  participantToMakeHost: Participant | null;
  isShowLiveStreamPanel: boolean;
  isToolBarExpanded: boolean;
  activeAnnotationOption: string | null;
  showShapeMenu: boolean;
  showColorMenu: boolean;
  showClearMenu: boolean;
  showPencilMenu: boolean;
  showTimerMenu: boolean;
  selectedShape: string | null;
  selectedColorIdx: number;
  selectedWidthIdx: number;
  canUndo: boolean;
  canRedo: boolean;
  canDoAnnotation: boolean;
  isWhiteboardExportConfirmOpen: boolean;
  whiteboardExportOptions: {
    format: WHITEBOARD_EXPORT_FORMAT;
    name: string;
    includeComments: boolean;
    shouldCloseAfterExport: boolean;
  } | null;
  annotationOptions: {
    vanishingToolTimer: {
      displayTime: number;
      vanishingTime: number;
    };
  };
  selectedShareProcessor: string;
  activeProcessors: Array<{ name: string; type: string }>;
  loadingProcessors: string[];
}

const initialState: SessionUIState = {
  audioProcessing: {
    mode: "backgroundNoiseSuppression",
    originalSoundOptions: { hifi: false, stereo: false },
    isNoiseSuppressionEnabled: true,
    syncButtonsOnHeadset: false,
  },
  mediaError: { errorCode: "", reason: "", type: "" },
  isSkipPreview: false,
  isShowParticipant: false,
  isShowChat: false,
  isShowSessionInfo: false,
  isShowLeaveBox: false,
  isShowSetting: false,
  participantSize: 0,
  activeChatUserId: -1,
  isShowAudioWarning: false,
  isShowVideoWarning: false,
  isShowAVlearnDialog: false,
  isShowRecording: false,
  hasShowRecordingAlert: false,
  isShowPanelistConsent: false,
  viewType: "gallery" as SuspensionViewValue,
  numUnreadChat: 0,
  chatMessage: {
    id: "",
    message: "",
    receiver: { name: "", userId: 0 },
    sender: { avatar: "", name: "", userId: "" },
    timestamp: new Date().getTime(),
  },
  isShowChatNotification: false,
  customizeLayout: {
    [CustomizeLayout.chat]: "",
    [CustomizeLayout.users]: "",
    [CustomizeLayout.settings]: "",
    [CustomizeLayout.preview]: "",
    [CustomizeLayout.video]: "",
    [CustomizeLayout.invite]: "",
    [CustomizeLayout.subsession]: "",
    [CustomizeLayout.controls]: "",
  },
  isShowUnmuteConsent: false,
  isShowJoinAudioConsent: false,
  isAudioConsentInitialized: false,
  isMirrorVideo: true,
  virtualBackgroundImageId: "",
  isSupportVB: true,
  virtualBackgroundImageList: [],
  isSupportAudioProcessor: false,
  isSupportVideoProcessor: false,
  isSupportShareProcessor: false,
  virtualBackgroundPreloadState: VirtualBackgroundPreloadState.Loading,
  isShowQAPanel: false,
  numOpenQuestions: 0,
  isEnableHardwareAccelerationReceiving: false,
  isEnableHardwareAccelerationSending: false,
  isStartedHardwareAcceleration: false,
  maximumVideosInGalleryView: 9,
  isSortMostUpVote: false,
  isShowReactions: false,
  componentRefs: {},
  isShowSharePermissionWarning: false,
  isShowSmartSummaryBanner: false,
  isShowSmartSummaryConsentPanel: false,
  hasShowSmartSummaryConsentPanel: false,
  isShowVideoConsent: false,
  activeSpeaker: "",
  activeMicrophone: "",
  prevActiveMicrophone: "",
  selectedSecondaryMicrophone: null,
  activeSecondaryMicrophone: false,
  noiseCancellationOptions: { autoGainControl: false, noiseSuppression: false, echoCancellation: false },
  activeCamera: "",
  prevActiveCamera: "",
  previewStatus: { isCameraOn: false, isAudioOn: false, isMicMuted: false, auto: false, isCheckedPEPC: false },
  isShowReport: false,
  isShowInvitedBackToMainSessDialog: false,
  isShowSubsessionRoomsPanel: false,
  isShowSubsessionDialog: false,
  isShowSubsessionBroadcast: false,
  subsessionBroadcastMsg: "",
  // isShowPinSpotlightDialog: false,
  // pinSpotlightDialogInfo: {
  //   title: '',
  //   content: '',
  //   onOk: () => {},
  //   onClose: () => {}
  // },
  currentPage: 0,
  isSettingsOpen: false,
  settingsActiveTab: "general",
  activeSidePanel: null,
  isParticipantsPoppedOut: false,
  isChatPoppedOut: false,
  isSubsessionPoppedOut: false,
  vbImageList: [],
  activeVbImage: "",
  isSessionInfoOpen: false,
  isActionSheetOpen: false,
  isControlsVisible: true,
  isShowCaption: false,
  isShowCaptionHistory: false,
  isShowHostCaptionSettings: false,
  isShowStartCaptionsWindow: false,
  activeStatistics: "audio",
  isJoinSubsessionConfirm: false,
  isJoinSubsessionConfirmRemind: true,
  isAskSubsessionHelpConfirm: false,
  isInviteDialogOpen: false,
  chatLinkUrl: "",
  activePopper: null,
  isShareTypeMenuOpen: false,
  isShowShareScreenToSubsessionModal: false,
  shareScreenToSubsessionDontShowAgain: false,
  themeName: "light",
  isOriginalShareContentSize: false,
  isHeaderEnable: true,
  isFooterEnable: true,
  isRenameModalOpen: false,
  participantToRename: null,
  participantToAdjustVolume: null,
  isAdjustVolumeModalOpen: false,
  isRemoveParticipantDialogOpen: false,
  participantToRemove: null,
  isMakeHostDialogOpen: false,
  participantToMakeHost: null,
  isShowLiveStreamPanel: false,
  isToolBarExpanded: false,
  activeAnnotationOption: null,
  showShapeMenu: false,
  showColorMenu: false,
  showClearMenu: false,
  showPencilMenu: false,
  showTimerMenu: false,
  selectedShape: null,
  selectedColorIdx: 0,
  selectedWidthIdx: 1,
  canUndo: false,
  canRedo: false,
  canDoAnnotation: false,
  isWhiteboardExportConfirmOpen: false,
  whiteboardExportOptions: null,
  annotationOptions: {
    vanishingToolTimer: {
      displayTime: 0,
      vanishingTime: 2000,
    },
  },
  selectedShareProcessor: "",
  activeProcessors: [],
  loadingProcessors: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // New actions
    setShowParticipant: (state, action: PayloadAction<boolean>) => {
      state.isShowParticipant = action.payload;
    },
    setShowChat: (state, action: PayloadAction<boolean>) => {
      state.isShowChat = action.payload;
    },
    setShowMeetingInfo: (state, action: PayloadAction<boolean>) => {
      state.isShowSessionInfo = action.payload;
    },
    setShowLeaveBox: (state, action: PayloadAction<boolean>) => {
      state.isShowLeaveBox = action.payload;
    },
    setParticipantSize: (state, action: PayloadAction<number>) => {
      state.participantSize = action.payload;
    },
    setActiveChatUserId: (state, action: PayloadAction<number>) => {
      state.activeChatUserId = action.payload;
    },
    setViewType: (state, action: PayloadAction<SuspensionViewValue>) => {
      state.viewType = action.payload;
    },
    setChatMessage: (state, action: PayloadAction<SessionUIState["chatMessage"]>) => {
      state.chatMessage = action.payload;
    },
    setVirtualBackgroundImageId: (state, action: PayloadAction<string>) => {
      state.virtualBackgroundImageId = action.payload;
    },
    setVirtualBackgroundPreloadState: (state, action: PayloadAction<VirtualBackgroundPreloadState>) => {
      state.virtualBackgroundPreloadState = action.payload;
    },
    setMaximumVideosInGalleryView: (state, action: PayloadAction<number>) => {
      state.maximumVideosInGalleryView = action.payload;
    },
    // setPinSpotlightDialogInfo: (state, action: PayloadAction<SessionUIState['pinSpotlightDialogInfo']>) => {
    //   state.pinSpotlightDialogInfo = action.payload;
    // },
    setActiveSpeaker: (state, action: PayloadAction<string>) => {
      state.activeSpeaker = action.payload;
    },
    setActiveMicrophone: (state, action: PayloadAction<string>) => {
      state.activeMicrophone = action.payload;
    },
    setPrevActiveMicrophone: (state, action: PayloadAction<string>) => {
      state.prevActiveMicrophone = action.payload;
    },
    setActiveSecondaryMicrophone: (state, action: PayloadAction<boolean>) => {
      state.activeSecondaryMicrophone = action.payload;
    },
    setSelectedSecondaryMicrophone: (state, action: PayloadAction<string | null>) => {
      state.selectedSecondaryMicrophone = action.payload;
    },
    setNoiseCancellationOptions: (
      state,
      action: PayloadAction<Partial<typeof initialState.noiseCancellationOptions>>,
    ) => {
      state.noiseCancellationOptions = { ...state.noiseCancellationOptions, ...action.payload };
    },
    setActiveCamera: (state, action: PayloadAction<string>) => {
      state.activeCamera = action.payload;
    },
    setPrevActiveCamera: (state, action: PayloadAction<string>) => {
      state.prevActiveCamera = action.payload;
    },
    setPreviewAVStatus: (state, action: PayloadAction<any>) => {
      if (typeof action.payload?.isCameraOn !== "undefined") {
        state.previewStatus.isCameraOn = action.payload.isCameraOn;
      }
      if (typeof action.payload?.isAudioOn !== "undefined") {
        state.previewStatus.isAudioOn = action.payload.isAudioOn;
      }
      if (typeof action.payload?.isMicMuted !== "undefined") {
        state.previewStatus.isMicMuted = action.payload.isMicMuted;
      }
      if (typeof action.payload?.auto !== "undefined") {
        state.previewStatus.auto = action.payload.auto;
      }
      if (typeof action.payload?.isCheckedPEPC !== "undefined") {
        state.previewStatus.isCheckedPEPC = action.payload.isCheckedPEPC;
      }
    },
    setShowUnmuteConsent: (state, action: PayloadAction<boolean>) => {
      state.isShowUnmuteConsent = action.payload;
    },
    setShowJoinAudioConsent: (state, action: PayloadAction<boolean>) => {
      state.isShowJoinAudioConsent = action.payload;
    },
    setIsAudioConsentInitialized: (state, action: PayloadAction<boolean>) => {
      state.isAudioConsentInitialized = action.payload;
    },
    setIsEnableHardwareAccelerationReceiving: (state, action: PayloadAction<boolean>) => {
      state.isEnableHardwareAccelerationReceiving = action.payload;
    },
    setIsEnableHardwareAccelerationSending: (state, action: PayloadAction<boolean>) => {
      state.isEnableHardwareAccelerationSending = action.payload;
    },
    setIsStartedHardwareAcceleration: (state, action: PayloadAction<boolean>) => {
      state.isStartedHardwareAcceleration = action.payload;
    },
    setVirtualBackgroundImageList: (state, action: PayloadAction<unknown[]>) => {
      state.virtualBackgroundImageList = action.payload;
    },
    setIsSupportVB: (state, action: PayloadAction<boolean>) => {
      state.isSupportVB = action.payload;
    },
    setIsSupportAudioProcessor: (state, action: PayloadAction<boolean>) => {
      state.isSupportAudioProcessor = action.payload;
    },
    setIsSupportVideoProcessor: (state, action: PayloadAction<boolean>) => {
      state.isSupportVideoProcessor = action.payload;
    },
    setIsSupportShareProcessor: (state, action: PayloadAction<boolean>) => {
      state.isSupportShareProcessor = action.payload;
    },
    setShowSessionInfo: (state, action: PayloadAction<boolean>) => {
      state.isShowSessionInfo = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setIsSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpen = action.payload;
    },
    setSettingsActiveTab: (state, action: PayloadAction<string>) => {
      state.settingsActiveTab = action.payload;
    },
    setActiveSidePanel: (state, action: PayloadAction<"participants" | "chat" | null>) => {
      state.activeSidePanel = action.payload;
    },
    setIsParticipantsPoppedOut: (state, action: PayloadAction<boolean>) => {
      state.isParticipantsPoppedOut = action.payload;
    },
    setIsChatPoppedOut: (state, action: PayloadAction<boolean>) => {
      state.isChatPoppedOut = action.payload;
    },
    setIsSubsessionPoppedOut: (state, action: PayloadAction<boolean>) => {
      state.isSubsessionPoppedOut = action.payload;
    },
    setIsShowAudioWarning: (state, action: PayloadAction<boolean>) => {
      state.isShowAudioWarning = action.payload;
    },
    setIsShowVideoWarning: (state, action: PayloadAction<boolean>) => {
      state.isShowVideoWarning = action.payload;
    },
    setIsShowAVLearnDialog: (state, action: PayloadAction<boolean>) => {
      state.isShowAVlearnDialog = action.payload;
    },
    setIsShowSubsessionRoomsPanel: (state, action: PayloadAction<boolean>) => {
      state.isShowSubsessionRoomsPanel = action.payload;
    },
    setIsShowSubsessionDialog: (state, action: PayloadAction<boolean>) => {
      state.isShowSubsessionDialog = action.payload;
    },
    setIsShowSubsessionBroadcast: (state, action: PayloadAction<boolean>) => {
      state.isShowSubsessionBroadcast = action.payload;
    },
    setIsShowInvitedBackToMainSessDialog: (state, action: PayloadAction<boolean>) => {
      state.isShowInvitedBackToMainSessDialog = action.payload;
    },
    setSubsessionBroadcastMsg: (state, action: PayloadAction<string>) => {
      state.subsessionBroadcastMsg = action.payload;
    },
    setIsShowRecording: (state, action: PayloadAction<boolean>) => {
      state.isShowRecording = action.payload;
    },
    setHasShowRecordingAlert: (state, action: PayloadAction<boolean>) => {
      state.hasShowRecordingAlert = action.payload;
    },
    setSkipPreview: (state, action: PayloadAction<boolean>) => {
      state.isSkipPreview = action.payload;
    },
    setVbImageList: (state, action: PayloadAction<Array<{ url: string }>>) => {
      state.vbImageList = action.payload;
    },
    setActiveVbImage: (state, action: PayloadAction<string>) => {
      state.activeVbImage = action.payload;
    },
    setIsActionSheetOpen: (state, action: PayloadAction<boolean>) => {
      state.isActionSheetOpen = action.payload;
    },
    setIsControlsVisible: (state, action: PayloadAction<boolean>) => {
      state.isControlsVisible = action.payload;
    },
    setIsSessionInfoOpen: (state, action: PayloadAction<boolean>) => {
      state.isSessionInfoOpen = action.payload;
    },
    setIsShowCaptionHistory: (state, action: PayloadAction<boolean>) => {
      state.isShowCaptionHistory = action.payload;
    },
    setIsShowHostCaptionSettings: (state, action: PayloadAction<boolean>) => {
      state.isShowHostCaptionSettings = action.payload;
    },
    setIsShowCaption: (state, action: PayloadAction<boolean>) => {
      state.isShowCaption = action.payload;
    },
    setIsShowStartCaptionsWindow: (state, action: PayloadAction<boolean>) => {
      state.isShowStartCaptionsWindow = action.payload;
    },
    setActiveStatistics: (state, action: PayloadAction<string>) => {
      state.activeStatistics = action.payload;
    },
    setIsJoinSubsessionConfirm: (state, action: PayloadAction<boolean>) => {
      state.isJoinSubsessionConfirm = action.payload;
    },
    setIsJoinSubsessionConfirmRemind: (state, action: PayloadAction<boolean>) => {
      state.isJoinSubsessionConfirmRemind = action.payload;
    },
    setIsAskSubsessionHelpConfirm: (state, action: PayloadAction<boolean>) => {
      state.isAskSubsessionHelpConfirm = action.payload;
    },
    // New reducer
    setIsInviteDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isInviteDialogOpen = action.payload;
    },
    setChatLinkUrl: (state, action: PayloadAction<string>) => {
      state.chatLinkUrl = action.payload;
    },
    setActivePopper: (state, action: PayloadAction<string | null>) => {
      state.activePopper = action.payload;
    },
    setAudioProcessingMode: (state, action: PayloadAction<"originalSound" | "backgroundNoiseSuppression">) => {
      state.audioProcessing.mode = action.payload;
    },
    setOriginalSoundOptions: (state, action: PayloadAction<{ hifi?: boolean; stereo?: boolean }>) => {
      state.audioProcessing.originalSoundOptions = { ...state.audioProcessing.originalSoundOptions, ...action.payload };
    },
    setNoiseSuppressionEnabled: (state, action: PayloadAction<boolean>) => {
      state.audioProcessing.isNoiseSuppressionEnabled = action.payload;
    },
    setIsMirrorVideo: (state, action: PayloadAction<boolean>) => {
      state.isMirrorVideo = action.payload;
    },
    setIsShareTypeMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isShareTypeMenuOpen = action.payload;
    },
    setShowShareScreenToSubsessionModal: (state, action: PayloadAction<boolean>) => {
      state.isShowShareScreenToSubsessionModal = action.payload;
    },
    setShareScreenToSubsessionDontShowAgain: (state, action: PayloadAction<boolean>) => {
      state.shareScreenToSubsessionDontShowAgain = action.payload;
    },
    setThemeName: (state, action: PayloadAction<string>) => {
      state.themeName = action.payload;
    },
    setIsOriginalShareContentSize: (state, action: PayloadAction<boolean>) => {
      state.isOriginalShareContentSize = action.payload;
    },
    setCustomizeLayout: (state, action: PayloadAction<Partial<Record<keyof CustomizeLayoutType, string>>>) => {
      state.customizeLayout = { ...state.customizeLayout, ...action.payload };
    },
    setFooterEnable: (state, action: PayloadAction<boolean>) => {
      state.isFooterEnable = action.payload;
    },
    setHeaderEnable: (state, action: PayloadAction<boolean>) => {
      state.isHeaderEnable = action.payload;
    },
    resetSessionUI: (state) => {
      // Reset all UI state to initial values
      const {
        previewStatus,
        activeSpeaker,
        activeCamera,
        activeMicrophone,
        themeName,
        isHeaderEnable,
        isFooterEnable,
        isJoinSubsessionConfirmRemind,
        isAudioConsentInitialized,
      } = state;
      Object.assign(state, initialState, {
        previewStatus,
        activeSpeaker,
        activeCamera,
        activeMicrophone,
        themeName,
        isHeaderEnable,
        isFooterEnable,
        isJoinSubsessionConfirmRemind,
        isAudioConsentInitialized,
      });
    },
    setIsRenameModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isRenameModalOpen = action.payload;
    },
    setParticipantToRename: (state, action: PayloadAction<Participant | null>) => {
      state.participantToRename = action.payload;
    },
    setIsAdjustVolumeModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAdjustVolumeModalOpen = action.payload;
    },
    setParticipantToAdjustVolume: (state, action: PayloadAction<Participant | null>) => {
      state.participantToAdjustVolume = action.payload;
    },
    setIsRemoveParticipantDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isRemoveParticipantDialogOpen = action.payload;
    },
    setParticipantToRemove: (state, action: PayloadAction<Participant | null>) => {
      state.participantToRemove = action.payload;
    },
    setIsMakeHostDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isMakeHostDialogOpen = action.payload;
    },
    setParticipantToMakeHost: (state, action: PayloadAction<Participant | null>) => {
      state.participantToMakeHost = action.payload;
    },
    setIsShowLiveStreamPanel: (state, action: PayloadAction<boolean>) => {
      state.isShowLiveStreamPanel = action.payload;
    },
    setMediaError: (
      state,
      action: PayloadAction<{ errorCode: string; reason: string; type: "" | "video" | "audio" | "sharing" }>,
    ) => {
      state.mediaError = action.payload;
    },
    setIsToolBarExpanded: (state, action: PayloadAction<boolean>) => {
      state.isToolBarExpanded = action.payload;
    },
    setActiveAnnotationOption: (state, action: PayloadAction<string | null>) => {
      state.activeAnnotationOption = action.payload;
    },
    setShowShapeMenu: (state, action: PayloadAction<boolean>) => {
      state.showShapeMenu = action.payload;
    },
    setShowColorMenu: (state, action: PayloadAction<boolean>) => {
      state.showColorMenu = action.payload;
    },
    setShowClearMenu: (state, action: PayloadAction<boolean>) => {
      state.showClearMenu = action.payload;
    },
    setSelectedShape: (state, action: PayloadAction<string | null>) => {
      state.selectedShape = action.payload;
    },
    setSelectedColorIdx: (state, action: PayloadAction<number>) => {
      state.selectedColorIdx = action.payload;
    },
    setCanUndo: (state, action: PayloadAction<boolean>) => {
      state.canUndo = action.payload;
    },
    setCanRedo: (state, action: PayloadAction<boolean>) => {
      state.canRedo = action.payload;
    },
    setSelectedWidthIdx: (state, action: PayloadAction<number>) => {
      state.selectedWidthIdx = action.payload;
    },
    setShowPencilMenu: (state, action: PayloadAction<boolean>) => {
      state.showPencilMenu = action.payload;
    },
    setShowTimerMenu: (state, action: PayloadAction<boolean>) => {
      state.showTimerMenu = action.payload;
    },
    resetAnnotationStates: (state) => {
      state.isToolBarExpanded = false;
      state.activeAnnotationOption = null;
      state.showShapeMenu = false;
      state.showColorMenu = false;
      state.showClearMenu = false;
      state.showPencilMenu = false;
      state.selectedShape = null;
      state.canUndo = false;
      state.canRedo = false;
    },
    setCanDoAnnotation: (state, action: PayloadAction<boolean>) => {
      state.canDoAnnotation = action.payload;
    },
    setSelectedShareProcessor: (state, action: PayloadAction<string>) => {
      state.selectedShareProcessor = action.payload;
    },
    addActiveProcessor: (state, action: PayloadAction<{ name: string; type: string }>) => {
      state.activeProcessors = [...state.activeProcessors, action.payload];
    },
    removeActiveProcessor: (state, action: PayloadAction<{ name: string; type: string }>) => {
      state.activeProcessors = state.activeProcessors.filter(
        (p) => !(p.name === action.payload.name && p.type === action.payload.type),
      );
    },
    setAnnotationOptions: (
      state,
      action: PayloadAction<{
        vanishingToolTimer: {
          displayTime: number;
          vanishingTime: number;
        };
      }>,
    ) => {
      state.annotationOptions = action.payload;
    },
    setProcessorLoading: (state, action: PayloadAction<{ name: string; loading: boolean }>) => {
      if (action.payload.loading) {
        if (!state.loadingProcessors.includes(action.payload.name)) {
          state.loadingProcessors.push(action.payload.name);
        }
      } else {
        state.loadingProcessors = state.loadingProcessors.filter((name) => name !== action.payload.name);
      }
    },
    setIsWhiteboardExportConfirmOpen: (state, action: PayloadAction<boolean>) => {
      state.isWhiteboardExportConfirmOpen = action.payload;
    },
    setWhiteboardExportOptions: (
      state,
      action: PayloadAction<{
        format: WHITEBOARD_EXPORT_FORMAT;
        name: string;
        includeComments: boolean;
        shouldCloseAfterExport: boolean;
      } | null>,
    ) => {
      state.whiteboardExportOptions = action.payload;
    },
  },
});

export const {
  setSkipPreview,
  setShowParticipant,
  setShowChat,
  setShowMeetingInfo,
  setShowLeaveBox,
  setParticipantSize,
  setActiveChatUserId,
  setViewType,
  setChatMessage,
  setVirtualBackgroundImageId,
  setVirtualBackgroundPreloadState,
  setMaximumVideosInGalleryView,
  // setPinSpotlightDialogInfo,
  setActiveSpeaker,
  setActiveMicrophone,
  setPrevActiveMicrophone,
  setActiveSecondaryMicrophone,
  setSelectedSecondaryMicrophone,
  setNoiseCancellationOptions,
  setActiveCamera,
  setPrevActiveCamera,
  setShowUnmuteConsent,
  setIsEnableHardwareAccelerationReceiving,
  setIsEnableHardwareAccelerationSending,
  setIsStartedHardwareAcceleration,
  setVirtualBackgroundImageList,
  setIsSupportVB,
  setIsSupportAudioProcessor,
  setIsSupportVideoProcessor,
  setIsSupportShareProcessor,
  setShowSessionInfo,
  resetSessionUI,
  setCurrentPage,
  setIsSettingsOpen,
  setSettingsActiveTab,
  setActiveSidePanel,
  setIsParticipantsPoppedOut,
  setIsChatPoppedOut,
  setIsSubsessionPoppedOut,
  setIsShowAudioWarning,
  setIsShowVideoWarning,
  setIsShowAVLearnDialog,
  setIsShowSubsessionRoomsPanel,
  setIsShowSubsessionDialog,
  setIsShowSubsessionBroadcast,
  setIsShowInvitedBackToMainSessDialog,
  setSubsessionBroadcastMsg,
  setIsShowRecording,
  setHasShowRecordingAlert,
  setVbImageList,
  setActiveVbImage,
  setIsActionSheetOpen,
  setIsControlsVisible,
  setIsSessionInfoOpen,
  setIsShowCaptionHistory,
  setIsShowHostCaptionSettings,
  setIsShowStartCaptionsWindow,
  setIsShowCaption,
  setPreviewAVStatus,
  setActiveStatistics,
  setIsJoinSubsessionConfirm,
  setIsJoinSubsessionConfirmRemind,
  setIsAskSubsessionHelpConfirm,
  setIsInviteDialogOpen,
  setChatLinkUrl,
  setActivePopper,
  setAudioProcessingMode,
  setOriginalSoundOptions,
  setNoiseSuppressionEnabled,
  setIsMirrorVideo,
  setShowJoinAudioConsent,
  setIsAudioConsentInitialized,
  setIsShareTypeMenuOpen,
  setShowShareScreenToSubsessionModal,
  setShareScreenToSubsessionDontShowAgain,
  setThemeName,
  setIsOriginalShareContentSize,
  setCustomizeLayout,
  setFooterEnable,
  setHeaderEnable,
  setIsRenameModalOpen,
  setParticipantToRename,
  setParticipantToAdjustVolume,
  setIsAdjustVolumeModalOpen,
  setIsRemoveParticipantDialogOpen,
  setParticipantToRemove,
  setIsMakeHostDialogOpen,
  setParticipantToMakeHost,
  setIsShowLiveStreamPanel,
  setMediaError,
  setIsToolBarExpanded,
  setActiveAnnotationOption,
  setShowShapeMenu,
  setShowColorMenu,
  setShowClearMenu,
  setShowTimerMenu,
  setSelectedShape,
  setSelectedColorIdx,
  setCanUndo,
  setCanRedo,
  setSelectedWidthIdx,
  setShowPencilMenu,
  resetAnnotationStates,
  setCanDoAnnotation,
  setAnnotationOptions,
  setSelectedShareProcessor,
  addActiveProcessor,
  removeActiveProcessor,
  setIsWhiteboardExportConfirmOpen,
  setWhiteboardExportOptions,
  setProcessorLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
