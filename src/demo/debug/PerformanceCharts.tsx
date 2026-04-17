import React, { useEffect, useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QoSDisplay from "./QOS/QoSDisplay";

// Apple-inspired color palette
const LIGHT_COLORS = ["#007AFF", "#5856D6", "#FF2D55", "#FF9500"];
const DARK_COLORS = ["#0A84FF", "#5E5CE6", "#FF375F", "#FF9F0A"];

// Add these new constants at the top after the color palettes
const CHART_HEIGHTS = {
  mobile: 200,
  desktop: 300,
};

const FONT_SIZES = {
  mobile: {
    title: 16,
    heading: 15,
  },
  desktop: {
    title: 18,
    heading: 16,
  },
};

interface MemoryDataPoint {
  timestamp: number;
  usedHeap: number;
  totalHeap: number;
}

interface PerformanceDataPoint {
  timestamp: number;
  usedHeap: number;
  totalHeap: number;
  cpuUsage: number;
  gpuUsage: number;
}

interface PerformanceChartsProps {
  metrics: {
    timing: {
      totalLoadTime?: number;
      domContentLoaded?: number;
      firstPaint?: number | "Not available";
      firstContentfulPaint?: number | "Not available";
    };
    memory: {
      usedJSHeapSize?: number;
      totalJSHeapSize?: number;
      jsHeapSizeLimit?: number;
    };
    resources: Array<{
      name: string;
      type: string;
      duration: number;
      size: number;
    }>;
    layout: {
      cumulativeLayoutShift?: string;
    };
  };
}

interface ExportData {
  timestamp: string;
  timingMetrics: {
    name: string;
    time: number | undefined;
  }[];
  memoryData: {
    name: string;
    value: number | undefined;
  }[];
  resourceData: Array<{
    name: string;
    type: string;
    duration: number;
    size: number;
  }>;
  performanceData: PerformanceDataPoint[];
}

// Add this helper function near the top of the component
const isMobileIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

// Add this near the top with other interfaces
interface ChartData {
  memoryTimeSeries: MemoryDataPoint[];
  performanceData: PerformanceDataPoint[];
}

// Add this helper function near other utility functions
const formatTooltipValue = (value: number, unit: string) => {
  return `${value} ${unit}`;
};

// Add this new helper function near the top with other utility functions
const createECGLine = (dataKey: string, color: string, name: string) => (
  <Line
    type="basis"
    dataKey={dataKey}
    stroke={color}
    name={name}
    strokeWidth={2}
    dot={false}
    connectNulls
    animationDuration={300}
    // Increase tension to make the line more "sharp"
    // tension={0.8}
  />
);

// Update the component to include state for all history
export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ metrics }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartData, setChartData] = useState<ChartData>({
    memoryTimeSeries: [],
    performanceData: [],
  });
  const [cpuWorker, setCpuWorker] = useState<Worker | null>(null);
  const [gpuContext, setGpuContext] = useState<WebGLRenderingContext | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [baseTime, setBaseTime] = useState(Date.now());

  useEffect(() => {
    // Check system color scheme
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeMediaQuery.matches);

    // Listen for theme changes
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", handler);
    return () => darkModeMediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Initialize memory monitoring
    const updateMemoryUsage = () => {
      const { memory } = performance as any;
      if (memory) {
        const newDataPoint = {
          timestamp: Date.now(),
          usedHeap: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
          totalHeap: Math.round(memory.totalJSHeapSize / (1024 * 1024)),
        };

        setChartData((prev) => ({
          ...prev,
          memoryTimeSeries: [...prev.memoryTimeSeries, newDataPoint],
        }));
      }
    };

    const intervalId = setInterval(updateMemoryUsage, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Initialize CPU monitoring
    const worker = new Worker(new URL("./cpuWorker.ts", import.meta.url));
    setCpuWorker(worker);

    // Initialize GPU monitoring
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    setGpuContext(gl);

    return () => {
      worker.terminate();
      if (gl) {
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      }
    };
  }, []);

  const estimateGPUUsage = useCallback((gl: WebGLRenderingContext | null) => {
    if (!gl) return 0;

    const startTime = performance.now();

    // Create a complex scene to measure GPU performance
    const vertices = new Float32Array(10000);
    for (let i = 0; i < vertices.length; i++) {
      vertices[i] = Math.random();
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Measure time taken
    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    // Normalize to 0-100 range (this is a rough approximation)
    return Math.min(100, (timeTaken / 16.67) * 100); // 16.67ms is roughly 60fps
  }, []);

  useEffect(() => {
    if (!cpuWorker) return;

    const updatePerformanceData = () => {
      const { memory } = performance as any;
      if (memory) {
        const newDataPoint: PerformanceDataPoint = {
          timestamp: Date.now(),
          usedHeap: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
          totalHeap: Math.round(memory.totalJSHeapSize / (1024 * 1024)),
          cpuUsage: 0,
          gpuUsage: estimateGPUUsage(gpuContext),
        };

        setChartData((prev) => ({
          ...prev,
          performanceData: [...prev.performanceData, newDataPoint],
        }));
      }
    };

    cpuWorker.onmessage = (event) => {
      setChartData((prev) => {
        const lastPoint = prev.performanceData[prev.performanceData.length - 1];
        if (lastPoint) {
          const updatedPoint = { ...lastPoint, cpuUsage: event.data };
          return {
            ...prev,
            performanceData: [...prev.performanceData.slice(0, -1), updatedPoint],
          };
        }
        return prev;
      });
    };

    const intervalId = setInterval(updatePerformanceData, 1000);
    return () => clearInterval(intervalId);
  }, [cpuWorker, gpuContext, estimateGPUUsage]);

  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
  const textColor = isDarkMode ? "#FFFFFF" : "#000000";
  const gridColor = isDarkMode ? "#333333" : "#E5E5E5";
  const backgroundColor = isDarkMode ? "#1C1C1E" : "#FFFFFF";

  const timingData = [
    { name: "Total Load", time: metrics.timing.totalLoadTime || 0 },
    { name: "DOM Content", time: metrics.timing.domContentLoaded || 0 },
    { name: "First Paint", time: typeof metrics.timing.firstPaint === "number" ? metrics.timing.firstPaint : 0 },
    {
      name: "First Contentful",
      time: typeof metrics.timing.firstContentfulPaint === "number" ? metrics.timing.firstContentfulPaint : 0,
    },
  ].map((item) => ({
    ...item,
    time: Math.round(item.time),
  }));

  const memoryData = [
    { name: "Used Heap", value: metrics.memory.usedJSHeapSize },
    { name: "Total Heap", value: metrics.memory.totalJSHeapSize },
    { name: "Heap Limit", value: metrics.memory.jsHeapSizeLimit },
  ];

  const resourceData = metrics.resources
    .slice(0, 10) // Show only top 10 resources
    .sort((a, b) => b.duration - a.duration);

  const chartStyle: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor,
    borderRadius: isMobile ? "8px" : "12px",
    padding: isMobile ? "12px" : "16px",
    marginBottom: isMobile ? "16px" : "24px",
    WebkitOverflowScrolling: "touch" as const,
  };

  const formatTimestamp = (timestamp: number) => {
    const seconds = Math.floor((timestamp - baseTime) / 1000);
    const milliseconds = Math.floor(timestamp - baseTime - seconds * 1000);
    return `${seconds}:${milliseconds.toString().padStart(3, "0")}`;
  };

  const isMemoryAPIAvailable = () => {
    return (performance as any).memory !== undefined;
  };

  const exportToJson = () => {
    const exportData: ExportData = {
      timestamp: new Date().toISOString(),
      timingMetrics: timingData,
      memoryData: memoryData,
      resourceData: resourceData,
      performanceData: chartData.performanceData,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    if (isMobileIOS()) {
      // For iOS devices, open in a new tab
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
      // For other devices, try direct download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `performance-data-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const exportToPdf = async () => {
    const chartsContainer = document.getElementById("performance-charts");
    if (!chartsContainer) return;

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      let currentPosition = 10;

      // Add title
      pdf.setFontSize(16);
      pdf.text("Performance Report", pdfWidth / 2, currentPosition, { align: "center" });
      currentPosition += 10;

      // Add timestamp
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, currentPosition);
      currentPosition += 10;

      // Convert each chart to canvas and add to PDF
      const charts = chartsContainer.getElementsByClassName("chart-container");
      for (let i = 0; i < charts.length; i++) {
        const chart = charts[i] as HTMLElement;
        const canvas = await html2canvas(chart, {
          scale: 2,
          backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
        });

        // Calculate dimensions to fit the page width while maintaining aspect ratio
        const imgWidth = pdfWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add new page if needed
        if (currentPosition + imgHeight > pdfHeight) {
          pdf.addPage();
          currentPosition = 10;
        }

        // Add chart title
        const title = chart.getElementsByTagName("h3")[0]?.textContent;
        if (title) {
          pdf.setFontSize(12);
          pdf.text(title, 10, currentPosition);
          currentPosition += 7;
        }

        // Add chart image
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 10, currentPosition, imgWidth, imgHeight);
        currentPosition += imgHeight + 10;
      }

      if (isMobileIOS()) {
        // For iOS devices, open in a new tab
        pdf.output("dataurlnewwindow");
      } else {
        // For other devices, try direct download
        pdf.save(`performance-report-${new Date().toISOString()}.pdf`);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setErrorMessage("Failed to generate PDF. Please try again.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  // Update the clear history function to reset timestamps
  const clearHistory = () => {
    const currentTime = Date.now();
    setChartData({
      memoryTimeSeries: [],
      performanceData: [],
    });
    // Reset the base time after clearing
    setBaseTime(currentTime);
  };

  return (
    <div
      id="performance-charts"
      style={{
        width: "100%",
        padding: isMobile ? "12px" : "20px",
        backgroundColor,
        color: textColor,
        transition: "background-color 0.3s, color 0.3s",
        WebkitTapHighlightColor: "transparent", // Remove tap highlight on iOS
      }}
    >
      {errorMessage && (
        <div
          style={{
            backgroundColor: colors[2],
            color: "#FFFFFF",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {errorMessage}
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: isMobile ? "8px" : "10px",
          marginBottom: isMobile ? "16px" : "20px",
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={clearHistory}
          style={{
            padding: isMobile ? "6px 12px" : "8px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: colors[2], // Using a different color
            color: "#FFFFFF",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: isMobile ? "14px" : "16px",
            transition: "opacity 0.2s",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          onFocus={(e) => (e.currentTarget.style.opacity = "0.8")}
          onBlur={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Clear History
        </button>
        <button
          onClick={exportToJson}
          style={{
            padding: isMobile ? "6px 12px" : "8px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: colors[0],
            color: "#FFFFFF",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: isMobile ? "14px" : "16px",
            transition: "opacity 0.2s",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          onFocus={(e) => (e.currentTarget.style.opacity = "0.8")}
          onBlur={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {isMobileIOS() ? "View JSON" : "Export to JSON"}
        </button>
        <button
          onClick={exportToPdf}
          style={{
            padding: isMobile ? "6px 12px" : "8px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: colors[1],
            color: "#FFFFFF",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: isMobile ? "14px" : "16px",
            transition: "opacity 0.2s",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          onFocus={(e) => (e.currentTarget.style.opacity = "0.8")}
          onBlur={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {isMobileIOS() ? "View PDF" : "Export to PDF"}
        </button>
      </div>

      <div className="chart-container" style={chartStyle}>
        <h3
          style={{
            fontSize: isMobile ? FONT_SIZES.mobile.heading : FONT_SIZES.desktop.heading,
            fontWeight: 600,
            marginBottom: isMobile ? "12px" : "16px",
          }}
        >
          Timing Metrics (ms)
        </h3>
        <ResponsiveContainer width="100%" height={isMobile ? CHART_HEIGHTS.mobile : CHART_HEIGHTS.desktop}>
          <BarChart data={timingData} margin={isMobile ? { top: 5, right: 10, left: -20, bottom: 5 } : undefined}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="name"
              tick={{ fill: textColor, fontSize: isMobile ? 12 : 14 }}
              interval={isMobile ? 1 : 0}
            />
            <YAxis tick={{ fill: textColor, fontSize: isMobile ? 12 : 14 }} width={isMobile ? 30 : 40} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#2C2C2E" : "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              formatter={(value: number) => formatTooltipValue(value, "ms")}
            />
            <Bar dataKey="time" fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container" style={chartStyle}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>System Performance (%)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="timestamp"
              tick={{ fill: textColor }}
              tickFormatter={formatTimestamp}
              domain={["dataMin", "dataMax"]}
            />
            <YAxis tick={{ fill: textColor }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#2C2C2E" : "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              labelFormatter={formatTimestamp}
              formatter={(value: number) => formatTooltipValue(value, "%")}
            />
            {createECGLine("cpuUsage", colors[2], "CPU Usage")}
            {createECGLine("gpuUsage", colors[3], "GPU Usage")}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {isMemoryAPIAvailable() ? (
        <div className="chart-container" style={chartStyle}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Memory Usage Over Time (MB)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.memoryTimeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="timestamp"
                tick={{ fill: textColor }}
                tickFormatter={formatTimestamp}
                domain={["dataMin", "dataMax"]}
              />
              <YAxis tick={{ fill: textColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#2C2C2E" : "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
                labelFormatter={formatTimestamp}
                formatter={(value: number) => formatTooltipValue(value, "MB")}
              />
              {createECGLine("usedHeap", colors[0], "Used Heap")}
              {createECGLine("totalHeap", colors[1], "Total Heap")}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="chart-container" style={chartStyle}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Memory Usage Over Time (MB)</h3>
          <p style={{ color: textColor }}>Memory monitoring is only available in Chromium-based browsers.</p>
        </div>
      )}

      <div className="chart-container" style={chartStyle}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Resource Loading Times (ms)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={resourceData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fill: textColor }} />
            <YAxis tick={{ fill: textColor }} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#2C2C2E" : "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              formatter={(value: number) => formatTooltipValue(value, "ms")}
            />
            <Bar dataKey="duration" fill={colors[1]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <QoSDisplay />
    </div>
  );
};
