# uitoolkit-integration › modules › TopBar

Use this guide when using or customizing the `TopBar` module.

See the [integration overview](../SKILL.md) for architecture and layer selection.
For the session info button it contains, see [components/session-info.md](../components/session-info.md).
See [top-bar.json](../api/modules/top-bar.json) for the machine-readable contract.

---

## Overview

`TopBar` is a pre-built session header. It shows a session info button and a recording indicator on the left, and your own controls (`customizedButtons`) on the right.

- The session info button shows an info icon and, on desktop, the session name. It is disabled until the session is connected. Selecting it opens the Session Info panel below the button, showing the session topic, session ID, and your display name and user ID.
- The Session Info panel opened from `TopBar` does not include an invite link. To show one or customize the button, place `SessionInfoButton` with its `inviteLink` prop in your own header (see Custom header).
- While cloud recording is in progress or paused, the recording indicator shows a dot with "Recording" or "Recording paused". Nothing is shown otherwise.
- On phones and tablets (Android, iPhone, iPad), the session name is hidden, Session Info opens in a bottom sheet, and the recording indicator hides its text label.

---

## Basic usage

```tsx
import { TopBar, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

function MeetingLayout() {
  return (
    <div className='layout'>
      <TopBar />
      <main>{/* video area */}</main>
      {/* Toolbar, etc. */}
    </div>
  );
}

<ZoomUIToolkitProvider clientInstance={client}>
  <MeetingLayout />
</ZoomUIToolkitProvider>;
```

Use one initialized `ZoomUIToolkitProvider` per page. See [app.md](../app.md) for provider/client setup. `TopBar` is also rendered automatically in the header of the pre-built `ZoomUIToolkitApp`.

---

## Props

All props are optional.

| Prop                | Type            | Description                                                  |
| ------------------- | --------------- | ------------------------------------------------------------ |
| `className`         | `string`        | Additional CSS class for the top bar root                    |
| `style`             | `CSSProperties` | Inline styles for the top bar root                           |
| `customizedButtons` | `ReactNode[]`   | Your own controls, rendered on the right side in array order |

```tsx
import { LeaveButton, TopBar } from '@zoom/videosdk-ui-toolkit';

// Put Leave in the header instead of the toolbar
<TopBar customizedButtons={[<LeaveButton key='leave' />]} />;
```

---

## Custom header

If you want a different layout, you usually don't need `TopBar` at all — just drop the self-contained `SessionInfoButton` wherever you like:

```tsx
import { SessionInfoButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

function MyHeader() {
  return (
    <header className='my-header'>
      <span className='brand'>My App</span>
      <SessionInfoButton inviteLink={inviteUrl} />
    </header>
  );
}

<ZoomUIToolkitProvider clientInstance={client}>
  <MyHeader />
</ZoomUIToolkitProvider>;
```

The recording indicator is only available inside `TopBar`. In a custom header, read `recordingStatus` from `useRecordingController` to show your own.

For a fully custom trigger or layout, render the self-contained `SessionInfoPanel` yourself (it reads its own session data) — see [components/session-info.md](../components/session-info.md).
