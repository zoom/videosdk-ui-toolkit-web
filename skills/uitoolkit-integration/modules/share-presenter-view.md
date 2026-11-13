# uitoolkit-integration › modules › SharePresenterView

Use this guide when using or customizing the `SharePresenterView` module.

See the [integration overview](../SKILL.md) for architecture and layer selection.
For individual share tiles, see [components/README.md](../components/README.md).
See [share-presenter-view.json](../api/modules/share-presenter-view.json) for the machine-readable contract.

---

## Overview

`SharePresenterView` renders a **preview of the local user's own shared screen** — what _you_ are presenting. The preview is scaled to fit the container while keeping the shared content's aspect ratio, and has no name label. When you are not sharing, the view shows an empty area.

This is the **send-side** counterpart to `ShareViewerView`:

| Module               | Renders                                        |
| -------------------- | ---------------------------------------------- |
| `SharePresenterView` | The **local** user's own share (self-preview)  |
| `ShareViewerView`    | **Another** participant's share (receive-side) |

Start the share with [`ShareButton`](../components/share-button.md) (stop it from its floating bar) or `useShareController`; `SharePresenterView` only displays the result.

---

## Basic usage

```tsx
import { ZoomUIToolkitProvider, SharePresenterView, ShareButton } from '@zoom/videosdk-ui-toolkit';

function App() {
  return (
    <ZoomUIToolkitProvider clientInstance={client}>
      <div className='layout'>
        <SharePresenterView style={{ width: '100%', height: '600px' }} />
        <ShareButton />
      </div>
    </ZoomUIToolkitProvider>
  );
}
```

> **Sizing:** The view fills its parent (100% width and height). Give it an explicit width and height (via `style` or `className`) or place it in a sized parent.

---

## Props

All props are optional. `SharePresenterView` works zero-config inside `ZoomUIToolkitProvider`.

| Prop        | Type            | Default | Description                                                                           |
| ----------- | --------------- | ------- | ------------------------------------------------------------------------------------- |
| `className` | `string`        | —       | Additional CSS class for the root container                                           |
| `style`     | `CSSProperties` | —       | Inline styles for the root container. Set a width and height here, or size the parent |
| `hidden`    | `boolean`       | `false` | Hides the view with `display: none` while keeping it mounted                          |

---

## Visibility

- The view is empty until the session is connected and while you aren't sharing, so it is safe to keep rendered.
- To hide the view without unmounting it, pass `hidden`. It applies `display: none`; pass `hidden={false}` to show it again.

---

## Related

- [components › ShareButton](../components/share-button.md) — start the local share; while you share, it shows a draggable floating sharing bar.
- [modules › ShareViewerView](share-viewer-view.md) — render another participant's share.
