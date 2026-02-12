import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { CommonPopper } from "@/components/widget/CommonPopper";
import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { useSnackbar } from "notistack";
import { CameraControlCmd, PTZCameraCapability, FarEndCameraControlOption } from "@zoom/videosdk";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { setActivePopper } from "@/store/uiSlice";

interface PTZControlPadProps {
  targetUserId: number;
  onClose: () => void;
}

const PTZControlPad: React.FC<PTZControlPadProps> = ({ targetUserId, onClose }) => {
  // Contexts
  const { t } = useTranslation();
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  // UI State
  const [isDragging, setIsDragging] = useState(false);
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCommandExecutingRef = useRef<boolean>(false);

  // PTZ Control State
  const [isControlling, setIsControlling] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [capability, setCapability] = useState<PTZCameraCapability | null>(null);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);

  // Common class combinations
  const baseButton =
    "transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95";

  const roundButton = `${baseButton} rounded-full bg-theme-surface-elevated text-theme-text border border-theme-divider
    hover:bg-theme-surface-elevated hover:border-theme-primary active:bg-theme-surface-elevated`;

  const directionButton = `${baseButton} w-10 h-10 bg-theme-surface-elevated text-theme-text border border-theme-divider
    hover:bg-theme-surface-elevated hover:border-theme-primary active:bg-theme-surface-elevated group`;

  // Clean up intervals and timeouts
  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
    setActiveDirection(null);
    setIsDragging(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    dispatch(setActivePopper(t("video.ptz_controller_title")));
    return () => {
      dispatch(setActivePopper(null));
    };
  }, [dispatch, t]);

  // Check browser PTZ support and far end camera capability on mount
  useEffect(() => {
    if (!stream || !targetUserId) return;

    // Check browser support
    const supported = (stream as any).isBrowserSupportPTZ?.() ?? true;
    setIsBrowserSupported(supported);
    if (!supported) {
      enqueueSnackbar(t("video.ptz_browser_not_supported"), { variant: "warning" });
    }

    // Try to get far end camera PTZ capability proactively
    // This helps determine if the camera supports PTZ before requesting control
    const checkCapability = async () => {
      try {
        const cap = await stream?.getFarEndCameraPTZCapability(targetUserId);

        if (cap) {
          setCapability(cap);
          // Check if camera actually supports any PTZ features
          if (!cap.pan && !cap.tilt && !cap.zoom) {
            enqueueSnackbar(t("video.ptz_camera_no_support"), { variant: "warning" });
          }
        }
      } catch (error: any) {
        // Don't show error to user yet - they might need to request control first
      }
    };

    checkCapability();
  }, [stream, targetUserId, enqueueSnackbar, t]);

  // Listen for PTZ control events
  useEffect(() => {
    if (!client || !targetUserId || !stream) return;

    const handleControlResponse = async (payload: any) => {
      if (payload.userId === targetUserId) {
        if (payload.isApproved) {
          setIsControlling(true);
          enqueueSnackbar(t("video.ptz_control_approved"), { variant: "success" });
          // Get PTZ capabilities after approval
          if (stream) {
            try {
              const capability = await stream?.getFarEndCameraPTZCapability(targetUserId);

              if (capability) {
                setCapability(capability);
                // Verify camera actually supports PTZ
                if (!capability.pan && !capability.tilt && !capability.zoom) {
                  enqueueSnackbar(t("video.ptz_no_features_warning"), { variant: "warning" });
                }
              } else {
                enqueueSnackbar(t("video.ptz_no_capabilities_warning"), { variant: "warning" });
              }
            } catch (error: any) {
              enqueueSnackbar(t("video.ptz_capabilities_failed"), { variant: "error" });
            }
          }
        } else {
          enqueueSnackbar(
            payload.reason
              ? t("video.ptz_control_declined_reason", { reason: payload.reason })
              : t("video.ptz_control_declined"),
            {
              variant: "warning",
            },
          );
        }
      }
    };

    const handleCapabilityChange = (payload: any) => {
      if (payload.userId === targetUserId && payload.ptz) {
        setCapability(payload.ptz);
      }
    };

    const handleControlChange = (payload: any) => {
      // Check if this is about the user we're controlling
      if (payload.userId === targetUserId) {
        setIsControlling(payload.isControlled);
        if (!payload.isControlled) {
          enqueueSnackbar(t("video.ptz_control_lost"), { variant: "info" });
        }
      }
    };

    // Register event listeners
    client.on("far-end-camera-response-control", handleControlResponse);
    client.on("far-end-camera-capability-change", handleCapabilityChange);
    client.on("far-end-camera-in-control-change", handleControlChange);

    // Cleanup listeners on unmount
    return () => {
      client.off("far-end-camera-response-control", handleControlResponse);
      client.off("far-end-camera-capability-change", handleCapabilityChange);
      client.off("far-end-camera-in-control-change", handleControlChange);
    };
  }, [client, targetUserId, stream, enqueueSnackbar, t]);

  // Release camera control on unmount
  useEffect(() => {
    return () => {
      // Only release if we currently have control
      if (isControlling && stream && targetUserId) {
        stream.giveUpFarEndCameraControl(targetUserId).catch(() => {
          // Silently fail on unmount
        });
      }
    };
  }, [isControlling, stream, targetUserId]);

  // Release control when participant leaves or turns off camera
  useEffect(() => {
    if (!client || !targetUserId) return;

    const handleUserRemoved = (payload: any) => {
      const removedUsers = Array.isArray(payload) ? payload : [payload];
      const targetRemoved = removedUsers.some((user: any) => user.userId === targetUserId);

      if (targetRemoved && isControlling) {
        if (stream) {
          stream.giveUpFarEndCameraControl(targetUserId).catch(() => {
            // Silently handle error
          });
        }
        setIsControlling(false);
        enqueueSnackbar(t("video.ptz_participant_left"), { variant: "info" });
        onClose();
      }
    };

    const handleVideoStateChange = (payload: any) => {
      if (payload.userId === targetUserId && payload.action === "Stop" && isControlling) {
        if (stream) {
          stream.giveUpFarEndCameraControl(targetUserId).catch(() => {
            // Silently handle error
          });
        }
        setIsControlling(false);
        enqueueSnackbar(t("video.ptz_camera_off"), { variant: "info" });
        onClose();
      }
    };

    client.on("user-removed", handleUserRemoved);
    client.on("peer-video-state-change", handleVideoStateChange);

    return () => {
      client.off("user-removed", handleUserRemoved);
      client.off("peer-video-state-change", handleVideoStateChange);
    };
  }, [client, targetUserId, isControlling, stream, enqueueSnackbar, onClose, t]);

  // Request camera control
  const requestControl = useCallback(async () => {
    if (!stream || !targetUserId || isRequesting) return;

    // Check if PTZ is supported before requesting
    if (capability && !capability.pan && !capability.tilt && !capability.zoom) {
      enqueueSnackbar(t("video.ptz_not_supported"), { variant: "error" });
      return;
    }

    setIsRequesting(true);
    try {
      await stream?.requestFarEndCameraControl(targetUserId);

      enqueueSnackbar(t("video.ptz_requested_notification"), { variant: "info" });
    } catch (error: any) {
      enqueueSnackbar(error?.reason || t("video.ptz_request_failed"), { variant: "error" });
    } finally {
      setIsRequesting(false);
    }
  }, [stream, targetUserId, isRequesting, capability, enqueueSnackbar, t]);

  // Give up camera control
  const giveUpControl = useCallback(async () => {
    if (!stream || !targetUserId) return;

    try {
      await stream?.giveUpFarEndCameraControl(targetUserId);
      setIsControlling(false);
      setCapability(null);
      enqueueSnackbar(t("video.ptz_released_notification"), { variant: "info" });
    } catch (error: any) {
      enqueueSnackbar(error?.reason || t("video.ptz_release_failed"), { variant: "error" });
    }
  }, [stream, targetUserId, enqueueSnackbar, t]);

  // Execute PTZ command
  const executeCommand = useCallback(
    async (cmd: CameraControlCmd, range: number = 4) => {
      if (!stream || !targetUserId || !isControlling) {
        if (!isControlling) {
          enqueueSnackbar(t("video.ptz_request_first"), { variant: "warning" });
        }
        return;
      }

      // Skip if a command is already executing
      if (isCommandExecutingRef.current) {
        return;
      }

      isCommandExecutingRef.current = true;
      try {
        await stream?.controlFarEndCamera({
          cmd,
          userId: targetUserId,
          range,
        });
      } catch (error: any) {
        enqueueSnackbar(error?.reason || error?.message || t("video.ptz_command_failed"), { variant: "error" });
      } finally {
        isCommandExecutingRef.current = false;
      }
    },
    [stream, targetUserId, isControlling, enqueueSnackbar, t],
  );

  // Handle individual actions
  const handleAction = useCallback(
    (action: string) => {
      // Execute PTZ actions
      switch (action) {
        case "zoom-in":
          executeCommand(CameraControlCmd.ZoomIn);
          break;
        case "zoom-out":
          executeCommand(CameraControlCmd.ZoomOut);
          break;
        case "up":
          executeCommand(CameraControlCmd.Up);
          break;
        case "right":
          executeCommand(CameraControlCmd.Right);
          break;
        case "down":
          executeCommand(CameraControlCmd.Down);
          break;
        case "left":
          executeCommand(CameraControlCmd.Left);
          break;
        default:
          break;
      }
    },
    [executeCommand],
  );

  // Handle continuous action (for holding down buttons)
  const handleContinuousAction = useCallback(
    (action: string, isStart: boolean) => {
      cleanup();

      if (!isStart) return;

      setActiveDirection(action);
      setIsDragging(true);

      // Initial delay before starting continuous movement
      const startContinuous = () => {
        handleAction(action);
        intervalRef.current = setInterval(() => {
          handleAction(action);
        }, 300); // 300ms interval to prevent command overlap
      };

      // Start after a short delay
      timeoutRef.current = setTimeout(startContinuous, 100);
    },
    [cleanup, handleAction],
  );

  // Check if PTZ is supported based on capability
  const isPTZSupported = capability ? capability.pan || capability.tilt || capability.zoom : true;

  // Check if request button should be disabled
  const isRequestDisabled = isRequesting || !isBrowserSupported || (capability && !isPTZSupported);

  // Check if controls should be disabled
  const isZoomDisabled = !isControlling || !capability?.zoom;
  const isPanDisabled = !isControlling || !capability?.pan;
  const isTiltDisabled = !isControlling || !capability?.tilt;
  const isDirectionDisabled = (dir: string) => {
    if (!isControlling) return true;
    if (dir === "up" || dir === "down") return isTiltDisabled;
    if (dir === "left" || dir === "right") return isPanDisabled;
    return false;
  };

  return (
    <CommonPopper isOpen={true} onClose={onClose} title={t("video.ptz_controller_title")} width={480} height={450}>
      <div className="flex flex-col items-center justify-between gap-3 p-4 bg-theme transition-colors duration-300 h-full">
        {/* Control status and actions */}
        <div className="flex gap-4 w-full justify-center items-center">
          {!isControlling ? (
            <button
              onClick={requestControl}
              disabled={isRequestDisabled}
              className={`${roundButton} px-6 py-2 text-sm font-medium ${
                isRequestDisabled
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-theme-primary hover:text-theme-text-button"
              }`}
            >
              {isRequesting ? t("video.ptz_requesting") : t("video.ptz_request_button")}
            </button>
          ) : (
            <button
              onClick={giveUpControl}
              className={`${roundButton} px-6 py-2 text-sm font-medium bg-theme-secondary hover:bg-theme-secondary hover:opacity-90 text-theme-text-button`}
            >
              {t("video.ptz_release_button")}
            </button>
          )}
        </div>

        {/* Zoom controls */}
        <div className="flex gap-12 w-full justify-center">
          {[
            { icon: Plus, action: "zoom-in" },
            { icon: Minus, action: "zoom-out" },
          ].map(({ icon: Icon, action }) => (
            <button
              key={action}
              onMouseDown={() => !isZoomDisabled && handleContinuousAction(action, true)}
              onMouseUp={() => handleContinuousAction(action, false)}
              onMouseLeave={() => handleContinuousAction(action, false)}
              onTouchStart={() => !isZoomDisabled && handleContinuousAction(action, true)}
              onTouchEnd={() => handleContinuousAction(action, false)}
              disabled={isZoomDisabled}
              className={`${roundButton} p-2.5 ${activeDirection === action ? "scale-95 border-theme-primary" : ""} ${
                isZoomDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Control wheel */}
        <div className="relative w-44 h-44 flex-shrink-0">
          {/* Rings */}
          <div className="absolute inset-0 rounded-full bg-theme-surface-elevated border border-theme-divider shadow-xl" />
          <div className="absolute inset-3 rounded-full bg-theme-surface border border-theme-divider shadow-inner" />

          {/* Controls */}
          <div className="absolute inset-7">
            {[
              { dir: "up", icon: ChevronUp, pos: "top-0 left-1/2 -translate-x-1/2 rounded-t-2xl" },
              { dir: "right", icon: ChevronRight, pos: "right-0 top-1/2 -translate-y-1/2 rounded-r-2xl" },
              { dir: "down", icon: ChevronDown, pos: "bottom-0 left-1/2 -translate-x-1/2 rounded-b-2xl" },
              { dir: "left", icon: ChevronLeft, pos: "left-0 top-1/2 -translate-y-1/2 rounded-l-2xl" },
            ].map(({ dir, icon: Icon, pos }) => {
              const disabled = isDirectionDisabled(dir);
              return (
                <button
                  key={dir}
                  onMouseDown={() => !disabled && handleContinuousAction(dir, true)}
                  onMouseUp={() => handleContinuousAction(dir, false)}
                  onMouseLeave={() => handleContinuousAction(dir, false)}
                  onTouchStart={() => !disabled && handleContinuousAction(dir, true)}
                  onTouchEnd={() => handleContinuousAction(dir, false)}
                  disabled={disabled}
                  className={`${directionButton} absolute ${pos} ${
                    activeDirection === dir ? "scale-95 border-theme-primary" : ""
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Status and capability info */}
        <div className="flex flex-col items-center gap-1">
          <div className="px-4 py-1.5 rounded-full bg-theme-surface text-theme-text-secondary text-xs shadow-md transition-colors duration-300">
            {!isBrowserSupported
              ? t("video.ptz_status_browser_not_supported")
              : !isControlling
                ? t("video.ptz_status_not_controlling")
                : activeDirection
                  ? t("video.ptz_status_moving", { direction: activeDirection })
                  : t("video.ptz_status_ready")}
          </div>

          {/* Capability info */}
          {isControlling && capability && (
            <div className="text-xs text-theme-text-secondary">
              {t("video.ptz_capabilities_label")} {capability.pan ? `${t("video.ptz_capability_pan")} ` : ""}
              {capability.tilt ? `${t("video.ptz_capability_tilt")} ` : ""}
              {capability.zoom ? t("video.ptz_capability_zoom") : ""}
            </div>
          )}
        </div>
      </div>
    </CommonPopper>
  );
};

export default PTZControlPad;
