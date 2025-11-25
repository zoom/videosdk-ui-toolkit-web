import Button from "@/components/widget/CommonButton";
import { useProbe } from "@/features/setting/context/probe-context";
import { useEffect, useState, useCallback } from "react";
import { tableHeaderStyle, tableBodyStyle, tableCellStyle } from "./constant";

const BasicInfoTab = ({ themeName, style }: { themeName: string; style?: React.CSSProperties }) => {
  const { reporter } = useProbe();

  const [basicInfo, setBasicInfo] = useState([]);
  const [error, setError] = useState("");

  const fetchBasicInfo = useCallback(async () => {
    setError("");
    try {
      const report = await reporter.reportBasicInfo(navigator);
      setBasicInfo(report);
    } catch (error) {
      setError(error.message);
    }
  }, [reporter]);

  useEffect(() => {
    fetchBasicInfo();
  }, [fetchBasicInfo, reporter]);

  const renderBasicInfoTable = () => {
    if (basicInfo.length === 0) {
      return <p>No basic information available.</p>;
    }

    return (
      <table className="w-full table-fixed border-collapse rounded-lg overflow-hidden text-theme-text">
        <thead>
          <tr className={tableHeaderStyle}>
            <th className={tableCellStyle}>Index</th>
            <th className={tableCellStyle}>Attribute</th>
            <th className={tableCellStyle}>Value</th>
            <th className={tableCellStyle}>Critical</th>
            <th className={tableCellStyle}>Affected Features</th>
          </tr>
        </thead>
        <tbody>
          {basicInfo.map((item, index) => (
            <tr key={index} className={tableBodyStyle}>
              <td className={tableCellStyle}>{item.index}</td>
              <td className={`${tableCellStyle} whitespace-normal break-words`}>{item.attr}</td>
              <td className={`${tableCellStyle} whitespace-normal break-words`}>
                {typeof item.val === "boolean" ? (item.val ? "Yes" : "No") : item.val}
              </td>
              <td className={tableCellStyle}>{item.critical ? "Yes" : "No"}</td>
              <td className={`${tableCellStyle} break-words`}>{renderAffectedFeatures(item.affectedFeatures)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderAffectedFeatures = (features) => {
    if (!features || features.length === 0) {
      return "None";
    }

    return (
      <ul>
        {features.map((feature, idx) => (
          <li key={idx}>{feature.featureName}</li>
        ))}
      </ul>
    );
  };

  if (error !== "") {
    return (
      <div className="flex-grow overflow-auto" style={style}>
        <h2 className="text-2xl font-bold mb-6">Permissions Error</h2>
        <p className="">Failed to fetch basic information. Error: {error}</p>
        <Button onClick={fetchBasicInfo} variant="primary" size="sm" className="px-4">
          Retry
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex-grow overflow-auto" style={style}>
        <div className="basic-info-tab p-0">
          <div className="overflow-x-auto border border-theme-border rounded-lg uikit-custom-scrollbar">
            <div className="basic-info-table-container text-xs font-small min-w-full">{renderBasicInfoTable()}</div>
          </div>
        </div>
      </div>
    );
  }
};

export default BasicInfoTab;
