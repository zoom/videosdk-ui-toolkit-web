# uitoolkit-integration › modules

Use this guide to pick the right Layer 2 module. Each module has its own guide with full usage details.

| Module                | Guide                                                    | Description                                                                                                                   |
| --------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Toolbar               | [toolbar.md](toolbar.md)                                 | Pre-built session control bar                                                                                                 |
| ParticipantView       | [participant-view.md](participant-view.md)               | Paginated participant video grid (desktop / large screens)                                                                    |
| MobileParticipantView | [mobile-participant-view.md](mobile-participant-view.md) | Touch-first swipeable participant view for phones; shows a received share as the first page                                   |
| ActiveSpeakerView     | [active-speaker-view.md](active-speaker-view.md)         | Single large tile for the active video participant (`participantState.activeVideoUser`)                                       |
| ShareViewerView       | [share-viewer-view.md](share-viewer-view.md)             | Screen shares received from other participants. Render it only while a share is being received, unless you want an idle panel |
| SharePresenterView    | [share-presenter-view.md](share-presenter-view.md)       | Preview of your own shared screen                                                                                             |
| TopBar                | [topbar.md](topbar.md)                                   | Session header with a session info button and recording indicator on the left, and your own controls on the right             |

See the [integration overview](../SKILL.md) for architecture and layer selection.

To show received screen shares, use a conditional layout: show `ParticipantView` while no share is being received, and switch to `ShareViewerView` while `shareState.isReceivingShare` is `true`. When no share is being received, `ShareViewerView` shows a large "No active screen share" panel, so keep it rendered only if you want that idle panel.
