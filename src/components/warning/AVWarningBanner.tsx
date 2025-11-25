import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import AVLearnMoreDialog from "./AVLearnMoreDialog";
import { useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";

const AVWarningBanner = () => {
  const { isShowAudioWarning, isShowVideoWarning } = useAppSelector(useSessionUISelector);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleLearnMoreClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <div>
        {isShowAudioWarning && isShowVideoWarning
          ? t("wc_join_media_preview_warning_denied_both")
          : isShowAudioWarning
            ? t("wc_join_media_preview_warning_denied_mic")
            : t("wc_join_media_preview_warning_denied_camera")}
        {t("wc_learn_more")}
      </div>
      <AVLearnMoreDialog open={open} handleClose={handleClose} />
    </>
  );
};

export default AVWarningBanner;
