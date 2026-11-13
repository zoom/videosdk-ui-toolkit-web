# uitoolkit-integration › components › ParticipantPanel

Use this guide when using `ParticipantPanel`.

See [README.md](README.md) for all available components.
For the toggle button, see [participant-button.md](participant-button.md).
See [participant-panel.json](../api/components/participant-panel.json) for the machine-readable contract, including which row actions each role can use.

---

## Overview

`ParticipantPanel` renders the participant list with search, active speaker highlighting, and role-based row actions (rename, mute, ask to unmute, role changes, remove). Hosts and co-hosts also see a **Mute All** button, and the original host sees a **Reclaim host** button while they are not the current host and are not in a breakout room.

The list shows you first, then the host, co-hosts, and everyone else. Within each group, participants keep the order the session reports. Until the session is connected, the list shows a loading indicator.

---

## Usage

```tsx
import { ParticipantPanel, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <ParticipantPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
</ZoomUIToolkitProvider>;
```

`ParticipantPanel` renders inline by default. Pass `anchor` to position it beside an element instead, or use `ParticipantButton` when you want a ready-made button that opens the panel.

---

## Props

| Prop        | Type                  | Description                                                                                                                                                                                                                                                     |
| ----------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className` | `string`              | Additional CSS class for the desktop panel                                                                                                                                                                                                                      |
| `style`     | `CSSProperties`       | Inline styles for the desktop panel                                                                                                                                                                                                                             |
| `anchor`    | `HTMLElement \| null` | Positions the panel beside this element and keeps it within the viewport. Omit to display the panel inline. Ignored when `isMobile` is `true`                                                                                                                   |
| `placement` | `'top' \| 'bottom'`   | Preferred side of the anchor; defaults to `'top'`. The panel may move to stay within the viewport. Only used with `anchor`                                                                                                                                      |
| `open`      | `boolean`             | Shows the panel when `true` and hides it when `false`; defaults to `true`                                                                                                                                                                                       |
| `isMobile`  | `boolean`             | Renders the panel without its own frame or positioning so you can place it in your own container. Row action menus open as bottom sheets. Defaults to `false`                                                                                                   |
| `onClose`   | `() => void`          | Called when the user closes the panel with its close button. With `anchor` set, pressing Escape or clicking outside also calls it. The panel does not hide itself; set `open` to `false` in response. The close button is shown only when `onClose` is provided |

---

## Mobile sheet

`isMobile` makes `ParticipantPanel` render only its content (header, search, list, and footer buttons) without its own frame or positioning. The surrounding container, such as a bottom sheet, and how it is dismissed are up to you.

The simplest option is `ParticipantButton`, which already presents the panel in a mobile bottom sheet:

```tsx
import { ParticipantButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <ParticipantButton isMobile />
</ZoomUIToolkitProvider>;
```

For a custom trigger, place the panel inside your own bottom-sheet container:

```tsx
import { ParticipantPanel } from '@zoom/videosdk-ui-toolkit';

<YourBottomSheet open={panelOpen} onOpenChange={setPanelOpen}>
  <ParticipantPanel isMobile onClose={() => setPanelOpen(false)} />
</YourBottomSheet>;
```
