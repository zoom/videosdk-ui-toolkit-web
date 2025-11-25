/**
 * PEPC (Privacy Enhanced Participant Consent) feature detection utilities
 * https://github.com/WICG/PEPC/blob/main/explainer.md
 * PEPC is available in Chrome 121.0.6136 or higher
 */

import { detectBrowser } from "./platform";

/**
 * Checks if the current browser supports PEPC features
 * Uses lightweight feature detection as recommended in the spec
 */
export function isPEPCSupported(): boolean {
  if (
    "HTMLPermissionElement" in window &&
    typeof (window as any).HTMLPermissionElement.isTypeSupported === "function"
  ) {
    try {
      if (
        (window as any).HTMLPermissionElement.isTypeSupported("camera") ||
        (window as any).HTMLPermissionElement.isTypeSupported("microphone")
      ) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  return false;
}

/**
 * Checks if PEPC permission query with metadata is supported
 * This is the runtime check to confirm PEPC is actually available
 */
export async function canUsePEPCPermissionQuery(): Promise<boolean> {
  // PEPC is Chrome-only, return false immediately for other browsers
  const browser = detectBrowser();

  if (browser.name !== "chrome") {
    return false;
  }

  // First check if browser supports PEPC at all
  const isSupported = isPEPCSupported();

  if (!isSupported) {
    return false;
  }

  try {
    // Try to query permissions to see if PEPC is actually available
    await navigator.permissions.query({
      name: "camera" as PermissionName,
    });

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if camera and/or microphone permissions are already granted
 * Returns an object with the grant status for each permission
 */
export async function checkExistingPermissions(): Promise<{
  camera: boolean;
  microphone: boolean;
}> {
  const result = {
    camera: false,
    microphone: false,
  };

  try {
    // Use standard permission query
    const cameraStatus = await navigator.permissions.query({
      name: "camera" as PermissionName,
    });
    result.camera = cameraStatus.state === "granted";

    const microphoneStatus = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    result.microphone = microphoneStatus.state === "granted";
  } catch (error) {
    // If permission query fails, assume no permissions granted
    // eslint-disable-next-line no-console
    console.warn("Failed to check existing permissions:", error);
  }

  return result;
}
