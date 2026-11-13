# uitoolkit-integration › components › VideoButton

Use this guide when using `VideoButton` or `useVideoController`.

See [README.md](README.md) for all available components.
For the full API, see [video-button.json](../api/components/video-button.json) and [use-video-controller.json](../api/hooks/use-video-controller.json).

---

## Overview

`VideoButton` starts and stops the local camera and provides a camera-selection menu. The button is disabled until the session is connected, while camera controls are unavailable, and while the camera is starting or stopping.

While connected, the camera menu appears when the camera is on, or when cameras are available and the camera has been turned on at least once since the session connected. It lists the cameras, then your `menuGroups`. The current camera is checked. When the camera is off, choosing a camera selects it for the next start.

When camera access is denied, `ZoomUIToolkitProvider` shows a "Camera access is required." notification whether or not `VideoButton` is displayed, and the button shows its `warning` content. Do not add a separate no-permission banner around `VideoButton`. If starting video fails, for example because another application is using the camera, an error notification appears.

| State                       | Accessible label |
| --------------------------- | ---------------- |
| Camera off                  | `"Start video"`  |
| Camera on                   | `"Stop video"`   |
| Camera starting or stopping | `"Working..."`   |

---

## Usage

```tsx
import { VideoButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <VideoButton />
</ZoomUIToolkitProvider>;
```

---

## Props

| Prop              | Type                         | Default | Description                                                                                                       |
| ----------------- | ---------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| `className`       | `string`                     | —       | Additional CSS class for the control root                                                                         |
| `style`           | `CSSProperties`              | —       | Inline styles for the control root                                                                                |
| `isMobile`        | `boolean`                    | `false` | Displays the camera menu as a mobile bottom sheet. Not detected automatically                                     |
| `showMenu`        | `boolean`                    | `true`  | Shows the camera menu when it is available (see Overview) and camera controls or custom menu groups are available |
| `menuGroups`      | `ToolbarMenuGroup[]`         | —       | Extra menu groups shown after the camera choices                                                                  |
| `dropdownOptions` | `ToolbarMenuDropdownOptions` | —       | Desktop menu placement, styling, and container options; ignored when `isMobile` is `true`                         |
| `renderContent`   | `VideoButtonRenderContent`   | —       | Custom button content per video state                                                                             |

`renderContent` accepts `videoOn`, `videoOff`, `loading`, and `warning` keys. Each value is a React node or a function receiving `VideoButtonRenderContext`. When several states apply, the first match wins in this order: `loading`, `warning`, `videoOn`, `videoOff`. Omitted states use the default icon.

---

## Programmatic video control

Use `useVideoController` from inside the provider for custom UI or shortcuts.

```tsx
import { ConnectionState, useVideoController, useZoomUIToolkit } from '@zoom/videosdk-ui-toolkit';

function CameraToggle() {
  const { sessionState } = useZoomUIToolkit();
  const { videoState, toggleVideo, canControlVideo } = useVideoController();
  const isConnected = sessionState.connectionState === ConnectionState.Connected;

  return (
    <button
      type='button'
      onClick={() => void toggleVideo()}
      disabled={!isConnected || !canControlVideo || videoState.isLoading}
    >
      {videoState.isVideoOn ? 'Stop video' : 'Start video'}
    </button>
  );
}
```

`useVideoController()` returns `videoState`, `canControlVideo`, `canUseVirtualBackground`, `toggleVideo`, `startVideo`, `stopVideo`, `switchCamera`, `setMirrored`, `setHardwareAcceleration`, and `setVirtualBackground`.

- `canControlVideo` does not check the connection state. To match `VideoButton`, also require `useZoomUIToolkit().sessionState.connectionState === ConnectionState.Connected`.
- `switchCamera(deviceId)` takes an ID from `useZoomUIToolkit().deviceState.cameras`. When the camera is off, it selects the camera for the next `startVideo()`. It has no effect while disconnected.
- Actions never reject. Failures appear in `videoState.warning`; if starting video fails, an error notification is also shown.
