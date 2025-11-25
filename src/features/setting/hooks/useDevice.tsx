import { useState, useContext, useCallback, useEffect, useRef } from "react";
import { MediaDevice } from "@/types";
import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { useMount, useUnmount } from "../../../hooks";
import {
  setActiveSpeaker,
  setActiveMicrophone,
  setActiveCamera,
  setActiveSecondaryMicrophone,
  setSelectedSecondaryMicrophone,
  setNoiseCancellationOptions,
} from "@/store/uiSlice";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import DeviceManager, { DeviceManagerEvents } from "@/components/util/DeviceManager";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { GRANT_PERMISSION_MESSAGE } from "@/constant";
import { isEmpty } from "lodash-es";
import ViewInstructions from "@/components/widget/ViewInstructions";
import { ExecutedResult } from "@zoom/videosdk";

function padDefaultDevice(devices: MediaDevice[]) {
  if (devices.findIndex((d) => d.deviceId === "default") === -1) {
    return [...devices, { label: "Same as System", deviceId: "default" }];
  }
  return devices;
}

export function useDevice(fn?: () => void) {
  const dispatch = useAppDispatch();
  const [cameraList, setCameraList] = useState<MediaDevice[]>([]);
  const [speakerList, setSpeakerList] = useState<MediaDevice[]>([]);
  const [microphoneList, setMicrophoneList] = useState<MediaDevice[]>([]);
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const [isGrantPermission, setIsGrantPermission] = useState<{ microphone: boolean; camera: boolean }>({
    microphone: true,
    camera: true,
  });
  const [hasInitialized, setHasInitialized] = useState(false);
  const {
    activeSecondaryMicrophone,
    selectedSecondaryMicrophone,
    noiseCancellationOptions,
    activeMicrophone,
    isShowJoinAudioConsent,
  } = useAppSelector(useSessionUISelector);
  const { debug, featuresOptions } = useAppSelector(useSessionSelector);

  const fnRef = useRef(fn);

  const onDeviceChange = useCallback(
    (allDevices: {
      cameras: MediaDevice[];
      microphones: MediaDevice[];
      speakers: MediaDevice[];
      activeCamera: string;
      activeMicrophone: string;
      activeSpeaker: string;
    }) => {
      // Filter out devices with empty deviceIds
      if (isEmpty(allDevices)) {
        return;
      }
      const filteredDevices = {
        ...allDevices,
        cameras: allDevices.cameras.filter((device) => device.deviceId !== ""),
        microphones: allDevices.microphones.filter((device) => device.deviceId !== ""),
        speakers: allDevices.speakers.filter((device) => device.deviceId !== ""),
      };

      setCameraList(filteredDevices.cameras);
      setMicrophoneList(filteredDevices.microphones);
      setSpeakerList(filteredDevices.speakers);

      if (allDevices?.activeCamera) dispatch?.(setActiveCamera(allDevices.activeCamera));
      if (allDevices?.activeMicrophone) dispatch?.(setActiveMicrophone(allDevices.activeMicrophone));
      if (allDevices?.activeSpeaker) dispatch?.(setActiveSpeaker(allDevices.activeSpeaker));

      const isGrantMicPermission = allDevices.microphones.find((device) => device.deviceId === "");
      const isGrantCameraPermission = allDevices.cameras.find((device) => device.deviceId === "");

      // Check if we have microphones or cameras with valid IDs AND labels
      // Valid deviceId + label means permission was actually granted
      const hasValidMicOrCamera =
        allDevices.microphones.some((device) => device.deviceId !== "" && device.label !== "") ||
        allDevices.cameras.some((device) => device.deviceId !== "" && device.label !== "");

      // Only show permission errors if:
      // 1. We have completed initial device enumeration (with delay), AND
      // 2. The join audio consent panel is not currently showing, AND
      // 3. We have at least some valid mic/camera devices (meaning permission was granted at some point), AND
      // 4. joinAudioConsent feature is NOT enabled (if it is, the PEPC panel will handle permissions)
      // This prevents error messages from appearing on initial load or when PEPC panel should be shown
      const shouldShowError =
        hasInitialized && !isShowJoinAudioConsent && hasValidMicOrCamera && !featuresOptions?.audio?.joinAudioConsent;

      if (shouldShowError) {
        let grantPermissionMessage = "";
        if (isGrantMicPermission && !isGrantCameraPermission) {
          grantPermissionMessage = GRANT_PERMISSION_MESSAGE.microphone;
          setIsGrantPermission((prev) => ({ ...prev, microphone: false }));
        }
        if (isGrantCameraPermission && !isGrantMicPermission) {
          grantPermissionMessage = GRANT_PERMISSION_MESSAGE.camera;
          setIsGrantPermission((prev) => ({ ...prev, camera: false }));
        }
        if (isGrantMicPermission && isGrantCameraPermission) {
          grantPermissionMessage = GRANT_PERMISSION_MESSAGE.microphoneAndCamera;
          setIsGrantPermission((prev) => ({ ...prev, microphone: false, camera: false }));
        }
        if (grantPermissionMessage) {
          enqueueSnackbar(
            <div className="flex items-center justify-between w-full gap-3">
              <span className="flex-1 text-sm font-medium">{grantPermissionMessage}</span>
              <ViewInstructions
                variant="primary"
                size="sm"
                className="px-3 py-1.5 text-sm"
                onDialogShow={() => closeSnackbar()}
              />
            </div>,
            {
              variant: "error",
              autoHideDuration: null,
              preventDuplicate: true,
            },
          );
        }
      }
    },
    [dispatch, isShowJoinAudioConsent, hasInitialized, featuresOptions?.audio?.joinAudioConsent],
  );

  const changeSpeaker = useCallback(
    async (deviceId: string) => {
      if (stream) {
        await stream.switchSpeaker(deviceId);
        dispatch?.(setActiveSpeaker(deviceId));
        DeviceManager.manuallySelectSpeaker(deviceId);
      }
    },
    [stream, dispatch],
  );

  const changeMicrophone = useCallback(
    async (deviceId: string) => {
      if (stream) {
        await stream.switchMicrophone(deviceId);
        dispatch?.(setActiveMicrophone(deviceId));
        DeviceManager.manuallySelectMicrophone(deviceId);
      }
    },
    [stream, dispatch],
  );

  const changeCamera = useCallback(
    async (deviceId: string) => {
      if (stream) {
        await stream.switchCamera(deviceId);
        dispatch?.(setActiveCamera(deviceId));
        DeviceManager.manuallySelectCamera(deviceId);
      }
    },
    [stream, dispatch],
  );

  const startSecondaryAudio = useCallback(
    async (
      deviceId: string,
      constraints?: Pick<MediaTrackConstraints, "autoGainControl" | "noiseSuppression" | "echoCancellation">,
    ): Promise<ExecutedResult> => {
      if (!stream) throw new Error("No stream available");

      try {
        const result = await stream.startSecondaryAudio(deviceId, constraints);
        dispatch?.(setActiveSecondaryMicrophone(true));
        if (constraints) {
          dispatch?.(setNoiseCancellationOptions(constraints));
        }
        return result;
      } catch (error) {
        dispatch?.(setSelectedSecondaryMicrophone(""));
        throw error;
      }
    },
    [stream, dispatch],
  );

  const stopSecondaryAudio = useCallback(async (): Promise<ExecutedResult> => {
    if (!stream) throw new Error("No stream available");

    try {
      const result = await stream.stopSecondaryAudio();
      dispatch?.(setActiveSecondaryMicrophone(false));
      return result;
    } catch (error) {
      dispatch?.(setSelectedSecondaryMicrophone(null));
      throw error;
    }
  }, [stream, dispatch]);

  const updateNoiseCancellationOptions = useCallback(
    async (
      option: keyof Pick<MediaTrackConstraints, "autoGainControl" | "noiseSuppression" | "echoCancellation">,
      deviceId: string,
      currentOptions: MediaTrackConstraints,
      setIsUpdatingOptions?: (loading: boolean) => void,
    ) => {
      const newOptions = {
        ...currentOptions,
        [option]: !currentOptions[option],
      };

      dispatch?.(setNoiseCancellationOptions(newOptions));

      if (activeSecondaryMicrophone && deviceId) {
        try {
          setIsUpdatingOptions?.(true);
          await stopSecondaryAudio();
          await startSecondaryAudio(deviceId, newOptions);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Error updating secondary audio constraints:", error);
          dispatch?.(setNoiseCancellationOptions(currentOptions));
          throw error;
        } finally {
          setIsUpdatingOptions?.(false);
        }
      }
    },
    [dispatch, startSecondaryAudio, stopSecondaryAudio, activeSecondaryMicrophone],
  );

  useMount(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    DeviceManager.init();
    if (debug) {
      // eslint-disable-next-line no-console
      console.log("DeviceManager init");
    }
    DeviceManager.watchInitComplete().then(() => {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log("DeviceManager init complete");
      }
      timeoutId = setTimeout(() => {
        setHasInitialized(true);
      }, 500);
    });
    DeviceManager.on(DeviceManagerEvents.INIT_SUCCESS, onDeviceChange);
    DeviceManager.on(DeviceManagerEvents.INIT_FAIL, () => {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log("DeviceManager init fail");
      }
    });
    DeviceManager.on(DeviceManagerEvents.DEVICE_CHANGED, onDeviceChange);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });

  useUnmount(() => {
    DeviceManager.off(DeviceManagerEvents.INIT_SUCCESS, onDeviceChange);
    DeviceManager.off(DeviceManagerEvents.DEVICE_CHANGED, onDeviceChange);
    if (debug) {
      // eslint-disable-next-line no-console
      console.log("DeviceManager destroy");
    }
  });

  // useEffect(() => {
  //   if (isGrantPermission.microphone || isGrantPermission.camera) {
  //     dispatch(setIsShowAVLearnDialog(true));
  //   }
  // }, [isGrantPermission]);

  useEffect(() => {
    client.on("device-change", onDeviceChange);
    return () => {
      client.off("device-change", onDeviceChange);
    };
  }, [client, onDeviceChange]);

  useMount(() => {
    if (stream) {
      dispatch?.(setActiveCamera(stream.getActiveCamera()));
      dispatch?.(setActiveMicrophone(stream.getActiveMicrophone()));
      dispatch?.(setActiveSpeaker(stream.getActiveSpeaker()));
    }
    fnRef.current?.();
  });

  return {
    cameraList,
    speakerList,
    microphoneList,
    changeSpeaker,
    changeMicrophone,
    changeCamera,
    startSecondaryAudio,
    stopSecondaryAudio,
    updateNoiseCancellationOptions,
  };
}
