# uitoolkit-integration › components › ChatButton

Use this guide when adding in-session text chat, unread indicators, recipient selection, or chat privilege
controls.

See [README.md](README.md) for all available components.
See [chat-button.json](../api/components/chat-button.json) for the machine-readable contract.

## Usage

`ChatButton` is the complete public chat feature: the button, its unread badge, and the chat panel. The chat panel is
not exported separately.

```tsx
import { ChatButton, ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client}>
  <ChatButton />
</ZoomUIToolkitProvider>;
```

## Message bubble styles

Use `messageBubbleStyles` to override incoming and outgoing bubbles independently. Unspecified directions keep the
default styles, and the selected style also applies to continuation bubbles in grouped messages.

```tsx
import type { ChatMessageBubbleStyles } from '@zoom/videosdk-ui-toolkit';
import { ChatButton } from '@zoom/videosdk-ui-toolkit';

const messageBubbleStyles: ChatMessageBubbleStyles = {
  incoming: { backgroundColor: '#f1f5f9', color: '#0f172a', borderRadius: 12 },
  outgoing: { backgroundColor: '#0b5cff', color: '#ffffff', borderRadius: 12 },
};

<ChatButton messageBubbleStyles={messageBubbleStyles} />;
```

When using the prebuilt `Toolbar`, pass the same option through `chatButtonProps`. With `ZoomUIToolkitApp`, pass it
through `toolbarProps.chatButtonProps`:

```tsx
import { Toolbar, ZoomUIToolkitApp } from '@zoom/videosdk-ui-toolkit';

<Toolbar chatButtonProps={{ messageBubbleStyles }} />;
<ZoomUIToolkitApp toolbarProps={{ chatButtonProps: { messageBubbleStyles } }} />;
```

## Behavior

`ZoomUIToolkitProvider` tracks messages, recipients, privilege, availability, and unread count for the connected
session, so `ChatButton` needs no extra setup. Do not add your own chat listeners or message cache for it. To read the
same data elsewhere, use `useZoomUIToolkit().chatState`.

The button is disabled until the session reaches `ConnectionState.Connected` and chat becomes available. It is
disabled again while reconnecting, after disconnecting, or when the connection fails.
An open panel disables composing, recipient selection, and sending, and hides privilege controls while disconnected
or chat is unavailable. It stays open during reconnecting.
An unsent draft is kept with its receiver when the panel closes and reopens. Selecting a different receiver keeps
the message. The message clears after a successful send. If the selected receiver is unavailable, the panel resets
the draft and selects the first available receiver when open or reopened. The draft also resets when the connection
reconnects, closes, or fails.

On desktop, chat opens in a floating panel next to the button that can be dragged by its header. It closes only when
you click the button again or use the panel's close button. With `isMobile`, chat opens in a bottom sheet instead;
`isMobile` is not detected automatically. The sheet closes when you swipe it down, tap outside it, or use its close
button. `onOpen` and `onClose` are called whenever the panel opens or closes.

Use `popoverProps` to set the desktop panel's initial position: `side` (default `'top'`), `align` (default `'start'`),
`sideOffset` (default `8`), `alignOffset`, and `collisionPadding` (default `12`). The panel moves to the opposite side
when there isn't enough room. Use `anchor` to position it against another element: pass an HTML element or any object
with a `getBoundingClientRect()` method. Both are ignored on mobile. `panelClassName` and `panelStyle` style the panel
on desktop and the panel body inside the sheet on mobile.

The unread badge counts messages from other participants, shows `99+` above 99, and clears once the latest message is
visible in the open chat panel. Use the To: picker to choose a recipient. Press Enter to send and Shift+Enter for a new
line; messages are limited to 1024 characters. Participants can delete their own messages, and hosts and co-hosts can
delete any message in their chat history, when your Video SDK version supports deleting chat messages. Hosts and
co-hosts can also set who participants can chat with.

Messages are plain text. Markdown formatting, an emoji picker, and file transfer are not supported.
