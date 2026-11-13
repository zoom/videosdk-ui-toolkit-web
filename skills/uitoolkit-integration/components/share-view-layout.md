# uitoolkit-integration › components › ShareViewLayout

Use this guide when using `ShareViewLayout`.

See [README.md](README.md) for all available components.
For the module-level wrapper, see [modules/share-viewer-view.md](../modules/share-viewer-view.md).
See [share-view-layout.json](../api/components/share-view-layout.json) for the machine-readable contract.

---

## Overview

`ShareViewLayout` arranges one or more participants' shared screens in a grid sized to the `width` and `height` you supply. `ShareViewerView` is built on it.

Use it when you own the active sharer list and measured container size. For zero-config share rendering, use `ShareViewerView`.

For normal receiving-share support, render this layout only when `activeShareUsersList.length > 0`. Do not reserve a large empty share container when nobody is sharing unless the user explicitly asks for a persistent idle share panel.

---

## Usage

`ShareViewLayout` requires explicit `width` and `height` to compute tile positions. Measure your container and pass the values down.

### Receiving share (remote sharers)

```tsx
import { ShareViewLayout, useZoomUIToolkit, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

function CustomShareView({ width, height }: { width: number; height: number }) {
  const { participantState } = useZoomUIToolkit();
  const sharers = participantState.activeShareUsersList;

  if (sharers.length === 0) return null;

  return <ShareViewLayout participants={sharers} width={width} height={height} />;
}

<ZoomUIToolkitProvider clientInstance={client}>
  <CustomShareView width={width} height={height} />
</ZoomUIToolkitProvider>;
```

`ShareViewLayout` renders its own `<video-player-container>` wrapper.

Shared screens are displayed only while the session is connected, up to the number of shared screens the device can render. Rows are centered, and each shared screen is scaled to fit its tile with a name tag showing the sharer's name (for example, "Alex's screen").

Tiles are never narrower than `minTileWidth`. If no arrangement fits the container at that width, the grid extends past the container and is clipped at its edges.

---

## Props

| Prop                   | Type            | Description                                                           |
| ---------------------- | --------------- | --------------------------------------------------------------------- |
| `participants`         | `Participant[]` | Participants who are currently sharing their screen, in display order |
| `width`                | `number`        | Layout container width in pixels                                      |
| `height`               | `number`        | Layout container height in pixels                                     |
| `minTileWidth`         | `number`        | Minimum tile width in pixels; defaults to `160`                       |
| `gap`                  | `number`        | Gap between tiles in pixels; defaults to `8`                          |
| `shareTileAspectRatio` | `number`        | Width-to-height ratio for each shared-screen tile; defaults to `16/9` |

For a single sharer's tile only, use `ShareTile`. See [share-tile.md](share-tile.md).

## `<video-player-container>` constraints

`ShareViewLayout` provides its own `<video-player-container>`. Keep the following in mind:

- Use it for **either** your own shared screen (sending) **or** other participants' shared screens (receiving) — do not pass both in the same `ShareViewLayout`.
- When showing your own shared screen, pass only **one** participant (the local user) in `participants`.
- Include each participant **at most once** in `participants`.
- Participant videos (`ParticipantTile`s) need a separate `<video-player-container>`, for example via `VideoLayout`.

---

## When to use ShareViewLayout vs ShareTile

- Use `ShareViewLayout` for an automatic grid of shared screens sized to your container.
- Use `ShareTile` when you need to render a specific sharer's tile in a fully custom position. See [share-tile.md](share-tile.md).
- Use `ShareViewerView` when you also want pagination and single/multi-share mode switching. See [modules/share-viewer-view.md](../modules/share-viewer-view.md).
