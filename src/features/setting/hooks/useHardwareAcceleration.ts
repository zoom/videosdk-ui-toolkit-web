import { useCallback, useContext } from "react";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsEnableHardwareAccelerationReceiving, setIsEnableHardwareAccelerationSending } from "@/store/uiSlice";

export function useHardwareAcceleration() {
  const dispatch = useAppDispatch();
  const { stream } = useContext(StreamContext);
  const { isEnableHardwareAccelerationReceiving, isEnableHardwareAccelerationSending, isStartedHardwareAcceleration } =
    useAppSelector(useSessionUISelector);

  const onHardwareAccelerationReceivingCheck = useCallback(async () => {
    if (stream) {
      try {
        const result = await stream.enableHardwareAcceleration({ decode: !isEnableHardwareAccelerationReceiving });
        if (result) {
          dispatch(setIsEnableHardwareAccelerationReceiving(!isEnableHardwareAccelerationReceiving));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error toggling hardware acceleration for receiving:", error);
      }
    }
  }, [dispatch, isEnableHardwareAccelerationReceiving, stream]);

  const onHardwareAccelerationSendingCheck = useCallback(async () => {
    if (stream) {
      try {
        const result = await stream.enableHardwareAcceleration({ encode: !isEnableHardwareAccelerationSending });
        if (result) {
          dispatch(setIsEnableHardwareAccelerationSending(!isEnableHardwareAccelerationSending));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error toggling hardware acceleration for sending:", error);
      }
    }
  }, [dispatch, isEnableHardwareAccelerationSending, stream]);

  return {
    isEnableHardwareAccelerationReceiving,
    isEnableHardwareAccelerationSending,
    isStartedHardwareAcceleration,
    onHardwareAccelerationReceivingCheck,
    onHardwareAccelerationSendingCheck,
  };
}
