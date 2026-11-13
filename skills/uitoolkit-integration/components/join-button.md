# uitoolkit-integration › components › JoinButton

Use this guide when using `JoinButton`.

See [README.md](README.md) for all available components.
For SDK client setup and programmatic join/leave control, see [app.md](../app.md).
See [join-button.json](../api/components/join-button.json) for the machine-readable contract.

---

## Overview

`JoinButton` renders a ready-made join button. It uses the SDK client from `ZoomUIToolkitProvider` to join the session with the credentials you pass, and shows a connecting state while the join is in progress.

`JoinButton` does not render a leave state. Pair it with `LeaveButton` or `ZoomUIToolkitApp` after the session connects.

| State          | Label             |
| -------------- | ----------------- |
| Ready          | `"Join session"`  |
| Join in flight | `"Connecting..."` |

---

## Usage

```tsx
import { JoinButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

// `token` is a Video SDK JWT generated on your server for this session.
<ZoomUIToolkitProvider clientInstance={client}>
  <JoinButton
    joinParameters={{
      topic: 'my-session',
      token,
      userName: 'Alice',
    }}
  />
</ZoomUIToolkitProvider>;
```

The button is disabled until the provider has a `clientInstance`, while `topic` or `userName` is empty, and while a join is in progress.

If joining fails, the error message is available as `sessionState.errorMessage` from `useZoomUIToolkit()`.

---

## Props

| Prop             | Type                | Default | Description                               |
| ---------------- | ------------------- | ------- | ----------------------------------------- |
| `joinParameters` | `JoinSessionParams` | —       | Required. Session credentials and options |
| `className`      | `string`            | —       | Additional CSS class for the button       |
| `style`          | `CSSProperties`     | —       | Inline styles for the button              |
| `fullWidth`      | `boolean`           | `false` | Expands the button to full width          |

`JoinSessionParams`:

| Field                    | Type     | Description                                                                                                                |
| ------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `topic`                  | `string` | Video SDK session topic. Must match the topic in the token                                                                 |
| `token`                  | `string` | Video SDK JWT generated on your server for this session                                                                    |
| `userName`               | `string` | Display name for the local user                                                                                            |
| `sessionPassword`        | `string` | Optional session password, if the session requires one                                                                     |
| `sessionIdleTimeoutMins` | `number` | Optional. Minutes the session can stay idle with one participant before it ends. Applies only to the host or original host |

---

## When to use JoinButton vs custom join

- Use `JoinButton` when you want a ready-made button with built-in styling and a connecting state.
- Use `useZoomUIToolkit().client.join(...)` when a custom form or external trigger owns the join flow. See [app.md](../app.md).
