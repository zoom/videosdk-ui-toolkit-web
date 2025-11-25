import { useContext, useEffect } from "react";
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
    path: string; //uplink or downlink
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

const SessionInfoTable = ({
  sessionInfo,
  userId,
  webEndpoint,
  trackingId,
}: {
  sessionInfo: SessionInfo;
  userId: any;
  webEndpoint: string;
  trackingId: string;
}) => {
  return (
    <div className="mb-4">
      <div className="overflow-x-auto border border-theme-border rounded-lg">
        <div className="diagnostic-report-table-container text-xs font-small min-w-full bg-theme-surface">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-theme-border text-left bg-theme-background">
                <th colSpan={2} className="px-2 py-2">
                  Session Information
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { field: "Session ID", value: sessionInfo?.sessionId },
                { field: "User ID", value: userId },
                ...(trackingId ? [{ field: "Tracking ID", value: trackingId }] : []),
                { field: "Web Endpoint", value: webEndpoint },
                { field: "SDK Version", value: window?.JsMediaSDK_Instance?.version },
              ].map((item, index) => (
                <tr key={index} className={tableBodyStyle}>
                  <td className={tableCellStyle}>{item.field}</td>
                  <td className={tableCellStyle}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DiagnosticTab = ({ themeName, style }: { themeName: string; style?: React.CSSProperties }) => {
  const { prober } = useProbe();

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

  const testDuration = 120 * 1000;
  const timeoutDuration = 10 * 1000;
  const domain = "go.zoom.us";

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartDiagnostic = () => {
    setDiagnosticData([]);
    setReportData(null);
    setIsDiagnosing(true);
    setCountdown(testDuration / 1000); // Start countdown with seconds

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(countdownInterval); // Stop countdown when reaching 0
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    prober
      .startToDiagnose(
        "https://source.zoom.us/probesdk/1.0.34/lib/prober.js",
        "https://source.zoom.us/probesdk/1.0.34/lib/prober.wasm",
        { probeDuration: testDuration, connectTimeout: timeoutDuration, domain: domain },
        (stats: Statistics) => setDiagnosticData((prevArray) => [...prevArray, stats]),
      )
      .then((report: ReportObject) => {
        setIsDiagnosing(false);
        setReportData(report);
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
      <div className="p-4 border border-theme-border bg-theme-surface rounded-lg shadow-sm">
        <p className="text-sm font-medium mb-2">{`Time: ${label}s`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toFixed(3)} ${unit}`}
          </p>
        ))}
      </div>
    );
  };
  const renderChart = (data: ChartData[], yAxisLabel: string, unit: string) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} />
        <XAxis
          dataKey="time"
          stroke="#6b7280"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          tickLine={{ stroke: "#6b7280" }}
        >
          <Label value="Time (s)" position="insideBottom" dy={10} />
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
          name="Download"
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
          name="Upload"
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
    time: number; // Represents time as an incrementing value
    uplink: number | null;
    downlink: number | null;
  };

  const bandwidthData = diagnosticData.reduce<ChartData[]>((acc, _, i, arr) => {
    if (i % 2 === 0) {
      const uplink = arr[i].content.path === "uplink" ? arr[i] : arr[i + 1];
      const downlink = arr[i].content.path === "downlink" ? arr[i] : arr[i + 1];

      if (uplink && downlink) {
        acc.push({
          time: (i / 2) * 5,
          uplink: uplink.content.statistics.bandwidth,
          downlink: downlink.content.statistics.bandwidth,
        });
      }
    }
    return acc;
  }, []);

  const rttData = diagnosticData.reduce<ChartData[]>((acc, _, i, arr) => {
    if (i % 2 === 0) {
      const uplink = arr[i].content.path === "uplink" ? arr[i] : arr[i + 1];
      const downlink = arr[i].content.path === "downlink" ? arr[i] : arr[i + 1];

      if (uplink && downlink) {
        acc.push({
          time: (i / 2) * 5,
          uplink: uplink.content.statistics.rtt,
          downlink: downlink.content.statistics.rtt,
        });
      }
    }
    return acc;
  }, []);

  const lossData = diagnosticData.reduce<ChartData[]>((acc, _, i, arr) => {
    if (i % 2 === 0) {
      const uplink = arr[i].content.path === "uplink" ? arr[i] : arr[i + 1];
      const downlink = arr[i].content.path === "downlink" ? arr[i] : arr[i + 1];

      if (uplink && downlink) {
        acc.push({
          time: (i / 2) * 5,
          uplink: uplink.content.statistics.lossRate,
          downlink: downlink.content.statistics.lossRate,
        });
      }
    }
    return acc;
  }, []);

  const continuousLossData = diagnosticData.reduce<ChartData[]>((acc, _, i, arr) => {
    if (i % 2 === 0) {
      const uplink = arr[i].content.path === "uplink" ? arr[i] : arr[i + 1];
      const downlink = arr[i].content.path === "downlink" ? arr[i] : arr[i + 1];

      if (uplink && downlink) {
        acc.push({
          time: (i / 2) * 5,
          uplink: uplink.content.statistics.max_continuous_loss_num,
          downlink: downlink.content.statistics.max_continuous_loss_num,
        });
      }
    }
    return acc;
  }, []);

  const renderAffectedFeatures = (
    features: {
      featureName: string;
    }[],
  ) => {
    if (!features || features.length === 0) {
      return "None";
    }

    return (
      <ul>
        {features.map((feature, idx) => (
          <li key={idx}>{feature.featureName}</li>
        ))}
      </ul>
    );
  };

  const handleExportPDF = async () => {
    const content = document.getElementById("diagnostic-report");
    if (!content) return;

    try {
      const canvas = await html2canvas(content, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF("p", "mm", "a4");
      let firstPage = true;

      while (heightLeft >= 0) {
        if (!firstPage) {
          pdf.addPage();
        }

        pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, position, imgWidth, imgHeight);

        heightLeft -= pageHeight;
        position -= pageHeight;
        firstPage = false;
      }

      if (trackingId) {
        const loggerClient = client?.getLoggerClient();
        if (loggerClient) {
          await loggerClient.reportToGlobalTracing();
        }
      }

      if (isMobileDevice()) {
        // For mobile devices, open in new tab
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
      } else {
        // For desktop, save as file

        if (sessionId || trackingId) {
          const filename = trackingId
            ? `diagnostic-report-${trackingId}.pdf`
            : `diagnostic-report-${sessionId}-${userId}.pdf`;
          pdf.save(filename);
        } else {
          pdf.save("diagnostic-report.pdf");
        }
      }
    } catch (error) {
      enqueueSnackbar(`Error generating PDF: ${error}`, { variant: "error" });
    }
  };

  useEffect(() => {
    return () => prober.cleanup();
  }, [prober]);

  return (
    <div className="flex-grow overflow-auto" style={style}>
      <div className="flex justify-center gap-4 mb-6">
        <Button onClick={handleStartDiagnostic} disabled={isDiagnosing} size="md">
          {isDiagnosing ? `Diagnosing... (${formatTime(countdown)})` : "Start Diagnostic"}
        </Button>
        {reportData && !isDiagnosing && (
          <Button onClick={handleExportPDF} size="md">
            {trackingId ? `Send and Export Report` : "Export Report"}
          </Button>
        )}
      </div>
      <div id="diagnostic-report">
        {diagnosticData.length > 0 && (
          <div className="charts-container space-y-4">
            {renderChart(bandwidthData, "Bandwidth/Mb", "Mbps")}
            {renderChart(rttData, "RTT/ms", "ms")}
            {renderChart(lossData, "Loss Rate/%", "%")}
            {renderChart(continuousLossData, "Continuous Loss Num/%", "%")}
          </div>
        )}
        {reportData && (
          <>
            {/* Basic Info Table */}
            <div className="mb-4">
              <div className="overflow-x-auto border border-theme-border rounded-lg uikit-custom-scrollbar">
                <div className="basic-info-table-container text-xs font-small min-w-full text-theme-text bg-theme-surface">
                  <table className="w-full table-fixed border-collapse rounded-lg overflow-hidden">
                    <thead>
                      <tr className={tableHeaderStyle}>
                        <th className={`${tableCellStyle} w-8 text-center`}>
                          <span className="sr-only">Index</span>#
                        </th>
                        <th className={tableCellStyle}>Attribute</th>
                        <th className={tableCellStyle}>Value</th>
                        <th className={`${tableCellStyle} w-20 whitespace-nowrap text-center`}>Critical</th>
                        <th className={tableCellStyle}>Affected Features</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.content.basicInfo.map((item: BasicInfo, index: number) => (
                        <tr key={index} className={tableBodyStyle}>
                          <td className={tableCellStyle}>{item.index}</td>
                          <td className={`${tableCellStyle} whitespace-normal`}>{item.attr}</td>
                          <td className={`${tableCellStyle} whitespace-normal break-words`}>{item.val}</td>
                          <td className={`${tableCellStyle} w-20 text-center`}>{item.critical ? "Yes" : "No"}</td>
                          <td className={`${tableCellStyle} break-words`}>
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
            {/* Session Info Table */}
            {sessionInfo && sessionInfo.sessionId && (
              <SessionInfoTable
                sessionInfo={sessionInfo}
                userId={userId}
                webEndpoint={webEndpoint}
                trackingId={trackingId}
              />
            )}
            {/* Network Report Table */}
            <div className="mb-4">
              <div className="overflow-x-auto border border-theme-border rounded-lg">
                <div className="diagnostic-report-table-container text-xs font-small min-w-full bg-theme-surface">
                  <table className="w-full border-collapse rounded-lg overflow-hidden text-theme-text">
                    <thead>
                      <tr className="bg-theme-background rounded-t-lg ">
                        <th
                          colSpan={4}
                          className="px-2 py-2"
                        >{`Service Zone: ${reportData.content.networkDiagnosticReport.serviceZone}`}</th>
                      </tr>
                    </thead>
                    <thead>
                      <tr className={tableBodyStyle}>
                        <th className={tableCellStyle}>Protocol Type</th>
                        <th className={tableCellStyle}>Is Blocked</th>
                        <th className={tableCellStyle}>Port</th>
                        <th className={tableCellStyle}>Tip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.content.networkDiagnosticReport.protocols.map(
                        (
                          item: {
                            type: number;
                            isBlocked: boolean;
                            port: string;
                            tip: string;
                          },
                          index: number,
                        ) => (
                          <tr key={index} className={tableBodyStyle}>
                            <td className={tableCellStyle}>
                              {{
                                1: "https",
                                2: "websocket",
                                3: "datachannel",
                              }[item.type] || "unknown"}
                            </td>
                            <td className={tableCellStyle}>{item.isBlocked ? "Yes" : "No"}</td>
                            <td className={tableCellStyle}>{item.port}</td>
                            <td className={tableCellStyle}>{item.tip}</td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                  <br />
                  <table className="w-full border-collapse rounded-lg overflow-hidden bg-theme-surface border border-theme-border">
                    <thead>
                      <tr className={tableHeaderStyle}>
                        <th className={tableCellStyle}>Metrics</th>
                        <th className={tableCellStyle}>UpLink</th>
                        <th className={tableCellStyle}>DownLink</th>
                      </tr>
                    </thead>
                    <tbody className="bg-theme-surface border-b border-theme-border">
                      <tr className="border-b border-theme-border text-left hover:bg-theme-background">
                        <td className={tableCellStyle}>Average RTT (ms)</td>
                        <td className={tableCellStyle}>
                          {reportData.content.networkDiagnosticReport.statistics.uplink_avg_rtt}
                        </td>
                        <td className={tableCellStyle}>
                          {reportData.content.networkDiagnosticReport.statistics.downlink_avg_rtt}
                        </td>
                      </tr>
                      <tr className="border-b border-theme-border text-left hover:bg-theme-background">
                        <td className={tableCellStyle}>Average Loss (%)</td>
                        <td
                          className={tableCellStyle}
                        >{`${reportData.content.networkDiagnosticReport.statistics.uplink_avg_loss} %`}</td>
                        <td
                          className={tableCellStyle}
                        >{`${reportData.content.networkDiagnosticReport.statistics.downlink_avg_loss} %`}</td>
                      </tr>
                      <tr className="border-b border-theme-border text-left hover:bg-theme-background">
                        <td className={tableCellStyle}>Average Jitter (ms)</td>
                        <td className={tableCellStyle}>
                          {reportData.content.networkDiagnosticReport.statistics.uplink_avg_jitter}
                        </td>
                        <td className={tableCellStyle}>
                          {reportData.content.networkDiagnosticReport.statistics.downlink_avg_jitter}
                        </td>
                      </tr>
                      <tr className="border-b border-theme-border text-left hover:bg-theme-background">
                        <td className={tableCellStyle}>Bandwidth (KB/s)</td>
                        <td className={tableCellStyle}>
                          {reportData.content.networkDiagnosticReport.statistics.uplink_bandwidth}
                        </td>
                        <td className={tableCellStyle}>
                          {reportData.content.networkDiagnosticReport.statistics.downlink_bandwidth}
                        </td>
                      </tr>
                      <tr className="border-b border-theme-border text-left hover:bg-theme-background">
                        <td className={tableCellStyle}>Bandwidth Quality</td>
                        <td className={tableCellStyle}>
                          {{
                            0: "very low",
                            1: "low",
                            2: "normal",
                            255: "unknown",
                          }[reportData.content.networkDiagnosticReport.statistics.uplink_bw_level] || "undefined"}
                        </td>
                        <td className={tableCellStyle}>
                          {{
                            0: "very low",
                            1: "low",
                            2: "normal",
                            255: "unknown",
                          }[reportData.content.networkDiagnosticReport.statistics.downlink_bw_level] || "undefined"}
                        </td>
                      </tr>
                      <tr className="hover:bg-theme-background">
                        <td className={tableCellStyle}>Network Quality</td>
                        <td className={tableCellStyle}>
                          {{
                            0: "very bad",
                            1: "bad",
                            2: "not good",
                            3: "fair",
                            4: "good",
                            5: "excellent",
                            255: "unknown",
                          }[reportData.content.networkDiagnosticReport.statistics.uplink_network_level] || "undefined"}
                        </td>
                        <td className={tableCellStyle}>
                          {{
                            0: "very bad",
                            1: "bad",
                            2: "not good",
                            3: "fair",
                            4: "good",
                            5: "excellent",
                            255: "unknown",
                          }[reportData.content.networkDiagnosticReport.statistics.downlink_network_level] ||
                            "undefined"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <br />
            {/* Supported Features Table */}
            <div className="mb-4">
              <div className="overflow-x-auto border border-theme-border rounded-lg uikit-custom-scrollbar">
                <div className="diagnostic-report-table-container text-xs font-small min-w-full text-gray-700 bg-theme-surface">
                  <table className="w-full border-collapse rounded-lg overflow-hidden uikit-custom-scrollbar">
                    <thead>
                      <tr className={tableHeaderStyle}>
                        <th className={tableCellStyle}>Feature Name</th>
                        <th className={tableCellStyle}>Support</th>
                        <th className={tableCellStyle}>Tips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.content.supportedFeatures.map((item: SupportedFeature, index: number) => {
                        if (item.featureName.indexOf("5x5 Desktop Gallery View") > -1) {
                          return null;
                        }
                        return (
                          <tr key={index} className={tableBodyStyle}>
                            <td className={tableCellStyle}>
                              {item.featureName.indexOf("3x3 Desktop Gallery View") > -1 && isMobileDeviceNotIpad()
                                ? "2x2 Gallery View"
                                : item.featureName}
                            </td>
                            <td className={tableCellStyle}>
                              {item.featureName.indexOf("Gallery View") > -1 ? "Yes" : item.isSupported ? "Yes" : "No"}
                            </td>
                            <td className={`${tableCellStyle} hover:border-r hover:border-theme-border`}>
                              <ul className="list-none ps-0 ms-0">
                                {item.checkList.map((check) => {
                                  if (
                                    item.featureName.indexOf("Gallery View") > -1 &&
                                    check.tip.indexOf("SharedArrayBuffer") > -1 &&
                                    isVideoWebRTC
                                  ) {
                                    return null;
                                  }
                                  return (
                                    <li key={`${check.index}-${check.tip}`}>
                                      <strong className={`${check.matched ? "text-green-500" : "text-red-500"}`}>
                                        {check.matched ? "✓ " : "✖ "} {check.label}
                                      </strong>
                                      <p className="pl-4">{check.tip}</p>
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
      </div>
    </div>
  );
};

export default DiagnosticTab;
