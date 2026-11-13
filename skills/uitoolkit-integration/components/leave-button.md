# uitoolkit-integration › components › LeaveButton

Use this guide when using `LeaveButton`.

See [README.md](README.md) for all available components.
See [leave-button.json](../api/components/leave-button.json) for the machine-readable contract.

---

## Overview

`LeaveButton` is a standalone leave/end session button.

- Participants and co-hosts leave as soon as they click it. There is no confirmation.
- The host gets a menu (a desktop menu, or a bottom sheet when `isMobile` is set) with "End meeting for all" and "Leave meeting". "End meeting for all" ends the session for everyone right away.
- When other participants are present, "Leave meeting" asks the host to choose a new host. "Assign and leave" stays disabled until someone is selected, then transfers the host role and leaves. If the transfer fails, the error is reported in `sessionState.errorMessage` and the host still leaves. When the host is alone, "Leave meeting" leaves right away.
- The host can close the menu without leaving. On desktop, click the button again, click outside the menu, or press Escape. On mobile, swipe the sheet down or tap outside it.

The button is disabled until the session is connected and while leaving.

Use `LeaveButton` when you want a separate leave control outside of `Toolbar`.

---

## Usage

```tsx
import { LeaveButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <LeaveButton />
</ZoomUIToolkitProvider>;
```

---

## Props

| Prop            | Type                                             | Default | Description                                                                                                                                                                                                                                                                 |
| --------------- | ------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`     | `string`                                         | —       | Additional CSS class for the default trigger button                                                                                                                                                                                                                         |
| `style`         | `CSSProperties`                                  | —       | Inline styles for the default trigger button                                                                                                                                                                                                                                |
| `fullWidth`     | `boolean`                                        | `false` | Stretches the default trigger button to fill its container                                                                                                                                                                                                                  |
| `isMobile`      | `boolean`                                        | `false` | Shows the host menu and the new-host picker in a mobile bottom sheet instead of the desktop menu. Not detected automatically                                                                                                                                                |
| `renderContent` | `(props: LeaveButtonRenderContent) => ReactNode` | —       | Custom trigger element. Receives `isHost`, `isBusy`, `isConnected`, `disabled`, and `onClick`                                                                                                                                                                               |
| `onClick`       | `() => void`                                     | —       | Called when the trigger is clicked. For the host, it is also called after "End meeting for all", "Assign and leave", or "Leave meeting" when the host is alone. It runs even if leaving fails; to confirm the session ended, check `sessionState.connectionState`           |
| `anchor`        | `{ getBoundingClientRect(): DOMRect } \| null`   | —       | Host menu only. Anchors the desktop menu to this element instead of the button. Pass an HTML element or any object with `getBoundingClientRect()`. Ignored on mobile                                                                                                        |
| `popoverProps`  | `LeaveButtonPopoverProps`                        | —       | Host menu only. Position of the desktop menu: `side` (default `'top'`), `align` (default `'start'`), `sideOffset` (default `10`), `alignOffset`, and `collisionPadding` (default `12`). The menu moves to the opposite side when there isn't enough room. Ignored on mobile |
| `menuClassName` | `string`                                         | —       | Host menu only. Additional CSS class for the desktop menu or the mobile sheet body                                                                                                                                                                                          |
| `menuStyle`     | `CSSProperties`                                  | —       | Host menu only. Inline styles for the desktop menu or the mobile sheet body                                                                                                                                                                                                 |

---

## Custom trigger with `renderContent`

The `renderContent` prop replaces the default button with your own element. Wire the provided `disabled` and `onClick` onto your element so the leave flow still works. For the host, the element you return must accept a ref and click events (a native `<button>` does) so it can open the menu:

```tsx
import { LeaveButton } from '@zoom/videosdk-ui-toolkit';

<LeaveButton
  renderContent={({ isHost, isBusy, disabled, onClick }) => (
    <button disabled={disabled} onClick={onClick}>
      {isBusy ? 'Leaving…' : isHost ? 'End' : 'Leave'}
    </button>
  )}
/>;
```

---

## Custom menu position

```tsx
import { LeaveButton } from '@zoom/videosdk-ui-toolkit';

<LeaveButton popoverProps={{ side: 'bottom', align: 'end', sideOffset: 6 }} />;
```

---

## Anchoring the host menu to a different element

```tsx
import { LeaveButton } from '@zoom/videosdk-ui-toolkit';

<LeaveButton anchor={toolbarRef.current} />;
```

The host menu will position relative to `toolbarRef.current` while the visible trigger button can be placed elsewhere.

---

## Styling the host menu

Use `menuClassName` and `menuStyle` to style the container that holds the host options. On desktop they apply to the menu; on mobile they apply to the sheet body below its title.

```tsx
import { LeaveButton } from '@zoom/videosdk-ui-toolkit';

<LeaveButton menuClassName='my-leave-menu' menuStyle={{ minWidth: 240 }} />;
```
