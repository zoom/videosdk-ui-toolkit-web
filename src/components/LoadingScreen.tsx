import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";

const LoadingScreen = () => {
  const { t } = useTranslation();
  return (
    <div className={`${THEME_COLOR_CLASS} fixed inset-0 flex items-center justify-center`}>
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">{t("loading.joining_session")}</h2>
        <p className="">{t("loading.please_wait")}</p>
      </div>
    </div>
  );
};
export default LoadingScreen;
