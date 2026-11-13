# uitoolkit-integration › components › VideoLayout

Use this guide when using `VideoLayout`.

See [README.md](README.md) for all available components.
For the zero-config module-level wrapper, see [modules/participant-view.md](../modules/participant-view.md).
See [video-layout.json](../api/components/video-layout.json) for the machine-readable contract.

---

## Overview

`VideoLayout` arranges participant videos in an evenly sized grid. `ParticipantView` is built on it.

Use it when you already have a measured container and a participant list, and you want control over sizing, pagination, or which participants are shown.

---

## Usage

`VideoLayout` requires explicit `width` and `height` to compute tile positions. Measure your container and pass the values down.

```tsx
import { VideoLayout, useZoomUIToolkit, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

function CustomVideoGrid({ width, height }: { width: number; height: number }) {
  const { participantState } = useZoomUIToolkit();

  return <VideoLayout participants={participantState.participants} width={width} height={height} />;
}

<ZoomUIToolkitProvider clientInstance={client}>
  <CustomVideoGrid width={width} height={height} />
</ZoomUIToolkitProvider>;
```

`VideoLayout` renders its own `<video-player-container>` wrapper. Do not wrap it in another `video-player-container`.

Tiles are displayed only while the session is connected. The layout shows participants in the order you pass them, up to the number of videos the device can render. If the device can't render multiple videos, only the first participant is shown. Rows are centered, including a partly filled last row, and video quality is chosen automatically from the number and size of tiles.

The layout picks the row and column count that gives the largest tiles at least `minTileWidth` wide. If no arrangement fits, tiles are still `minTileWidth` wide, so the grid extends past the container and is clipped at its edges. Pass fewer participants or a smaller `minTileWidth` for small containers.

---

## Props

| Prop                   | Type            | Description                                                                                                 |
| ---------------------- | --------------- | ----------------------------------------------------------------------------------------------------------- |
| `participants`         | `Participant[]` | Participants to render, in order                                                                            |
| `width`                | `number`        | Layout container width in pixels                                                                            |
| `height`               | `number`        | Layout container height in pixels                                                                           |
| `minTileWidth`         | `number`        | Minimum tile width in pixels; tiles are never narrower. Defaults to `160`                                   |
| `gap`                  | `number`        | Gap between tiles in pixels; defaults to `8`                                                                |
| `videoTileAspectRatio` | `number`        | Tile width-to-height ratio; defaults to `16/9`                                                              |
| `activeSpeakerBorder`  | `boolean`       | Highlights the active video participant when the session has more than two participants; defaults to `true` |

---

## When to use VideoLayout vs ParticipantView

- Use `ParticipantView` for a zero-config participant grid with built-in pagination and resize measurement.
- Use `VideoLayout` when you own the participant list and measured `width`/`height`.
- Use `MobileVideoLayout` for a fixed grid of up to four participants on small screens. See [mobile-video-layout.json](../api/components/mobile-video-layout.json).
- Use `ParticipantTile` when you need to position a single participant tile yourself. See [participant-tile.md](participant-tile.md).
