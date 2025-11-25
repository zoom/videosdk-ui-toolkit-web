import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useProbe } from "@/features/setting/context/probe-context";

import Button from "@/components/widget/CommonButton";
import CommonTab from "@/components/widget/CommonTab";

import MediaTab from "./MediaTab";
import DiagnosticTab from "./DiagnosticTab";
import BasicInfoTab from "./BasicInfoTab";
import { useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";

const enum TroubleShootingTabs {
  MEDIA = "media",
  BASIC_INFO = "basic_info",
  DIAGNOSTIC = "diagnostic",
}

const TroubleshootingContainer = () => {
  const { isProbeSdkInitialized } = useProbe();
  const { themeName } = useAppSelector(useSessionUISelector);

  const [currentTabId, setCurrentTabId] = useState("basic_info");

  const { t } = useTranslation();

  const tabs = [
    { name: TroubleShootingTabs.BASIC_INFO, title: t("troubleshooting.basic_info_tab_text") },
    { name: TroubleShootingTabs.MEDIA, title: t("troubleshooting.media_tab_text") },
    { name: TroubleShootingTabs.DIAGNOSTIC, title: t("troubleshooting.diagnostic_tab_text") },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Horizontal navigation */}
      <CommonTab
        tabs={tabs}
        activeTab={currentTabId}
        setActiveTab={(tabName) => setCurrentTabId(tabName as TroubleShootingTabs)}
        className="justify-center items-center"
        orientation="horizontal"
      />

      {/* Main content area */}
      {isProbeSdkInitialized && (
        <BasicInfoTab themeName={themeName} style={{ display: currentTabId === "basic_info" ? "block" : "none" }} />
      )}
      {isProbeSdkInitialized && currentTabId === "media" && <MediaTab />}
      {isProbeSdkInitialized && (
        <DiagnosticTab themeName={themeName} style={{ display: currentTabId === "diagnostic" ? "block" : "none" }} />
      )}
    </div>
  );
};

export default TroubleshootingContainer;
