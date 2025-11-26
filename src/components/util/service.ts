import { Participant } from "../../types";
import i18n from "i18next";

export const UIKIT_VERSION = process.env.UIKIT_VERSION.replace(/"/g, "");
export const TAILWIND_VERSION = process.env.TAILWIND_VERSION.replace(/"/g, "").replace("^", "");
const baseUrl = "zoom.us";
export let ZOOM_GLOBAL_IMAGE = `https://source.${baseUrl}/uitoolkit/image`;
if (process.env.NODE_ENV === "development") {
  ZOOM_GLOBAL_IMAGE = `${window.location.origin}/image`;
}

export function getDisplayNameLabel(user: Participant, currentUserId: number, isGuest: boolean) {
  const rules = [
    {
      test: (user: Participant) => user.isHost,
      label: `(${i18n.t("wc_host")})`,
    },
    {
      test: (user: Participant) => user.isManager,
      label: i18n.t("wc_manager"),
    },
    {
      test: (user: Participant, currentUserId: number) => {
        return user.userId === currentUserId;
      },
      label: i18n.t("wc_me"),
    },
  ];
  const suffix = rules
    .map((rule) => {
      if (rule.test(user, currentUserId)) {
        return rule.label;
      }
      return undefined;
    })
    .filter(Boolean)
    .join(", ");
  return suffix ? `${suffix}`.replace("）, （", ", ").replace("), (", ", ").replace("（", "(").replace("）", ")") : "";
}

export function getAvatarUrl(url: string) {
  let ret = "";
  if (url) {
    const aUrl = /^https?:\/\//.test(url) ? url : `https://${url}`;
    const { hostname } = new URL(aUrl);
    if ((window as any).crossOriginIsolated) {
      if (hostname.indexOf("zoom") > -1) {
        ret = aUrl;
      }
    } else {
      ret = aUrl;
    }
  }
  return ret;
}

export function toLocalDateStr(timeStamp: number) {
  const date = new Date(timeStamp);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toJSON().slice(11, 19);
}

const stringformat = function (tmpString: string, args: object) {
  return tmpString.replace(/{(\d+)}/g, (match: any, number: any) =>
    typeof args[number] !== "undefined" ? args[number] : match,
  );
};

export function getJoinUrlFromInviteEmail(content: string, meetingNumber: number) {
  const matcher = content.match(/https?:\/\/((?!(\\r|\\n)+).)+/g);
  return matcher?.find((m) => m.indexOf(`${meetingNumber}`) > -1 || m.indexOf("/my/") > -1);
}

export const getCustomizeJoinUrl = () => {
  return {
    joinURL: "joinURL",
    invitePwd: "invitePwd",
  };
};

export const ariaNotifier = document.getElementById("aria-notify-area");
const stringFormat = (source: string, ...params: any) =>
  params.reduce((s: string, val: string, index: number) => s.replace(new RegExp(`\\{${index}\\}`, "g"), val), source);

export const isEdge = () => /edge\/(\d+)/i.test(navigator.userAgent) || /edg\/(\d+)/i.test(navigator.userAgent);

export const isOpera = () => /opera|opr\/[\d]+/i.test(navigator.userAgent);

export const isFirefox = () => /firefox/i.test(navigator.userAgent);

export function isIPad(): boolean {
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

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);

  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

export function hideEmail(email: any) {
  if (typeof email !== "string" && email.indexOf("@") === -1) return "";
  const [mailName, mailDomain] = email.split("@");
  const hideName = mailName.substr(0, 3);
  return `${hideName}***@${mailDomain}`;
}

export const isChromeOS = () => /\bCrOS\b/.test(navigator.userAgent);

export const isGoogleNest = () => /\bCrKey\b/.test(navigator.userAgent);

export const isChrome = () => {
  const { userAgent } = navigator;
  return !isOpera() && !isEdge() && /chrome/i.test(userAgent) && /webkit/i.test(userAgent);
};

export const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const isIE = () => !isOpera() && /(msie|trident)/i.test(navigator.userAgent);

export const isSupportAudioWorklet = () => typeof AudioWorklet === "function";

export const isDeviceLessPerformant = () => !!(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

export const isSafariOnIOS = () => {
  const { userAgent } = navigator;
  const isIOS = /iPad|iPhone|iPod/i.test(userAgent);
  return isIOS || isIPad();
};
export function detectIEVersion() {
  const ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  const msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    // IE 10 or older => return version number
    return `ie/${parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10)}`;
  }

  const trident = ua.indexOf("Trident/");
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf("rv:");
    return `ie/${parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10)}`;
  }

  const edge = ua.indexOf("Edge/");
  const chromiumEdge = ua.indexOf("Edg/");

  if (chromiumEdge > 0) {
    // Chromium-based Edge => return version number
    return `edge/${parseInt(ua.substring(chromiumEdge + 4, ua.indexOf(".", chromiumEdge)), 10)}`;
  }
  if (edge > 0) {
    // Legacy Edge => return version number
    return `edge/${parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10)}`;
  }

  // other browser
  return false;
}

export function getBrowserInfo() {
  const agent = navigator.userAgent.toLowerCase();

  const regStrFF = /firefox\/[\d.]+/gi;
  const regStrChrome = /chrome\/[\d.]+/gi;
  const regStrChrome2 = /ipad; cpu os (\d+_\d+)/gi;
  const regStrSaf = /version\/[\d.]+/gi;
  const regStrSaf2 = /safari\/[\d.]+/gi;

  const regStrOpr = /opr\/[\d.]+/gi;

  // firefox
  if (agent.indexOf("firefox") > 0) {
    return agent?.match(regStrFF)?.toString();
  }

  // "mozilla/5.0 (macintosh; intel mac os x 10_13_6) applewebkit/605.1.15 (khtml, like gecko) version/12.0.1 safari/605.1.15"
  if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
    let tmpInfo: any;
    tmpInfo = "safari/unknow";
    let tmpInfo2;
    if (agent.indexOf("ipad") > 0) {
      tmpInfo = agent?.match(regStrChrome2)?.toString().replace("ipad; cpu os ", "ipados/");
    } else {
      tmpInfo = agent.match(regStrSaf);
      tmpInfo2 = agent.match(regStrSaf2);
      if (tmpInfo) {
        tmpInfo = tmpInfo.toString().replace("version", "safari");
      }
      if (tmpInfo2) {
        tmpInfo = tmpInfo2.toString().replace("version", "safari");
      }
    }
    return tmpInfo;
  }

  // "mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/70.0.3538.102 safari/537.36 opr/57.0.3098.91"
  if (agent.indexOf(" opr") > 0) {
    let tmpInfo: any;
    tmpInfo = agent.match(regStrOpr);
    tmpInfo = tmpInfo.toString().replace("opr", "opera");
    return tmpInfo;
  }

  // IE / Edge
  const tmpIsIE = detectIEVersion();
  if (tmpIsIE) {
    return tmpIsIE;
  }

  // Chrome
  if (agent.indexOf("chrome") > 0) {
    return agent?.match(regStrChrome)?.toString();
  }

  return "other/";
}

export const isIpadOS = () => {
  const browserInfo = getBrowserInfo();
  const { userAgent } = navigator;
  let isIpad = false;
  let isIpadPro = false;

  // Check for iPad and iPad Pro
  if (/iPad/.test(userAgent)) {
    isIpad = true;
    // Check for iPad Pro
    if (/iPad Pro/.test(userAgent)) {
      isIpadPro = true;
    }
  } else if (/Macintosh/.test(userAgent) && /Safari/.test(userAgent)) {
    // Check for newer iPadOS versions that report as Mac
    if ("ontouchend" in document) {
      isIpad = true;
      // For iPad Pro detection on newer iPadOS, we need to check screen size
      if (window.screen && window.screen.width >= 1024 && window.screen.height >= 1366) {
        isIpadPro = true;
      }
    }
  }

  return (isIpad || isIpadPro) && isSafari();
};

export function isAndroidBrowser() {
  return /android/i.test(navigator.userAgent);
}

export const isMobileDevice = (): boolean => {
  const isMobile =
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    isIPad() ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i);
  return Boolean(isMobile);
};

export const isMobileDeviceNotIpad = () => {
  // if ((isIpadOS || isAndroidBrowser()) && window?.innerWidth <= 768) {
  //   return true;
  // }
  return isMobileDevice() && !isIpadOS();
};

export function getDimension() {
  let dimension;
  if (isIPad() || isSafariOnIOS()) {
    dimension = {
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    };
  } else {
    dimension = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return dimension;
}

export function sortParticipantsList(users: any, currentUser: Participant | undefined) {
  const participants = users.reduce(
    (tmp: any, user: Participant) => {
      if (user.userId === currentUser?.userId) {
        tmp.me.push(user);
      } else if (user.isHost) {
        tmp.host.push(user);
      } else if (user.isManager) {
        tmp.coHost.push(user);
      }
      // else if (user.raiseHand) {
      //   tmp.raiseHands.push(user);
      // }
      else {
        tmp.other.push(user);
      }
      return tmp;
    },
    {
      me: [],
      host: [],
      coHost: [],
      raiseHands: [],
      other: [],
    },
  );
  return Object.keys(participants).reduce((tmp, userType) => tmp.concat(participants[userType]), []);
}
export function isLimitedSelfVideoMode() {
  return isAndroidBrowser() || typeof (window as any).OffscreenCanvas === "function";
}

export function setZoomImgPath(assetPath: string) {
  switch (assetPath) {
    case "CDN": {
      ZOOM_GLOBAL_IMAGE = `https://source.${baseUrl}/uikit/${UIKIT_VERSION}/image`;
      break;
    }
    case "Global": {
      break;
    }
    case "CN": {
      ZOOM_GLOBAL_IMAGE = `https://jssdk.zoomus.cn/uikit/${UIKIT_VERSION}/image`;
      break;
    }
    default: {
      ZOOM_GLOBAL_IMAGE = assetPath + "/../image";
    }
  }
}

export function getZoomImgPath() {
  return ZOOM_GLOBAL_IMAGE;
}

export function isSupportOpenMicWhenShareAudio() {
  return (
    window.JsMediaSDK_Instance &&
    window.JsMediaSDK_Instance?.util &&
    window.JsMediaSDK_Instance?.util?.isSupportOpenMicWhenShareAudio()
  );
}

/**
 * fork from https://github.com/IonicaBizau/regex-parser.js
 * @param input {string}
 * @returns {RegExp}
 */
const regexParser = (() => {
  const cacheRegExp = {};
  return (input) => {
    // Validate input
    if (typeof input !== "string") {
      return null;
    }

    if (!cacheRegExp[input]) {
      // Parse input
      const m = input.match(/(\/?)(.+)\1([a-z]*)/i);
      // Invalid flags
      if (m[3] && !/^(?!.*?(.).*?\1)[gmixXsuUAJ]+$/.test(m[3])) {
        cacheRegExp[input] = new RegExp(input);
      } else {
        // Create the regular expression
        cacheRegExp[input] = new RegExp(m[2], m[3]);
      }
    }
    return cacheRegExp[input];
  };
})();

export const isImageType = (type: string): boolean =>
  type === "image/jpg" ||
  type === "image/png" ||
  type === "image/jpeg" ||
  type === "image/gif" ||
  type === "image/webp";

export const isPortrait = () => {
  return window.innerHeight > window.innerWidth;
};

// const isPortrait = window.matchMedia("(orientation: portrait)").matches;

export const isLandscape = () => !isPortrait();

export const isMobilePortrait = () => isMobileDeviceNotIpad() && isPortrait();

export const isMobileLandscape = () => isMobileDeviceNotIpad() && isLandscape();

export const isSupportSecondMicrophone = (isJoinAudio: boolean) => {
  // return false;
  return !isMobileDevice() && isJoinAudio;
};

export const isSupportVideoPlayback = (isStartVideo: boolean) => {
  // return false;
  return !isMobileDevice() && isStartVideo;
};

export const isSupportAudioPlayback = (isStartAudio: boolean) => {
  // return false;
  return isSupportVideoPlayback(isStartAudio);
};
