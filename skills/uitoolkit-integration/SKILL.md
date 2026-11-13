---
name: uitoolkit-integration
description: Guide for integrating the Zoom Video SDK React components from @zoom/videosdk-ui-toolkit into a React application, covering installation, provider setup, architecture layers, theming, and session lifecycle. Use when building, modifying, or troubleshooting a React application that imports from @zoom/videosdk-ui-toolkit.
---

# uitoolkit-integration

The machine-readable public API is indexed by [api/manifest.json](api/manifest.json). Each component, module, and hook has its own JSON document at the path recorded in that manifest.

For specific areas, see these guides:

| Area                    | Guide                                                                                         | Description                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| App & Provider          | [app.md](app.md)                                                                              | `ZoomUIToolkitApp`, `ZoomUIToolkitProvider`, `ZoomUIToolkitRoot`, session lifecycle |
| Modules index           | [modules/README.md](modules/README.md)                                                        | Overview of all Layer 2 modules                                                     |
| — Toolbar               | [modules/toolbar.md](modules/toolbar.md)                                                      | Pre-built session control bar                                                       |
| — TopBar                | [modules/topbar.md](modules/topbar.md)                                                        | Session header with session info and recording status                               |
| — ParticipantView       | [modules/participant-view.md](modules/participant-view.md)                                    | Paginated participant video grid                                                    |
| — MobileParticipantView | [modules/mobile-participant-view.md](modules/mobile-participant-view.md)                      | Swipeable participant pages for phones                                              |
| — ActiveSpeakerView     | [modules/active-speaker-view.md](modules/active-speaker-view.md)                              | Single large tile for the active video participant                                  |
| — ShareViewerView       | [modules/share-viewer-view.md](modules/share-viewer-view.md)                                  | Screen shares received from other participants                                      |
| — SharePresenterView    | [modules/share-presenter-view.md](modules/share-presenter-view.md)                            | Preview of your own shared screen                                                   |
| Components index        | [components/README.md](components/README.md)                                                  | Overview of Layer 3 components and media surfaces                                   |
| — AudioButton           | [components/audio-button.md](components/audio-button.md)                                      | Mute/unmute toggle                                                                  |
| — Host unmute requests  | [components/host-unmute-requests.md](components/host-unmute-requests.md)                      | Dialog `AudioButton` shows when the host asks you to unmute                         |
| — VideoButton           | [components/video-button.md](components/video-button.md)                                      | Camera on/off                                                                       |
| — ShareButton           | [components/share-button.md](components/share-button.md)                                      | Start local screen share, with a floating sharing bar                               |
| — RecordButton          | [components/record-button.md](components/record-button.md)                                    | Host/co-host cloud recording control                                                |
| — JoinButton            | [components/join-button.md](components/join-button.md)                                        | Join with built-in loading state                                                    |
| — LeaveButton           | [components/leave-button.md](components/leave-button.md)                                      | Leave/end session                                                                   |
| — ReclaimHostBanner     | [components/reclaim-host-banner.md](components/reclaim-host-banner.md)                        | Lets the original host reclaim the host role                                        |
| — SessionInfo           | [components/session-info.md](components/session-info.md)                                      | `SessionInfoButton` and `SessionInfoPanel`                                          |
| — VideoLayout           | [components/video-layout.md](components/video-layout.md)                                      | Auto participant tile grid                                                          |
| — ParticipantTile       | [components/participant-tile.md](components/participant-tile.md)                              | Single participant tile                                                             |
| — MobileVideoLayout     | [api/components/mobile-video-layout.json](api/components/mobile-video-layout.json) (contract) | Fixed four-cell participant grid for small screens                                  |
| — ShareViewLayout       | [components/share-view-layout.md](components/share-view-layout.md)                            | Auto share tile grid                                                                |
| — ShareTile             | [components/share-tile.md](components/share-tile.md)                                          | Single sharer tile                                                                  |
| — ParticipantButton     | [components/participant-button.md](components/participant-button.md)                          | Opens the participant list                                                          |
| — ParticipantPanel      | [components/participant-panel.md](components/participant-panel.md)                            | Participant list panel                                                              |
| — ChatButton            | [components/chat.md](components/chat.md)                                                      | Session chat with recipients, unread badge, and chat privileges                     |
| — SettingsButton        | [components/settings-button.md](components/settings-button.md)                                | Opens the Settings panel                                                            |
| — SettingsPanel         | [components/settings-panel.md](components/settings-panel.md)                                  | Audio, Video, Share screen, and Statistics settings                                 |
| — MoreButton            | [components/more-button.md](components/more-button.md)                                        | Menu of custom controls or built-in buttons                                         |
| — ToolbarButton         | [components/toolbar-button.md](components/toolbar-button.md)                                  | Base styled toolbar button                                                          |
| — ThemeProvider         | [components/theme-provider.md](components/theme-provider.md)                                  | Light or dark theme for the components inside it                                    |

---

## Basic skeleton

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import ZoomVideo from '@zoom/videosdk';
import { ConnectionState, useZoomUIToolkit, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';
import type { ZoomUIToolkitProviderProps } from '@zoom/videosdk-ui-toolkit';
import '@zoom/videosdk-ui-toolkit/style.css';

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

function YourVideoApp() {
  // Render the built-in components from any layer here:
  // Layer 1: <ZoomUIToolkitApp />
  // Layer 2: <Toolbar /> <ParticipantView /> <ActiveSpeakerView /> <ShareViewerView />
  // Layer 3: individual components such as <AudioButton /> <VideoButton /> <RecordButton />
  return null;
}
```

Key points:

- `ZoomUIToolkitProvider` must wrap all the built-in components and receives the `clientInstance`. Pass `null` until the client is initialized.
- Mount one provider per page. Every component on the page reads the same session state.
- Keep the same client instance while a session is open. After the session closes, you can destroy it with `ZoomVideo.destroyClient()` and pass a new one. Unmounting the provider does not leave the session or destroy the client; do both yourself.
- `theme` accepts `'dark'` (default) or `'light'`.
- The provider shows a notification when camera or microphone access is blocked. You do not need to render your own no-permission banners.

---

## Installation

```bash
npm install @zoom/videosdk-ui-toolkit @zoom/videosdk react react-dom
```

Import the stylesheet once in your app entry point:

```ts
import '@zoom/videosdk-ui-toolkit/style.css';
```

### Peer dependencies

| Package          | Required version |
| ---------------- | ---------------- |
| `@zoom/videosdk` | >= 2.6.0         |
| `react`          | >= 19.0.0        |
| `react-dom`      | >= 19.0.0        |

---

## Architecture overview

The components are organized in three layers. Use the layer that matches how much control you need.

```
Layer 1 — App
  ZoomUIToolkitApp          Complete pre-built session UI. Fewest decisions required.

Layer 2 — Modules
  Toolbar                   Pre-built toolbar with the session controls.
  TopBar                    Session header with session info and recording status.
  ParticipantView           Paginated video tile grid for all participants.
  MobileParticipantView     Swipeable participant pages for phones.
  ActiveSpeakerView         Single large tile for the active video participant.
  ShareViewerView           Screen shares received from others. Render it only while a share is being received, unless you want an idle panel.
  SharePresenterView        Preview of your own shared screen.

Layer 3 — Feature components
  AudioButton  VideoButton  ShareButton  RecordButton  JoinButton  LeaveButton
  ParticipantButton  ChatButton  SessionInfoButton  SettingsButton  MoreButton  ToolbarButton
  VideoLayout  MobileVideoLayout  ParticipantTile  ShareViewLayout  ShareTile
  ParticipantPanel  SessionInfoPanel  SettingsPanel  ReclaimHostBanner  ThemeProvider

Hooks
  useZoomUIToolkit  useAudioController  useVideoController  useShareController  useRecordingController  useTheme
```

All layers must be rendered inside `<ZoomUIToolkitProvider>`. See [app.md](app.md).

---

## Choosing the right layer

- **Need a working video call with minimal code?** → Use `ZoomUIToolkitApp` (Layer 1). See [app.md](app.md).
- **Need to customize layout but keep pre-built controls?** → Compose Layer 2 modules. See [modules/README.md](modules/README.md).
- **Need full control over every button and tile?** → Wire individual Layer 3 components. See [components/README.md](components/README.md).

---

## Theming

Pass the `theme` prop to `ZoomUIToolkitProvider`. The only accepted values are `'dark'` (default) and `'light'`:

```tsx
import { ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client} theme='light'>
  <YourVideoApp />
</ZoomUIToolkitProvider>;
```

To give part of your layout a different theme, wrap it in `ThemeProvider`. Read the current theme with `useTheme()`. See [components/theme-provider.md](components/theme-provider.md).

---

## Joining a session

Render the join trigger inside `<ZoomUIToolkitProvider>`, because it needs the client the provider holds. The quickest path is `JoinButton`: pass the session credentials as `joinParameters`. It shows "Connecting..." while joining and stays disabled until the provider has a client and both `topic` and `userName` are filled in.

```tsx
import { JoinButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client} theme='dark'>
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

To join from your own button, call `client.join()` with the same client you pass to `clientInstance`. See [Joining a session in app.md](app.md#joining-a-session) for a custom join example, [Video SDK JWT token](app.md#video-sdk-jwt-token) for generating the token, and [Leaving a session](app.md#leaving-a-session) for leaving or ending the session.

---

## useZoomUIToolkit()

The `useZoomUIToolkit` hook returns the Video SDK client passed to the provider, the effective session options, and live session state. It only reads state; it has no join, leave, or media actions. It is safe to call outside `<ZoomUIToolkitProvider>`. There, `client` is `null` and `sessionOptions` holds the defaults. The state objects are shared with the provider on the page and update only while a provider with a client is mounted. Full contract: [use-zoom-ui-toolkit.json](api/hooks/use-zoom-ui-toolkit.json).

```tsx
import { useZoomUIToolkit } from '@zoom/videosdk-ui-toolkit';

// Call it inside a component, like any other React hook.
const {
  sessionState, // session / connection lifecycle
  audioState, // local audio state
  videoState, // local camera state
  deviceState, // available and selected media devices
  shareState, // screen share state
  participantState, // participant list, active speakers, and sharers
  chatState, // chat messages, recipients, privilege, and unread count
  sessionOptions, // effective session configuration
  client, // SDK client passed to the provider, or null
} = useZoomUIToolkit();
```

When the connection changes to `Reconnecting`, `Closed`, or `Fail`, all seven state objects return to their initial values. `sessionState.connectionState` then shows the new state, and the audio and video defaults from `sessionOptions` are applied again.

`audioState.isJoined`, `audioState.isMuted`, and `videoState.isVideoOn` follow the local participant only while a component that controls that media is mounted: `AudioButton` or `VideoButton`, the matching `SettingsPanel` tab, or your own component that calls `useAudioController` or `useVideoController`. `ZoomUIToolkitApp` and `Toolbar` include both buttons unless `visibleButtons` leaves them out.

For actions, use [`useAudioController`](api/hooks/use-audio-controller.json), [`useVideoController`](api/hooks/use-video-controller.json), [`useShareController`](api/hooks/use-share-controller.json), [`useRecordingController`](api/hooks/use-recording-controller.json), the built-in components, or the Video SDK client directly.

### sessionState

| Field             | Type              | Description                                                                                                                                                                |
| ----------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `connectionState` | `ConnectionState` | Current connection status; see [connectionState values](app.md#connectionstate-values)                                                                                     |
| `sessionInfo`     | `SessionInfo`     | `topic`, `sessionId`, `userName`, `userId`, `password`, and `isInMeeting`; filled in when the session connects. Contains the session password, so do not log or display it |
| `isJoining`       | `boolean`         | True while a join started from `JoinButton` is in progress; stays `false` if you call `client.join()` yourself                                                             |
| `isLeaving`       | `boolean`         | True while a leave started from `LeaveButton` or the recording consent dialog is in progress; stays `false` if you call `client.leave()` yourself                          |
| `isOriginalHost`  | `boolean`         | True if the local participant joined with an original-host token (`role_type: 1`)                                                                                          |
| `errorMessage`    | `string \| null`  | Latest error from `JoinButton`, `LeaveButton`, a recording consent prompt, or a failed connection                                                                          |
| `reason`          | `string \| null`  | Reason reported by the Video SDK for the latest connection change. Failed `LeaveButton` and recording consent actions also write their error here                          |

### shareState

| Field              | Type             | Description                                                    |
| ------------------ | ---------------- | -------------------------------------------------------------- |
| `isSharing`        | `boolean`        | True when the local user is sharing                            |
| `isReceivingShare` | `boolean`        | True while a screen share from another participant is received |
| `sharePrivilege`   | `SharePrivilege` | Who may share in this session                                  |

`shareState` also reports shared-video optimization and annotation state; see the [full contract](api/hooks/use-zoom-ui-toolkit.json). `SharePrivilege` comes from `@zoom/videosdk`.

### participantState

| Field                  | Type                  | Description                                                                                                                                                         |
| ---------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `participants`         | `Participant[]`       | All participants in the session, including the local participant                                                                                                    |
| `currentUser`          | `Participant \| null` | The local participant, or `null` before joining                                                                                                                     |
| `activeVideoUser`      | `Participant \| null` | The participant whose video most recently became active or inactive, as reported by the SDK                                                                         |
| `activeSpeakers`       | `Participant[]`       | Participants the Video SDK most recently reported as speaking, loudest first                                                                                        |
| `activeShareUsersList` | `Participant[]`       | Other participants currently sharing their screens, in the order they started. Your own share is not included; see `shareState.isSharing`                           |
| `activeShareUser`      | `Participant \| null` | The participant whose received screen share the Video SDK reports as active. `ShareViewerView` shows this share by default. `null` when no received share is active |
