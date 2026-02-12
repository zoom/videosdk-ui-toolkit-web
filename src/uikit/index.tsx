import {
  BroadcastViewerOptions,
  CustomizationOptions,
  Participant,
  SessionClient,
  SuspensionViewValue,
  VideoClientEvent,
} from "@/types";
import UIToolkit from "./UIToolkit";
import { migrateConfig, normalizeJoinConfig, waitForToolkitEvent, withTimeout } from "./util";
import "./index.css";
import ZoomVideo, { ExecutedResult, SessionInfo, StatisticOption, VideoStatisticOption } from "@zoom/videosdk";
import { isMobileDeviceNotIpad, TAILWIND_VERSION, UIKIT_VERSION } from "@/components/util/service";
import { defaultConfig } from "@/constant";

// Singleton instance management
let uiToolkitInstance: UIToolkit | null = null;
let uiToolkitConfig: CustomizationOptions | undefined;
let destroyInFlight: Promise<void> | null = null;
let sessionCloseInFlight: Promise<void> | null = null;

type ToolkitEventHandler = {
  (event: VideoClientEvent, callback: (payload: any) => void): void;
  (event: string, callback: (payload: any) => void): void;
};

/**
 * Gets or creates a UIToolkit instance with the given config.
 * @throws {Error} If no config is provided and toolkit hasn't been initialized
 */
const getOrCreateUIToolkit = (config?: CustomizationOptions): UIToolkit => {
  if (!uiToolkitInstance && config) {
    uiToolkitInstance = new UIToolkit(config);
    uiToolkitConfig = config;
    return uiToolkitInstance;
  }

  if (!uiToolkitInstance && !uiToolkitConfig) {
    throw new Error("UIToolkit config is required. Call joinSession method first");
  }

  return uiToolkitInstance;
};

let usePreviewApi = false;
// Public API
const UIToolkitAPI = {
  openPreview: (container: HTMLElement, config: CustomizationOptions, options?: { onClickJoin: () => void }): void => {
    if (config.featuresOptions?.preview?.enable) {
      usePreviewApi = true;
    }

    const newConfig = Object.assign({}, config, {
      featuresOptions: { ...config?.featuresOptions, preview: { enable: false } },
    });
    const toolkit = getOrCreateUIToolkit(newConfig);
    toolkit.openPreview(container, options);
  },

  closePreview: (container: HTMLElement): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.closePreview(container);
  },

  joinSession: async (container: HTMLElement, config: CustomizationOptions): Promise<void> => {
    if (destroyInFlight) {
      await destroyInFlight;
    }
    if (sessionCloseInFlight) {
      await sessionCloseInFlight;
    }

    const migrated = normalizeJoinConfig(config, usePreviewApi);
    const toolkit = getOrCreateUIToolkit(migrated);
    toolkit.updateConfig(migrated);
    if (toolkit.getClient()?.getSessionInfo?.()?.isInMeeting) return;

    const joined = waitForToolkitEvent(
      (cb) => toolkit.onSessionJoined(cb),
      (cb) => toolkit.offSessionJoined(cb),
      60000,
      "Timed out waiting for session to join",
    );
    toolkit.joinSession(container);
    await joined;
  },

  leaveSession: async (): Promise<void> => {
    const toolkit = getOrCreateUIToolkit();
    if (sessionCloseInFlight) {
      await sessionCloseInFlight;
      return;
    }
    const client = toolkit.getClient();
    if (client?.getSessionInfo?.()?.isInMeeting) {
      sessionCloseInFlight = (async () => {
        try {
          await withTimeout(toolkit.leaveSession(), 20000, "Timed out waiting for session to leave");
        } finally {
          sessionCloseInFlight = null;
        }
      })();
      await sessionCloseInFlight;
      return;
    }
    return;
  },

  closeSession: async (_container?: HTMLElement): Promise<void> => {
    const toolkit = getOrCreateUIToolkit();
    if (sessionCloseInFlight) {
      await sessionCloseInFlight;
      return;
    }
    const client = toolkit.getClient();
    if (client?.getSessionInfo?.()?.isInMeeting) {
      sessionCloseInFlight = (async () => {
        try {
          await withTimeout(toolkit.closeSession(), 20000, "Timed out waiting for session to close");
        } finally {
          sessionCloseInFlight = null;
        }
      })();
      await sessionCloseInFlight;
      return;
    }
    return;
  },

  changeViewType: (viewType: SuspensionViewValue): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.changeViewType(viewType);
  },

  // off all events callbacks and destroy the toolkit
  destroy: async (): Promise<void> => {
    const toolkit = getOrCreateUIToolkit();
    if (toolkit) {
      if (destroyInFlight) {
        await destroyInFlight;
        return;
      }

      destroyInFlight = (async () => {
        try {
          if (sessionCloseInFlight) {
            await sessionCloseInFlight;
          }
          await toolkit.destroy();
        } finally {
          destroyInFlight = null;
          sessionCloseInFlight = null;
          uiToolkitInstance = null;
          uiToolkitConfig = undefined;
          usePreviewApi = false;
        }
      })();
      await destroyInFlight;
    }
  },

  // session joined event
  onSessionJoined: (callback: (event: "joined") => void): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.onSessionJoined(callback);
  },

  // off session joined event
  offSessionJoined: (callback: (event: "joined") => void): void => {
    const toolkit = getOrCreateUIToolkit();
    if (toolkit) {
      toolkit.offSessionJoined(callback);
    }
  },

  // session closed event
  onSessionClosed: (callback: (event: "closed") => void): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.onSessionClosed(callback);
  },

  // off session closed event
  offSessionClosed: (callback: (event: "closed") => void): void => {
    const toolkit = getOrCreateUIToolkit();
    if (toolkit) {
      toolkit.offSessionClosed(callback);
    }
  },

  onViewTypeChange: (callback: (event: SuspensionViewValue) => void): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.onViewTypeChange(callback);
  },

  offViewTypeChange: (callback: (event: SuspensionViewValue) => void): void => {
    const toolkit = getOrCreateUIToolkit();
    if (toolkit) {
      toolkit.offViewTypeChange(callback);
    }
  },

  // language change event
  onLanguageChange: (callback: (language: string) => void): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.onLanguageChange(callback);
  },

  // off language change event
  offLanguageChange: (callback: (language: string) => void): void => {
    const toolkit = getOrCreateUIToolkit();
    if (toolkit) {
      toolkit.offLanguageChange(callback);
    }
  },

  // when all uikit components been destroyed
  onSessionDestroyed: (callback: (event: "destroyed") => void): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.onSessionDestroyed(callback);
  },

  // off session destroyed event
  offSessionDestroyed: (callback: (event: "destroyed") => void): void => {
    const toolkit = getOrCreateUIToolkit();
    if (toolkit) {
      toolkit.offSessionDestroyed(callback);
    }
  },

  showUitoolkitComponents: (): void => {
    // eslint-disable-next-line no-console
    console.warn("showUitoolkitComponents is deprecated, do nothing");
  },

  hideUitoolkitComponents: (): void => {
    // eslint-disable-next-line no-console
    console.warn("hideUitoolkitComponents is deprecated, do nothing, please use hideAllComponents instead");
  },

  hideAllComponents: (): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.hideAllComponents();
  },

  // Individual component controls
  showVideoComponent: (
    _container: HTMLElement,
    _options?: { width?: number; height?: number; draggable?: boolean },
  ): void => {
    // eslint-disable-next-line no-console
    console.warn("showVideoComponent is deprecated");
  },

  hideVideoComponent: (_container: HTMLElement): void => {
    // eslint-disable-next-line no-console
    console.warn("hideVideoComponent is deprecated");
  },

  showChatComponent: (
    container: HTMLElement,
    options?: { width?: number; height?: number; draggable?: boolean },
  ): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.showChatComponent(container, options);
  },

  hideChatComponent: (container: HTMLElement): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.hideChatComponent(container);
  },

  showUsersComponent: (
    container: HTMLElement,
    options?: { width?: number; height?: number; draggable?: boolean },
  ): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.showUsersComponent(container, options);
  },

  hideUsersComponent: (container: HTMLElement): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.hideUsersComponent(container);
  },

  showSettingsComponent: (
    container: HTMLElement,
    options?: { width?: number; height?: number; draggable?: boolean },
  ): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.showSettingsComponent(container, options);
  },

  hideSettingsComponent: (container: HTMLElement): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.hideSettingsComponent(container);
  },

  showControlsComponent: (
    container: HTMLElement,
    options?: { draggable?: boolean; orientation?: "horizontal" | "vertical" },
  ): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.showControlsComponent(container, options);
  },

  hideControlsComponent: (container: HTMLElement): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.hideControlsComponent(container);
  },

  showBroadcastViewerComponent: (container: HTMLElement, options?: BroadcastViewerOptions): void => {
    const toolkit = getOrCreateUIToolkit(defaultConfig);
    toolkit.showBroadcastViewerComponent(container, options);
  },

  hideBroadcastViewerComponent: (container: HTMLElement): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.hideBroadcastViewerComponent(container);
  },

  mirrorVideo: async (mirrored: boolean) => {
    const toolkit = getOrCreateUIToolkit();
    return toolkit.mirrorVideo(mirrored);
  },

  /**
   * Internationalization (i18n) API for language and translation management
   * @example
   * ```ts
   * // Set current language
   * await UIToolkit.i18n.setLanguage("zh-CN");
   *
   * // Set language with inline resources
   * await UIToolkit.i18n.setLanguage("zh-CN", { hello: "你好", goodbye: "再见" });
   *
   * // Set language with URL to resources
   * await UIToolkit.i18n.setLanguage("zh-CN", "/locales/zh-CN.json");
   *
   * // Set available languages
   * UIToolkit.i18n.setLanguageList(["en-US", "zh-CN", "es-ES"]);
   *
   * // Get i18n instance for translations
   * const i18n = UIToolkit.i18n.getInstance();
   * const translation = i18n.t("key");
   *
   * // Get current language
   * const currentLang = UIToolkit.i18n.getLanguage();
   * ```
   */
  i18n: {
    /**
     * Sets the current UI language
     * @param language - Language code (e.g., "en-US", "zh-CN")
     * @param resources - Optional language resources as object or URL to JSON file
     * @returns Promise that resolves when language is set and resources are loaded
     */
    setLanguage: async (language: string, resources?: Record<string, unknown> | string): Promise<void> => {
      const toolkit = getOrCreateUIToolkit();
      await toolkit.i18n.setLanguage(language, resources);
    },

    /**
     * Sets the list of available languages
     * @param languages - Array of language codes
     */
    setLanguageList: (languages: string[]): void => {
      const toolkit = getOrCreateUIToolkit();
      toolkit.i18n.setLanguageList(languages);
    },

    /**
     * Gets the i18n instance for accessing translations
     * @returns The i18next instance
     */
    getInstance: () => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.i18n.getInstance();
    },

    /**
     * Gets the current language
     * @returns Current language code (e.g., "en-US", "zh-CN")
     */
    getLanguage: (): string => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.i18n.getLanguage();
    },

    /**
     * Gets the list of available languages
     * @returns Array of language codes
     */
    getLanguageList: (): string[] => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.i18n.getLanguageList();
    },

    /**
     * Checks if translation resources exist for a specific language
     * @param language - Language code to check (e.g., "en-US", "zh-CN")
     * @returns true if resources exist, false otherwise
     */
    hasLanguageResources: (language: string): boolean => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.i18n.hasLanguageResources(language);
    },
  },

  /**
   * PTZ (Pan-Tilt-Zoom) camera control interface
   * @example
   * ```ts
   * // Check browser support
   * const supported = UIToolkit.ptz.isBrowserSupported();
   *
   * // Get local camera PTZ capability
   * const capability = await UIToolkit.ptz.getCapability();
   *
   * // Request control of remote camera
   * await UIToolkit.ptz.requestControl(userId);
   *
   * // Control remote camera
   * await UIToolkit.ptz.control({ cmd: 1, userId, range: 50 });
   * ```
   */
  ptz: {
    /**
     * Checks if the browser supports PTZ camera control
     * @returns true if PTZ is supported, false otherwise
     */
    isBrowserSupported: (): boolean => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.ptz.isBrowserSupported();
    },

    /**
     * Gets the PTZ capability of the local camera
     * @returns Promise resolving to the PTZ capability object
     */
    getCapability: async (): Promise<unknown> => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.ptz.getCapability();
    },

    /**
     * Gets the PTZ capability of a remote participant's camera
     * @param userId - The user ID of the participant
     * @returns Promise resolving to the PTZ capability object
     */
    getFarEndCapability: async (userId: number): Promise<unknown> => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.ptz.getFarEndCapability(userId);
    },

    /**
     * Requests control of a remote participant's camera
     * @param userId - The user ID of the participant
     * @returns Promise that resolves when the request is sent
     */
    requestControl: async (userId: number): Promise<void> => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.ptz.requestControl(userId);
    },

    /**
     * Approves a camera control request from another participant
     * @param userId - The user ID of the participant requesting control
     * @returns Promise that resolves when the approval is processed
     */
    approveControl: async (userId: number): Promise<void> => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.ptz.approveControl(userId);
    },

    /**
     * Declines a camera control request from another participant
     * @param userId - The user ID of the participant requesting control
     * @returns Promise that resolves when the decline is processed
     */
    declineControl: async (userId: number): Promise<void> => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.ptz.declineControl(userId);
    },

    /**
     * Gives up control of a remote participant's camera
     * @param userId - The user ID of the participant whose camera control to release
     * @returns Promise that resolves when control is released
     */
    giveUpControl: async (userId: number): Promise<void> => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.ptz.giveUpControl(userId);
    },

    /**
     * Sends a PTZ control command to a remote participant's camera
     * @param options - Object containing cmd (command type), userId, and range (magnitude)
     * @returns Promise that resolves when the command is sent
     */
    control: async (options: { cmd: number; userId: number; range?: number }): Promise<void> => {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.ptz.control(options);
    },
  },

  // Config helper to convert old config to new config
  migrateConfig: (config: CustomizationOptions): CustomizationOptions => {
    return migrateConfig(config, false) as CustomizationOptions;
  },

  /**
   * Register a callback for a specific event.
   * Overloads accept either a union-typed event name (for IntelliSense)
   * or a general string (for dynamic variables at runtime).
   * https://developers.zoom.us/docs/video-sdk/web/reference/#on
   */
  on: ((event: VideoClientEvent | string, callback: (payload: any) => void) => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.on(event, callback);
  }) as ToolkitEventHandler,

  /**
   * Remove a previously registered event listener.
   * Accepts union-typed event name or string variables.
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#off
   */
  off: ((event: VideoClientEvent | string, callback: (payload: any) => void) => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.off(event, callback);
  }) as ToolkitEventHandler,

  /**
   * Get all user info
   * @returns Array<Participant>
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#getAllUser
   */
  getAllUser: (): Array<Participant> => {
    const toolkit = getOrCreateUIToolkit();
    return toolkit.getClient()?.getAllUser() ?? [];
  },

  /**
   * Get the current user info
   * @returns Participant
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#getCurrentUserInfo
   */
  getCurrentUserInfo: (): Participant | null => {
    const toolkit = getOrCreateUIToolkit();
    return toolkit.getClient()?.getCurrentUserInfo() ?? null;
  },

  /**
   * Get the session info
   * @returns SessionInfo
   * https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#getSessionInfo
   */
  getSessionInfo: (): SessionInfo | null => {
    const toolkit = getOrCreateUIToolkit();
    return toolkit.getClient()?.getSessionInfo() ?? null;
  },

  subscribeAudioStatisticData: (type?: StatisticOption): ExecutedResult => {
    const toolkit = getOrCreateUIToolkit();
    return toolkit.getClient()?.getMediaStream()?.subscribeAudioStatisticData(type);
  },

  unsubscribeAudioStatisticData: (type?: StatisticOption): ExecutedResult => {
    const toolkit = getOrCreateUIToolkit();
    return toolkit.getClient()?.getMediaStream()?.unsubscribeAudioStatisticData(type);
  },

  subscribeVideoStatisticData: (type?: VideoStatisticOption): ExecutedResult => {
    const toolkit = getOrCreateUIToolkit();
    return toolkit.getClient()?.getMediaStream()?.subscribeVideoStatisticData(type);
  },

  unsubscribeVideoStatisticData: (type?: VideoStatisticOption): ExecutedResult => {
    const toolkit = getOrCreateUIToolkit();
    return toolkit.getClient()?.getMediaStream()?.unsubscribeVideoStatisticData(type);
  },

  subscribeShareStatisticData: (type?: StatisticOption): ExecutedResult => {
    const toolkit = getOrCreateUIToolkit();
    return toolkit.getClient()?.getMediaStream()?.subscribeShareStatisticData(type);
  },

  unsubscribeShareStatisticData: (type?: StatisticOption): ExecutedResult => {
    const toolkit = getOrCreateUIToolkit();
    return toolkit.getClient()?.getMediaStream()?.unsubscribeShareStatisticData(type);
  },

  /**
   * Check if the device is supported for custom layout
   * only desktop and tablet are supported
   * @returns boolean
   */
  isSupportCustomLayout: (): boolean => {
    return !isMobileDeviceNotIpad();
  },

  version: () => {
    return {
      uikit: UIKIT_VERSION,
      videosdk: ZoomVideo?.VERSION,
      tailwindcss: TAILWIND_VERSION,
    };
  },

  getClient: (): SessionClient | null => {
    if (uiToolkitConfig?.debug) {
      const toolkit = getOrCreateUIToolkit();
      return toolkit.getClient();
    }
    return null;
  },
};

if (typeof window !== "undefined") {
  (window as any).UIToolkit = UIToolkitAPI;
}

export default UIToolkitAPI;
