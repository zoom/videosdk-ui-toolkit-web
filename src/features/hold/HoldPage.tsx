import React, { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import Button from "@/components/widget/CommonButton";
import { ClientContext } from "@/context/client-context";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";

/**
 * Full-screen view shown to a participant who has joined but is waiting for a host or manager to
 * admit them. Rendered in place of the meeting UI, so it owns the whole viewport.
 *
 * Deliberately has no device preview or controls: the participant is outside the media session
 * while held, so there is nothing to preview.
 */
export const HoldPage: React.FC = () => {
  const { t } = useTranslation();
  const { sessionInfo } = useAppSelector(useSessionSelector);
  const client = useContext(ClientContext);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = useCallback(async () => {
    setIsLeaving(true);
    try {
      await client?.leave();
    } catch {
      // Leaving is best-effort: the session is torn down either way, and there is no useful
      // recovery to offer someone who is trying to exit.
      setIsLeaving(false);
    }
  }, [client]);

  return (
    <div className={`${THEME_COLOR_CLASS} fixed inset-0 flex items-center justify-center`}>
      <div className="text-center max-w-md px-6">
        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" aria-hidden="true" />
        <div role="status" aria-live="polite">
          <h2 className="text-2xl font-semibold mb-2">{t("hold.waiting_title")}</h2>
          <p className="text-sm">{t("hold.waiting_message")}</p>
        </div>
        {sessionInfo?.topic && <p className="text-sm mt-4 opacity-70 truncate">{sessionInfo.topic}</p>}
        <div className="flex justify-center mt-8">
          <Button
            variant="secondary"
            onClick={handleLeave}
            disabled={isLeaving}
            id="uikit-hold-leave-button"
            aria-label={t("hold.leave")}
          >
            {t("hold.leave")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HoldPage;
