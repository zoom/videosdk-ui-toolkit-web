import React from "react";
import { Loader2 } from "lucide-react";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";

const LoadingScreen = () => {
  return (
    <div className={`${THEME_COLOR_CLASS} fixed inset-0 flex items-center justify-center`}>
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Joining Session</h2>
        <p className="">Please wait while we set up your connection...</p>
      </div>
    </div>
  );
};
export default LoadingScreen;
