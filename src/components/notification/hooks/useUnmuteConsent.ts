import { useEffect, useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { setShowUnmuteConsent } from "@/store/uiSlice";

import { ClientContext } from "@/context/client-context";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";

const UnmutedByHostType = {
  Unmute: "Unmute",
  Spotlight: "Spotlight",
} as const;

export function useUnmuteConsent() {
  const { t } = useTranslation();
  const client = useContext(ClientContext);
  const dispatch = useAppDispatch();
  const { isStartedAudio } = useAppSelector(useSessionSelector);

  const defaultTitle = t("notification.unmute_title");
  const defaultOkText = t("notification.unmute_button");
  const defaultCancelText = t("notification.stay_muted");
  const [consentTitle, setConsentTitle] = useState(defaultTitle);
  const [consentContent, setConsentContent] = useState("");
  const [consentContent2, setConsentContent2] = useState("");
  const [okText, setOkText] = useState(defaultOkText);
  const [cancelText, setCancelText] = useState(defaultCancelText);

  const onUnmuteAudio = useCallback(
    (payload: { reason: (typeof UnmutedByHostType)[keyof typeof UnmutedByHostType] }) => {
      switch (payload?.reason) {
        case UnmutedByHostType.Unmute:
          setConsentContent("");
          break;
        case UnmutedByHostType.Spotlight:
          if (isStartedAudio) {
            setConsentContent(t("notification.spotlight_unmute_content"));
            setOkText(t("notification.spotlight_unmute_myself"));
          } else {
            setConsentContent(t("notification.spotlight_join_audio_content"));
            setOkText(t("notification.spotlight_join_audio"));
          }
          setCancelText(t("notification.later"));
          break;
        default:
          setConsentTitle(defaultTitle);
          setOkText(defaultOkText);
          setCancelText(defaultCancelText);
      }
      dispatch(setShowUnmuteConsent(true));
    },
    [dispatch, isStartedAudio, t, defaultTitle, defaultOkText, defaultCancelText],
  );

  useEffect(() => {
    client.on("host-ask-unmute-audio", onUnmuteAudio);
    return () => {
      client.off("host-ask-unmute-audio", onUnmuteAudio);
    };
  }, [client, onUnmuteAudio]);

  return {
    title: consentTitle,
    content: consentContent,
    content2: consentContent2,
    okText: okText,
    cancelText: cancelText,
  };
}
