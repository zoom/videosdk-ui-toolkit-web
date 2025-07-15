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
      enforceMultipleVideos?: boolean; // only for WASM test
      originalRatio?: boolean;
      virtualBackground?: boolean;
    };
    audio?: {
      enable: boolean;
      backgroundNoiseSuppression?: boolean;
      originalSound?: boolean;
      syncButtonsOnHeadset?: boolean;
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
 * Zoom Video SDK UI Toolkit API
 * Provides methods for managing video sessions and UI components
 */
export interface UIToolkit {
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
  joinSession(container: HTMLElement, config: CustomizationOptions): void;

  /**
   * Leaves the session
   */
  leaveSession(): void;

  /**
   * Closes the current video session.
   *
   * @param container - DOM element containing the session
   */
  closeSession(container?: HTMLElement): void;
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
   * Registers a callback for a specific event.
   *
   * @param event - The event name to listen for https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#on
   * @param callback - The callback function to execute when the event occurs.
   * @category Events
   */
  on(event: string, callback: (payload: any) => void): void;

  /**
   * Removes a previously registered event listener.
   *
   * @param event - The event name to remove the listener from https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#off
   * @param callback - The callback function to remove from event listeners.
   * @category Events
   */
  off(event: string, callback: (payload: any) => void): void;

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
  destroy(): void;

  /**
   * Get the version of the UI toolkit, Video SDK and Tailwind CSS
   * @returns {Object} { uikit: string, videosdk: string, tailwindcss: string }
   */
  version(): { uikit: string; videosdk: string; tailwindcss: string };
}

declare const _default: UIToolkit;
export default _default;
