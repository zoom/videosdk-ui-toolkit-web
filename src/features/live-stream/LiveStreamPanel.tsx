import CommonInput from "@/components/widget/CommonInput";
import { CommonPopper } from "@/components/widget/CommonPopper";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setLiveStreamConfig } from "@/store/sessionSlice";
import { setIsShowLiveStreamPanel } from "@/store/uiSlice";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useLiveStreamChange } from "./hooks";
import { LiveStreamStatus } from "@zoom/videosdk";
import sessionAdditionalContext from "@/context/session-additional-context";

const LiveStreamPanel = () => {
  const { t } = useTranslation();
  const { isShowLiveStreamPanel } = useAppSelector(useSessionUISelector);
  const { liveStreamStatus, liveStreamConfig } = useAppSelector(useSessionSelector);
  const { streamUrl, streamKey, broadcastUrl } = liveStreamConfig;
  const { liveStreamClient } = useContext(sessionAdditionalContext);
  const dispatch = useAppDispatch();

  useLiveStreamChange();

  const isStartLiveStreamButtonDisabled = !streamUrl || !streamKey || !broadcastUrl;
  const startLiveStreamButtonClass = isStartLiveStreamButtonDisabled
    ? "bg-gray-400 text-theme-text-button py-2 px-4 rounded-lg text-sm"
    : "bg-blue-500 hover:bg-blue-600 text-theme-text-button py-2 px-4 rounded-lg text-sm";

  const handleInputChange = useCallback(
    (userInput) => {
      dispatch(setLiveStreamConfig({ ...liveStreamConfig, ...userInput }));
    },
    [dispatch, liveStreamConfig],
  );

  const handleStartLiveStream = useCallback(async () => {
    if (liveStreamClient) {
      try {
        await liveStreamClient.startLiveStream(streamUrl, streamKey, broadcastUrl);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }, [broadcastUrl, liveStreamClient, streamKey, streamUrl]);

  const handleStopLiveStream = useCallback(async () => {
    if (liveStreamClient) {
      try {
        await liveStreamClient.stopLiveStream();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }, [liveStreamClient]);

  return (
    <CommonPopper
      isOpen={isShowLiveStreamPanel}
      title={t("livestream.panel_title")}
      width={600}
      height={400}
      onClose={() => dispatch(setIsShowLiveStreamPanel(false))}
    >
      <div className="p-5 flex flex-col">
        <h3 className="text-base font-semibold mb-4">{t("livestream.configuration_title")}</h3>
        <CommonInput
          label={t("livestream.stream_url_label")}
          value={streamUrl}
          onChange={(e) => handleInputChange({ streamUrl: e.target.value })}
          placeholder="rtmp://..."
          required
          disabled={
            liveStreamStatus === LiveStreamStatus.Connecting || liveStreamStatus === LiveStreamStatus.InProgress
          }
        />
        <CommonInput
          label={t("livestream.stream_key_label")}
          value={streamKey}
          onChange={(e) => handleInputChange({ streamKey: e.target.value })}
          type="password"
          required
          disableAutofill
          disabled={
            liveStreamStatus === LiveStreamStatus.Connecting || liveStreamStatus === LiveStreamStatus.InProgress
          }
        />
        {
          <CommonInput
            label={t("livestream.broadcast_url_label")}
            value={broadcastUrl}
            onChange={(e) => handleInputChange({ broadcastUrl: e.target.value })}
            placeholder="https://..."
            required
            disabled={
              liveStreamStatus === LiveStreamStatus.Connecting || liveStreamStatus === LiveStreamStatus.InProgress
            }
          />
        }
        <div className="flex justify-center m-2">
          {(liveStreamStatus === LiveStreamStatus.Ended || liveStreamStatus === LiveStreamStatus.Timeout) && (
            <button
              disabled={isStartLiveStreamButtonDisabled}
              className={startLiveStreamButtonClass}
              onClick={handleStartLiveStream}
            >
              {t("livestream.start_button")}
            </button>
          )}
          {liveStreamStatus === LiveStreamStatus.InProgress && (
            <button
              className="bg-red-500 hover:bg-red-600 text-theme-text-button py-2 px-4 rounded-lg text-sm"
              onClick={handleStopLiveStream}
            >
              {t("livestream.stop_button")}
            </button>
          )}
          {liveStreamStatus === LiveStreamStatus.Connecting && (
            <button className="bg-gray-400 text-theme-text-button py-2 px-4 rounded-lg text-sm animate-pulse" disabled>
              {t("livestream.connecting")}
            </button>
          )}
        </div>
      </div>
    </CommonPopper>
  );
};

export default LiveStreamPanel;
