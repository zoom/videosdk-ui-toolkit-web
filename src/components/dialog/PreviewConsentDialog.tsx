import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { isPEPCSupported, canUsePEPCPermissionQuery } from "@/components/util/pepcDetection";
import PermissionElement from "@/components/widget/PermissionElement";
import { setPreviewAVStatus } from "@/store/uiSlice";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";

interface PEPCPermissionStatus {
  camera: {
    state: PermissionState;
  };
  microphone: {
    state: PermissionState;
  };
}

interface PreviewPEPCDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (permissions: { camera: boolean; microphone: boolean }) => void;
  displayName: string;
}

const PreviewPEPCDialog: React.FC<PreviewPEPCDialogProps> = ({ isOpen, onConsent }) => {
  const [permissionStatus, setPermissionStatus] = useState<PEPCPermissionStatus>({
    camera: { state: "prompt" },
    microphone: { state: "prompt" },
  });

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

  // Auto-proceed if permissions are already granted
  useEffect(() => {
    if (isOpen && permissionStatus.camera.state === "granted" && permissionStatus.microphone.state === "granted") {
      // Permissions already granted, auto-proceed after a short delay
      const timer = setTimeout(() => {
        onConsent({ camera: true, microphone: true });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, permissionStatus, onConsent]);

  const handleContinueWithoutMedia = () => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-theme-surface rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-theme-text mb-2">
                Do you want people to see you in the session?
              </h3>
              <p className="text-sm text-theme-text leading-relaxed opacity-75">
                You can still turn off your microphone and camera anytime in the session
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-theme-divider"></div>

          {/* Current Permission Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-theme-text opacity-60 uppercase tracking-wider">
              Current Permissions
            </h4>

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

              {/* Microphone Permission Status */}
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

          {/* Permission Action Buttons */}
          <div className="space-y-3">
            <div className="space-y-2">
              <PermissionElement
                type="camera microphone"
                onPermissionChange={(state) => {
                  if (state === "granted") {
                    // Both permissions granted - call onConsent to proceed
                    onConsent({ camera: true, microphone: true });
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

          {/* PEPC Info */}
          <div className="text-xs text-theme-text opacity-60 text-center">
            <p>Permissions granted will last for this browser session and can be revoked anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Standard preview dialog fallback
interface StandardPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (permissions: { camera: boolean; microphone: boolean }) => void;
  displayName: string;
}

const StandardPreviewDialog: React.FC<StandardPreviewDialogProps> = ({ isOpen, onConsent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-theme-surface rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-theme-text mb-2">
              Do you want people to see you in the session?
            </h3>
            <p className="text-sm text-theme-text leading-relaxed opacity-75">
              You can still turn off your microphone and camera anytime in the session
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onConsent({ camera: true, microphone: true })}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Use microphone and camera
            </button>

            <button
              onClick={() => onConsent({ camera: false, microphone: false })}
              className="w-full px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors"
            >
              Continue without microphone and camera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component that decides between PEPC and standard dialog
interface PreviewConsentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (permissions: { camera: boolean; microphone: boolean }) => void;
  displayName: string;
}

const PreviewConsentDialog: React.FC<PreviewConsentDialogProps> = (props) => {
  const [usePEPC, setUsePEPC] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const {
    previewStatus: { isCheckedPEPC },
  } = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const checkPEPCSupport = async () => {
      if (!props.isOpen) {
        setIsChecking(false);
        return;
      }

      try {
        // First check if PEPC is supported by browser
        if (!isPEPCSupported()) {
          setUsePEPC(false);
          setIsChecking(false);
          return;
        }

        // Then check if PEPC permission query actually works
        const canUsePEPC = await canUsePEPCPermissionQuery();
        setUsePEPC(canUsePEPC);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("PEPC detection failed:", error);
        setUsePEPC(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkPEPCSupport();
  }, [props.isOpen]);

  useEffect(() => {
    if (isChecking !== isCheckedPEPC && isChecking) {
      dispatch(setPreviewAVStatus({ isCheckedPEPC: true }));
    }
  }, [isChecking, isCheckedPEPC, dispatch]);

  // Don't render anything while checking PEPC support
  if (isChecking) {
    return null;
  }

  // Use PEPC dialog if supported, otherwise fall back to standard
  if (usePEPC) {
    return <PreviewPEPCDialog {...props} />;
  }

  return <StandardPreviewDialog {...props} />;
};

export default PreviewConsentDialog;
export { PreviewPEPCDialog, StandardPreviewDialog };
