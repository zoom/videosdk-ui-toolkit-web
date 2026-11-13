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
  /**
   * Secondary count rendered as a badge on the icon, for things needing attention (e.g. people
   * waiting to be admitted). Kept separate from `count`, which is the button's primary figure.
   */
  badgeCount?: number;
  /** Accessible name. Icon-only buttons are unusable without one. */
  ariaLabel?: string;
  badgeAriaLabel?: string;
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
      badgeCount = 0,
      ariaLabel,
      badgeAriaLabel,
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const displayCount = count > 99 ? "99+" : count;
    const displayBadgeCount = badgeCount > 99 ? "99+" : badgeCount;
    const colorClass = themName === "dark" ? "white" : "black";
    // `aria-label` replaces the button's text, so the visible count and the waiting badge have to
    // be part of the name. The badge is hidden from assistive tech in that case: a live region
    // nested inside a button is not announced reliably, and the name already carries the count.
    const accessibleName = ariaLabel
      ? [ariaLabel, count > 0 ? String(displayCount) : undefined, badgeCount > 0 ? badgeAriaLabel : undefined]
          .filter((part): part is string => Boolean(part))
          .join(", ")
      : undefined;
    return (
      <button
        className={`relative flex items-center space-x-1 px-3 py-2 ${
          orientation === "vertical" ? "rounded-lg w-full justify-center" : "rounded-full"
        } transition-all duration-300 border border-theme-border bg-theme-surface
        ${isActive ? "bg-blue-500 hover:bg-blue-600 text-theme-text" : isHovered ? "hover:bg-theme-background" : "text-theme-background"} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        id={id}
        ref={ref}
        aria-label={accessibleName}
      >
        <Icon size={iconSize} color={colorClass} />
        {count > 0 && (
          <span className={`text-sm font-medium text-${colorClass}`} id={countId}>
            {displayCount}
          </span>
        )}
        {badgeCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-semibold"
            aria-hidden={accessibleName ? true : undefined}
          >
            {displayBadgeCount}
          </span>
        )}
      </button>
    );
  },
);
