import React from "react";
import ReactDOM from "react-dom";

interface CommonDialogProps {
  isOpen: boolean;
  title?: string;
  okText?: string;
  cancelText?: string;
  onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  okButtonProps?: {
    disabled?: boolean;
    className?: string;
  };
  themeName?: string;
}

const CommonDialog: React.FC<CommonDialogProps> = ({
  isOpen,
  title,
  okText = "OK",
  cancelText,
  onOk,
  onCancel,
  children,
  okButtonProps,
  themeName,
}) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="zoom-ui-toolkit-root">
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-theme-surface`}>
        <div className={`rounded-lg shadow-lg max-w-lg w-full p-6 bg-theme-surface border-solid border`}>
          <div className="font-bold text-2xl text-theme-text">
            <span>{title}</span>
          </div>
          <div className="my-2">{children}</div>
          <div className="flex justify-end">
            {cancelText && onCancel && (
              <button
                className="rounded mx-1 px-2 py-1 bg-gray-400 text-theme-text-button hover:opacity-70 transition-opacity flex justify-center items-center"
                onClick={() => onCancel()}
              >
                {cancelText}
              </button>
            )}
            {okText && onOk && (
              <button
                onClick={onOk}
                disabled={okButtonProps?.disabled}
                className={`${okButtonProps?.className || ""} rounded mx-1 px-2 py-1 bg-blue-500 text-theme-text-button opacity-70 hover:opacity-100 transition-opacity flex justify-center items-center`}
              >
                {okText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CommonDialog;
