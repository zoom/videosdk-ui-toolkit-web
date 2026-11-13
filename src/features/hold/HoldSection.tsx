import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, Loader } from "lucide-react";
import Button from "@/components/widget/CommonButton";
import { Participant } from "@/types";
import { getInitialsFirstLetter } from "@/components/util/util";
import { getAvatarColor } from "../chat/util";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";
import { useHoldActions } from "./hooks";

interface HoldSectionProps {
  /** Filters the waiting list with the same query as the in-session list. */
  searchTerm?: string;
}

interface HoldRowProps {
  participant: Participant;
  isPending: boolean;
  onAdmit: (userId: number) => void;
  onRemove: (userId: number) => void;
}

/** Overrides the shared button padding so hold actions stay compact. */
const COMPACT_BUTTON_CLASS = "!h-6 flex-shrink-0 !px-2 !py-0 !text-xs !leading-none";

const HoldRow: React.FC<HoldRowProps> = ({ participant, isPending, onAdmit, onRemove }) => {
  const { t } = useTranslation();

  return (
    <li className={`flex items-center py-2 px-3 ${THEME_COLOR_CLASS}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-theme-text-button text-sm font-semibold ${getAvatarColor(
          participant?.userId,
        )}`}
      >
        {getInitialsFirstLetter(participant?.displayName)}
      </div>
      <p className="ml-3 min-w-0 flex-grow text-sm font-medium truncate" title={participant?.displayName}>
        {participant?.displayName}
      </p>
      {isPending ? (
        <Loader size={16} className="flex-shrink-0 animate-spin" aria-label={t("hold.pending")} />
      ) : (
        <div className="ml-2 flex flex-shrink-0 items-center space-x-2">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => onRemove(participant.userId)}
            aria-label={t("hold.remove_aria", { name: participant?.displayName })}
            className={COMPACT_BUTTON_CLASS}
          >
            {t("hold.remove")}
          </Button>
          <Button
            variant="primary"
            size="xs"
            onClick={() => onAdmit(participant.userId)}
            aria-label={t("hold.admit_aria", { name: participant?.displayName })}
            className={COMPACT_BUTTON_CLASS}
          >
            {t("hold.admit")}
          </Button>
        </div>
      )}
    </li>
  );
};

/**
 * Collapsible list of participants waiting to be admitted. Rendered under the participants search
 * field so the same query covers the waiting list and the in-session list. Only hosts and managers
 * see it, and only while someone matching the search is waiting.
 */
export const HoldSection: React.FC<HoldSectionProps> = ({ searchTerm = "" }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const { canManage, onHoldParticipants, pendingUserIds, admit, admitAll, remove } = useHoldActions();

  const normalizedSearch = searchTerm.toLowerCase();
  const visibleParticipants = onHoldParticipants.filter((participant) =>
    participant.displayName.toLowerCase().includes(normalizedSearch),
  );

  if (!canManage || visibleParticipants.length === 0) {
    return null;
  }

  const isAdmitAllPending = visibleParticipants.every((participant) => pendingUserIds.includes(participant.userId));

  return (
    <div className="border-b border-theme-border">
      <div className="flex items-center justify-between gap-2 px-3 py-1">
        <button
          className="flex min-w-0 items-center rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-expanded={isExpanded}
          id="uikit-hold-section-toggle"
        >
          {isExpanded ? (
            <ChevronDown className="mr-2 h-4 w-4 flex-shrink-0 text-theme-text" aria-hidden="true" />
          ) : (
            <ChevronUp className="mr-2 h-4 w-4 flex-shrink-0 text-theme-text" aria-hidden="true" />
          )}
          <span className="truncate text-xs font-semibold uppercase tracking-wider">
            {t("hold.section_title")} • {visibleParticipants.length}
          </span>
        </button>
        <Button
          variant="primary"
          size="xs"
          onClick={admitAll}
          disabled={isAdmitAllPending}
          aria-busy={isAdmitAllPending}
          id="uikit-hold-admit-all-button"
          className={COMPACT_BUTTON_CLASS}
        >
          {isAdmitAllPending && <Loader size={12} className="mr-1 animate-spin" aria-hidden="true" />}
          {t("hold.admit_all")}
        </Button>
      </div>
      {isExpanded && (
        <ul aria-label={t("hold.section_title")} className="uikit-custom-scrollbar max-h-48 overflow-y-auto">
          {visibleParticipants.map((participant) => (
            <HoldRow
              key={participant.userId}
              participant={participant}
              isPending={pendingUserIds.includes(participant.userId)}
              onAdmit={admit}
              onRemove={remove}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default HoldSection;
