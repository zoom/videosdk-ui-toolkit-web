import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector, useSessionUISelector, useSubsessionSelector } from "@/hooks/useAppSelector";
import {
  setIsJoinSubsessionConfirm,
  setIsAskSubsessionHelpConfirm,
  setIsJoinSubsessionConfirmRemind,
  setActivePopper,
  setIsSubsessionPoppedOut,
} from "@/store/uiSlice";
import { setInviter } from "@/features/subsession/subsessionSlice";

import ConfirmDialog from "../../../components/widget/dialog/ConfirmDialog";
import { SubsessionStatus } from "@zoom/videosdk";
import { usePrevious } from "@/hooks/usePrevious";

const SubsessionConfirmDialogs = ({ subsessionClient }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const sessionUI = useAppSelector(useSessionUISelector);
  const {
    currentSubRoom,
    inviter: subsessionInviter,
    subStatus,
    subsessionOptions: { isSubsessionSelectionEnabled },
    isOpenByYourself,
  } = useAppSelector(useSubsessionSelector);
  const preSubStatus = usePrevious(subStatus);
  useEffect(() => {
    if (
      subStatus === SubsessionStatus.Closed &&
      (preSubStatus === SubsessionStatus.InProgress || preSubStatus === SubsessionStatus.Closing)
    ) {
      dispatch(setIsJoinSubsessionConfirm(false));
      dispatch(setIsJoinSubsessionConfirmRemind(false));
    } else if (subStatus === SubsessionStatus.InProgress && preSubStatus !== subStatus && !isOpenByYourself) {
      dispatch(setIsJoinSubsessionConfirm(true));
      dispatch(setIsJoinSubsessionConfirmRemind(true));
    }
  }, [subStatus, dispatch, preSubStatus, isOpenByYourself]);

  return (
    <>
      {sessionUI.isJoinSubsessionConfirm && sessionUI.isJoinSubsessionConfirmRemind && (
        <ConfirmDialog
          id="uikit-subsession-join-subsession-confirm"
          onClose={() => dispatch(setIsJoinSubsessionConfirm(false))}
          onConfirm={() => {
            if (!isSubsessionSelectionEnabled) {
              subsessionClient.joinSubsession(currentSubRoom.subsessionId);
            } else {
              dispatch(setIsSubsessionPoppedOut(true));
              dispatch(setActivePopper("Subsession"));
            }
            dispatch(setIsJoinSubsessionConfirm(false));
            dispatch(setIsJoinSubsessionConfirmRemind(false));
          }}
          title={t("subsession.join_room")}
          confirmText={t("subsession.join")}
          confirmId="uikit-subsession-join-subsession-join"
          cancelId="uikit-subsession-join-subsession-cancel"
          message={t("subsession.invite_join_room_tip_content")}
        />
      )}
      {sessionUI.isAskSubsessionHelpConfirm && (
        <ConfirmDialog
          id="uikit-subsession-ask-for-help-confirm"
          onClose={() => dispatch(setIsAskSubsessionHelpConfirm(false))}
          onConfirm={() => {
            if (subsessionInviter.inviterSubsessionId) {
              subsessionClient.joinSubsession(subsessionInviter.inviterSubsessionId);
              dispatch(setIsAskSubsessionHelpConfirm(false));
              dispatch(setInviter({}));
              return;
            }
            subsessionClient.askForHelp();
            dispatch(setIsAskSubsessionHelpConfirm(false));
          }}
          title={subsessionInviter.inviterSubsessionId ? t("subsession.join_room") : t("subsession.ask_for_help")}
          confirmText={subsessionInviter.inviterSubsessionId ? t("subsession.join") : t("subsession.request")}
          confirmId="uikit-subsession-ask-for-help-confirm"
          cancelId="uikit-subsession-ask-for-help-cancel"
          message={
            subsessionInviter.inviterSubsessionId
              ? t("subsession.ask_host_for_help_tip", {
                  inviterName: subsessionInviter.inviterName,
                  inviterSubsessionName: subsessionInviter.inviterSubsessionName,
                })
              : t("subsession.ask_for_help_content")
          }
        />
      )}
    </>
  );
};

export default SubsessionConfirmDialogs;
