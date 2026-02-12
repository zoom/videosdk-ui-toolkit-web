import { useCallback, useContext, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import {
  setSubRoomList,
  setSubUnassignedUsers,
  setCurrentSubRoom,
  SubsessionState,
  setSubRoomCountdown,
  setSubUserStatus,
  setSubStatus,
  setInviter,
  setSubsessionOptions,
  setSubsessionType,
} from "../subsessionSlice";
import { ClientContext } from "@/context/client-context";
import sessionAdditionalContext from "@/context/session-additional-context";
import {
  setIsShowSubsessionDialog,
  setIsShowSubsessionBroadcast,
  setIsShowInvitedBackToMainSessDialog,
  setSubsessionBroadcastMsg,
  setIsAskSubsessionHelpConfirm,
  setIsJoinSubsessionConfirm,
} from "@/store/uiSlice";
import { AskHostHelpResponse, SubsessionStatus, SubsessionUserStatus } from "@zoom/videosdk";
import { useAppDispatch, useAppSelector, useSubsessionSelector } from "@/hooks/useAppSelector";
import { SubsessionAllocationPattern } from "../subsession-constants";
import { useParticipantsChange } from "@/hooks/useParticipantsChange";

interface RoomStateChangePayload {
  status: SubsessionStatus;
}

export const useOnSubsessionEvents = () => {
  const client = useContext(ClientContext);
  const { subsessionClient } = useContext(sessionAdditionalContext);
  const { subUserStatus, subStatus, currentSubRoom }: SubsessionState = useAppSelector(useSubsessionSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const onRoomStateChange = useCallback(
    ({ status }: RoomStateChangePayload) => {
      dispatch(setSubStatus(status));
      if (subsessionClient) {
        const newUserStatus = subsessionClient.getUserStatus();
        const newSubsession = subsessionClient.getCurrentSubsession();

        dispatch(setSubRoomList(subsessionClient.getSubsessionList()));
        dispatch(setSubUnassignedUsers(subsessionClient.getUnassignedUserList()));

        if (newUserStatus !== subUserStatus) {
          dispatch(setSubUserStatus(newUserStatus));
        }
        if (newSubsession !== currentSubRoom) {
          dispatch(setCurrentSubRoom(subsessionClient.getCurrentSubsession()));
        }
        const options = subsessionClient.getSubsessionOptions();
        if (options) {
          dispatch(setSubsessionOptions(options));
          if (options.isSubsessionSelectionEnabled) {
            dispatch(setSubsessionType(SubsessionAllocationPattern.SelfSelect));
          }
        }
        if (
          newUserStatus === SubsessionUserStatus.Invited &&
          newSubsession.subsessionId !== currentSubRoom.subsessionId
        ) {
          dispatch(setIsShowSubsessionDialog(true));
        }
        if (
          subStatus !== SubsessionStatus.Closing &&
          status === SubsessionStatus.Closing &&
          newUserStatus === SubsessionUserStatus.InSubsession
        ) {
          dispatch(setIsShowSubsessionDialog(true));
        }
      }
    },
    [dispatch, subsessionClient, subUserStatus, currentSubRoom, subStatus],
  );

  const onMainSessionUserChange = useCallback(() => {
    if (subsessionClient) {
      dispatch(setSubRoomList(subsessionClient.getSubsessionList()));
    }
  }, [subsessionClient, dispatch]);

  const onRoomCountdown = useCallback(
    ({ countdown }: any) => {
      dispatch(setSubRoomCountdown(countdown));
      if (countdown === 0) {
        setTimeout(() => subsessionClient?.leaveSubsession(), 500);
      }
    },
    [subsessionClient, dispatch],
  );

  const onBroadcastMessage = useCallback(
    ({ message }: any) => {
      dispatch(setSubsessionBroadcastMsg(message as string));
      dispatch(setIsShowSubsessionBroadcast(true));
    },
    [dispatch],
  );

  const onInviteBackToMainSession = useCallback(
    ({ inviterId, inviterGuid, inviterName }: any) => {
      dispatch(setInviter({ inviterId, inviterGuid, inviterName }));
      dispatch(setIsShowInvitedBackToMainSessDialog(true));
    },
    [dispatch],
  );
  const onSubsessionInviteToJoin = useCallback(
    ({ subsessionId, subsessionName }: any) => {
      if (currentSubRoom.userStatus === SubsessionUserStatus.Invited) {
        dispatch(setIsJoinSubsessionConfirm(true));
      }
      if (currentSubRoom.subsessionId !== subsessionId) {
        dispatch(setIsJoinSubsessionConfirm(true));
      }
    },
    [currentSubRoom.subsessionId, currentSubRoom.userStatus, dispatch],
  );
  useParticipantsChange(client, onMainSessionUserChange);

  const onSubsessionAskForHelp = useCallback(
    ({ userId, displayName, subsessionName, subsessionId }: any) => {
      dispatch(
        setInviter({
          inviterId: userId,
          inviterName: displayName,
          inviterSubsessionName: subsessionName,
          inviterSubsessionId: subsessionId,
        }),
      );
      dispatch(setIsAskSubsessionHelpConfirm(true));
    },
    [dispatch],
  );

  const onSubsessionAskForHelpResponse = useCallback(
    ({ result }: any) => {
      switch (result) {
        case AskHostHelpResponse.Received:
          enqueueSnackbar(t("subsession.ask_for_help_response_received"), { variant: "info" });
          break;
        case AskHostHelpResponse.Busy:
          enqueueSnackbar(t("subsession.ask_for_help_response_busy"), { variant: "info" });
          break;
        case AskHostHelpResponse.Ignore:
          enqueueSnackbar(t("subsession.ask_for_help_response_ignore"), { variant: "info" });
          break;
        case AskHostHelpResponse.AlreadyInRoom:
          enqueueSnackbar(t("subsession.ask_for_help_response_already_in_room"), { variant: "info" });
          break;
        default:
          break;
      }
    },
    [t],
  );

  useEffect(() => {
    client.on("room-state-change", onRoomStateChange);

    // client.on("connection-change", onMainSessionUserChange);
    client.on("subsession-ask-for-help", onSubsessionAskForHelp);
    client.on("subsession-ask-for-help-response", onSubsessionAskForHelpResponse);
    client.on("subsession-invite-to-join", onSubsessionInviteToJoin);
    client.on("main-session-user-updated", onMainSessionUserChange);
    client.on("room-countdown", onRoomCountdown);
    client.on("closing-room-countdown", onRoomCountdown);
    client.on("broadcast-message", onBroadcastMessage);
    client.on("invite-back-to-main-session", onInviteBackToMainSession);
    return () => {
      client.off("room-state-change", onRoomStateChange);
      // client.on("connection-change", onMainSessionUserChange);
      client.off("main-session-user-updated", onMainSessionUserChange);
      client.off("room-countdown", onRoomCountdown);
      client.off("closing-room-countdown", onRoomCountdown);
      client.off("broadcast-message", onBroadcastMessage);
      client.off("invite-back-to-main-session", onInviteBackToMainSession);
      client.off("subsession-invite-to-join", onSubsessionInviteToJoin);
      client.off("subsession-ask-for-help", onSubsessionAskForHelp);
      client.off("subsession-ask-for-help-response", onSubsessionAskForHelpResponse);
    };
  }, [
    client,
    onRoomStateChange,
    onMainSessionUserChange,
    onRoomCountdown,
    onBroadcastMessage,
    onInviteBackToMainSession,
    onSubsessionAskForHelp,
    onSubsessionAskForHelpResponse,
    onSubsessionInviteToJoin,
  ]);
};
