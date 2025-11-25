import { useEffect, useState, useCallback, MutableRefObject } from "react";

/* Hook for handling draggable. The draggable div should be styled fixed like the below example
```
<div
    className="fixed"
    style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
    }}
/>
```
*/
export const useDrag = (contentRef: MutableRefObject<HTMLDivElement>, initPosition?: { x?: number; y?: number }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewBounds, setViewBounds] = useState({ width: 0, height: 0 });
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const centerWindow = () => {
      if (contentRef.current) {
        const windowWidth = contentRef.current.offsetWidth;
        const windowHeight = contentRef.current.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        setViewBounds({ width: viewportWidth, height: viewportHeight });
        setContentSize({ width: windowWidth, height: windowHeight });
        setPosition({
          x: initPosition?.x || (viewportWidth - windowWidth) / 2,
          y: initPosition?.y || (viewportHeight - windowHeight) / 2,
        });
      }
    };

    centerWindow();
    window.addEventListener("resize", centerWindow);
    return () => window.removeEventListener("resize", centerWindow);
  }, [contentRef, initPosition]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        if (newX < 0) {
          newX = 0;
        } else if (newX > viewBounds.width - contentSize.width) {
          newX = viewBounds.width - contentSize.width;
        }
        if (newY < 0) {
          newY = 0;
        } else if (newY > viewBounds.height - contentSize.height) {
          newY = viewBounds.height - contentSize.height;
        }
        setPosition({
          x: newX,
          y: newY,
        });
      }
    },
    [dragOffset, isDragging, viewBounds, contentSize],
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, isDragging]);

  return {
    position,
    handleMouseDown,
  };
};
