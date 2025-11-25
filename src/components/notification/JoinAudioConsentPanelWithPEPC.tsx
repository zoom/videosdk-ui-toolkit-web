import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import CommonNotification from "@/components/widget/CommonNotification";
import { useToggleMic } from "@/features/audio/hooks/useToggleMic";
import { setShowJoinAudioConsent, setIsAudioConsentInitialized } from "@/store/uiSlice";
import { canUsePEPCPermissionQuery } from "@/components/util/pepcDetection";
import PermissionElement from "@/components/widget/PermissionElement";
import { closeSnackbar } from "notistack";

interface PEPCPermissionStatus {
  camera: {
    state: PermissionState;
  };
  microphone: {
    state: PermissionState;
  };
}

interface PEPCConsentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (permissions: { camera: boolean; microphone: boolean }) => void;
  title?: string;
  subtitle?: string;
}

const PEPCConsentPanel: React.FC<PEPCConsentPanelProps> = ({
  isOpen,
  onClose,
  onConsent,
  title = "Do you want people to see you in the session?",
  subtitle = "You can still turn off your microphone and camera anytime in the session",
}) => {
  const [permissionStatus, setPermissionStatus] = useState<PEPCPermissionStatus>({
    camera: { state: "prompt" },
    microphone: { state: "prompt" },
  });
  const [showEnableAudioChoice, setShowEnableAudioChoice] = useState(false);

  // Check current permission status
  const checkPermissionStatus = useCallback(async () => {
    try {
      // Check camera permission
      const cameraStatus = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });

      // Check microphone permission
      const microphoneStatus = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      setPermissionStatus({
        camera: {
          state: cameraStatus.state,
        },
        microphone: {
          state: microphoneStatus.state,
        },
      });

      // Listen for permission changes
      cameraStatus.addEventListener("change", () => {
        setPermissionStatus((prev) => ({
          ...prev,
          camera: {
            state: cameraStatus.state,
          },
        }));
      });

      microphoneStatus.addEventListener("change", () => {
        setPermissionStatus((prev) => ({
          ...prev,
          microphone: {
            state: microphoneStatus.state,
          },
        }));
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Failed to check PEPC permission status:", err);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      checkPermissionStatus();
    }
  }, [isOpen, checkPermissionStatus]);

  // Show "Enable Audio" choice when permissions are granted
  useEffect(() => {
    if (isOpen && permissionStatus.camera.state === "granted" && permissionStatus.microphone.state === "granted") {
      setShowEnableAudioChoice(true);
    }
  }, [isOpen, permissionStatus]);

  const handleContinueWithoutMedia = () => {
    onConsent({ camera: false, microphone: false });
  };

  const handleEnableAudio = () => {
    onConsent({ camera: true, microphone: true });
  };

  const handleNotNow = () => {
    onConsent({ camera: false, microphone: false });
  };

  const getPermissionIcon = (state: PermissionState) => {
    switch (state) {
      case "granted":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "denied":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const enableAudioContent = (
    <div className="flex flex-col h-full justify-between bg-theme-surface p-1">
      <div className="space-y-3">
        <h2 className="text-xl font-medium text-theme-text" id="uikit-join-audio-consent-title">
          Enable Audio
        </h2>
        <p className="leading-relaxed text-theme-text" id="uikit-join-audio-consent-content">
          Would you like to enable audio for this session?
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          className="px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-theme-background text-theme-text border border-theme-border"
          onClick={handleNotNow}
          id="uikit-join-audio-consent-not-now"
        >
          Not Now
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-theme-text-button rounded hover:bg-blue-700 transition-colors"
          onClick={handleEnableAudio}
          id="uikit-join-audio-consent-enable"
          autoFocus
        >
          Enable
        </button>
      </div>
    </div>
  );

  // Stage 1: Permission Request
  const permissionRequestContent = (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-theme-text mb-2">{title}</h3>
          <p className="text-sm text-theme-text leading-relaxed opacity-75">{subtitle}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-theme-divider"></div>

      <div className="space-y-3">
        <h4 className="text-xs font-medium text-theme-text opacity-60 uppercase tracking-wider">Current Permissions</h4>

        <div className="space-y-3">
          {/* Camera Permission Status */}
          <div className="flex items-center justify-between p-4 bg-theme-surface-elevated rounded-xl border border-theme-divider shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 bg-opacity-15 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-theme-text">Camera</span>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-orange-500 bg-opacity-20 text-orange-600 dark:text-orange-400 rounded capitalize">
              {permissionStatus.camera.state}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-theme-surface-elevated rounded-xl border border-theme-divider shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 bg-opacity-15 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-theme-text">Microphone</span>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-orange-500 bg-opacity-20 text-orange-600 dark:text-orange-400 rounded capitalize">
              {permissionStatus.microphone.state}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <PermissionElement
            type="camera microphone"
            onPermissionChange={(state) => {
              if (state === "granted") {
                setShowEnableAudioChoice(true);
              }
            }}
            style={{
              width: "100%",
              backgroundColor: "rgb(37, 99, 235)", // blue-600
              color: "rgb(255, 255, 255)",
              padding: "12px 16px",
              borderRadius: "8px",
              fontWeight: "500",
              fontSize: "14px",
              border: "1px solid rgb(37, 99, 235)",
            }}
          />
        </div>

        <button
          onClick={handleContinueWithoutMedia}
          className="w-full px-4 py-2 bg-theme-surface-elevated border border-theme-divider text-blue-600 dark:text-blue-400 hover:bg-theme-background rounded-lg font-medium transition-colors"
        >
          Continue without microphone and camera
        </button>
      </div>

      <div className="text-xs text-theme-text opacity-60 text-center">
        <p>Permissions granted will last for this browser session and can be revoked anytime.</p>
      </div>
    </div>
  );

  const content = showEnableAudioChoice ? enableAudioContent : permissionRequestContent;

  return (
    <CommonNotification
      isOpen={isOpen}
      onClose={() => {}}
      allowClose={false}
      width={showEnableAudioChoice ? 360 : 450}
      height={showEnableAudioChoice ? 190 : "auto"}
    >
      {content}
    </CommonNotification>
  );
};

const JoinAudioConsentPanelWithPEPC = () => {
  const {
    isShowJoinAudioConsent,
    isAudioConsentInitialized,
    previewStatus: { isAudioOn: isAudioOnInPreview, isCheckedPEPC, isMicMuted },
  } = useAppSelector(useSessionUISelector);
  const {
    featuresOptions: {
      audio: { joinAudioConsent: isUserEnableJoinAudioConsent, muteEntry: isUserMuteEntry },
    },
  } = useAppSelector(useSessionSelector);

  const dispatch = useAppDispatch();
  const toggleMic = useToggleMic();
  const [usePEPC, setUsePEPC] = useState(false);

  useEffect(() => {
    if (!isAudioConsentInitialized && !isAudioOnInPreview && isUserEnableJoinAudioConsent !== isShowJoinAudioConsent) {
      dispatch(setShowJoinAudioConsent(isUserEnableJoinAudioConsent));
      dispatch(setIsAudioConsentInitialized(true));
    }
  }, [isAudioConsentInitialized, isAudioOnInPreview, isUserEnableJoinAudioConsent, isShowJoinAudioConsent, dispatch]);

  useEffect(() => {
    const checkPEPCSupport = async () => {
      const isSupported = await canUsePEPCPermissionQuery();
      setUsePEPC(isSupported);
    };

    if (isShowJoinAudioConsent) {
      // Close any existing permission error snackbars when the consent panel opens
      closeSnackbar();
      checkPEPCSupport();
    }
  }, [isShowJoinAudioConsent]);

  const handlePEPCConsent = async (permissions: { camera: boolean; microphone: boolean }) => {
    if (permissions.microphone) {
      if (isMicMuted) {
        await toggleMic();
      } else {
        await toggleMic(isUserMuteEntry);
      }
    }
    dispatch(setShowJoinAudioConsent(false));
  };

  const handleStandardConsent = async () => {
    await toggleMic(isUserMuteEntry);
    dispatch(setShowJoinAudioConsent(false));
  };

  const handleClose = () => {
    dispatch(setShowJoinAudioConsent(false));
  };

  if (!isShowJoinAudioConsent) {
    return null;
  }

  if (usePEPC && !isCheckedPEPC) {
    return <PEPCConsentPanel isOpen={isShowJoinAudioConsent} onClose={handleClose} onConsent={handlePEPCConsent} />;
  }

  return (
    <CommonNotification isOpen={isShowJoinAudioConsent} onClose={() => {}} allowClose={false} width={360} height={190}>
      <div className="flex flex-col h-full justify-between bg-theme-surface p-1">
        <div className="space-y-3">
          <h2 className="text-xl font-medium text-theme-text" id="uikit-join-audio-consent-title">
            Enable Audio
          </h2>
          <p className="leading-relaxed text-theme-text" id="uikit-join-audio-consent-content">
            Would you like to enable audio for this session?
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-theme-background text-theme-text border border-theme-border"
            onClick={handleClose}
            id="uikit-join-audio-consent-not-now"
          >
            Not Now
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-theme-text-button rounded hover:bg-blue-700 transition-colors"
            onClick={handleStandardConsent}
            id="uikit-join-audio-consent-enable"
            autoFocus
          >
            Enable
          </button>
        </div>
      </div>
    </CommonNotification>
  );
};

export default JoinAudioConsentPanelWithPEPC;
export { PEPCConsentPanel };
