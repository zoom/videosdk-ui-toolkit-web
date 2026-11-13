# uitoolkit-integration › components

Use this guide to pick the right Layer 3 component. Each row links to the component's guide with full usage details, or to its API contract when there is no separate guide.

See the [integration overview](../SKILL.md) for architecture and layer selection.
For pre-built module-level components, see [modules/README.md](../modules/README.md).

---

## Session controls

| Component                           | Guide                                            | Description                                  |
| ----------------------------------- | ------------------------------------------------ | -------------------------------------------- |
| JoinButton                          | [join-button.md](join-button.md)                 | Join with built-in loading state             |
| LeaveButton                         | [leave-button.md](leave-button.md)               | Leave/end session                            |
| ReclaimHostBanner                   | [reclaim-host-banner.md](reclaim-host-banner.md) | Lets the original host reclaim the host role |
| SessionInfoButton, SessionInfoPanel | [session-info.md](session-info.md)               | Session details button and panel             |

## Media controls

| Component            | Guide                                              | Description                                                 |
| -------------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| AudioButton          | [audio-button.md](audio-button.md)                 | Mute/unmute toggle                                          |
| VideoButton          | [video-button.md](video-button.md)                 | Camera on/off                                               |
| ShareButton          | [share-button.md](share-button.md)                 | Start local screen share, with a floating sharing bar       |
| RecordButton         | [record-button.md](record-button.md)               | Host/co-host cloud recording controls                       |
| Host unmute requests | [host-unmute-requests.md](host-unmute-requests.md) | Dialog `AudioButton` shows when the host asks you to unmute |

`ZoomUIToolkitProvider` shows a notification when camera or microphone access is blocked. You do not need to render your own no-permission banners.

## Video & share tiles

| Component         | Guide                                                                             | Description                                        |
| ----------------- | --------------------------------------------------------------------------------- | -------------------------------------------------- |
| VideoLayout       | [video-layout.md](video-layout.md)                                                | Auto participant tile grid                         |
| ParticipantTile   | [participant-tile.md](participant-tile.md)                                        | Single participant tile                            |
| MobileVideoLayout | [mobile-video-layout.json](../api/components/mobile-video-layout.json) (contract) | Fixed four-cell participant grid for small screens |
| ShareViewLayout   | [share-view-layout.md](share-view-layout.md)                                      | Auto share tile grid                               |
| ShareTile         | [share-tile.md](share-tile.md)                                                    | Single sharer tile                                 |

## Participant panel

| Component         | Guide                                          | Description                |
| ----------------- | ---------------------------------------------- | -------------------------- |
| ParticipantButton | [participant-button.md](participant-button.md) | Opens the participant list |
| ParticipantPanel  | [participant-panel.md](participant-panel.md)   | Participant list panel     |

## Chat

| Component  | Guide              | Description                                                     |
| ---------- | ------------------ | --------------------------------------------------------------- |
| ChatButton | [chat.md](chat.md) | Session chat with recipients, unread badge, and chat privileges |

## Settings

| Component      | Guide                                    | Description                                                                                           |
| -------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| SettingsButton | [settings-button.md](settings-button.md) | Opens the Settings panel in a draggable desktop panel or a mobile bottom sheet                        |
| SettingsPanel  | [settings-panel.md](settings-panel.md)   | Settings with Audio, Video, Share screen, and Statistics tabs; use directly inside your own container |

## Utility components

| Component     | Guide                                  | Description                                      |
| ------------- | -------------------------------------- | ------------------------------------------------ |
| MoreButton    | [more-button.md](more-button.md)       | Menu of custom controls or built-in buttons      |
| ToolbarButton | [toolbar-button.md](toolbar-button.md) | Base styled toolbar button for custom actions    |
| ThemeProvider | [theme-provider.md](theme-provider.md) | Light or dark theme for the components inside it |
