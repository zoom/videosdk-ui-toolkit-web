import { createContext, useContext, useMemo, useRef, type MutableRefObject, type ReactNode } from "react";

type ShareRemoteControlTargetContextValue = {
  remoteControlTargetRef: MutableRefObject<HTMLElement | null>;
  setRemoteControlTarget: (target: HTMLElement | null) => void;
};

const ShareRemoteControlTargetContext = createContext<ShareRemoteControlTargetContextValue | null>(null);

export const ShareRemoteControlTargetProvider = ({ children }: { children: ReactNode }) => {
  const remoteControlTargetRef = useRef<HTMLElement | null>(null);

  const value = useMemo(
    () => ({
      remoteControlTargetRef,
      setRemoteControlTarget: (target: HTMLElement | null) => {
        remoteControlTargetRef.current = target;
      },
    }),
    [],
  );

  return <ShareRemoteControlTargetContext.Provider value={value}>{children}</ShareRemoteControlTargetContext.Provider>;
};

export const useShareRemoteControlTarget = () => useContext(ShareRemoteControlTargetContext);
