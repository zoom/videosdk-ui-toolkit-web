import { CommonPopper } from "@/components/widget/CommonPopper";
import InviteDialog from "../../../components/widget/dialog/InviteDialog";

export const InviteAudioPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <CommonPopper isOpen={isOpen} onClose={onClose} title="Invite Participants" width={500} height={570}>
      <InviteDialog isOpen={isOpen} onClose={onClose} />
    </CommonPopper>
  );
};

export default InviteAudioPanel;
