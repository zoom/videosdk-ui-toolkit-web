# uitoolkit-integration › components › ReclaimHostBanner

Use this guide when using `ReclaimHostBanner` or configuring the reclaim-host banner that the provider shows by default.

See [README.md](README.md) for all available components.
For provider setup, see [app.md](../app.md).
See [reclaim-host-banner.json](../api/components/reclaim-host-banner.json) for the machine-readable contract.

---

## Overview

`ReclaimHostBanner` prompts the original host to take the host role back after it has moved to another participant.

- It is shown only to the original host (the participant whose token has `role_type` 1), whenever another participant is host, whether or not the original host is currently a co-host.
- It shows the current host's name followed by "is currently host. Reclaiming host may disrupt current session experience.", with "Reclaim host" and "Stay participant" buttons. Co-hosts see "Stay manager" instead of "Stay participant". Either button dismisses the banner.
- It is hidden while the participant is already host or is in a breakout room. It does not dismiss automatically.
- Once dismissed, it stays hidden until the participant becomes host again and then loses the role.

---

## Default behavior

`ZoomUIToolkitProvider` already renders `ReclaimHostBanner`. Most apps do not need to render it directly.

```tsx
import { ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <YourVideoApp />
</ZoomUIToolkitProvider>;
```

To render your own instance instead, set `sessionOptions.session.disableReclaimHostBanner` to `true` so the banner doesn't appear twice:

```tsx
import { ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client} sessionOptions={{ session: { disableReclaimHostBanner: true } }}>
  <YourVideoApp />
</ZoomUIToolkitProvider>;
```

---

## Manual usage

```tsx
import { ReclaimHostBanner, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client} sessionOptions={{ session: { disableReclaimHostBanner: true } }}>
  <YourVideoApp />
  <ReclaimHostBanner />
</ZoomUIToolkitProvider>;
```

Render `ReclaimHostBanner` inside `ZoomUIToolkitProvider`.

---

## Props

| Prop              | Type            | Default | Description                            |
| ----------------- | --------------- | ------- | -------------------------------------- |
| `className`       | `string`        | —       | Additional CSS class for the banner    |
| `style`           | `CSSProperties` | —       | Inline styles for the banner           |
| `withOwnViewport` | `boolean`       | `true`  | Renders the area the banner appears in |

Keep the `withOwnViewport` default. With `false`, the banner appears only if another `ReclaimHostBanner` is mounted in the same `ZoomUIToolkitProvider`.
