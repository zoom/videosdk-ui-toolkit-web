import { CustomizationOptions, Participant, UIkitFeature } from "@/types";
import { KJUR } from "jsrsasign";

// eslint-disable-next-line max-params
export function generateVideoToken(
  sdkKey: string,
  sdkSecret: string,
  topic: string,
  sessionKey = "",
  userIdentity = "",
  roleType = 1,
  cloud_recording_option = "",
  cloud_recording_election = "",
  telemetry_tracking_id = "",
  audio_compatible_mode = 0,
  video_webrtc_mode = 1,
) {
  let signature = "";
  try {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;

    // Header
    const oHeader = { alg: "HS256", typ: "JWT" };
    // Payload
    const oPayload = {
      app_key: sdkKey,
      iat,
      exp,
      tpc: topic,
      role_type: roleType,
    };
    if (cloud_recording_election === "" && cloud_recording_option === "1") {
      Object.assign(oPayload, {
        cloud_recording_option: 1,
      });
    } else {
      Object.assign(oPayload, {
        cloud_recording_option: parseInt(cloud_recording_option, 10),
        cloud_recording_election: parseInt(cloud_recording_election, 10),
      });
    }
    if (sessionKey) {
      Object.assign(oPayload, { session_key: sessionKey });
    }
    if (userIdentity) {
      Object.assign(oPayload, { user_identity: userIdentity });
    }

    if (telemetry_tracking_id) {
      Object.assign(oPayload, { telemetry_tracking_id });
    }
    if (audio_compatible_mode) {
      Object.assign(oPayload, { audio_compatible_mode: Number(audio_compatible_mode) });
    }

    if (video_webrtc_mode) {
      Object.assign(oPayload, { video_webrtc_mode: Number(video_webrtc_mode) });
    }

    // Sign JWT
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return signature;
}

export function isShallowEqual(objA: any, objB: any) {
  if (objA === objB) {
    return true;
  }

  if (!objA || !objB) {
    return false;
  }

  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);
  const len = aKeys.length;

  if (bKeys.length !== len) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    const key = aKeys[i];

    if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
  }

  return true;
}

export function isArrayShallowEqual(arrayA: Array<any>, arrayB: Array<any>) {
  const len = arrayA.length;
  if (arrayB.length !== len) {
    return false;
  }
  for (let i = 0; i < len; i++) {
    if (!isShallowEqual(arrayA[i], arrayB[i])) {
      return false;
    }
  }
  return true;
}

export function b64EncodeUnicode(str: any) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
      return String.fromCharCode(("0x" + p1) as any);
    }),
  );
}

export function b64DecodeUnicode(str: any) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
}

export function loadExternalResource(url: string, type: "script" | "style") {
  return new Promise((resolve, reject) => {
    let element: HTMLScriptElement | HTMLLinkElement | undefined;
    if (type === "script") {
      element = document.createElement("script");
      element.src = url;
      element.async = true;
      element.type = "text/javascript";
    } else if (type === "style") {
      element = document.createElement("link");
      element.href = url;
      element.rel = "stylesheet";
    }
    if (element) {
      if ((element as any).readyState) {
        (element as any).onreadystatechange = () => {
          if ((element as any).readyState === "loaded" || (element as any).readyState === "complete") {
            (element as any).onreadystatechange = null;
            resolve("");
          }
        };
      } else {
        element.onload = () => {
          resolve("");
        };
        element.onerror = () => {
          reject(new Error(""));
        };
      }
      if (typeof document.body.append === "function") {
        document.getElementsByTagName("head")[0].append(element);
      } else {
        document.getElementsByTagName("head")[0].appendChild(element);
      }
    } else {
      reject(new Error(""));
    }
  });
}

export function parseJwt(token: string) {
  // eslint-disable-next-line prefer-destructuring
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

export const decodeJWTPlayload = (token: string) => {
  // eslint-disable-next-line prefer-destructuring
  const payloadStr = token.split(".")[1];
  if (typeof payloadStr === "string") {
    let output = payloadStr.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += "==";
        break;
      case 3:
        output += "=";
        break;
      default:
        throw new Error("base64 string is not of the correct length");
    }
    try {
      const jsonPayload = decodeURIComponent(
        window.atob(output).replace(/(.)/g, function (_m, p) {
          let code = p.charCodeAt(0).toString(16).toUpperCase();
          if (code.length < 2) {
            code = "0" + code;
          }
          return "%" + code;
        }),
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Invalid token specified: invalid base64");
    }
  }
};

export const isValidUrl = (url: string | null): boolean => {
  if (!url) return true; // null is considered valid
  try {
    const urlObj = new URL(url);
    // Only allow specific protocols
    return urlObj.protocol === "https:" || urlObj.protocol === "http:";
  } catch {
    return false;
  }
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const getInitialsFirstLetter = (name: string, length = 2): string => {
  return name
    .split(" ")
    .slice(0, length) // Take only first two words
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

export const truncateName = (name: string, length = 5) => {
  return name.length > length ? `${name.substring(0, length)}` : name;
};

export const isShowAvatar = (_participant: Participant, _currentUser: Participant, _avatarUrl: string) => {
  return false;
  // return (participant?.userId === currentUser?.userId && avatarUrl) || participant?.avatar;
};

export const checkIsFeatureEnable = (
  userConfig: CustomizationOptions["featuresOptions"],
  enabledConfig: CustomizationOptions["featuresOptions"],
  feature: UIkitFeature,
) => {
  if (userConfig && enabledConfig && userConfig[feature]?.enable && enabledConfig[feature]?.enable) {
    return true;
  }
  return false;
};

export const getRemoteControlEnabled = (featuresOptions?: CustomizationOptions["featuresOptions"]) => {
  if (!featuresOptions) return false;

  const { remoteControl } = featuresOptions as unknown as { remoteControl?: unknown };
  if (!remoteControl || typeof remoteControl !== "object") return false;

  const { enable } = remoteControl as { enable?: unknown };
  return Boolean(enable);
};
