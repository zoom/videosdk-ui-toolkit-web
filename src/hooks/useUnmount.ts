import { useEffect, useRef } from "react";
export function useUnmount(fn: () => void) {
  const fnRef = useRef<() => void>(fn);
  fnRef.current = fn;
  useEffect(
    () => () => {
      if (fnRef.current) {
        fnRef.current();
      }
    },
    [],
  );
}
