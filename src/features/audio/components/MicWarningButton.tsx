import React from "react";
import { MicOff, TriangleAlert } from "lucide-react";

export const MicWarningButton = () => {
  return (
    <div>
      <MicOff className="w-6 h-6 text-white" />
      <div className="absolute -bottom-1 -right-1">
        <div className="relative w-4 h-4">
          <div
            className="absolute inset-0 bg-yellow-300"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />
          <TriangleAlert className="absolute inset-0 w-full h-full" stroke="black" fill="none" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};

export default MicWarningButton;
