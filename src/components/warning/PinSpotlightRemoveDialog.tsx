import { useContext } from "react";

import { useTranslation } from "react-i18next";
import { UIKIT_CLASSNAME_PREFIX } from "../../constant";

const PinSpotlightRemoveDialog = () => {
  const { t } = useTranslation();
  return <div> pin</div>;
  // const { isShowPinSpotlightDialog, pinSpotlightDialogInfo };
  // const { title, content, onOk, onClose } = pinSpotlightDialogInfo;

  // return (
  //   <StyledDialog
  //     open={isShowPinSpotlightDialog}
  //     onClose={onClose}
  //     aria-labelledby="pin-spotlight-remove-dialog-title"
  //     aria-describedby="pin-spotlight-remove-dialog-descption"
  //     maxWidth="md"
  //     transitionDuration={300}
  //   >
  //     <DialogTitle id="participant-dialog-title">{title}</DialogTitle>
  //     <DialogContent>
  //       <DialogContentText id="participant-dialog-descption">
  //         {content}
  //       </DialogContentText>
  //     </DialogContent>
  //     <DialogActions>
  //       <Button onClick={onOk} variant="contained" color="primary" size="small">
  //         {t("wc_continue")}
  //       </Button>
  //       <Button onClick={onClose} variant="outlined" size="small">
  //         {t("dialog.btn_cancel")}
  //       </Button>
  //     </DialogActions>
  //   </StyledDialog>
  // );
};
export default PinSpotlightRemoveDialog;
