import React, { useState, useEffect, useRef, useCallback } from "react";
import Draggable from "react-draggable";

interface DraggableBarProps {
  children: JSX.Element;
  contentRef: React.MutableRefObject<HTMLDivElement>;
}

const DraggableBar = (props: DraggableBarProps) => {
  const { children, contentRef } = props;
  const [bounds, setBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const nodeRef = useRef(null);

  const measureChildren = useCallback(() => {
    if (contentRef.current) {
      const { width, height } = contentRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [contentRef]);

  const updateBoundsAndPosition = useCallback(() => {
    const draggableHeight = Math.max(370, window.innerHeight - 130);
    const newBounds = {
      left: 0,
      top: 0,
      right: window.innerWidth - dimensions.width,
      bottom: draggableHeight - dimensions.height,
    };

    setBounds(newBounds);

    // Reposition if out of bounds
    setPosition((prevPosition) => ({
      x: Math.min(Math.max(prevPosition.x, newBounds.left), newBounds.right),
      y: Math.min(Math.max(prevPosition.y, newBounds.top), newBounds.bottom),
    }));
  }, [dimensions]);

  useEffect(() => {
    measureChildren();
  }, [children, measureChildren]);

  useEffect(() => {
    setPosition({ x: (window.innerWidth - dimensions.width) / 2, y: 10 });
  }, [dimensions]);

  useEffect(() => {
    updateBoundsAndPosition();
    window.addEventListener("resize", updateBoundsAndPosition);

    return () => {
      window.removeEventListener("resize", updateBoundsAndPosition);
    };
  }, [updateBoundsAndPosition]);

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable bounds={bounds} position={position} onDrag={handleDrag} nodeRef={nodeRef}>
      <div ref={nodeRef} style={{ zIndex: 9999 }}>
        {children}
      </div>
    </Draggable>
  );
};

export default DraggableBar;
