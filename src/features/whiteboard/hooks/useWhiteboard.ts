import { useCallback, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import {
  setWhiteboardStatus,
  updateWhiteboardInfo,
  setWhiteboardOpen,
  setWhiteboardLoading,
  setWhiteboardError,
  setWhiteboardDocument,
  resetWhiteboard,
  WHITEBOARD_STATUS,
  WHITEBOARD_PRIVILEGE,
} from "../whiteboardSlice";
import { ClientContext } from "@/context/client-context";
import { SessionClient, SessionStatus } from "@/types/index.d";
import SessionAdditionalClientContext from "@/context/session-additional-context";

export const useWhiteboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const client = useContext(ClientContext) as SessionClient;
  const whiteboardState = useSelector((state: RootState) => state.whiteboard);
  const sessionState = useSelector((state: RootState) => state.session);
  const { whiteboardClient } = useContext(SessionAdditionalClientContext);

  // Auto-initialize whiteboard when session is connected and whiteboard is enabled
  useEffect(() => {
    const initializeWhiteboard = async () => {
      // Check if session is connected
      if (sessionState.status !== SessionStatus.Connected) return;

      // Check if client is available
      if (!client) return;

      if (!whiteboardClient) return;

      // Check if whiteboard is enabled in SDK
      const status = whiteboardClient.isWhiteboardEnabled();
      if (!status) return;
    };

    initializeWhiteboard();
  }, [client, whiteboardClient, whiteboardState.status, sessionState.status, sessionState.featuresOptions]);

  // Reset state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetWhiteboard());
    };
  }, [dispatch]);
};
