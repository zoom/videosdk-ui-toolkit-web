# uitoolkit-integration › components › ShareTile

Use this guide when using `ShareTile`.

See [README.md](README.md) for all available components.
See [share-tile.json](../api/components/share-tile.json) for the machine-readable contract.

---

## Overview

`ShareTile` renders a single participant's shared screen at the size you specify. Use it when you need to position a sharer's tile explicitly within your own layout.

By default, the shared content is scaled to fit the tile, keeping its proportions, and centered. The default name tag shows the sharer's name, for example "Alex's screen".

`ShareViewLayout` provides the required `<video-player-container>` for you. When you render `ShareTile` yourself, you must add that container (see [Usage](#usage)).

---

## Usage

> **Important — `<video-player-container>` constraints:**
>
> - `ShareTile` must be rendered inside a `<video-player-container>` that is **separate** from the one used for participant videos. Do not mix `ShareTile`s and `ParticipantTile`s in the same container.
> - Use **one** `<video-player-container>` for all tiles showing other participants' shared screens. Do not create one per tile.
> - Keep your own shared screen (sending) and other participants' shared screens (receiving) in separate containers. A container for your own share holds only your tile.
> - Render each sharer at most once.

### Receiving share (remote sharers)

```tsx
import { ShareTile, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <video-player-container style={{ width: '100%', height: '100%' }}>
    <ShareTile participant={sharer} width={640} height={360} />
  </video-player-container>
</ZoomUIToolkitProvider>;
```

`ShareTile` renders nothing when `participant` is `null` or is not sharing.

In TypeScript, declare the `<video-player-container>` element before using it in JSX. See [TypeScript declaration for `<video-player-container>`](participant-tile.md#typescript-declaration-for-video-player-container).

---

## Props

| Prop                      | Type                  | Description                                                                                                                                                                                              |
| ------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `participant`             | `Participant \| null` | Sharing participant to render                                                                                                                                                                            |
| `width`                   | `number`              | Tile width in pixels                                                                                                                                                                                     |
| `height`                  | `number`              | Tile height in pixels. Shared content is scaled to fit within `width` × `height`                                                                                                                         |
| `aspectRatio`             | `number`              | Width-to-height ratio used for the shared-content area until the shared screen's size is known; defaults to `16/9`. The tile uses `width` and `height`                                                   |
| `className`               | `string`              | Additional CSS class for the tile                                                                                                                                                                        |
| `style`                   | `CSSProperties`       | Inline styles for the tile. The tile size comes from the size props (or the shared content with `fitToContent`) and overrides any width or height in `style`. The background color is always transparent |
| `customNameTag`           | `ReactNode`           | Replaces the default name tag (for example, "Alex's screen")                                                                                                                                             |
| `fitToContent`            | `boolean`             | Sizes the tile to the displayed shared content instead of `width` and `height`; defaults to `false`                                                                                                      |
| `showContentOriginalSize` | `boolean`             | Shows shared content at its original size instead of fitting it to the tile; defaults to `false`. Unless `fitToContent` is also `true`, larger content is cropped                                        |

For automatic share layout, use `ShareViewLayout` instead. See [share-view-layout.md](share-view-layout.md).
