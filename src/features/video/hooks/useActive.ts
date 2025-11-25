import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { setActiveSpeakerId } from "@/store/sessionSlice";
import { useState, useEffect, useCallback, useContext } from "react";

export const useActive = () => {
  const [activeUser, setActiveUser] = useState(0);

  const { stream } = useContext(StreamContext);
  const client = useContext(ClientContext);
  const dispatch = useAppDispatch();
  const onActiveVideo = useCallback(
    (payload: any) => {
      const { userId } = payload;
      setActiveUser(userId);
      dispatch(setActiveSpeakerId(userId));
    },
    [dispatch],
  );

  useEffect(() => {
    if (stream) {
      const activeUser = stream.getActiveVideoId();
      setActiveUser(activeUser);
      dispatch(setActiveSpeakerId(activeUser));
    }
  }, [dispatch, stream]);

  useEffect(() => {
    client.on("video-active-change", onActiveVideo);
    return () => {
      client.off("video-active-change", onActiveVideo);
    };
  });

  return activeUser;
};
