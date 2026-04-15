// import uitoolkit from "/distTmp/videosdk-ui-toolkit.min.esm.js";
// https://obfuscator.io/#upload
function isIPad() {
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
function isMobileDevice() {
  const isMobile =
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    isIPad() ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i);
  return Boolean(isMobile);
}

const uitoolkit = window.UIToolkit;
const urlParams = new URLSearchParams(window.location.search);
const preSetSession = urlParams.get("session");
const preSetpasscode = urlParams.get("passcode");

const sessionContainer = document.getElementById("sessionContainer");

if (preSetSession) {
  // set session in inputs
  document.getElementById("sessionName").value = preSetSession;
}

if (preSetpasscode) {
  // set passcode in inputs
  if (preSetpasscode.length > 10) {
    document.getElementById("passcodeLength").style.display = "block";
  } else {
    document.getElementById("sessionPasscode").value = preSetpasscode;
  }
}

var authEndpoint = "https://or116ttpz8.execute-api.us-west-1.amazonaws.com/default/videosdk";

const dependentAssetsBasePath = (() => {
  const pathname = window.location.pathname || "/";
  if (pathname.endsWith("/")) return pathname;
  const lastSlash = pathname.lastIndexOf("/");
  return lastSlash >= 0 ? pathname.slice(0, lastSlash + 1) : "/";
})();
const dependentAssets = window.location.origin + dependentAssetsBasePath + "lib";

var config = {
  videoSDKJWT: "",
  sessionName: "",
  userName: "",
  sessionPasscode: "",
  features: ["preview", "video", "audio", "settings", "users", "chat", "share"],
  options: { init: {}, audio: {}, video: {}, share: {} },
  virtualBackground: {
    allowVirtualBackground: true,
    allowVirtualBackgroundUpload: true,
  },
  dependentAssets,
};

const sabIsDisabled = () => urlParams.get("sab") === "0";

const getVideoWebrtcMode = () => (sabIsDisabled() ? 1 : 0);

const sabSetDisabled = (disabled) => {
  const url = new URL(window.location.href);
  if (disabled) {
    url.searchParams.set("sab", "0");
  } else {
    url.searchParams.delete("sab");
  }
  window.location.href = url.toString();
};

const sabInitToggleButton = () => {
  const button = document.getElementById("sabToggleButton");
  if (!button) return;

  const disabled = sabIsDisabled();
  button.type = "button";
  button.hidden = false;
  button.textContent = disabled ? "Turn on" : "Turn off";
  button.title = disabled
    ? "Reload with SharedArrayBuffer enabled (default)"
    : "Reload with SharedArrayBuffer disabled (sab=0)";

  button.classList.toggle("status-enabled", disabled);
  button.classList.toggle("status-disabled", !disabled);

  button.onclick = () => sabSetDisabled(!disabled);
};

sabInitToggleButton();

window.getVideoSDKJWT = getVideoSDKJWT;

document.addEventListener("DOMContentLoaded", function () {
  checkSABSupport();
});

function checkSABSupport() {
  const statusElements = {
    sab: document.getElementById("sabStatus"),
    videoSharing: document.getElementById("videoSharingStatus"),
  };

  const updateStatus = (isEnabled) => {
    const status = isEnabled ? "enabled" : "disabled";
    const className = `status-${status}`;

    Object.values(statusElements).forEach((element) => {
      element.textContent = status;
      element.className = className;
    });
  };

  try {
    // Check if SharedArrayBuffer is available and can be instantiated
    if (typeof SharedArrayBuffer === "function") {
      new SharedArrayBuffer(1);
      updateStatus(true);
    } else {
      throw new Error("SharedArrayBuffer is not available");
    }
  } catch (e) {
    updateStatus(false);
  }
}

function getVideoSDKJWT() {
  // Reset error messages
  const errorElements = document.querySelectorAll(".error");
  errorElements.forEach((el) => (el.style.display = "none"));
  document.getElementById("rating").style.display = "none";

  config.userName = document.getElementById("yourName").value.trim();
  config.sessionName = document.getElementById("sessionName").value.trim();
  config.sessionPasscode = document.getElementById("sessionPasscode").value.trim();

  let hasError = false;

  if (!config.userName) {
    document.getElementById("nameRequired").style.display = "block";
    hasError = true;
  }

  if (!config.sessionName) {
    document.getElementById("sessionNameRequired").style.display = "block";
    hasError = true;
  }

  if (config.sessionPasscode.length > 10) {
    document.getElementById("passcodeLength").style.display = "block";
    hasError = true;
  }

  if (!hasError) {
    const joinButton = document.querySelector(".join-flow button");
    joinButton.disabled = true;
    joinButton.textContent = "Joining...";

    fetch(authEndpoint, {
      method: "POST",
      body: JSON.stringify({
        sessionName: config.sessionName,
        role: parseInt(document.getElementById("role").value),
        video_webrtc_mode: getVideoWebrtcMode(),
        telemetryTrackingId: `react-ui-toolkit-${config.sessionName}-${config.userName}-${Date.now()}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        config.videoSDKJWT = data.signature;
        joinSession();
      })
      .catch((error) => {
        console.error(error);
        joinButton.disabled = false;
        joinButton.textContent = "Join Session";
        alert("Failed to join session. Please try again.");
      });
  }
}

function joinSession() {
  const newConfig = uitoolkit.migrateConfig(config);

  uitoolkit.joinSession(sessionContainer, newConfig);
  sessionContainer.style.display = "flex";

  document.getElementById("header").style.display = "none";
  document.getElementById("join-flow").style.display = "none";

  uitoolkit.onSessionJoined(sessionJoined);
  uitoolkit.onSessionClosed(sessionClosed);
  uitoolkit.onSessionDestroyed(sessionDestroyed);
}

var sessionTimer;
var sessionTimeout = 10 * 60 * 1000; // 10 minutes in milliseconds
var warningTime = 9 * 60 * 1000; // 9 minutes - shows warning with 1 minute remaining

var sessionJoined = () => {
  console.log("session joined");

  var zoomdevDomain = "zoomdev.us";
  var videoSdkDomain = "videosdk.dev";
  var currentDomain = window.location.hostname;
  var isInternalTesting =
    currentDomain === zoomdevDomain ||
    currentDomain === videoSdkDomain ||
    currentDomain.endsWith("." + zoomdevDomain) ||
    currentDomain.endsWith("." + videoSdkDomain);
  if (!isInternalTesting) {
    // Start the session timer
    sessionTimer = setTimeout(() => {
      console.log("Session timeout - leaving session");
      uitoolkit.leaveSession();
    }, sessionTimeout);

    // Set warning timer
    setTimeout(() => {
      alert("Warning: You demo session will timeout in 1 minute!");
    }, warningTime);
  }
};

// Check for debug parameter in URL
const debugParam = urlParams.get("debug");

if (isMobileDevice() && debugParam === "1") {
  const vConsole = new VConsole();
}

var sessionClosed = () => {
  console.log("session closed");
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
  document.getElementById("header").style.display = "block";
  document.getElementById("join-flow").style.display = "block";
  document.getElementById("rating").style.display = "block";
  const joinButton = document.querySelector(".join-flow button");
  joinButton.disabled = false;
  joinButton.textContent = "Join Session";
};

var sessionDestroyed = () => {
  console.log("session destroyed");
  uitoolkit.destroy();
  sessionContainer.style.display = "none";
};
