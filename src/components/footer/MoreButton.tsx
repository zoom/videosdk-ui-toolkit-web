import { useEffect, useState, useRef, useMemo, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { MoreHorizontal, Users, MessageSquare, BadgeHelp } from "lucide-react";
import { IconCountButton } from "../widget/IconCountButton";
import sessionAdditionalContext from "@/context/session-additional-context";
import {
  useAppDispatch,
  useAppSelector,
  useSessionSelector,
  useSessionUISelector,
  useCaptionSelector,
} from "@/hooks/useAppSelector";
import { useToggleScreenShare } from "@/features/share/hooks";
import { BroadcastStreamingStatus, RealTimeMediaStreamsStatus } from "@zoom/videosdk";
import { setIsShowLiveStreamPanel, setIsShowStartCaptionsWindow, setIsBroadcastStartPending } from "@/store/uiSlice";
import { setBroadcastStreamingStatus } from "@/store/sessionSlice";
import { useSnackbar } from "notistack";
import type { FooterButtonId } from "./useResponsiveFooter";
import { RecordingStatus } from "@/types/index.d";

type MoreMenuItemId =
  | "settings"
  | "live-stream"
  | "broadcast"
  | "share-camera"
  | "stop-share"
  | "whiteboard"
  | "record"
  | "record-stop"
  | "realTimeMediaStreams"
  | "rtms-stop"
  | "participants"
  | "chat"
  | "caption"
  | "subsession"
  | "subsessionHelp";

interface MoreMenuItemProps {
  id: MoreMenuItemId;
  title: string;
  onClick: () => void;
  count?: number;
  isActive?: boolean;
}

interface OverflowButtonData {
  participantSize: number;
  unreadCount: number;
  isParticipantsPoppedOut: boolean;
  isChatPoppedOut: boolean;
  isSubsessionPoppedOut: boolean;
  isAskSubsessionHelpConfirm: boolean;
  isShowCaption: boolean;
  activeSidePanel: string | null;
  toggleParticipant: () => void;
  toggleChat: () => void;
  toggleSubsession: () => void;
  askSubsessionHelp: () => void;
  handleCaptionClick: () => void;
  onViewTranscript: () => void;
  onCaptionSettings: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isShareMenuOpen: boolean;
  setIsShareMenuOpen: (isOpen: boolean) => void;
  // Recording
  recordingStatus: RecordingStatus;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  // Real-Time Media Streams
  rtmsStatus: RealTimeMediaStreamsStatus;
  rtmsIsLoading: boolean;
  startRtms: () => Promise<void>;
  pauseRtms: () => Promise<void>;
  resumeRtms: () => Promise<void>;
  stopRtms: () => Promise<void>;
  // Whiteboard
  isWhiteboardOpen: boolean;
  isWhiteboardPresenting: boolean;
  toggleWhiteboard: () => Promise<void>;
}

interface MoreButtonProps {
  isSettingsOpen: boolean;
  onOpenSettings: (isOpen: boolean) => void;
  themeName: string;
  orientation?: "horizontal" | "vertical";
  overflowButtons?: FooterButtonId[];
  buttonData?: OverflowButtonData;
  showSettings?: boolean;
}

export const MoreButton = ({
  isSettingsOpen,
  onOpenSettings,
  themeName,
  orientation = "horizontal",
  overflowButtons = [],
  buttonData,
  showSettings = true,
}: MoreButtonProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { liveStreamClient, broadcastStreamingClient } = useContext(sessionAdditionalContext);
  const { isHost, featuresOptions, isSendingScreenShare, broadcastStreamingStatus, channelId } =
    useAppSelector(useSessionSelector);
  const { isShowLiveStreamPanel, isBroadcastStartPending, isShowStartCaptionsWindow } =
    useAppSelector(useSessionUISelector);
  const { isTranscriptionInitiated } = useAppSelector(useCaptionSelector);
  const dropdownRef = useRef(null);
  const moreButtonRef = useRef(null);
  const dispatch = useAppDispatch();
  const { startCameraShare, stopShare } = useToggleScreenShare();
  const { enqueueSnackbar } = useSnackbar();

  const isSupportLiveStream = featuresOptions?.livestream?.enable;
  const isBroadcastDisabled =
    broadcastStreamingStatus === BroadcastStreamingStatus.Pending ||
    broadcastStreamingStatus === BroadcastStreamingStatus.Closing;

  const createRecordingMenuItems = useCallback(
    (
      recordingStatus: RecordingStatus,
      startRecording: () => void,
      pauseRecording: () => void,
      resumeRecording: () => void,
      stopRecording: () => void,
    ): MoreMenuItemProps[] => {
      const isRecording = recordingStatus === RecordingStatus.Recording;
      const isPaused = recordingStatus === RecordingStatus.Paused;
      const isRecordingActive = isRecording || isPaused;

      let recordTitle = t("recording.start_button");
      let recordAction = startRecording;

      if (isRecording) {
        recordTitle = t("recording.pause_recording");
        recordAction = pauseRecording;
      } else if (isPaused) {
        recordTitle = t("recording.resume_recording");
        recordAction = resumeRecording;
      }

      const recordItems: MoreMenuItemProps[] = [
        {
          id: "record",
          title: recordTitle,
          onClick: () => {
            setIsOpen(false);
            recordAction();
          },
          isActive: isRecordingActive,
        },
      ];

      // Add Stop Recording option when recording is active
      if (isRecordingActive) {
        recordItems.push({
          id: "record-stop",
          title: t("recording.stop_recording"),
          onClick: () => {
            setIsOpen(false);
            stopRecording();
          },
        });
      }

      return recordItems;
    },
    [t],
  );

  const createRtmsMenuItems = useCallback(
    (
      rtmsStatus: RealTimeMediaStreamsStatus,
      startRtms: () => Promise<void>,
      pauseRtms: () => Promise<void>,
      resumeRtms: () => Promise<void>,
      stopRtms: () => Promise<void>,
    ): MoreMenuItemProps[] => {
      const isRtmsStarted = rtmsStatus === RealTimeMediaStreamsStatus.Start;
      const isRtmsPaused = rtmsStatus === RealTimeMediaStreamsStatus.Pause;
      const isRtmsActive = isRtmsStarted || isRtmsPaused;

      let rtmsTitle = t("real_time_media_streams.start_button");
      let rtmsAction = startRtms;

      if (isRtmsStarted) {
        rtmsTitle = t("real_time_media_streams.pause_button");
        rtmsAction = pauseRtms;
      } else if (isRtmsPaused) {
        rtmsTitle = t("real_time_media_streams.resume_button");
        rtmsAction = resumeRtms;
      }

      const rtmsItems: MoreMenuItemProps[] = [
        {
          id: "realTimeMediaStreams",
          title: rtmsTitle,
          onClick: () => {
            setIsOpen(false);
            rtmsAction();
          },
          isActive: isRtmsActive,
        },
      ];

      // Add Stop RTMS option when session is active
      if (isRtmsActive) {
        rtmsItems.push({
          id: "rtms-stop",
          title: t("real_time_media_streams.stop_button"),
          onClick: () => {
            setIsOpen(false);
            stopRtms();
          },
        });
      }

      return rtmsItems;
    },
    [t],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !moreButtonRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSettings = useCallback(() => {
    setIsOpen(false);
    onOpenSettings(true);
  }, [onOpenSettings]);

  const handleBroadcastClick = useCallback(async () => {
    if (!broadcastStreamingClient?.isBroadcastStreamingEnable?.()) return;
    if (isBroadcastDisabled) return;

    const isLive = broadcastStreamingStatus === BroadcastStreamingStatus.InProgress;

    setIsOpen(false);

    if (!isLive && !isTranscriptionInitiated) {
      dispatch(setIsBroadcastStartPending(true));
      dispatch(setIsShowStartCaptionsWindow(true));
      return;
    }

    try {
      dispatch(
        setBroadcastStreamingStatus(isLive ? BroadcastStreamingStatus.Closing : BroadcastStreamingStatus.Pending),
      );

      enqueueSnackbar(isLive ? t("broadcast_streaming_stopping") : t("broadcast_streaming_starting"), {
        variant: "info",
        autoHideDuration: 2000,
      });

      if (isLive) {
        await broadcastStreamingClient.stopBroadcast(channelId || undefined);
      } else {
        await broadcastStreamingClient.startBroadcast();
      }
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e);
      const errorCode: number | undefined = e?.errorCode;
      const reason: string | undefined = e?.reason;

      if (errorCode === 7901 || reason?.toLowerCase?.().includes("already in progress")) {
        dispatch(setBroadcastStreamingStatus(BroadcastStreamingStatus.InProgress));
      } else {
        enqueueSnackbar(t("broadcast_streaming_action_failed"), {
          variant: "error",
          autoHideDuration: 4000,
        });
        dispatch(
          setBroadcastStreamingStatus(isLive ? BroadcastStreamingStatus.InProgress : BroadcastStreamingStatus.Closed),
        );
      }
    }
  }, [
    channelId,
    broadcastStreamingClient,
    broadcastStreamingStatus,
    dispatch,
    enqueueSnackbar,
    isBroadcastDisabled,
    isTranscriptionInitiated,
    t,
  ]);

  const prevIsShowStartCaptionsWindowRef = useRef(isShowStartCaptionsWindow);
  useEffect(() => {
    const wasOpen = prevIsShowStartCaptionsWindowRef.current;
    if (wasOpen && !isShowStartCaptionsWindow && !isTranscriptionInitiated && isBroadcastStartPending) {
      dispatch(setIsBroadcastStartPending(false));
    }
    prevIsShowStartCaptionsWindowRef.current = isShowStartCaptionsWindow;
  }, [dispatch, isBroadcastStartPending, isShowStartCaptionsWindow, isTranscriptionInitiated]);

  useEffect(() => {
    if (
      !broadcastStreamingClient?.isBroadcastStreamingEnable?.() ||
      !isBroadcastStartPending ||
      isShowStartCaptionsWindow ||
      !isTranscriptionInitiated ||
      isBroadcastDisabled
    ) {
      return;
    }

    const startBroadcast = async () => {
      try {
        dispatch(setBroadcastStreamingStatus(BroadcastStreamingStatus.Pending));
        dispatch(setIsBroadcastStartPending(false));

        enqueueSnackbar(t("broadcast_streaming_starting"), {
          variant: "info",
          autoHideDuration: 2000,
        });

        await broadcastStreamingClient.startBroadcast();
      } catch (e: any) {
        const errorCode: number | undefined = e?.errorCode;
        const reason: string | undefined = e?.reason;

        if (errorCode === 7901 || reason?.toLowerCase?.().includes("already in progress")) {
          dispatch(setBroadcastStreamingStatus(BroadcastStreamingStatus.InProgress));
        } else {
          enqueueSnackbar(t("broadcast_streaming_action_failed"), {
            variant: "error",
            autoHideDuration: 4000,
          });
          dispatch(setBroadcastStreamingStatus(BroadcastStreamingStatus.Closed));
        }
      }
    };

    startBroadcast();
  }, [
    broadcastStreamingClient,
    dispatch,
    enqueueSnackbar,
    isBroadcastDisabled,
    isBroadcastStartPending,
    isShowStartCaptionsWindow,
    isTranscriptionInitiated,
    t,
  ]);

  const overflowMenuItems = useMemo(() => {
    if (!buttonData || overflowButtons.length === 0) {
      return [];
    }

    const items: MoreMenuItemProps[] = [];

    overflowButtons.forEach((buttonId) => {
      switch (buttonId) {
        case "whiteboard": {
          const isActive = buttonData.isWhiteboardOpen;
          const title = isActive ? t("whiteboard.stop_button") : t("whiteboard.start_button");

          items.push({
            id: "whiteboard",
            title,
            onClick: () => {
              setIsOpen(false);
              buttonData.toggleWhiteboard();
            },
            isActive,
          });
          break;
        }
        case "record":
          items.push(
            ...createRecordingMenuItems(
              buttonData.recordingStatus,
              buttonData.startRecording,
              buttonData.pauseRecording,
              buttonData.resumeRecording,
              buttonData.stopRecording,
            ),
          );
          break;
        case "realTimeMediaStreams":
          items.push(
            ...createRtmsMenuItems(
              buttonData.rtmsStatus,
              buttonData.startRtms,
              buttonData.pauseRtms,
              buttonData.resumeRtms,
              buttonData.stopRtms,
            ),
          );
          break;
        case "participants":
          items.push({
            id: "participants",
            title: t("participant.panel_title"),
            onClick: () => {
              setIsOpen(false);
              buttonData.toggleParticipant();
            },
            count: buttonData.participantSize,
            isActive: buttonData.isParticipantsPoppedOut || buttonData.activeSidePanel === "participants",
          });
          break;
        case "chat":
          items.push({
            id: "chat",
            title: t("chat.panel_title"),
            onClick: () => {
              setIsOpen(false);
              buttonData.toggleChat();
            },
            count: buttonData.unreadCount,
            isActive: buttonData.isChatPoppedOut || buttonData.activeSidePanel === "chat",
          });
          break;
        case "caption":
          items.push({
            id: "caption",
            title: t("caption.menu_title"),
            onClick: () => {
              setIsOpen(false);
              buttonData.handleCaptionClick();
            },
            isActive: buttonData.isShowCaption,
          });
          break;
        case "subsession":
          items.push({
            id: "subsession",
            title: t("subsession.menu_title"),
            onClick: () => {
              setIsOpen(false);
              buttonData.toggleSubsession();
            },
            isActive: buttonData.isSubsessionPoppedOut,
          });
          break;
        case "subsessionHelp":
          items.push({
            id: "subsessionHelp",
            title: t("subsession.help"),
            onClick: () => {
              setIsOpen(false);
              buttonData.askSubsessionHelp();
            },
            isActive: buttonData.isAskSubsessionHelpConfirm,
          });
          break;
        default:
          break;
      }
    });

    return items;
  }, [overflowButtons, buttonData, t, createRecordingMenuItems, createRtmsMenuItems]);

  const menuItems = useMemo(
    () =>
      [
        // Add overflow items first
        ...overflowMenuItems,
        // Original menu items (only show if showSettings is true)
        showSettings && {
          id: "settings",
          title: t("settings.title"),
          onClick: handleSettings,
        },
        showSettings &&
          isSupportLiveStream &&
          isHost &&
          liveStreamClient?.isLiveStreamEnabled() && {
            id: "live-stream",
            title: t("settings.livestream_title"),
            onClick: () => dispatch(setIsShowLiveStreamPanel(!isShowLiveStreamPanel)),
          },
        showSettings &&
          broadcastStreamingClient?.isBroadcastStreamingEnable?.() &&
          isHost && {
            id: "broadcast",
            title:
              broadcastStreamingStatus === BroadcastStreamingStatus.InProgress ||
              broadcastStreamingStatus === BroadcastStreamingStatus.Closing
                ? t("broadcast_streaming_stop")
                : t("broadcast_streaming_start"),
            onClick: handleBroadcastClick,
          },
        showSettings &&
          (featuresOptions as any)?.cameraShare?.enable &&
          !isSendingScreenShare && {
            id: "share-camera",
            title: t("share.camera_label"),
            onClick: () => startCameraShare(),
          },
        showSettings &&
          isSendingScreenShare && {
            id: "stop-share",
            title: t("share.stop_title"),
            onClick: () => stopShare(),
          },
      ].filter(Boolean),
    [
      overflowMenuItems,
      showSettings,
      t,
      handleSettings,
      isHost,
      liveStreamClient,
      broadcastStreamingClient,
      broadcastStreamingStatus,
      isShowLiveStreamPanel,
      dispatch,
      isSupportLiveStream,
      isSendingScreenShare,
      startCameraShare,
      stopShare,
      handleBroadcastClick,
      featuresOptions,
    ],
  );

  return (
    <div className="relative">
      <IconCountButton
        icon={MoreHorizontal}
        isActive={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        ref={moreButtonRef}
        id="footer-more-button"
        themName={themeName}
        iconSize={24}
        orientation={orientation}
        className={orientation === "vertical" ? "w-10" : ""}
      />

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute bottom-full ${
            orientation === "vertical" ? "left-0 mb-1" : "right-0 mb-1"
          } bg-theme-surface z-30 border border-theme-border text-theme-text rounded-lg shadow-xl overflow-y-auto uikit-custom-scrollbar`}
          style={{
            width: "200px",
            maxHeight: "min(400px, calc(100vh - 100px))",
          }}
        >
          {menuItems.map((item: MoreMenuItemProps, idx) => {
            const isBroadcastItem = item.id === "broadcast";
            const isDisabled = isBroadcastItem && isBroadcastDisabled;

            return (
              <button
                key={idx}
                className={`w-full px-4 py-2 text-left text-theme-text transition-colors duration-200 flex items-center justify-between ${
                  item.isActive ? "bg-theme-background font-medium" : "hover:bg-theme-background"
                } ${isBroadcastItem ? "disabled:opacity-60 disabled:cursor-not-allowed" : ""}`}
                onClick={item.onClick}
                disabled={isDisabled}
                aria-busy={isDisabled}
                aria-label={item.title}
              >
                <span>{item.title}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white">{item.count}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
