import React, { useState, useEffect, useRef } from "react";
import { X, AlertCircle, CheckCircle, AlertTriangle, Info, MessageSquareText } from "lucide-react";
import { isMobileDeviceNotIpad } from "@/components/util/service";

interface DraggableToastProps {
  message: string;
  type: "info" | "success" | "warning" | "error" | "chat";
  duration?: number;
  onClose: () => void;
  onClick?: () => void;
  isVisible: boolean;
  icon?: React.ReactNode;
  id?: string;
  action?: React.ReactNode;
}

const DraggableToast: React.FC<DraggableToastProps> = ({
  message,
  type,
  isVisible,
  duration = 3000,
  onClose,
  onClick,
  icon,
  id = "",
  action,
}: {
  message: string;
  type: "info" | "success" | "warning" | "error" | "chat";
  duration?: number;
  onClose: () => void;
  onClick?: () => void;
  isVisible: boolean;
  icon?: React.ReactNode;
  id?: string;
  action?: React.ReactNode;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(isVisible);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (duration === 0) return;
    const timer = setTimeout(() => {
      setIsOpen(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  useEffect(() => {
    if (toastRef.current) {
      const rect = toastRef.current.getBoundingClientRect();
      if (isMobileDeviceNotIpad()) {
        setPosition({ x: -rect.width / 2, y: -rect.height - 60 });
      } else {
        setPosition({ x: -rect.width / 2, y: 0 });
      }
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (!isVisible) return null;

  const toastStyles = {
    info: "bg-theme-surface text-theme-text border-theme-border",
    success: "bg-theme-surface text-theme-text border-theme-border",
    warning: "bg-theme-surface text-theme-text border-theme-border",
    error: "bg-theme-surface text-theme-text border-theme-border",
  }[type];

  const iconColors = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  }[type];

  const IconComponent = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    chat: MessageSquareText,
  }[type];

  return (
    <div
      ref={toastRef}
      className={`
        ${icon ? "" : toastStyles} 
        px-4 py-2 
        rounded-xl
        shadow-lg 
        flex items-center 
        justify-between 
        cursor-move 
        border
        backdrop-blur-xl
        transition-all 
        duration-200 
        ease-in-out
        hover:bg-theme-background
        ${isDragging ? "scale-[0.98]" : "scale-100"}
        mx-4
      `}
      style={{
        position: "absolute",
        left: `calc(50% + ${position.x}px)`,
        top: `${position.y}px`,
        zIndex: 50,
        minWidth: "min(320px, calc(100vw - 32px))",
        maxWidth: "min(420px, calc(100vw - 32px))",
        width: "100%",
      }}
      onMouseDown={handleMouseDown}
      id={id}
    >
      <div className="flex items-center space-x-3 flex-grow min-w-0">
        {!icon && <IconComponent size={18} className={iconColors} />}
        {icon && <div>{icon}</div>}
        <span className="text-sm font-medium truncate break-words" id={`${id ? `${id}-message` : ""}`}>
          {message}
        </span>
      </div>
      {action && <div className="ml-2 flex-shrink-0">{action}</div>}
      {!action && onClick && (
        <button
          onClick={onClick}
          className="ml-2 flex-shrink-0 focus:outline-none text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
          id={`${id ? `${id}-view` : ""}`}
          type="button"
          tabIndex={0}
        >
          View
        </button>
      )}
      <button
        onClick={onClose}
        className="ml-2 flex-shrink-0 focus:outline-none text-gray-400 hover:text-gray-600 transition-colors"
        id={`${id ? `${id}-close` : ""}`}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default DraggableToast;
