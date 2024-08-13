declare namespace _default {
    function openPreview(container: HTMLElement): void;
    function closePreview(container: HTMLElement): void;
    function joinSession(container: HTMLElement, config: Object): void;
    function closeSession(container: HTMLElement): void;
    function onSessionJoined(callback: EventListenerOrEventListenerObject): void;
    function offSessionJoined(callback: EventListenerOrEventListenerObject): void;
    function onSessionClosed(callback: EventListenerOrEventListenerObject): void;
    function offSessionClosed(callback: EventListenerOrEventListenerObject): void;
    function showUitoolkitComponents(container: HTMLElement, config: Object): void;
    function hideUitoolkitComponents(container: HTMLElement): void;
    function showVideoComponent(container: HTMLElement): void;
    function hideVideoComponent(container: HTMLElement): void;
    function showChatComponent(container: HTMLElement): void;
    function hideChatComponent(container: HTMLElement): void;
    function showControlsComponent(container: HTMLElement): void;
    function hideControlsComponent(container: HTMLElement): void;
    function showUserComponent(container: HTMLElement): void;
    function hideUserComponent(container: HTMLElement): void;
    function showSettingsComponent(container: HTMLElement): void;
    function hideSettingsComponent(container: HTMLElement): void;
}
export default _default;
