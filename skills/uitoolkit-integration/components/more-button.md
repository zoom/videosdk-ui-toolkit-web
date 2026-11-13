# uitoolkit-integration › components › MoreButton

`MoreButton` displays custom JSX controls or built-in buttons in a grid within a desktop popover or mobile bottom sheet. It can be used independently of `Toolbar` and detects the platform automatically.

See [README.md](README.md) for all available components.
See [more-button.json](../api/components/more-button.json) for the machine-readable contract.

```tsx
import { MoreButton, SettingsButton } from '@zoom/videosdk-ui-toolkit';
import '@zoom/videosdk-ui-toolkit/style.css';

function MyMoreButton({ onHelp }: { onHelp: () => void }) {
  return (
    <MoreButton
      buttons={[
        <SettingsButton key='settings' />,
        <button key='help' type='button' onClick={onHelp}>
          Help
        </button>,
      ]}
    />
  );
}
```

`MoreButton` itself does not require `ZoomUIToolkitProvider`. Supplied feature buttons keep their own provider requirements.

## Props

| Prop            | Type                   | Default            | Description                                                                                      |
| --------------- | ---------------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| `buttons`       | `readonly ReactNode[]` | `[]`               | JSX controls rendered in the supplied order. Use stable keys for controls that can be reordered. |
| `isMobile`      | `boolean`              | Platform detection | Override whether More opens as a mobile bottom sheet.                                            |
| `className`     | `string`               | —                  | Additional CSS class for the trigger.                                                            |
| `style`         | `CSSProperties`        | —                  | Inline styles for the trigger.                                                                   |
| `menuClassName` | `string`               | —                  | Additional CSS class on the desktop popover or mobile sheet body.                                |
| `menuStyle`     | `CSSProperties`        | —                  | Inline styles on the desktop popover or mobile sheet body.                                       |

`MoreButtonProps` is exported as a type.

- By default, Android devices, iPhones, iPods, and iPads get the mobile bottom sheet.
- Controls render as supplied, including their labels, disabled states, and click handlers. Include any extra visible labels in your JSX.
- Conditional `null`, `undefined`, and boolean entries are ignored. When no controls remain, More displays "No additional controls".
- The trigger supports keyboard activation. On desktop, clicking the trigger again or clicking outside closes More, and Escape closes it and returns focus to the trigger. On mobile, the sheet closes when you swipe it down, tap outside it, or use its Cancel button. Using a control inside More does not close it.
- `MoreButton` does not select controls based on available space. The prebuilt `Toolbar` uses `visibleButtons` to choose which controls are included and moves them into More as space runs out on desktop or mobile.
- Supplied controls keep their own presentation settings. Pass `isMobile` to feature buttons that should open mobile sheets:

```tsx
import { MoreButton, SettingsButton } from '@zoom/videosdk-ui-toolkit';

<MoreButton isMobile buttons={[<SettingsButton key='settings' isMobile />]} />;
```
