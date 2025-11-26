import MediaErrorDialog from "@/components/error/MediaErrorDialog";
import RemoveConfirmDialog from "@/features/participant/components/RemoveConfirmDialog";
import MakeHostConfirmDialog from "@/features/participant/components/MakeHostConfirmDialog";
import WhiteboardExportConfirmDialog from "@/features/whiteboard/components/WhiteboardExportConfirmDialog";
import WhiteboardErrorDialog from "@/features/whiteboard/components/WhiteboardErrorDialog";

export const DialogContainer = () => {
  return (
    <>
      <MediaErrorDialog />
      <RemoveConfirmDialog />
      <MakeHostConfirmDialog />
      <WhiteboardExportConfirmDialog />
      <WhiteboardErrorDialog />
    </>
  );
};
