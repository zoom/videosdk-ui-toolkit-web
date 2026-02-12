/**
 * Definition of error types for operations.
 * - INVALID_OPERATION: The operation is invalid, perhaps caused by duplicated operations.
 * - INTERNAL_ERROR: The remote service is temporarily unavailable.
 * - INSUFFICIENT_PRIVILEGES: The operation is only applicable for a host or manager.
 * - OPERATION_TIMEOUT: The operation timed out, try again later.
 * - IMPROPER_SESSION_STATE: The user is not in a session, see the reason for details.
 *  - `closed`: The session is not joined.
 *  - `on hold`: The user is on hold.
 *  - `reconnecting`: The session is reconnecting.
 * - INVALID_PARAMETERS: The parameters passed to the method are invalid, perhaps the wrong user ID or value, see the reason for details.
 * - OPERATION_LOCKED: The operation can not be completed because the relevant property is locked, see the reason for details.
 */
export type ErrorTypes =
  | "INVALID_OPERATION"
  | "INTERNAL_ERROR"
  | "OPERATION_TIMEOUT"
  | "INSUFFICIENT_PRIVILEGES"
  | "IMPROPER_SESSION_STATE"
  | "INVALID_PARAMETERS"
  | "OPRATION_LOCKED";
/**
 * Failure reason for async operation.
 */
interface ExecutedFailure {
  /**
   * Error type.
   */
  type: ErrorTypes;
  /**
   * Error reason.
   */
  reason: string;
}
/**
 * The result of an asynchronous operation. It is a promise object.
 * - '': Success
 * - ExecutedFailure: Failure. Use `.catch(error=>{})` or `try{ *your code* }catch(error){}` to handle the errors.
 */
export type ExecutedResult = Promise<"" | ExecutedFailure>;

/**
 * Audio QoS data interface.
 */
export interface AudioQosData {
  /**
   * Audio sample rate.
   */
  sample_rate: number;
  /**
   * Audio round trip time.
   */
  rtt: number;
  /**
   * Audio jitter.
   */
  jitter: number;
  /**
   * Audio average loss.
   */
  avg_loss: number;
  /**
   * Audio maximum loss.
   */
  max_loss: number;
  /**
   * Bandwidth, measured in bits per second (bps)
   */
  bandwidth: number;
  /**
   * Bit rate, measured in bits per second (bps)
   */
  bitrate: number;
}

/**
 * Video QoS data interface.
 */
export interface VideoQosData {
  /**
   * Video sample rate.
   */
  sample_rate: number;
  /**
   * Video round trip time.
   */
  rtt: number;
  /**
   * Video jitter.
   */
  jitter: number;
  /**
   * Video average loss.
   */
  avg_loss: number;
  /**
   * Video maximum loss.
   */
  max_loss: number;
  /**
   * Video width.
   */
  width: number;
  /**
   * Video height.
   */
  height: number;
  /**
   * Video frame rate, in frames per second (fps).
   */
  fps: number;
  /**
   * Bandwidth, measured in bits per second (bps)
   */
  bandwidth: number;
  /**
   * Bit rate, measured in bits per second (bps)
   */
  bitrate: number;
}

/**
 * Statistic option interface.
 */
interface StatisticOption {
  /**
   * Subscribe or unsubscribe to encoding data (sending).
   */
  encode?: boolean;
  /**
   * Subscribe or unsubscribe to decoding data (receiving).
   */
  decode?: boolean;
}
/**
 * Video statistic option interface.
 */
interface VideoStatisticOption {
  /**
   * Subscribe or unsubscribe to encoding data (sending video).
   */
  encode?: boolean;
  /**
   * Subscribe or subscribe to decoding data (receiving video).
   */
  decode?: boolean;
  /**
   * Get the detailed data of each received video, such as frames per second, or resolution.
   */
  detailed?: boolean;
}

/**
 * The participant interface.
 */
interface Participant {
  /**
   * User ID.
   */
  userId: number;
  /**
   * User's display name.
   */
  displayName: string;
  /**
   * User's audio state.
   * - `''`: No audio.
   * - `computer`: Joined by computer audio.
   * - `phone`: Joined by phone.
   */
  audio: "" | "computer" | "phone";
  /**
   * Whether audio is muted.
   * If the user is not joined to audio (not connected to the microphone), the value is undefined.
   */
  muted?: boolean;
  /**
   * Whether the user is the host.
   */
  isHost: boolean;
  /**
   * Whether the user is a manager.
   */
  isManager: boolean;
  /**
   * User's avatar.
   * Users can set their avatar in their [web profile](https://zoom.us/profile).
   */
  avatar?: string;
  /**
   * Whether the user started video.
   */
  bVideoOn: boolean;
  /**
   * Whether the user started sharing.
   */
  sharerOn: boolean;
  /**
   * Whether the share is paused.
   */
  sharerPause: boolean;
  /**
   * Whether the share is optimized for video.
   */
  bVideoShare?: boolean;
  /**
   * Whether the sharer is also sharing the tab audio.
   */
  bShareAudioOn?: boolean;
  /**
   *  Whether the sharer is also sharing to the subsession.
   */
  bShareToSubsession?: boolean;
  /**
   *  Whether the user connected via the phone.
   */
  isPhoneUser?: boolean;
  /**
   * The unified ID of a user among the main session or subsession.
   */
  userGuid?: string;
  /**
   * Whether to allow individual recording.
   */
  isAllowIndividualRecording: boolean;
  /*
   * Whether the user has a camera connected to the device.
   */
  isVideoConnect: boolean;
  /**
   * The `user_identity` from the JWT payload.
   */
  userIdentity?: string;
  /**
   * Whether the user is only connected to the audio speaker, not the microphone.
   */
  isSpeakerOnly?: boolean;
  /**
   * The phone number if the user is a public switched telephone network (PSTN) call out user.
   * For privacy concerns, only the calling user has this property.
   */
  phoneNumber?: string;
  /**
   * Whether the user is in a failover process.
   */
  isInFailover?: boolean;
  /**
   * Subsession ID.
   * Available if the user is in a subsession.
   */
  subsessionId?: string;
}

/**
 * Session information.
 */
interface SessionInfo {
  /**
   * The session topic.
   */
  topic: string;
  /**
   * Password (if it exists).
   */
  password: string;
  /**
   * User name.
   */
  userName: string;
  /**
   * User ID.
   */
  userId: number;
  /**
   * Whether the user is in the session.
   */
  isInMeeting: boolean;
  /**
   * Session ID.
   */
  sessionId: string;
}

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
export interface VirtualBackgroundImageType {
  previewSmallStatus: string;
  displayURL: string;
  previewSmallObjectURL: string;
  id: string;
  imageId: string;
}

/**
 * Information about a virtual background image.
 */
export interface VbImageInfoType {
  id: string;
  fileName: string;
  displayName: string;
  url: string;
}

/**
 * List of suspension view types.
 */
export enum SuspensionViewType {
  Minimized = "minimized",
  Speaker = "speaker",
  Gallery = "gallery",
}
/**
 * List of suspension view types.
 */
export type SuspensionViewValue = (typeof SuspensionViewType)[keyof typeof SuspensionViewType];

/**
 * List of audio/video playbacks to be used in the playback feature.
 */
export interface AudioVideoPlaybacks {
  title: string;
  url: string;
}

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

/**
 * Configuration options for customizing the Zoom Video SDK UI Toolkit.
 *
 * @property videoSDKJWT - Authentication token for the Video SDK
 * @property sessionName - Name of the session to join
 * @property userName - Display name of the user
 * @property sessionPasscode - Password/passcode for the session
 * @property sessionIdleTimeoutMins - Session timeout duration in minutes
 * @property webEndpoint - Web endpoint URL for the session
 * @property featuresOptions - Advanced options for specific features
 * @property dependentAssets - Path to dependent assets
 * @property language - Interface language setting
 * @property debug - Enable debug mode
 */
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
  sessionPasscode?: string;
  /**
   * sessionIdleTimeoutMins
   */
  sessionIdleTimeoutMins?: number;
  /**
   * webEndpoint
   */
  webEndpoint?: string;
  /**
   * leaveOnPageUnload
   */
  leaveOnPageUnload?: boolean;
  /**
   * @deprecated Use featuresOptions instead.
   */
  features?: OldUIkitFeature[];
  /**
   * @deprecated Use featuresOptions.audio/video/share/virtualBackground and webEndpoint instead.
   */
  options?: {
    /**
     * @deprecated
     */
    init?: {
      /**
       * @deprecated Use featuresOptions.video.enforceMultipleVideos instead.
       */
      enforceMultipleVideos?: boolean;
      /**
       * @deprecated Use featuresOptions.virtualBackground.enforceVirtualBackground instead.
       */
      enforceVirtualBackground?: boolean;
      /**
       * @deprecated Use webEndpoint instead.
       */
      webEndpoint?: string;
    };
    /**
     * @deprecated Use featuresOptions.audio instead.
     */
    audio?: {
      backgroundNoiseSuppression?: boolean;
      originalSound?: boolean;
      syncButtonsOnHeadset?: boolean;
    };
    /**
     * @deprecated Use featuresOptions.video instead.
     */
    video?: {
      originalRatio?: boolean;
      virtualBackground?: boolean;
    };
    /**
     * @deprecated Use featuresOptions.share instead.
     */
    share?: {
      controls?: boolean;
      displaySurface?: boolean;
      hideShareAudioOption?: boolean;
      optimizedForSharedVideo?: boolean;
    };
  };
  /**
   * @deprecated Use featuresOptions.virtualBackground instead.
   */
  virtualBackground?: {
    allowVirtualBackground?: boolean;
    allowVirtualBackgroundUpload?: boolean;
    virtualBackgrounds?: string[];
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
      joinAudioConsent?: boolean; // default true, if false, will not show join audio consent panel
    };
    secondaryAudio?: {
      enable: boolean;
    };
    share?: {
      enable: boolean;
      // /**
      //  * Enables configuring specific content to share within supported browsers. https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_controller_option
      //  */
      // controls?: boolean;
      // /**
      //  * Enables configuring specific share surfaces within supported browsers. https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_monitortypesurfaces_option
      //  */
      // displaySurface?: boolean;
      // /**
      //  * Enables or disables the share computer audio option within supported browsers. https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_systemaudio_option
      //  */
      // hideShareAudioOption?: boolean;
      // /**
      //  * Prioritizes frame rate over resolution for better screen sharing of videos.
      //  */
      // optimizedForSharedVideo?: boolean;
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
    preview?: {
      enable: boolean;
      isAllowModifyName?: boolean;
    };
    feedback?: {
      // feedback after end/leave session
      enable: boolean;
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
    footer?: {
      enable: boolean;
    };
    header?: {
      enable: boolean;
    };
    screenshot?: {
      video?: {
        /** Enable video-frame screenshots. @default false */
        enable: boolean; // default false
      };
      share?: {
        /** Enable shared-screen screenshots. @default false */
        enable: boolean; // default false
      };
    };
    // whiteboard?: {
    //   enable: boolean;
    //   enableExport?: boolean;
    //   enableViewerUserExport?: boolean;
    // };
  };
  /**
   * dependent assets
   */
  dependentAssets?: string;
  /**
   * language
   */
  language?: string;
  /**
   * debug mode
   */
  debug?: boolean;
};

/**
 * PTZ (Pan-Tilt-Zoom) camera control interface
 *
 * Need to call joinSession before using this API
 * @category Camera Control
 */
export interface PTZController {
  /**
   * Checks if the browser supports PTZ camera control
   * @returns true if PTZ is supported, false otherwise
   * @example
   * ```js
   * const supported = UIToolkit.ptz.isBrowserSupported();
   * if (supported) {
   *   console.log('PTZ camera control is supported');
   * }
   * ```
   */
  isBrowserSupported(): boolean;

  /**
   * Gets the PTZ capability of the local camera
   * @returns Promise resolving to the PTZ capability object
   * @example
   * ```js
   * const capability = await UIToolkit.ptz.getCapability();
   * console.log('PTZ capabilities:', capability);
   * ```
   */
  getCapability(): Promise<unknown>;

  /**
   * Gets the PTZ capability of a remote participant's camera
   * @param userId - The user ID of the participant
   * @returns Promise resolving to the PTZ capability object
   * @example
   * ```js
   * const capability = await UIToolkit.ptz.getFarEndCapability(12345);
   * ```
   */
  getFarEndCapability(userId: number): Promise<unknown>;

  /**
   * Requests control of a remote participant's camera
   * @param userId - The user ID of the participant
   * @returns Promise that resolves when the request is sent
   * @example
   * ```js
   * await UIToolkit.ptz.requestControl(12345);
   * ```
   */
  requestControl(userId: number): Promise<void>;

  /**
   * Approves a camera control request from another participant
   * @param userId - The user ID of the participant requesting control
   * @returns Promise that resolves when the approval is processed
   * @example
   * ```js
   * await UIToolkit.ptz.approveControl(12345);
   * ```
   */
  approveControl(userId: number): Promise<void>;

  /**
   * Declines a camera control request from another participant
   * @param userId - The user ID of the participant requesting control
   * @returns Promise that resolves when the decline is processed
   * @example
   * ```js
   * await UIToolkit.ptz.declineControl(12345);
   * ```
   */
  declineControl(userId: number): Promise<void>;

  /**
   * Gives up control of a remote participant's camera
   * @param userId - The user ID of the participant whose camera control to release
   * @returns Promise that resolves when control is released
   * @example
   * ```js
   * await UIToolkit.ptz.giveUpControl(12345);
   * ```
   */
  giveUpControl(userId: number): Promise<void>;

  /**
   * Sends a PTZ control command to a remote participant's camera
   * @param options - Object containing cmd (command type), userId, and range (magnitude)
   * @param options.cmd - PTZ command type (e.g., 1 for left, 2 for right, 3 for up, 4 for down, 5 for zoom in, 6 for zoom out)
   * @param options.userId - The user ID of the participant
   * @param options.range - Optional magnitude of the control action (0-100)
   * @returns Promise that resolves when the command is sent
   * @example
   * ```js
   * // Pan left
   * await UIToolkit.ptz.control({ cmd: 1, userId: 12345, range: 50 });
   *
   * // Zoom in
   * await UIToolkit.ptz.control({ cmd: 5, userId: 12345, range: 30 });
   * ```
   */
  control(options: { cmd: number; userId: number; range?: number }): Promise<void>;
}

/**
 * Internationalization (i18n) interface
 *
 * Need to call joinSession before using this API
 * @category Localization
 * @example
 * ```js
 * UIToolkit.onSessionJoined(async () => {
 *   // Simple language change (must have pre-loaded resources)
 *   await UIToolkit.i18n.setLanguage("zh-CN");
 *
 *   // Load language from URL
 *   await UIToolkit.i18n.setLanguage("zh-TW", "https://example.com/lang/zh-TW.json");
 *
 *   // Add inline resources for custom language
 *   const enJson = UIToolkit.i18n.getInstance().getResourceBundle("en-US", "translation") || {};
 *   const jpJson = Object.assign({}, enJson, {
 *     "notification.enable_audio_button": "参加",
 *     "notification.enable_audio_content": "このセッションに参加しますか？",
 *     "notification.enable_audio_title": "参加音声",
 *     "settings.tab_audio": "音声",
 *     "settings.tab_background": "背景",
 *     "settings.tab_general": "一般",
 *     "settings.tab_help": "ヘルプ",
 *     "settings.tab_mask": "マスク",
 *     "settings.tab_playback": "再生",
 *     "settings.tab_raw_data": "生データ",
 *     "settings.tab_second_audio": "セカンド音声",
 *     "settings.tab_statistics": "統計",
 *     "settings.tab_troubleshoot": "トラブルシューティング",
 *   });
 *   await UIToolkit.i18n.setLanguage("ja-JP", jpJson);
 * });
 *
 * // Listen for language changes and load resources dynamically
 * UIToolkit.onLanguageChange((language) => {
 *   console.log("uikit.onLanguageChange", language);
 *   if (language === "ko-KR") {
 *     void UIToolkit.i18n.setLanguage("ko-KR", "https://example.com/lang/ko-KR.json");
 *   } else if (language === "vi-VN") {
 *     void UIToolkit.i18n.setLanguage("vi-VN", "https://example.com/lang/vi-VN.json");
 *   } else {
 *     console.log("language not found", language);
 *   }
 * });
 * ```
 */
export interface I18nController {
  /**
   * Sets the UI language and optionally loads additional translation resources
   * @param language - The language code (e.g., "en-US", "zh-CN")
   * @param resources - Optional translation resources (object or URL to JSON file)
   * @returns Promise that resolves when language is set and resources are loaded
   */
  setLanguage(language: string, resources?: Record<string, unknown> | string): Promise<void>;

  /**
   * Sets the list of available languages in the language selector
   * @param languages - Array of language codes to show in the settings
   * @example
   * ```js
   * // Show multiple language options, if language not in the list, it will not be shown in the language selector
   * UIToolkit.i18n.setLanguageList(["en-US", "zh-CN", "zh-TW", "ja-JP"]);
   *
   * // Restrict to specific languages
   * UIToolkit.i18n.setLanguageList(["en-US", "zh-CN"]);
   * ```
   */
  setLanguageList(languages: string[]): void;

  /**
   * Gets the i18next instance for advanced usage
   * @returns The i18next instance
   * @example
   * ```js
   * // Access i18next directly for advanced features
   * const i18n = UIToolkit.i18n.getInstance();
   * const translation = i18n.t("settings.language_title");
   * const hasResources = i18n.hasResourceBundle("ja-JP", "translation");
   * const enJson = i18n.getResourceBundle("en-US", "translation");
   * ```
   */
  getInstance(): unknown;

  /**
   * Gets the current UI language, default is en-US see all keys at https://source.zoom.us/uitoolkit/{VERSION}/en-US.json
   * @returns The current language code (e.g., "en-US")
   * @example
   * ```js
   * const currentLang = UIToolkit.i18n.getLanguage();
   * console.log("Current language:", currentLang);
   * ```
   */
  getLanguage(): string;

  /**
   * Gets the list of available languages set by setLanguageList
   * @returns Array of language codes, defaults support ["en-US", "zh-CN"]
   * @example
   * ```js
   * const languages = UIToolkit.i18n.getLanguageList();
   * console.log("Available languages:", languages);
   * ```
   */
  getLanguageList(): string[];

  /**
   * Checks if a language has loaded translation resources
   * @param language - The language code to check
   * @returns true if resources exist, false otherwise
   * @example
   * ```js
   * if (UIToolkit.i18n.hasLanguageResources("ja-JP")) {
   *   await UIToolkit.i18n.setLanguage("ja-JP");
   * } else {
   *   console.log("Japanese resources not loaded");
   * }
   * ```
   */
  hasLanguageResources(language: string): boolean;
}

/**
 * Zoom Video SDK UI Toolkit API
 * Provides methods for managing video sessions and UI components
 */
export interface UIToolkit {
  /**
   * PTZ (Pan-Tilt-Zoom) camera control interface
   * Provides methods for controlling PTZ-capable cameras
   *
   * Need to call joinSession before using this API
   * @category Camera Control
   */
  ptz: PTZController;

  /**
   * Internationalization (i18n) interface
   * Provides methods for managing UI language and translations
   *
   * Need to call joinSession before using this API
   * @category Localization
   */
  i18n: I18nController;

  /**
   * Opens the video preview in a specified container.
   * Use this before joining a session to test video settings.
   *
   * @param container - DOM element to render the preview
   * @param config - Session configuration options
   * @param options - Preview options
   * @category Customize Layout
   */
  openPreview(container: HTMLElement, config: CustomizationOptions, options: { onClickJoin: () => void }): void;

  /**
   * Closes an active video preview.
   * @param container - DOM element containing the preview
   * @category Customize Layout
   */
  closePreview(container: HTMLElement): void;

  /**
   * Joins a Zoom video session with specified configuration.
   *
   * @param container - DOM element to render the session UI
   * @param config - Session configuration options
   */
  joinSession(container: HTMLElement, config: CustomizationOptions): Promise<void>;

  /**
   * Leaves the session
   */
  leaveSession(): Promise<void>;

  /**
   * Closes the current video session.
   *
   * @param container - DOM element containing the session
   */
  closeSession(container?: HTMLElement): Promise<void>;
  /**
   * Changes the view type
   * @param viewType - The view type to change to.
   */
  changeViewType(viewType: SuspensionViewValue): void;

  /**
   * Registers a callback for session join events.
   * The callback will be triggered when successfully joining a session.
   * @param callback - Function to execute on session join.
   * @category Events
   */
  onSessionJoined(callback: () => void): void;

  /**
   * Removes a previously registered session join callback.
   *
   * @param callback - Function to remove from event listeners.
   * @category Events
   */
  offSessionJoined(callback: () => void): void;

  /**
   * Registers a callback for session close events.
   * The callback will be triggered when a session ends.
   *
   * @param callback - Function to execute on session close.
   * @category Events
   */
  onSessionClosed(callback: () => void): void;

  /**
   * Removes a previously registered session close callback.
   *
   * @param callback - Function to remove from event listeners.
   * @category Events
   */
  offSessionClosed(callback: () => void): void;

  /**
   * Registers a callback for when you can destroy uikit.
   * @param callback The callback will be triggered when all uikit components are destroyed.
   * @category Events
   */
  onSessionDestroyed(callback: () => void): void;

  /**
   * Removes a previously registered session destroy callback.
   * @param callback - Function to remove from event listeners.
   * @category Events
   */
  offSessionDestroyed(callback: () => void): void;

  /**
   * Adds a view type change event listener.
   * @param callback - The callback function to be called when the view type changes.
   * @category Events
   */
  onViewTypeChange(callback: (event: SuspensionViewValue) => void): void;

  /**
   * Removes a view type change event listener.
   * @param callback - The callback function to be called when the view type changes.
   * @category Events
   */
  offViewTypeChange(callback: () => void): void;

  /**
   * Registers a callback for when the UI language changes.
   * The callback will be triggered when the user changes the language in settings.
   *
   * @param callback - Function to execute on language change, receives the new language code (e.g., "en-US", "zh-CN").
   * @category Events
   * @example
   * ```js
   * // Listen for language changes and load resources dynamically
   * UIToolkit.onLanguageChange((language) => {
   *   console.log("Language changed to:", language);
   *
   *   // Dynamically load language resources from URL
   *   if (language === "zh-TW") {
   *     UIToolkit.i18n.setLanguage("zh-TW", "https://example.com/lang/zh-TW.json")
   *       .then(() => console.log("Traditional Chinese resources loaded"))
   *       .catch((err) => console.error("Failed to load language:", err));
   *   }
   * });
   * ```
   */
  onLanguageChange(callback: (language: string) => void): void;

  /**
   * Removes a previously registered language change callback.
   *
   * @param callback - Function to remove from event listeners.
   * @category Events
   */
  offLanguageChange(callback: (language: string) => void): void;

  /**
   * Registers a callback for a specific event.
   *
   * @param event - The event name to listen for https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#on
   * @param callback - The callback function to execute when the event occurs.
   * @category Events
   */
  on(event: VideoClientEvent, callback: (payload: any) => void): void;
  on(event: string, callback: (payload: any) => void): void;

  /**
   * Removes a previously registered event listener.
   *
   * @param event - The event name to remove the listener from https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#off
   * @param callback - The callback function to remove from event listeners.
   * @category Events
   */
  off(event: VideoClientEvent, callback: (payload: any) => void): void;
  off(event: string, callback: (payload: any) => void): void;

  /**
   * Mirrors or unmirrors your self video.
   * Pass `true` to mirror the local preview and `false` to restore normal orientation.
   * This affects only your local view and does not impact how others see your video.
   * @param mirrored - Whether to mirror the self video.
   * @returns A promise that resolves when the operation completes.
   * @category Video
   */
  mirrorVideo(mirrored: boolean): Promise<void>;

  /**
   * Subscribes to audio statistic data based on the type parameter.
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#subscribeAudioStatisticData
   * @param type Optional. `Object { encode: Boolean, decode: Boolean }` can specify which type of audio to subscribe to.
   * @returns
   * - `''`: Success.
   * - `Error`: Failure. Details in {@link ErrorTypes}.
   * @category statistic
   */
  subscribeAudioStatisticData(type?: StatisticOption): ExecutedResult;

  /**
   * Unsubscribes to audio statistic data based on the type parameter.
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#unsubscribeAudioStatisticData
   * @param type Optional. `Object { encode: Boolean, decode: Boolean }` can specify which type of audio to unsubscribe to.
   * @returns
   * - `''`: Success.
   * - `Error`: Failure. Details in {@link ErrorTypes}.
   * @category statistic
   */
  unsubscribeAudioStatisticData(type?: StatisticOption): ExecutedResult;

  /**
   * Subscribes to video statistic data based on the type parameter.
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#subscribeVideoStatisticData
   * @param type Optional. `Object { encode: Boolean, decode: Boolean }` can specify which type of audio should be subscribed to.
   * @returns
   * - `''`: Success.
   * - `Error`: Failure. Details in {@link ErrorTypes}.
   * @category statistic
   */
  subscribeVideoStatisticData(type?: VideoStatisticOption): ExecutedResult;

  /**
   * Unsubscribes to video statistic data based on the type parameter.
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#unsubscribeVideoStatisticData
   * @param type Optional. `Object { encode: Boolean, decode: Boolean }` can specify which type of audio should be unsubscribed to.
   * @returns
   * - `''`: Success.
   * - `Error`: Failure. Details in {@link ErrorTypes}.
   * @category statistic
   */
  unsubscribeVideoStatisticData(type?: VideoStatisticOption): ExecutedResult;

  /**
   * Subscribes to share statistic data based on the type parameter.
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#subscribeShareStatisticData
   * @param type Optional. `Object { encode: Boolean, decode: Boolean }` can specify which type of share to subscribe to.
   * @returns
   * - `''`: Success.
   * - `Error`: Failure. Details in {@link ErrorTypes}.
   * @category statistic
   */
  subscribeShareStatisticData(type?: StatisticOption): ExecutedResult;

  /**
   * Unsubscribes to share statistic data based on the type parameter.
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#unsubscribeShareStatisticData
   * @param type Optional. `Object { encode: Boolean, decode: Boolean }` can specify which type of share to unsubscribe to.
   * @returns
   * - `''`: Success.
   * - `Error`: Failure. Details in {@link ErrorTypes}.
   * @category statistic
   */
  unsubscribeShareStatisticData(type?: StatisticOption): ExecutedResult;

  /**
   * Check if the device is supported for custom layout.
   * Only desktop and tablet are supported, mobile is not supported.
   * @returns boolean
   */
  isSupportCustomLayout(): boolean;

  /**
   * @deprecated
   * @param container - DOM element to show components.
   * @param config - Session configuration options.
   * @category Customize Layout
   */
  showUitoolkitComponents(container: any, config: any): void;

  /**
   * @deprecated
   * @param container - DOM element to hide components.
   * @category Customize Layout
   */
  hideUitoolkitComponents(container: any): void;

  /**
   * Shows the video component.
   * @deprecated
   * @param container - DOM element to show video.
   * @category Customize Layout
   */
  showVideoComponent(container: HTMLElement): void;

  /**
   * Hides the video component.
   * @deprecated
   * @param container - DOM element containing video.
   * @category Customize Layout
   */
  hideVideoComponent(container: HTMLElement): void;

  /**
   * Hides all UI toolkit components.
   * @category Customize Layout
   */
  hideAllComponents(): void;

  /**
   * Shows the chat component.
   *
   * @param container - DOM element to show chat.
   * @param options - Options for the chat component.
   * @category Customize Layout
   */
  showChatComponent(container: HTMLElement, options?: { width?: number; height?: number; draggable?: boolean }): void;

  /**
   * Hides the chat component.
   * @param container - DOM element containing chat.
   * @category Customize Layout
   */
  hideChatComponent(container: HTMLElement): void;

  /**
   * Shows the session controls component.
   *
   * @param container - DOM element to show controls.
   * @param options - Options for the controls component.
   * @category Customize Layout
   */
  showControlsComponent(
    container: HTMLElement,
    options?: { draggable?: boolean; orientation?: "horizontal" | "vertical" },
  ): void;

  /**
   * Hides the session controls component.
   *
   * @param container - DOM element containing controls.
   * @category Customize Layout
   */
  hideControlsComponent(container: HTMLElement): void;

  /**
   * Shows the participants list component.
   *
   * @param container - DOM element to show users list.
   * @param options - Options for the users component.
   * @category Customize Layout
   */
  showUsersComponent(container: HTMLElement, options?: { width?: number; height?: number; draggable?: boolean }): void;

  /**
   * Hides the participants list component.
   *
   * @param container - DOM element containing the users list.
   * @category Customize Layout
   */
  hideUsersComponent(container: HTMLElement): void;

  /**
   * Shows the settings panel component.
   *
   * @param container - DOM element to show settings.
   * @param options - Options for the settings component.
   * @category Customize Layout
   */
  showSettingsComponent(
    container: HTMLElement,
    options?: { width?: number; height?: number; draggable?: boolean },
  ): void;

  /**
   * Hides the settings panel component.
   *
   * @param container - DOM element containing settings.
   * @category Customize Layout
   */
  hideSettingsComponent(container: HTMLElement): void;

  /**
   * Get all user info
   * @returns Array<Participant>
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#getAllUser
   */
  getAllUser(): Array<Participant>;

  /**
   * Get the current user info
   * @returns Participant
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#getCurrentUserInfo
   */
  getCurrentUserInfo(): Participant | null;

  /**
   * Get the session info
   * @returns SessionInfo
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#getSessionInfo
   */
  getSessionInfo(): SessionInfo | null;

  /**
   * Destroys the UI toolkit instance and cleans up resources.
   * @returns void
   */
  destroy(): Promise<void>;

  /**
   * Get the version of the UI toolkit, Video SDK and Tailwind CSS
   * @returns {Object} { uikit: string, videosdk: string, tailwindcss: string }
   */
  version(): { uikit: string; videosdk: string; tailwindcss: string };

  /**
   * Get the client instance when debug mode is true
   * @returns videosdk client instance https://marketplacefront.zoom.us/sdk/custom/web/modules/ZoomVideo.VideoClient.html
   */
  getClient(): any;
}

declare const _default: UIToolkit;
export default _default;
