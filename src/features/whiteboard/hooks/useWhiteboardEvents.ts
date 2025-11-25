import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Participant, SessionClient, WhiteboardClient } from "../../../types";
import { AppDispatch } from "../../../store/store";
import {
  setWhiteboardStatus,
  updateWhiteboardInfo,
  setWhiteboardOpen,
  setWhiteboardLoading,
  WHITEBOARD_STATUS,
} from "../whiteboardSlice";
import { useAppSelector, useWhiteboardSelector } from "@/hooks/useAppSelector";
import { WHITEBOARD_CONTAINER_INNER_ID } from "../constant";

export const useWhiteboardEvents = (client: SessionClient, whiteboardClient: WhiteboardClient) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading: isWhiteboardLoading, isDisableExport } = useAppSelector(useWhiteboardSelector);
  useEffect(() => {
    if (!client || !whiteboardClient) {
      return;
    }

    const handleWhiteboardStatusChange = (payload: WHITEBOARD_STATUS) => {
      switch (payload) {
        case WHITEBOARD_STATUS.Pending:
          dispatch(setWhiteboardStatus(WHITEBOARD_STATUS.Pending));
          dispatch(setWhiteboardLoading(true));
          break;
        case WHITEBOARD_STATUS.InProgress: {
          dispatch(setWhiteboardStatus(WHITEBOARD_STATUS.InProgress));
          dispatch(setWhiteboardLoading(false));
          dispatch(setWhiteboardOpen(true));
          const presenter: Participant = whiteboardClient.getWhiteboardPresenter();
          dispatch(
            updateWhiteboardInfo({
              presenterID: presenter.userId,
            }),
          );
          break;
        }
        case WHITEBOARD_STATUS.Closed:
          dispatch(setWhiteboardStatus(WHITEBOARD_STATUS.Closed));
          dispatch(setWhiteboardOpen(false));
          dispatch(setWhiteboardLoading(false));
          dispatch(
            updateWhiteboardInfo({
              presenterID: 0,
              docId: "",
              docName: "",
            }),
          );
          break;
        default:
          break;
      }
    };

    // const handleWhiteboardPrivilegeChange = (payload: any) => {
    //   if (payload?.isLock !== undefined) {
    //     dispatch(setIsLockWhiteboard(payload.isLock));
    //   }
    // };

    const handlePeerWhiteboardStatusChange = async (payload: any) => {
      const { action, userId } = payload;
      if (action === "Start") {
        // Another user started presenting whiteboard
        await whiteboardClient.startWhiteboardView(document.getElementById(WHITEBOARD_CONTAINER_INNER_ID), userId, {
          isDisableExport,
        });
      } else if (action === "Stop") {
        // Presenter stopped sharing whiteboard
        await whiteboardClient.stopWhiteboardView();
        dispatch(setWhiteboardStatus(WHITEBOARD_STATUS.Closed));
        dispatch(setWhiteboardOpen(false));
        dispatch(setWhiteboardLoading(false));
        dispatch(
          updateWhiteboardInfo({
            presenterID: 0,
            docId: "",
            docName: "",
          }),
        );
      }
    };

    // Add event listeners to the main client (not whiteboard client)
    try {
      client.on("whiteboard-status-change", handleWhiteboardStatusChange);
      client.on("peer-whiteboard-state-change", handlePeerWhiteboardStatusChange);
      return () => {
        // Cleanup event listeners
        client.off("whiteboard-status-change", handleWhiteboardStatusChange);
        client.off("peer-whiteboard-state-change", handlePeerWhiteboardStatusChange);
      };
    } catch (error) {
      // Silent error handling
    }
  }, [client, dispatch, whiteboardClient, isWhiteboardLoading, isDisableExport]);
};
