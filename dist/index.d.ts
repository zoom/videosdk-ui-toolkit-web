import { ChatClient } from '@zoom/videosdk';
import { ChatPrivilege } from '@zoom/videosdk';
import { ComponentPropsWithoutRef } from 'react';
import { ConnectionState } from '@zoom/videosdk';
import { CSSProperties } from 'react';
import { ForwardRefExoticComponent } from 'react';
import { JSX } from 'react/jsx-runtime';
import { LocalAudioTrack } from '@zoom/videosdk';
import { MouseEventHandler } from 'react';
import { Participant } from '@zoom/videosdk';
import { ReactNode } from 'react';
import { RecordingStatus } from '@zoom/videosdk';
import { RefAttributes } from 'react';
import { ScreenShareOption } from '@zoom/videosdk';
import { SharePrivilege } from '@zoom/videosdk';
import { VideoClient } from '@zoom/videosdk';
import { VideoQuality } from '@zoom/videosdk';

/**
 * Renders the current active video participant in a single responsive tile.
 * Empty until the session is connected and an active video participant is reported.
 */
export declare function ActiveSpeakerView({ className, style, tileAspectRatio, hidden, }: ActiveSpeakerViewProps): JSX.Element;

/** Props for a view that follows the SDK-selected active video participant. */
export declare interface ActiveSpeakerViewProps {
    /** Additional class applied to the view root. */
    className?: string;
    /** Inline root styles; `backgroundColor` and `color` also flow to the participant tile. */
    style?: CSSProperties;
    /** Tile width divided by tile height. Must be greater than zero. Defaults to `16 / 9`. */
    tileAspectRatio?: number;
    /** Hide the view with `display: none` while keeping it mounted. Defaults to `false`. */
    hidden?: boolean;
}

/**
 * Joins audio and toggles mute; once audio is joined, a menu lets users choose a microphone and speaker or leave audio.
 * Disabled until the session is connected.
 */
export declare function AudioButton(props: AudioButtonProps): JSX.Element;

/** Static content or a callback that receives the current audio-button render context. */
export declare type AudioButtonContentRenderer = ReactNode | ((context: AudioButtonRenderContext) => ReactNode);

/** Props for the audio join, mute, and device-menu control. */
export declare interface AudioButtonProps {
    /** Additional class applied to the button or split-button root. */
    className?: string;
    /** Inline styles applied to the button or split-button root. */
    style?: CSSProperties;
    /** Render menu choices in a bottom sheet instead of a desktop dropdown. Defaults to `false`. */
    isMobile?: boolean;
    /**
     * Show the device menu while audio is joined and audio controls or custom `menuGroups` are available.
     * Defaults to `true`.
     */
    showMenu?: boolean;
    /** Custom groups added after the microphone, speaker, and leave-audio groups; shown only while audio is joined. */
    menuGroups?: ToolbarMenuGroup[];
    /** Desktop dropdown positioning, portal, class, and style overrides. */
    dropdownOptions?: ToolbarMenuDropdownOptions;
    /** Per-state replacement content for the main audio control. */
    renderContent?: AudioButtonRenderContent;
}

/** Custom content for each mutually exclusive `AudioButton` visual state. */
export declare interface AudioButtonRenderContent {
    /** Content shown while audio is not joined. */
    joinAudio?: AudioButtonContentRenderer;
    /** Content shown while joined and muted. */
    muted?: AudioButtonContentRenderer;
    /** Content shown while joined and unmuted. */
    unmuted?: AudioButtonContentRenderer;
    /** Content shown while joining, leaving, muting, or unmuting audio; takes precedence over other states. */
    loading?: AudioButtonContentRenderer;
    /** Content shown for an active audio warning when no operation is pending. */
    warning?: AudioButtonContentRenderer;
}

/** State and actions supplied to an `AudioButton` content-render callback. Actions do nothing while disconnected. */
export declare interface AudioButtonRenderContext {
    /** Current local audio state. */
    audioState: AudioState;
    /** Available and selected media devices. */
    deviceState: DeviceState;
    /** Whether audio controls are available in the connected session. */
    canControlAudio: boolean;
    /** Localized label for the main button's action; its accessible label except while an operation is pending. */
    label: string;
    /** Localized accessible label for the audio-options menu trigger. */
    menuLabel: string;
    /** Whether the main audio action is currently disabled. */
    isDisabled: boolean;
    /** Whether the audio-options menu trigger is currently disabled. */
    isMenuTriggerDisabled: boolean;
    /** Join audio unmuted when not joined; otherwise toggle the current mute state. */
    toggleAudio: () => Promise<void>;
    /** Leave session audio without leaving the video session. */
    leaveAudio: () => Promise<void>;
    /** Switch to the microphone with this `deviceId`. */
    switchMicrophone: (deviceId: string) => Promise<void>;
    /** Switch to the speaker with this `deviceId`. */
    switchSpeaker: (deviceId: string) => Promise<void>;
}

/** State and operations for controlling the local participant's session audio. */
export declare interface AudioController {
    /** Current toolkit audio state. */
    audioState: AudioState;
    /** Whether the Video SDK client has a media stream. Does not check the connection state. */
    canControlAudio: boolean;
    /** Whether the current SDK/browser combination supports background noise suppression. */
    canUseNoiseSuppression: boolean;
    /** Whether WebHID is available for synchronizing supported headset buttons. */
    canUseHeadsetSync: boolean;
    /** Join audio unmuted when not joined; otherwise toggle the current mute state. */
    toggleAudio: () => Promise<void>;
    /**
     * Join computer audio using the selected microphone and speaker, with noise suppression set to
     * `sessionOptions.audio.noiseSuppression`. On failure, also shows an error notification.
     */
    joinAudio: (options?: {
        /** Join with the local microphone muted. Defaults to `false`. */
        muted?: boolean;
    }) => Promise<void>;
    /** Leave session audio without leaving the video session. */
    leaveAudio: () => Promise<void>;
    /** Switch to the microphone with this `deviceId`. */
    switchMicrophone: (deviceId: string) => Promise<void>;
    /** Switch to the speaker with this `deviceId`. */
    switchSpeaker: (deviceId: string) => Promise<void>;
    /**
     * Enable or disable SDK background noise suppression; enabling it disables original sound.
     * The next `joinAudio` resets it to `sessionOptions.audio.noiseSuppression`.
     */
    setNoiseSuppression: (enabled: boolean) => Promise<void>;
    /** Enable or disable SDK original sound; enabling it disables background noise suppression. */
    setOriginalSound: (enabled: boolean) => Promise<void>;
    /** Enable or disable synchronization with supported physical headset buttons. */
    setHeadsetSync: (enabled: boolean) => Promise<void>;
}

/** Audio behavior configured on `ZoomUIToolkitProvider`. */
export declare interface AudioOptionType {
    /** Enable background noise suppression when joining audio. Defaults to `false`. */
    noiseSuppression?: boolean;
    /** Hide the dialog `AudioButton` shows when the host asks you to unmute. Defaults to `false`. */
    disableUnmuteConsentDialog?: boolean;
}

/** Local audio state maintained by the toolkit. */
export declare interface AudioState {
    /**
     * Whether the local participant has joined session audio by computer or phone. Updates only while `AudioButton`,
     * the `SettingsPanel` Audio tab, or a component that calls `useAudioController` is mounted.
     */
    isJoined: boolean;
    /** Whether the local microphone is muted; always `true` while audio is not joined. Updates like `isJoined`. */
    isMuted: boolean;
    /** Whether a toolkit audio join, leave, mute, or unmute operation is pending. */
    isLoading: boolean;
    /**
     * Value of `sessionOptions.audio.noiseSuppression`, applied each time audio is joined.
     * `setNoiseSuppression` does not change it; see `noiseSuppressionEnabled`.
     */
    noiseSuppression: boolean;
    /** Current SDK noise-suppression setting; undefined until audio is joined through the toolkit or it is changed. */
    noiseSuppressionEnabled?: boolean;
    /** Applied SDK original-sound state; undefined until the toolkit has changed it. */
    originalSound?: boolean;
    /** Applied headset-button synchronization state; undefined until the toolkit has changed it. */
    headsetSync?: boolean;
    /** Latest audio problem, such as denied microphone permission or a failed action; `null` when there is none. */
    warning: MediaWarning | null;
}

/**
 * Opens session chat in a desktop floating panel or mobile bottom sheet.
 * Disabled unless the session is connected and chat is available.
 */
export declare function ChatButton({ className, style, renderContent, onOpen, onClose, onMessageSent, isMobile, panelClassName, panelStyle, anchor, popoverProps, messageBubbleStyles, }: ChatButtonProps): JSX.Element;

/** Desktop placement overrides for the chat panel. */
export declare interface ChatButtonPopoverProps {
    /** Preferred side of the trigger (or `anchor`); the panel may move to the opposite side to stay visible. Defaults to `'top'`. */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** Alignment along the selected side. Defaults to `'start'`. */
    align?: 'start' | 'center' | 'end';
    /** Distance from the trigger (or `anchor`) in CSS pixels. Defaults to `8`. */
    sideOffset?: number;
    /** Offset along the alignment axis in CSS pixels. */
    alignOffset?: number;
    /** Minimum viewport-edge gap in CSS pixels. Defaults to `12`. */
    collisionPadding?: number;
}

/** Props for the unread-count chat trigger and its chat panel. */
export declare interface ChatButtonProps {
    /** Additional class applied to the trigger. */
    className?: string;
    /** Inline styles applied to the trigger. */
    style?: CSSProperties;
    /** Render a custom icon in place of the default chat icon. */
    renderContent?: () => ReactNode;
    /** Called when the chat panel opens. */
    onOpen?: () => void;
    /** Called when the chat panel closes. */
    onClose?: () => void;
    /** Called after a message is sent, with its trimmed text and the receiver's user id (`0` for everyone). */
    onMessageSent?: (message: string, receiverId: number) => void;
    /** Render the chat panel in a bottom sheet instead of a desktop floating panel. Defaults to `false`. */
    isMobile?: boolean;
    /** Additional class applied to the chat panel. */
    panelClassName?: string;
    /** Inline styles applied to the chat panel. */
    panelStyle?: CSSProperties;
    /**
     * Anchor the desktop panel to a custom element (or virtual element with
     * `getBoundingClientRect`) instead of the button itself. Ignored on mobile.
     */
    anchor?: VirtualElement | null;
    /** Positioning overrides for the desktop panel. */
    popoverProps?: ChatButtonPopoverProps;
    /** Inline style overrides for incoming and outgoing message bubbles. */
    messageBubbleStyles?: ChatMessageBubbleStyles;
}

/** One message returned by the Video SDK chat history API. */
export declare type ChatMessage = ReturnType<ZoomChatClient['getHistory']>[number];

/** Inline style overrides for chat message bubbles. */
export declare interface ChatMessageBubbleStyles {
    /** Styles for messages from other participants. */
    incoming?: CSSProperties;
    /** Styles for the local participant's messages. */
    outgoing?: CSSProperties;
}

/** One available recipient returned by the Video SDK chat receiver API. */
export declare type ChatReceiver = ReturnType<ZoomChatClient['getReceivers']>[number];

/**
 * Chat history, recipients, privileges, and unread state maintained by the toolkit.
 * `draftMessage`, `receiverId`, and `pendingSendId` are set only by the `ChatButton` panel.
 */
export declare interface ChatState {
    /** Current SDK chat history plus messages received during the session. */
    messages: ChatMessage[];
    /** Available chat recipients, including the everyone entry (`userId` `0`). */
    receivers: ChatReceiver[];
    /** Who can send chat messages in this session. Defaults to `ChatPrivilege.All`. */
    privilege: ChatPrivilege;
    /** Whether a chat client is available for the connected session. */
    isAvailable: boolean;
    /**
     * Unread non-empty messages from other participants since the session connected. Cleared when the `ChatButton`
     * panel shows the latest message; deleting an unread message lowers it.
     */
    unreadCount: number;
    /** Ids of the unread messages counted in `unreadCount`. */
    unreadMessageIds: string[];
    /** Unsent message text, kept when chat reopens or the recipient changes and cleared after a successful send. */
    draftMessage: string;
    /** Selected recipient id: `'0'` for everyone, or an empty string when no recipient is selected. */
    receiverId: string;
    /** Identifier of the send pending for the current draft, or `null` when no send is pending. */
    pendingSendId: number | null;
}

export { ConnectionState }

/** Available and selected media devices synchronized from the Video SDK. */
export declare interface DeviceState {
    /** Available camera devices. Empty until the session connects. */
    cameras: MediaDevice[];
    /** Available microphone devices. Empty until the session connects. */
    microphones: MediaDevice[];
    /** Available speaker devices. Empty until the session connects; browser/platform support can also leave it empty. */
    speakers: MediaDevice[];
    /** Selected camera id, or `null` before a device is known. */
    activeCameraId: string | null;
    /** Selected microphone id, or `null` before a device is known. */
    activeMicrophoneId: string | null;
    /** Selected speaker id, or `null` before a device is known. */
    activeSpeakerId: string | null;
    /** Whether a camera switch requested through the toolkit is pending. */
    isSwitchingCamera: boolean;
    /** Whether a microphone switch requested through the toolkit is pending. */
    isSwitchingMicrophone: boolean;
    /** Whether a speaker switch requested through the toolkit is pending. */
    isSwitchingSpeaker: boolean;
}

/** Video directions to update when configuring SDK hardware acceleration. */
declare interface HardwareAccelerationOption {
    /** Enable or disable hardware-accelerated encoding for sent video. */
    encode?: boolean;
    /** Enable or disable hardware-accelerated decoding for received video. */
    decode?: boolean;
}

/**
 * Joins the session in `joinParameters`; failures are reported in `useZoomUIToolkit().sessionState.errorMessage`.
 * Disabled until `ZoomUIToolkitProvider` has a client, and while joining.
 */
export declare function JoinButton({ joinParameters, className, style, fullWidth }: JoinButtonProps): JSX.Element;

/** Props for the session join control. */
export declare interface JoinButtonProps {
    /** Session credentials and identity used for the join request. */
    joinParameters: JoinSessionParams;
    /** Additional class applied to the button. */
    className?: string;
    /** Inline styles applied to the button. */
    style?: CSSProperties;
    /** Expand the button to the width of its container. Defaults to `false`. */
    fullWidth?: boolean;
}

/** Video SDK arguments used by `JoinButton` to join a session. */
export declare interface JoinSessionParams {
    /** Session name; must match the topic in the token. Required to enable the button. */
    topic: string;
    /** Video SDK JWT used to authenticate the join request. */
    token: string;
    /** Display name for the local participant. Required to enable the button. */
    userName: string;
    /** Password for a password-protected session. */
    sessionPassword?: string;
    /**
     * Minutes the session can stay idle with one participant before it ends. Applies only to the host
     * or original host; otherwise the 40-minute default is used.
     */
    sessionIdleTimeoutMins?: number;
}

/**
 * Renders a direct leave action for participants or a leave/end menu for the host.
 * Disabled until the session is connected and while leaving.
 */
export declare function LeaveButton({ className, style, fullWidth, isMobile, renderContent, onClick, anchor, popoverProps, menuClassName, menuStyle, }: LeaveButtonProps): JSX.Element;

/** Desktop placement overrides for the host leave/end-session menu. */
export declare interface LeaveButtonPopoverProps {
    /** Preferred side of the trigger (or `anchor`); the menu may move to the opposite side to stay visible. Defaults to `'top'`. */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** Alignment along the selected side. Defaults to `'start'`. */
    align?: 'start' | 'center' | 'end';
    /** Distance from the trigger (or `anchor`) in CSS pixels. Defaults to `10`. */
    sideOffset?: number;
    /** Offset along the alignment axis in CSS pixels. */
    alignOffset?: number;
    /** Minimum viewport-edge gap in CSS pixels. Defaults to `12`. */
    collisionPadding?: number;
}

/** Props for leaving a session or, for hosts, choosing how the session should end. */
export declare interface LeaveButtonProps {
    /** Additional class applied to the default trigger. */
    className?: string;
    /** Inline styles applied to the default trigger. */
    style?: CSSProperties;
    /** Expand the default trigger to the width of its container. Defaults to `false`. */
    fullWidth?: boolean;
    /** Render the host menu and assign-host step in a bottom sheet instead of a desktop popover. Defaults to `false`. */
    isMobile?: boolean;
    /**
     * Render a custom trigger. Its underlying button must use the supplied `disabled` and `onClick`
     * values; for the host it must also forward its ref and any props it receives so the menu can open.
     */
    renderContent?: (props: LeaveButtonRenderContent) => ReactNode;
    /**
     * Called when the trigger is clicked. For the host, also called after an end, leave, or
     * assign-and-leave menu action, even if leaving fails.
     */
    onClick?: () => void;
    /**
     * Anchor the host's desktop menu to a custom element (or virtual element with
     * `getBoundingClientRect`) instead of the button itself. Ignored on mobile.
     */
    anchor?: VirtualElement | null;
    /** Positioning overrides for the host's desktop menu. */
    popoverProps?: LeaveButtonPopoverProps;
    /** Additional class applied to the host menu's desktop popover or mobile sheet body. */
    menuClassName?: string;
    /** Inline styles applied to the host menu's desktop popover or mobile sheet body. */
    menuStyle?: CSSProperties;
}

/** State and required trigger behavior supplied to a custom `LeaveButton` renderer. */
export declare interface LeaveButtonRenderContent {
    /** Whether the local participant is currently the session host. */
    isHost: boolean;
    /** Whether a leave operation is pending. */
    isBusy: boolean;
    /** Whether the Video SDK session is connected. */
    isConnected: boolean;
    /** Whether the rendered trigger must be disabled. */
    disabled: boolean;
    /**
     * Click handler the trigger must forward to its underlying button.
     * - For the host, this calls your `onClick`; the menu opens separately.
     * - For other participants, this calls your `onClick` and then leaves the session.
     */
    onClick: () => void;
}

/** Browser media device exposed by toolkit device state. */
export declare interface MediaDevice {
    /** Browser-provided display label; it can be empty until media permission is granted. */
    label: string;
    /** Browser device id accepted by the controller's switch method. */
    deviceId: string;
}

/** Audio or video problem reported in `audioState.warning` or `videoState.warning`. */
export declare interface MediaWarning {
    /**
     * `'permission'` when microphone or camera access is denied, `'operation'` when an action fails;
     * `'unknown'` is reserved.
     */
    type: 'permission' | 'operation' | 'unknown';
    /** Failure detail, when available. May be a Video SDK error code, so show your own text based on `type`. */
    message?: string;
}

/** Steps of the `SettingsPanel` microphone test. */
export declare enum MicTestPhase {
    /** No microphone test is running. */
    Idle = "idle",
    /** The microphone test is capturing local audio. */
    Recording = "recording",
    /** The microphone test is playing the captured audio back. */
    Playing = "playing"
}

/** Renders swipeable mobile video pages and places an active remote share on the first page. */
export declare function MobileParticipantView({ className, style, isShowSelf, paginationDirection, hidePagination, hidden, }: MobileParticipantViewProps): JSX.Element;

/**
 * Props for the mobile participant view. Pages always contain up to four video tiles and size
 * tiles to the available grid, so `pageSize` and `tileAspectRatio` are not configurable.
 */
export declare interface MobileParticipantViewProps extends Omit<PaginatedTileViewProps, 'tileAspectRatio' | 'pageSize'> {
    /** Additional class applied to the view root. */
    className?: string;
    /** Inline root styles; `backgroundColor` and `color` also flow to participant tiles. */
    style?: CSSProperties;
    /** Include the local participant in video pages. Defaults to `true`. */
    isShowSelf?: boolean;
    /** Hide the view with `display: none` while keeping it mounted. Defaults to `false`. */
    hidden?: boolean;
}

/**
 * Arranges up to four participant videos in a fixed four-cell grid: one row when the grid is more than twice as wide as
 * it is tall, otherwise two rows of two. Tiles appear only while the session is connected.
 */
export declare const MobileVideoLayout: ({ participants, width, height, gap, activeSpeakerBorder, renderVideo, }: MobileVideoLayoutProps) => JSX.Element;

/** Props for the fixed four-cell mobile video grid. */
export declare interface MobileVideoLayoutProps {
    /** Participants to render, in display order. At most four are shown, fewer if SDK rendering limits are lower. */
    participants: Participant[];
    /** Grid width in CSS pixels. */
    width: number;
    /** Grid height in CSS pixels. */
    height: number;
    /** Space between cells and around the grid edges in CSS pixels. Defaults to `8`. */
    gap?: number;
    /** Highlight the active video participant when the session has more than two participants. Defaults to `true`. */
    activeSpeakerBorder?: boolean;
    /** Attach participant video; set to `false` for an offscreen page. Defaults to `true`. */
    renderVideo?: boolean;
}

/** Groups extra controls in a desktop popover or mobile bottom sheet. Using a control does not close the menu. */
export declare function MoreButton({ buttons, isMobile, className, style, menuClassName, menuStyle, }: MoreButtonProps): JSX.Element;

/** Props for the overflow button that groups extra controls in a menu. */
export declare interface MoreButtonProps {
    /** Controls shown in the menu, in display order; `null`, `undefined`, and boolean entries are skipped. Defaults to `[]`. */
    buttons?: readonly ReactNode[];
    /**
     * Render the menu in a bottom sheet instead of a desktop popover; platform detection is used when omitted.
     * Supplied buttons don't inherit this value.
     */
    isMobile?: boolean;
    /** Additional class applied to the trigger. */
    className?: string;
    /** Inline styles applied to the trigger. */
    style?: CSSProperties;
    /** Additional class applied to the desktop popover or mobile sheet body. */
    menuClassName?: string;
    /** Inline styles applied to the desktop popover or mobile sheet body. */
    menuStyle?: CSSProperties;
}

/** Shared pagination and tile sizing props for participant and multi-share views. */
declare interface PaginatedTileViewProps {
    /** Maximum entries per page. Must be greater than zero. Defaults to `4`. */
    pageSize?: number;
    /** Tile width divided by tile height. Must be greater than zero. Defaults to `16 / 9`. */
    tileAspectRatio?: number;
    /** Page navigation axis: previous/next buttons on desktop, or swipe direction and page dots on mobile. Defaults to `'horizontal'`. */
    paginationDirection?: PaginationDirection;
    /**
     * Hide the previous/next buttons on desktop, so users can't change pages, or the page dots on mobile,
     * where swiping still works. Defaults to `false`.
     */
    hidePagination?: boolean;
}

/** Axis used for participant/share page navigation. */
declare type PaginationDirection = 'horizontal' | 'vertical';

export { Participant }

/**
 * Opens the participant list in a desktop floating panel or mobile bottom sheet.
 * Disabled until the session is connected.
 */
export declare function ParticipantButton({ className, style, renderContent, onOpen, onClose, isMobile, panelClassName, panelStyle, anchor, popoverProps, }: ParticipantButtonProps): JSX.Element;

/** Desktop placement overrides for the participant panel. */
export declare interface ParticipantButtonPopoverProps {
    /** Preferred side of the trigger (or `anchor`); the panel may move to the opposite side to stay visible. Defaults to `'top'`. */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** Alignment along the selected side. Defaults to `'start'`. */
    align?: 'start' | 'center' | 'end';
    /** Distance from the trigger (or `anchor`) in CSS pixels. Defaults to `8`. */
    sideOffset?: number;
    /** Offset along the alignment axis in CSS pixels. */
    alignOffset?: number;
    /** Minimum viewport-edge gap in CSS pixels. Defaults to `12`. */
    collisionPadding?: number;
}

/** Props for the participant-count trigger and its participant panel. */
export declare interface ParticipantButtonProps {
    /** Additional class applied to the trigger. */
    className?: string;
    /** Inline styles applied to the trigger. */
    style?: CSSProperties;
    /** Render a custom icon in place of the default Users icon. */
    renderContent?: () => ReactNode;
    /** Called when the participant panel opens. */
    onOpen?: () => void;
    /** Called when the participant panel closes. */
    onClose?: () => void;
    /** Render the participant panel in a bottom sheet instead of a desktop floating panel. Defaults to `false`. */
    isMobile?: boolean;
    /** Additional class applied to the desktop participant panel. */
    panelClassName?: string;
    /** Inline styles applied to the desktop participant panel. */
    panelStyle?: CSSProperties;
    /**
     * Anchor the desktop panel to a custom element (or virtual element with
     * `getBoundingClientRect`) instead of the button itself. Ignored on mobile.
     */
    anchor?: VirtualElement | null;
    /** Positioning overrides for the desktop panel. */
    popoverProps?: ParticipantButtonPopoverProps;
}

/** Renders the connected participant list with role-appropriate participant actions. */
export declare function ParticipantPanel({ className, style, anchor, placement, open, isMobile, onClose, }: ParticipantPanelProps): JSX.Element;

/** Props for the searchable participant list and moderation controls. */
export declare interface ParticipantPanelProps {
    /** Additional class applied to the desktop panel. */
    className?: string;
    /** Inline styles applied to the desktop panel. */
    style?: CSSProperties;
    /** Position the desktop panel beside this element and keep it within the viewport. Omit to render inline. */
    anchor?: HTMLElement | null;
    /** Preferred side of `anchor`; the panel may move to stay within the viewport. Defaults to `'top'`. */
    placement?: 'top' | 'bottom';
    /** Controls visibility. Defaults to `true`. */
    open?: boolean;
    /**
     * Render only the panel content for your own container, such as a bottom sheet; row menus open as sheets.
     * Defaults to `false`.
     */
    isMobile?: boolean;
    /**
     * Shows a close button and is called when it is pressed; with `anchor`, also on Escape or an outside click.
     * The panel does not hide itself; set `open` to `false` in response.
     */
    onClose?: () => void;
}

/** Participant collections and active-participant selections synchronized from the Video SDK. */
export declare interface ParticipantState {
    /** Current session participants, including the local participant. */
    participants: Participant[];
    /** Local participant, or `null` before connection and after disconnect. */
    currentUser: Participant | null;
    /** Participant from the latest active-video change reported by the Video SDK, or `null` before the first report. */
    activeVideoUser: Participant | null;
    /** Participants currently reported as active speakers. */
    activeSpeakers: Participant[];
    /** Other participants currently sharing, in the order they started. Your own share is not included. */
    activeShareUsersList: Participant[];
    /** Participant whose received share is currently active, or `null` when none is, including when only you are sharing. */
    activeShareUser: Participant | null;
}

/**
 * Renders one participant's video with a name tag, or their name when video is off or `renderVideo` is false.
 * On its own, render it inside a `<video-player-container>`; `VideoLayout` and `MobileVideoLayout` provide one.
 */
export declare const ParticipantTile: ({ participant, width, height, aspectRatio, videoQuality, isActive, renderVideo, activeClassName, activeStyle, className, style, customNameTag, }: ParticipantTileProps) => JSX.Element;

/** Props for rendering one Video SDK participant tile. */
export declare interface ParticipantTileProps {
    /** Participant whose name, audio status, and video should be rendered. */
    participant: Participant;
    /** Tile width in CSS pixels. */
    width: number;
    /** Fallback tile height in CSS pixels when `aspectRatio` is zero. */
    height: number;
    /** Width-to-height ratio used to derive the rendered height. Defaults to `16 / 9`. */
    aspectRatio?: number;
    /** Video SDK receive quality requested for this participant. Defaults to `Video_360P`. */
    videoQuality?: VideoQuality;
    /** Apply active-speaker styling. Defaults to `false`. */
    isActive?: boolean;
    /** Attach participant video when available; set to `false` for an offscreen page. Defaults to `true`. */
    renderVideo?: boolean;
    /** Class used instead of the built-in active border when `isActive` is true. */
    activeClassName?: string;
    /** Inline styles merged after `style` when `isActive` is true. */
    activeStyle?: CSSProperties;
    /** Additional class applied to the tile root. */
    className?: string;
    /** Inline styles for the tile root; size and, while video is on, background color are overridden. */
    style?: CSSProperties;
    /** Content that replaces the default name tag; the video-off view still shows the participant's name separately. */
    customNameTag?: ReactNode;
}

/** Renders connected-session participants in a responsive paginated tile layout. */
export declare function ParticipantView({ className, style, tileAspectRatio, pageSize, isShowSelf, paginationDirection, hidePagination, hidden, }: ParticipantViewProps): JSX.Element;

/** Props for a paginated desktop participant-video view. */
export declare interface ParticipantViewProps extends PaginatedTileViewProps {
    /** Additional class applied to the view root. */
    className?: string;
    /** Inline root styles; `backgroundColor` and `color` also flow to participant tiles. */
    style?: CSSProperties;
    /** Include the local participant in the paginated list. Defaults to `true`. */
    isShowSelf?: boolean;
    /** Hide the view with `display: none` while keeping it mounted. Defaults to `false`. */
    hidden?: boolean;
}

/**
 * Prompts the original host to reclaim the host role; appears at the top center of the page.
 * `ZoomUIToolkitProvider` already renders one, so set `sessionOptions.session.disableReclaimHostBanner`
 * to `true` before rendering your own inside it.
 */
export declare function ReclaimHostBanner({ className, style, withOwnViewport }: ReclaimHostBannerProps): JSX.Element;

/** Props for the original-host reclaim notification. */
export declare interface ReclaimHostBannerProps {
    /** Additional class applied to the banner. */
    className?: string;
    /** Inline styles applied to the banner. */
    style?: CSSProperties;
    /**
     * Render the area the banner appears in. Defaults to `true`. With `false`, the banner appears
     * only if another `ReclaimHostBanner` is mounted under the same `ZoomUIToolkitProvider`.
     */
    withOwnViewport?: boolean;
}

/** Starts cloud recording and, while recording, opens a menu to pause, resume, or stop it. Only hosts and co-hosts can use it. */
export declare function RecordButton({ className, style, isMobile, showMenu, menuGroups, dropdownOptions, }: RecordButtonProps): JSX.Element;

/** Props for the cloud-recording start and action-menu control. */
export declare interface RecordButtonProps {
    /** Additional class applied to the recording trigger. */
    className?: string;
    /** Inline styles applied to the recording trigger. */
    style?: CSSProperties;
    /** Render recording actions in a bottom sheet instead of a desktop dropdown. Defaults to `false`. */
    isMobile?: boolean;
    /** Show pause/resume and stop actions while recording is active. Defaults to `true`; when `false`, the button is disabled during a recording. */
    showMenu?: boolean;
    /** Custom menu groups appended after the recording actions, shown only while a recording is active or paused. */
    menuGroups?: ToolbarMenuGroup[];
    /** Desktop dropdown positioning, portal, class, and style overrides. */
    dropdownOptions?: ToolbarMenuDropdownOptions;
}

/** State and privileged operations for SDK cloud recording. */
export declare interface RecordingController {
    /** Current Video SDK cloud-recording status. */
    recordingStatus: RecordingStatus;
    /** Whether cloud recording is enabled for the current account/session. */
    isCloudRecordingEnabled: boolean;
    /** Whether a recording operation requested through this hook instance is pending. */
    isLoading: boolean;
    /** Whether the local host or co-host can control recording now: connected, cloud recording enabled, and no action from this hook instance pending. */
    canControlRecording: boolean;
    /** Start cloud recording when it is inactive and `canControlRecording` is `true`. */
    startRecording: () => Promise<void>;
    /** Stop cloud recording when it is recording or paused and `canControlRecording` is `true`. */
    stopRecording: () => Promise<void>;
    /** Pause cloud recording when it is recording and `canControlRecording` is `true`. */
    pauseRecording: () => Promise<void>;
    /** Resume cloud recording when it is paused and `canControlRecording` is `true`. */
    resumeRecording: () => Promise<void>;
}

/** Recording behavior configured on `ZoomUIToolkitProvider`. */
export declare interface RecordingOptionType {
    /** Prevent the provider from rendering recording-consent dialogs. Defaults to `false`. */
    disableRecordingConsentDialog?: boolean;
}

export declare function Select({ options, value, onChange, disabled, ariaLabel, emptyLabel, open, onOpenChange, isMobile, triggerClassName, triggerIconClassName, }: SelectProps): JSX.Element;

export declare interface SelectProps {
    options: {
        value: string;
        label: string;
    }[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    ariaLabel: string;
    emptyLabel?: string;
    /** Controlled open state. Leave undefined for Radix's built-in uncontrolled behavior. */
    open?: boolean;
    /** Called when the dropdown requests to open/close. Pair with `open` to coordinate sibling Selects. */
    onOpenChange?: (open: boolean) => void;
    /** Uses touch-sized trigger and option rows for mobile surfaces. */
    isMobile?: boolean;
    triggerClassName?: string;
    triggerIconClassName?: string;
}

/** Session metadata returned by the Video SDK client. Includes the session password, so do not log or display it. */
export declare type SessionInfo = ReturnType<ZoomClient['getSessionInfo']>;

/**
 * Opens current session metadata in a desktop floating panel or mobile bottom sheet.
 * Disabled until the session is connected.
 */
export declare function SessionInfoButton({ className, style, showSessionName, renderContent, ariaLabel, isMobile, panelClassName, panelStyle, anchor, popoverProps, onOpen, onClose, inviteLink, }: SessionInfoButtonProps): JSX.Element;

/** Desktop placement overrides for the session-information panel. */
export declare interface SessionInfoButtonPopoverProps {
    /** Preferred side of the trigger (or `anchor`); the panel may move to the opposite side to stay visible. Defaults to `'bottom'`. */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** Alignment along the selected side. Defaults to `'start'`. */
    align?: 'start' | 'center' | 'end';
    /** Distance from the trigger (or `anchor`) in CSS pixels. Defaults to `8`. */
    sideOffset?: number;
    /** Offset along the alignment axis in CSS pixels. */
    alignOffset?: number;
    /** Minimum viewport-edge gap in CSS pixels. Defaults to `12`. */
    collisionPadding?: number;
}

/** Props for the session-information trigger and its detail panel. */
export declare interface SessionInfoButtonProps {
    /** Additional class applied to the trigger. */
    className?: string;
    /** Inline styles applied to the trigger. */
    style?: CSSProperties;
    /** Show the current session topic beside the icon. Defaults to `true`. */
    showSessionName?: boolean;
    /** Render custom leading content in place of the default Info icon. */
    renderContent?: () => ReactNode;
    /** Accessible label. Defaults to the localized "Session Info" title. */
    ariaLabel?: string;
    /** Render the session info panel in a bottom sheet instead of a desktop floating panel. Defaults to `false`. */
    isMobile?: boolean;
    /** Additional class applied to the desktop session info panel. */
    panelClassName?: string;
    /** Inline styles applied to the desktop session info panel. */
    panelStyle?: CSSProperties;
    /**
     * Anchor the desktop panel to a custom element (or virtual element with
     * `getBoundingClientRect`) instead of the button itself. Ignored on mobile.
     */
    anchor?: VirtualElement | null;
    /** Positioning overrides for the desktop panel. */
    popoverProps?: SessionInfoButtonPopoverProps;
    /** Called when the session info panel opens. */
    onOpen?: () => void;
    /** Called when the session info panel closes, including when the mobile sheet is dismissed. */
    onClose?: () => void;
    /** Invite link shown as a copyable row in the panel; omit or leave empty to hide it. */
    inviteLink?: string;
}

/** Renders Video SDK session metadata and optional copyable invitation details. */
export declare function SessionInfoPanel({ className, style, anchor, placement, open, isMobile, onClose, inviteLink, }: SessionInfoPanelProps): JSX.Element;

/** Props for the current session metadata panel. */
export declare interface SessionInfoPanelProps {
    /** Additional class applied to the desktop panel. */
    className?: string;
    /** Inline styles applied to the desktop panel. */
    style?: CSSProperties;
    /** Position the desktop panel beside this element and keep it within the viewport. Omit to render inline. */
    anchor?: HTMLElement | null;
    /** Preferred side of `anchor`; the panel may move to stay within the viewport. Defaults to `'bottom'`. */
    placement?: 'top' | 'bottom';
    /** Controls visibility. Defaults to `true`. */
    open?: boolean;
    /** Render only mobile panel content for an enclosing bottom sheet. Defaults to `false`. */
    isMobile?: boolean;
    /**
     * Shows a close button and is called when it is pressed; with `anchor`, also on Escape or an outside click.
     * The panel does not hide itself; set `open` to `false` in response.
     */
    onClose?: () => void;
    /** Invite link shown as a copyable row; omit or leave empty to hide it. */
    inviteLink?: string;
}

/** Optional feature configuration accepted by `ZoomUIToolkitProvider`. */
export declare interface SessionOptions {
    /** Audio defaults and consent behavior. */
    audio?: AudioOptionType;
    /** Video defaults and virtual-background choices. */
    video?: VideoOptionType;
    /** Recording consent behavior. */
    recording?: RecordingOptionType;
    /** Session-wide toolkit behavior. */
    session?: SessionOptionType;
}

/** Session-level behavior configured on `ZoomUIToolkitProvider`. */
export declare interface SessionOptionType {
    /** Prevent the provider from rendering the original-host reclaim banner. Defaults to `false`. */
    disableReclaimHostBanner?: boolean;
}

/** Session lifecycle data synchronized from the Video SDK and toolkit join/leave actions. */
export declare interface SessionState {
    /** Current Video SDK connection state. Defaults to `ConnectionState.Closed`. */
    connectionState: ConnectionState;
    /** SDK session metadata. Contains empty placeholder values until a session connects. */
    sessionInfo: SessionInfo;
    /** Whether a join started from `JoinButton` is pending; stays `false` if you call `client.join()` yourself. */
    isJoining: boolean;
    /** Whether a leave started from `LeaveButton` or the recording-consent dialog is pending. */
    isLeaving: boolean;
    /**
     * Latest error from `JoinButton`, `LeaveButton`, a recording-consent prompt, or a failed connection;
     * `null` when there is none.
     */
    errorMessage: string | null;
    /**
     * Video SDK reason for the latest connection change, or the error from a failed `LeaveButton` or recording-consent
     * action; `null` when there is none.
     */
    reason: string | null;
    /**
     * Whether the local user joined with an original-host token (`role_type === 1`), from `client.isOriginalHost()`.
     * Resets to `false` if the session reconnects or ends.
     */
    isOriginalHost: boolean;
}

/** Opens session media settings in a desktop floating panel or mobile bottom sheet. Disabled until the session is connected. */
export declare function SettingsButton({ className, style, renderContent, onOpen, onClose, isMobile, panelClassName, panelStyle, anchor, panelProps, popoverProps, }: SettingsButtonProps): JSX.Element;

/** Initial desktop placement for the settings panel; users can drag the panel afterward. */
declare interface SettingsButtonPopoverProps {
    /** Preferred side of the trigger (or `anchor`); the panel may move to the opposite side to stay visible. Defaults to `'top'`. */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** Alignment along the selected side. Defaults to `'start'`. */
    align?: 'start' | 'center' | 'end';
    /** Distance from the trigger in CSS pixels. Defaults to `8`. */
    sideOffset?: number;
    /** Offset along the alignment axis in CSS pixels. */
    alignOffset?: number;
    /** Minimum viewport-edge gap in CSS pixels. Defaults to `12`. */
    collisionPadding?: number;
}

/** Props for the settings trigger and its settings panel. */
export declare interface SettingsButtonProps {
    /** Additional class applied to the trigger. */
    className?: string;
    /** Inline styles applied to the trigger. */
    style?: CSSProperties;
    /** Render a custom icon in place of the default Settings icon. */
    renderContent?: () => ReactNode;
    /** Called when the settings panel opens. */
    onOpen?: () => void;
    /** Called when the settings panel closes. */
    onClose?: () => void;
    /** Render the settings panel in a bottom sheet instead of a desktop floating panel. Not detected automatically; defaults to `false`. */
    isMobile?: boolean;
    /** Additional class applied to the settings panel. */
    panelClassName?: string;
    /** Inline styles applied to the settings panel. */
    panelStyle?: CSSProperties;
    /**
     * Position the desktop panel against a custom element (or virtual element with
     * `getBoundingClientRect`) instead of the button when it opens. Ignored on mobile.
     */
    anchor?: VirtualElement | null;
    /** Props forwarded to the settings panel. */
    panelProps?: Omit<SettingsPanelProps, 'open' | 'onClose' | 'isMobile' | 'className' | 'style' | 'activeTab' | 'onTabChange'>;
    /** Positioning overrides for the desktop panel. */
    popoverProps?: SettingsButtonPopoverProps;
}

/** Renders tabbed audio, video, and statistics settings. Tab contents show a loading state until the session is connected. */
export declare function SettingsPanel({ className, style, open, isMobile, onClose, activeTab, onTabChange, tabs: tabsProp, testSoundUrl, }: SettingsPanelProps): JSX.Element | null;

/** Props for the tabbed session media settings panel. */
export declare interface SettingsPanelProps {
    /** Additional class applied to the panel root. */
    className?: string;
    /** Inline styles applied to the panel root. */
    style?: CSSProperties;
    /** Controls visibility. Defaults to true. */
    open?: boolean;
    /**
     * Render only the mobile panel content, with tabs across the top, for a container you provide
     * such as a bottom sheet. Defaults to `false`.
     */
    isMobile?: boolean;
    /** Shows a close button and is called when it is pressed. */
    onClose?: () => void;
    /** Controlled active tab; update it from `onTabChange`. When omitted or not visible, the panel shows the first visible tab. */
    activeTab?: SettingsTab;
    /** Called when the user switches tabs. */
    onTabChange?: (tab: SettingsTab) => void;
    /**
     * Which tabs to show, in the order provided. Defaults to all tabs; an empty array also shows all tabs.
     * @example tabs={['audio', 'video']}
     */
    tabs?: SettingsTab[];
    /**
     * URL of the CORS-accessible audio file played by "Test speaker"; defaults to the SDK ring tone.
     * The speaker test is shown only when `localAudioTrack` is passed to `ZoomUIToolkitProvider`.
     */
    testSoundUrl?: string;
}

/** Identifier for a settings panel tab: audio, video, share, or quality-of-service statistics. */
export declare type SettingsTab = 'audio' | 'video' | 'share' | 'qos';

/** Starts screen sharing, with a menu for the share privilege and custom options. */
export declare function ShareButton({ showPresenterControl, ...props }: ShareButtonProps): JSX.Element;

/** Static content or a callback that receives the current share-button render context. */
export declare type ShareButtonContentRenderer = ReactNode | ((context: ShareButtonRenderContext) => ReactNode);

/** Props for the screen-share button and its options menu. */
export declare interface ShareButtonProps {
    /** Additional class applied to the button or split-button root. */
    className?: string;
    /** Inline styles applied to the button or split-button root. */
    style?: CSSProperties;
    /** Show the options menu beside the button while connected, when the local participant can change the share privilege or `menuGroups` is non-empty. Defaults to `true`. */
    showMenu?: boolean;
    /** Show the floating, draggable presenter control while sharing is active. Defaults to `true`. */
    showPresenterControl?: boolean;
    /** Custom menu groups appended after the toolkit's share-privilege groups. */
    menuGroups?: ToolbarMenuGroup[];
    /** Desktop dropdown positioning, portal, class, and style overrides. */
    dropdownOptions?: ToolbarMenuDropdownOptions;
    /** Per-state replacement content for the main share control. */
    renderContent?: ShareButtonRenderContent;
}

/** Custom content for each mutually exclusive `ShareButton` visual state. */
export declare interface ShareButtonRenderContent {
    /** Content shown while the local participant is not sharing. */
    idle?: ShareButtonContentRenderer;
    /** Content shown while the local participant is sharing. */
    sharing?: ShareButtonContentRenderer;
}

/** State and actions supplied to a `ShareButton` content-render callback. */
export declare interface ShareButtonRenderContext {
    /** Whether the local participant is currently sharing. */
    isSharing: boolean;
    /** Who may start a share. Starts as `MultipleShare` and updates when the host or a co-host changes it. */
    sharePrivilege: SharePrivilege;
    /** Whether the local participant may change the session share privilege. */
    canChangeSharePrivilege: boolean;
    /** Localized accessible label for the main button's current action. */
    label: string;
    /** Localized accessible label for the share-options menu trigger. */
    menuLabel: string;
    /** Whether the main share action is currently disabled. */
    isDisabled: boolean;
    /** Whether the share-options menu trigger is currently disabled. */
    isMenuTriggerDisabled: boolean;
    /** Starts a screen share. To stop sharing, call `stopShare` from `useShareController`. */
    toggleShare: () => Promise<void>;
    /** Set the session share privilege when the local participant may do so. */
    changeSharePrivilege: (privilege: SharePrivilege) => Promise<void>;
}

/** State, capability flags, and operations for local screen sharing. */
export declare interface ShareController {
    /** Whether the local participant is currently sharing. */
    isSharing: boolean;
    /** Who may start a share. Starts as `MultipleShare` and updates when the host or a co-host changes it. */
    sharePrivilege: SharePrivilege;
    /** Whether the local participant is the host or a co-host and may change `sharePrivilege`. */
    canChangeSharePrivilege: boolean;
    /** Whether the local participant's current share is paused. */
    isSharingPaused: boolean;
    /** Whether the current SDK/browser combination supports shared-video optimization. */
    isSupportOptimizedForSharedVideo: boolean;
    /** Whether `toggleOptimizeForSharedVideo` turned shared-video optimization on for the current share. Not set by the `optimizedForSharedVideo` start option. */
    isEnableOptimizeForSharedVideo: boolean;
    /** Starts a screen share with optional SDK settings. To stop sharing, call `stopShare`. */
    toggleShare: (options?: ScreenShareOption) => Promise<void>;
    /** Stop the local share when one is active. */
    stopShare: () => Promise<void>;
    /** Pause the local share when it is active and not already paused. */
    pauseShare: () => Promise<void>;
    /** Resume the local share when it is active and paused. */
    resumeShare: () => Promise<void>;
    /** Set the session share privilege when the local participant may do so. */
    changeSharePrivilege: (privilege: SharePrivilege) => Promise<void>;
    /** Toggle shared-video optimization when sharing and the capability is supported. */
    toggleOptimizeForSharedVideo: () => Promise<void>;
}

/** Renders the connected local participant's shared content when a share is active. */
export declare function SharePresenterView({ className, style, hidden }: SharePresenterViewProps): JSX.Element;

/** Props for previewing the local participant's active share. */
export declare interface SharePresenterViewProps {
    /** Additional class applied to the view root. */
    className?: string;
    /** Inline styles applied to the view root. */
    style?: CSSProperties;
    /** Hide the view with `display: none` while keeping it mounted. Defaults to `false`. */
    hidden?: boolean;
}

/** Screen-sharing and annotation state synchronized from the Video SDK. */
export declare interface ShareState {
    /** Whether the local participant is sharing. */
    isSharing: boolean;
    /** Whether at least one remote participant is sharing to the local participant. */
    isReceivingShare: boolean;
    /** Who may share. Starts as `SharePrivilege.MultipleShare` and updates when the host or a co-host changes it. */
    sharePrivilege: SharePrivilege;
    /**
     * Whether shared-video optimization was turned on with `toggleOptimizeForSharedVideo` or ShareButton's sharing
     * controls. Resets to `false` when the local share ends.
     */
    isEnableOptimizeForSharedVideo: boolean;
    /** Annotation capabilities and current annotation UI state for the active share. */
    annotation: {
        /** Whether the local participant is permitted to annotate the active share. */
        canDoAnnotation: boolean;
        /** Reserved; always `false`. */
        canUndo: boolean;
        /** Reserved; always `false`. */
        canRedo: boolean;
        /** Whether the toolkit has started an annotation session. */
        isAnnotationStarted: boolean;
        /** Whether viewers may annotate the local participant's share. Defaults to `true`. */
        isEnableViewerAnnotation: boolean;
        /** Whether annotator names are shown on the local participant's share. Turned on when a toolkit share starts. */
        isShowAnnotatorName: boolean;
    };
}

/** Renders one participant's shared screen at the given size. Place it in its own `<video-player-container>`, separate from participant videos. */
export declare const ShareTile: (props: ShareTileProps) => JSX.Element | null;

/** Props for a share tile; the tile renders only while `participant.sharerOn` is true. */
export declare type ShareTileProps = ShareTileRendererProps;

/** Sizing and presentation props for `ShareTile`. */
declare interface ShareTileRendererProps {
    /** Sharing participant, or `null` to render nothing. */
    participant: Participant | null;
    /** Available tile width in CSS pixels. */
    width: number;
    /** Available tile height in CSS pixels. */
    height: number;
    /** Fallback content width-to-height ratio before SDK share dimensions are known. Defaults to `16 / 9`. */
    aspectRatio?: number;
    /** Additional class applied to the tile root. */
    className?: string;
    /** Inline styles applied to the tile root; `width`, `height`, and `backgroundColor` are overridden. */
    style?: CSSProperties;
    /** Content that replaces the default presenter name tag. */
    customNameTag?: ReactNode;
    /** Size the tile box to the displayed share content instead of `width` and `height`. Defaults to `false`. */
    fitToContent?: boolean;
    /** Render at the SDK-reported source dimensions instead of fitting within `width` and `height`; larger content is cropped unless `fitToContent` is `true`. Defaults to `false`. */
    showContentOriginalSize?: boolean;
}

/** Renders remote shared content for the connected session. In single-share mode, nothing is shown while the local participant is sharing. */
export declare function ShareViewerView({ className, style, tileAspectRatio, pageSize, hidden, isMultiShareRender, paginationDirection, hidePagination, }: ShareViewerViewProps): JSX.Element;

/** Props for viewing one active share or a paginated grid of concurrent shares. */
export declare interface ShareViewerViewProps extends PaginatedTileViewProps {
    /** Additional class applied to the view root. */
    className?: string;
    /** Inline root styles; `backgroundColor` and `color` also flow to share tiles. */
    style?: CSSProperties;
    /** Hide the view with `display: none` while keeping it mounted. Defaults to `false`. */
    hidden?: boolean;
    /** Render all active shares in paginated tiles instead of only the primary active share; pagination props and `tileAspectRatio` apply only in this mode. Defaults to `false`. */
    isMultiShareRender?: boolean;
}

/** Arranges shared screens in a grid sized to the given width and height, only while the session is connected. */
export declare const ShareViewLayout: ({ participants, width, height, minTileWidth, gap, shareTileAspectRatio, }: ShareViewLayoutProps) => JSX.Element;

/** Props for laying out multiple active share tiles within fixed bounds. */
export declare interface ShareViewLayoutProps {
    /** Sharing participants to render, in display order. SDK rendering limits may truncate the list. */
    participants: Participant[];
    /** Layout width in CSS pixels. */
    width: number;
    /** Layout height in CSS pixels. */
    height: number;
    /** Minimum tile width in CSS pixels; tiles never get narrower, so the grid may overflow and be clipped. Defaults to `160`. */
    minTileWidth?: number;
    /** Gap between share tiles in CSS pixels. Defaults to `8`. */
    gap?: number;
    /** Share tile width divided by tile height. Defaults to `16 / 9`. */
    shareTileAspectRatio?: number;
}

/**
 * Provides a `ToolkitTheme` to descendant toolkit components. Use it to give part of a layout a different theme;
 * notifications keep the provider's theme.
 */
export declare function ThemeProvider({ theme, children }: ThemeProviderProps): JSX.Element;

/** Props for applying a toolkit color scheme to descendant components. */
export declare interface ThemeProviderProps {
    /** Color scheme for descendant toolkit components and `useTheme`. */
    theme: ToolkitTheme;
    /** Toolkit UI that should inherit the selected theme. */
    children: ReactNode;
}

/**
 * Renders the standard audio, video, participant, chat, share, recording, settings, More, and leave controls.
 * Controls that don't fit move into More, except audio, video, and leave.
 */
export declare function Toolbar({ className, style, isHorizontal, audioButtonProps, videoButtonProps, recordButtonProps, chatButtonProps, visibleButtons, }: ToolbarProps): JSX.Element;

/** Styled toolbar button that shares the toolkit's button styles. */
export declare const ToolbarButton: ForwardRefExoticComponent<ToolbarButtonProps & RefAttributes<HTMLButtonElement>>;

/** Native button props plus the toolkit's toolbar visual states and content renderer. */
export declare interface ToolbarButtonProps extends ComponentPropsWithoutRef<'button'> {
    /** Apply the selected/open visual state; set `aria-pressed` or `aria-expanded` yourself. Defaults to `false`. */
    active?: boolean;
    /** Semantic color treatment. Defaults to `'neutral'`. */
    tone?: 'neutral' | 'accent' | 'danger';
    /** Control height and spacing preset. Defaults to `'md'`. */
    size?: 'sm' | 'md' | 'lg';
    /** Expand the button to the width of its container. Defaults to `false`. */
    fullWidth?: boolean;
    /** Render leading button content; defaults to the toolkit's placeholder icon. Pass `() => null` to show only `children`. */
    renderContent?: () => ReactNode;
    /** Native click handler for the underlying button element. */
    onClick?: MouseEventHandler<HTMLButtonElement>;
    /** Disable the underlying button and its interactions. */
    disabled?: boolean;
}

/**
 * Controls which toolbar buttons are rendered. Used as an allow-list: when provided,
 * only buttons explicitly set to `true` are shown. The More button is always shown.
 */
export declare interface ToolbarButtonVisibility {
    /** Render the audio control when `true`. */
    audio?: boolean;
    /** Render the video control when `true`. */
    video?: boolean;
    /** Render the participant control when `true`. */
    participant?: boolean;
    /** Render the screen-share control when `true`. */
    share?: boolean;
    /** Render the chat control when `true`. */
    chat?: boolean;
    /** Render the cloud-recording control when `true`. */
    record?: boolean;
    /** Render the settings control when `true`. */
    settings?: boolean;
    /** Render the leave/end-session control when `true`. */
    leave?: boolean;
}

/** Selectable leaf item in a toolbar menu. */
export declare interface ToolbarMenuActionItem extends ToolbarMenuBaseItem {
    /** Mark this item as selected. Applies only to top-level items in a `selectionMode: 'single'` group. */
    selected?: boolean;
    /**
     * Called with the item and the top-level group that contains it, including for submenu items.
     * The menu closes without awaiting the result, so handle async errors in the callback.
     */
    onSelect?: (item: ToolbarMenuActionItem, group: ToolbarMenuGroup) => void | Promise<void>;
    /** Omit on action items. */
    items?: never;
}

/** Fields shared by actionable and nested toolbar menu items. */
declare interface ToolbarMenuBaseItem {
    /** Stable id used for React keys and single-selection values. */
    id: string;
    /** Visible menu-item content. */
    label: ReactNode;
    /** Prevent selection or submenu opening. Defaults to `false`. */
    disabled?: boolean;
}

/** Desktop dropdown placement, styling, and portal overrides. */
export declare interface ToolbarMenuDropdownOptions {
    /** Additional class applied to desktop dropdown content. */
    className?: string;
    /** Inline styles applied to desktop dropdown content. */
    style?: CSSProperties;
    /** Element that should receive the desktop dropdown portal; defaults to the document body. */
    portalContainer?: Element | DocumentFragment | null;
    /** Preferred side of the trigger; the menu may move to the opposite side to stay visible. Defaults to `'bottom'`. */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** Distance from the trigger in CSS pixels. Defaults to `10`. */
    sideOffset?: number;
    /** Alignment along the selected side. Defaults to `'start'`. */
    align?: 'start' | 'center' | 'end';
    /** Offset along the alignment axis in CSS pixels. */
    alignOffset?: number;
}

/** Labeled collection of related toolbar menu items. */
export declare interface ToolbarMenuGroup {
    /** Stable id used as the group key. */
    id: string;
    /** Optional heading displayed above the group's items. */
    label?: ReactNode;
    /** Text shown when the group has no items; omit to hide an empty group. */
    emptyLabel?: string;
    /** Action and submenu items in display order. */
    items: ToolbarMenuItem[];
    /** Render top-level action items as a radio group with one selected value. */
    selectionMode?: 'single';
}

/** Actionable leaf or nested submenu accepted by `ToolbarMenuGroup`. */
export declare type ToolbarMenuItem = ToolbarMenuActionItem | ToolbarMenuSubmenuItem;

/** Menu item that opens a nested list instead of invoking an action. */
export declare interface ToolbarMenuSubmenuItem extends ToolbarMenuBaseItem {
    /** Nested action or submenu items. */
    items: ToolbarMenuItem[];
    /** Submenu items do not invoke a selection callback. */
    onSelect?: never;
    /** Selection state belongs to actionable leaf items. */
    selected?: never;
}

/** Props for the precomposed in-session control toolbar. */
export declare interface ToolbarProps {
    /** Additional class applied to the toolbar root. */
    className?: string;
    /** Inline styles applied to the toolbar root. */
    style?: CSSProperties;
    /** Arrange controls horizontally (default). Set false for a vertical toolbar. */
    isHorizontal?: boolean;
    /** Props forwarded to the audio button; the toolbar sets `isMobile` automatically. */
    audioButtonProps?: AudioButtonProps;
    /** Props forwarded to the video button; the toolbar sets `isMobile` automatically. */
    videoButtonProps?: VideoButtonProps;
    /** Props forwarded to the recording button; the toolbar sets `isMobile` automatically. */
    recordButtonProps?: RecordButtonProps;
    /** Props forwarded to the chat button; the toolbar sets `isMobile` automatically. */
    chatButtonProps?: ChatButtonProps;
    /** Allow-list of buttons to show; omit to show all. When provided, only `true` buttons and the More button render. */
    visibleButtons?: ToolbarButtonVisibility;
}

/** Color scheme supported by toolkit components. */
export declare type ToolkitTheme = 'light' | 'dark';

/** Renders session information, recording status, and optional custom controls. */
export declare function TopBar({ className, style, customizedButtons }: TopBarProps): JSX.Element;

/** Props for the precomposed session-information and recording-status bar. */
export declare interface TopBarProps {
    /** Additional class applied to the top-bar root. */
    className?: string;
    /** Inline styles applied to the top-bar root. */
    style?: CSSProperties;
    /** Custom buttons rendered on the right side of the top bar. */
    customizedButtons?: ReactNode[];
}

/**
 * Returns reactive local-audio state and actions backed by the current toolkit provider.
 * Actions do nothing while `canControlAudio` is false and never reject; failures are reported in `audioState.warning`.
 */
export declare function useAudioController(): AudioController;

/** Returns reactive cloud-recording state and actions backed by the current toolkit provider. Actions never reject; a failed action shows an error notification. */
export declare function useRecordingController(): RecordingController;

/** Returns reactive screen-share state and actions backed by the current toolkit provider. Actions never reject; a failed `toggleShare` shows an error notification. */
export declare function useShareController(): ShareController;

/** Returns the nearest toolkit theme, defaulting to `'dark'` without a provider. */
export declare function useTheme(): ToolkitTheme;

/**
 * Returns reactive local-video state and actions backed by the current toolkit provider.
 * Actions never reject; failures are reported in `videoState.warning`.
 */
export declare function useVideoController(): VideoController;

/**
 * Returns live toolkit state, the resolved `sessionOptions`, and the provider's `client`.
 * Safe to call outside `ZoomUIToolkitProvider`, where `client` is `null` and `sessionOptions` holds the defaults.
 */
export declare function useZoomUIToolkit(): UseZoomUIToolkitType;

/** Full value returned by `useZoomUIToolkit`. */
declare interface UseZoomUIToolkitType extends ZoomUIToolkitStates {
    /** Resolved provider options with toolkit defaults applied, including the built-in none and blur backgrounds. */
    sessionOptions: SessionOptions;
    /** Current Video SDK client, or `null` when no client was supplied. */
    client: ZoomClient | null;
}

/** Starts or stops the local camera, with a menu for choosing a camera. Disabled until the session is connected. */
export declare function VideoButton(props: VideoButtonProps): JSX.Element;

/** Static content or a callback that receives the current video-button render context. */
export declare type VideoButtonContentRenderer = ReactNode | ((context: VideoButtonRenderContext) => ReactNode);

/** Props for the local video toggle and camera-menu control. */
export declare interface VideoButtonProps {
    /** Additional class applied to the button or split-button root. */
    className?: string;
    /** Inline styles applied to the button or split-button root. */
    style?: CSSProperties;
    /** Render menu choices in a bottom sheet instead of a desktop dropdown. Defaults to `false`. */
    isMobile?: boolean;
    /**
     * Show the camera menu while connected once the camera has been turned on and camera controls or custom `menuGroups`
     * are available. Defaults to `true`.
     */
    showMenu?: boolean;
    /** Custom menu groups appended after the camera group. Shown only once the camera menu appears (see `showMenu`). */
    menuGroups?: ToolbarMenuGroup[];
    /** Desktop dropdown positioning, portal, class, and style overrides. */
    dropdownOptions?: ToolbarMenuDropdownOptions;
    /** Per-state replacement content for the main video control. */
    renderContent?: VideoButtonRenderContent;
}

/** Custom content for each mutually exclusive `VideoButton` visual state. */
export declare interface VideoButtonRenderContent {
    /** Content shown while local camera video is on. */
    videoOn?: VideoButtonContentRenderer;
    /** Content shown while local camera video is off. */
    videoOff?: VideoButtonContentRenderer;
    /** Content shown while the camera is starting or stopping; takes precedence over other states. */
    loading?: VideoButtonContentRenderer;
    /** Content shown for an active video warning when no operation is pending. */
    warning?: VideoButtonContentRenderer;
}

/** State and actions supplied to a `VideoButton` content-render callback. Actions do nothing while disconnected. */
export declare interface VideoButtonRenderContext {
    /** Current local video state. */
    videoState: VideoState;
    /** Available and selected media devices. */
    deviceState: DeviceState;
    /** Whether camera controls are available in the connected session. */
    canControlVideo: boolean;
    /** Localized label for the main button's action; its accessible label except while an operation is pending. */
    label: string;
    /** Localized accessible label for the video-options menu trigger. */
    menuLabel: string;
    /** Whether the main video action is currently disabled. */
    isDisabled: boolean;
    /** Whether the video-options menu trigger is currently disabled. */
    isMenuTriggerDisabled: boolean;
    /** Stop video when it is on; otherwise start it. */
    toggleVideo: () => Promise<void>;
    /** Start local camera video. */
    startVideo: () => Promise<void>;
    /** Stop local camera video. */
    stopVideo: () => Promise<void>;
    /** Switch to the camera with this `deviceId`; when the camera is off, select it for the next start. */
    switchCamera: (deviceId: string) => Promise<void>;
}

/** State and operations for controlling the local participant's camera video. */
export declare interface VideoController {
    /** Current toolkit video state. */
    videoState: VideoState;
    /** Whether the Video SDK client has a media stream. Does not check the connection state. */
    canControlVideo: boolean;
    /** Whether the browser supports virtual backgrounds and their resources have finished preloading. */
    canUseVirtualBackground: boolean;
    /** Stop video when it is on; otherwise start it. */
    toggleVideo: () => Promise<void>;
    /**
     * Start video in HD with the selected camera and mirror preference, plus the selected virtual background when
     * `canUseVirtualBackground` is true. On failure, also shows an error notification.
     */
    startVideo: () => Promise<void>;
    /** Stop the local participant's video. */
    stopVideo: () => Promise<void>;
    /** Switch to the camera with this `deviceId` while connected, applying it immediately when video is on. */
    switchCamera: (deviceId: string) => Promise<void>;
    /** Apply the local self-view mirror preference. */
    setMirrored: (mirrored: boolean) => Promise<void>;
    /**
     * Update hardware acceleration for one or both video directions. If the change isn't applied, nothing changes and no
     * warning is set.
     */
    setHardwareAcceleration: (option: HardwareAccelerationOption) => Promise<void>;
    /** Apply the background with this id from `videoState.virtualBackgroundImageList`; an unknown id sets a warning. */
    setVirtualBackground: (imageId: string) => Promise<void>;
}

/**
 * Arranges participant videos in an evenly sized grid within the given width and height.
 * Tiles appear only while the session is connected.
 */
export declare const VideoLayout: ({ participants, width, height, minTileWidth, gap, videoTileAspectRatio, activeSpeakerBorder, }: VideoLayoutProps) => JSX.Element;

/** Props for laying out multiple participant video tiles within fixed bounds. */
export declare interface VideoLayoutProps {
    /** Participants to render, in display order. SDK rendering limits may truncate the list. */
    participants: Participant[];
    /** Layout width in CSS pixels. */
    width: number;
    /** Layout height in CSS pixels. */
    height: number;
    /** Minimum tile width in CSS pixels; if tiles this wide don't fit, the grid is clipped. Defaults to `160`. */
    minTileWidth?: number;
    /** Gap between tiles in CSS pixels. Defaults to `8`. */
    gap?: number;
    /** Tile width divided by tile height. Defaults to `16 / 9`. */
    videoTileAspectRatio?: number;
    /** Highlight the active video participant when the session has more than two participants. Defaults to `true`. */
    activeSpeakerBorder?: boolean;
}

/** Video behavior configured on `ZoomUIToolkitProvider`. */
export declare interface VideoOptionType {
    /** Virtual-background choices and initial selection. */
    virtualBackground?: {
        /**
         * Custom images appended after the built-in none and blur entries. Entries with empty names or URLs,
         * duplicate ids, or reserved ids (`''` and `'blur'`) are ignored.
         */
        virtualBackgroundImageList?: VirtualBackgroundImage[];
        /**
         * Default selection: `''` for none, `'blur'`, or a configured image id; invalid ids fall back to none.
         * Reapplied when the connection state changes or a new `sessionOptions` object is passed.
         */
        defaultVirtualBackgroundImageId?: string;
    };
}

/** Local video state and video preferences maintained by the toolkit. */
export declare interface VideoState {
    /**
     * Whether the local participant's camera is currently on. Updates only while `VideoButton`, the `SettingsPanel`
     * Video tab, or a component that calls `useVideoController` is mounted.
     */
    isVideoOn: boolean;
    /**
     * Selected virtual-background id: `''` for none, `'blur'` for blur, or a configured image id.
     * Returns to the default when the connection state changes or a new `sessionOptions` object is passed.
     */
    vbImageId: string;
    /** Available virtual backgrounds, including the built-in none and blur entries. */
    virtualBackgroundImageList: VirtualBackgroundImage[];
    /** Whether the Video SDK has finished preloading virtual-background resources. */
    isVirtualBackgroundReady: boolean;
    /** Whether the local self-view is mirrored. Defaults to `true`. */
    isMirrored: boolean;
    /** Whether hardware acceleration is enabled for receiving/decoding video. */
    hardwareAccelerationReceiving: boolean;
    /** Whether hardware acceleration is enabled for sending/encoding video. */
    hardwareAccelerationSending: boolean;
    /** Whether a toolkit start or stop video operation is pending. */
    isLoading: boolean;
    /** Latest video problem, such as denied camera permission or a failed action; `null` when there is none. */
    warning: MediaWarning | null;
}

/** Image option displayed by the toolkit's virtual-background selector. */
export declare interface VirtualBackgroundImage {
    /** Stable identifier used as the selected virtual-background value. Must be unique. */
    id: string;
    /** Accessible label for the image in the background picker. Must be non-empty for custom entries. */
    name: string;
    /**
     * Image URL passed to the Video SDK and shown as the picker thumbnail. Must be non-empty for custom entries;
     * entries whose image fails to load are hidden.
     */
    url: string;
}

/** Minimal virtual anchor accepted by desktop floating panels. */
declare interface VirtualElement {
    /** Return the viewport-relative rectangle used to position the panel. */
    getBoundingClientRect(): DOMRect;
}

/** Video SDK chat-client instance type returned by `client.getChatClient()`. */
declare type ZoomChatClient = typeof ChatClient;

/** Video SDK client instance type returned by `ZoomVideo.createClient()`. */
declare type ZoomClient = typeof VideoClient;

/** Local audio track created through `ZoomVideo.createLocalAudioTrack()`. */
declare type ZoomLocalAudioTrack = LocalAudioTrack;

/**
 * Prebuilt session screen for use inside `ZoomUIToolkitProvider`; it does not join the session.
 * Shows a loading state while joining with `JoinButton` or reconnecting, and the session UI once connected.
 */
export declare function ZoomUIToolkitApp({ width, height, className, style, toolbarProps, }: ZoomUIToolkitAppProps): JSX.Element;

/** Props for the prebuilt connected-session application shell. */
export declare interface ZoomUIToolkitAppProps {
    /** Shell width as CSS pixels or any CSS width value. Defaults to `'100%'`. */
    width?: number | string;
    /**
     * Shell height as CSS pixels or any CSS height value. Defaults to `'100%'`.
     * Ignored on phones and tablets, where the app fills the viewport height.
     */
    height?: number | string;
    /** Additional class applied to the application shell. */
    className?: string;
    /** Inline styles merged after the resolved width and desktop height. */
    style?: CSSProperties;
    /**
     * Configuration forwarded to the connected-session toolbar. On phones and tablets, omitting `visibleButtons`
     * shows Audio, Video, Participants, Chat, and Settings.
     */
    toolbarProps?: ToolbarProps;
}

/**
 * Connects toolkit components to a Video SDK client, shared state, theme, notifications, and consent UI.
 * It does not join or leave the session; mount only one provider per page.
 */
export declare function ZoomUIToolkitProvider({ clientInstance, sessionOptions, children, theme, baseZIndex, localAudioTrack, }: ZoomUIToolkitProviderProps): JSX.Element;

/** Dependencies and feature defaults supplied to all descendant toolkit components. */
export declare interface ZoomUIToolkitProviderProps {
    /**
     * Client created with `ZoomVideo.createClient()` and initialized with `client.init()`; pass `null` until it exists.
     * Keep the same instance while a session is open; replacing it or switching it to `null` mid-session is not
     * supported. After the session closes, you can destroy it with `ZoomVideo.destroyClient()` and pass a new one.
     */
    clientInstance: ZoomClient | null;
    /**
     * Feature defaults and consent UI options. Omitted values use the toolkit defaults.
     * Pass a stable object, such as a module constant or a memoized value: each new object applies the
     * default virtual background again, replacing the user's choice.
     */
    sessionOptions?: SessionOptions;
    /** Toolkit UI that consumes this provider. */
    children: ReactNode;
    /** Color scheme for toolkit components and notifications. Defaults to `'dark'`. */
    theme?: ToolkitTheme;
    /**
     * Z-index of `ZoomUIToolkitApp` and `ZoomUIToolkitRoot`, and the starting value for toolkit panels, menus, and
     * dialogs. Defaults to `1000`; pop-up notifications are not affected.
     */
    baseZIndex?: number;
    /**
     * A `LocalAudioTrack` created with `ZoomVideo.createLocalAudioTrack()`. Enables the microphone and speaker tests
     * in the `SettingsPanel` Audio tab.
     */
    localAudioTrack?: ZoomLocalAudioTrack;
}

/**
 * Optional stacking boundary for a custom toolkit layout, at the provider's `baseZIndex`.
 * Don't wrap `ZoomUIToolkitApp`, which already forms this boundary.
 */
export declare function ZoomUIToolkitRoot({ children }: ZoomUIToolkitRootProps): JSX.Element;

/** Props for the optional stacking boundary around a custom toolkit layout. */
export declare interface ZoomUIToolkitRootProps {
    /** Toolkit components rendered inside the boundary. */
    children: ReactNode;
}

/**
 * State objects returned by `useZoomUIToolkit`. All of them return to their initial values when the connection
 * changes to Reconnecting, Closed, or Fail.
 */
export declare interface ZoomUIToolkitStates {
    /** Session lifecycle state. */
    sessionState: SessionState;
    /** Local audio state. */
    audioState: AudioState;
    /** Local video state. */
    videoState: VideoState;
    /** Available and selected media devices. */
    deviceState: DeviceState;
    /** Screen-sharing and annotation state. */
    shareState: ShareState;
    /** Participant collections and active selections. */
    participantState: ParticipantState;
    /** Chat availability, history, recipients, and unread count. */
    chatState: ChatState;
}

export { }
