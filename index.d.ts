declare namespace _default {
    function openPreview(container: HTMLElement): void;
    function closePreview(container: HTMLElement): void;
    function joinSession(container: HTMLElement, config: Object): void;
    function closeSession(container: HTMLElement): void;
    function onSessionJoined(callback: EventListenerOrEventListenerObject): void;
    function offSessionJoined(callback: EventListenerOrEventListenerObject): void;
    function onSessionClosed(callback: EventListenerOrEventListenerObject): void;
    function offSessionClosed(callback: EventListenerOrEventListenerObject): void;
}
export default _default;
