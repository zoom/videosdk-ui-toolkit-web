import React from "react";
import { Loader } from "lucide-react";

interface ControlButtonProps {
  icon: React.ElementType;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  iconColor?: string;
  title?: string;
  hoverColor?: string;
  count?: number;
  id?: string;
  showBorder?: boolean;
  orientation?: "horizontal" | "vertical";
  /**
   * Secondary count rendered as a badge on the icon, for things needing attention (e.g. people
   * waiting to be admitted). Kept separate from `count`, the button's primary figure.
   */
  badgeCount?: number;
  badgeAriaLabel?: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  icon: Icon,
  isActive,
  onClick,
  disabled,
  isLoading,
  className,
  iconColor,
  title,
  hoverColor = "hover:bg-gray-200",
  count,
  id = "",
  showBorder = false,
  orientation = "horizontal",
  badgeCount = 0,
  badgeAriaLabel,
}) => {
  const baseClasses = `relative flex items-center justify-center ${
    orientation === "vertical" ? "w-10 h-10" : "w-10 h-10"
  } border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors duration-200 ${showBorder ? "border-theme-border" : ""}`;
  const activeClasses = "text-gray-700";

  const hoverClasses = !disabled && !isLoading && hoverColor;
  const disabledClasses = disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const color = isActive ? "black" : disabled ? "#9CA3AF" : "black";
  const displayCount = count > 0 ? (count > 99 ? "99+" : String(count)) : undefined;
  const displayBadgeCount = badgeCount > 99 ? "99+" : badgeCount;
  // Only override the name when a badge label is passed. `aria-label` replaces the button text,
  // so the visible count has to be included. Other buttons keep `title` alone.
  const accessibleName =
    badgeAriaLabel && title
      ? [title, displayCount, badgeCount > 0 ? badgeAriaLabel : undefined]
          .filter((part): part is string => Boolean(part))
          .join(", ")
      : undefined;
  return (
    <button
      className={`${baseClasses} ${activeClasses} ${hoverClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      title={title}
      aria-label={accessibleName}
      id={id}
    >
      {isLoading ? (
        <Loader size={20} className="animate-spin text-theme-text" />
      ) : (
        <>
          <Icon size={20} color={iconColor ? iconColor : color} />
          {count > 0 && (
            <span className="text-sm font-medium" id={`${id}-count`}>
              {count}
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
        </>
      )}
    </button>
  );
};

export default ControlButton;
