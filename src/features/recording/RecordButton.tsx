import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { useRecordingChange } from "./hooks/useRecordingChange";
import { ClientContext } from "@/context/client-context";
import { Pause, Square, CirclePlay } from "lucide-react";
import { useContext } from "react";
import { useRecording } from "./hooks/useRecording";
import { RecordingStatus } from "@/types/index.d";
import ControlButton from "@/components/widget/ControlButton";
import RecordingIcon from "@/components/svg-icon/recordingIcon";
import { checkIsFeatureEnable } from "@/components/util/util";

export const RecordButton = ({ orientation = "horizontal" }: { orientation: "horizontal" | "vertical" }) => {
  const client = useContext(ClientContext);
  const dispatch = useAppDispatch();
  const { featuresOptions, config } = useAppSelector(useSessionSelector);
  const { themeName } = useAppSelector(useSessionUISelector);
  const userFeaturesOptions = config?.featuresOptions;
  const isRecordingSupported = checkIsFeatureEnable(featuresOptions, userFeaturesOptions, "recording") || false;
  const {
    isHostOrManager,
    startRecording,
    stopRecording,
    pauseRecording,
    recordingStatus,
    resumeRecording,
    isRecordingSessionActive,
  } = useRecording();

  useRecordingChange(client, dispatch);

  const handleRecordClick = () => {
    if (recordingStatus === RecordingStatus.Stopped) {
      startRecording();
    } else if (recordingStatus === RecordingStatus.Paused) {
      resumeRecording();
    } else if (recordingStatus === RecordingStatus.Recording) {
      pauseRecording();
    }
  };

  const getRecordButtonProps = () => {
    const props = {
      isActive: true,
      onClick: handleRecordClick,
      disabled: !isHostOrManager,
      isLoading: false,
      className: "hover:bg-theme-background w-9",
      iconColor: themeName === "dark" ? "white" : "black",
    };

    switch (recordingStatus) {
      case RecordingStatus.Recording:
        return { ...props, icon: Pause, iconColor: "red", title: "Pause" };
      case RecordingStatus.Paused:
        return { ...props, icon: CirclePlay, title: "Resume" };
      default:
        return {
          ...props,
          icon: RecordingIcon,
          iconColor: "text-theme-text",
          title: "Start Recording",
          className: "bg-transparent",
        };
    }
  };

  if (!isRecordingSupported) return null;

  return (
    <div className="relative">
      <div
        className={`flex items-center ${orientation === "vertical" ? "rounded-lg w-full justify-center hover:bg-theme-background" : "rounded-full"} overflow-hidden bg-theme-surface border border-theme-border`}
      >
        <ControlButton
          {...getRecordButtonProps()}
          hoverColor="hover:bg-theme-background"
          id={`uikit-footer-record-${getRecordButtonProps().title.toLowerCase()}`}
          orientation={orientation}
        />
        {isRecordingSessionActive && <div className="w-px h-4 border border-theme-border"></div>}
        {isRecordingSessionActive && (
          <ControlButton
            icon={Square}
            isActive={true}
            onClick={stopRecording}
            disabled={!isHostOrManager}
            isLoading={false}
            iconColor={themeName === "dark" ? "white" : "black"}
            className={`hover:bg-theme-background w-9`}
            title="Stop"
            id={"uikit-footer-record-stop"}
            orientation={orientation}
          />
        )}
      </div>
    </div>
  );
};

export default RecordButton;
