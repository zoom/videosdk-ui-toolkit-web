import { useEffect, useState, useRef, useMemo, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { MoreHorizontal } from "lucide-react";
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
import { BroadcastStreamingStatus } from "@zoom/videosdk";
import { setIsShowLiveStreamPanel, setIsShowStartCaptionsWindow, setIsBroadcastStartPending } from "@/store/uiSlice";
import { setBroadcastStreamingStatus } from "@/store/sessionSlice";
import { useSnackbar } from "notistack";

type MoreMenuItemId = "settings" | "live-stream" | "broadcast" | "share-camera" | "stop-share";

interface MoreMenuItemProps {
  id: MoreMenuItemId;
  title: string;
  onClick: () => void;
}

export const MoreButton = ({
  isSettingsOpen,
  onOpenSettings,
  themeName,
  orientation = "horizontal",
}: {
  isSettingsOpen: boolean;
  onOpenSettings: (isOpen: boolean) => void;
  themeName: string;
  orientation?: "horizontal" | "vertical";
}) => {
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

  const menuItems = useMemo(
    () =>
      [
        {
          id: "settings",
          title: t("settings.title"),
          onClick: handleSettings,
        },
        isSupportLiveStream &&
          isHost &&
          liveStreamClient?.isLiveStreamEnabled() && {
            id: "live-stream",
            title: t("settings.livestream_title"),
            onClick: () => dispatch(setIsShowLiveStreamPanel(!isShowLiveStreamPanel)),
          },
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
        (featuresOptions as any)?.cameraShare?.enable &&
          !isSendingScreenShare && {
            id: "share-camera",
            title: t("share.camera_title"),
            onClick: () => startCameraShare(),
          },
        isSendingScreenShare && {
          id: "stop-share",
          title: t("share.stop_title"),
          onClick: () => stopShare(),
        },
      ].filter(Boolean),
    [
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
          } bg-theme-surface z-30 border border-theme-border text-theme-text rounded-lg shadow-xl overflow-hidden bg-theme-surface`}
          style={{ width: "200px" }}
        >
          {menuItems.map((item: MoreMenuItemProps, idx) => {
            const isBroadcastItem = item.id === "broadcast";
            const isDisabled = isBroadcastItem && isBroadcastDisabled;

            return (
              <button
                key={idx}
                className={`w-full px-4 py-2 text-left text-theme-text hover:bg-theme-background transition-colors duration-200 ${
                  isBroadcastItem ? "disabled:opacity-60 disabled:cursor-not-allowed" : ""
                }`}
                onClick={item.onClick}
                disabled={isDisabled}
                aria-busy={isDisabled}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
