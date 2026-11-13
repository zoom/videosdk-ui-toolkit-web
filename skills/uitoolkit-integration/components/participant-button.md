# uitoolkit-integration › components › ParticipantButton

Use this guide when using `ParticipantButton`.

See [README.md](README.md) for all available components.
For the panel itself, see [participant-panel.md](participant-panel.md).
See [participant-button.json](../api/components/participant-button.json) for the machine-readable contract.

---

## Overview

`ParticipantButton` is a toolbar button that opens and closes the participant list (`ParticipantPanel`). It shows a live participant count badge (counts above 99 show as `99+`) and is disabled unless the session is connected, for example before joining or while reconnecting.

On desktop, the panel opens above the button by default and can be moved by dragging its header. It stays open until you click the button again or use the panel's close button — clicking outside the panel or pressing Escape does **not** close it. On mobile, the list opens in a bottom sheet that closes when you swipe it down, tap outside it, or use its close button.

---

## Usage

```tsx
import { ParticipantButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <ParticipantButton />
</ZoomUIToolkitProvider>;
```

On desktop, the panel opens as a floating panel next to the button. On mobile, pass `isMobile` to show the list in a bottom sheet.

```tsx
import { ParticipantButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <ParticipantButton isMobile />
</ZoomUIToolkitProvider>;
```

To place the participant list in your own layout instead, render `ParticipantPanel` directly.

---

## Props

| Prop             | Type                                           | Description                                                                                                                                                                                                                                                          |
| ---------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`      | `string`                                       | Additional CSS class for the button                                                                                                                                                                                                                                  |
| `style`          | `CSSProperties`                                | Inline styles for the button                                                                                                                                                                                                                                         |
| `renderContent`  | `() => ReactNode`                              | Custom icon in place of the default participants icon. The count badge is still shown                                                                                                                                                                                |
| `onOpen`         | `() => void`                                   | Called when the panel opens                                                                                                                                                                                                                                          |
| `onClose`        | `() => void`                                   | Called when the panel closes, including when the mobile sheet is dismissed                                                                                                                                                                                           |
| `isMobile`       | `boolean`                                      | Shows the participant list in a mobile bottom sheet instead of the desktop panel. Not detected automatically. Defaults to `false`                                                                                                                                    |
| `panelClassName` | `string`                                       | Additional CSS class for the desktop participant panel                                                                                                                                                                                                               |
| `panelStyle`     | `CSSProperties`                                | Inline styles for the desktop participant panel                                                                                                                                                                                                                      |
| `anchor`         | `{ getBoundingClientRect(): DOMRect } \| null` | Anchors the desktop panel to this element instead of the button. Pass an HTML element or any object with `getBoundingClientRect()`. Ignored on mobile                                                                                                                |
| `popoverProps`   | `ParticipantButtonPopoverProps`                | Initial position of the desktop panel: `side` (default `'top'`), `align` (default `'start'`), `sideOffset` (default `8`), `alignOffset`, and `collisionPadding` (default `12`). The panel moves to the opposite side when there isn't enough room. Ignored on mobile |

---

## Styling the panel

Use `panelClassName` and `panelStyle` to style the desktop participant panel:

```tsx
import { ParticipantButton } from '@zoom/videosdk-ui-toolkit';

<ParticipantButton panelClassName='my-panel' panelStyle={{ width: 360 }} />;
```
