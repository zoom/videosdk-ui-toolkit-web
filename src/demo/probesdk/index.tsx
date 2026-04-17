import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useProbe, ProbeProvider } from "@/features/setting/context/probe-context";

import CommonTab from "@/components/widget/CommonTab";
import { DiagnosticTabProvider } from "@/features/setting/context/diagnostic-tab-context";
import { MediaTabProvider } from "@/features/setting/context/media-tab-context";
import MediaTab from "@/features/setting/components/TroubleshootingContainer/MediaTab";
import DiagnosticTab from "@/features/setting/components/TroubleshootingContainer/DiagnosticTab";
import BasicInfoTab from "@/features/setting/components/TroubleshootingContainer/BasicInfoTab";
import useTheme from "@/components/theme/useTheme";
import "./index.css";
import { isMobileDevice } from "@/components/util/service";
const enum TroubleShootingTabs {
  BASIC_INFO = "basic_info",
  MEDIA = "media",
  DIAGNOSTIC = "diagnostic",
}

const ProbeSDKHome = () => {
  const { isProbeSdkInitialized } = useProbe();

  const { theme: themeName } = useTheme();
  const [currentTabId, setCurrentTabId] = useState(TroubleShootingTabs.BASIC_INFO);

  const { t } = useTranslation();

  const tabs = [
    { name: TroubleShootingTabs.BASIC_INFO, title: t("troubleshooting.basic_info_tab_text") },
    { name: TroubleShootingTabs.MEDIA, title: t("troubleshooting.media_tab_text") },
    { name: TroubleShootingTabs.DIAGNOSTIC, title: t("troubleshooting.diagnostic_tab_text") },
  ];

  return (
    <div className="zoom-ui-toolkit-root">
      <div
        className={`flex flex-col items-center justify-center w-full min-h-[100dvh] max-h-[100dvh] overflow-y-auto bg-theme-background`}
      >
        <div
          className={`flex flex-col rounded-lg shadow-lg py-4 px-6 w-full ${isMobileDevice() ? "max-w-md" : "max-w-[900px] min-w-[300px]"} max-h-[100dvh] overflow-y-auto my-auto bg-theme-background text-theme-text border border-theme-border`}
          style={{ height: "100vh", width: "100vw" }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center" id="uikit-probe-sdk-title">
            Zoom Web Probe
          </h2>
          <div className="h-10 mb-2">
            <CommonTab
              tabs={tabs}
              activeTab={currentTabId}
              setActiveTab={(tabName) => setCurrentTabId(tabName as TroubleShootingTabs)}
              className="justify-center items-center h-10"
              orientation="horizontal"
            />
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            {isProbeSdkInitialized && (
              <BasicInfoTab
                themeName={themeName}
                style={{ display: currentTabId === "basic_info" ? "block" : "none" }}
              />
            )}
            {isProbeSdkInitialized && currentTabId === "media" && <MediaTab />}
            {isProbeSdkInitialized && (
              <DiagnosticTab
                themeName={themeName}
                style={{ display: currentTabId === "diagnostic" ? "block" : "none" }}
              />
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-theme-border text-center text-sm text-theme-text-secondary">
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.zoom.com/en/trust/terms/ "
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-theme-text-primary"
              >
                Terms
              </a>
              <a
                href="https://www.zoom.com/en/trust/privacy/privacy-statement/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-theme-text-primary"
              >
                Privacy
              </a>
              <span className="text-theme-text-secondary"> @2025 Zoom Communications, Inc. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProbeSDKApp = () => {
  return (
    <ProbeProvider>
      <MediaTabProvider>
        <DiagnosticTabProvider>
          <ProbeSDKHome />
        </DiagnosticTabProvider>
      </MediaTabProvider>
    </ProbeProvider>
  );
};

export default ProbeSDKApp;
