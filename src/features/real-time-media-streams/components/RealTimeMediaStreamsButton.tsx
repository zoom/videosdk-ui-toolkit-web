import { useContext } from "react";
import { RealTimeMediaStreamsStatus } from "@zoom/videosdk";
import { Tv, TvMinimal, MonitorStop, MonitorPause } from "lucide-react";
import ControlButton from "@/components/widget/ControlButton";
import {
  useAppSelector,
  useAppDispatch,
  useRtmsSelector,
  useSessionSelector,
  useSessionUISelector,
} from "@/hooks/useAppSelector";
import sessionAdditionalContext from "@/context/session-additional-context";
import { setRtmsLoading } from "../rtmsSlice";

interface RealTimeMediaStreamsButtonProps {
  orientation?: "horizontal" | "vertical";
}

export const RealTimeMediaStreamsButton = ({ orientation = "horizontal" }: RealTimeMediaStreamsButtonProps) => {
  const dispatch = useAppDispatch();
  const { realTimeMediaStreamsClient } = useContext(sessionAdditionalContext);
  const { status: rtmsStatus, isLoading } = useAppSelector(useRtmsSelector);
  const { isHost } = useAppSelector(useSessionSelector);
  const { themeName } = useAppSelector(useSessionUISelector);

  const isRtmsSessionActive =
    rtmsStatus === RealTimeMediaStreamsStatus.Start || rtmsStatus === RealTimeMediaStreamsStatus.Pause;

  const handleStartClick = async () => {
    dispatch(setRtmsLoading(true));
    await realTimeMediaStreamsClient?.startRealTimeMediaStreams();
  };

  const handlePauseClick = async () => {
    await realTimeMediaStreamsClient?.pauseRealTimeMediaStreams();
  };

  const handleResumeClick = async () => {
    await realTimeMediaStreamsClient?.resumeRealTimeMediaStreams();
  };

  const handleStopClick = async () => {
    await realTimeMediaStreamsClient?.stopRealTimeMediaStreams();
  };

  const handleMainButtonClick = () => {
    if (rtmsStatus === RealTimeMediaStreamsStatus.Start) {
      handlePauseClick();
    } else if (rtmsStatus === RealTimeMediaStreamsStatus.Pause) {
      handleResumeClick();
    } else {
      handleStartClick();
    }
  };

  const getMainButtonProps = () => {
    const baseProps = {
      isActive: true,
      className: "hover:bg-theme-background",
      iconColor: themeName === "dark" ? "white" : "black",
      onClick: handleMainButtonClick,
    };

    switch (rtmsStatus) {
      case RealTimeMediaStreamsStatus.Start:
        return {
          ...baseProps,
          icon: MonitorPause,
          iconColor: "red",
          title: "Pause RTMS",
          disabled: !isHost,
          isLoading: false,
        };
      case RealTimeMediaStreamsStatus.Pause:
        return {
          ...baseProps,
          icon: TvMinimal,
          title: "Resume RTMS",
          disabled: !isHost,
          isLoading: false,
        };
      default:
        return {
          ...baseProps,
          icon: Tv,
          title: "Start RTMS",
          disabled: !isHost || isLoading,
          isLoading: isLoading,
        };
    }
  };

  if (!isHost || !realTimeMediaStreamsClient?.isSupportRealTimeMediaStreams()) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className={`flex items-center ${orientation === "vertical" ? "rounded-lg w-full justify-center hover:bg-theme-background" : "rounded-full"} overflow-hidden bg-theme-surface border border-theme-border`}
      >
        <ControlButton
          {...getMainButtonProps()}
          hoverColor="hover:bg-theme-background"
          id={`uikit-footer-rtms-${getMainButtonProps().title.toLowerCase().replace(/\s/g, "-")}`}
          orientation={orientation}
        />
        {isRtmsSessionActive && <div className="w-px h-4 border border-theme-border"></div>}
        {isRtmsSessionActive && (
          <ControlButton
            icon={MonitorStop}
            isActive={true}
            onClick={handleStopClick}
            disabled={!isHost}
            isLoading={false}
            iconColor={themeName === "dark" ? "white" : "black"}
            className="hover:bg-theme-background"
            title="Stop RTMS"
            id="uikit-footer-rtms-stop"
            orientation={orientation}
          />
        )}
      </div>
    </div>
  );
};

export default RealTimeMediaStreamsButton;
