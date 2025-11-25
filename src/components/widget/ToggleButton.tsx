import React, { forwardRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ControlButton from "./ControlButton";

export interface ToggleButtonProps {
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
  onChevronUpClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  isLoading?: boolean;
  activeButton?: JSX.Element | null;
  menuContent?: React.ReactNode | null;
  iconColor?: string;
  isShowChevron?: boolean;
  isWarning?: boolean;
  title: string;
  iconClassName?: string;
  optionClassName?: string;
  bgColor?: string;
  chevronUpColor?: string;
  hoverColor?: string;
  id?: string;
  themeName?: string;
  orientation?: "horizontal" | "vertical";
}

const ToggleButton = forwardRef<HTMLDivElement, ToggleButtonProps>((props, ref) => {
  const {
    icon,
    isActive,
    onClick,
    disabled,
    isLoading,
    onChevronUpClick,
    activeButton,
    menuContent,
    iconColor,
    isShowChevron = true,
    isWarning = false,
    title = "",
    iconClassName = "",
    optionClassName = "",
    bgColor,
    chevronUpColor = "black",
    hoverColor,
    id = "",
    orientation = "horizontal",
    themeName,
  } = props;

  // const bgGroupColor = themeName === "dark" ? "bg-gray-800" : "bg-gray-200";
  // const bgGroupColorHover = themeName === "dark" ? "hover:bg-gray-900" : "hover:bg-gray-300";
  const bgGroupColor = "bg-theme-surface border border-theme-border";
  const bgGroupColorHover = "hover:bg-theme-background";

  const controlButtonClassName = hoverColor ? hoverColor : `${iconClassName} ${bgGroupColorHover}`;

  return (
    <div className="relative" ref={ref} id={id}>
      <div
        className={`flex items-center ${orientation === "vertical" ? "rounded-lg" : "rounded-full"} overflow-hidden ${
          bgColor ? bgColor : bgGroupColor
        }`}
      >
        {activeButton}
        {!activeButton && (
          <ControlButton
            icon={icon}
            isActive={isActive}
            onClick={onClick}
            disabled={disabled}
            isLoading={isLoading}
            className={optionClassName}
            iconColor={iconColor}
            title={title}
            hoverColor={controlButtonClassName}
            orientation={orientation}
            id={`${id}-button`}
          />
        )}
        {isShowChevron && <div className="w-px h-4 bg-gray-300"></div>}
        {isShowChevron && (
          <ControlButton
            icon={orientation === "vertical" ? ChevronDown : ChevronUp}
            isActive={true}
            onClick={onChevronUpClick}
            disabled={disabled || !!isLoading || isWarning}
            className={optionClassName}
            title={`${title}-option`}
            iconColor={chevronUpColor}
            hoverColor={controlButtonClassName}
            id={`${id}-chevron`}
            orientation={orientation}
          />
        )}
        {isShowChevron && menuContent}
      </div>
    </div>
  );
});

export default ToggleButton;
