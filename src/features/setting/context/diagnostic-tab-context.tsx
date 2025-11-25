import React, { useContext, useState } from "react";

interface NetworkDiagnosticReport {
  serviceZone: string;
  protocols: {
    type: number;
    isBlocked: boolean;
    port: string;
    tip: string;
  }[];
  statistics: {
    uplink_avg_rtt: number;
    uplink_avg_loss: number;
    uplink_avg_jitter: number;
    uplink_bandwidth: number;
    uplink_bw_level: number;
    uplink_network_level: number;
    downlink_avg_rtt: number;
    downlink_avg_loss: number;
    downlink_avg_jitter: number;
    downlink_bandwidth: number;
    downlink_bw_level: number;
    downlink_network_level: number;
  };
  rid: string;
}

interface BasicInfo {
  index: number;
  attr: string;
  val: string | number | boolean;
  critical: boolean;
  affectedFeatures: {
    featureName: string;
  }[];
}

interface SupportedFeature {
  index: number;
  featureName: string;
  isSupported: boolean;
  checkList: {
    index: number;
    label: string;
    matched: boolean;
    tip: string;
  }[];
}
interface ReportObject {
  type: number;
  content: {
    networkDiagnosticReport: NetworkDiagnosticReport;
    basicInfo: BasicInfo[];
    supportedFeatures: SupportedFeature[];
  };
}

interface DiagnosticTabContextType {
  isDiagnosing: boolean;
  setIsDiagnosing: React.Dispatch<React.SetStateAction<boolean>>;
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  diagnosticData: any[];
  setDiagnosticData: React.Dispatch<React.SetStateAction<any[]>>;
  reportData: ReportObject | null;
  setReportData: React.Dispatch<React.SetStateAction<object>>;
}

const DiagnosticTabContext = React.createContext<DiagnosticTabContextType | null>(null);

export const DiagnosticTabProvider = ({ children }) => {
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [diagnosticData, setDiagnosticData] = useState([]);
  const [reportData, setReportData] = useState(null);

  return (
    <DiagnosticTabContext.Provider
      value={{
        isDiagnosing,
        setIsDiagnosing,
        countdown,
        setCountdown,
        diagnosticData,
        setDiagnosticData,
        reportData,
        setReportData,
      }}
    >
      {children}
    </DiagnosticTabContext.Provider>
  );
};

export const useDiagnostic = () => {
  return useContext(DiagnosticTabContext);
};
