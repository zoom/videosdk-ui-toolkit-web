# uitoolkit-integration › components › RecordButton

Use this guide when using `RecordButton` or `useRecordingController`.

See [README.md](README.md) for all available components.
For the full API, see [record-button.json](../api/components/record-button.json) and [use-recording-controller.json](../api/hooks/use-recording-controller.json).

---

## Overview

`RecordButton` controls cloud recording. It starts recording from the stopped state and opens pause, resume, and stop actions while recording is active.

The button always renders. It is enabled for a connected host (`currentUser.isHost`) or co-host/manager (`currentUser.isManager`) when cloud recording is available and no recording action is pending. It stays disabled while your participant information is not yet available, the session is disconnected, the user lacks permission, or cloud recording is unavailable. When it is disabled because the user is not a host or co-host, or because cloud recording is not enabled for the account, its title text explains why: "Only the host or co-host can control cloud recording." or "Cloud recording is not enabled for this account."

If a recording action fails, an error notification appears, for example "Could not start cloud recording".

`ZoomUIToolkitProvider`, not `RecordButton`, asks other participants for recording consent. Participants who are not hosts or co-hosts see "This session is being recorded" (Leave or Stay) while cloud recording is in progress, and "Allow individual cloud recording?" (Allow or Decline) when the host asks to record them individually. Turn these dialogs off with `sessionOptions.recording.disableRecordingConsentDialog`.

| State              | Accessible label    | Action                        |
| ------------------ | ------------------- | ----------------------------- |
| Stopped            | `"Start recording"` | Starts cloud recording        |
| Recording          | `"Recording"`       | Opens pause and stop actions  |
| Paused             | `"Recording"`       | Opens resume and stop actions |
| Action in progress | `"Working..."`      | —                             |

---

## Usage

```tsx
import { RecordButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <RecordButton />
</ZoomUIToolkitProvider>;
```

Do not fetch the current user before mounting the standard control. `RecordButton` performs the availability and privilege checks itself.

---

## Optional visibility by privilege

No privilege check is needed to reserve space for `RecordButton`: it remains visible when disabled. If your application chooses to hide it instead, read `participantState.currentUser` from `useZoomUIToolkit`, which re-renders when the current user changes. Check both `isHost` and `isManager`; do not call `client.getCurrentUserInfo()` directly in render logic.

```tsx
import { RecordButton, useZoomUIToolkit } from '@zoom/videosdk-ui-toolkit';

function RecordingControl() {
  const { participantState } = useZoomUIToolkit();
  const currentUser = participantState.currentUser;
  const hasRecordingPrivilege = Boolean(currentUser?.isHost || currentUser?.isManager);

  return hasRecordingPrivilege ? <RecordButton /> : null;
}
```

`currentUser` is `null` before joining; treat that as unknown, not as missing privilege. Keep privilege separate from cloud recording availability: an account or session may not support cloud recording even for a host.

---

## Props

| Prop              | Type                         | Default | Description                                                                                     |
| ----------------- | ---------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `className`       | `string`                     | —       | Additional CSS class for the toolbar button                                                     |
| `style`           | `CSSProperties`              | —       | Inline styles for the toolbar button                                                            |
| `isMobile`        | `boolean`                    | `false` | Opens the recording-action menu as a bottom sheet. Not detected automatically                   |
| `showMenu`        | `boolean`                    | `true`  | Shows pause/resume/stop actions while recording                                                 |
| `menuGroups`      | `ToolbarMenuGroup[]`         | —       | Extra menu groups shown after the recording actions, only while a recording is active or paused |
| `dropdownOptions` | `ToolbarMenuDropdownOptions` | —       | Desktop menu placement, styling, and container options; ignored when `isMobile` is `true`       |

Setting `showMenu={false}` leaves the button disabled while recording is active because pause, resume, and stop normally live in the menu.

---

## Programmatic recording control

Use `useRecordingController` from inside the provider for custom UI or shortcuts. Use `canControlRecording` to disable actions; it combines connection, cloud recording availability, host/co-host privilege, and loading state.

```tsx
import { RecordingStatus } from '@zoom/videosdk';
import { useRecordingController } from '@zoom/videosdk-ui-toolkit';

function CustomRecordButton() {
  const { recordingStatus, canControlRecording, startRecording, stopRecording } = useRecordingController();
  const isRecordingActive = recordingStatus === RecordingStatus.Recording || recordingStatus === RecordingStatus.Paused;

  return (
    <button
      type='button'
      disabled={!canControlRecording}
      onClick={() => void (isRecordingActive ? stopRecording() : startRecording())}
    >
      {isRecordingActive ? 'Stop recording' : 'Start recording'}
    </button>
  );
}
```

`useRecordingController` also returns `isCloudRecordingEnabled`, `isLoading`, `pauseRecording`, and `resumeRecording`.

- `isLoading` (and the loading part of `canControlRecording`) covers only actions started from the same hook call, not actions started from `RecordButton` or other components.
- Actions never reject. A failed action shows an error notification.
