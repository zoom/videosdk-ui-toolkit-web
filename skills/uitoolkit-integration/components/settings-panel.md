# uitoolkit-integration › components › SettingsPanel

Use this guide when using `SettingsPanel`.

See [README.md](README.md) for all available components.
For the toggle button, see [settings-button.md](settings-button.md).
See [settings-panel.json](../api/components/settings-panel.json) for the machine-readable contract.

---

## Overview

`SettingsPanel` renders the settings UI content, with Audio, Video, Share screen, and Statistics tabs. Use it directly only when you need to embed settings inside a custom surface (e.g. your own sheet or modal). For the standard toolbar button, use `SettingsButton` instead.

Tab contents show a loading state until the session is connected.

---

## Usage

```tsx
import { SettingsPanel } from '@zoom/videosdk-ui-toolkit';

// Inside your own mobile sheet or modal
<SettingsPanel isMobile onClose={handleClose} />;

// Desktop panel — you position it
<SettingsPanel open onClose={handleClose} />;
```

Control the active tab (update it from `onTabChange` so users can still switch tabs):

```tsx
import { useState } from 'react';
import { SettingsPanel, type SettingsTab } from '@zoom/videosdk-ui-toolkit';

function MySettings({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<SettingsTab>('video');
  return <SettingsPanel open activeTab={tab} onTabChange={setTab} onClose={onClose} />;
}
```

Show only a subset of tabs:

```tsx
import { SettingsPanel } from '@zoom/videosdk-ui-toolkit';

<SettingsPanel open tabs={['audio', 'video']} onClose={handleClose} />;
```

---

## Props

| Prop           | Type                         | Default     | Description                                                                                                                                                                         |
| -------------- | ---------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`         | `boolean`                    | `true`      | Set to `false` to hide the panel                                                                                                                                                    |
| `isMobile`     | `boolean`                    | `false`     | Renders the mobile layout, with tabs across the top. It has no sheet or container of its own; place it in yours                                                                     |
| `activeTab`    | `SettingsTab`                | —           | Controlled active tab. When set, update it from `onTabChange`. Invalid or hidden values fall back to the first visible tab. When omitted, the panel starts on the first visible tab |
| `onTabChange`  | `(tab: SettingsTab) => void` | —           | Called when the user switches tabs                                                                                                                                                  |
| `tabs`         | `SettingsTab[]`              | all         | Which tabs to show, in the order provided. An empty array shows all tabs                                                                                                            |
| `onClose`      | `() => void`                 | —           | Shows a close button and is called when it is pressed. Without `onClose`, no close button is shown                                                                                  |
| `testSoundUrl` | `string`                     | SDK default | URL of the sound played by "Test speaker". The SDK ring tone is used when omitted                                                                                                   |
| `className`    | `string`                     | —           | Additional CSS class for the panel root                                                                                                                                             |
| `style`        | `CSSProperties`              | —           | Inline styles for the panel root                                                                                                                                                    |

---

## SettingsTab type

```ts
type SettingsTab = 'audio' | 'video' | 'share' | 'qos';
```

| Value     | Tab label      | Content                                                                                                                                                                                                                                |
| --------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'audio'` | "Audio"        | Microphone and Speaker pickers, "Original Sound", "Noise Suppression" when supported, and "Sync Headset Buttons" when the browser supports it. Microphone and speaker tests (see below)                                                |
| `'video'` | "Video"        | Camera picker, "Mirror my video", and hardware acceleration toggles. When virtual backgrounds are supported, also a self-preview and a background picker with None, Blur, and the images from `sessionOptions.video.virtualBackground` |
| `'share'` | "Share screen" | Currently has no controls. Pass `tabs` without `'share'` to hide it                                                                                                                                                                    |
| `'qos'`   | "Statistics"   | Audio, Video, and Share views with Send and Receive columns for latency, jitter, and packet loss, plus frequency for audio and resolution and frame rate for video and share. A dash means no data yet                                 |

### Microphone and speaker tests

The tests are only shown when a `localAudioTrack` is passed to `ZoomUIToolkitProvider`.

- "Test microphone" records from the selected microphone. Click "Stop recording" to play the recording back through the selected speaker, and "Stop playing" to end playback.
- "Test speaker" plays the test sound (`testSoundUrl`) through the selected speaker. The button reads "Stop" while the sound plays.

---

## Exported constants and enums

```ts
import { MicTestPhase } from '@zoom/videosdk-ui-toolkit';
```

| Export         | Kind   | Description                                                                                                       |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| `MicTestPhase` | `enum` | Phase states for the microphone test: `Idle` (`'idle'`), `Recording` (`'recording'`), and `Playing` (`'playing'`) |

---

## Mobile behavior

When using `SettingsPanel` directly in a mobile context, pass `isMobile` and place it inside your own bottom sheet — the panel renders content only (no surface, no overlay). Close your sheet from `onClose`.

```tsx
import { SettingsPanel } from '@zoom/videosdk-ui-toolkit';

<YourBottomSheet open={open} onOpenChange={setOpen}>
  <SettingsPanel isMobile onClose={() => setOpen(false)} />
</YourBottomSheet>;
```
