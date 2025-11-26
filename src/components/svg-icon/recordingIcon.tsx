import React from "react";

const RecordingIcon = ({ size = "md", className = "", color = "black" }) => {
  // Tailwind classes for different sizes
  const sizes = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <svg className={`${sizeClass} ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 532 532">
      <defs>
        <style>
          {`.a{isolation:isolate;}
            .b{opacity:0.75;mix-blend-mode:multiply;}
            .c{fill:none;}
            .d{fill:none;stroke:${color};stroke-miterlimit:10;stroke-width:18px;}
            .e{fill:gray;}`}
        </style>
      </defs>
      <g className="a">
        <rect className="c" x="7.84" y="7.84" width="503" height="503" rx="89.7" />
        <circle className="d" cx="267.84" cy="259.84" r="175" />
        <circle className="e" cx="268.34" cy="260.34" r="131.5" />
      </g>
    </svg>
  );
};

export default RecordingIcon;
