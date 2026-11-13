# uitoolkit-integration › modules › ShareViewerView

Use this guide when using or customizing the `ShareViewerView` module.

See the [integration overview](../SKILL.md) for architecture and layer selection.
For individual share tiles, see [components/README.md](../components/README.md).
See [share-viewer-view.json](../api/modules/share-viewer-view.json) for the machine-readable contract.

---

## Overview

`ShareViewerView` displays screen shares received from other participants. By default it shows the active share (`participantState.activeShareUser` from `useZoomUIToolkit`); pass `isMultiShareRender` to show all received shares (`participantState.activeShareUsersList`) in a paginated grid.

When there is no share to show, the view displays `"No active screen share"`. For normal meeting layouts, do not show that idle placeholder by default. Render `ShareViewerView` only while a share is being received (`shareState.isReceivingShare` from `useZoomUIToolkit`), or pass `hidden={!shareState.isReceivingShare}` when the surrounding layout should keep the component mounted but hide the share area entirely.

---

## Basic usage

```tsx
import {
  ParticipantView,
  ShareViewerView,
  Toolbar,
  useZoomUIToolkit,
  ZoomUIToolkitProvider,
} from '@zoom/videosdk-ui-toolkit';

function MeetingLayout() {
  const { shareState } = useZoomUIToolkit();

  return (
    <div className='layout'>
      {shareState.isReceivingShare && <ShareViewerView />}
      <ParticipantView />
      <Toolbar />
    </div>
  );
}

function App() {
  return (
    <ZoomUIToolkitProvider clientInstance={client}>
      <MeetingLayout />
    </ZoomUIToolkitProvider>
  );
}
```

> **Sizing:** The view fills its parent (100% width and height). Give it an explicit width and height (via `style` or `className`) or place it in a sized parent.

```tsx
import { ShareViewerView } from '@zoom/videosdk-ui-toolkit';

// Recommended: explicit size via style
<ShareViewerView style={{ width: '100%', height: '600px' }} />;
```

---

## Single vs. multi-share mode

By default (`isMultiShareRender=false`), only the active share is shown. This is the standard single-sharer experience: a banner reads "You are viewing <name>'s screen" and has a "View Options" menu with "Fit to window" (the default) and "Original size". In original size, larger content can be dragged to pan. The view returns to "Fit to window" whenever a different participant becomes the active sharer. In this mode, the shared screen isn't displayed while the local user is sharing their own screen.

Set `isMultiShareRender={true}` to show all received shares at once in a paginated grid, with each sharer labeled by name. More than one share appears only when the session allows multiple participants to share at the same time.

```tsx
import { ShareViewerView } from '@zoom/videosdk-ui-toolkit';

// Default — single active sharer only
<ShareViewerView />;

// Multi-share — all sharers in a paginated grid
<ShareViewerView isMultiShareRender pageSize={2} />;
```

---

## Pagination

Pagination only applies when `isMultiShareRender={true}`:

- The previous button appears only when there is an earlier page; the next button appears only when there is a later page.
- A page number, for example `2 / 3`, appears briefly when the view first renders and each time the page changes.
- `hidePagination` hides the previous and next buttons, so users can't change pages and shares on other pages aren't shown. The page number still appears briefly.
- `paginationDirection="vertical"` switches to up/down buttons at the top and bottom.
- The last page shows the final `pageSize` shares, so it can repeat shares from the previous page.
- Each page shows at most as many shared screens as the device can render. If `pageSize` is larger, the remaining shares on that page aren't shown.

```tsx
import { ShareViewerView } from '@zoom/videosdk-ui-toolkit';

<ShareViewerView isMultiShareRender pageSize={2} paginationDirection='vertical' />;
```

---

## Custom share view

If you need to control the share layout, use `ShareViewLayout` (automatic grid) or `ShareTile` (single tile) from [components/README.md](../components/README.md):

```tsx
import { ShareViewLayout, ShareTile } from '@zoom/videosdk-ui-toolkit';

// Automatic grid — the same grid ShareViewerView uses in multi-share mode
<ShareViewLayout participants={sharers} width={width} height={height} />;

// Manual layout — one tile per sharer
// IMPORTANT: all ShareTiles must be rendered inside a single <video-player-container>
// element. ShareViewLayout provides this container; when using ShareTile directly you must
// add it yourself.
//
// A <video-player-container> for share can ONLY contain ShareTiles.
// Do NOT mix ShareTiles and ParticipantTiles in the same <video-player-container>.
// Participant videos need their own separate <video-player-container> (see ParticipantView).
// In TypeScript, declare <video-player-container> first (see components/participant-tile.md).
<video-player-container style={{ width: '100%', height: '100%' }}>
  {sharers.map((p) => (
    <ShareTile key={p.userId} participant={p} width={640} height={360} />
  ))}
</video-player-container>;
```

Use `ShareViewerView` when the default layout is sufficient. Drop down to `ShareViewLayout` or `ShareTile` only when you need custom sizing, ordering, or a combined share + participant layout.

---

## Props

All props are optional. `ShareViewerView` works zero-config inside `ZoomUIToolkitProvider`.

| Prop                  | Type                         | Default        | Description                                                                                                                                                                                              |
| --------------------- | ---------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`           | `string`                     | —              | Additional CSS class for the root container                                                                                                                                                              |
| `style`               | `CSSProperties`              | —              | Inline styles for the root container. `backgroundColor` also fills the area behind shared screens; `color` also applies to sharer name labels in multi-share mode, the page buttons, and the page number |
| `hidden`              | `boolean`                    | `false`        | Hides the view while keeping it mounted                                                                                                                                                                  |
| `isMultiShareRender`  | `boolean`                    | `false`        | Shows all received shares in a paginated grid instead of only the active share                                                                                                                           |
| `pageSize`            | `number`                     | `4`            | Max shared screens per page in multi-share mode. Changing it returns to page 1                                                                                                                           |
| `tileAspectRatio`     | `number`                     | `16 / 9`       | Width/height ratio for each shared-screen tile in multi-share mode                                                                                                                                       |
| `paginationDirection` | `'horizontal' \| 'vertical'` | `'horizontal'` | `'horizontal'` for left/right buttons, `'vertical'` for up/down buttons (multi-share mode)                                                                                                               |
| `hidePagination`      | `boolean`                    | `false`        | Hides the previous/next buttons in multi-share mode, so users can't change pages. The page number, for example `2 / 3`, still appears briefly                                                            |

The `PaginationDirection` type isn't exported by name; pass `'horizontal'` or `'vertical'` directly.

---

## Visibility

- The view is empty until the session is connected.
- To hide the view without unmounting it, pass `hidden`. Pass `hidden={false}` to show it again.

---

## Current limitations

These are not exposed as props on `ShareViewerView`:

- **Minimum tile width and gap** — use the `minTileWidth` and `gap` props of [ShareViewLayout](../components/share-view-layout.md) instead.
- **Hide page number** — in multi-share mode, no prop hides the page number. `hidePagination` only hides the previous/next buttons.

For any of these, use [ShareViewLayout](../components/share-view-layout.md) or [ShareTile](../components/share-tile.md) directly.
