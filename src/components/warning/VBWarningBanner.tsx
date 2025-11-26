import { useState, useEffect, useContext, useRef, useMemo } from "react";

import { ClientContext } from "../../context/client-context";
import { VirtualBackgroundPreloadState } from "../../constant/stream-constant";

import { useTranslation } from "react-i18next";
import { useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";

const VBWarningBanner = () => {
  const [isShowWarning, setIsShowWarning] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const timerRef = useRef(0);
  const client = useContext(ClientContext);

  const { virtualBackgroundPreloadState, isSupportVB } = useAppSelector(useSessionUISelector);
  const { t } = useTranslation();

  const VB_LOAD_FAIL_TEXT = t("settings.vb_init_fail2");
  const VB_LOAD_TOO_LONG_TEXT = t("settings.vb_init_10s_tip2");

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = 0;
    }
  };

  useEffect(() => {
    if (isSupportVB && virtualBackgroundPreloadState === VirtualBackgroundPreloadState.Fail) {
      setLoadingMessage(VB_LOAD_FAIL_TEXT);
      setIsShowWarning(true);
    }
    if (isSupportVB && virtualBackgroundPreloadState === VirtualBackgroundPreloadState.Unknow) {
      setLoadingMessage(VB_LOAD_TOO_LONG_TEXT);
      setIsShowWarning(true);
    }
    timerRef.current = window.setTimeout(() => {
      setIsShowWarning(false);
    }, 5000);

    return () => {
      clearTimer();
    };
  }, [VB_LOAD_FAIL_TEXT, VB_LOAD_TOO_LONG_TEXT, isSupportVB, virtualBackgroundPreloadState]);

  return <>{isShowWarning && <div>{loadingMessage}</div>}</>;
};

export default VBWarningBanner;
