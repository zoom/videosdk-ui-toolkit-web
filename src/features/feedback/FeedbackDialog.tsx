import CommonDialog from "@/components/widget/dialog/CommonDialog";
import { THEME_COLOR_CLASS } from "@/constant";
import { ClientContext } from "@/context/client-context";
import { emit } from "@/events/event-bus";
import { ExposedEvents } from "@/events/event-constant";
import { Angry, Frown, Laugh, Meh, Smile } from "lucide-react";
import React, { useContext, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

interface FeedbackDialogProps {
  setIsJoined: () => void;
}

const FeedbackDialog = ({ setIsJoined }: FeedbackDialogProps) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<string | null>(null);
  const client = useContext(ClientContext);

  const onSelectFeedback = useCallback((e: any) => {
    setRating(e.target?.value);
  }, []);

  const onSubmit = useCallback(async () => {
    if (!rating) {
      return;
    }
    if (client) {
      const loggerClient = client.getLoggerClient();
      await loggerClient.reportRating(Number(rating));
    }
    setIsJoined();
    emit(ExposedEvents.EVENT_SESSION_DESTROYED, "closed");
  }, [client, rating, setIsJoined]);

  const getFeedbackLabel = (value: string) => {
    const labels = {
      "1": t("feedback.rating_terrible"),
      "2": t("feedback.rating_poor"),
      "3": t("feedback.rating_okay"),
      "4": t("feedback.rating_good"),
      "5": t("feedback.rating_great"),
    };
    return labels[value as keyof typeof labels];
  };

  return (
    <CommonDialog
      isOpen={true}
      title=""
      okText={t("feedback.submit_button")}
      onOk={(e) => {
        onSubmit();
        e.preventDefault();
      }}
      okButtonProps={{
        disabled: !rating,
        className: !rating ? "opacity-50 cursor-not-allowed" : "",
      }}
    >
      <div className={`space-y-6 px-2`}>
        <p className="text-[20px] text-gray-600 text-center font-medium text-theme-text">
          {t("feedback.dialog_title")}
        </p>

        <div className="flex justify-center py-4">
          <div className="w-full max-w-[320px] flex justify-between items-center ">
            {[1, 2, 3, 4, 5].map((value) => (
              <div
                key={value}
                className="flex flex-col items-center gap-2 transition-transform hover:scale-110"
                onClick={() => setRating(String(value))}
              >
                <div
                  className={`
                  p-3 rounded-full cursor-pointer transition-all
                  ${rating === String(value) ? "bg-blue-50 shadow-sm scale-110" : "hover:bg-gray-50"}
                `}
                >
                  {value === 1 && <Angry size={28} color="#FF3B30" />}
                  {value === 2 && <Frown size={28} color="#FF9500" />}
                  {value === 3 && <Meh size={28} color="#FFCC00" />}
                  {value === 4 && <Smile size={28} color="#34C759" />}
                  {value === 5 && <Laugh size={28} color="#30D158" />}
                </div>
                <input
                  type="radio"
                  id={`rating-${value}`}
                  name="rating"
                  checked={rating === String(value)}
                  value={value}
                  onChange={onSelectFeedback}
                  className="hidden"
                />
                <span
                  className={`text-xs font-medium ${rating === String(value) ? "text-theme-text" : "text-gray-400"}`}
                >
                  {getFeedbackLabel(String(value))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CommonDialog>
  );
};

export default FeedbackDialog;
