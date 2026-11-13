# uitoolkit-integration › modules › MobileParticipantView

Use this guide when using or customizing the `MobileParticipantView` module — the touch-first participant view for phones and small screens.

See the [integration overview](../SKILL.md) for architecture and layer selection.
For the desktop grid, see [participant-view.md](participant-view.md).
See [mobile-participant-view.json](../api/modules/mobile-participant-view.json) for the machine-readable contract.

---

## Overview

`MobileParticipantView` renders participants as **swipeable pages** instead of the desktop grid with previous/next buttons. Users swipe to move between pages, and dot indicators show the current page.

Each page holds up to four participants in a fixed four-cell grid: two rows of two, or one row of four when the view is more than twice as wide as it is tall. Tiles stretch to fill their cells, and unused cells stay empty. Only the page in view plays video; neighboring pages show participant names until you swipe to them.

While a screen share is being received, the share appears as the **first page** and the view automatically swipes to it. When the share stops, the view swipes back to the participants.

It updates as participants join or leave and as a share starts or stops — no props required.

---

## Basic usage

```tsx
import { MobileParticipantView, Toolbar, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

function MobileMeetingLayout() {
  return (
    <>
      <MobileParticipantView style={{ width: '100%', height: '100%' }} />
      <Toolbar />
    </>
  );
}

<ZoomUIToolkitProvider clientInstance={client}>
  <MobileMeetingLayout />
</ZoomUIToolkitProvider>;
```

Use one initialized `ZoomUIToolkitProvider` per page. See [app.md](../app.md) for provider/client setup.

---

## Props

All props are optional. `MobileParticipantView` works zero-config inside `ZoomUIToolkitProvider`.

| Prop                  | Type                         | Default        | Description                                                                                                                   |
| --------------------- | ---------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `className`           | `string`                     | —              | Additional CSS class for the root container                                                                                   |
| `style`               | `CSSProperties`              | —              | Inline styles for the root container. `backgroundColor` and `color` also apply to every video tile (see Theming)              |
| `isShowSelf`          | `boolean`                    | `true`         | Whether the local user appears in the pages                                                                                   |
| `paginationDirection` | `'horizontal' \| 'vertical'` | `'horizontal'` | Swipe axis. `'horizontal'` = swipe left/right, dots along the bottom; `'vertical'` = swipe up/down, dots along the right edge |
| `hidePagination`      | `boolean`                    | `false`        | Hides the page dots. Swiping still works                                                                                      |
| `hidden`              | `boolean`                    | `false`        | Hides the view with `display: none` while keeping it mounted                                                                  |

Unlike the desktop `ParticipantView`, there is no `pageSize` or `tileAspectRatio` prop — page size and tile shape are fixed. The `PaginationDirection` type isn't exported by name; pass `'horizontal'` or `'vertical'` directly.

Page dots appear only when there are two or more pages, including the share page. Tapping a dot jumps to that page.

---

## Screen share behavior

When another participant shares their screen, `MobileParticipantView` shows the share as the **first page** and swipes to it automatically. When no received shares remain, the share page is removed and the view swipes back to the first participant page. You do not need to render `ShareViewerView` yourself.

- Only the single active share is shown; concurrent shares are not paginated on mobile.
- The share page has a banner reading "You are viewing <name>'s screen" with a "View Options" menu: "Fit to window" (the default) or "Original size". In original size, drag the shared screen to pan.

---

## Sizing and visibility

- The view fills its parent (100% width and height), so give the parent a size.
- The view is empty until the session is connected. It is also empty while reconnecting and after leaving.
- To hide the view without unmounting it, pass `hidden`. It applies `display: none`; pass `hidden={false}` to show it again.

---

## Theming

`backgroundColor` and `color` in the `style` prop are applied to the root element **and** to every tile.

```tsx
import { MobileParticipantView, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <MobileParticipantView style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }} />
</ZoomUIToolkitProvider>;
```

While the session is connected, each page fills the view with its own background: your `backgroundColor` when set, otherwise a default theme color. A background on a wrapper element doesn't show through. For a container background that differs from the tiles, build your own layout with `ParticipantTile`.

---

## When to use

Use `MobileParticipantView` for phone/small-screen layouts where swiping between pages feels more natural than the desktop grid. For larger screens, use [ParticipantView](participant-view.md). For custom layouts, drop down to `MobileVideoLayout`, `VideoLayout`, or `ParticipantTile` — see [components/README.md](../components/README.md).
