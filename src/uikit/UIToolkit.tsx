import React from "react";
import { createRoot, type Root } from "react-dom/client";
import UIToolKitApp from "../App";
import ZoomVideo from "@zoom/videosdk";
import {
  BroadcastViewerOptions,
  CustomizationOptions,
  SessionClient,
  SuspensionViewValue,
  VideoClientEvent,
} from "../types";
import { StoreProvider, store } from "./StoreProvider";
import PreviewKit from "./PreviewKit";
import ChatKit from "./ChatKit";
import ControlsKit from "./ControlsKit";
import SettingsKit from "./SettingsKit";
import UsersKit from "./UsersKit";
import BroadcastViewer from "@/features/broadcast-streaming/BroadcastViewer";
import { ExposedEvents } from "@/events/event-constant";
import { offEvent, onEvent } from "@/events/event-bus";
import { resetSession } from "@/store/sessionSlice";
import {
  resetSessionUI,
  setActivePopper,
  setCustomizeLayout,
  setViewType,
  setIsMirrorVideo,
  setLanguage as setLanguageAction,
  setLanguageList as setLanguageListAction,
} from "@/store/uiSlice";
import { migrateConfig } from "./util";
import { isMobileDeviceNotIpad } from "@/components/util/service";
import i18n from "@/i18n";

/**
 * PTZ (Pan-Tilt-Zoom) camera control interface
 */
class PTZController {
  constructor(private getClient: () => SessionClient) {}

  /**
   * Checks if the browser supports PTZ camera control
   * @returns true if PTZ is supported, false otherwise
   */
  isBrowserSupported(): boolean {
    const stream = this.getClient()?.getMediaStream?.() as unknown;
    if (!stream || typeof (stream as { isBrowserSupportPTZ?: () => boolean }).isBrowserSupportPTZ !== "function") {
      return false;
    }
    return (stream as { isBrowserSupportPTZ: () => boolean }).isBrowserSupportPTZ();
  }

  /**
   * Gets the PTZ capability of the local camera
   * @returns Promise resolving to the PTZ capability object
   */
  async getCapability(): Promise<unknown> {
    const stream = this.getClient()?.getMediaStream?.() as unknown;
    if (
      !stream ||
      typeof (stream as { getCameraPTZCapability?: () => Promise<unknown> }).getCameraPTZCapability !== "function"
    ) {
      throw new Error("Get camera PTZ capability API is unavailable.");
    }
    return await (stream as { getCameraPTZCapability: () => Promise<unknown> }).getCameraPTZCapability();
  }

  /**
   * Gets the PTZ capability of a remote participant's camera
   * @param userId - The user ID of the participant
   * @returns Promise resolving to the PTZ capability object
   */
  async getFarEndCapability(userId: number): Promise<unknown> {
    const stream = this.getClient()?.getMediaStream?.() as unknown;
    if (
      !stream ||
      typeof (stream as { getFarEndCameraPTZCapability?: (userId: number) => Promise<unknown> })
        .getFarEndCameraPTZCapability !== "function"
    ) {
      throw new Error("Get far-end camera PTZ capability API is unavailable.");
    }
    return await (
      stream as { getFarEndCameraPTZCapability: (userId: number) => Promise<unknown> }
    ).getFarEndCameraPTZCapability(userId);
  }

  /**
   * Requests control of a remote participant's camera
   * @param userId - The user ID of the participant
   * @returns Promise that resolves when the request is sent
   */
  async requestControl(userId: number): Promise<void> {
    const stream = this.getClient()?.getMediaStream?.() as unknown;
    if (
      !stream ||
      typeof (stream as { requestFarEndCameraControl?: (userId: number) => Promise<void> })
        .requestFarEndCameraControl !== "function"
    ) {
      throw new Error("Request far-end camera control API is unavailable.");
    }
    await (stream as { requestFarEndCameraControl: (userId: number) => Promise<void> }).requestFarEndCameraControl(
      userId,
    );
  }

  /**
   * Approves a camera control request from another participant
   * @param userId - The user ID of the participant requesting control
   * @returns Promise that resolves when the approval is processed
   */
  async approveControl(userId: number): Promise<void> {
    const stream = this.getClient()?.getMediaStream?.() as unknown;
    if (
      !stream ||
      typeof (stream as { approveFarEndCameraControl?: (userId: number) => Promise<void> })
        .approveFarEndCameraControl !== "function"
    ) {
      throw new Error("Approve far-end camera control API is unavailable.");
    }
    await (stream as { approveFarEndCameraControl: (userId: number) => Promise<void> }).approveFarEndCameraControl(
      userId,
    );
  }

  /**
   * Declines a camera control request from another participant
   * @param userId - The user ID of the participant requesting control
   * @returns Promise that resolves when the decline is processed
   */
  async declineControl(userId: number): Promise<void> {
    const stream = this.getClient()?.getMediaStream?.() as unknown;
    if (
      !stream ||
      typeof (stream as { declineFarEndCameraControl?: (userId: number) => Promise<void> })
        .declineFarEndCameraControl !== "function"
    ) {
      throw new Error("Decline far-end camera control API is unavailable.");
    }
    await (stream as { declineFarEndCameraControl: (userId: number) => Promise<void> }).declineFarEndCameraControl(
      userId,
    );
  }

  /**
   * Gives up control of a remote participant's camera
   * @param userId - The user ID of the participant whose camera control to release
   * @returns Promise that resolves when control is released
   */
  async giveUpControl(userId: number): Promise<void> {
    const stream = this.getClient()?.getMediaStream?.() as unknown;
    if (
      !stream ||
      typeof (stream as { giveUpFarEndCameraControl?: (userId: number) => Promise<void> }).giveUpFarEndCameraControl !==
        "function"
    ) {
      throw new Error("Give up far-end camera control API is unavailable.");
    }
    await (stream as { giveUpFarEndCameraControl: (userId: number) => Promise<void> }).giveUpFarEndCameraControl(
      userId,
    );
  }

  /**
   * Sends a PTZ control command to a remote participant's camera
   * @param options - Object containing cmd (command type), userId, and range (magnitude)
   * @returns Promise that resolves when the command is sent
   */
  async control(options: { cmd: number; userId: number; range?: number }): Promise<void> {
    const stream = this.getClient()?.getMediaStream?.() as unknown;
    if (
      !stream ||
      typeof (
        stream as { controlFarEndCamera?: (options: { cmd: number; userId: number; range?: number }) => Promise<void> }
      ).controlFarEndCamera !== "function"
    ) {
      throw new Error("Control far-end camera API is unavailable.");
    }
    await (
      stream as { controlFarEndCamera: (options: { cmd: number; userId: number; range?: number }) => Promise<void> }
    ).controlFarEndCamera(options);
  }
}

/**
 * Internationalization (i18n) controller interface
 */
class I18nController {
  constructor(private getStore: () => typeof store) {}

  /**
   * Sets the current UI language
   * @param language - Language code (e.g., "en-US", "zh-CN")
   * @param resources - Optional language resources as object or URL to JSON file
   * @example
   * ```js
   * // Set language only
   * uiToolkit.i18n.setLanguage("zh-CN");
   *
   * // Set language with inline resources
   * uiToolkit.i18n.setLanguage("zh-CN", { hello: "你好", goodbye: "再见" });
   *
   * // Set language with URL to resources
   * uiToolkit.i18n.setLanguage("zh-CN", "/locales/zh-CN.json");
   * ```
   */
  async setLanguage(language: string, resources?: Record<string, unknown> | string): Promise<void> {
    const { dispatch } = this.getStore();

    // If resources are provided, add them to i18n
    if (resources) {
      if (typeof resources === "string") {
        // Load resources from URL
        try {
          const response = await fetch(resources);
          if (!response.ok) {
            throw new Error(`Failed to load language resources from ${resources}: ${response.statusText}`);
          }
          const data = await response.json();
          i18n.addResourceBundle(language, "translation", data, true, true);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error loading language resources from ${resources}:`, error);
          throw error;
        }
      } else {
        // Add inline resources
        i18n.addResourceBundle(language, "translation", resources, true, true);
      }
    } else {
      // Validate that resources exist for the language
      const hasResources = i18n.hasResourceBundle(language, "translation");
      if (!hasResources) {
        const fallbackLng = i18n.options.fallbackLng as string;
        // eslint-disable-next-line no-console
        console.warn(`No translation resources found for language "${language}". Falling back to "${fallbackLng}".`);
        // Don't change language if no resources exist
        return;
      }
    }

    // Update language in Redux store (triggers language change in App.tsx)
    dispatch(setLanguageAction(language));
  }

  /**
   * Sets the list of available languages
   * @param languages - Array of language codes
   * @example
   * ```js
   * uiToolkit.i18n.setLanguageList(["en-US", "zh-CN", "es-ES"]);
   * ```
   */
  setLanguageList(languages: string[]): void {
    const { dispatch } = this.getStore();
    dispatch(setLanguageListAction(languages));
  }

  /**
   * Gets the i18n instance for accessing translations
   * @returns The i18next instance
   * @example
   * ```js
   * const i18nInstance = uiToolkit.i18n.getInstance();
   * const translation = i18nInstance.t("key");
   * ```
   */
  getInstance() {
    return i18n;
  }

  /**
   * Gets the current language
   * @returns Current language code (e.g., "en-US", "zh-CN")
   * @example
   * ```js
   * const currentLanguage = uiToolkit.i18n.getLanguage();
   * ```
   */
  getLanguage(): string {
    return this.getStore().getState().ui.language;
  }

  /**
   * Gets the list of available languages
   * @returns Array of language codes
   * @example
   * ```js
   * const languages = uiToolkit.i18n.getLanguageList();
   * ```
   */
  getLanguageList(): string[] {
    return this.getStore().getState().ui.languageList;
  }

  /**
   * Checks if translation resources exist for a specific language
   * @param language - Language code to check (e.g., "en-US", "zh-CN")
   * @returns true if resources exist, false otherwise
   * @example
   * ```js
   * const hasJapanese = uiToolkit.i18n.hasLanguageResources("ja-JP");
   * ```
   */
  hasLanguageResources(language: string): boolean {
    return i18n.hasResourceBundle(language, "translation");
  }
}

export class UIToolkit {
  private client: SessionClient;
  private config: CustomizationOptions;
  private root: HTMLElement | null = null;
  private reactRoot: Root | null = null;
  private readonly componentRoots: Map<HTMLElement, Root> = new Map();
  private readonly activeComponents: Map<string, HTMLElement> = new Map();
  private readonly eventCallbacks: Map<string, Set<any>> = new Map();

  /**
   * PTZ (Pan-Tilt-Zoom) camera control interface
   * @example
   * ```js
   * // Check browser support
   * const supported = uiToolkit.ptz.isBrowserSupported();
   *
   * // Get local camera PTZ capability
   * const capability = await uiToolkit.ptz.getCapability();
   *
   * // Request control of remote camera
   * await uiToolkit.ptz.requestControl(userId);
   *
   * // Control remote camera
   * await uiToolkit.ptz.control({ cmd: 1, userId, range: 50 });
   * ```
   */
  public readonly ptz: PTZController;

  /**
   * Internationalization (i18n) controller interface
   * @example
   * ```js
   * // Set language
   * await uiToolkit.i18n.setLanguage("zh-CN");
   *
   * // Get current language
   * const language = uiToolkit.i18n.getLanguage();
   *
   * // Check if resources exist
   * const hasJapanese = uiToolkit.i18n.hasLanguageResources("ja-JP");
   *
   * // Get i18n instance
   * const i18nInstance = uiToolkit.i18n.getInstance();
   * ```
   */
  public readonly i18n: I18nController;

  constructor(config?: CustomizationOptions) {
    this.client = ZoomVideo.createClient();
    this.config = config
      ? (migrateConfig(config) as CustomizationOptions)
      : ({ videoSDKJWT: "" } as CustomizationOptions);

    // Initialize PTZ controller
    this.ptz = new PTZController(() => this.client);

    // Initialize i18n controller
    this.i18n = new I18nController(() => this.getStore());

    // Initialize event callback sets
    ["joined", "closed", "destroyed", "view-type-change", "uikit-language-change"].forEach((event) => {
      this.eventCallbacks.set(event, new Set());
    });
  }

  /**
   * Renders a singleton component in the specified container.
   * @throws {Error} If component type is invalid
   */
  private renderComponent(
    componentType: string,
    container: HTMLElement,
    Component: React.ComponentType<any>,
    options?: any,
  ): void {
    const existingContainer = this.activeComponents.get(componentType);
    if (existingContainer && existingContainer !== container) {
      // current component only support singleton
      this.hideComponent(existingContainer);
    }

    // Get or create root
    let componentRoot = this.componentRoots.get(container);
    if (!componentRoot) {
      container.classList.add("zoom-ui-toolkit-root");
      componentRoot = createRoot(container);
      this.componentRoots.set(container, componentRoot);
    }

    this.activeComponents.set(componentType, container);
    return componentRoot.render(
      <StoreProvider client={this.client} config={this.config}>
        <Component client={this.client} config={this.config} options={options} />
      </StoreProvider>,
    );
  }

  /**
   * check api is supported on mobile device
   */
  private commonCheckApi(methodName: string, container: HTMLElement): string {
    if (isMobileDeviceNotIpad()) {
      return `${methodName} api is not supported on mobile device`;
    }
    if (!container?.id) {
      return `${methodName} container id is required`;
    }
    return "";
  }

  // Generic hide method for all components
  private hideComponent(container: HTMLElement): void {
    const root = this.componentRoots.get(container);
    if (root) {
      root.unmount();
      this.componentRoots.delete(container);

      // Remove from activeComponents
      for (const [componentType, activeContainer] of this.activeComponents.entries()) {
        if (activeContainer === container) {
          this.activeComponents.delete(componentType);
          break;
        }
      }
    }
  }

  /**
   * Opens the preview window
   * @param container - DOM element to render the preview
   * @param options - Preview options
   */
  openPreview(container: HTMLElement, options?: { onClickJoin: () => void }): void {
    this.renderComponent("preview", container, PreviewKit, options);
  }

  /**
   * Closes the preview window
   */
  closePreview(container: HTMLElement): void {
    this.hideComponent(container);
    this.activeComponents.delete("preview");
  }

  /**
   * Registers a callback for when a session is joined
   */
  onSessionJoined(callback: (event: "joined") => void): void {
    onEvent(ExposedEvents.EVENT_SESSION_JOINED, callback);
    this.eventCallbacks.get("joined")?.add(callback);
  }

  /**
   * Removes a session joined callback
   */
  offSessionJoined(callback: (event: "joined") => void): void {
    offEvent(ExposedEvents.EVENT_SESSION_JOINED, callback);
    this.eventCallbacks.get("joined")?.delete(callback);
  }

  /**
   * Registers a callback for when a session is closed
   */
  onSessionClosed(callback: (event: "closed") => void): void {
    onEvent(ExposedEvents.EVENT_SESSION_CLOSED, callback);
    this.eventCallbacks.get("closed")?.add(callback);
  }
  /**
   * Removes a session closed callback
   */
  offSessionClosed(callback: (event: "closed") => void): void {
    offEvent(ExposedEvents.EVENT_SESSION_CLOSED, callback);
    this.eventCallbacks.get("closed")?.delete(callback);
  }

  onViewTypeChange(callback: (event: "view-type-change") => void): void {
    onEvent(ExposedEvents.EVENT_VIEW_TYPE_CHANGE, callback);
    this.eventCallbacks.get("view-type-change")?.add(callback);
  }

  offViewTypeChange(callback: (event: "view-type-change") => void): void {
    offEvent(ExposedEvents.EVENT_VIEW_TYPE_CHANGE, callback);
    this.eventCallbacks.get("view-type-change")?.delete(callback);
  }

  onSessionDestroyed(callback: (event: "destroyed") => void): void {
    onEvent(ExposedEvents.EVENT_SESSION_DESTROYED, callback);
    this.eventCallbacks.get("destroyed")?.add(callback);
  }

  offSessionDestroyed(callback: (event: "destroyed") => void): void {
    offEvent(ExposedEvents.EVENT_SESSION_DESTROYED, callback);
    this.eventCallbacks.get("destroyed")?.delete(callback);
  }

  /**
   * Registers a callback for when the UI language changes
   * @param callback - Function to call with the new language code (e.g., "en-US", "zh-CN")
   */
  onLanguageChange(callback: (language: string) => void): void {
    onEvent(ExposedEvents.EVENT_LANGUAGE_CHANGE, callback);
    this.eventCallbacks.get("uikit-language-change")?.add(callback);
  }

  /**
   * Removes a language change callback
   * @param callback - The callback function to remove
   */
  offLanguageChange(callback: (language: string) => void): void {
    offEvent(ExposedEvents.EVENT_LANGUAGE_CHANGE, callback);
    this.eventCallbacks.get("uikit-language-change")?.delete(callback);
  }

  /**
   * Hides all UIKit components
   */
  hideAllComponents(): void {
    // Clean up all active components
    for (const [_componentType, container] of this.activeComponents.entries()) {
      this.hideComponent(container);
    }
    // Clear the active components map
    this.activeComponents.clear();
  }

  /**
   * Shows the chat component
   */
  showChatComponent(
    container: HTMLElement,
    options?: { width?: number; height?: number; draggable?: boolean },
  ): Promise<void> {
    const checkResult = this.commonCheckApi("showChatComponent", container);

    if (checkResult) {
      return Promise.reject(checkResult);
    }
    this.getStore().dispatch(setCustomizeLayout({ chat: container?.id }));
    this.getStore().dispatch(setActivePopper("chat"));
    this.renderComponent("chat", container, ChatKit, options);
    return Promise.resolve();
  }

  hideChatComponent(container: HTMLElement): void {
    this.getStore().dispatch(setCustomizeLayout({ chat: "" }));
    this.hideComponent(container);
    this.activeComponents.delete("chat");
  }

  /**
   * Shows the controls component
   */
  showControlsComponent(
    container: HTMLElement,
    options?: {
      draggable?: boolean;
      orientation?: "horizontal" | "vertical";
    },
  ): Promise<void> {
    const checkResult = this.commonCheckApi("showControlsComponent", container);
    if (checkResult) {
      return Promise.reject(checkResult);
    }
    this.getStore().dispatch(setCustomizeLayout({ controls: container?.id }));
    this.renderComponent("controls", container, ControlsKit, options);
    return Promise.resolve();
  }

  hideControlsComponent(container: HTMLElement): void {
    this.getStore().dispatch(setCustomizeLayout({ controls: "" }));
    this.hideComponent(container);
    this.activeComponents.delete("controls");
  }

  /**
   * Shows the settings component
   */
  showSettingsComponent(
    container: HTMLElement,
    options?: { width?: number; height?: number; draggable?: boolean },
  ): Promise<void> {
    const checkResult = this.commonCheckApi("showSettingsComponent", container);
    if (checkResult) {
      return Promise.reject(checkResult);
    }
    this.getStore().dispatch(setCustomizeLayout({ settings: container?.id }));
    this.getStore().dispatch(setActivePopper("settings"));
    this.renderComponent("settings", container, SettingsKit, options);
    return Promise.resolve();
  }

  hideSettingsComponent(container: HTMLElement): void {
    this.getStore().dispatch(setCustomizeLayout({ settings: "" }));
    this.hideComponent(container);
    this.activeComponents.delete("settings");
  }

  /**
   * Shows the users component
   */
  showUsersComponent(
    container: HTMLElement,
    options?: { width?: number; height?: number; draggable?: boolean },
  ): Promise<void> {
    const checkResult = this.commonCheckApi("showUsersComponent", container);
    if (checkResult) {
      return Promise.reject(checkResult);
    }
    this.getStore().dispatch(setCustomizeLayout({ users: container?.id }));
    this.getStore().dispatch(setActivePopper("users"));
    this.renderComponent("users", container, UsersKit, options);
    return Promise.resolve();
  }

  hideUsersComponent(container: HTMLElement): void {
    this.getStore().dispatch(setCustomizeLayout({ users: "" }));
    this.hideComponent(container);
    this.activeComponents.delete("users");
  }

  /**
   * Shows the broadcast viewer component
   */
  showBroadcastViewerComponent(container: HTMLElement, options?: BroadcastViewerOptions): Promise<void> {
    const checkResult = this.commonCheckApi("showBroadcastViewerComponent", container);
    if (checkResult) {
      return Promise.reject(checkResult);
    }

    this.renderComponent("broadcastViewer", container, BroadcastViewer, options);
    return Promise.resolve();
  }

  /**
   * Hides the broadcast viewer component
   */
  hideBroadcastViewerComponent(container: HTMLElement): void {
    this.hideComponent(container);
    this.activeComponents.delete("broadcastViewer");
  }

  updateConfig(config: CustomizationOptions): void {
    this.config = config;
  }

  /**
   * Renders the UI toolkit into a specified container
   */
  joinSession(container: HTMLElement | string) {
    this.root = typeof container === "string" ? document.getElementById(container) : container;

    if (!this.root) {
      throw new Error("Container element not found");
    }

    // Try to get config from data-config attribute
    if (Object.keys(this.config).length === 0) {
      try {
        const configAttr = this.root.getAttribute("data-config");
        if (configAttr) {
          this.config = JSON.parse(configAttr);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("Failed to parse config from data-config attribute:", error);
      }
    }

    // Reuse existing root or create new one
    if (!this.reactRoot && this.root) {
      this.root.classList.add("zoom-ui-toolkit-root");
      this.reactRoot = createRoot(this.root);
    }

    if (this.reactRoot) {
      this.reactRoot.render(
        <StoreProvider client={this.client} config={this.config}>
          <UIToolKitApp client={this.client} config={this.config} />
        </StoreProvider>,
      );
    }
  }

  /**
   * Unmounts the UI toolkit from the container
   */
  closeSession() {
    return this.client.leave(true);
  }

  /**
   * Leaves the session
   */
  leaveSession() {
    return this.client.leave();
  }

  changeViewType(viewType: SuspensionViewValue) {
    const viewModes = this.getStore().getState()?.session?.config?.featuresOptions?.viewMode?.viewModes;
    if (viewModes?.includes(viewType)) {
      this.getStore().dispatch(setViewType(viewType));
    } else {
      // eslint-disable-next-line no-console
      console.warn(`${viewType} is not supported`);
    }
  }

  /**
   * Gets the current client instance
   */
  getClient(): SessionClient {
    if (!this.client) {
      throw new Error("Client not initialized");
    }
    return this.client;
  }

  /**
   * Gets the Redux store instance
   */
  getStore() {
    return store;
  }

  async destroy(): Promise<void> {
    // Clean up all event listeners
    this.eventCallbacks.get("joined")?.forEach((cb) => {
      this.offSessionJoined(cb as (event: "joined") => void);
    });
    this.eventCallbacks.get("closed")?.forEach((cb) => {
      this.offSessionClosed(cb as (event: "closed") => void);
    });
    this.eventCallbacks.get("destroyed")?.forEach((cb) => {
      this.offSessionDestroyed(cb as (event: "destroyed") => void);
    });
    this.eventCallbacks.get("view-type-change")?.forEach((cb) => {
      this.offViewTypeChange(cb as (event: "view-type-change") => void);
    });
    this.eventCallbacks.get("uikit-language-change")?.forEach((cb) => {
      this.offLanguageChange(cb as (language: string) => void);
    });
    // Clear the callback arrays
    this.eventCallbacks.get("joined")?.clear();
    this.eventCallbacks.get("closed")?.clear();
    this.eventCallbacks.get("destroyed")?.clear();
    this.eventCallbacks.get("view-type-change")?.clear();
    this.eventCallbacks.get("uikit-language-change")?.clear();
    // Unmount the main react root if it exists
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }
    // Unmount all component roots
    this.componentRoots.forEach((root) => {
      root.unmount();
    });

    this.componentRoots.clear();
    this.activeComponents.clear();

    // Destroy the client last
    await ZoomVideo.destroyClient().catch(() => undefined);
    this.client = null;
    this.getStore().dispatch(resetSession());
    this.getStore().dispatch(resetSessionUI());
  }

  // videosdk on event api
  on(event: VideoClientEvent, callback: (payload: any) => void): void;
  on(event: string, callback: (payload: any) => void): void;
  on(event: string, callback: (payload: any) => void) {
    this.client.on(event, callback);
  }

  // videosdk off event api
  off(event: VideoClientEvent, callback: (payload: any) => void): void;
  off(event: string, callback: (payload: any) => void): void;
  off(event: string, callback: (payload: any) => void) {
    this.client.off(event, callback);
  }

  /**
   * Mirrors self video
   */
  async mirrorVideo(mirrored: boolean) {
    const stream = this.client?.getMediaStream?.();
    if (!stream || typeof stream.mirrorVideo !== "function") {
      throw new Error("Mirror video API is unavailable.");
    }

    const { dispatch } = this.getStore();
    const previousValue = this.getStore().getState().ui.isMirrorVideo;
    dispatch(setIsMirrorVideo(mirrored));

    try {
      await stream.mirrorVideo(mirrored);
    } catch (error) {
      dispatch(setIsMirrorVideo(previousValue));
      throw error;
    }
  }
}

export default UIToolkit;
