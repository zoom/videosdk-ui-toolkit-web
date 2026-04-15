// oxlint-disable no-empty-pattern
import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MB_TO_B, KB_TO_B } from "./initialQOS.ts";
import { useQOSData } from "./QOSData.ts";

interface QoSMetric {
  timestamp: number;
  height: number;
  fullResolution: string;
  fps: number;
  sampleRate: number;
  rtt: number;
  jitter: number;
  loss: number;
  bandwidth: number;
  bitrate: number;
}

interface MetricOption {
  key: keyof Omit<QoSMetric, "timestamp">;
  label: string;
  color: string;
  format?: (value: number) => string;
  yAxisFormat?: (value: number) => number;
  unit: string;
  legendFormat: string;
  axisGroup?: "primary" | "bitrate" | "bandwidth" | "height" | "loss" | "time";
}

const METRIC_OPTIONS: (MetricOption & { defaultVisible: boolean })[] = [
  {
    key: "height",
    label: "Resolution",
    color: "#FF2D55",
    defaultVisible: true,
    format: (v) => `${v}`,
    unit: "P",
    legendFormat: "Resolution Height (P)",
    axisGroup: "height",
  },
  {
    key: "fps",
    label: "FPS",
    color: "#007AFF",
    defaultVisible: true,
    unit: "fps",
    legendFormat: "FPS (frames/s)",
    axisGroup: "primary",
  },
  {
    key: "rtt",
    label: "RTT",
    color: "#34C759",
    defaultVisible: true,
    unit: "ms",
    legendFormat: "RTT (ms)",
    axisGroup: "time",
  },
  {
    key: "jitter",
    label: "Jitter",
    color: "#FF9500",
    defaultVisible: true,
    unit: "ms",
    legendFormat: "Jitter (ms)",
    axisGroup: "time",
  },
  {
    key: "loss",
    label: "Loss",
    color: "#FF3B30",
    defaultVisible: true,
    unit: "%",
    legendFormat: "Packet Loss (%)",
    axisGroup: "loss",
  },
  {
    key: "bandwidth",
    label: "Bandwidth",
    color: "#5856D6",
    format: (v) => (v / MB_TO_B).toFixed(2),
    yAxisFormat: (v) => Math.floor(v),
    unit: "MB/s",
    legendFormat: "Bandwidth (MB/s)",
    defaultVisible: true,
    axisGroup: "bandwidth",
  },
  {
    key: "bitrate",
    label: "Bitrate",
    color: "#AF52DE",
    format: (v) => (v / KB_TO_B).toFixed(2), // Convert bytes to bits, then to Kb
    yAxisFormat: (v) => v / KB_TO_B, // Same conversion for axis
    unit: "Kbps",
    legendFormat: "Bitrate (Kbps)",
    defaultVisible: true,
    axisGroup: "bitrate",
  },
];

type MainTabType = "av" | "all";
type SubTabType = "video" | "audio" | "sharing";

// Add a custom hook for container width
const useContainerWidth = () => {
  const [width, setWidth] = useState(640);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        if (newWidth > 0) {
          setWidth(newWidth);
        }
      }
    };

    const initialTimer = setTimeout(updateWidth, 100);

    const resizeObserver = new ResizeObserver((entries) => {
      const newWidth = entries[0]?.contentRect.width;
      if (newWidth > 0) {
        setWidth(newWidth);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateWidth);

    return () => {
      clearTimeout(initialTimer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return { width, containerRef };
};

// Add new interface for chart metrics state
interface ChartMetricsState {
  video: {
    encode: Set<string>;
    decode: Set<string>;
  };
  audio: {
    encode: Set<string>;
    decode: Set<string>;
  };
  sharing: {
    encode: Set<string>;
    decode: Set<string>;
  };
}

export const QoSDisplay: React.FC = () => {
  const [isOpen, setIsOpen] = useState({
    general: true,
    video: true,
    audio: true,
    network: true,
    advanced: false,
  });
  const [selectedMetricsState, setSelectedMetricsState] = useState<ChartMetricsState>(() => {
    const savedPreferences = localStorage.getItem("qosMetricPreferences");
    const defaultMetrics = new Set(
      METRIC_OPTIONS.filter((metric) => metric.defaultVisible).map((metric) => metric.key),
    );

    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        return {
          video: {
            encode: new Set(parsed?.video?.encode || defaultMetrics),
            decode: new Set(parsed?.video?.decode || defaultMetrics),
          },
          audio: {
            encode: new Set(parsed?.audio?.encode || defaultMetrics),
            decode: new Set(parsed?.audio?.decode || defaultMetrics),
          },
          sharing: {
            encode: new Set(parsed?.sharing?.encode || defaultMetrics),
            decode: new Set(parsed?.sharing?.decode || defaultMetrics),
          },
        };
      } catch (e) {
        console.error("Failed to parse saved preferences");
      }
    }

    return {
      video: {
        encode: new Set(defaultMetrics),
        decode: new Set(defaultMetrics),
      },
      audio: {
        encode: new Set(defaultMetrics),
        decode: new Set(defaultMetrics),
      },
      sharing: {
        encode: new Set(defaultMetrics),
        decode: new Set(defaultMetrics),
      },
    };
  });

  const {
    audioStatisticsEncodeData,
    audioStatisticsDecodeData,
    videoStatisticsEncodeData,
    videoStatisticsDecodeData,
    shareStatisticsEncodeData,
    shareStatisticsDecodeData,
    audioEncodeHistory,
    audioDecodeHistory,
    sharingEncodeHistory,
    sharingDecodeHistory,
    encodeHistory,
    decodeHistory,
  } = useQOSData();

  const [mainTab, setMainTab] = useState<MainTabType>("av");
  const [subTab, setSubTab] = useState<SubTabType>("video");
  const { width: containerWidth, containerRef } = useContainerWidth();

  const toggleSection = (section) => {
    setIsOpen({ ...isOpen, [section]: !isOpen[section] });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatSpeed = (bps: number) => {
    const kbps = (bps / KB_TO_B).toFixed(2);
    const mbps = (bps / MB_TO_B).toFixed(2);
    if (Number(mbps) > 1) {
      return `${mbps} Mbps`;
    }
    return `${kbps} Kbps`;
  };

  // Add new state to track visibility of sections
  const [visibleSections, setVisibleSections] = useState({
    video: { encode: true, decode: true },
    audio: { encode: true, decode: true },
    sharing: { encode: true, decode: true },
  });

  // Add toggle function for section visibility
  const toggleSectionVisibility = (section: "video" | "audio" | "sharing", mode: "encode" | "decode") => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [mode]: !prev[section][mode],
      },
    }));
  };

  // Update the renderQosStats function
  const renderQosStats = (title: string, data: { encode: any; decode: any } | undefined, showResolution = false) => {
    if (!data) return null;

    const section = title.toLowerCase().replace(" ", "") as "video" | "audio" | "sharing";
    if (!visibleSections[section]) return null;
    return (
      <div className="min-w-[320px] mb-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="flex space-x-2">
            <button
              className={`px-2 py-1 rounded-md text-xs transition-colors ${
                visibleSections[section].encode ? "bg-gray-800 text-white" : "bg-gray-700 text-gray-400"
              }`}
              onClick={() => toggleSectionVisibility(section, "encode")}
            >
              Encode
            </button>
            <button
              className={`px-2 py-1 rounded-md text-xs transition-colors ${
                visibleSections[section].decode ? "bg-gray-800 text-white" : "bg-gray-700 text-gray-400"
              }`}
              onClick={() => toggleSectionVisibility(section, "decode")}
            >
              Decode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Encode Column */}
          {visibleSections[section].encode && data.encode && (
            <div className="space-y-2">
              <div className="bg-gray-900 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2">
                  {showResolution && (
                    <>
                      <div className="text-xs text-gray-400">Resolution</div>
                      <div className="text-xs text-right">
                        {data.encode.width}x{data.encode.height}
                      </div>
                      <div className="text-xs text-gray-400">FPS</div>
                      <div className="text-xs text-right">{data.encode.fps}</div>
                    </>
                  )}
                  <div className="text-xs text-gray-400">Sample Rate</div>
                  <div className="text-xs text-right">{data.encode.sample_rate}</div>
                  <div className="text-xs text-gray-400">RTT</div>
                  <div className="text-xs text-right">{data.encode.rtt} ms</div>
                  <div className="text-xs text-gray-400">Jitter</div>
                  <div className="text-xs text-right">{data.encode.jitter} ms</div>
                  <div className="text-xs text-gray-400">Loss</div>
                  <div className="text-xs text-right">{data.encode.avg_loss}%</div>
                  <div className="text-xs text-gray-400">Bandwidth</div>
                  <div className="text-xs text-right">{formatBytes(data.encode.bandwidth)}</div>
                  <div className="text-xs text-gray-400">Bitrate</div>
                  <div className="text-xs text-right">{formatSpeed(data.encode.bitrate)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Decode Column */}
          {visibleSections[section].decode && data.decode && (
            <div className="space-y-2">
              <div className="bg-gray-900 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2">
                  {showResolution && (
                    <>
                      <div className="text-xs text-gray-400">Resolution</div>
                      <div className="text-xs text-right">
                        {data.decode.width}x{data.decode.height}
                      </div>
                      <div className="text-xs text-gray-400">FPS</div>
                      <div className="text-xs text-right">{data.decode.fps}</div>
                    </>
                  )}
                  <div className="text-xs text-gray-400">Sample Rate</div>
                  <div className="text-xs text-right">{data.decode.sample_rate}</div>
                  <div className="text-xs text-gray-400">RTT</div>
                  <div className="text-xs text-right">{data.decode.rtt} ms</div>
                  <div className="text-xs text-gray-400">Jitter</div>
                  <div className="text-xs text-right">{data.decode.jitter} ms</div>
                  <div className="text-xs text-gray-400">Loss</div>
                  <div className="text-xs text-right">{data.decode.avg_loss}%</div>
                  <div className="text-xs text-gray-400">Bandwidth</div>
                  <div className="text-xs text-right">{formatBytes(data.decode.bandwidth)}</div>
                  <div className="text-xs text-gray-400">Bitrate</div>
                  <div className="text-xs text-right">{formatSpeed(data.decode.bitrate)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const toggleMetric = (metricKey: string, chartType: "video" | "audio" | "sharing", mode: "encode" | "decode") => {
    setSelectedMetricsState((prev) => {
      const newState = { ...prev };
      const metrics = new Set(prev[chartType][mode]);

      if (metrics.has(metricKey)) {
        metrics.delete(metricKey);
      } else {
        metrics.add(metricKey);
      }

      newState[chartType][mode] = metrics;
      localStorage.setItem("qosMetricPreferences", JSON.stringify(newState));
      return newState;
    });
  };

  const clearAllCharts = () => {
    const currentSection = subTab;

    setSelectedMetricsState((prev) => {
      const newState = { ...prev };
      newState[currentSection] = {
        encode: new Set(),
        decode: new Set(),
      };
      localStorage.setItem("qosMetricPreferences", JSON.stringify(newState));
      return newState;
    });
  };

  const resetAllCharts = () => {
    const defaultMetrics = new Set(
      METRIC_OPTIONS.filter((metric) => metric.defaultVisible).map((metric) => metric.key),
    );
    const currentSection = subTab;

    setSelectedMetricsState((prev) => {
      const newState = { ...prev };
      newState[currentSection] = {
        encode: new Set(defaultMetrics),
        decode: new Set(defaultMetrics),
      };
      localStorage.setItem("qosMetricPreferences", JSON.stringify(newState));
      return newState;
    });
  };

  const renderMetricControls = (
    chartType: "video" | "audio" | "sharing",
    mode: "encode" | "decode",
    disableMetrics: string[] = [],
  ) => {
    return (
      <div className="flex flex-col space-y-4 w-full sm:w-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex space-x-2">
            <button
              className="px-3 py-1.5 text-xs rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors whitespace-nowrap"
              onClick={() => {
                setSelectedMetricsState((prev) => {
                  const newState = { ...prev };
                  newState[chartType][mode] = new Set();
                  localStorage.setItem("qosMetricPreferences", JSON.stringify(newState));
                  return newState;
                });
              }}
            >
              Clear
            </button>
            <button
              className="px-3 py-1.5 text-xs rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors whitespace-nowrap"
              onClick={() => {
                const defaultMetrics = new Set(
                  METRIC_OPTIONS.filter((metric) => metric.defaultVisible).map((metric) => metric.key),
                );
                setSelectedMetricsState((prev) => {
                  const newState = { ...prev };
                  newState[chartType][mode] = defaultMetrics;
                  localStorage.setItem("qosMetricPreferences", JSON.stringify(newState));
                  return newState;
                });
              }}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {METRIC_OPTIONS.filter((metric) => !disableMetrics.includes(metric.key)).map((metric) => (
            <button
              key={metric.key}
              className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 whitespace-nowrap ${
                selectedMetricsState[chartType][mode].has(metric.key)
                  ? `bg-opacity-20 bg-${metric.color} text-${metric.color} ring-1 ring-${metric.color}`
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => toggleMetric(metric.key, chartType, mode)}
            >
              {metric.label} ({metric.unit})
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderQoSChart = (
    data: QoSMetric[],
    title: string,
    chartType: "video" | "audio" | "sharing",
    mode: "encode" | "decode",
    showResolution = false,
  ) => {
    const selectedMetrics = selectedMetricsState?.[chartType]?.[mode] || new Set();
    const chartHeight = Math.max(300, Math.min(400, containerWidth * 0.5));

    return (
      <div className="min-w-[320px] bg-gray-900/50 backdrop-blur-sm rounded-2xl p-3 sm:p-6 mb-6 shadow-lg">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h3 className="text-lg font-medium">{title}</h3>
            {renderMetricControls(chartType, mode, chartType === "audio" ? ["height", "fps"] : [])}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div
            style={{
              minWidth: "640px",
              width: "100%",
              minHeight: "300px",
              height: chartHeight,
              position: "relative",
            }}
          >
            <ResponsiveContainer width="100%" height={chartHeight} minHeight={300} aspect={undefined} debounce={1}>
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} style={{ minHeight: "300px" }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                  stroke="#666"
                  fontSize={12}
                />
                {chartType !== "audio" && (
                  <YAxis
                    yAxisId="height"
                    orientation="left"
                    stroke="#666"
                    fontSize={12}
                    domain={[0, "auto"]}
                    tickFormatter={(value) => `${value}P`}
                    hide={
                      !Array.from(selectedMetrics).some(
                        (key) => METRIC_OPTIONS.find((m) => m.key === key)?.axisGroup === "height",
                      )
                    }
                  />
                )}
                {chartType !== "audio" && (
                  <YAxis
                    yAxisId="primary"
                    orientation="left"
                    stroke="#666"
                    fontSize={12}
                    domain={[0, "auto"]}
                    tickFormatter={(value) => `${value}FPS`}
                    hide={
                      !Array.from(selectedMetrics).some(
                        (key) => METRIC_OPTIONS.find((m) => m.key === key)?.axisGroup === "primary",
                      )
                    }
                  />
                )}

                <YAxis
                  yAxisId="time"
                  orientation="left"
                  stroke="#666"
                  fontSize={12}
                  domain={[0, 1000]}
                  tickFormatter={(value) => `${value}ms`}
                  hide={
                    !Array.from(selectedMetrics).some(
                      (key) => METRIC_OPTIONS.find((m) => m.key === key)?.axisGroup === "time",
                    )
                  }
                />
                <YAxis
                  yAxisId="loss"
                  orientation="right"
                  stroke="#666"
                  fontSize={12}
                  domain={[0, 50]}
                  tickFormatter={(value) => `${value}%`}
                  hide={
                    !Array.from(selectedMetrics).some(
                      (key) => METRIC_OPTIONS.find((m) => m.key === key)?.axisGroup === "loss",
                    )
                  }
                />

                <YAxis
                  yAxisId="bandwidth"
                  orientation="right"
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `${Math.floor(value / MB_TO_B)}M/s`}
                  hide={
                    !Array.from(selectedMetrics).some(
                      (key) => METRIC_OPTIONS.find((m) => m.key === key)?.axisGroup === "bandwidth",
                    )
                  }
                />

                <YAxis
                  yAxisId="bitrate"
                  orientation="right"
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `${Math.floor(value / KB_TO_B)}Kbps`}
                  hide={
                    !Array.from(selectedMetrics).some(
                      (key) => METRIC_OPTIONS.find((m) => m.key === key)?.axisGroup === "bitrate",
                    )
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "12px",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    padding: "12px",
                  }}
                  labelFormatter={(timestamp) => new Date(Number(timestamp)).toLocaleTimeString()}
                  formatter={(value: number | string, name: string, props) => {
                    const metric = METRIC_OPTIONS.find((m) => m.legendFormat === name);
                    if (!metric) return [value, name];

                    if (metric.key === "height") {
                      return [`${value}P (${props.payload.fullResolution})`, "Resolution"];
                    }

                    const formattedValue = metric.format ? metric.format(value as number) : value;
                    return [`${formattedValue} ${metric.unit}`, metric.label];
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{
                    paddingBottom: "20px",
                    fontSize: containerWidth < 768 ? "10px" : "12px",
                  }}
                />
                {Array.from(selectedMetrics).map((metricKey) => {
                  const metric = METRIC_OPTIONS.find((m) => m.key === metricKey);
                  if (!metric) return null;
                  if (chartType === "audio" && metric.key === "height") return null;
                  if (chartType === "audio" && metric.key === "fps") return null;
                  return (
                    <Line
                      key={metric.key}
                      yAxisId={metric.axisGroup || "primary"}
                      type={metric.key === "height" ? "stepAfter" : "monotone"}
                      dataKey={metric.key}
                      stroke={metric.color}
                      strokeWidth={2}
                      name={metric.legendFormat}
                      dot={metric.key === "height"}
                      activeDot={{ r: metric.key === "height" ? 6 : 4 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderMainTabs = () => {
    return (
      <div className="flex space-x-2 bg-gray-900/50 p-1 rounded-xl backdrop-blur-sm">
        <button
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center gap-2
            ${mainTab === "av" ? "bg-gray-800" : "bg-gray-700"}
            text-white
          `}
          onClick={() => setMainTab(mainTab === "av" ? "all" : "av")}
        >
          <div
            className={`
              w-8 h-4 rounded-full relative transition-all duration-200 
              ${mainTab === "av" ? "bg-blue-500" : "bg-gray-600"}
            `}
          >
            <div
              className={`
                absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200
                ${mainTab === "av" ? "left-0.5" : "left-[18px]"}
              `}
            />
          </div>
          {mainTab === "av" ? "A/V/S" : "All"}
        </button>
      </div>
    );
  };

  const renderSubTabs = () => {
    return (
      <div className="flex space-x-2 bg-gray-900/50 p-1 rounded-xl backdrop-blur-sm">
        {(videoStatisticsEncodeData || videoStatisticsDecodeData) && (
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              subTab === "video"
                ? "bg-gray-800 text-white shadow-lg"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
            }`}
            onClick={() => setSubTab("video")}
          >
            Video
          </button>
        )}
        {(audioStatisticsEncodeData || audioStatisticsDecodeData) && (
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              subTab === "audio"
                ? "bg-gray-800 text-white shadow-lg"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
            }`}
            onClick={() => setSubTab("audio")}
          >
            Audio
          </button>
        )}
        {(shareStatisticsEncodeData || shareStatisticsEncodeData) && (
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              subTab === "sharing"
                ? "bg-gray-800 text-white shadow-lg"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
            }`}
            onClick={() => setSubTab("sharing")}
          >
            Screen Sharing
          </button>
        )}
      </div>
    );
  };

  // Update the renderAVCharts function
  const renderAVCharts = () => {
    switch (subTab) {
      case "video":
        return (
          <>
            {visibleSections.video.encode &&
              renderQoSChart(encodeHistory, "Video Encode Metrics", "video", "encode", true)}
            {visibleSections.video.decode &&
              renderQoSChart(decodeHistory, "Video Decode Metrics", "video", "decode", true)}
          </>
        );
      case "audio":
        return (
          <>
            {visibleSections.audio.encode &&
              renderQoSChart(audioEncodeHistory, "Audio Encode Metrics", "audio", "encode", false)}
            {visibleSections.audio.decode &&
              renderQoSChart(audioDecodeHistory, "Audio Decode Metrics", "audio", "decode", false)}
          </>
        );
      case "sharing":
        return (
          <>
            {visibleSections.sharing.encode &&
              renderQoSChart(sharingEncodeHistory, "Screen Sharing Encode Metrics", "sharing", "encode", true)}
            {visibleSections.sharing.decode &&
              renderQoSChart(sharingDecodeHistory, "Screen Sharing Decode Metrics", "sharing", "decode", true)}
          </>
        );
      default:
        return null;
    }
  };

  // Update the renderAllMetricsCharts function
  const renderAllMetricsCharts = () => {
    return (
      <div className="space-y-6">
        {(videoStatisticsEncodeData || videoStatisticsDecodeData) && (
          <>
            {visibleSections.video.encode &&
              renderQoSChart(encodeHistory, "Video Encode Metrics", "video", "encode", true)}
            {visibleSections.video.decode &&
              renderQoSChart(decodeHistory, "Video Decode Metrics", "video", "decode", true)}
          </>
        )}
        {(audioStatisticsEncodeData || audioStatisticsDecodeData) && (
          <>
            {visibleSections.audio.encode &&
              renderQoSChart(audioEncodeHistory, "Audio Encode Metrics", "audio", "encode", false)}
            {visibleSections.audio.decode &&
              renderQoSChart(audioDecodeHistory, "Audio Decode Metrics", "audio", "decode", false)}
          </>
        )}
        {(shareStatisticsEncodeData || shareStatisticsDecodeData) && (
          <>
            {visibleSections.sharing.encode &&
              renderQoSChart(sharingEncodeHistory, "Screen Sharing Encode Metrics", "sharing", "encode", true)}
            {visibleSections.sharing.decode &&
              renderQoSChart(sharingDecodeHistory, "Screen Sharing Decode Metrics", "sharing", "decode", true)}
          </>
        )}
      </div>
    );
  };

  const toggleAllMetrics = (show: boolean) => {
    const metrics = show ? new Set<string>(METRIC_OPTIONS.map((metric) => metric.key)) : new Set<string>();
    const currentSection = subTab;

    setSelectedMetricsState((prev) => {
      const newState = { ...prev };
      newState[currentSection] = {
        encode: metrics,
        decode: metrics,
      };
      localStorage.setItem("qosMetricPreferences", JSON.stringify(newState));
      return newState;
    });
  };

  // Update the toggleGlobalMetric function
  const toggleGlobalMetric = (metricKey: string) => {
    setSelectedMetricsState((prev) => {
      const currentSection = subTab;
      const isMetricEnabled = prev[currentSection].encode.has(metricKey);

      // Create a new state object
      const newState = { ...prev };

      // Convert Set to Array before storing in localStorage
      Object.keys(newState[currentSection]).forEach((mode) => {
        const metrics = new Set(newState[currentSection][mode]);
        if (isMetricEnabled) {
          metrics.delete(metricKey);
        } else {
          metrics.add(metricKey);
        }
        newState[currentSection][mode] = metrics;
      });

      // Convert Sets to Arrays before storing in localStorage
      const storageState = Object.fromEntries(
        Object.entries(newState).map(([section, modes]) => [
          section,
          {
            encode: Array.from(modes.encode),
            decode: Array.from(modes.decode),
          },
        ]),
      );

      localStorage.setItem("qosMetricPreferences", JSON.stringify(storageState));
      return newState;
    });
  };

  // Update the renderGlobalMetricControls to show current section state
  const renderGlobalMetricControls = () => {
    const currentSection = subTab;
    // Use current section's encode as reference for state
    const referenceMetrics = selectedMetricsState[currentSection].encode;

    return (
      <div className="p-4 bg-gray-900/50 rounded-xl backdrop-blur-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-400">Metric Selection</h3>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
            {mainTab === "av"
              ? currentSection.charAt(0).toUpperCase() + currentSection.slice(1) + " Metrics"
              : "All Metrics"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {METRIC_OPTIONS.map((metric) => (
            <button
              key={metric.key}
              className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 whitespace-nowrap ${
                referenceMetrics.has(metric.key)
                  ? `bg-opacity-20 bg-${metric.color} text-${metric.color} ring-1 ring-${metric.color}`
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => toggleGlobalMetric(metric.key)}
            >
              {metric.label} ({metric.unit})
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Update the renderGlobalControls to include the new metric selector
  const renderGlobalControls = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          onClick={clearAllCharts}
        >
          Clear All Charts
        </button>
        <button
          className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          onClick={resetAllCharts}
        >
          Reset All Charts
        </button>
      </div>
      {renderGlobalMetricControls()}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        ref={containerRef}
        className="min-w-[320px] rounded-2xl shadow-xl px-4 bg-black/90 backdrop-blur-xl text-white max-h-[90vh] overflow-auto"
        style={{ minHeight: "500px" }}
      >
        <div className="sticky top-0 bg-black/90 backdrop-blur-xl z-10 pb-4 mb-4 border-b border-gray-800 mt-2">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-400 text-red-500">QoS Monitor</h2>
              <span className="text-xs text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-full">
                {new Date().toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">{renderGlobalControls()}</div>
              <div className="flex flex-col sm:flex-row gap-2">
                {renderMainTabs()}
                {mainTab === "av" && renderSubTabs()}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats Display */}
          {(videoStatisticsEncodeData || videoStatisticsDecodeData) &&
            renderQosStats("Video", { encode: videoStatisticsEncodeData, decode: videoStatisticsDecodeData }, true)}
          {(audioStatisticsEncodeData || audioStatisticsDecodeData) &&
            renderQosStats("Audio", { encode: audioStatisticsEncodeData, decode: audioStatisticsDecodeData })}
          {(shareStatisticsEncodeData || shareStatisticsDecodeData) &&
            renderQosStats(
              "Screen Sharing",
              { encode: shareStatisticsEncodeData, decode: shareStatisticsDecodeData },
              true,
            )}

          {/* Charts Display */}
          {(videoStatisticsEncodeData ||
            videoStatisticsDecodeData ||
            audioStatisticsEncodeData ||
            audioStatisticsDecodeData ||
            shareStatisticsEncodeData ||
            shareStatisticsDecodeData) && (
            <div className="mt-8">{mainTab === "av" ? <>{renderAVCharts()}</> : renderAllMetricsCharts()}</div>
          )}
        </div>

        {/* Advanced Section */}
        <div className="min-w-[680px] mt-4 bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-xs">
            {JSON.stringify(
              {
                videoStatisticsEncodeData,
                videoStatisticsDecodeData,
                audioStatisticsEncodeData,
                audioStatisticsDecodeData,
                shareStatisticsEncodeData,
                shareStatisticsDecodeData,
              },
              null,
              2,
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default QoSDisplay;
