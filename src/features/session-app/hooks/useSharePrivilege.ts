import { useCallback, useEffect } from "react";
import { SessionClient } from "@/types";
import { SharePrivilege } from "@zoom/videosdk";
import { setSharePrivilege } from "@/store/sessionSlice";

export function useSharePrivilege(client: SessionClient, sessionDispatch: React.Dispatch<any>) {
  const onPrivilegeChange = useCallback(
    ({ privilege }: { privilege: SharePrivilege }) => {
      sessionDispatch(setSharePrivilege(privilege));
    },
    [sessionDispatch],
  );
  useEffect(() => {
    client.on("share-privilege-change", onPrivilegeChange);
    return () => {
      client.off("share-privilege-change", onPrivilegeChange);
    };
  }, [client, onPrivilegeChange]);

  useEffect(() => {
    const stream = client?.getMediaStream();
    if (stream) {
      sessionDispatch(setSharePrivilege(stream.getSharePrivilege()));
    }
  }, [client, sessionDispatch]);
}
