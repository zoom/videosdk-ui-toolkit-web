import React, { useCallback, useRef, useState, useEffect, ReactNode, CSSProperties } from "react";

export interface TouchEventData {
  event: TouchEvent;
  direction?: "left" | "right" | "";
  offsetX?: number;
}

interface SwiperProps {
  onTouchEnd?: (data: TouchEventData) => void;
  onTouchStart?: (data: TouchEventData) => void;
  onTouchMove?: (data: TouchEventData) => void;
  minTriggerWidth: number;
  children: ReactNode;
  style?: CSSProperties;
  disabled?: boolean;
  [key: string]: any; // For rest props
}

const Swiper: React.FC<SwiperProps> = ({
  onTouchEnd,
  onTouchStart,
  onTouchMove,
  minTriggerWidth,
  children,
  style,
  disabled = false,
  ...rest
}) => {
  const swiperRef = useRef<HTMLDivElement | null>(null);
  const initPositionX = useRef<number>(0);

  const [offsetLeft, setOffsetLeft] = useState<number>(0);

  const onTouchMoveCallback = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length && initPositionX.current) {
        const [{ pageX }] = event.touches;
        const offsetX = Math.round(pageX - initPositionX.current);
        setOffsetLeft(offsetX);

        if (onTouchMove) {
          onTouchMove({
            event,
            direction: Math.sign(offsetX) > 0 ? "right" : "left",
            offsetX,
          });
        }
      }
    },
    [onTouchMove],
  );

  const onTouchEndCallback = useCallback(
    (event: TouchEvent) => {
      if (onTouchEnd) {
        onTouchEnd({
          event,
          direction: Math.abs(offsetLeft) > minTriggerWidth ? (Math.sign(offsetLeft) > 0 ? "right" : "left") : "",
        });
      }

      initPositionX.current = 0;
      setOffsetLeft(0);
    },
    [offsetLeft, minTriggerWidth, onTouchEnd],
  );

  const touchStartCallback = useCallback(
    (event: TouchEvent) => {
      if (event instanceof TouchEvent) {
        // eslint-disable-next-line prefer-destructuring
        const touch = event.touches[0];
        if (touch.pageX < 20 || touch.pageX > window.innerWidth - 20) {
          event.preventDefault();
        }
      }
      event.preventDefault();

      if (event.touches.length) {
        // eslint-disable-next-line prefer-destructuring
        const { pageX } = event.touches[0];
        initPositionX.current = pageX;

        if (onTouchStart) {
          onTouchStart({ event });
        }
      }
    },
    [onTouchStart],
  );

  useEffect(() => {
    const dom = swiperRef.current;
    if (dom && !disabled) {
      dom.addEventListener("touchstart", touchStartCallback);
      dom.addEventListener("touchmove", onTouchMoveCallback);
      dom.addEventListener("touchend", onTouchEndCallback);
      dom.addEventListener("touchcancel", onTouchEndCallback);
    }
    return () => {
      if (dom && !disabled) {
        dom.removeEventListener("touchstart", touchStartCallback);
        dom.removeEventListener("touchmove", onTouchMoveCallback);
        dom.removeEventListener("touchend", onTouchEndCallback);
        dom.removeEventListener("touchcancel", onTouchEndCallback);
      }
    };
  }, [disabled, touchStartCallback, onTouchMoveCallback, onTouchEndCallback]);

  return (
    <div ref={swiperRef} style={{ left: offsetLeft, ...style }} {...rest}>
      {children}
    </div>
  );
};

export default Swiper;
