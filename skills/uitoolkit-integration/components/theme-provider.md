# uitoolkit-integration › components › ThemeProvider

Use this guide when using `ThemeProvider`, `useTheme`, or `ToolkitTheme`.

See [README.md](README.md) for all available components.
For app-wide provider setup and theming, see [app.md](../app.md).
Machine-readable contracts: [theme-provider.json](../api/components/theme-provider.json), [use-theme.json](../api/hooks/use-theme.json).

---

## Overview

`ThemeProvider` supplies a light or dark theme to the components inside it. It renders no extra element.

`ZoomUIToolkitProvider` already passes its `theme` prop (default `'dark'`) to the components inside it, and its notifications use the same theme. Set the theme there. Use `ThemeProvider` only to give part of your layout a different theme; notifications keep the provider's theme.

`ToolkitTheme` is `'light' | 'dark'`. Outside both `ZoomUIToolkitProvider` and `ThemeProvider`, `useTheme()` returns `'dark'`.

---

## Usage

Set the theme on the provider:

```tsx
import { ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client} theme='light'>
  <YourVideoApp />
</ZoomUIToolkitProvider>;
```

Give part of your layout a different theme:

```tsx
import { ThemeProvider, Toolbar, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client} theme='dark'>
  <YourVideoApp />
  <ThemeProvider theme='light'>
    <Toolbar />
  </ThemeProvider>
</ZoomUIToolkitProvider>;
```

---

## Props

| Prop       | Type           | Description                                               |
| ---------- | -------------- | --------------------------------------------------------- |
| `theme`    | `ToolkitTheme` | Required. `'light'` or `'dark'` for the components inside |
| `children` | `ReactNode`    | Components that receive the selected theme                |

---

## useTheme

`useTheme()` returns the current `'light'` or `'dark'` theme: the nearest `ThemeProvider` value, otherwise the `ZoomUIToolkitProvider` `theme` prop.

Built-in components apply the current theme themselves, including their menus, dialogs, and panels. Your own elements are not restyled automatically. Use the returned value to pick your own light or dark styles, for example by setting `data-theme={theme}` and targeting it in your CSS.

```tsx
import type { ReactNode } from 'react';
import { useTheme } from '@zoom/videosdk-ui-toolkit';

function CustomCard({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <div className='my-card' data-theme={theme}>
      {children}
    </div>
  );
}
```

```css
.my-card[data-theme='light'] {
  /* your light styles */
}
.my-card[data-theme='dark'] {
  /* your dark styles */
}
```
