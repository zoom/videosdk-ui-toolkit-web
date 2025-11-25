import { useState, useEffect, useCallback } from "react";

/**
 * Helper hook function that helps any pop-up element properly focus when their visibility is toggled
 * This is designed to help such components meet a11y requirements, and address common timing problems
 * like with inconsistent painting frames with Poppers
 *
 * Warning: the element passed into `refCallback` MUST be focusable. Setting `tabIndex` is a good start
 */
export function usePopupFocus(isOpen: boolean) {
  const [hasBeenFocused, setHasBeenFocused] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasBeenFocused(false);
    }
  }, [isOpen]);

  const refCallback = useCallback(
    (element: HTMLElement) => {
      if (element && !hasBeenFocused) {
        element.focus();
        setHasBeenFocused(true);
      }
    },
    [hasBeenFocused],
  );

  return { refCallback };
}
