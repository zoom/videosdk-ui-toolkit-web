import React from "react";
import { createRoot, type Root } from "react-dom/client";
import UIToolKitApp from "../App";
import ZoomVideo from "@zoom/videosdk";
import { CustomizationOptions, SessionClient, SuspensionViewValue, VideoClientEvent } from "../types";
import { StoreProvider, store } from "./StoreProvider";
import PreviewKit from "./PreviewKit";
import ChatKit from "./ChatKit";
import ControlsKit from "./ControlsKit";
import SettingsKit from "./SettingsKit";
import UsersKit from "./UsersKit";
import { ExposedEvents } from "@/events/event-constant";
import { offEvent, onEvent } from "@/events/event-bus";
import { resetSession } from "@/store/sessionSlice";
import { resetSessionUI, setActivePopper, setCustomizeLayout, setViewType, setIsMirrorVideo } from "@/store/uiSlice";
import { migrateConfig } from "./util";
import { isMobileDeviceNotIpad } from "@/components/util/service";

export class UIToolkit {
  private client: SessionClient;
  private config: CustomizationOptions;
  private root: HTMLElement | null = null;
  private reactRoot: Root | null = null;
  private readonly componentRoots: Map<HTMLElement, Root> = new Map();
  private readonly activeComponents: Map<string, HTMLElement> = new Map();
  private readonly eventCallbacks: Map<string, Set<any>> = new Map();

  constructor(config?: CustomizationOptions) {
    this.client = ZoomVideo.createClient();
    this.config = config
      ? (migrateConfig(config) as CustomizationOptions)
      : ({ videoSDKJWT: "" } as CustomizationOptions);

    // Initialize event callback sets
    ["joined", "closed", "destroyed", "view-type-change"].forEach((event) => {
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
    this.client.leave(true);
  }

  /**
   * Leaves the session
   */
  leaveSession() {
    this.client.leave();
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

  destroy() {
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

    // Clear the callback arrays
    this.eventCallbacks.get("joined")?.clear();
    this.eventCallbacks.get("closed")?.clear();
    this.eventCallbacks.get("destroyed")?.clear();
    this.eventCallbacks.get("view-type-change")?.clear();

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
    ZoomVideo.destroyClient();
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
