/**
 * Modern browser and OS detection utilities
 * Uses a combination of modern APIs and user agent parsing as fallback
 */

type WindowsVersion = {
  [key: string]: string;
};

type BrowserInfo = {
  name: string;
  version: string;
};

type SystemInfo = {
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  mobile: boolean;
  cookiesEnabled: boolean;
  language: string;
  vendor: string;
  platform: string;
  screenResolution: {
    width: number;
    height: number;
  };
  devicePixelRatio: number;
  touchSupport: boolean;
  darkMode: boolean;
  online: boolean;
  memory?: number;
};

/**
 * Detects iOS version from user agent string
 * @param userAgent The user agent string to parse
 * @returns {string} The iOS version or empty string if not found
 */
function getiOSVersion(userAgent: string): string {
  const match = userAgent.match(/(?:iPhone|CPU) OS (\d+[._]\d+[._]?\d*)/);
  if (match) {
    return match[1].replace(/_/g, ".");
  }
  return "";
}

/**
 * Detects the operating system and version using modern platform APIs with user agent fallback
 * @returns {[string, string]} Tuple of [OS name, OS version]
 */
export function detectOS(): [string, string] {
  const userAgent = navigator.userAgent || "";
  let osName = "Unknown OS";
  let osVersion = "";

  // Check for iOS devices first
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    osName = "iOS";
    osVersion = getiOSVersion(userAgent);
    return [osName, osVersion];
  }

  // Check for Android
  const androidMatch = userAgent.match(/Android (\d+(\.\d+)*)/);
  if (androidMatch) {
    return ["Android", androidMatch[1]];
  }

  // Use modern UA Client Hints API
  if ("userAgentData" in navigator && (navigator.userAgentData as any)?.platform) {
    const modernPlatform = (navigator.userAgentData as any).platform.toLowerCase();
    if (modernPlatform.includes("mac")) return ["macOS", ""];
    if (modernPlatform.includes("win")) return ["Windows", ""];
    if (modernPlatform.includes("linux")) return ["Linux", ""];
  }

  // Desktop OS checks
  if (/Mac OS X/.test(userAgent)) {
    const macMatch = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
    return ["macOS", macMatch ? macMatch[1].replace(/_/g, ".") : ""];
  }

  if (/Win/.test(navigator.platform || "")) {
    const windowsVersion: WindowsVersion = {
      "Windows NT 10.0": "Windows 10/11",
      "Windows NT 6.3": "Windows 8.1",
      "Windows NT 6.2": "Windows 8",
      "Windows NT 6.1": "Windows 7",
      "Windows NT 6.0": "Windows Vista",
      "Windows NT 5.2": "Windows Server 2003/XP x64",
      "Windows NT 5.1": "Windows XP",
      "Windows NT 5.0": "Windows 2000",
    };

    for (const [key, value] of Object.entries(windowsVersion)) {
      if (userAgent.includes(key)) return [value, key.replace("Windows NT ", "")];
    }
    return ["Windows", ""];
  }

  if (/Linux/.test(navigator.platform || "")) {
    return ["Linux", ""];
  }

  return [osName, osVersion];
}

/**
 * Detects the browser and its version using modern APIs with user agent fallback
 * @returns {BrowserInfo} Object containing browser name and version
 */
export function detectBrowser(): BrowserInfo {
  const result: BrowserInfo = {
    name: "unknown",
    version: "unknown",
  };

  const userAgent = navigator.userAgent.toLowerCase();

  // Try modern User-Agent Client Hints API first
  if ("userAgentData" in navigator && (navigator.userAgentData as any)?.brands) {
    const { brands } = navigator.userAgentData as any;
    // Check if Chromium or Chrome is in the brands list
    const chromeBrand = brands.find((b) => b.brand === "Chromium" || b.brand === "Google Chrome");
    if (chromeBrand) {
      result.name = "chrome";
      result.version = chromeBrand.version;
      return result;
    }
    const brand = brands.find((b) => !b.brand.includes("Not") && !b.brand.includes("Brand") && b.brand !== "Chromium");
    if (brand) {
      result.name = brand.brand.toLowerCase();
      result.version = brand.version;
      return result;
    }
  }

  // Browser detection patterns
  const browsers = [
    { name: "chrome ios", pattern: /crios\/(\d+(\.\d+)*)/ },
    { name: "firefox ios", pattern: /fxios\/(\d+(\.\d+)*)/ },
    { name: "edge", pattern: /edg(?:e|ios|a)\/(\d+(\.\d+)*)/ },
    { name: "chrome", pattern: /chrome\/(\d+(\.\d+)*)/ },
    { name: "firefox", pattern: /firefox\/(\d+(\.\d+)*)/ },
    { name: "safari", pattern: /version\/(\d+(\.\d+)*).+safari/ },
    { name: "opera", pattern: /(?:opera|opr)\/(\d+(\.\d+)*)/ },
  ];

  for (const browser of browsers) {
    const match = userAgent.match(browser.pattern);
    if (match) {
      result.name = browser.name;
      // eslint-disable-next-line prefer-destructuring
      result.version = match[1];
      break;
    }
  }

  // Special case for Safari without explicit version
  if (
    result.name === "unknown" &&
    /safari/.test(userAgent) &&
    !/chrome|chromium|crios|fxios|edge|edg/.test(userAgent)
  ) {
    result.name = "safari";
    const match = userAgent.match(/safari\/(\d+(\.\d+)*)/);
    result.version = match ? match[1] : "unknown";
  }

  return result;
}

/**
 * Gets comprehensive browser and system information
 * @returns {SystemInfo} Object containing detailed browser and system information
 */
export function getSystemInfo(): SystemInfo {
  const [os, osVersion] = detectOS();
  const browser = detectBrowser();

  const systemInfo: SystemInfo = {
    os,
    osVersion,
    browser: browser.name,
    browserVersion: browser.version,
    mobile:
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      ("userAgentData" in navigator && (navigator.userAgentData as any)?.mobile),
    cookiesEnabled: navigator.cookieEnabled,
    language: navigator.language,
    vendor: navigator.vendor,
    platform: navigator.platform,
    screenResolution: {
      width: window.screen.width,
      height: window.screen.height,
    },
    devicePixelRatio: window.devicePixelRatio || 1,
    touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    darkMode: window.matchMedia?.("(prefers-color-scheme: dark)").matches,
    online: navigator.onLine,
  };

  // Add memory info if available
  if ("memory" in navigator) {
    systemInfo.memory = (navigator as any).memory?.jsHeapSizeLimit;
  }

  return systemInfo;
}

/**
 * Checks if the current environment is localhost
 */
export const isLocalhost = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);

/**
 * Checks if the browser supports modern User-Agent Client Hints API
 */
export const supportsUserAgentData = "userAgentData" in navigator;

export function getExploreName() {
  const { browser, os, browserVersion } = getSystemInfo();
  return `${os}/${browser}${browserVersion}/${Math.floor(Math.random() * 1000)}`;
}

export function isSupportWebCodecs() {
  return typeof (window as any).MediaStreamTrackProcessor === "function";
}

function isIPad(): boolean {
  const { userAgent } = navigator;
  // Check for "iPad" in the user agent string
  if (/iPad/.test(userAgent)) {
    return true;
  }

  // Check for "Macintosh" and "Safari" in the user agent string
  // This is necessary for newer iPadOS versions that report as Mac
  if (/Macintosh/.test(userAgent) && /Safari/.test(userAgent)) {
    // Check if touch events are supported
    return "ontouchend" in document;
  }

  return false;
}

export const isIOSMobile = () => {
  const { userAgent } = navigator;
  const isIOS = /iPad|iPhone|iPod/i.test(userAgent);
  return isIOS || isIPad();
};

export function isAndroidBrowser() {
  return /android/i.test(navigator.userAgent);
}
export function isAndroidOrIOSBrowser() {
  return isAndroidBrowser() || isIOSMobile();
}
class OffscreenCanvasCapability {
  private value!: boolean;
  public get isSupported() {
    if (this.value === undefined) {
      const isOffscreenCanvas = typeof (window as any).OffscreenCanvas === "function";
      if (isOffscreenCanvas) {
        const canvas = new (window as any).OffscreenCanvas(1, 1);
        canvas.addEventListener("webglcontextlost", (event: any) => {
          event.preventDefault();
        });
        this.value = !!canvas.getContext("webgl");
      } else {
        this.value = false;
      }
    }
    return this.value;
  }
}
const offscreenCanvasCapality = new OffscreenCanvasCapability();
export function isSupportOffscreenCanvas() {
  return offscreenCanvasCapality.isSupported;
}

export const getBrowserTheme = () => {
  // Check if browser supports theme detection
  if (window.matchMedia) {
    // Check if user prefers dark theme
    const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Get current preference
    const isDarkTheme = darkThemeQuery.matches;

    // Return theme string
    return isDarkTheme ? "dark" : "light";
  }

  // Fallback for browsers that don't support theme detection
  return "light";
};
