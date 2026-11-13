# uitoolkit-integration › app

Use this guide for anything related to `ZoomUIToolkitProvider`, `ZoomUIToolkitApp`, `ZoomUIToolkitRoot`, SDK client setup, and session lifecycle.

See the [integration overview](SKILL.md) for architecture and layer selection.

---

## ZoomUIToolkitProvider

Every built-in component must be rendered inside `<ZoomUIToolkitProvider>`. Mount **one provider per page**: every component on the page reads the same session state, so independent sessions on the same page are not supported.

`clientInstance` is required. Create and initialize a Zoom Video SDK client in the app, then pass it to the provider. Pass `null` until the client exists; the built-in components stay inactive until then. Keep the same client instance while a session is open — replacing it or switching it to `null` mid-session is not supported. After the session closes, you can destroy it with `ZoomVideo.destroyClient()` and pass a new one. Unmounting the provider does not leave the session or destroy the client; do both yourself.

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import ZoomVideo from '@zoom/videosdk';
import { ConnectionState, useZoomUIToolkit, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';
import type { ZoomUIToolkitProviderProps } from '@zoom/videosdk-ui-toolkit';

type ZoomClient = NonNullable<ZoomUIToolkitProviderProps['clientInstance']>;
type ZoomLocalAudioTrack = NonNullable<ZoomUIToolkitProviderProps['localAudioTrack']>;

export function App() {
  const [client, setClient] = useState<ZoomClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<ZoomLocalAudioTrack | null>(null);
  const { sessionState } = useZoomUIToolkit();
  const { connectionState } = sessionState;
  const hasConnectedRef = useRef(false);

  const initClient = useCallback(async () => {
    try {
      const zoomClient = ZoomVideo.createClient() as unknown as ZoomClient;
      await zoomClient.init('en-US', 'Global', {
        webEndpoint: 'zoom.us',
        enforceMultipleVideos: true,
      });
      const audioTrack = ZoomVideo.createLocalAudioTrack() as unknown as ZoomLocalAudioTrack;
      setLocalAudioTrack(audioTrack);
      // Set client to the state to be used by the provider after initialization.
      setClient(zoomClient);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    void initClient();
  }, [initClient]);

  useEffect(() => {
    if (connectionState === ConnectionState.Connected) {
      hasConnectedRef.current = true;
    } else if (connectionState === ConnectionState.Closed && hasConnectedRef.current) {
      hasConnectedRef.current = false;
      void (async () => {
        // setClient(null) must come before destroyClient() so the UI immediately disables
        // client-dependent controls (e.g. JoinButton). destroyClient() is async — if it runs
        // first, the client reference stays valid long enough for a join() call to slip through.
        setClient(null);
        setLocalAudioTrack(null);
        await ZoomVideo.destroyClient();
        await initClient();
      })();
    }
  }, [connectionState, initClient]);

  return (
    <ZoomUIToolkitProvider clientInstance={client} theme='dark' localAudioTrack={localAudioTrack ?? undefined}>
      <YourVideoApp />
    </ZoomUIToolkitProvider>
  );
}
```

Provider props:

| Prop              | Type                         | Description                                                                                                                         |
| ----------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `clientInstance`  | `typeof VideoClient \| null` | Required. Client created with `ZoomVideo.createClient()` and initialized by you                                                     |
| `children`        | `ReactNode`                  | Required. Your app content and the built-in components                                                                              |
| `theme`           | `ToolkitTheme`               | `'dark'` or `'light'`; defaults to `'dark'`                                                                                         |
| `baseZIndex`      | `number`                     | Stacking order of `ZoomUIToolkitApp` and `ZoomUIToolkitRoot`, and the starting value for panels, menus, and dialogs; default `1000` |
| `sessionOptions`  | `SessionOptions`             | Audio, video, recording consent, and reclaim-host banner settings; default `{}`                                                     |
| `localAudioTrack` | `LocalAudioTrack`            | Track from `ZoomVideo.createLocalAudioTrack()`; enables the "Test microphone" and "Test speaker" controls in audio settings         |

`VideoClient` and `LocalAudioTrack` are Video SDK types; import them from `@zoom/videosdk`.

Pass `sessionOptions` to set audio and virtual background defaults and to turn off built-in dialogs. For every `SessionOptions` field, see [zoom-ui-toolkit-provider.json](api/components/zoom-ui-toolkit-provider.json).

```tsx
import { ZoomUIToolkitProvider, type SessionOptions } from '@zoom/videosdk-ui-toolkit';

// Define the options once, outside your component, or memoize them.
const sessionOptions: SessionOptions = {
  audio: { noiseSuppression: true },
  video: {
    virtualBackground: {
      virtualBackgroundImageList: [{ id: 'office', name: 'Office', url: '/backgrounds/office.jpg' }],
      defaultVirtualBackgroundImageId: 'blur',
    },
  },
  session: { disableReclaimHostBanner: true },
};

<ZoomUIToolkitProvider clientInstance={client} sessionOptions={sessionOptions}>
  <YourVideoApp />
</ZoomUIToolkitProvider>;
```

The provider applies `defaultVirtualBackgroundImageId` again whenever the connection state changes, including when the session connects, and whenever it receives a new `sessionOptions` object. Either one replaces a background the user picked in Settings. Pass a stable object so a re-render doesn't reset it.

When you build your own layout, render the components inside the provider. They use its theme automatically:

```tsx
import { AudioButton, VideoButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client} theme='light'>
  <AudioButton />
  <VideoButton />
</ZoomUIToolkitProvider>;
```

Optionally use `ZoomUIToolkitRoot` to group components in one stacking context using the provider's `baseZIndex`:

```tsx
import { AudioButton, VideoButton, ZoomUIToolkitProvider, ZoomUIToolkitRoot } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client} theme='light' baseZIndex={1000}>
  <ZoomUIToolkitRoot>
    <AudioButton />
    <VideoButton />
  </ZoomUIToolkitRoot>
</ZoomUIToolkitProvider>;
```

`ZoomUIToolkitApp` already forms the same stacking layer, so don't wrap it in `ZoomUIToolkitRoot`. Menus, panels, dialogs, and bottom sheets still open above the page, outside the App or Root container.

For example, `baseZIndex={2000}` places the App/Root group at `2000`; the panels, menus, dialogs, bottom sheets, and reclaim-host banner that the built-in components open above the page use values from `2001` up to `2007`. Pop-up notifications are not affected.

The provider also shows these surfaces for you:

- Pop-up notifications: "Microphone access is required." or "Camera access is required." when access is blocked, a notice titled by the problem (for example "Camera connection failed") for media problems that can't be recovered automatically, with a Refresh button when refreshing the browser fixes it, a notice when your screen share is stopped because the host changed sharing privileges, and errors from the built-in controls and controller hooks.
- The reclaim-host banner for the original host. Turn it off with `sessionOptions.session.disableReclaimHostBanner`, for example when you render `ReclaimHostBanner` yourself.
- Recording consent dialogs ("This session is being recorded" and "Allow individual cloud recording?"). Turn them off with `sessionOptions.recording.disableRecordingConsentDialog`.

`AudioButton`, not the provider, shows the dialog when the host asks you to unmute. Turn it off with `sessionOptions.audio.disableUnmuteConsentDialog`. Built-in text is shown in English.

---

## New Vite app checklist

When you start a new Vite and React app:

- Import `@zoom/videosdk-ui-toolkit/style.css` once, usually in `main.tsx` or `App.tsx`.
- Create and initialize the Video SDK client in your outer app component, and pass it to `ZoomUIToolkitProvider` as `clientInstance` (see [ZoomUIToolkitProvider](#zoomuitoolkitprovider)).
- Serve the app with the `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` response headers. They make the page cross-origin isolated, so the Video SDK can use `SharedArrayBuffer` for the best video performance. In Vite, set them in `server.headers` and `preview.headers`, and set them on your production server too.
- Put components that use the provider's client or render built-in controls inside the provider. Components that only read state with `useZoomUIToolkit`, such as a `sessionState` watcher, may sit above it.
- Get the Video SDK JWT from your server (see [Video SDK JWT token](#video-sdk-jwt-token)). Validate `topic`, `token`, and `userName` before you enable the join action. `JoinButton` stays disabled until the provider has a client, while `topic` or `userName` is empty, and while a join is in progress; it does not check the token.

Inside the provider, gate `JoinButton` with your own credential check:

```tsx
import {
  ConnectionState,
  JoinButton,
  useZoomUIToolkit,
  ZoomUIToolkitApp,
  ZoomUIToolkitProvider,
} from '@zoom/videosdk-ui-toolkit';

interface MeetingExperienceProps {
  topic: string;
  token: string;
  userName: string;
  sessionPassword: string;
}

function MeetingExperience({ topic, token, userName, sessionPassword }: MeetingExperienceProps) {
  const { sessionState } = useZoomUIToolkit();
  const { connectionState } = sessionState;
  // Keep the app mounted while reconnecting; it shows its own "Joining the session..." state.
  const isInSession = connectionState === ConnectionState.Connected || connectionState === ConnectionState.Reconnecting;
  const canJoin = Boolean(topic.trim() && token.trim() && userName.trim());

  if (isInSession) {
    return <ZoomUIToolkitApp height='100vh' />;
  }

  return canJoin ? (
    <JoinButton
      fullWidth
      joinParameters={{
        topic: topic.trim(),
        token: token.trim(),
        userName: userName.trim(),
        sessionPassword: sessionPassword.trim() || undefined,
      }}
    />
  ) : (
    <button type='button' disabled>
      Join session
    </button>
  );
}

<ZoomUIToolkitProvider clientInstance={client}>
  <MeetingExperience topic={topic} token={token} userName={userName} sessionPassword={sessionPassword} />
</ZoomUIToolkitProvider>;
```

---

## ZoomUIToolkitApp — pre-built in-session UI (Layer 1)

`ZoomUIToolkitApp` renders the complete session screen: a top bar, participant videos, received screen shares, on desktop a preview of your own screen share, and a toolbar. It shows "Joining the session..." while `JoinButton` is joining or while the connection is being restored. Before joining, after leaving, or if joining fails, it renders an empty container, so read `sessionState` to show your own messages.

On desktop, the top bar has the session info button, the recording status, and a Gallery/Speaker view menu. On phones and tablets the app switches to a mobile layout: swipeable participant pages, a toolbar with Audio, Video, Participants, Chat, and Settings, and Leave in the top bar. Customize the toolbar with `toolbarProps`; setting `toolbarProps.visibleButtons` replaces the mobile default. Full contract: [zoom-ui-toolkit-app.json](api/components/zoom-ui-toolkit-app.json).

It **does not** accept session credentials and **does not** join the session by itself. Pair it with `JoinButton` or a custom `client.join(...)` flow.

```tsx
import {
  ConnectionState,
  JoinButton,
  useZoomUIToolkit,
  ZoomUIToolkitApp,
  ZoomUIToolkitProvider,
} from '@zoom/videosdk-ui-toolkit';

function MeetingExperience({ topic, token, userName }: { topic: string; token: string; userName: string }) {
  const { sessionState } = useZoomUIToolkit();
  const { connectionState } = sessionState;
  const isInSession = connectionState === ConnectionState.Connected || connectionState === ConnectionState.Reconnecting;

  return (
    <>
      {!isInSession && (
        <JoinButton
          joinParameters={{
            topic,
            token,
            userName,
          }}
        />
      )}
      {isInSession && <ZoomUIToolkitApp height='100vh' />}
    </>
  );
}

<ZoomUIToolkitProvider clientInstance={client}>
  <MeetingExperience topic={topic} token={token} userName={userName} />
</ZoomUIToolkitProvider>;
```

Use `ZoomUIToolkitApp` when you want the full video call UI after joining. If you need control over layout or individual controls, compose [modules](modules/README.md) or [components](components/README.md) instead.

---

## Joining a session

Use `JoinButton` for the standard flow. Pass credentials through `joinParameters`:

```tsx
import { JoinButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <JoinButton
    joinParameters={{
      topic: 'my-session',
      token: 'YOUR_VIDEO_SDK_JWT',
      userName: 'Alice',
      sessionPassword: 'optional-password',
    }}
  />
</ZoomUIToolkitProvider>;
```

For real sessions, validate `topic`, `token`, and `userName` in your app UI before you render or enable the join action. `JoinButton` stays disabled until the provider has a client and while `topic` or `userName` is empty or a join is in progress; it does not check the token. If joining fails, the error is available as `sessionState.errorMessage`.

For custom joins, call the SDK client directly from inside the provider. Use local component state for button loading, because `sessionState.isJoining` is only set by `JoinButton`. The provider updates `sessionState.connectionState` from the client's connection events.

```tsx
import { useState } from 'react';
import { useZoomUIToolkit, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

function CustomJoinButton({ topic, token, userName }: { topic: string; token: string; userName: string }) {
  const { client } = useZoomUIToolkit();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleJoin() {
    if (!client || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await client.join(topic, token, userName);
    } catch {
      // Show your own join error message.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button type='button' onClick={() => void handleJoin()} disabled={!client || isSubmitting}>
      {isSubmitting ? 'Connecting...' : 'Join'}
    </button>
  );
}

<ZoomUIToolkitProvider clientInstance={client}>
  <CustomJoinButton topic='my-session' token='YOUR_VIDEO_SDK_JWT' userName='Alice' />
</ZoomUIToolkitProvider>;
```

Join with the same client you pass to `clientInstance`, after the provider has received it. The provider follows that client's events, so a join on a different client, or before the provider has the client, is not reflected in the built-in components or `useZoomUIToolkit` state.

---

## useZoomUIToolkit

`useZoomUIToolkit` returns the Video SDK client passed to the provider, the effective session options, and live state: `sessionState`, `audioState`, `videoState`, `deviceState`, `shareState`, `participantState`, and `chatState`. It only reads state; it has no `join` or `leave` functions. See the [integration overview](SKILL.md) for the main fields, or [use-zoom-ui-toolkit.json](api/hooks/use-zoom-ui-toolkit.json) for the full contract.

Use the exported `ConnectionState` enum for type-safe comparisons:

```tsx
import { ConnectionState, useZoomUIToolkit } from '@zoom/videosdk-ui-toolkit';

function SessionStatus() {
  const { sessionState, participantState } = useZoomUIToolkit();

  if (sessionState.connectionState !== ConnectionState.Connected) {
    return <p>Not in a session</p>;
  }

  return <p>{participantState.participants.length} participants</p>;
}
```

### connectionState values

| Value            | Meaning                                                           |
| ---------------- | ----------------------------------------------------------------- |
| `'Closed'`       | Initial value before joining; also reported when a session closes |
| `'Connected'`    | Joined the session. Audio and video are started separately        |
| `'Reconnecting'` | Recovering from a connection interruption                         |
| `'Fail'`         | The SDK reports a connection failure                              |

`sessionState.isJoining` is set only by `JoinButton`, and `sessionState.isLeaving` only by `LeaveButton` and the recording consent dialog. When the connection changes to `Reconnecting`, `Closed`, or `Fail`, all seven state objects return to their initial values. `sessionState.connectionState` then shows the new state, and the audio and video defaults from `sessionOptions` are applied again.

---

## Leaving a session

Prefer `LeaveButton` for standard leave/end behavior, because it handles the host flows: the host chooses to end the session for everyone or to leave, and assigns a new host first when others are present.

For custom controls, call `client.leave(false)` to leave or `client.leave(true)` to end the session for everyone (host only). See [components/leave-button.md](components/leave-button.md).

---

## Video SDK JWT token

The `token` passed to `JoinButton` or `client.join(topic, token, userName)` must be a signed Video SDK JWT. In production, generate it on your **server**: signing in the browser exposes your SDK secret. A local demo may sign tokens in the browser so it can run without a backend, but do not ship that pattern.

Minimal server example (Node.js):

```ts
import jwt from 'jsonwebtoken';

function generateVideoSdkToken(sdkKey: string, sdkSecret: string, topic: string, role: 0 | 1) {
  return jwt.sign({ app_key: sdkKey, tpc: topic, role_type: role, version: 1 }, sdkSecret, {
    expiresIn: '2h',
    algorithm: 'HS256',
  });
}
```

`role`: `1` = host, `0` = participant.
