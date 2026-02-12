import Button from "@/components/widget/CommonButton";
import { useTranslation } from "react-i18next";
import { useProbe } from "@/features/setting/context/probe-context";
import { useEffect, useState, useCallback } from "react";
import { tableHeaderStyle, tableBodyStyle, tableCellStyle } from "./constant";

const BasicInfoTab = ({ themeName, style }: { themeName: string; style?: React.CSSProperties }) => {
  const { t } = useTranslation();
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
      return <p>{t("troubleshooting.no_basic_info")}</p>;
    }

    return (
      <table className="w-full table-fixed border-collapse rounded-lg overflow-hidden text-theme-text">
        <thead>
          <tr className={tableHeaderStyle}>
            <th className={tableCellStyle}>{t("troubleshooting.table_index")}</th>
            <th className={tableCellStyle}>{t("troubleshooting.table_attribute")}</th>
            <th className={tableCellStyle}>{t("troubleshooting.table_value")}</th>
            <th className={tableCellStyle}>{t("troubleshooting.table_critical")}</th>
            <th className={tableCellStyle}>{t("troubleshooting.table_affected_features")}</th>
          </tr>
        </thead>
        <tbody>
          {basicInfo.map((item, index) => (
            <tr key={index} className={tableBodyStyle}>
              <td className={tableCellStyle}>{item.index}</td>
              <td className={`${tableCellStyle} whitespace-normal break-words`}>{item.attr}</td>
              <td className={`${tableCellStyle} whitespace-normal break-words`}>
                {typeof item.val === "boolean"
                  ? item.val
                    ? t("troubleshooting.yes")
                    : t("troubleshooting.no")
                  : item.val}
              </td>
              <td className={tableCellStyle}>{item.critical ? t("troubleshooting.yes") : t("troubleshooting.no")}</td>
              <td className={`${tableCellStyle} break-words`}>{renderAffectedFeatures(item.affectedFeatures)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderAffectedFeatures = (features) => {
    if (!features || features.length === 0) {
      return t("troubleshooting.none");
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
        <h2 className="text-2xl font-bold mb-6">{t("troubleshooting.permissions_error")}</h2>
        <p className="">{t("troubleshooting.failed_fetch_basic_info", { error })}</p>
        <Button onClick={fetchBasicInfo} variant="primary" size="sm" className="px-4">
          {t("troubleshooting.retry")}
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
