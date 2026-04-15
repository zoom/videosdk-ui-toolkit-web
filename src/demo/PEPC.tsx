import React, { useState, useEffect, useCallback } from "react";
import { Camera, Clock, RefreshCcw } from "lucide-react";

//https://github.com/WICG/PEPC/blob/main/explainer.md
interface AlertProps {
  children: React.ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}

const AlertTitle = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const AlertDescription = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const Alert = ({ children, variant = "default", className = "" }: AlertProps) => {
  return <div className={className}>{children}</div>;
};

interface PermissionStatusState {
  state: PermissionState;
  expires: Date | null;
  lastChecked: Date | null;
}

const PEPCHandler = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatusState>({
    state: "prompt",
    expires: null,
    lastChecked: null,
  });
  const [error, setError] = useState("");

  const checkPermissionStatus = useCallback(async () => {
    try {
      // Using the proposed PEPC API
      const status = await navigator.permissions.query({
        name: "camera" as PermissionName,
        // @ts-expect-error - PEPC API is experimental
        metadata: {
          requestExpiry: true,
        },
      });

      // Listen for permission changes
      status.addEventListener("change", () => {
        updatePermissionStatus(status);
      });

      // Update initial status
      updatePermissionStatus(status);
    } catch (err) {
      setError("Error checking permission status");

      console.error(err);
    }
  }, []);

  useEffect(() => {
    checkPermissionStatus();
  }, [checkPermissionStatus]);

  const updatePermissionStatus = (status) => {
    setPermissionStatus({
      state: status.state,
      // Check if expiration info is available (PEPC feature)
      expires: status.expires ? new Date(status.expires) : null,
      lastChecked: new Date(),
    });
  };

  const requestPermission = async () => {
    try {
      setError("");
      // Request with proposed lifetime parameter
      const result = await navigator.mediaDevices.getUserMedia({
        video: true,
        // @ts-expect-error - PEPC API is experimental
        permissionLifetime: {
          duration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
          oneTime: false,
        },
      });

      // Stop tracks immediately as we only want the permission
      result.getTracks().forEach((track) => track.stop());

      // Refresh status after request
      await checkPermissionStatus();
    } catch (err) {
      setError("Error requesting permission");

      console.error(err);
    }
  };

  const formatExpiry = (date: Date | null) => {
    if (!date) return "Not set";
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  const formatLastChecked = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    return `${seconds} seconds ago`;
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">PEPC Permission Demo</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Camera
              className={
                permissionStatus.state === "granted"
                  ? "text-green-500"
                  : permissionStatus.state === "denied"
                    ? "text-red-500"
                    : "text-yellow-500"
              }
            />
            <div>
              <p className="font-medium">Camera</p>
              <p className="text-sm text-gray-500 capitalize">{permissionStatus.state}</p>
            </div>
          </div>

          {permissionStatus.state !== "granted" && (
            <button
              onClick={requestPermission}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Request (24h)
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Expires: {formatExpiry(permissionStatus.expires)}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <RefreshCcw className="w-4 h-4" />
            <span>Last checked: {formatLastChecked(permissionStatus.lastChecked)}</span>
          </div>
        </div>

        <button
          onClick={checkPermissionStatus}
          className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Check Status</span>
        </button>
      </div>
    </div>
  );
};

export default PEPCHandler;
