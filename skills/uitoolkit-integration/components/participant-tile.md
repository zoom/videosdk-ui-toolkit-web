# uitoolkit-integration › components › ParticipantTile

Use this guide when using `ParticipantTile`.

See [README.md](README.md) for all available components.
See [participant-tile.json](../api/components/participant-tile.json) for the machine-readable contract.

---

## Overview

`ParticipantTile` renders one participant's video with a name tag. When their video is off, or `renderVideo` is `false`, it shows their name instead. Use it when you need manual control over exactly where one participant tile is placed.

`VideoLayout` and `MobileVideoLayout` render tiles and provide the required `<video-player-container>` for you. When you render `ParticipantTile` yourself, you must add that container (see [Usage](#usage)).

---

## Props

| Prop              | Type            | Default                   | Required | Description                                                                                                                                                                                                         |
| ----------------- | --------------- | ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `participant`     | `Participant`   | —                         | Yes      | The participant to render                                                                                                                                                                                           |
| `width`           | `number`        | —                         | Yes      | Tile width in pixels. The name text scales with the tile width                                                                                                                                                      |
| `height`          | `number`        | —                         | Yes      | Fallback tile height in pixels, used only when `aspectRatio` is 0. Otherwise the height is `width` divided by `aspectRatio`                                                                                         |
| `aspectRatio`     | `number`        | `16/9`                    | No       | Width-to-height ratio. The tile height is `width / aspectRatio`                                                                                                                                                     |
| `videoQuality`    | `VideoQuality`  | `VideoQuality.Video_360P` | No       | Requested video quality for this participant (see below)                                                                                                                                                            |
| `renderVideo`     | `boolean`       | `true`                    | No       | When `false`, shows the video-off view instead of the participant's video                                                                                                                                           |
| `isActive`        | `boolean`       | —                         | No       | When `true`, highlights the tile                                                                                                                                                                                    |
| `activeClassName` | `string`        | —                         | No       | Class applied in place of the default highlight class when `isActive` is `true`                                                                                                                                     |
| `activeStyle`     | `CSSProperties` | —                         | No       | Inline styles added to the tile when `isActive` is `true`                                                                                                                                                           |
| `className`       | `string`        | —                         | No       | Additional CSS class for the tile                                                                                                                                                                                   |
| `style`           | `CSSProperties` | —                         | No       | Inline styles for the tile. The tile size comes from the props and overrides any width or height in `style`                                                                                                         |
| `customNameTag`   | `ReactNode`     | —                         | No       | Replaces the default name tag (the participant's name, with a phone icon for phone audio or a muted-microphone icon when muted, or, before the participant joins audio, a connecting indicator instead of the name) |

`Participant` is exported as a type: `import type { Participant } from '@zoom/videosdk-ui-toolkit'`.

### VideoQuality values

`VideoQuality` comes from the Zoom Video SDK:

```ts
import { VideoQuality } from '@zoom/videosdk';

VideoQuality.Video_90P; // 0 — 90p
VideoQuality.Video_180P; // 1 — 180p
VideoQuality.Video_360P; // 2 — 360p (default)
VideoQuality.Video_720P; // 3 — 720p
VideoQuality.Video_1080P; // 4 — 1080p
```

`VideoLayout` chooses quality automatically from the number and size of tiles — set `videoQuality` only when rendering `ParticipantTile` directly.

---

## Usage

> **Important:** `ParticipantTile` must be rendered inside a `<video-player-container>` element so the Zoom Video SDK can attach video. Use **one** `<video-player-container>` for all participant tiles — do not create one per tile.
>
> A `<video-player-container>` for video can **only** contain `ParticipantTile`s. Put `ShareTile`s in a separate container.

```tsx
import { ParticipantTile, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <video-player-container style={{ width: '100%', height: '100%' }}>
    <ParticipantTile participant={participant} width={320} height={180} />
  </video-player-container>
</ZoomUIToolkitProvider>;
```

### TypeScript declaration for `<video-player-container>`

Neither this package nor the Zoom Video SDK declares `<video-player-container>` as a JSX element. In a TypeScript project, add a declaration file such as `video-player-container.d.ts` so the examples type-check:

```ts
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'video-player-container': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
```

### Active speaker styling

```tsx
import { ParticipantTile } from '@zoom/videosdk-ui-toolkit';

// Default highlight
<ParticipantTile participant={p} width={240} height={135} isActive={isActiveSpeaker} />;

// Custom active style
<ParticipantTile
  participant={p}
  width={240}
  height={135}
  isActive={isActiveSpeaker}
  activeStyle={{ border: '2px solid #3b82f6', borderRadius: 8 }}
/>;
```

---

## Custom name tag

```tsx
import { ParticipantTile } from '@zoom/videosdk-ui-toolkit';

<ParticipantTile
  participant={p}
  width={240}
  height={135}
  customNameTag={
    <div className='my-name-tag'>
      {p.displayName} {p.muted && '(muted)'}
    </div>
  }
/>;
```

---

## Custom grid example

```tsx
import { ParticipantTile, type Participant } from '@zoom/videosdk-ui-toolkit';
import { VideoQuality } from '@zoom/videosdk';

function SpotlightLayout({ spotlight, others }: { spotlight: Participant; others: Participant[] }) {
  return (
    <video-player-container style={{ width: '100%', height: '100%' }}>
      <div className='spotlight-layout'>
        <div className='main'>
          <ParticipantTile participant={spotlight} width={960} height={540} videoQuality={VideoQuality.Video_720P} />
        </div>
        <div className='strip'>
          {others.map((p) => (
            <ParticipantTile key={p.userId} participant={p} width={160} height={90} />
          ))}
        </div>
      </div>
    </video-player-container>
  );
}
```

Render `SpotlightLayout` inside `ZoomUIToolkitProvider`.

For an automatic grid, use `VideoLayout` instead. See [video-layout.md](video-layout.md).
