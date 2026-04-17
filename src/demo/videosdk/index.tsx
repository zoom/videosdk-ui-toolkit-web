import { useCallback, useEffect, useState } from "react";
import NavHeader from "./NavHeader";
import NavLinks from "../NavLinks";
import NavVideoSDK from "./NavVideoSDK";
import "../../index.css";
import "../../components/theme/theme.css";
import "../../i18n";
import { getBrowserTheme } from "@/components/util/platform";

export default function VideoDemoHome() {
  const [sdkKey, setSdkKey] = useState("");
  const [sdkSecret, setSdkSecret] = useState("");
  const [themeName, setThemeName] = useState("light");

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") || getBrowserTheme();
    localStorage.setItem("theme", currentTheme);
    document.documentElement.setAttribute("zoom-data-theme", currentTheme);
    if (currentTheme !== themeName) {
      setThemeName(currentTheme);
    }
  }, [setThemeName, themeName]);

  const toggleTheme = () => {
    const newTheme = themeName === "light" ? "dark" : "light";

    if (newTheme !== themeName) {
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("zoom-data-theme", newTheme);
      setThemeName(newTheme);
    }
  };

  useEffect(() => {
    const sdkKey = localStorage.getItem("sdkKey");
    const sdkSecret = localStorage.getItem("sdkSecret");
    setSdkKey(sdkKey || "");
    setSdkSecret(sdkSecret || "");
  }, []);

  const setSdkKeyCallback = useCallback((sdkKey: string) => {
    setSdkKey(sdkKey);
    localStorage.setItem("sdkKey", sdkKey);
  }, []);

  const setSdkSecretCallback = useCallback((sdkSecret: string) => {
    setSdkSecret(sdkSecret);
    localStorage.setItem("sdkSecret", sdkSecret);
  }, []);

  return (
    <div className="zoom-ui-toolkit-root">
      <div
        className="custom-container overflow-y-auto sm:h-auto bg-theme-surface text-theme-text border border-theme-border"
        style={{ height: "100vh", width: "100vw" }}
      >
        <NavHeader
          sdkKey={sdkKey}
          sdkSecret={sdkSecret}
          setSdkKey={setSdkKeyCallback}
          setSdkSecret={setSdkSecretCallback}
          toggleTheme={toggleTheme}
          themeName={themeName}
        />
        <NavLinks />
        <NavVideoSDK sdkKey={sdkKey} sdkSecret={sdkSecret} setSdkKey={setSdkKeyCallback} />
      </div>
    </div>
  );
}
