import { useRef } from "react";

export function usePersistFn(fn: () => void) {
  const fnRef = useRef<() => void>(fn);
  fnRef.current = fn;
  const persistFn = useRef<() => void>();
  if (!persistFn.current) {
    persistFn.current = function (...args: any) {
      return fnRef.current.apply(this, args);
    };
  }
  return persistFn.current;
}
