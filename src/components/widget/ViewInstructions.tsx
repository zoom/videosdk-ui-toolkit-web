import React from "react";
import { Button } from "./CommonButton";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { setIsShowAVLearnDialog } from "@/store/uiSlice";

interface ViewInstructionsProps {
  /** Button size variant */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Button color variant */
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "link" | "outline";
  /** Color inheritance for certain variants */
  color?: "inherit" | string;
  /** Additional CSS classes */
  className?: string;
  /** Custom click handler - if provided, overrides default behavior */
  onClick?: () => void;
  /** Custom text - defaults to "View Instructions" */
  children?: React.ReactNode;
  /** Optional callback after dialog is shown */
  onDialogShow?: () => void;
}

/**
 * ViewInstructions - Reusable component for showing audio/video permission instructions
 *
 * This component provides a consistent button for opening the AV Learn dialog
 * across the application. It automatically dispatches the action to show the
 * permission instructions dialog.
 */
export const ViewInstructions: React.FC<ViewInstructionsProps> = ({
  size = "md",
  variant = "primary",
  color,
  className = "",
  onClick,
  children = "View Instructions",
  onDialogShow,
}) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      dispatch(setIsShowAVLearnDialog(true));
      onDialogShow?.();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      onClick={handleClick}
      className={`font-semibold whitespace-nowrap rounded-md ${className}`}
    >
      {children}
    </Button>
  );
};

export default ViewInstructions;
