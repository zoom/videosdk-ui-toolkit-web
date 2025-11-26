import React, { useState, useRef, useEffect } from "react";

const CircularSlider = ({
  value = 0,
  onChange = (value: number) => {},
  min = 0,
  max = 100,
  threshold = null,
  width = 200,
  height = 200,
  radius = null,
  strokeWidth = 12,
  knobRadius = 16,
  trackColor = "#e5e7eb",
  progressColor = "url(#gradient)",
  thresholdColor = "#ef4444",
  knobColor = "white",
  knobStrokeColor = "#3b82f6",
  showValue = true,
  showThreshold = false,
  disabled = false,
  valueText = null,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);

  // Calculate center and radius based on dimensions
  const centerX = width / 2;
  const centerY = height / 2;
  const calculatedRadius = radius || Math.min(width, height) / 2 - strokeWidth - knobRadius;

  // Calculate angle from value (0-360 degrees)
  const valueToAngle = (val) => {
    const percentage = (val - min) / (max - min);
    return percentage * 360 - 90; // -90 to start from top
  };

  // Calculate value from angle
  const angleToValue = (angle) => {
    let normalizedAngle = (angle + 90) % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;
    const percentage = normalizedAngle / 360;
    // return Math.round(min + percentage * (max - min));
    const value = min + percentage * (max - min);
    return Number(value.toFixed(2));
  };

  // Get position on circle from angle
  const getPositionFromAngle = (angle) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + calculatedRadius * Math.cos(radian),
      y: centerY + calculatedRadius * Math.sin(radian),
    };
  };

  // Handle mouse/touch position
  const handlePosition = (clientX, clientY) => {
    if (!svgRef.current || disabled) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;

    const angle = Math.atan2(y, x) * (180 / Math.PI);
    let newValue = angleToValue(angle);

    // Apply threshold limit if set
    if (threshold !== null && threshold !== undefined) {
      newValue = Math.min(newValue, threshold);
    }

    onChange(newValue);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsDragging(true);
    handlePosition(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || disabled) return;
    handlePosition(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events
  const handleTouchStart = (e) => {
    if (disabled) return;
    setIsDragging(true);
    // eslint-disable-next-line prefer-destructuring
    const touch = e.touches[0];
    handlePosition(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || disabled) return;
    // eslint-disable-next-line prefer-destructuring
    const touch = e.touches[0];
    handlePosition(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add global listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const angle = valueToAngle(value);
  const knobPosition = getPositionFromAngle(angle);

  // Calculate threshold angle and position if threshold is set
  const thresholdAngle = threshold !== null && threshold !== undefined ? valueToAngle(threshold) : null;
  const thresholdPosition = thresholdAngle !== null ? getPositionFromAngle(thresholdAngle) : null;

  // Create arc path for progress
  const createArcPath = () => {
    const startAngle = -90;
    const endAngle = angle;
    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

    const start = getPositionFromAngle(startAngle);
    const end = getPositionFromAngle(endAngle);

    if (Math.abs(endAngle - startAngle) < 0.01) return "";

    return `M ${start.x} ${start.y} A ${calculatedRadius} ${calculatedRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className={`select-none ${disabled ? "opacity-50" : "cursor-pointer"}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Background circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={calculatedRadius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Progress arc */}
      <path d={createArcPath()} fill="none" stroke={progressColor} strokeWidth={strokeWidth} strokeLinecap="round" />

      {/* Threshold indicator */}
      {showThreshold && threshold !== null && threshold !== undefined && thresholdPosition && (
        <>
          {/* Threshold line */}
          {/* <line
            x1={centerX}
            y1={centerY}
            x2={thresholdPosition.x}
            y2={thresholdPosition.y}
            stroke={thresholdColor}
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.6"
          /> */}
          {/* Threshold marker dot */}
          <circle cx={thresholdPosition.x} cy={thresholdPosition.y} r={4} fill={thresholdColor} />
        </>
      )}

      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* Knob */}
      <circle
        cx={knobPosition.x}
        cy={knobPosition.y}
        r={knobRadius}
        fill={knobColor}
        stroke={knobStrokeColor}
        strokeWidth="3"
        className={`${isDragging && !disabled ? "scale-110" : ""} transition-transform drop-shadow-lg`}
        style={{ cursor: disabled ? "default" : isDragging ? "grabbing" : "grab" }}
      />

      {/* Center text */}
      {showValue && (
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className={valueText ? "text-xs font-bold pointer-events-none" : "text-3xl font-bold pointer-events-none"}
          fill="var(--color-text)"
          style={
            valueText
              ? { fontSize: `${Math.min(width, height) / 15}px` }
              : { fontSize: `${Math.min(width, height) / 6}px` }
          }
        >
          {/* {value} */}
          {!valueText && (
            <tspan x={centerX} dy="0em">
              {value.toFixed(2)}
            </tspan>
          )}
          {valueText && (
            <>
              <tspan x={centerX} dy="-0.6em">
                {valueText}
              </tspan>
              <tspan x={centerX} dy="1.2em">
                {value.toFixed(2)}
              </tspan>
            </>
          )}
        </text>
      )}
    </svg>
  );
};

export default CircularSlider;
