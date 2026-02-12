import { useEffect, useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { setShowCameraControlConsent } from "@/store/uiSlice";

import { ClientContext } from "@/context/client-context";
import { useAppDispatch } from "@/hooks/useAppSelector";

export function useCameraControlConsent() {
  const { t } = useTranslation();
  const client = useContext(ClientContext);
  const dispatch = useAppDispatch();

  const defaultTitle = t("notification.camera_control_requested");
  const defaultContent = t("notification.camera_control_content", {
    requestorName: t("notification.camera_control_host_fallback"),
  });
  const defaultOkText = t("notification.camera_control_allow");
  const defaultCancelText = t("notification.camera_control_decline");
  const [consentTitle, setConsentTitle] = useState(defaultTitle);
  const [consentContent, setConsentContent] = useState(defaultContent);
  const [okText, setOkText] = useState(defaultOkText);
  const [cancelText, setCancelText] = useState(defaultCancelText);
  const [requestingUserId, setRequestingUserId] = useState<number | null>(null);

  const onCameraControlRequest = useCallback(
    (payload: { userId: number }) => {
      if (payload?.userId) {
        setRequestingUserId(payload.userId);

        // Get the participant's display name
        const participants = client.getAllUser();
        const requestor = participants.find((p) => p.userId === payload.userId);
        const requestorName = requestor?.displayName || t("notification.camera_control_host_fallback");

        setConsentTitle(defaultTitle);
        setConsentContent(t("notification.camera_control_content", { requestorName }));
        setOkText(defaultOkText);
        setCancelText(defaultCancelText);
        dispatch(setShowCameraControlConsent(true));
      }
    },
    [dispatch, client, t, defaultTitle, defaultOkText, defaultCancelText],
  );

  useEffect(() => {
    client.on("far-end-camera-request-control", onCameraControlRequest);
    return () => {
      client.off("far-end-camera-request-control", onCameraControlRequest);
    };
  }, [client, onCameraControlRequest]);

  return {
    title: consentTitle,
    content: consentContent,
    okText: okText,
    cancelText: cancelText,
    requestingUserId: requestingUserId,
  };
}
