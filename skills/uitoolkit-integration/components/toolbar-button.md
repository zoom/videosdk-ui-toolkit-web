# uitoolkit-integration › components › ToolbarButton

Use this guide when using `ToolbarButton` to build custom toolbar actions.

See [README.md](README.md) for all available components.
See [toolbar-button.json](../api/components/toolbar-button.json) for the machine-readable contract.

---

## Overview

`ToolbarButton` is a styled native button with active, tone, size, and full-width options. Use it to add custom actions to your toolbar that visually match the built-in buttons. It renders a default placeholder icon when no `renderContent` is provided.

`ToolbarButton` does not require `ZoomUIToolkitProvider`. Outside `ZoomUIToolkitProvider` or `ThemeProvider`, it uses the dark theme.

---

## Usage

```tsx
import { ToolbarButton } from '@zoom/videosdk-ui-toolkit';
import { RaiseHandIcon } from './icons'; // your own icon component

<ToolbarButton aria-label='Raise hand' renderContent={() => <RaiseHandIcon />} onClick={handleRaiseHand} />;
```

---

## Props

`ToolbarButtonProps` extends `ComponentPropsWithoutRef<'button'>`, so native props such as `onClick`, `disabled`, `aria-label`, `className`, `style`, and `children` are supported. The button forwards its ref to the native button and defaults to `type='button'`; an explicit `type` prop overrides it.

| Prop            | Type                                   | Default                  | Description                                                                         |
| --------------- | -------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| `renderContent` | `() => ReactNode`                      | Default placeholder icon | Icon or content rendered before `children`; pass `() => null` to show only children |
| `active`        | `boolean`                              | `false`                  | Applies the active/pressed visual state                                             |
| `tone`          | `'neutral' \| 'accent' \| 'danger'`    | `'neutral'`              | Color variant                                                                       |
| `size`          | `'sm' \| 'md' \| 'lg'`                 | `'md'`                   | Button size                                                                         |
| `fullWidth`     | `boolean`                              | `false`                  | Stretches the button to fill its container                                          |
| `onClick`       | `MouseEventHandler<HTMLButtonElement>` | —                        | Click handler                                                                       |
| `disabled`      | `boolean`                              | —                        | Disables the button and prevents interaction                                        |
| `className`     | `string`                               | —                        | Additional CSS class for the button                                                 |
| `style`         | `CSSProperties`                        | —                        | Inline styles for the button                                                        |

Pass an accessible name with `aria-label` or visible text.

---

## Example: custom toolbar

```tsx
import { AudioButton, LeaveButton, ToolbarButton, VideoButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';
import { RaiseHandIcon, ReactIcon } from './icons'; // your own icon components

function MyToolbar() {
  return (
    <div className='toolbar'>
      <AudioButton />
      <VideoButton />
      <ToolbarButton aria-label='Raise hand' renderContent={() => <RaiseHandIcon />} onClick={onRaiseHand} />
      <ToolbarButton aria-label='React' renderContent={() => <ReactIcon />} onClick={onReact} />
      <LeaveButton />
    </div>
  );
}

<ZoomUIToolkitProvider clientInstance={client}>
  <MyToolbar />
</ZoomUIToolkitProvider>;
```
