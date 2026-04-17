import { useEffect, useState, useRef, useCallback } from "react";

export type FooterButtonId =
  | "whiteboard"
  | "record"
  | "realTimeMediaStreams"
  | "participants"
  | "chat"
  | "caption"
  | "subsession"
  | "subsessionHelp";

interface UseResponsiveFooterProps {
  containerRef: React.RefObject<HTMLDivElement>;
  enabledButtons: FooterButtonId[];
  orientation?: "horizontal" | "vertical";
}

interface ResponsiveFooterState {
  visibleButtons: Set<FooterButtonId>;
  overflowButtons: FooterButtonId[];
}

const BUTTON_APPROXIMATE_WIDTH = 70;
const ALWAYS_VISIBLE_WIDTH = 450;
const SAFETY_MARGIN = 50;

/**
 * Custom hook to manage responsive footer button visibility
 * Automatically moves buttons to overflow menu when space is limited
 * Always keeps Audio, Video, and Share buttons visible
 */
export function useResponsiveFooter({
  containerRef,
  enabledButtons,
  orientation = "horizontal",
}: UseResponsiveFooterProps): ResponsiveFooterState {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [state, setState] = useState<ResponsiveFooterState>({
    visibleButtons: new Set(enabledButtons),
    overflowButtons: [],
  });

  const isMountedRef = useRef(true);

  // Calculate which buttons should be visible based on available width
  const calculateVisibleButtons = useCallback(
    (availableWidth: number): ResponsiveFooterState => {
      // Vertical orientation shows all buttons
      if (orientation === "vertical") {
        return {
          visibleButtons: new Set(enabledButtons),
          overflowButtons: [],
        };
      }

      // If container is very narrow, hide all overflow buttons
      if (availableWidth < ALWAYS_VISIBLE_WIDTH) {
        return {
          visibleButtons: new Set(),
          overflowButtons: [...enabledButtons],
        };
      }

      // Calculate available space for overflow buttons
      const availableSpace = availableWidth - ALWAYS_VISIBLE_WIDTH - SAFETY_MARGIN;
      const maxVisibleButtons = Math.max(0, Math.floor(availableSpace / BUTTON_APPROXIMATE_WIDTH));

      const visibleButtons = new Set<FooterButtonId>();
      const overflowButtons: FooterButtonId[] = [];

      // Determine which buttons fit (in priority order)
      enabledButtons.forEach((buttonId, index) => {
        if (index < maxVisibleButtons) {
          visibleButtons.add(buttonId);
        } else {
          overflowButtons.push(buttonId);
        }
      });

      return { visibleButtons, overflowButtons };
    },
    [enabledButtons, orientation],
  );

  // Setup ResizeObserver to track container width changes
  useEffect(() => {
    isMountedRef.current = true;
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (!isMountedRef.current) return;

      for (const entry of entries) {
        const { width } = entry.contentRect;
        setContainerWidth(width);
      }
    });

    resizeObserver.observe(container);

    // Initial measurement
    const initialWidth = container.offsetWidth;
    if (initialWidth > 0) {
      setContainerWidth(initialWidth);
    }

    return () => {
      isMountedRef.current = false;
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  // Recalculate visible buttons when width or enabled buttons change
  useEffect(() => {
    if (containerWidth > 0) {
      const newState = calculateVisibleButtons(containerWidth);
      setState(newState);
    }
  }, [containerWidth, calculateVisibleButtons]);

  return state;
}
