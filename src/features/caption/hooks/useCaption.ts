import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import {
  setIsTranscriptionFeatureEnabled,
  setIsTranslationFeatureEnabled,
  setIsHostDisableCaptions,
} from "../captionSlice";
import { SessionClient, CaptionClient } from "@/types";

export function useCaption(
  sessionClient: SessionClient,
  captionClient: CaptionClient,
  setCaptionClient: (captionClient: CaptionClient) => void,
) {
  const dispatch = useAppDispatch();

  const {
    config: { featuresOptions },
  } = useAppSelector(useSessionSelector);
  const onCaptionEnable = useCallback(() => {
    const captionClient = sessionClient.getLiveTranscriptionClient();
    setCaptionClient(captionClient);
    if (!captionClient) return;
    const { isLiveTranscriptionEnabled, isLiveTranslationEnabled } = captionClient.getLiveTranscriptionStatus();

    dispatch(setIsTranscriptionFeatureEnabled(isLiveTranscriptionEnabled && featuresOptions.caption.enable));
    dispatch(setIsTranslationFeatureEnabled(isLiveTranslationEnabled));
  }, [dispatch, sessionClient, setCaptionClient, featuresOptions]);

  const onCaptionHostDisable = useCallback(
    (payload: boolean) => {
      dispatch(setIsHostDisableCaptions(payload));
    },
    [dispatch],
  );

  useEffect(() => {
    sessionClient.on("caption-enable", onCaptionEnable);
    sessionClient.on("caption-host-disable", onCaptionHostDisable);
    return () => {
      sessionClient.off("caption-enable", onCaptionEnable);
      sessionClient.off("caption-host-disable", onCaptionHostDisable);
    };
  }, [sessionClient, onCaptionEnable, onCaptionHostDisable]);

  return { captionClient };
}
