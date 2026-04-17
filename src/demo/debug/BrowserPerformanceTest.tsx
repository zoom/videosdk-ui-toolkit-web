// Browser Performance Testing Suite

interface PerformanceMetrics {
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
  resources: ResourceMetric[];
  layout: {
    cumulativeLayoutShift?: string;
  };
}

interface ResourceMetric {
  name: string;
  type: string;
  duration: number;
  size: number;
}

interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

interface PerformanceNavigationTiming extends PerformanceEntry {
  loadEventEnd: number;
  navigationStart: number;
  domContentLoadedEventEnd: number;
}

interface PerformanceResourceTiming extends PerformanceEntry {
  initiatorType: string;
  transferSize: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
}

class BrowserPerformanceTest {
  public metrics: PerformanceMetrics;

  constructor() {
    this.metrics = {
      timing: {},
      memory: {},
      resources: [],
      layout: {},
    };
  }

  async measurePageLoad(): Promise<void> {
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navEntry) {
      this.metrics.timing = {
        totalLoadTime: navEntry.loadEventEnd - navEntry.navigationStart,
        domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.navigationStart,
        firstPaint: performance.getEntriesByType("paint")[0]?.startTime || "Not available",
        firstContentfulPaint: performance.getEntriesByType("paint")[1]?.startTime || "Not available",
      };
    }
  }

  measureMemory(): void {
    const extendedPerformance = performance as ExtendedPerformance;
    if (extendedPerformance.memory) {
      this.metrics.memory = {
        usedJSHeapSize: Math.round(extendedPerformance.memory.usedJSHeapSize / (1024 * 1024)),
        totalJSHeapSize: Math.round(extendedPerformance.memory.totalJSHeapSize / (1024 * 1024)),
        jsHeapSizeLimit: Math.round(extendedPerformance.memory.jsHeapSizeLimit / (1024 * 1024)),
      };
    }
  }

  measureResources(): void {
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    this.metrics.resources = resources.map((resource) => ({
      name: resource.name.split("/").pop() || "",
      type: resource.initiatorType,
      duration: Math.round(resource.duration),
      size: resource.transferSize,
    }));
  }

  measureLayoutMetrics(): void {
    // Check if the PerformanceObserver API is available
    if (!("PerformanceObserver" in window)) {
      this.metrics.layout = {
        cumulativeLayoutShift: "Not supported",
      };
      return;
    }

    let clsValue = 0;
    const clsEntries: PerformanceEntry[] = [];

    // Create new PerformanceObserver instance
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!("hadRecentInput" in entry)) {
          const layoutShiftEntry = entry as LayoutShiftEntry;
          clsValue += layoutShiftEntry.value;
          clsEntries.push(layoutShiftEntry);
        }
      }
    });

    try {
      // Start observing layout-shift entries
      observer.observe({ type: "layout-shift", buffered: true });

      // Disconnect after gathering entries
      setTimeout(() => {
        observer.disconnect();
        this.metrics.layout = {
          cumulativeLayoutShift: clsValue.toFixed(3),
        };
      }, 0);
    } catch (e) {
      console.warn("Layout Shift measurement not supported:", e);
      this.metrics.layout = {
        cumulativeLayoutShift: "Not supported",
      };
    }
  }

  async runFullTest(): Promise<string> {
    await this.measurePageLoad();
    this.measureMemory();
    this.measureResources();
    this.measureLayoutMetrics();
    return this.generateReport();
  }

  generateReport(): string {
    // Print Page Load Metrics table
    console.group("%c🔍 Browser Performance Report", "font-size: 20px; font-weight: bold; color: #4CAF50;");

    console.group("%c📊 Page Load Metrics", "font-size: 16px; font-weight: bold; color: #2196F3;");
    console.table({
      "Total Load Time": `${this.metrics.timing.totalLoadTime}ms`,
      "DOM Content Loaded": `${this.metrics.timing.domContentLoaded}ms`,
      "First Paint": `${this.metrics.timing.firstPaint}ms`,
      "First Contentful Paint": `${this.metrics.timing.firstContentfulPaint}ms`,
    });
    console.groupEnd();

    console.group("%c💾 Memory Usage", "font-size: 16px; font-weight: bold; color: #2196F3;");
    console.table({
      "Used JS Heap": `${this.metrics.memory.usedJSHeapSize}MB`,
      "Total JS Heap": `${this.metrics.memory.totalJSHeapSize}MB`,
      "JS Heap Limit": `${this.metrics.memory.jsHeapSizeLimit}MB`,
    });
    console.groupEnd();

    console.group("%c📦 Resource Loading", "font-size: 16px; font-weight: bold; color: #2196F3;");
    console.table(
      this.metrics.resources.map((res) => ({
        Resource: res.name,
        Type: res.type,
        Duration: `${res.duration}ms`,
        Size: `${(res.size / 1024).toFixed(1)}KB`,
      })),
    );
    console.groupEnd();

    console.group("%c📐 Layout Metrics", "font-size: 16px; font-weight: bold; color: #2196F3;");
    console.table({
      "Cumulative Layout Shift": this.metrics.layout.cumulativeLayoutShift,
    });
    console.groupEnd();

    console.groupEnd();

    // Return plain text version for non-console usage
    return `
    🔍 Browser Performance Report
    ===========================

    📊 Page Load Metrics
    ------------------
    Total Load Time: ${this.metrics.timing.totalLoadTime}ms
    DOM Content Loaded: ${this.metrics.timing.domContentLoaded}ms
    First Paint: ${this.metrics.timing.firstPaint}ms
    First Contentful Paint: ${this.metrics.timing.firstContentfulPaint}ms

    💾 Memory Usage
    -------------
    Used JS Heap: ${this.metrics.memory.usedJSHeapSize}MB
    Total JS Heap: ${this.metrics.memory.totalJSHeapSize}MB
    JS Heap Limit: ${this.metrics.memory.jsHeapSizeLimit}MB

    📦 Resource Loading
    -----------------
    ${this.metrics.resources
      .map((res) => `${res.name} (${res.type}): ${res.duration}ms, ${(res.size / 1024).toFixed(1)}KB`)
      .join("\n    ")}

    📐 Layout Metrics
    ---------------
    Cumulative Layout Shift: ${this.metrics.layout.cumulativeLayoutShift}
    `;
  }
}

(window as any).BrowserPerformanceTest = BrowserPerformanceTest;

export default BrowserPerformanceTest;
