# uitoolkit-integration › modules › ParticipantView

Use this guide when using or customizing the `ParticipantView` module.

See the [integration overview](../SKILL.md) for architecture and layer selection.
For individual video tiles, see [components/README.md](../components/README.md).
For phones and small screens, see [mobile-participant-view.md](mobile-participant-view.md).
See [participant-view.json](../api/modules/participant-view.json) for the machine-readable contract.

---

## Overview

`ParticipantView` renders participants' video tiles in a paginated grid with previous and next buttons and a page indicator. It updates as participants join or leave — no props required.

Tiles form a centered grid that keeps `tileAspectRatio` and makes tiles as large as the container allows. Remote participants with video on appear before those with video off; when included, the local participant appears after the first remote participant, or first when alone. The order updates live, so participants can move between pages when someone turns their video on or off.

---

## Basic usage

```tsx
import { ParticipantView, Toolbar, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

function MeetingLayout() {
  return (
    <>
      <ParticipantView />
      <Toolbar />
    </>
  );
}

<ZoomUIToolkitProvider clientInstance={client}>
  <MeetingLayout />
</ZoomUIToolkitProvider>;
```

Use one initialized `ZoomUIToolkitProvider` per page. See [app.md](../app.md) for provider/client setup.

---

## Props

All props are optional. `ParticipantView` works zero-config inside `ZoomUIToolkitProvider`.

| Prop                  | Type                         | Default        | Description                                                                                                                                                               |
| --------------------- | ---------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`           | `string`                     | —              | Additional CSS class for the root container                                                                                                                               |
| `style`               | `CSSProperties`              | —              | Inline styles for the root container. `backgroundColor` and `color` also apply to every video tile (see Theming)                                                          |
| `isShowSelf`          | `boolean`                    | `true`         | Whether the local user appears in the grid                                                                                                                                |
| `pageSize`            | `number`                     | `4`            | Max tiles per page. Changing it returns to page 1                                                                                                                         |
| `tileAspectRatio`     | `number`                     | `16 / 9`       | Width/height ratio for each tile                                                                                                                                          |
| `paginationDirection` | `'horizontal' \| 'vertical'` | `'horizontal'` | `'horizontal'` shows left/right buttons on the sides; `'vertical'` shows up/down buttons at the top and bottom                                                            |
| `hidePagination`      | `boolean`                    | `false`        | Hides the previous/next buttons, so users can't change pages and participants on other pages aren't shown. The page indicator, for example `2 / 5`, still appears briefly |
| `hidden`              | `boolean`                    | `false`        | Hides the view with `display: none` while keeping it mounted                                                                                                              |

The `PaginationDirection` type isn't exported by name; pass `'horizontal'` or `'vertical'` directly.

---

## Pagination

- The previous button appears only when there is an earlier page; the next button appears only when there is a later page.
- The page indicator, for example `2 / 5`, appears briefly when the view first renders and whenever the page changes, including when there is only one page.
- The last page may repeat participants from the preceding page to fill the grid.
- Each page shows at most as many tiles as the device can render (one if it can't render multiple videos). If `pageSize` is larger, the remaining participants on that page aren't shown.

---

## Sizing and visibility

- The view fills its parent (100% width and height), so give the parent a size.
- Tiles use the `VideoLayout` default `minTileWidth` and are never narrower. If a full page doesn't fit the container at that width, the grid extends past the edges and is clipped. Use a smaller `pageSize` for small containers.
- The view is empty until the session is connected. It is also empty while reconnecting and after leaving.
- To hide the view without unmounting it, pass `hidden`. It applies `display: none`; pass `hidden={false}` to show it again.

---

## Theming

`backgroundColor` and `color` in the `style` prop are applied to the root element **and** to every tile.

```tsx
import { ParticipantView, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

// Dark background for all tiles
<ZoomUIToolkitProvider clientInstance={client}>
  <ParticipantView style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }} />
</ZoomUIToolkitProvider>;
```

While the session is connected, the grid area fills the view with its own background: your `backgroundColor` when set, otherwise the theme's background color. A background on a wrapper element doesn't show through. For a container background that differs from the tiles, build your own layout with `ParticipantTile`.

---

## Custom tile layout

If you need control over the grid or individual tiles, use `VideoLayout` (automatic grid) or `ParticipantTile` (single tile) from [components/README.md](../components/README.md):

```tsx
import { VideoLayout, ParticipantTile } from '@zoom/videosdk-ui-toolkit';

// Automatic grid — the same grid ParticipantView uses
<VideoLayout participants={participants} width={width} height={height} />;

// Manual layout — one tile per participant
// IMPORTANT: all ParticipantTiles must be rendered inside a single <video-player-container>
// element. VideoLayout provides this container; when using ParticipantTile directly you must
// add it yourself.
//
// A <video-player-container> for video can ONLY contain ParticipantTiles.
// Do NOT mix ParticipantTiles and ShareTiles in the same <video-player-container>.
// Shared screens need their own separate <video-player-container> (see ShareViewerView).
// In TypeScript, declare <video-player-container> first (see components/participant-tile.md).
<video-player-container style={{ width: '100%', height: '100%' }}>
  {participants.map((p) => (
    <ParticipantTile key={p.userId} participant={p} width={240} height={135} />
  ))}
</video-player-container>;
```

Use `ParticipantView` when the default grid is sufficient. Drop down to `VideoLayout` or `ParticipantTile` only when you need custom sizing, ordering, or spotlight logic.

---

## Current limitations

These are not exposed as props on `ParticipantView`:

- **Minimum tile width and gap** — use the `minTileWidth` and `gap` props of [VideoLayout](../components/video-layout.md) instead.
- **Custom name tag** — `ParticipantTile` accepts `customNameTag: ReactNode`, but `ParticipantView` can't pass one down to each tile.
- **Active highlight styling** — `ParticipantView` highlights the active video participant when the session has more than two participants, but you can't change how the highlight looks. `ParticipantTile` offers `isActive`, `activeClassName`, and `activeStyle` for this.
- **Hide page indicator** — no prop hides the page indicator. `hidePagination` only hides the previous/next buttons.

For any of these, use [VideoLayout](../components/video-layout.md) or [ParticipantTile](../components/participant-tile.md) directly.
