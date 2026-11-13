# uitoolkit-integration › components › Host unmute requests (AudioButton)

Use this guide when working with the host's request to unmute, the `host-ask-unmute-audio` Video SDK event, or the
unmute request dialog that `AudioButton` shows.

See [README.md](README.md) for all available components.
For audio controls, see [audio-button.md](audio-button.md).

---

## Overview

The unmute request dialog is part of `AudioButton`; it is not a separate component you can import. While
`AudioButton` is displayed and the session is connected, the dialog opens when the host asks you to unmute or
spotlights your video. `ZoomUIToolkitApp` and `Toolbar` show it through their built-in `AudioButton` while that
button is displayed.

The dialog never unmutes you by itself. Your audio changes only if you accept.

---

## Dialog text and buttons

| Host action           | Title                               | Buttons                                                           |
| --------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| Asks you to unmute    | "The host would like you to unmute" | "Unmute myself", "Stay muted"                                     |
| Spotlights your video | "The host would like you to unmute" | "Unmute myself" (or "Join audio" if audio is not joined), "Later" |

For an unmute request, the message reads "If you choose to unmute, others in the session will be able to hear you."
For a spotlight, it asks whether you want to unmute your microphone (or join audio) to speak.

- Accepting joins audio unmuted when audio is not joined; otherwise it unmutes the microphone. The dialog then closes.
- "Stay muted", "Later", or closing the dialog leaves your audio unchanged.
- The dialog closes on its own if you become unmuted another way.

---

## Turning it off

Custom controls built only on `useAudioController` don't show this dialog. To turn it off while using `AudioButton`,
set `sessionOptions.audio.disableUnmuteConsentDialog`:

```tsx
import { ZoomUIToolkitProvider } from '@zoom/videosdk-ui-toolkit';

<ZoomUIToolkitProvider clientInstance={client} sessionOptions={{ audio: { disableUnmuteConsentDialog: true } }}>
  <YourVideoApp />
</ZoomUIToolkitProvider>;
```

---

## Building your own prompt

Listen for the Video SDK `host-ask-unmute-audio` event on the client, and use `useAudioController` to act on the
user's choice. If `AudioButton` is also displayed, turn its dialog off as shown above so users don't see two prompts.

```tsx
import { useEffect, useState } from 'react';
import { useAudioController, useZoomUIToolkit } from '@zoom/videosdk-ui-toolkit';

function HostUnmutePrompt() {
  const { client } = useZoomUIToolkit();
  const { audioState, toggleAudio } = useAudioController();
  const [isOpen, setIsOpen] = useState(false);
  const isUnmuted = audioState.isJoined && !audioState.isMuted;

  useEffect(() => {
    if (!client) return;
    const handleAskUnmute = () => setIsOpen(true);
    client.on('host-ask-unmute-audio', handleAskUnmute);
    return () => client.off('host-ask-unmute-audio', handleAskUnmute);
  }, [client]);

  // Close the prompt if the user unmutes another way.
  useEffect(() => {
    if (isUnmuted) setIsOpen(false);
  }, [isUnmuted]);

  if (!isOpen || isUnmuted) return null;

  return (
    <div role='dialog' aria-label='The host would like you to unmute'>
      <button type='button' onClick={() => setIsOpen(false)}>
        Stay muted
      </button>
      <button
        type='button'
        onClick={() => {
          setIsOpen(false);
          // Joins audio unmuted if not joined; otherwise unmutes.
          void toggleAudio();
        }}
      >
        Unmute myself
      </button>
    </div>
  );
}
```
