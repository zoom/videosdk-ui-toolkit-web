import { useEffect, useCallback, useContext, useState } from "react";

import { setShowUnmuteConsent } from "@/store/uiSlice";

import { ClientContext } from "@/context/client-context";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";

const UnmutedByHostType = {
  Unmute: "Unmute",
  Spotlight: "Spotlight",
} as const;

export function useUnmuteConsent() {
  const client = useContext(ClientContext);
  const dispatch = useAppDispatch();
  const { isStartedAudio } = useAppSelector(useSessionSelector);

  const defaultTitle = "The host would like you to unmute";
  const defaultOkText = "Unmute";
  const defaultCancelText = "Stay muted";
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
            setConsentContent(
              "The host has spotlighted your video for everyone. Would you like to unmute your microphone to speak?",
            );
            setOkText("Unmute myself");
          } else {
            setConsentContent(
              "The host has spotlighted your video for everyone. Would you like to join audio to speak?",
            );
            setOkText("Join Audio");
          }
          setCancelText("Later");
          break;
        default:
          setConsentTitle("The host would like you to unmute");
          setOkText("Unmute");
          setCancelText("Stay muted");
      }
      dispatch(setShowUnmuteConsent(true));
    },
    [dispatch, isStartedAudio],
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
