import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { isMobileDeviceNotIpad, isPortrait } from "../util/service";

interface InfoRowWithCopyProps {
  label: string;
  value?: string | null;
  isCopyable?: boolean;
}

export function InfoRowWithCopy({ label, value, isCopyable = false }: InfoRowWithCopyProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const handleCopy = async () => {
    if (value) {
      await navigator.clipboard.writeText(value);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  return (
    <div className="flex items-center">
      <span className="text-sm text-theme-text w-24">{label}</span>
      <div className="flex items-center justify-between flex-1">
        <span
          className={`font-medium text-ellipsis overflow-hidden whitespace-nowrap ${
            isMobileDeviceNotIpad() && isPortrait() ? "max-w-[150px]" : "max-w-[250px]"
          }`}
          title={value || ""}
        >
          {value || ""}
        </span>
        {isCopyable && (
          <button
            onClick={handleCopy}
            className="ml-2 p-2 rounded-full hover:bg-theme-background transition-colors focus:outline-none"
          >
            {copyState === "idle" ? (
              <Copy size={16} className="text-theme-text" />
            ) : (
              <Check size={16} className="text-green-500" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
