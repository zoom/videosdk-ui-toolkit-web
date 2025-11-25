import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  HTMLAttributes,
  DetailedHTMLProps,
  DOMAttributes,
} from "react";
import { Video, User, Image as ImageIcon, X, MicOff, Headphones, VideoOff, TriangleAlert } from "lucide-react";
import ZoomVideo, { TestMicrophoneReturn, TestSpeakerReturn, VideoPlayer, VideoPlayerContainer } from "@zoom/videosdk";
import AvatarPicker from "../../components/widget/AvatarPicker";
import { CommonPopper } from "../../components/widget/CommonPopper";
import Button from "../../components/widget/CommonButton";
import { GRANT_PERMISSION_MESSAGE, LOCALSTORAGE_KEYS, THEME_COLOR_CLASS } from "@/constant";
import { isMobileDevice, isMobileLandscape, isPortrait } from "../../components/util/service";
import { useSnackbar } from "notistack";
import DeviceManager, { DeviceManagerEvents } from "@/components/util/DeviceManager";
import {
  setActiveVbImage,
  setIsMirrorVideo,
  setIsShowAVLearnDialog,
  setPreviewAVStatus,
  setShowJoinAudioConsent,
} from "@/store/uiSlice";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import AVLearnMoreDialog from "../../components/warning/AVLearnMoreDialog";
import PreviewAnimatedMicVolume from "@/features/audio/components/PreviewAnimatedMicVolume";
import DeviceSelector from "../../components/widget/DeviceSelector";
import PreviewVB from "./PreviewVB";
import { b64DecodeUnicode, b64EncodeUnicode } from "@/components/util/util";
import PreviewConsentDialog from "@/components/dialog/PreviewConsentDialog";

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["video-player"]: DetailedHTMLProps<HTMLAttributes<VideoPlayer>, VideoPlayer> & { className?: string };
      ["video-player-container"]: CustomElement<VideoPlayerContainer> & { className?: string };
    }
  }
}

// Initialize Zoom Video SDK tracks
let localAudio = ZoomVideo.createLocalAudioTrack();
const localVideo = ZoomVideo.createLocalVideoTrack();

interface Avatar {
  fileName: string;
  description: string;
  shape: string;
  directoryPath: string;
  url?: string;
}

interface PreviewPageProps {
  onJoinSession: (args: {
    displayName: string;
    avatarUrl: string;
    isCameraOn: boolean;
    isAudioOn: boolean;
    isMicMuted: boolean;
    selectedCamera: string;
    selectedMic: string;
    selectedSpeaker: string;
  }) => void;
  displayName: string;
  isSupportVirtualBackground: boolean;
  isAllowModifyName: boolean;
  isClientInit: boolean;
}

const grantPermissionMessage = "";
const PreviewPage: React.FC<PreviewPageProps> = ({
  onJoinSession,
  displayName,
  isSupportVirtualBackground,
  isAllowModifyName,
  isClientInit,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  // State management
  const [name, setName] = useState(displayName);
  const [videoState, setVideoState] = useState({
    isStarted: false,
    selectedCamera: "",
  });
  const [audioState, setAudioState] = useState({
    isStarted: false,
    isMuted: true,
    selectedMic: "",
    selectedSpeaker: "",
  });

  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isVBListOpen, setIsVBListOpen] = useState(false);
  const [isTestSpeaker, setIsTestSpeaker] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [isPortraitDevice, setIsPortraitDevice] = useState(isPortrait() && isMobileDevice());
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [hasShownConsentDialog, setHasShownConsentDialog] = useState(false);
  const speakerTesterRef = useRef<TestSpeakerReturn>();
  const microphoneTesterRef = useRef<TestMicrophoneReturn>();
  const [isGrantPermission, setIsGrantPermission] = useState({ microphone: true, camera: true });
  const { isShowAVlearnDialog, themeName, vbImageList, activeVbImage, isMirrorVideo } =
    useAppSelector(useSessionUISelector);
  const [devices, setDevices] = useState({
    cameras: [],
    microphones: [],
    speakers: [],
    activeMicrophone: "",
    activeSpeaker: "",
    activeCamera: "",
  });

  // Refs
  const videoRef = useRef<VideoPlayer>(null);
  const avatarButtonRef = useRef<HTMLDivElement>(null);
  const videoParentRef = useRef<HTMLDivElement>(null);

  // Add state to track parent dimensions
  const [parentDimensions, setParentDimensions] = useState({ width: 0, height: 0 });

  // Add this state to track rotation
  const [rotation, setRotation] = useState(0);

  const onDeviceChange = useCallback((allDevices) => {
    // Filter out devices with empty deviceIds
    const filteredDevices = {
      ...allDevices,
      cameras: allDevices.cameras.filter((device) => device.deviceId !== "default"), // camera no default value
      microphones: allDevices.microphones.filter((device) => device.deviceId !== ""),
      speakers: allDevices.speakers.filter((device) => device.deviceId !== ""),
    };

    const isGrantMicPermission = allDevices.microphones.find((device) => device.deviceId === "");
    // const isGrantSpeakerPermission = allDevices.speakers.find((device) => device.deviceId === "");
    const isGrantCameraPermission = allDevices.cameras.find((device) => device.deviceId === "");

    // Update permission state for UI (button tooltips, etc)
    if (isGrantMicPermission && !isGrantCameraPermission) {
      setIsGrantPermission((prev) => ({ ...prev, microphone: false }));
    }
    if (isGrantCameraPermission && !isGrantMicPermission) {
      setIsGrantPermission((prev) => ({ ...prev, camera: false }));
    }
    if (isGrantMicPermission && isGrantCameraPermission) {
      setIsGrantPermission((prev) => ({ ...prev, microphone: false, camera: false }));
    }

    // Note: We don't show permission error snackbars on the preview page
    // The preview page has its own consent dialog flow, and users can see
    // permission warnings on the button tooltips instead

    setDevices(filteredDevices);

    // Set default devices only if they have valid deviceIds
    if (filteredDevices.cameras.length && filteredDevices.activeCamera) {
      setVideoState((prev) => ({ ...prev, selectedCamera: filteredDevices.activeCamera }));
    }
    if (filteredDevices.microphones.length && filteredDevices.activeMicrophone) {
      setAudioState((prev) => ({ ...prev, selectedMic: filteredDevices.activeMicrophone }));
    }
    if (filteredDevices.speakers.length && filteredDevices.activeSpeaker) {
      setAudioState((prev) => ({ ...prev, selectedSpeaker: filteredDevices.activeSpeaker }));
    }
  }, []);

  useEffect(() => {
    DeviceManager.init();
    DeviceManager.on(DeviceManagerEvents.INIT_SUCCESS, (deviceState) => {
      onDeviceChange(deviceState);
    });
    DeviceManager.on(DeviceManagerEvents.INIT_FAIL, (deviceState) => {
      // eslint-disable-next-line no-console
      console.log("INIT_FAIL", deviceState);
      enqueueSnackbar("Failed to initialize devices. Please check device permissions.", {
        variant: "error",
        autoHideDuration: 5000,
      });
    });
    // Note: DEVICE_PERMISSION_MAY_GRANT event is not used anymore since we skip permission checks
    // until the user explicitly interacts with the consent dialog
    // DeviceManager.on(DeviceManagerEvents.DEVICE_PERMISSION_MAY_GRANT, (deviceState) => {
    //   console.log("DEVICE_PERMISSION_MAY_GRANT", deviceState);
    //   enqueueSnackbar("Camera and microphone access is required. Please grant permissions in your browser settings.", {
    //     variant: "warning",
    //     autoHideDuration: 7000,
    //     preventDuplicate: true,
    //   });
    // });

    DeviceManager.on(DeviceManagerEvents.DEVICE_CHANGED, (deviceState) => {
      onDeviceChange(deviceState);
      // enqueueSnackbar("Device configuration has changed", {
      //   variant: "info",
      //   autoHideDuration: 3000,
      // });
    });
  }, [enqueueSnackbar, onDeviceChange]);

  // Initialize devices
  const initializeDevices = useCallback(async () => {
    try {
      DeviceManager.on(DeviceManagerEvents.DEVICE_CHANGED, (deviceState) => {
        onDeviceChange(deviceState);
      });
    } catch (error) {
      enqueueSnackbar("Failed to initialize devices", { variant: "error" });
    }
  }, [enqueueSnackbar, onDeviceChange]);

  useEffect(() => {
    initializeDevices();

    // Load saved preferences
    const preAvatarString = localStorage.getItem(LOCALSTORAGE_KEYS.UIKIT_AVATAR);
    if (preAvatarString) {
      const avatar = JSON.parse(preAvatarString);
      avatar.url = `https://yourdomain/avatars/${avatar.directoryPath}/${avatar.fileName}`;
      setSelectedAvatar(avatar);
    }

    const preUserName = localStorage.getItem(LOCALSTORAGE_KEYS.UIKIT_USERNAME);
    if (preUserName && !displayName) {
      setName(b64DecodeUnicode(preUserName));
    }

    // Show consent dialog for PEPC or trigger native permission prompt for non-PEPC
    const checkAndShowConsentDialog = async () => {
      if (hasShownConsentDialog) return;

      const { canUsePEPCPermissionQuery, checkExistingPermissions } = await import("@/components/util/pepcDetection");
      const isPEPCSupported = await canUsePEPCPermissionQuery();

      if (isPEPCSupported) {
        // For PEPC browsers, show custom consent dialog
        const permissions = await checkExistingPermissions();

        // Only show dialog if permissions are not already granted
        if (!permissions.camera || !permissions.microphone) {
          setShowConsentDialog(true);
          setHasShownConsentDialog(true);
        } else {
          // Permissions already granted, update state
          setIsGrantPermission({
            camera: permissions.camera,
            microphone: permissions.microphone,
          });
          setHasShownConsentDialog(true);
        }
      } else {
        // For non-PEPC browsers, trigger native browser permission prompt automatically
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          // Permissions granted - stop the stream immediately
          stream.getTracks().forEach((track) => track.stop());

          // Update permission state
          setIsGrantPermission({ camera: true, microphone: true });
          setHasShownConsentDialog(true);
        } catch (error) {
          // Permission denied or error occurred
          // eslint-disable-next-line no-console
          console.warn("Failed to get media permissions:", error);
          setIsGrantPermission({ camera: false, microphone: false });
          setHasShownConsentDialog(true);
        }
      }
    };

    checkAndShowConsentDialog();
  }, [initializeDevices, displayName, hasShownConsentDialog]);

  useEffect(() => {
    return () => {
      const localTrackCleanUp = async () => {
        try {
          if (localAudio) await localAudio.stop();
        } catch (error) {
          //console.error(error);
        }
        try {
          if (localVideo) await localVideo.stop();
        } catch (error) {
          //console.error(error);
        }
        try {
          if (speakerTesterRef.current) {
            speakerTesterRef.current.stop();
            speakerTesterRef.current.destroy();
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      };
      localTrackCleanUp();
      try {
        if (microphoneTesterRef.current) {
          microphoneTesterRef.current.stop();
          microphoneTesterRef.current.destroy();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }

      DeviceManager.off(DeviceManagerEvents.DEVICE_CHANGED, onDeviceChange);
      DeviceManager.off(DeviceManagerEvents.INIT_SUCCESS, onDeviceChange);
      DeviceManager.off(DeviceManagerEvents.INIT_FAIL, onDeviceChange);
      DeviceManager.off(DeviceManagerEvents.DEVICE_SELECTED, onDeviceChange);
      DeviceManager.off(DeviceManagerEvents.DEVICE_PERMISSION_MAY_GRANT, onDeviceChange);
    };
  }, [onDeviceChange]);

  const handleVirtualBackgroundChange = useCallback(
    async (imageUrl: string) => {
      try {
        if (!videoState.isStarted) {
          return;
        }
        await localVideo.updateVirtualBackground(imageUrl);
      } catch (error) {
        enqueueSnackbar("Failed to update virtual background", { variant: "error" });
      }
    },
    [videoState.isStarted, enqueueSnackbar],
  );

  useEffect(() => {
    if (activeVbImage && videoState.isStarted) {
      handleVirtualBackgroundChange(activeVbImage);
    } else if (!activeVbImage) {
      handleVirtualBackgroundChange("");
    }
  }, [activeVbImage, handleVirtualBackgroundChange, videoState.isStarted]);

  // Handle video toggle
  const toggleCamera = useCallback(async () => {
    if (!isGrantPermission.camera) {
      dispatch(setIsShowAVLearnDialog(true));
      return;
    }
    if (videoState.isStarted) {
      await localVideo.stop();

      setVideoState((prev) => ({ ...prev, isStarted: false }));
    } else {
      try {
        await localVideo.switchCamera(videoState.selectedCamera);
        if (activeVbImage) {
          if (videoRef.current) {
            await localVideo.start(videoRef.current, { imageUrl: activeVbImage });
          }
        } else {
          if (videoRef.current) {
            await localVideo.start(videoRef.current);
          }
        }
        setVideoState((prev) => ({ ...prev, isStarted: true }));
      } catch (error) {
        enqueueSnackbar("Failed to start camera:" + error, { variant: "error" });
      }
    }
  }, [
    isGrantPermission.camera,
    videoState.isStarted,
    videoState.selectedCamera,
    dispatch,
    activeVbImage,
    enqueueSnackbar,
  ]);

  // Handle audio toggle
  const toggleMic = useCallback(async () => {
    if (!isGrantPermission.microphone) {
      dispatch(setIsShowAVLearnDialog(true));
      return;
    }
    if (!audioState.isStarted) {
      try {
        if (audioState.selectedMic !== "default") {
          localAudio = ZoomVideo.createLocalAudioTrack(audioState.selectedMic);
        }
        await localAudio.start();
        setAudioState((prev) => ({ ...prev, isStarted: true, isMuted: true }));
        await localAudio.unmute();
        setAudioState((prev) => ({ ...prev, isMuted: false }));
      } catch (error) {
        enqueueSnackbar("Failed to start microphone", { variant: "error" });
      }
    } else {
      if (audioState.isMuted) {
        await localAudio.unmute();
        setAudioState((prev) => ({ ...prev, isMuted: false }));
      } else {
        await localAudio.mute();
        setAudioState((prev) => ({ ...prev, isMuted: true }));
      }
    }
  }, [
    isGrantPermission.microphone,
    audioState.isStarted,
    audioState.selectedMic,
    audioState.isMuted,
    dispatch,
    enqueueSnackbar,
  ]);

  // Handle device changes
  const handleCameraChange = async (deviceId: string) => {
    try {
      await localVideo.switchCamera(deviceId);

      setVideoState((prev) => ({ ...prev, selectedCamera: deviceId }));
      DeviceManager.manuallySelectCamera(deviceId);
    } catch (error) {
      enqueueSnackbar("Failed to switch camera", { variant: "error" });
    }
  };

  const handleMicChange = async (deviceId: string) => {
    try {
      if (audioState.isStarted) {
        await localAudio.stop();
      }
      DeviceManager.manuallySelectMicrophone(deviceId);
      if (deviceId === "default") {
        localAudio = ZoomVideo.createLocalAudioTrack();
      } else {
        localAudio = ZoomVideo.createLocalAudioTrack(deviceId);
      }
      if (audioState.isStarted) {
        await localAudio.start();
        if (!audioState.isMuted) {
          await localAudio.unmute();
          setAudioState((prev) => ({ ...prev, isMuted: false }));
        }
      }

      setAudioState((prev) => ({ ...prev, selectedMic: deviceId }));
    } catch (error) {
      enqueueSnackbar("Failed to switch microphone", { variant: "error" });
    }
  };

  const handleJoinSession = () => {
    if (name.trim() === "") {
      enqueueSnackbar("Please enter your name before joining", { variant: "warning" });
      return;
    }

    // Join directly without showing consent dialog
    // (consent was already handled on page load for PEPC browsers)
    localStorage.setItem(LOCALSTORAGE_KEYS.UIKIT_USERNAME, b64EncodeUnicode(name));
    onJoinSession({
      displayName: name,
      avatarUrl: selectedAvatar?.url || "",
      isCameraOn: videoState.isStarted,
      isAudioOn: audioState.isStarted,
      isMicMuted: audioState.isMuted,
      selectedCamera: videoState.selectedCamera,
      selectedMic: audioState.selectedMic,
      selectedSpeaker: audioState.selectedSpeaker,
    });
  };

  const handleConsentResponse = async (permissions: { camera: boolean; microphone: boolean }) => {
    setShowConsentDialog(false);

    // If permissions were granted via PEPC, update the grant permission state
    // This prevents the AVLearnMoreDialog from showing when we try to start devices
    if (permissions.camera || permissions.microphone) {
      setIsGrantPermission({
        camera: permissions.camera ? true : isGrantPermission.camera,
        microphone: permissions.microphone ? true : isGrantPermission.microphone,
      });
    }

    // Start devices directly without using toggle functions to avoid closure issues
    try {
      // Handle camera
      if (permissions.camera && !videoState.isStarted) {
        await localVideo.switchCamera(videoState.selectedCamera);
        if (activeVbImage) {
          if (videoRef.current) {
            await localVideo.start(videoRef.current, { imageUrl: activeVbImage });
          }
        } else {
          if (videoRef.current) {
            await localVideo.start(videoRef.current);
          }
        }
        setVideoState((prev) => ({ ...prev, isStarted: true }));
      } else if (!permissions.camera && videoState.isStarted) {
        await localVideo.stop();
        setVideoState((prev) => ({ ...prev, isStarted: false }));
      }

      // Handle microphone
      if (permissions.microphone && !audioState.isStarted) {
        if (audioState.selectedMic !== "default") {
          localAudio = ZoomVideo.createLocalAudioTrack(audioState.selectedMic);
        }
        await localAudio.start();
        setAudioState((prev) => ({ ...prev, isStarted: true, isMuted: true }));
        await localAudio.unmute();
        setAudioState((prev) => ({ ...prev, isMuted: false }));
      } else if (!permissions.microphone && audioState.isStarted) {
        await localAudio.stop();
        setAudioState((prev) => ({ ...prev, isStarted: false }));
      }
    } catch (error) {
      enqueueSnackbar("Failed to start devices: " + error, { variant: "error" });
    }

    // Don't proceed with joining - user will click "Join Session" button when ready
  };

  const handleAvatarSelect = (avatar: Avatar) => {
    avatar.url = `https://yourdomain/avatars/${avatar.directoryPath}/${avatar.fileName}`;
    setSelectedAvatar(avatar);
    setIsAvatarPickerOpen(false);
  };

  useEffect(() => {
    if (isTestSpeaker && audioState.isStarted && !audioState.isMuted && localAudio) {
      localAudio.mute();
      setAudioState((prev) => ({ ...prev, isMuted: true }));
    }
  }, [audioState.isMuted, audioState.isStarted, isPlayingRecording, isRecordingVoice, isTestSpeaker]);

  const themeColorClass = themeName === "dark" ? "bg-theme-surface" : "text-black bg-theme-surface";
  const borderColor = themeName === "dark" ? "border-solid border border-gray-100 rounded-lg" : "border-gray-200";
  const vbButton = isSupportVirtualBackground && (
    <div className="absolute right-2">
      <div
        ref={avatarButtonRef}
        onClick={() => setIsVBListOpen(!isVBListOpen)}
        className={`hover:cursor-pointer inline-flex border w-8 h-8  items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background p-1 `}
        title="Change virtual background"
        id="uikit-preview-vb-button"
      >
        <ImageIcon className="h-6 w-6 text-theme-text" />
      </div>
    </div>
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setParentDimensions({ width, height });
      }
    });
    const handleOrientationChange = () => {
      if (videoParentRef.current) {
        resizeObserver.observe(videoParentRef.current);
        setParentDimensions({
          width: videoParentRef.current.clientWidth,
          height: videoParentRef.current.clientHeight,
        });
      }
      setIsPortraitDevice(isPortrait() && isMobileDevice());
    };

    // Initial setup
    handleOrientationChange();

    // Event listeners
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  const aspectStyle = isPortraitDevice ? "aspect-[3/4]" : "aspect-video";
  return (
    <div
      className={`${THEME_COLOR_CLASS} flex flex-col items-center justify-center w-full min-h-[100dvh] max-h-[100dvh] overflow-y-auto`}
    >
      <div
        className={`rounded-lg shadow-lg py-4 px-6 w-full ${isMobileDevice() ? "max-w-md" : "max-w-[800px] min-w-[300px]"} max-h-[100dvh] overflow-y-auto my-auto ${borderColor}`}
      >
        <h2 className="text-2xl font-bold mb-4 text-center" id="uikit-preview-title">
          What&apos;s your name?
        </h2>
        {/* Name and Avatar Input */}
        <div className="mb-4 flex items-center justify-center">
          <div className={`w-2/3 relative ${themeColorClass}`}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full p-2 pl-10 pr-10 border rounded focus:ring-2 focus:ring-blue-500 ${themeColorClass}`}
              id="uikit-preview-name-input"
              maxLength={300}
              autoFocus={isAllowModifyName}
              disabled={!isAllowModifyName}
              autoComplete="off"
            />
            <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeColorClass}`} />
            {isAllowModifyName && (
              <X
                className={`absolute right-3 top-1/2 transform -translate-y-1/2  cursor-pointer ${themeColorClass}`}
                onClick={() => {
                  setName("");
                  localStorage.removeItem(LOCALSTORAGE_KEYS.UIKIT_USERNAME);
                }}
              />
            )}
          </div>
          {/* {selectedAvatar ? (
            <div
              className="flex items-center rounded-lg bg-gray-100 h-10 w-10 hover:bg-gray-200 cursor-pointer"
              onClick={() => setIsAvatarPickerOpen(true)}
              ref={avatarButtonRef}
              title="Change Avatar"
              id="uikit-preview-avatar-button"
            >
              <img
                src={selectedAvatar.url}
                alt={selectedAvatar.description}
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
          ) : (
            <div
              ref={avatarButtonRef}
              onClick={() => setIsAvatarPickerOpen(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 w-10"
              title="Change Avatar"
              id="uikit-preview-avatar-button"
            >
              <ImageIcon className="h-6 w-6 text-black" />
            </div>
          )} */}
        </div>
        {/* Video Preview */}
        <div className="flex items-center justify-center">
          <div
            className={`mb-4 relative aspect-video rounded-lg border overflow-hidden items-center justify-center ${themeColorClass}`}
            style={{
              width: isPortraitDevice ? "190px" : "100%",
              aspectRatio: isPortraitDevice ? "3/4" : "16/9",
            }}
            ref={videoParentRef}
          >
            <video-player-container className="w-full rounded-lg object-cover">
              <video-player
                ref={videoRef}
                className={`w-full object-cover rounded-lg ${aspectStyle} mx-auto`}
                style={{
                  width: isPortraitDevice ? "190px" : "100%",
                  aspectRatio: isPortraitDevice ? "3/4" : "16/9",
                  transform: isMirrorVideo ? "scale(-1, 1)" : "",
                }}
              />
              {!videoState.isStarted && (
                <div
                  className={`absolute top-0 left-0 w-full h-full flex items-center justify-center ${themeColorClass}`}
                >
                  <Video className={`h-12 w-12 ${themeColorClass}`} />
                </div>
              )}
            </video-player-container>

            {/* Control Buttons Overlay */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <Button
                onClick={toggleMic}
                variant="danger"
                size="md"
                id="uikit-preview-mic-button"
                title={
                  isPlayingRecording || isRecordingVoice
                    ? "You can click on the microphone button when you are testing your microphone, please stop testing and wait for an moment"
                    : isGrantPermission.microphone
                      ? ""
                      : GRANT_PERMISSION_MESSAGE.microphone
                }
                className={`text-white bg-red-500/100 hover:bg-red-600/100`}
                disabled={isPlayingRecording || isRecordingVoice}
              >
                {!isGrantPermission.microphone ? (
                  <TriangleAlert className={`h-4 w-4`} />
                ) : !audioState.isStarted ? (
                  <Headphones className={`h-4 w-4`} />
                ) : audioState.isMuted ? (
                  <MicOff className={`h-4 w-4`} />
                ) : (
                  <PreviewAnimatedMicVolume localAudio={localAudio} iconColor={"text-white"} />
                )}
              </Button>
              <Button
                onClick={toggleCamera}
                variant="danger"
                size="md"
                id="uikit-preview-camera-button"
                title={isGrantPermission.camera ? "" : GRANT_PERMISSION_MESSAGE.camera}
                className={`text-white bg-red-500/100 hover:bg-red-600/100`}
              >
                {!isGrantPermission.camera ? (
                  <TriangleAlert className={`h-4 w-4`} />
                ) : videoState.isStarted ? (
                  <Video className={`h-4 w-4`} />
                ) : (
                  <VideoOff className={`h-4 w-4`} />
                )}
              </Button>
              {vbButton}
            </div>
          </div>
        </div>

        {/* Device Selection */}
        <div className={`flex justify-between mb-6 ${themeColorClass} bg-white`}>
          <DeviceSelector
            value={audioState.selectedSpeaker}
            onChange={(value) => {
              setAudioState((prev) => ({ ...prev, selectedSpeaker: value }));
              DeviceManager.manuallySelectSpeaker(value);
            }}
            devices={devices.speakers}
            disabled={isPlayingRecording || isRecordingVoice || isTestSpeaker}
            testTitle={isTestSpeaker ? "Stop" : "Test speaker"}
            deviceType="Speaker"
            id="uikit-preview-speaker-select"
            themeColorClass={themeColorClass}
            iconId="uikit-preview-test-speaker"
            clickIcon={() => {
              if (microphoneTesterRef.current) {
                microphoneTesterRef.current.destroy();
                microphoneTesterRef.current = undefined;
              }
              if (localAudio && !isTestSpeaker) {
                speakerTesterRef.current = localAudio.testSpeaker({
                  speakerId:
                    isMobileDevice() && audioState.selectedSpeaker === "default" ? "" : audioState.selectedSpeaker,
                });
              } else {
                if (speakerTesterRef.current) {
                  speakerTesterRef.current.stop();
                }
              }
              setIsTestSpeaker(!isTestSpeaker);
            }}
          />
          <DeviceSelector
            value={audioState.selectedMic}
            onChange={handleMicChange}
            devices={devices.microphones}
            testTitle={
              isPlayingRecording ? "Playing recording" : isRecordingVoice ? "Mic recording" : "Test microphone"
            }
            disabled={isPlayingRecording || isRecordingVoice}
            deviceType="Microphone"
            id="uikit-preview-mic-select"
            themeColorClass={themeColorClass}
            iconId="uikit-preview-test-microphone"
            clickIcon={() => {
              if (speakerTesterRef.current) {
                speakerTesterRef.current.destroy();
                speakerTesterRef.current = undefined;
              }
              if (!isPlayingRecording && !isRecordingVoice) {
                microphoneTesterRef.current = localAudio.testMicrophone({
                  microphoneId: isMobileDevice() && audioState.selectedMic === "default" ? "" : audioState.selectedMic,
                  speakerId:
                    isMobileDevice() && audioState.selectedSpeaker === "default" ? "" : audioState.selectedSpeaker,
                  recordAndPlay: true,
                  onAnalyseFrequency: () => {},
                  onStartRecording: () => {
                    setIsRecordingVoice(true);
                  },
                  onStartPlayRecording: () => {
                    setIsRecordingVoice(false);
                    setIsPlayingRecording(true);
                  },
                  onStopPlayRecording: () => {
                    setIsPlayingRecording(false);
                  },
                });
              } else if (isRecordingVoice) {
                microphoneTesterRef.current?.stopRecording();
                setIsRecordingVoice(false);
              } else if (isPlayingRecording) {
                microphoneTesterRef.current?.stop();
                setIsPlayingRecording(false);
              }
            }}
          />{" "}
          <DeviceSelector
            value={videoState.selectedCamera}
            onChange={handleCameraChange}
            devices={devices.cameras}
            deviceType="Camera"
            id="uikit-preview-camera-select"
            themeColorClass={themeColorClass}
          />
        </div>
        <div className="flex justify-center items-center py-4 mb-2">
          <Button
            onClick={() => {
              dispatch(
                setPreviewAVStatus({
                  isCameraOn: videoState.isStarted,
                  isAudioOn: audioState.isStarted,
                  isMicMuted: audioState.isMuted,
                }),
              );
              if (audioState.isStarted) {
                dispatch(setShowJoinAudioConsent(false));
              }
              handleJoinSession();
            }}
            className="w-2/3"
            id="uikit-preview-join-button"
            disabled={!isClientInit}
            title={grantPermissionMessage}
            autoFocus={!isAllowModifyName}
          >
            Join Session
          </Button>
        </div>
      </div>

      {/* Avatar Picker Modal */}

      {isVBListOpen && (
        <PreviewVB
          isOpen={isVBListOpen}
          onClose={() => setIsVBListOpen(false)}
          activeVbImage={activeVbImage}
          onSelectImage={(image) => {
            dispatch(setActiveVbImage(image));
          }}
          vbImageList={vbImageList}
          isMirrorVideo={isMirrorVideo}
          handleMirrorVideo={() => {
            dispatch(setIsMirrorVideo(!isMirrorVideo));
          }}
        />
      )}

      <CommonPopper
        width={400}
        height={isMobileLandscape() ? window.innerHeight : 610}
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        title="Choose Avatar"
        id="uikit-preview-avatar-popper"
      >
        <AvatarPicker
          isOpen={isAvatarPickerOpen}
          onClose={() => setIsAvatarPickerOpen(false)}
          onSelect={handleAvatarSelect}
        />
      </CommonPopper>
      {isShowAVlearnDialog && (
        <AVLearnMoreDialog
          open={true}
          handleClose={() => {
            dispatch(setIsShowAVLearnDialog(false));
          }}
        />
      )}

      <PreviewConsentDialog
        isOpen={showConsentDialog}
        onClose={() => {}}
        onConsent={handleConsentResponse}
        displayName={name}
      />
    </div>
  );
};

export default PreviewPage;
