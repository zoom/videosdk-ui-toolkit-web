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
}) => {
  const baseClasses = `flex items-center justify-center ${
    orientation === "vertical" ? "w-10 h-10" : "w-10 h-10"
  } focus:outline-none transition-colors duration-200 ${showBorder ? "border border-theme-border" : ""}`;
  const activeClasses = "text-gray-700";

  const hoverClasses = !disabled && !isLoading && hoverColor;
  const disabledClasses = disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const color = isActive ? "black" : disabled ? "#9CA3AF" : "black";
  return (
    <button
      className={`${baseClasses} ${activeClasses} ${hoverClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      title={title}
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
        </>
      )}
    </button>
  );
};

export default ControlButton;
