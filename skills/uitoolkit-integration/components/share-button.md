# uitoolkit-integration › components › ShareButton

Use this guide when using `ShareButton` or `useShareController`.

See [README.md](README.md) for all available components.
For the full API, see [share-button.json](../api/components/share-button.json) and [use-share-controller.json](../api/hooks/use-share-controller.json).

---

## Overview

`ShareButton` starts screen sharing. To stop sharing, use "Stop share" on the floating sharing bar, or call `stopShare` from `useShareController` if you hide the bar.

- When the local user is a **host or co-host**, the button shows an options menu to change **share privilege** ("One participant can share at a time" or "Multiple participants can share simultaneously", with the current choice checked) and a "Screen share options" item. That item opens a dialog with those two choices plus "Only host or cohost can share screen".
- While you share, a floating, **draggable** bar shows "You're screen sharing", a pause or resume button, and "Stop share". Its Share options menu has "Disable annotation for others" and "Hide names of annotators", plus "Optimize for video clip" when the browser supports it and sharing is not set to multiple participants. Hide the bar with `showPresenterControl={false}`.
- The button and its options menu trigger are disabled while the session is not connected or on a phone or tablet (Android, iPhone, iPad).
- If sharing cannot start, an error notification appears, for example "Host disabled attendee screen sharing." or "You cannot start screen share while another participant is sharing."

---

## Usage

```tsx
import { ShareButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <ShareButton />
</ZoomUIToolkitProvider>;
```

The options menu appears only while connected, and only for hosts and co-hosts or when you pass custom `menuGroups`. For other participants with no custom groups, the button is a single button with no menu.

```tsx
import { ShareButton } from '@zoom/videosdk-ui-toolkit';

// Hide the floating sharing bar (e.g. you build your own pause/stop controls with useShareController)
<ShareButton showPresenterControl={false} />;

// Suppress the options menu entirely
<ShareButton showMenu={false} />;
```

`useShareController` offers pause, resume, stop, and optimization for your own controls, but not the bar's annotation options.

---

## Props

| Prop                   | Type                         | Default | Description                                                                                                   |
| ---------------------- | ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `className`            | `string`                     | —       | Additional CSS class for the control root                                                                     |
| `style`                | `CSSProperties`              | —       | Inline styles for the control root                                                                            |
| `showMenu`             | `boolean`                    | `true`  | Shows the options menu (only when connected and the user is a host or co-host, or custom groups are supplied) |
| `showPresenterControl` | `boolean`                    | `true`  | Shows the floating, draggable sharing bar while you share                                                     |
| `menuGroups`           | `ToolbarMenuGroup[]`         | —       | Extra menu groups shown after the built-in sharing options                                                    |
| `dropdownOptions`      | `ToolbarMenuDropdownOptions` | —       | Menu placement, styling, and container options                                                                |
| `renderContent`        | `ShareButtonRenderContent`   | —       | Custom button content per state (`idle` / `sharing`)                                                          |

---

## Custom content

`renderContent` accepts a node or a render function per state. The function receives a `ShareButtonRenderContext` (`isSharing`, `sharePrivilege`, `canChangeSharePrivilege`, `label`, `isDisabled`, `toggleShare`, `changeSharePrivilege`, …). Only the main button changes; the options menu trigger stays.

```tsx
import { ShareButton } from '@zoom/videosdk-ui-toolkit';

<ShareButton
  renderContent={{
    idle: ({ isDisabled }) => <span>{isDisabled ? 'Sharing unavailable' : 'Present'}</span>,
    sharing: <span>Presenting</span>,
  }}
/>;
```

---

## Programmatic share control

Use `useShareController` from inside the provider for custom UI or shortcuts.

```tsx
import { useShareController } from '@zoom/videosdk-ui-toolkit';

function CustomShare() {
  const { isSharing, isSharingPaused, toggleShare, stopShare, pauseShare, resumeShare } = useShareController();

  if (!isSharing) {
    return (
      <button type='button' onClick={() => void toggleShare()}>
        Share
      </button>
    );
  }

  return (
    <>
      <button type='button' onClick={() => void (isSharingPaused ? resumeShare() : pauseShare())}>
        {isSharingPaused ? 'Resume' : 'Pause'}
      </button>
      <button type='button' onClick={() => void stopShare()}>
        Stop
      </button>
    </>
  );
}
```

`useShareController()` returns `isSharing`, `sharePrivilege`, `canChangeSharePrivilege`, `isSharingPaused`, `isSupportOptimizedForSharedVideo`, `isEnableOptimizeForSharedVideo`, `toggleShare`, `stopShare`, `pauseShare`, `resumeShare`, `changeSharePrivilege`, and `toggleOptimizeForSharedVideo`.

- `toggleShare` starts screen sharing. Call it when you are not sharing; to stop sharing, call `stopShare`.
- Actions do nothing when the Video SDK client has no media stream. Unlike `ShareButton`, they don't check the connection state or whether the device is a phone or tablet.
- Actions never reject. Only a failed start shows an error notification; other failures are not reported.
- `changeSharePrivilege` has no effect unless the user is a host or co-host.

---

## Related

- To preview the local user's **own** shared content, see [modules › SharePresenterView](../modules/share-presenter-view.md).
- To render **another** participant's share, see [modules › ShareViewerView](../modules/share-viewer-view.md).
