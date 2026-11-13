# uitoolkit-integration › components › AudioButton

Use this guide when using `AudioButton` or `useAudioController`.

See [README.md](README.md) for all available components.
For the full API, see [audio-button.json](../api/components/audio-button.json) and [use-audio-controller.json](../api/hooks/use-audio-controller.json).

---

## Overview

`AudioButton` joins audio, then mutes and unmutes the microphone. After audio is joined, a menu lists Microphone and Speaker choices, then "Leave audio", then your `menuGroups`. The button is disabled until the session is connected, while audio controls are unavailable, and while an audio action is in progress.

While `AudioButton` is displayed and the session is connected, it also shows:

- "You are muted now." with an "Unmute" action when you speak while muted.
- A "Host muted you" notice when the host mutes you.
- "Interaction is required to start audio" with a "Join audio" action when the browser blocks audio playback.
- The host's request-to-unmute dialog, unless `sessionOptions.audio.disableUnmuteConsentDialog` is `true`. See [Host unmute requests](host-unmute-requests.md).

Custom controls built only on `useAudioController` don't get these prompts.

When microphone access is denied, `ZoomUIToolkitProvider` shows a "Microphone access is required." notification whether or not `AudioButton` is displayed, and the button shows its `warning` content. Do not add a separate no-permission banner around `AudioButton`.

| State                    | Accessible label |
| ------------------------ | ---------------- |
| Not yet joined audio     | `"Join audio"`   |
| Muted                    | `"Unmute"`       |
| Unmuted                  | `"Mute"`         |
| Audio action in progress | `"Working..."`   |

---

## Usage

```tsx
import { AudioButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <AudioButton />
</ZoomUIToolkitProvider>;
```

---

## Props

| Prop              | Type                         | Default | Description                                                                                        |
| ----------------- | ---------------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| `className`       | `string`                     | —       | Additional CSS class for the control root                                                          |
| `style`           | `CSSProperties`              | —       | Inline styles for the control root                                                                 |
| `isMobile`        | `boolean`                    | `false` | Displays the device menu as a mobile bottom sheet. Not detected automatically                      |
| `showMenu`        | `boolean`                    | `true`  | Shows the device menu while audio is joined and audio controls or custom menu groups are available |
| `menuGroups`      | `ToolbarMenuGroup[]`         | —       | Extra menu groups shown after the default options; the menu is available after joining audio       |
| `dropdownOptions` | `ToolbarMenuDropdownOptions` | —       | Desktop menu placement, styling, and container options; ignored when `isMobile` is `true`          |
| `renderContent`   | `AudioButtonRenderContent`   | —       | Custom button content per audio state                                                              |

`renderContent` accepts `joinAudio`, `muted`, `unmuted`, `loading`, and `warning` keys. Each value is a React node or a function receiving `AudioButtonRenderContext`. When several states apply, the first match wins in this order: `loading`, `warning`, `joinAudio`, `muted`, `unmuted`. Omitted states use the default icon.

---

## Programmatic audio control

Use `useAudioController` from inside the provider for custom UI or shortcuts.

```tsx
import { useEffect } from 'react';
import { useAudioController } from '@zoom/videosdk-ui-toolkit';

function SpacebarMute() {
  const { audioState, toggleAudio } = useAudioController();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Don't toggle while the user is typing, for example in chat.
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, [contenteditable="true"]')) {
        return;
      }
      if (e.code === 'Space' && audioState.isJoined) {
        void toggleAudio();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [audioState.isJoined, toggleAudio]);

  return null;
}
```

`useAudioController()` returns `audioState`, `canControlAudio`, `canUseNoiseSuppression`, `canUseHeadsetSync`, `toggleAudio`, `joinAudio`, `leaveAudio`, `switchMicrophone`, `switchSpeaker`, `setNoiseSuppression`, `setOriginalSound`, and `setHeadsetSync`.

- `canControlAudio` does not check the connection state. To match `AudioButton`, also require `useZoomUIToolkit().sessionState.connectionState === ConnectionState.Connected`.
- Actions never reject. Failures are reported in `audioState.warning`. If joining audio fails, an error notification is also shown.
