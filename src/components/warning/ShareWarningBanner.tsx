import { useContext, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ShareLearnMoreDialog from "./ShareLearnMoreDialog";
import { useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";

const ShareWarningBanner = () => {
  const [open, setOpen] = useState(false);
  const { isShowSharePermissionWarning } = useAppSelector(useSessionUISelector);
  const { t } = useTranslation();

  const handleLearnMoreClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <div>
        {t("wc_prevent_access_share") + " "}
        {t("wc_learn_more")}
      </div>
      <ShareLearnMoreDialog open={open} handleClose={handleClose} />
    </>
  );
};

export default ShareWarningBanner;
