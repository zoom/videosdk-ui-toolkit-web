# uitoolkit-integration › modules › ActiveSpeakerView

Use this guide when using or customizing the `ActiveSpeakerView` module.

See the [integration overview](../SKILL.md) for architecture and layer selection.
For individual video tiles, see [components/README.md](../components/README.md).
See [active-speaker-view.json](../api/modules/active-speaker-view.json) for the machine-readable contract.

---

## Overview

`ActiveSpeakerView` renders a single, large video tile for `participantState.activeVideoUser` from `useZoomUIToolkit` — the participant whose video most recently became active or inactive, as reported by the Video SDK. The tile switches automatically when that participant changes. The view is empty until that participant is set or while the session isn't connected.

The tile is centered and keeps `tileAspectRatio`. When the participant's video is off, the tile shows their name.

Use it for a single-participant focus layout rather than a grid. For the full participant grid, use [ParticipantView](participant-view.md).

---

## Basic usage

```tsx
import { ActiveSpeakerView, Toolbar, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

function MeetingLayout() {
  return (
    <>
      <ActiveSpeakerView />
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

All props are optional. `ActiveSpeakerView` works zero-config inside `ZoomUIToolkitProvider`.

| Prop              | Type            | Default  | Description                                                                                                    |
| ----------------- | --------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `className`       | `string`        | —        | Additional CSS class for the root container                                                                    |
| `style`           | `CSSProperties` | —        | Inline styles for the root container. `backgroundColor` and `color` also apply to the video tile (see Theming) |
| `tileAspectRatio` | `number`        | `16 / 9` | Width/height ratio for the tile                                                                                |
| `hidden`          | `boolean`       | `false`  | Hides the view with `display: none` while keeping it mounted                                                   |

---

## Sizing and visibility

- The view fills its parent (100% width and height), so give the parent a size.
- To hide the view without unmounting it, pass `hidden`. It applies `display: none`; pass `hidden={false}` to show it again.

```tsx
import { ActiveSpeakerView } from '@zoom/videosdk-ui-toolkit';

<ActiveSpeakerView hidden={!isSpeakerView} />;
```

---

## Theming

`backgroundColor` and `color` in the `style` prop are applied to the root element **and** to the video tile.

```tsx
import { ActiveSpeakerView, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

// Dark background for the view and its tile
<ZoomUIToolkitProvider clientInstance={client}>
  <ActiveSpeakerView style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }} />
</ZoomUIToolkitProvider>;
```

While the session is connected, the area around the tile fills the view with its own background: your `backgroundColor` when set, otherwise the theme's background color. A background on a wrapper element doesn't show through. For a container background that differs from the tile, build your own layout with `ParticipantTile` (see Custom tile layout).

---

## Focus view + grid

A common layout pairs the large `ActiveSpeakerView` tile with the participant grid — for example, `ActiveSpeakerView` as the main stage and `ParticipantView` as a filmstrip alongside it:

```tsx
import { ActiveSpeakerView, ParticipantView } from '@zoom/videosdk-ui-toolkit';

<div style={{ display: 'flex', height: '100%' }}>
  <ActiveSpeakerView style={{ flex: 1 }} />
  <ParticipantView paginationDirection='vertical' style={{ width: 240 }} />
</div>;
```

---

## Custom tile layout

If you need control over the tile itself, use [`ParticipantTile`](../components/participant-tile.md) with the participant from `participantState.activeVideoUser`:

```tsx
import { ParticipantTile, useZoomUIToolkit } from '@zoom/videosdk-ui-toolkit';

function CustomActiveVideoTile() {
  const { participantState } = useZoomUIToolkit();
  const user = participantState.activeVideoUser;
  if (!user) return null;

  // IMPORTANT: a ParticipantTile used on its own must be rendered inside a
  // <video-player-container> element. In TypeScript, declare that element first
  // (see components/participant-tile.md).
  return (
    <video-player-container style={{ width: '100%', height: '100%' }}>
      <ParticipantTile participant={user} width={960} height={540} />
    </video-player-container>
  );
}
```

Use `ActiveSpeakerView` when the default tile is sufficient. Drop down to `ParticipantTile` only when you need custom sizing, ordering, or your own rule for which participant to show.

---

## Current limitations

These are not exposed as props on `ActiveSpeakerView`:

- **Minimum tile width and gap** — use the `minTileWidth` and `gap` props of [VideoLayout](../components/video-layout.md) instead.
- **Active highlight** — the tile is never highlighted as active.
- **Custom name tag** — there is no way to pass a custom name tag down to the tile.

For any of these, use [VideoLayout](../components/video-layout.md) or [ParticipantTile](../components/participant-tile.md) directly.
