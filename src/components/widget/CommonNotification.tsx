import React, { useRef, useEffect, useState } from "react";
import { X, LucideIcon } from "lucide-react";

interface CommonNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
  height?: number | string;
  children: React.ReactNode;
  timeout?: number;
  icon?: LucideIcon;
  allowClose?: boolean;
  id?: string;
}

const CommonNotification: React.FC<CommonNotificationProps> = ({
  isOpen,
  onClose,
  width = 400,
  height = 250,
  children,
  timeout,
  icon: Icon,
  allowClose = false,
  id,
}) => {
  const [timeLeft, setTimeLeft] = useState(timeout);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && timeout) {
      setTimeLeft(timeout);
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, timeout, onClose]);

  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" && overlayRef.current) {
        const focusableElements = overlayRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getModalStyle = () => {
    const baseStyle = {
      width: `min(${width}px, calc(100vw - 2rem))`,
      maxWidth: "min(90vw, 600px)",
      maxHeight: "calc(100vh - 4rem)",
      wordWrap: "break-word" as const,
      overflowWrap: "break-word" as const,
    };

    if (height === "auto") {
      return {
        ...baseStyle,
        minHeight: "180px",
      };
    } else {
      return {
        ...baseStyle,
        height: typeof height === "number" ? `${height}px` : height,
      };
    }
  };

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4`}
      onMouseDown={(e) => e.target === overlayRef.current && allowClose && onClose()}
    >
      <div
        className={`rounded-lg shadow-lg relative bg-theme-surface border-solid border overflow-hidden w-full`}
        id={id}
        style={getModalStyle()}
      >
        {allowClose && (
          <button onClick={onClose} className="absolute top-2 right-2 z-10">
            <X size={20} />
          </button>
        )}
        <div className="p-4 sm:p-6 flex h-full min-h-0 overflow-hidden">
          {Icon && <Icon className="text-orange-500 mr-3 sm:mr-4 flex-shrink-0 mt-1" size={24} />}
          <div className="flex-grow ml-2 min-h-0 flex flex-col w-full overflow-hidden">{children}</div>
        </div>
        {timeout && <div className="absolute bottom-2 left-2 text-xs ">Closing in {Math.ceil(timeLeft! / 1000)}s</div>}
      </div>
    </div>
  );
};

export default CommonNotification;
