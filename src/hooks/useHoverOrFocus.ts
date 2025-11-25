import { useState, MutableRefObject } from "react";
import { useEventListener } from "./useEventListener";
interface HoverOrFocusOption {
  onEnter?: () => void;
  onLeave?: () => void;
}
export function useHoverOrFocus(ref: MutableRefObject<HTMLElement | null>, options?: HoverOrFocusOption) {
  const [isHoverOrFocus, setIsHoverOrFocus] = useState(false);
  const { onEnter, onLeave } = options || {};
  useEventListener(ref, "mouseenter", () => {
    onEnter?.();
    setIsHoverOrFocus(true);
  });
  useEventListener(ref, "mouseleave", () => {
    onLeave?.();
    setIsHoverOrFocus(false);
  });
  useEventListener(ref, "focusin", () => {
    onEnter?.();
    setIsHoverOrFocus(true);
  });
  useEventListener(ref, "focusout", () => {
    onLeave?.();
    setIsHoverOrFocus(false);
  });
  return isHoverOrFocus;
}
