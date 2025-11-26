import React, { forwardRef, useState } from "react";
import { LucideIcon } from "lucide-react";

interface IconCountButtonProps {
  icon: LucideIcon;
  count?: number;
  isActive: boolean;
  onClick: () => void;
  id?: string;
  countId?: string;
  themName?: string;
  iconSize?: number;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export const IconCountButton = forwardRef<HTMLButtonElement, IconCountButtonProps>(
  (
    {
      icon: Icon,
      count,
      isActive,
      onClick,
      id = "",
      countId = "",
      themName = "light",
      iconSize = 20,
      className = "",
      orientation = "horizontal",
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const displayCount = count > 99 ? "99+" : count;
    const colorClass = themName === "dark" ? "white" : "black";
    return (
      <button
        className={`flex items-center space-x-1 px-3 py-2 ${
          orientation === "vertical" ? "rounded-lg w-full justify-center" : "rounded-full"
        } transition-all duration-300 border border-theme-border bg-theme-surface 
        ${isActive ? "bg-blue-500 hover:bg-blue-600 text-theme-text" : isHovered ? "hover:bg-theme-background" : "text-theme-background"} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        id={id}
        ref={ref}
      >
        <Icon size={iconSize} color={colorClass} />
        {count > 0 && (
          <span className={`text-sm font-medium text-${colorClass}`} id={countId}>
            {displayCount}
          </span>
        )}
      </button>
    );
  },
);
