# uitoolkit-integration › modules › Toolbar

Use this guide when using or customizing the `Toolbar` module.

See the [integration overview](../SKILL.md) for architecture and layer selection.
For individual toolbar buttons, see [components/README.md](../components/README.md).
See [toolbar.json](../api/modules/toolbar.json) for the machine-readable contract.

---

## Overview

`Toolbar` is a pre-built session control bar with Audio, Video, Participants, Chat, Share, Record (cloud recording), Settings, More, and Leave (leave/end session) controls. Choose which controls appear with `visibleButtons`; controls that don't fit move into More automatically.

- All controls except More stay visible but are disabled until the session is connected.
- Record is enabled only for the host or a co-host when cloud recording is available. For direct `RecordButton` usage, see [components › RecordButton](../components/record-button.md).
- Chat is disabled when chat isn't available in the session.
- Share is shown but disabled on phones and tablets.
- While you share your screen, a floating sharing control appears that you can drag. It belongs to the Share button, so it doesn't appear when Share is hidden with `visibleButtons`.

---

## Basic usage

```tsx
import { Toolbar, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

function MeetingToolbar() {
  return (
    <div className='layout'>
      <main>{/* video area */}</main>
      <Toolbar />
    </div>
  );
}

<ZoomUIToolkitProvider clientInstance={client}>
  <MeetingToolbar />
</ZoomUIToolkitProvider>;
```

Use one initialized `ZoomUIToolkitProvider` per page. See [app.md](../app.md) for provider/client setup.

---

## Props

All props are optional.

| Prop                                                                           | Type                      | Default | Description                                                                                                                                                                  |
| ------------------------------------------------------------------------------ | ------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`                                                                    | `string`                  | —       | Additional CSS class for the root toolbar element                                                                                                                            |
| `style`                                                                        | `CSSProperties`           | —       | Inline styles for the root toolbar element                                                                                                                                   |
| `isHorizontal`                                                                 | `boolean`                 | `true`  | `true` arranges controls in a row that fills the container width; `false` arranges them in a column that fills the container height                                          |
| `visibleButtons`                                                               | `ToolbarButtonVisibility` | —       | Allow-list of included controls. Omit it to include all controls (see below)                                                                                                 |
| `audioButtonProps`, `videoButtonProps`, `chatButtonProps`, `recordButtonProps` | matching `*ButtonProps`   | —       | Props forwarded to the embedded button. `isMobile` is set automatically based on the device. Participants, Share, Settings, and Leave always use their default configuration |

For a vertical toolbar, give the container a defined height or set one directly: `<Toolbar isHorizontal={false} style={{ height: 400 }} />`.

---

## Toolbar visibility and More menu

```tsx
import { Toolbar, type ToolbarButtonVisibility } from '@zoom/videosdk-ui-toolkit';

const visibleButtons: ToolbarButtonVisibility = {
  audio: true,
  video: true,
  participant: true,
  chat: true,
  share: true,
  record: false,
  settings: true,
  leave: true,
};

<Toolbar visibleButtons={visibleButtons} />;
// Or: <ZoomUIToolkitApp toolbarProps={{ visibleButtons }} />
```

- `visibleButtons?: ToolbarButtonVisibility` is a boolean allow-list with no default object. Omit it to include all controls; when provided, only entries set to `true` are included, and `false` or unspecified entries are hidden. An empty object hides all controls except More.
- The available keys are `audio`, `video`, `participant`, `chat`, `share`, `record`, `settings`, and `leave`.
- Controls render in standard toolbar order regardless of object key order. Update `visibleButtons` to change visibility.
- On desktop and mobile, included Settings, Record, Share, Chat, and Participants controls move into More in that order when space runs out and return in reverse order as space becomes available. Audio, Video, and Leave stay on the toolbar. If even those controls and More can't fit, the toolbar scrolls.
- More is always shown. It opens a desktop popover or a mobile bottom sheet with controls arranged in a grid, each with a text label. If no controls have moved into More, it shows "No additional controls". Controls set to `false` or omitted from a supplied allow-list appear in neither location.
- `ZoomUIToolkitApp` accepts the same configuration through `toolbarProps.visibleButtons`. On desktop it includes all controls by default. On phones and tablets its default is Audio, Video, Participants, Chat, and Settings, with Leave in the top bar instead; providing `visibleButtons` replaces that default.

To compose a custom menu independently of `Toolbar`, use [MoreButton](../components/more-button.md) with an array of JSX controls.

---

## Custom toolbar

To add custom controls or change their order, compose the individual feature components and `ToolbarButton`:

```tsx
import {
  AudioButton,
  LeaveButton,
  RecordButton,
  ToolbarButton,
  VideoButton,
  ZoomUIToolkitProvider,
} from '@zoom/videosdk-ui-toolkit';
import { ReactionIcon } from './icons'; // your own icon component

function MyToolbar() {
  const handleReact = () => {
    // your custom action
  };

  return (
    <div className='toolbar'>
      <AudioButton />
      <VideoButton />
      <RecordButton />
      <ToolbarButton renderContent={() => <ReactionIcon />} onClick={handleReact}>
        React
      </ToolbarButton>
      <LeaveButton />
    </div>
  );
}

<ZoomUIToolkitProvider clientInstance={client}>
  <MyToolbar />
</ZoomUIToolkitProvider>;
```

See [components/README.md](../components/README.md) for all available feature components.
