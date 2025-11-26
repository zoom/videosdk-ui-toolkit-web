import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  color?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const VARIANTS = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  success: "bg-green-500 hover:bg-green-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  info: "bg-cyan-500 hover:bg-cyan-600 text-white",
  light: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  dark: "bg-gray-800 hover:bg-gray-900 text-white",
  link: "bg-transparent text-blue-500 hover:underline",
  outline: "bg-transparent border border-current hover:bg-opacity-10",
};

export type VariantType = keyof typeof VARIANTS;

const SIZES = {
  xs: "px-2 py-1 text-xs",
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
};

function getButtonStyles(variant: string, size: string, color?: string): string[] {
  const baseClass =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClass = VARIANTS[variant];
  const sizeClass = SIZES[size];

  if (variant === "outline") {
    return [baseClass, variantClass.replace("hover:", `hover:${color ? `text-${color}-500 hover:` : ""}`), sizeClass];
  }

  return [baseClass, variantClass, sizeClass];
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", icon, iconPosition = "left", color, className, ...props }, ref) => {
    const classes = getButtonStyles(variant, size, color);

    return (
      <button ref={ref} className={`${classes.join(" ")} ${className || ""}`} {...props}>
        {icon && iconPosition === "left" && <span className="mr-2 -ml-1 h-5 w-5">{React.createElement(icon)}</span>}
        {children}
        {icon && iconPosition === "right" && <span className="ml-2 -mr-1 h-5 w-5">{React.createElement(icon)}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
