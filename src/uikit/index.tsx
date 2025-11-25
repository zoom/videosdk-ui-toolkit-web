import { CustomizationOptions, Participant, SessionClient, SuspensionViewValue, VideoClientEvent } from "@/types";
import UIToolkit from "./UIToolkit";
import { migrateConfig } from "./util";
import "../index.css";
import ZoomVideo, { ExecutedResult, SessionInfo, StatisticOption, VideoStatisticOption } from "@zoom/videosdk";
import { isMobileDeviceNotIpad, TAILWIND_VERSION, UIKIT_VERSION } from "@/components/util/service";

// Singleton instance management
let uiToolkitInstance: UIToolkit | null = null;
let uiToolkitConfig: CustomizationOptions | undefined;

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

  joinSession: (container: HTMLElement, config: CustomizationOptions): void => {
    if (usePreviewApi && config.featuresOptions?.preview?.enable) {
      const newConfig = Object.assign({}, config, {
        featuresOptions: { ...config?.featuresOptions, preview: { enable: false } },
      });
      const toolkit = getOrCreateUIToolkit(newConfig);
      toolkit.joinSession(container);
    } else {
      const toolkit = getOrCreateUIToolkit(config);
      toolkit.joinSession(container);
    }
  },

  leaveSession: (): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.leaveSession();
  },

  closeSession: (): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.closeSession();
  },

  changeViewType: (viewType: SuspensionViewValue): void => {
    const toolkit = getOrCreateUIToolkit();
    toolkit.changeViewType(viewType);
  },

  // off all events callbacks and destroy the toolkit
  destroy: (): void => {
    const toolkit = getOrCreateUIToolkit();
    if (toolkit) {
      toolkit.destroy();
      uiToolkitInstance = null;
      usePreviewApi = false;
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

  mirrorVideo: async (mirrored: boolean) => {
    const toolkit = getOrCreateUIToolkit();
    return toolkit.mirrorVideo(mirrored);
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
