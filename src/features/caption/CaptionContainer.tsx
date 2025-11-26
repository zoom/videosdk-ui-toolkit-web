import { HostCaptionSettings } from "./HostCaptionSettings";
import { SubtitleContainer } from "./SubtitleContainer";
import { CaptionHistoryWindow } from "./components/CaptionHistoryWindow";
import { StartCaptionsWindow } from "./components/StartCaptionsWindow";
import { useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";

export const CaptionContainer = () => {
  const { isShowStartCaptionsWindow, isShowHostCaptionSettings, isShowCaption, isShowCaptionHistory } =
    useAppSelector(useSessionUISelector);

  return (
    <>
      {isShowStartCaptionsWindow && <StartCaptionsWindow />}
      {isShowHostCaptionSettings && <HostCaptionSettings />}
      {isShowCaption && <SubtitleContainer />}
      {isShowCaptionHistory && <CaptionHistoryWindow />}
    </>
  );
};

export default CaptionContainer;
