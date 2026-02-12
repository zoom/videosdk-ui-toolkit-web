import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ZoomStreaming, {
  type LiveVideo,
  type LiveVideoContainer,
  VideoQuality,
} from "@zoom/videosdk/broadcast-streaming";
import { Activity } from "lucide-react";
import { decodeJWTPlayload } from "@/components/util/util";
import type { BroadcastViewerOptions } from "@/types/index.d";

type CustomElement<T> = Partial<Omit<T, "children"> & React.DOMAttributes<T> & { children?: React.ReactNode }>;
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["live-video"]: React.DetailedHTMLProps<React.HTMLAttributes<LiveVideo>, LiveVideo> & { class?: string };
      ["live-video-container"]: CustomElement<LiveVideoContainer> & { class?: string; webEndpoint?: string };
    }
  }
}

type BroadcastViewerProps = {
  /**
   * Optional configuration passed from UIToolkit.showBroadcastViewerComponent.
   */
  options?: BroadcastViewerOptions;
};

const BroadcastViewer: React.FC<BroadcastViewerProps> = ({ options }) => {
  const { t, i18n } = useTranslation();

  const desiredLanguage = options?.language || "en-US";

  useEffect(() => {
    if (desiredLanguage && i18n.language !== desiredLanguage) {
      i18n.changeLanguage(desiredLanguage);
    }
  }, [desiredLanguage, i18n]);

  const channelId = options?.channelId || "";
  const signature = options?.signature || "";

  let topic = "";
  if (signature) {
    const payload = decodeJWTPlayload(signature) as { tpc?: string } | undefined;
    if (payload?.tpc && typeof payload.tpc === "string") {
      topic = payload.tpc;
    }
  }
  const webEndpoint = options?.webEndpoint || "zoom.us";
  const dependentAssets = options?.dependentAssets;

  const liveVideoRef = useRef<LiveVideo | null>(null);
  const streamingClientRef = useRef(ZoomStreaming.createClient({ webEndpoint, dependentAssets }));
  const invokedRef = useRef(false);

  useEffect(() => {
    return () => {
      ZoomStreaming.destroyClient();
    };
  }, []);

  type AudioStats = {
    rtt: number;
    jitter: number;
    avg_loss: number;
    max_loss: number;
    sample_rate: number;
    bandwidth: number;
    bitrate: number;
    timestamp: number;
  };

  type VideoStats = {
    rtt: number;
    jitter: number;
    avg_loss: number;
    max_loss: number;
    width: number;
    height: number;
    fps: number;
    bandwidth: number;
    bitrate: number;
    timestamp: number;
  };

  const [status, setStatus] = useState<{ value: string; reason?: string }>({
    value: channelId && signature ? "Connecting" : "Idle",
  });
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [statsTab, setStatsTab] = useState<"audio" | "video">("audio");
  const [audioStats, setAudioStats] = useState<AudioStats>({
    rtt: 0,
    jitter: 0,
    avg_loss: 0,
    max_loss: 0,
    sample_rate: 0,
    bandwidth: 0,
    bitrate: 0,
    timestamp: 0,
  });
  const [videoStats, setVideoStats] = useState<VideoStats>({
    rtt: 0,
    jitter: 0,
    avg_loss: 0,
    max_loss: 0,
    width: 0,
    height: 0,
    fps: 0,
    bandwidth: 0,
    bitrate: 0,
    timestamp: 0,
  });
  const hasConfig = Boolean(channelId && signature);

  const statusLabel = useMemo(() => {
    if (!hasConfig) return t("broadcast_viewer_status_no_config");
    switch (status.value) {
      case "Connected":
        return t("broadcast_viewer_status_live");
      case "Fail":
        return t("broadcast_viewer_status_no_signal");
      case "Connecting":
        return t("broadcast_viewer_status_connecting");
      case "Idle":
        return t("broadcast_viewer_status_idle");
      case "Ended":
        return t("broadcast_viewer_status_ended");
      default:
        return status.value || t("broadcast_viewer_status_unknown");
    }
  }, [hasConfig, status, t]);

  const isLive = hasConfig && status.value === "Connected";

  const errorMessage = useMemo(() => {
    if (!hasConfig) return "";
    if (status.value === "Fail") {
      return status.reason || t("broadcast_viewer_error_unable_to_play");
    }
    if (status.value === "Ended") {
      return t("broadcast_viewer_error_ended");
    }
    return "";
  }, [hasConfig, status, t]);

  const hasStatsData = useMemo(() => {
    return audioStats.timestamp !== 0 || videoStats.timestamp !== 0;
  }, [audioStats.timestamp, videoStats.timestamp]);

  const formatMs = (value: number) => {
    if (!value) return "-";
    return `${value} ms`;
  };

  const formatPacketLoss = (avgLoss: number, maxLoss: number) => {
    if (!avgLoss && !maxLoss) return "-";
    const formatValue = (v: number) => `${((Number(v) / 1000) * 100).toFixed(1)}%`;
    return `${formatValue(avgLoss)} (${formatValue(maxLoss)})`;
  };

  const formatBandwidth = (value: number) => {
    if (!value) return "-";
    return `${(value / 1024).toFixed(1)} kb/s`;
  };

  const formatResolution = (width: number, height: number) => {
    if (!width && !height) return "-";
    return `${width}×${height}`;
  };

  const formatFps = (value: number) => {
    if (!value) return "-";
    return `${value} fps`;
  };

  useEffect(() => {
    if (!hasConfig) return;
    const liveVideo = liveVideoRef.current;
    const streamingClient = streamingClientRef.current;
    if (!liveVideo || invokedRef.current) return;
    invokedRef.current = true;
    liveVideo.setAttribute("controls", "true");

    const handleEnded = () => {
      setStatus({ value: "Ended" });
    };

    liveVideo.addEventListener("ended", handleEnded as EventListener);

    (async () => {
      try {
        const result = await streamingClient.attachStreaming(channelId, signature, VideoQuality.Video_720P, liveVideo);

        const maybeError = result as { type?: string; reason?: string } | LiveVideo;
        if ("reason" in maybeError && typeof maybeError.reason === "string") {
          invokedRef.current = false;
          setStatus({
            value: "Fail",
            reason: maybeError.reason || t("broadcast_viewer_error_unable_to_play"),
          });
        }
      } catch (error: any) {
        invokedRef.current = false;
        setStatus({
          value: "Fail",
          reason: error?.reason || error?.message || t("broadcast_viewer_error_unable_to_play"),
        });
      }
    })();

    return () => {
      if (liveVideo) {
        streamingClient.detachStreaming(channelId, liveVideo);
        liveVideo.removeEventListener("ended", handleEnded as EventListener);
      }
      invokedRef.current = false;
    };
  }, [channelId, signature, hasConfig, t]);

  useEffect(() => {
    if (!hasConfig) return;

    const onConnectionChange = (payload: any) => {
      const state = payload?.state ?? "unknown";

      if (state === "Fail") {
        const reason = payload?.reason || t("broadcast_viewer_error_unable_to_play");
        setStatus({ value: "Fail", reason });
        // eslint-disable-next-line no-console
        console.error("Join streaming failed", payload);
        return;
      }

      setStatus((prev) => ({
        ...prev,
        value: state,
      }));
    };

    const onAutoPlayFailed = () => {
      // eslint-disable-next-line no-console
      console.warn("Stream audio play failed. Click to unmute");
      ["click", "touch"].forEach((evt) => {
        document.addEventListener(evt, () => liveVideoRef.current?.setAttribute("muted", "false"), { once: true });
      });
    };

    const onAudioStatisticDataChange = (payload: any) => {
      if (!payload) return;
      const { encoding, ...rest } = payload;
      if (encoding) {
        return;
      }
      setAudioStats({
        rtt: rest.rtt ?? 0,
        jitter: rest.jitter ?? 0,
        avg_loss: rest.avg_loss ?? 0,
        max_loss: rest.max_loss ?? 0,
        sample_rate: rest.sample_rate ?? 0,
        bandwidth: rest.bandwidth ?? 0,
        bitrate: rest.bitrate ?? 0,
        timestamp: Date.now(),
      });
    };

    const onVideoStatisticDataChange = (payload: any) => {
      if (!payload) return;
      const { encoding, ...rest } = payload;
      if (encoding) {
        return;
      }
      setVideoStats({
        rtt: rest.rtt ?? 0,
        jitter: rest.jitter ?? 0,
        avg_loss: rest.avg_loss ?? 0,
        max_loss: rest.max_loss ?? 0,
        width: rest.width ?? 0,
        height: rest.height ?? 0,
        fps: rest.fps ?? 0,
        bandwidth: rest.bandwidth ?? 0,
        bitrate: rest.bitrate ?? 0,
        timestamp: Date.now(),
      });
    };

    const client = streamingClientRef.current;

    client.on("connection-change", onConnectionChange);
    client.on("auto-play-audio-failed", onAutoPlayFailed);
    client.on("audio-statistic-data-change", onAudioStatisticDataChange);
    client.on("video-statistic-data-change", onVideoStatisticDataChange);
    return () => {
      client.off("connection-change", onConnectionChange);
      client.off("auto-play-audio-failed", onAutoPlayFailed);
      client.off("audio-statistic-data-change", onAudioStatisticDataChange);
      client.off("video-statistic-data-change", onVideoStatisticDataChange);
    };
  }, [hasConfig, t]);

  return (
    <div className="zoom-ui-toolkit-root">
      <div className="flex min-h-screen items-stretch justify-center bg-black text-gray-50">
        <div className="mx-4 my-8 w-full max-w-5xl shadow-[0_40px_90px_rgba(0,0,0,0.9)]">
          <div className="relative h-0 overflow-hidden rounded-lg bg-black pb-[56.25%]">
            <div className="absolute inset-0">
              {hasConfig ? (
                <div className="relative flex h-full w-full flex-col">
                  <div className="relative flex-1 overflow-hidden rounded-xl">
                    <live-video-container webEndpoint={webEndpoint} class="flex h-full w-full bg-black">
                      <live-video ref={liveVideoRef} class="block h-full w-full" />
                    </live-video-container>
                  </div>
                </div>
              ) : (
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center px-10 text-center text-gray-50"
                  style={{
                    background: "radial-gradient(circle at top, rgba(0,0,0,0.6), rgba(0,0,0,0.9))",
                  }}
                >
                  <div>
                    <div className="mb-2 text-xs uppercase tracking-[0.16em] opacity-80">
                      {t("broadcast_viewer_ready_to_watch")}
                    </div>
                    <div className="text-sm md:text-base">{t("broadcast_viewer_no_config_message")}</div>
                  </div>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0">
                <div className="pointer-events-auto absolute left-0 right-0 top-0 flex items-end justify-between bg-gradient-to-b from-black/90 to-transparent px-6 pt-4 pb-20 text-gray-50">
                  <div>
                    <div className="text-2xl font-bold md:text-3xl">
                      {topic || t("broadcast_viewer_title_fallback")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] ${
                        isLive
                          ? "bg-red-700 text-gray-50 shadow-[0_0_18px_rgba(248,113,113,0.8)]"
                          : "bg-gray-700 text-gray-50"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isLive ? "bg-red-100 shadow-[0_0_8px_rgba(254,226,226,0.9)]" : "bg-gray-400"
                        }`}
                      />
                      <span>{isLive ? t("broadcast_viewer_status_live") : statusLabel}</span>
                    </div>
                    {isLive && (
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-gray-100 shadow-sm transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setIsStatsOpen(true)}
                        disabled={!hasStatsData}
                        aria-label={t("broadcast_viewer_stats_open_aria")}
                      >
                        <Activity className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {isStatsOpen && (
                <div className="pointer-events-auto absolute right-6 top-16 z-20 w-80 max-w-[90vw] rounded-lg bg-black/90 p-4 text-xs text-gray-100 shadow-2xl backdrop-blur">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                        {t("broadcast_viewer_stats_title")}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-gray-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                      onClick={() => setIsStatsOpen(false)}
                      aria-label={t("broadcast_viewer_stats_close_aria")}
                    >
                      <span className="text-xs leading-none">×</span>
                    </button>
                  </div>
                  <div className="mb-2 flex gap-1 rounded-full bg-white/5 p-0.5 text-[11px]">
                    <button
                      type="button"
                      className={`flex-1 rounded-full px-2 py-1 text-center ${
                        statsTab === "audio" ? "bg-white text-black font-medium" : "text-gray-300"
                      }`}
                      onClick={() => setStatsTab("audio")}
                    >
                      {t("broadcast_viewer_stats_tab_audio")}
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-full px-2 py-1 text-center ${
                        statsTab === "video" ? "bg-white text-black font-medium" : "text-gray-300"
                      }`}
                      onClick={() => setStatsTab("video")}
                    >
                      {t("broadcast_viewer_stats_tab_video")}
                    </button>
                  </div>
                  <div className="mt-1 max-h-64 overflow-y-auto">
                    <table className="w-full border-collapse text-[11px]">
                      <tbody>
                        {statsTab === "audio" ? (
                          <>
                            <tr className="border-b border-white/5">
                              <td className="py-1 pr-2 text-gray-300">{t("broadcast_viewer_stats_latency")}</td>
                              <td className="py-1 text-right">{formatMs(audioStats.rtt)}</td>
                            </tr>
                            <tr className="border-b border-white/5">
                              <td className="py-1 pr-2 text-gray-300">{t("broadcast_viewer_stats_jitter")}</td>
                              <td className="py-1 text-right">{formatMs(audioStats.jitter)}</td>
                            </tr>
                            <tr className="border-b border-white/5">
                              <td className="py-1 pr-2 text-gray-300">{t("broadcast_viewer_stats_packet_loss")}</td>
                              <td className="py-1 text-right">
                                {formatPacketLoss(audioStats.avg_loss, audioStats.max_loss)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-2 text-gray-300">{t("broadcast_viewer_stats_sample_rate")}</td>
                              <td className="py-1 text-right">
                                {audioStats.sample_rate ? `${audioStats.sample_rate} khz` : "-"}
                              </td>
                            </tr>
                          </>
                        ) : (
                          <>
                            <tr className="border-b border-white/5">
                              <td className="py-1 pr-2 text-gray-300">{t("broadcast_viewer_stats_latency")}</td>
                              <td className="py-1 text-right">{formatMs(videoStats.rtt)}</td>
                            </tr>
                            <tr className="border-b border-white/5">
                              <td className="py-1 pr-2 text-gray-300">{t("broadcast_viewer_stats_jitter")}</td>
                              <td className="py-1 text-right">{formatMs(videoStats.jitter)}</td>
                            </tr>
                            <tr className="border-b border-white/5">
                              <td className="py-1 pr-2 text-gray-300">{t("broadcast_viewer_stats_bandwidth")}</td>
                              <td className="py-1 text-right">{formatBandwidth(videoStats.bandwidth)}</td>
                            </tr>
                            <tr className="border-b border-white/5">
                              <td className="py-1 pr-2 text-gray-300">{t("broadcast_viewer_stats_packet_loss")}</td>
                              <td className="py-1 text-right">
                                {formatPacketLoss(videoStats.avg_loss, videoStats.max_loss)}
                              </td>
                            </tr>
                            <tr className="border-b border-white/5">
                              <td className="py-1 pr-2 text-gray-300">{t("broadcast_viewer_stats_resolution")}</td>
                              <td className="py-1 text-right">
                                {formatResolution(videoStats.width, videoStats.height)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-2 text-gray-300">{t("broadcast_viewer_stats_fps")}</td>
                              <td className="py-1 text-right">{formatFps(videoStats.fps)}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                    {!hasStatsData && (
                      <div className="mt-3 text-[11px] text-gray-400">{t("broadcast_viewer_stats_waiting")}</div>
                    )}
                  </div>
                </div>
              )}

              {errorMessage && (
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center px-10 text-center text-gray-50"
                  style={{
                    background: "radial-gradient(circle at top, rgba(0,0,0,0.6), rgba(0,0,0,0.9))",
                  }}
                >
                  <div>
                    <div className="mx-auto max-w-xl text-sm md:text-base">{errorMessage}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastViewer;
