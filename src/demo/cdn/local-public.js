// import uitoolkit from "/distTmp/videosdk-ui-toolkit.min.esm.js";
// https://obfuscator.io/ Obfuscator
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

function makeUniqueSessionName(base) {
  const suffix = Math.floor(10000 + Math.random() * 900000);
  return `${base}-${suffix}`;
}

const uitoolkit = window.UIToolkit;
const urlParams = new URLSearchParams(window.location.search);
const preSetSession = urlParams.get("session");
const preSetpasscode = urlParams.get("passcode");
const isParticipant = !!preSetSession;
const ROLE_HOST = 1;
const ROLE_USER = 0;

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

var audioVideoPlaybacks = [
  { title: "None", url: "" },
  { title: "ZOOM ZWA", url: "https://source.zoom.us/brand/mp4/Using%20the%20Zoom%20PWA.mp4" },
  { title: "ZOOM Cares", url: "https://source.zoom.us/brand/mp4/Zoom%20Cares%20Nonprofit%20Impact.mp4" },
  {
    title: "ZOOM One video",
    url: "https://source.zoom.us/brand/mp4/Zoom%20One%20-%20Team%20Chat%2C%20Phone%2C%20Email%2C%20and%20more.mp4",
  },
];

var authEndpoint = "https://or116ttpz8.execute-api.us-west-1.amazonaws.com/default/videosdk";
const dependentAssetsBasePath = (() => {
  const pathname = window.location.pathname || "/";
  if (pathname.endsWith("/")) return pathname;
  const lastSlash = pathname.lastIndexOf("/");
  return lastSlash >= 0 ? pathname.slice(0, lastSlash + 1) : "/";
})();
const dependentAssets = "https://us04st1.zoom.us/videosdk-uitoolkit/lib";
var config = {
  videoSDKJWT: "",
  sessionName: "",
  userName: "",
  sessionPasscode: "",
  featuresOptions: {
    invite: {
      inviteLink: "",
    },
    rawData: {
      enable: true,
      video: {
        enable: true,
        name: "watermark-processor",
        type: "video",
        url: "https://source.zoom.us/uitoolkit/processors/watermark-processor.js",
        title: "Watermark",
        options: {
          watermarkUrl: "https://source.zoom.us/uitoolkit/image/Zoom_Logo_Bloom_RGB.png",
          position: "bottom-right",
          opacity: 0.7,
          scale: 0.2,
        },
      },
      audio: {
        enable: true,
        name: "white-noise-processor",
        type: "audio",
        url: "https://source.zoom.us/uitoolkit/processors/white-noise-audio-processor.js",
        title: "White Noise",
        options: {},
      },
      share: {
        enable: true,
        name: "share-webgl-pii-processor",
        type: "share",
        url: "https://source.zoom.us/uitoolkit/processors/share-webgl-pii-processor.js",
        title: "WebGL PII Processor",
        options: {
          blurRegionNorm: {
            x: 0,
            y: 0,
            width: 1.0,
            height: 1.0,
          },
          blurRadius: 50,
        },
      },
    },
    playback: {
      enable: true,
      audioVideoPlaybacks: audioVideoPlaybacks,
    },
    feedback: {
      enable: true,
    },
  },
  virtualBackground: {
    allowVirtualBackground: true,
    allowVirtualBackgroundUpload: true,
  },
  dependentAssets,
};

const sabIsEnabled = () => urlParams.get("sab") === "1";

const getVideoWebrtcMode = () => (sabIsEnabled() ? 0 : 1);

const sabSetEnabled = (enabled) => {
  const url = new URL(window.location.origin + window.location.pathname);
  // Ensure path ends with index.html
  if (!url.pathname.endsWith("index.html")) {
    url.pathname = url.pathname.endsWith("/") ? url.pathname + "index.html" : url.pathname + "/index.html";
  }
  if (enabled) {
    url.searchParams.set("sab", "1");
  } else {
    url.searchParams.delete("sab");
  }
  window.location.href = url.toString();
};

const sabInitToggleButton = () => {
  const button = document.getElementById("sabToggleButton");
  if (!button) return;

  const enabled = sabIsEnabled();
  button.type = "button";
  button.hidden = false;
  button.textContent = enabled ? "Turn off" : "Turn on";
  button.title = enabled
    ? "Reload with SharedArrayBuffer disabled (default)"
    : "Reload with SharedArrayBuffer enabled (sab=1)";

  button.classList.toggle("status-enabled", enabled);
  button.classList.toggle("status-disabled", !enabled);

  button.onclick = () => sabSetEnabled(!enabled);
};

sabInitToggleButton();

window.getVideoSDKJWT = getVideoSDKJWT;

document.addEventListener("DOMContentLoaded", function () {
  checkSABSupport();
});

if (isParticipant) {
  document.getElementById("sessionName").value = preSetSession || "";
  document.getElementById("sessionPasscode").value = preSetpasscode || "";

  ["sessionName", "sessionPasscode"].forEach((id) => {
    const el = document.getElementById(id);
    el.readOnly = true;
    el.classList.add("disabled");
  });
}

function checkSABSupport() {
  const statusElements = {
    sab: document.getElementById("sabStatus"),
    webrtcVideo: document.getElementById("webrtcVideoStatus"),
  };

  const setStatus = (sabEnabled) => {
    statusElements.sab.textContent = sabEnabled ? "enabled" : "disabled";
    statusElements.sab.className = sabEnabled ? "status-enabled" : "status-disabled";
    statusElements.webrtcVideo.textContent = sabEnabled ? "disabled" : "enabled";
    statusElements.webrtcVideo.className = sabEnabled ? "status-disabled" : "status-enabled";
  };
  try {
    if (typeof SharedArrayBuffer === "function") {
      new SharedArrayBuffer(1);
      setStatus(true);
    } else {
      throw new Error("SharedArrayBuffer is not available");
    }
  } catch (e) {
    setStatus(false);
  }
}

function getVideoSDKJWT() {
  // Reset error messages
  const errorElements = document.querySelectorAll(".error");
  errorElements.forEach((el) => (el.style.display = "none"));
  document.getElementById("rating").style.display = "none";

  config.userName = document.getElementById("yourName").value.trim();
  config.sessionName = document.getElementById("sessionName").value.trim();
  if (!isParticipant) {
    config.sessionName = makeUniqueSessionName(config.sessionName);
    document.getElementById("sessionName").value = config.sessionName;
  }
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

    const role = isParticipant ? ROLE_USER : ROLE_HOST;
    let inviteLink = window.location.href;
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("session", encodeURIComponent(document.getElementById("sessionName").value));
    url.searchParams.set("passcode", encodeURIComponent(document.getElementById("sessionPasscode").value));
    if (sabIsEnabled()) {
      url.searchParams.set("sab", "1");
    }
    inviteLink = url.toString();
    config.featuresOptions.invite.inviteLink = inviteLink;

    fetch(authEndpoint, {
      method: "POST",
      body: JSON.stringify({
        sessionName: config.sessionName,
        role,
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
  console.log("old config", config);
  const newConfig = uitoolkit.migrateConfig(config);

  console.log("new config", newConfig);
  sessionContainer.style.display = "flex";
  uitoolkit.joinSession(sessionContainer, newConfig);

  document.getElementById("header").style.display = "none";
  document.getElementById("join-flow").style.display = "none";

  uitoolkit.onSessionJoined(sessionJoined);
  uitoolkit.onSessionClosed(sessionClosed);
  uitoolkit.on("user-added", onUserAddedCallback);
  uitoolkit.onSessionDestroyed(sessionDestroyed);
}

var onUserAddedCallback = (payload) => {
  const inSessionUsers = uitoolkit?.getAllUser();
  const isSelfNewUser = payload?.[0]?.userId === uitoolkit?.getCurrentUserInfo()?.userId;
  setTimeout(() => {
    if (isSelfNewUser && inSessionUsers.length > 4) {
      alert("Trail session only allows 4 users");

      console.log("Trail session only allows 4 users");
      uitoolkit.leaveSession();
    }
  }, 1000);
};

var sessionTimer;
var sessionTimeout = 10 * 60 * 1000; // 10 minutes in milliseconds
var warningTime = 9 * 60 * 1000; // 9 minutes - shows warning with 1 minute remaining

var sessionJoined = () => {
  console.log("session joined");
  // Start the session timer
  sessionTimer = setTimeout(() => {
    console.log("Session timeout - leaving session");
    uitoolkit.leaveSession();
  }, sessionTimeout);

  // Set warning timer
  setTimeout(() => {
    alert("Warning: You demo session will timeout in 1 minute!");
  }, warningTime);
};

if (isMobileDevice()) {
  const vConsole = new VConsole();
}

var sessionClosed = () => {
  console.log("session closed");
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
