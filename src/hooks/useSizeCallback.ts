import { isIPad, isSafariOnIOS } from "@/components/util/service";
import { useLayoutEffect } from "react";
interface ResizeObserverEntry {
  target: Element;
}
type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void;
export declare class ResizeObserver {
  public constructor(callback: ResizeObserverCallback);
  public observe(target: Element): void;
  public unobserve(target: Element): void;
  public disconnect(): void;
}

export function useSizeCallback(
  target: HTMLElement | null,
  callback: (payload: { width: number; height: number }) => void,
) {
  useLayoutEffect(() => {
    if (!target) {
      return () => {
        //
      };
    }

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        callback({
          width: entry.target.clientWidth,
          height: entry.target.clientHeight,
        });
      });
    });
    resizeObserver.observe(target);
    return () => {
      resizeObserver.unobserve(target);
      resizeObserver.disconnect();
    };
  }, [target, callback]);
}

export function useWindowSizeCallback(callback: (payload: { width: number; height: number }) => void) {
  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        let dimension = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        if (isIPad() || isSafariOnIOS()) {
          dimension = {
            width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
          };
        }
        callback(dimension);
      });
    });
    // eslint-disable-next-line prefer-destructuring
    const target = document.getElementsByTagName("body")[0];

    resizeObserver.observe(target);
    return () => {
      resizeObserver.unobserve(target);
      resizeObserver.disconnect();
    };
  }, [callback]);
}
