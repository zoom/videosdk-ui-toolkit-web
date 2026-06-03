import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/widget/CommonButton";
import { LineChart, Line, XAxis, YAxis, Label, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useProbe } from "@/features/setting/context/probe-context";
import { useDiagnostic } from "@/features/setting/context/diagnostic-tab-context";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { ClientContext } from "@/context/client-context";
import { isMobileDevice, isMobileDeviceNotIpad } from "@/components/util/service";
import { SessionInfo } from "@zoom/videosdk";
import { tableHeaderStyle, tableBodyStyle, tableCellStyle } from "./constant";
import { enqueueSnackbar } from "notistack";
import { CheckCircle2, Clock3, Download, FileSearch, LoaderCircle, LucideIcon } from "lucide-react";

interface NetworkDiagnosticReport {
  serviceZone: string;
  protocols: {
    type: number;
    isBlocked: boolean;
    port: string;
    tip: string;
  }[];
  statistics: {
    uplink_avg_rtt: number;
    uplink_avg_loss: number;
    uplink_avg_jitter: number;
    uplink_bandwidth: number;
    uplink_bw_level: number;
    uplink_network_level: number;
    downlink_avg_rtt: number;
    downlink_avg_loss: number;
    downlink_avg_jitter: number;
    downlink_bandwidth: number;
    downlink_bw_level: number;
    downlink_network_level: number;
  };
  rid: string;
}

interface BasicInfo {
  index: number;
  attr: string;
  val: string | number | boolean;
  critical: boolean;
  affectedFeatures: {
    featureName: string;
  }[];
}

interface SupportedFeature {
  index: number;
  featureName: string;
  isSupported: boolean;
  checkList: {
    index: number;
    label: string;
    matched: boolean;
    tip: string;
  }[];
}

interface ReportObject {
  type: number;
  content: {
    networkDiagnosticReport: NetworkDiagnosticReport;
    basicInfo: BasicInfo[];
    supportedFeatures: SupportedFeature[];
  };
}

interface Statistics {
  type: number;
  content: {
    path: string;
    statistics: {
      bandwidth: number;
      bw_level: number;
      jitter: number;
      lossRate: number;
      max_continuous_loss_num: number;
      network_level: number;
      owdelay: number;
      rtt: number;
    };
  };
}

interface StatusCardContent {
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  description: string;
}

type ReportLayout = "screen" | "desktop-export" | "mobile-export";

const DiagnosticTab = ({ themeName, style }: { themeName: string; style?: React.CSSProperties }) => {
  const { t } = useTranslation();
  const { prober } = useProbe();
  const [isPreparingExport, setIsPreparingExport] = useState(false);
  const [preparedReportUrl, setPreparedReportUrl] = useState<string | null>(null);
  const [diagnosticError, setDiagnosticError] = useState<string | null>(null);
  const reportGenerationIdRef = useRef(0);
  const diagnosticRunIdRef = useRef(0);
  const countdownIntervalRef = useRef<number | null>(null);
  const diagnosticStopRef = useRef<number | null>(null);
  const diagnosticTimeoutRef = useRef<number | null>(null);
  const exportReportRef = useRef<HTMLDivElement | null>(null);

  const {
    isDiagnosing,
    setIsDiagnosing,
    countdown,
    setCountdown,
    diagnosticData,
    setDiagnosticData,
    reportData,
    setReportData,
  } = useDiagnostic();
  const {
    sessionId,
    userId,
    trackingId,
    isVideoWebRTC,
    sessionInfo,
    config: { webEndpoint },
  } = useAppSelector(useSessionSelector);
  const client = useContext(ClientContext);

  const isMobile = isMobileDevice();
  const isCompactMobile = isMobileDeviceNotIpad();
  const testDuration = (isMobile ? 60 : 120) * 1000;
  const timeoutDuration = 10 * 1000;
  const domain = "go.zoom.us";
  const expectedSeconds = testDuration / 1000;

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getReportFileName = () => {
    if (sessionId || trackingId) {
      return trackingId ? `diagnostic-report-${trackingId}.pdf` : `diagnostic-report-${sessionId}-${userId}.pdf`;
    }

    return "diagnostic-report.pdf";
  };

  const clearDiagnosticTimers = () => {
    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (diagnosticTimeoutRef.current !== null) {
      window.clearTimeout(diagnosticTimeoutRef.current);
      diagnosticTimeoutRef.current = null;
    }

    if (diagnosticStopRef.current !== null) {
      window.clearTimeout(diagnosticStopRef.current);
      diagnosticStopRef.current = null;
    }
  };

  const clearCountdownTimer = () => {
    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const handleStartDiagnostic = () => {
    const runId = ++diagnosticRunIdRef.current;
    let isFinalized = false;

    clearDiagnosticTimers();
    setDiagnosticError(null);
    setDiagnosticData([]);
    setReportData(null);
    setPreparedReportUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return null;
    });
    setIsDiagnosing(true);
    setCountdown(testDuration / 1000);

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearCountdownTimer();
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    diagnosticStopRef.current = window.setTimeout(async () => {
      if (diagnosticRunIdRef.current !== runId || isFinalized) {
        return;
      }

      try {
        const forcedReport = await (prober as any)?.stopToDiagnose?.();
        if (diagnosticRunIdRef.current !== runId || isFinalized || !forcedReport) {
          return;
        }

        isFinalized = true;
        clearDiagnosticTimers();
        setIsDiagnosing(false);
        setReportData(forcedReport as ReportObject);
      } catch {
        // Let the watchdog below surface the failure state if the SDK still does not finish.
      }
    }, testDuration + 1000);

    diagnosticTimeoutRef.current = window.setTimeout(
      () => {
        if (diagnosticRunIdRef.current !== runId || isFinalized) {
          return;
        }

        clearDiagnosticTimers();
        prober.cleanup();
        setIsDiagnosing(false);
        setDiagnosticError(t("troubleshooting.diagnostic_timeout"));
        enqueueSnackbar(t("troubleshooting.diagnostic_timeout"), { variant: "warning" });
      },
      testDuration + timeoutDuration + 15000,
    );

    prober
      .startToDiagnose(
        "https://source.zoom.us/probesdk/1.0.34/lib/prober.js",
        "https://source.zoom.us/probesdk/1.0.34/lib/prober.wasm",
        { probeDuration: testDuration, connectTimeout: timeoutDuration, domain: domain },
        (stats: Statistics) => setDiagnosticData((prevArray) => [...prevArray, stats]),
      )
      .then((report: ReportObject) => {
        if (diagnosticRunIdRef.current !== runId || isFinalized) {
          return;
        }
        isFinalized = true;
        clearDiagnosticTimers();
        setIsDiagnosing(false);
        setReportData(report);
      })
      .catch((error: Error) => {
        if (diagnosticRunIdRef.current !== runId || isFinalized) {
          return;
        }
        clearDiagnosticTimers();
        setIsDiagnosing(false);
        setDiagnosticError(error.message);
        enqueueSnackbar(t("troubleshooting.failed_diagnose_video", { message: error.message }), { variant: "error" });
      });
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
    unit,
  }: { active: boolean; payload: any; label: number; unit: string } | any) => {
    if (!active || !payload) return null;

    return (
      <div className="rounded-lg border border-theme-border bg-theme-surface p-4 shadow-sm">
        <p className="mb-2 text-sm font-medium">{t("troubleshooting.time_label", { time: label })}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toFixed(3)} ${unit}`}
          </p>
        ))}
      </div>
    );
  };

  const renderChart = (data: ChartData[], yAxisLabel: string, unit: string, height = 300) => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} />
        <XAxis
          dataKey="time"
          stroke="#6b7280"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          tickLine={{ stroke: "#6b7280" }}
        >
          <Label value={t("troubleshooting.time_seconds")} position="insideBottom" dy={10} />
        </XAxis>
        <YAxis
          stroke="#6b7280"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          tickLine={{ stroke: "#6b7280" }}
          label={{
            value: yAxisLabel,
            angle: -90,
            position: "inside",
            dx: -10,
            style: { fill: "#6b7280", fontSize: 12 },
          }}
        />
        <Tooltip content={<CustomTooltip unit={unit} />} />
        <Legend
          wrapperStyle={{
            paddingTop: "16px",
            fontSize: "12px",
          }}
        />
        <Line
          type="monotone"
          dataKey="downlink"
          name={t("troubleshooting.download")}
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{
            r: 6,
            fill: "#3b82f6",
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />
        <Line
          type="monotone"
          dataKey="uplink"
          name={t("troubleshooting.upload")}
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          activeDot={{
            r: 6,
            fill: "#10b981",
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  type ChartData = {
    time: number;
    uplink: number | null;
    downlink: number | null;
  };

  const buildChartData = (metric: keyof Statistics["content"]["statistics"]) =>
    diagnosticData.reduce<ChartData[]>((acc, _, i, arr) => {
      if (i % 2 === 0) {
        const uplink = arr[i].content.path === "uplink" ? arr[i] : arr[i + 1];
        const downlink = arr[i].content.path === "downlink" ? arr[i] : arr[i + 1];

        if (uplink && downlink) {
          acc.push({
            time: (i / 2) * 5,
            uplink: uplink.content.statistics[metric],
            downlink: downlink.content.statistics[metric],
          });
        }
      }
      return acc;
    }, []);

  const bandwidthData = buildChartData("bandwidth");
  const rttData = buildChartData("rtt");
  const lossData = buildChartData("lossRate");
  const continuousLossData = buildChartData("max_continuous_loss_num");

  const diagnosticProgress = isDiagnosing
    ? Math.max(8, Math.min(100, Math.round(((expectedSeconds - countdown) / expectedSeconds) * 100)))
    : reportData
      ? 100
      : 0;

  const getStatusCard = (): StatusCardContent => {
    if (isDiagnosing) {
      return {
        icon: LoaderCircle,
        iconClassName: "animate-spin text-blue-500",
        title: t("troubleshooting.status_diagnosing_title"),
        description: t("troubleshooting.status_diagnosing_description", {
          time: formatTime(countdown),
          seconds: expectedSeconds,
        }),
      };
    }

    if (isPreparingExport) {
      return {
        icon: Clock3,
        iconClassName: "text-amber-500",
        title: t("troubleshooting.status_preparing_title"),
        description: t("troubleshooting.status_preparing_description"),
      };
    }

    if (reportData) {
      return {
        icon: CheckCircle2,
        iconClassName: "text-green-500",
        title: t("troubleshooting.status_ready_title"),
        description: t(
          preparedReportUrl ? "troubleshooting.status_ready_description" : "troubleshooting.status_ready_generating",
        ),
      };
    }

    return {
      icon: FileSearch,
      iconClassName: "text-theme-text",
      title: t("troubleshooting.status_idle_title"),
      description: t("troubleshooting.status_idle_description", { seconds: expectedSeconds }),
    };
  };

  const getReportLayoutConfig = (layout: ReportLayout) => {
    const isExportLayout = layout !== "screen";
    const isMobileExport = layout === "mobile-export";

    return {
      chartHeight: isMobileExport ? 260 : 300,
      chartsClassName: isMobileExport ? "charts-container grid grid-cols-1 gap-5" : "charts-container space-y-4",
      tableClassName: `w-full overflow-hidden rounded-lg border-collapse ${layout === "desktop-export" ? "table-fixed" : ""}`,
      screenScrollableClassName: "uikit-custom-scrollbar overflow-x-auto rounded-lg border border-theme-border",
      exportScrollableClassName: "overflow-visible rounded-lg border border-theme-border",
      tableContainerClassName: isExportLayout
        ? "w-full min-w-0 bg-theme-surface text-xs font-small"
        : "min-w-full bg-theme-surface text-xs font-small",
      textTableContainerClassName: isExportLayout
        ? "w-full min-w-0 bg-theme-surface text-xs font-small text-theme-text"
        : "min-w-full bg-theme-surface text-xs font-small text-theme-text",
      supportTableContainerClassName: isExportLayout
        ? "w-full min-w-0 bg-theme-surface text-xs font-small text-gray-700"
        : "min-w-full bg-theme-surface text-xs font-small text-gray-700",
      cellClassName: isMobileExport ? `${tableCellStyle} py-[10px] text-[13px] leading-[1.45]` : tableCellStyle,
      bodyTextClassName: isMobileExport ? "text-[13px] leading-[1.5]" : "",
      supportedTableClassName: `w-full overflow-hidden rounded-lg border-collapse ${
        !isExportLayout ? "uikit-custom-scrollbar" : ""
      } ${layout === "desktop-export" ? "table-fixed" : ""}`,
      supportedFeatureNameClassName: isMobileExport ? `${tableCellStyle} w-[24%]` : tableCellStyle,
      supportedFeatureSupportClassName: isMobileExport ? `${tableCellStyle} w-[10%]` : tableCellStyle,
      supportedFeatureTipsClassName: isMobileExport ? `${tableCellStyle} w-[66%]` : tableCellStyle,
    };
  };

  const renderAffectedFeatures = (
    features: {
      featureName: string;
    }[],
  ) => {
    if (!features || features.length === 0) {
      return t("troubleshooting.none");
    }

    return (
      <ul>
        {features.map((feature, idx) => (
          <li key={idx}>{feature.featureName}</li>
        ))}
      </ul>
    );
  };

  const renderSessionInfoTable = (layout: ReportLayout) => {
    if (!sessionInfo || !sessionInfo.sessionId) {
      return null;
    }

    const {
      screenScrollableClassName,
      exportScrollableClassName,
      tableContainerClassName,
      tableClassName,
      cellClassName,
    } = getReportLayoutConfig(layout);

    return (
      <div className="mb-4">
        <div className={layout === "screen" ? screenScrollableClassName : exportScrollableClassName}>
          <div className={tableContainerClassName}>
            <table className={tableClassName}>
              <thead>
                <tr className="border-b border-theme-border bg-theme-background text-left">
                  <th colSpan={2} className="px-2 py-2">
                    {t("troubleshooting.session_info")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: t("troubleshooting.session_id"), value: sessionInfo.sessionId },
                  { field: t("troubleshooting.user_id"), value: userId },
                  ...(trackingId ? [{ field: t("troubleshooting.tracking_id"), value: trackingId }] : []),
                  { field: t("troubleshooting.web_endpoint"), value: webEndpoint },
                  { field: t("troubleshooting.sdk_version"), value: window?.JsMediaSDK_Instance?.version },
                ].map((item, index) => (
                  <tr key={index} className={tableBodyStyle}>
                    <td className={cellClassName}>{item.field}</td>
                    <td className={cellClassName}>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderReportContent = (layout: ReportLayout) => {
    const config = getReportLayoutConfig(layout);
    const scrollWrapperClassName =
      layout === "screen" ? config.screenScrollableClassName : config.exportScrollableClassName;
    const networkWrapperClassName =
      layout === "screen" ? "overflow-x-auto rounded-lg border border-theme-border" : config.exportScrollableClassName;

    return (
      <>
        {diagnosticData.length > 0 && (
          <div className={config.chartsClassName}>
            {renderChart(bandwidthData, "Bandwidth/Mb", "Mbps", config.chartHeight)}
            {renderChart(rttData, "RTT/ms", "ms", config.chartHeight)}
            {renderChart(lossData, "Loss Rate/%", "%", config.chartHeight)}
            {renderChart(continuousLossData, "Continuous Loss Num/%", "%", config.chartHeight)}
          </div>
        )}
        {reportData && (
          <>
            <div className="mb-4">
              <div className={scrollWrapperClassName}>
                <div className={config.textTableContainerClassName}>
                  <table className={config.tableClassName}>
                    <thead>
                      <tr className={tableHeaderStyle}>
                        <th className={`${config.cellClassName} w-8 text-center`}>
                          <span className="sr-only">{t("troubleshooting.table_index")}</span>#
                        </th>
                        <th className={config.cellClassName}>{t("troubleshooting.table_attribute")}</th>
                        <th className={config.cellClassName}>{t("troubleshooting.table_value")}</th>
                        <th className={`${config.cellClassName} w-20 whitespace-nowrap text-center`}>
                          {t("troubleshooting.table_critical")}
                        </th>
                        <th className={config.cellClassName}>{t("troubleshooting.table_affected_features")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.content.basicInfo.map((item: BasicInfo, index: number) => (
                        <tr key={index} className={tableBodyStyle}>
                          <td className={config.cellClassName}>{item.index}</td>
                          <td className={`${config.cellClassName} whitespace-normal ${config.bodyTextClassName}`}>
                            {item.attr}
                          </td>
                          <td
                            className={`${config.cellClassName} whitespace-normal break-words ${config.bodyTextClassName}`}
                          >
                            {item.val}
                          </td>
                          <td className={`${config.cellClassName} w-20 text-center`}>
                            {item.critical ? t("troubleshooting.yes") : t("troubleshooting.no")}
                          </td>
                          <td className={`${config.cellClassName} break-words ${config.bodyTextClassName}`}>
                            {renderAffectedFeatures(item.affectedFeatures)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <br />
            {renderSessionInfoTable(layout)}
            <div className="mb-4">
              <div className={networkWrapperClassName}>
                <div className={config.tableContainerClassName}>
                  <table className={`${config.tableClassName} text-theme-text`}>
                    <thead>
                      <tr className="rounded-t-lg bg-theme-background">
                        <th colSpan={4} className="px-2 py-2">
                          {t("troubleshooting.service_zone", {
                            zone: reportData.content.networkDiagnosticReport.serviceZone,
                          })}
                        </th>
                      </tr>
                    </thead>
                    <thead>
                      <tr className={tableBodyStyle}>
                        <th className={config.cellClassName}>{t("troubleshooting.protocol_type")}</th>
                        <th className={config.cellClassName}>{t("troubleshooting.is_blocked")}</th>
                        <th className={config.cellClassName}>{t("troubleshooting.port")}</th>
                        <th className={config.cellClassName}>{t("troubleshooting.tip")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.content.networkDiagnosticReport.protocols.map((item, index: number) => (
                        <tr key={index} className={tableBodyStyle}>
                          <td className={config.cellClassName}>
                            {{
                              1: t("troubleshooting.protocol_https"),
                              2: t("troubleshooting.protocol_websocket"),
                              3: t("troubleshooting.protocol_datachannel"),
                            }[item.type] || t("troubleshooting.protocol_unknown")}
                          </td>
                          <td className={config.cellClassName}>
                            {item.isBlocked ? t("troubleshooting.yes") : t("troubleshooting.no")}
                          </td>
                          <td className={config.cellClassName}>{item.port}</td>
                          <td className={`${config.cellClassName} ${config.bodyTextClassName}`}>{item.tip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br />
                  <table className={`${config.tableClassName} border border-theme-border bg-theme-surface`}>
                    <thead>
                      <tr className={tableHeaderStyle}>
                        <th className={config.cellClassName}>{t("troubleshooting.metrics")}</th>
                        <th className={config.cellClassName}>{t("troubleshooting.uplink")}</th>
                        <th className={config.cellClassName}>{t("troubleshooting.downlink")}</th>
                      </tr>
                    </thead>
                    <tbody className="border-b border-theme-border bg-theme-surface">
                      <tr className="border-b border-theme-border text-left hover:bg-theme-background">
                        <td className={config.cellClassName}>{t("troubleshooting.avg_rtt")}</td>
                        <td className={config.cellClassName}>
                          {reportData.content.networkDiagnosticReport.statistics.uplink_avg_rtt}
                        </td>
                        <td className={config.cellClassName}>
                          {reportData.content.networkDiagnosticReport.statistics.downlink_avg_rtt}
                        </td>
                      </tr>
                      <tr className="border-b border-theme-border text-left hover:bg-theme-background">
                        <td className={config.cellClassName}>{t("troubleshooting.avg_loss")}</td>
                        <td className={config.cellClassName}>
                          {`${reportData.content.networkDiagnosticReport.statistics.uplink_avg_loss} %`}
                        </td>
                        <td className={config.cellClassName}>
                          {`${reportData.content.networkDiagnosticReport.statistics.downlink_avg_loss} %`}
                        </td>
                      </tr>
                      <tr className="border-b border-theme-border text-left hover:bg-theme-background">
                        <td className={config.cellClassName}>{t("troubleshooting.avg_jitter")}</td>
                        <td className={config.cellClassName}>
                          {reportData.content.networkDiagnosticReport.statistics.uplink_avg_jitter}
                        </td>
                        <td className={config.cellClassName}>
                          {reportData.content.networkDiagnosticReport.statistics.downlink_avg_jitter}
                        </td>
                      </tr>
                      <tr className="border-b border-theme-border text-left hover:bg-theme-background">
                        <td className={config.cellClassName}>{t("troubleshooting.bandwidth")}</td>
                        <td className={config.cellClassName}>
                          {reportData.content.networkDiagnosticReport.statistics.uplink_bandwidth}
                        </td>
                        <td className={config.cellClassName}>
                          {reportData.content.networkDiagnosticReport.statistics.downlink_bandwidth}
                        </td>
                      </tr>
                      <tr className="border-b border-theme-border text-left hover:bg-theme-background">
                        <td className={config.cellClassName}>{t("troubleshooting.bandwidth_quality")}</td>
                        <td className={config.cellClassName}>
                          {{
                            0: t("troubleshooting.quality_very_low"),
                            1: t("troubleshooting.quality_low"),
                            2: t("troubleshooting.quality_normal"),
                            255: t("troubleshooting.quality_unknown"),
                          }[reportData.content.networkDiagnosticReport.statistics.uplink_bw_level] ||
                            t("troubleshooting.quality_undefined")}
                        </td>
                        <td className={config.cellClassName}>
                          {{
                            0: t("troubleshooting.quality_very_low"),
                            1: t("troubleshooting.quality_low"),
                            2: t("troubleshooting.quality_normal"),
                            255: t("troubleshooting.quality_unknown"),
                          }[reportData.content.networkDiagnosticReport.statistics.downlink_bw_level] ||
                            t("troubleshooting.quality_undefined")}
                        </td>
                      </tr>
                      <tr className="hover:bg-theme-background">
                        <td className={config.cellClassName}>{t("troubleshooting.network_quality")}</td>
                        <td className={config.cellClassName}>
                          {{
                            0: t("troubleshooting.quality_very_bad"),
                            1: t("troubleshooting.quality_bad"),
                            2: t("troubleshooting.quality_not_good"),
                            3: t("troubleshooting.quality_fair"),
                            4: t("troubleshooting.quality_good"),
                            5: t("troubleshooting.quality_excellent"),
                            255: t("troubleshooting.quality_unknown"),
                          }[reportData.content.networkDiagnosticReport.statistics.uplink_network_level] ||
                            t("troubleshooting.quality_undefined")}
                        </td>
                        <td className={config.cellClassName}>
                          {{
                            0: t("troubleshooting.quality_very_bad"),
                            1: t("troubleshooting.quality_bad"),
                            2: t("troubleshooting.quality_not_good"),
                            3: t("troubleshooting.quality_fair"),
                            4: t("troubleshooting.quality_good"),
                            5: t("troubleshooting.quality_excellent"),
                            255: t("troubleshooting.quality_unknown"),
                          }[reportData.content.networkDiagnosticReport.statistics.downlink_network_level] ||
                            t("troubleshooting.quality_undefined")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <br />
            <div className="mb-4">
              <div className={scrollWrapperClassName}>
                <div className={config.supportTableContainerClassName}>
                  <table className={config.supportedTableClassName}>
                    <thead>
                      <tr className={tableHeaderStyle}>
                        <th className={config.supportedFeatureNameClassName}>{t("troubleshooting.feature_name")}</th>
                        <th className={config.supportedFeatureSupportClassName}>{t("troubleshooting.support")}</th>
                        <th className={config.supportedFeatureTipsClassName}>{t("troubleshooting.tips")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.content.supportedFeatures.map((item: SupportedFeature, index: number) => {
                        if (item.featureName.indexOf("5x5 Desktop Gallery View") > -1) {
                          return null;
                        }
                        return (
                          <tr key={index} className={tableBodyStyle}>
                            <td className={`${config.supportedFeatureNameClassName} ${config.bodyTextClassName}`}>
                              {item.featureName.indexOf("3x3 Desktop Gallery View") > -1 && isCompactMobile
                                ? t("troubleshooting.gallery_view_2x2")
                                : item.featureName}
                            </td>
                            <td className={config.supportedFeatureSupportClassName}>
                              {item.featureName.indexOf("Gallery View") > -1
                                ? t("troubleshooting.yes")
                                : item.isSupported
                                  ? t("troubleshooting.yes")
                                  : t("troubleshooting.no")}
                            </td>
                            <td
                              className={`${config.supportedFeatureTipsClassName} ${
                                layout === "screen" ? "hover:border-r hover:border-theme-border" : ""
                              }`}
                            >
                              <ul className="ms-0 list-none ps-0">
                                {item.checkList.map((check) => {
                                  if (
                                    item.featureName.indexOf("Gallery View") > -1 &&
                                    check.tip.indexOf("SharedArrayBuffer") > -1 &&
                                    isVideoWebRTC
                                  ) {
                                    return null;
                                  }
                                  return (
                                    <li key={`${check.index}-${check.tip}`} className={config.bodyTextClassName}>
                                      <strong
                                        className={`${check.matched ? "text-green-500" : "text-red-500"} ${config.bodyTextClassName}`}
                                      >
                                        {check.matched ? "✓ " : "✖ "} {check.label}
                                      </strong>
                                      <p className={`pl-4 ${config.bodyTextClassName}`}>{check.tip}</p>
                                    </li>
                                  );
                                })}
                              </ul>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const createPdf = async () => {
    const exportRoot = exportReportRef.current;
    const exportWidth = isCompactMobile ? 760 : 1120;

    if (!exportRoot) {
      return null;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 80));

    const canvas = await html2canvas(exportRoot, {
      scale: isCompactMobile ? 1.5 : 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#2d2d2d",
      windowWidth: exportWidth,
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const pdf = new jsPDF("p", "mm", "a4");
    const imageData = canvas.toDataURL("image/jpeg", isCompactMobile ? 0.82 : 0.96);
    let firstPage = true;

    while (heightLeft >= 0) {
      if (!firstPage) {
        pdf.addPage();
      }

      pdf.addImage(imageData, "JPEG", 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;
      position -= pageHeight;
      firstPage = false;
    }

    return pdf;
  };

  const downloadPreparedReport = async () => {
    if (!preparedReportUrl) {
      return;
    }

    if (trackingId) {
      const loggerClient = client?.getLoggerClient();
      if (loggerClient) {
        await loggerClient.reportToGlobalTracing();
      }
    }

    if (isMobile) {
      window.open(preparedReportUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const link = document.createElement("a");
    link.href = preparedReportUrl;
    link.download = getReportFileName();
    link.click();
  };

  const handleExportPDF = async () => {
    if (preparedReportUrl) {
      await downloadPreparedReport();
      return;
    }

    setIsPreparingExport(true);

    try {
      const pdf = await createPdf();
      if (!pdf) {
        return;
      }

      if (trackingId) {
        const loggerClient = client?.getLoggerClient();
        if (loggerClient) {
          await loggerClient.reportToGlobalTracing();
        }
      }

      if (isMobile) {
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        setPreparedReportUrl((currentUrl) => {
          if (currentUrl) {
            URL.revokeObjectURL(currentUrl);
          }
          return pdfUrl;
        });

        window.open(pdfUrl, "_blank", "noopener,noreferrer");
      } else {
        pdf.save(getReportFileName());
      }
    } catch (error) {
      enqueueSnackbar(t("troubleshooting.error_generating_pdf", { error }), { variant: "error" });
    } finally {
      setIsPreparingExport(false);
    }
  };

  useEffect(() => {
    if (!reportData || isDiagnosing || !isMobile) {
      return;
    }

    const prepareReportDownload = async () => {
      const runId = ++reportGenerationIdRef.current;
      setIsPreparingExport(true);

      try {
        const pdf = await createPdf();
        if (!pdf || runId !== reportGenerationIdRef.current) {
          return;
        }

        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        setPreparedReportUrl((currentUrl) => {
          if (currentUrl) {
            URL.revokeObjectURL(currentUrl);
          }
          return pdfUrl;
        });
      } catch (error) {
        if (runId !== reportGenerationIdRef.current) {
          return;
        }
        enqueueSnackbar(t("troubleshooting.error_generating_pdf", { error }), { variant: "error" });
      } finally {
        if (runId === reportGenerationIdRef.current) {
          setIsPreparingExport(false);
        }
      }
    };

    void prepareReportDownload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDiagnosing, isMobile, reportData]);

  useEffect(() => {
    return () => {
      if (preparedReportUrl) {
        URL.revokeObjectURL(preparedReportUrl);
      }
    };
  }, [preparedReportUrl]);

  useEffect(() => {
    return () => {
      clearDiagnosticTimers();
      diagnosticRunIdRef.current += 1;
      reportGenerationIdRef.current += 1;
    };
  }, []);

  useEffect(() => {
    return () => prober.cleanup();
  }, [prober]);

  const statusCard = getStatusCard();
  const StatusIcon = statusCard.icon;
  const exportWidth = isCompactMobile ? 760 : 1120;
  const exportPadding = isCompactMobile ? 16 : 24;

  return (
    <div className="flex-grow overflow-auto" style={style}>
      <div className="mb-6 rounded-2xl border border-theme-border bg-theme-surface p-4 shadow-sm">
        <div className="flex min-w-0 gap-3">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-theme-background">
            <StatusIcon size={20} className={statusCard.iconClassName} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-theme-text">{statusCard.title}</h3>
            <p
              className={`mt-1 text-sm text-theme-text/70 ${isCompactMobile ? "" : "max-w-[38rem]"}`}
              aria-live="polite"
            >
              {statusCard.description}
            </p>
            {isCompactMobile && <p className="mt-2 text-xs text-theme-text/60">{t("troubleshooting.mobile_tip")}</p>}
          </div>
        </div>
        <div
          className={`mt-4 flex gap-3 ${
            isCompactMobile ? "flex-col" : reportData && !isDiagnosing ? "flex-wrap" : "justify-center"
          }`}
        >
          <Button onClick={handleStartDiagnostic} disabled={isDiagnosing || isPreparingExport} size="md">
            {isDiagnosing
              ? t("troubleshooting.diagnosing", { time: formatTime(countdown) })
              : t("troubleshooting.start_diagnostic")}
          </Button>
          {reportData && !isDiagnosing && (
            <Button
              onClick={handleExportPDF}
              size="md"
              disabled={isPreparingExport || (isMobile && !preparedReportUrl)}
              className={isCompactMobile ? "" : "min-w-[240px]"}
            >
              <span className="inline-flex items-center gap-2">
                {isPreparingExport ? (
                  <LoaderCircle size={16} className="animate-spin" aria-hidden />
                ) : (
                  <Download size={16} aria-hidden />
                )}
                {isPreparingExport
                  ? t("troubleshooting.preparing_report")
                  : trackingId
                    ? t("troubleshooting.send_and_export_report")
                    : t("troubleshooting.export_report")}
              </span>
            </Button>
          )}
        </div>

        {(isDiagnosing || isPreparingExport || reportData) && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-theme-text/60">
              <span>{t("troubleshooting.progress_label")}</span>
              <span>{isPreparingExport ? t("troubleshooting.progress_preparing") : `${diagnosticProgress}%`}</span>
            </div>
            <div
              role="progressbar"
              aria-label={t("troubleshooting.progress_label")}
              aria-valuenow={isPreparingExport ? undefined : diagnosticProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 overflow-hidden rounded-full bg-theme-background"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isPreparingExport ? "w-full animate-pulse bg-amber-500" : "bg-blue-500"
                }`}
                style={isPreparingExport ? undefined : { width: `${diagnosticProgress}%` }}
              />
            </div>
          </div>
        )}

        {diagnosticError && (
          <p role="alert" className="mt-3 text-sm text-red-500">
            {diagnosticError}
          </p>
        )}
      </div>

      <div id="diagnostic-report">{renderReportContent("screen")}</div>

      {(diagnosticData.length > 0 || reportData) && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-[-10000px] top-0 -z-10 bg-[#2d2d2d]"
          style={{
            width: `${exportWidth}px`,
            padding: `${exportPadding}px`,
          }}
        >
          <div
            ref={exportReportRef}
            style={{
              width: `${exportWidth - exportPadding * 2}px`,
              maxWidth: "none",
              overflow: "visible",
            }}
          >
            {renderReportContent(isCompactMobile ? "mobile-export" : "desktop-export")}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticTab;
