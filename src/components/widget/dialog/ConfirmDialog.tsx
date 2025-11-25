import React from "react";
import { AlertCircle } from "lucide-react";
import { Button, VariantType } from "../CommonButton";

interface ConfirmDialogProps {
  title: string;
  message?: string;
  iconClassName?: string;
  icon?: React.ReactNode;
  onCancel?: () => void;
  cancelText?: string;
  cancelId?: string;
  cancelVariant?: VariantType;
  cancelClassName?: string;
  cancelIcon?: React.ReactNode;
  onClose?: () => void;
  closeText?: string;
  closeId?: string;
  closeVariant?: VariantType;
  closeClassName?: string;
  closeIcon?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  confirmId?: string;
  confirmVariant?: VariantType;
  confirmClassName?: string;
  confirmIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

// order: cancel, close, confirm
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  icon,
  iconClassName = "bg-red-50 dark:bg-red-950/30",
  onCancel,
  cancelText = "Cancel",
  cancelId = "",
  cancelVariant = "secondary",
  cancelClassName = "",
  cancelIcon,
  onClose,
  closeText = "Close",
  closeId = "",
  closeVariant = "secondary",
  closeClassName = "",
  closeIcon,
  onConfirm,
  confirmText = "Confirm",
  confirmId = "",
  confirmVariant = "primary",
  confirmClassName = "",
  confirmIcon,
  children,
  className,
  id = "",
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (onClose) {
        onClose();
      } else {
        onCancel();
      }
    }
  };

  const defaultIcon = <AlertCircle size={26} className="text-red-500 drop-shadow-sm" strokeWidth={1.5} />;
  const displayIcon = icon || defaultIcon;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 ${className}`}
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      <div
        className="rounded-2xl shadow-2xl p-8 w-full max-w-lg bg-theme-surface border border-theme-border/30 text-theme-text animate-in zoom-in-95 duration-200 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10"
        id={id}
      >
        <div className="flex items-start mb-6">
          <div className={`p-3 rounded-full mr-4 flex-shrink-0 shadow-sm  ${iconClassName}`}>{displayIcon}</div>
          <div className="flex-1 mt-1">
            <h2 className="text-2xl font-bold tracking-tight text-theme-text mb-2 leading-tight">{title}</h2>
          </div>
        </div>

        {message && (
          <div className="mb-8 pl-16">
            <p id={id ? id + "-message" : ""} className="text-base text-theme-text/75 leading-relaxed font-medium">
              {message}
            </p>
          </div>
        )}

        {children && <div className="mb-8 pl-16">{children}</div>}

        <div className="flex justify-end space-x-3 pt-6 border-t border-theme-border/20">
          {onCancel && cancelText && (
            <Button
              variant={cancelVariant as VariantType}
              onClick={onCancel}
              id={cancelId}
              className={`px-4 py-2.5 text-sm font-medium ${cancelClassName}`}
            >
              {cancelIcon && <span className="mr-1">{cancelIcon}</span>}
              {cancelText}
            </Button>
          )}

          {onClose && closeText && (
            <Button
              variant={closeVariant as VariantType}
              onClick={onClose}
              id={closeId}
              className={`px-4 py-2.5 text-sm font-medium ${closeClassName}`}
            >
              {closeIcon && <span className="mr-1">{closeIcon}</span>}
              {closeText}
            </Button>
          )}

          {onConfirm && confirmText && (
            <Button
              variant={confirmVariant as VariantType}
              onClick={onConfirm}
              id={confirmId}
              className={`px-4 py-2.5 text-sm font-medium ${confirmClassName}`}
            >
              {confirmIcon && <span className="mr-1">{confirmIcon}</span>}
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
