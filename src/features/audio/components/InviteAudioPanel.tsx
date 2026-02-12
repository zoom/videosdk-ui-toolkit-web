import { CommonPopper } from "@/components/widget/CommonPopper";
import { useTranslation } from "react-i18next";
import InviteDialog from "../../../components/widget/dialog/InviteDialog";

export const InviteAudioPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <CommonPopper
      isOpen={isOpen}
      onClose={onClose}
      title={t("audio.invite_participants_title")}
      width={500}
      height={570}
    >
      <InviteDialog isOpen={isOpen} onClose={onClose} />
    </CommonPopper>
  );
};

export default InviteAudioPanel;
