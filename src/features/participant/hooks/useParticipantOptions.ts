import { useContext, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ClientContext } from "../../../context/client-context";
import { StreamContext } from "@/context/stream-context";

enum ParticipantOptionType {
  LOCK = "lock",
  START_VIDEO = "startVideo",
}

export function useParticipantOptions() {
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const { t } = useTranslation();

  const onParticipantOptionsClick = useCallback((key: ParticipantOptionType) => {
    if (key === ParticipantOptionType.LOCK) {
      // eslint-disable-next-line no-console
      console.log("lock session");
    }
  }, []);

  const participantOptions = useMemo(
    () => [
      {
        text: t("wc_lock_meeting"),
        checked: true,
        onClick: () => onParticipantOptionsClick(ParticipantOptionType.LOCK),
      },
    ],
    [onParticipantOptionsClick, t],
  );

  return participantOptions;
}
