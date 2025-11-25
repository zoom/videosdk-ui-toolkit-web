import React, { useEffect, useRef } from "react";

// Extend HTMLElement to include permission element properties
interface PermissionHTMLElement extends HTMLElement {
  type: string;
  permissionStatus: Promise<PermissionStatus>;
}

// Extend JSX IntrinsicElements to support the <permission> custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      permission: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          type: "camera" | "microphone" | "geolocation" | "camera microphone";
        },
        HTMLElement
      >;
    }
  }
}

interface PermissionElementProps {
  type: "camera" | "microphone" | "geolocation" | "camera microphone";
  onPermissionChange?: (state: PermissionState) => void;
  onPromptDismiss?: () => void;
  onPromptAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * PermissionElement for Chrome's PEPC API.
 *
 * Renders the native <permission> element which provides browser-native
 * permission requests with enhanced privacy controls (PEPC).
 *
 * This component should only be used when PEPC support has been detected.
 *
 * @see https://developer.chrome.com/blog/permission-element-origin-trial
 */
const PermissionElement: React.FC<PermissionElementProps> = ({
  type,
  onPermissionChange,
  onPromptDismiss,
  onPromptAction,
  className = "",
  style,
}) => {
  const permissionRef = useRef<PermissionHTMLElement>(null);

  useEffect(() => {
    const element = permissionRef.current;
    if (!element) return;

    const handlePromptDismiss = () => {
      onPromptDismiss?.();
    };

    const handlePromptAction = async () => {
      onPromptAction?.();

      if (onPermissionChange) {
        try {
          // Use the permission element's built-in permissionStatus property
          const permissionStatus = await element.permissionStatus;
          if (permissionStatus) {
            onPermissionChange(permissionStatus.state as PermissionState);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Error querying permission status:", error);
        }
      }
    };

    element.addEventListener("promptdismiss", handlePromptDismiss);
    element.addEventListener("promptaction", handlePromptAction);

    return () => {
      element.removeEventListener("promptdismiss", handlePromptDismiss);
      element.removeEventListener("promptaction", handlePromptAction);
    };
  }, [type, onPermissionChange, onPromptDismiss, onPromptAction]);

  return <permission ref={permissionRef} type={type} className={className} style={style} />;
};

export default PermissionElement;
