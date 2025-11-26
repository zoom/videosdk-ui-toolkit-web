import { isMobileDeviceNotIpad } from "@/components/util/service";
import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { setSpotlightUserList } from "@/store/sessionSlice";
import { setViewType } from "@/store/uiSlice";
import { useEffect, useCallback, useContext } from "react";

export const useSpotlight = () => {
  const client = useContext(ClientContext);
  const { stream } = useContext(StreamContext);
  const { isSupportMultipleVideos, isSendingScreenShare, isReceivingScreenShare } = useAppSelector(useSessionSelector);
  const dispatch = useAppDispatch();

  const isScreenSharing = isSendingScreenShare || isReceivingScreenShare;

  const onSpotlightChange = useCallback(
    (payload: { spotlightList: Array<number> }) => {
      if (stream) {
        const spotlightList = stream.getSpotlightedUserList();
        dispatch(setSpotlightUserList(spotlightList));
        if (spotlightList.length > 0 && isSupportMultipleVideos && !isScreenSharing && !isMobileDeviceNotIpad()) {
          dispatch(setViewType("speaker"));
        }
      }
    },
    [dispatch, isScreenSharing, isSupportMultipleVideos, stream],
  );

  useEffect(() => {
    client.on("video-spotlight-change", onSpotlightChange);
    return () => {
      client.off("video-spotlight-change", onSpotlightChange);
    };
  });
};
