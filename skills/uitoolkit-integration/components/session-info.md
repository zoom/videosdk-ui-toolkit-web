# uitoolkit-integration › components › SessionInfo

Use this guide when using `SessionInfoButton` (and, for custom triggers/layouts, `SessionInfoPanel`).

See [README.md](README.md) for all available components.
For the pre-built header that wraps the button, see [modules/topbar.md](../modules/topbar.md).
Machine-readable contracts: [session-info-button.json](../api/components/session-info-button.json), [session-info-panel.json](../api/components/session-info-panel.json).

---

## Overview

`SessionInfoButton` is a toolbar-style info button that displays session metadata. It is **self-contained**: it manages its own open state and renders a `SessionInfoPanel` — as a draggable desktop floating panel or, when `isMobile` is set, a mobile bottom sheet. Just drop it inside the provider. The button is disabled until the session is connected.

On desktop the panel opens below the button by default and stays open until you click the button again or use the panel's close button; pressing Escape or clicking outside does **not** close it. Drag its header to reposition it. On mobile, the sheet closes when you swipe it down, tap outside it, or use its close button.

`SessionInfoPanel` is the panel it opens. The panel is **also self-contained** — it reads session data automatically and takes no data prop. It shows these rows, in order: topic, session ID, your name, your user ID, and (when you supply one) an invite link. Session ID and the invite link can be copied. The session password is not shown. You only need to use the panel directly for fully custom triggers/layouts.

---

## Usage

```tsx
import { SessionInfoButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <SessionInfoButton />
</ZoomUIToolkitProvider>;
```

By default the button shows an Info icon followed by the session topic, and opens the panel as a desktop floating panel. Pass `isMobile` to use the bottom-sheet layout, `renderContent` to replace the icon, `showSessionName={false}` to hide the topic, or `panelClassName` / `panelStyle` to style the desktop panel. Pass `inviteLink` to show an invite-link row with a copy button; your application supplies the link, and the row is hidden when none is passed.

```tsx
import { SessionInfoButton } from '@zoom/videosdk-ui-toolkit';

<SessionInfoButton
  isMobile={isCoarsePointer}
  renderContent={() => <MyIcon />}
  panelClassName='my-panel'
  inviteLink='https://example.com/join/abc123'
/>;
```

---

## SessionInfoButton props

| Prop              | Type                                           | Default | Description                                                                                                                                                                                                                                                             |
| ----------------- | ---------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`       | `string`                                       | —       | Additional CSS class for the button                                                                                                                                                                                                                                     |
| `style`           | `CSSProperties`                                | —       | Inline styles for the button                                                                                                                                                                                                                                            |
| `showSessionName` | `boolean`                                      | `true`  | Shows the session topic next to the info icon                                                                                                                                                                                                                           |
| `renderContent`   | `() => ReactNode`                              | —       | Custom leading content in place of the default Info icon                                                                                                                                                                                                                |
| `ariaLabel`       | `string`                                       | —       | Accessible label for the button and panel; defaults to "Session Info"                                                                                                                                                                                                   |
| `isMobile`        | `boolean`                                      | `false` | Shows the panel in a mobile bottom sheet instead of the desktop panel. Not detected automatically                                                                                                                                                                       |
| `panelClassName`  | `string`                                       | —       | Additional CSS class for the desktop session info panel                                                                                                                                                                                                                 |
| `panelStyle`      | `CSSProperties`                                | —       | Inline styles for the desktop session info panel                                                                                                                                                                                                                        |
| `anchor`          | `{ getBoundingClientRect(): DOMRect } \| null` | —       | Anchors the desktop panel to this element instead of the button. Pass an HTML element or any object with `getBoundingClientRect()`. Ignored on mobile                                                                                                                   |
| `popoverProps`    | `SessionInfoButtonPopoverProps`                | —       | Initial position of the desktop panel: `side` (default `'bottom'`), `align` (default `'start'`), `sideOffset` (default `8`), `alignOffset`, and `collisionPadding` (default `12`). The panel moves to the opposite side when there isn't enough room. Ignored on mobile |
| `onOpen`          | `() => void`                                   | —       | Called when the panel opens                                                                                                                                                                                                                                             |
| `onClose`         | `() => void`                                   | —       | Called when the panel closes, including when the mobile sheet is dismissed                                                                                                                                                                                              |
| `inviteLink`      | `string`                                       | —       | Invite URL supplied by your application; the row is hidden when omitted or empty                                                                                                                                                                                        |

---

## SessionInfoPanel props (custom layouts)

The panel reads its own data, so there is no `data` prop — render it inside the provider and it populates itself.

| Prop         | Type                  | Default    | Description                                                                                                                                                       |
| ------------ | --------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`  | `string`              | —          | Additional CSS class for the desktop panel                                                                                                                        |
| `style`      | `CSSProperties`       | —          | Inline styles for the desktop panel                                                                                                                               |
| `anchor`     | `HTMLElement \| null` | —          | Desktop anchor element. The panel is positioned next to it and kept on screen. Ignored when `isMobile` is `true`                                                  |
| `placement`  | `'top' \| 'bottom'`   | `'bottom'` | Preferred side of the anchor; may flip to stay on screen. Only used with `anchor`                                                                                 |
| `open`       | `boolean`             | `true`     | Controls visibility                                                                                                                                               |
| `isMobile`   | `boolean`             | `false`    | Renders content only (no box or overlay) for a mobile sheet or another container you supply. `anchor` and `placement` are ignored                                 |
| `onClose`    | `() => void`          | —          | Shows a close button and is called when it is pressed. With `anchor` set, pressing Escape or clicking outside also calls it. Without it, no close button is shown |
| `inviteLink` | `string`              | —          | Invite URL to display; the row is hidden when omitted or empty                                                                                                    |

`SessionInfoPanel` does not close itself: set `open` to `false` (or unmount it) from `onClose`.

```tsx
import { SessionInfoPanel, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

function CustomInfo() {
  return <SessionInfoPanel open inviteLink='https://example.com/join/abc123' />;
}

<ZoomUIToolkitProvider clientInstance={client}>
  <CustomInfo />
</ZoomUIToolkitProvider>;
```

---

## Mobile sheet

Pass `isMobile` to `SessionInfoButton` and it presents the panel in a mobile bottom sheet:

```tsx
import { SessionInfoButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <SessionInfoButton isMobile />
</ZoomUIToolkitProvider>;
```

When using `SessionInfoPanel` directly, `isMobile` renders **content only** (no box or overlay); supply your own bottom-sheet container around it and close that container from `onClose`.
