# uitoolkit-integration › components › SettingsButton

Use this guide when using `SettingsButton`.

See [README.md](README.md) for all available components.
For the panel itself, see [settings-panel.md](settings-panel.md).
See [settings-button.json](../api/components/settings-button.json) for the machine-readable contract.

---

## Overview

`SettingsButton` is the standard entry point for the settings feature. It is a toolbar-style button that owns the open/close state and renders `SettingsPanel` (Audio, Video, Share screen, and Statistics tabs; the Share screen tab currently has no controls) as a draggable floating panel on desktop or a bottom sheet on mobile. The button is disabled until the session is connected.

On desktop the panel opens above the button by default and stays open until you click the button again or use the panel's close button; pressing Escape or clicking outside does **not** close it. Drag its header to reposition it. On mobile, the sheet closes when you swipe it down, tap outside it, or use its close button.

The panel opens on the Audio tab, or on the first visible tab if Audio is hidden. The selected tab is kept while the button stays mounted.

---

## Usage

```tsx
import { SettingsButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <SettingsButton />
</ZoomUIToolkitProvider>;
```

With lifecycle callbacks:

```tsx
import { SettingsButton } from '@zoom/videosdk-ui-toolkit';

<SettingsButton onOpen={() => analytics.track('settings_opened')} onClose={() => analytics.track('settings_closed')} />;
```

Restrict which tabs are shown:

```tsx
import { SettingsButton } from '@zoom/videosdk-ui-toolkit';

<SettingsButton panelProps={{ tabs: ['audio', 'video'] }} />;
```

Override panel positioning:

```tsx
import { SettingsButton } from '@zoom/videosdk-ui-toolkit';

<SettingsButton popoverProps={{ side: 'bottom', align: 'end', sideOffset: 4 }} />;
```

Mobile — renders a bottom sheet instead of a desktop floating panel:

```tsx
import { SettingsButton } from '@zoom/videosdk-ui-toolkit';

<SettingsButton isMobile={isMobileDevice} />;
```

`SettingsButton` does **not** auto-detect mobile — the caller is responsible for passing `isMobile`.

---

## Props

| Prop             | Type                                                                                                                    | Default | Description                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isMobile`       | `boolean`                                                                                                               | `false` | Shows the panel in a mobile bottom sheet instead of the desktop panel. Not detected automatically                                                     |
| `onOpen`         | `() => void`                                                                                                            | —       | Called when the panel opens                                                                                                                           |
| `onClose`        | `() => void`                                                                                                            | —       | Called when the panel closes, including when the mobile sheet is dismissed                                                                            |
| `panelProps`     | `Omit<SettingsPanelProps, 'open' \| 'onClose' \| 'isMobile' \| 'className' \| 'style' \| 'activeTab' \| 'onTabChange'>` | —       | `SettingsPanel` options you can set here: `tabs` and `testSoundUrl`                                                                                   |
| `panelClassName` | `string`                                                                                                                | —       | Additional CSS class for the settings panel, on desktop and mobile                                                                                    |
| `panelStyle`     | `CSSProperties`                                                                                                         | —       | Inline styles for the settings panel, on desktop and mobile                                                                                           |
| `anchor`         | `{ getBoundingClientRect(): DOMRect } \| null`                                                                          | —       | Anchors the desktop panel to this element instead of the button. Pass an HTML element or any object with `getBoundingClientRect()`. Ignored on mobile |
| `popoverProps`   | `SettingsButtonPopoverProps`                                                                                            | —       | Initial position of the desktop panel (see below). The panel moves to the opposite side when there isn't enough room. Ignored on mobile               |
| `renderContent`  | `() => ReactNode`                                                                                                       | —       | Custom icon in place of the default Settings icon                                                                                                     |
| `className`      | `string`                                                                                                                | —       | Additional CSS class for the button                                                                                                                   |
| `style`          | `CSSProperties`                                                                                                         | —       | Inline styles for the button                                                                                                                          |

### SettingsButtonPopoverProps

Not exported by name; pass an object literal.

| Prop               | Type                                     | Default   |
| ------------------ | ---------------------------------------- | --------- |
| `side`             | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`   |
| `align`            | `'start' \| 'center' \| 'end'`           | `'start'` |
| `sideOffset`       | `number`                                 | `8`       |
| `alignOffset`      | `number`                                 | —         |
| `collisionPadding` | `number`                                 | `12`      |
