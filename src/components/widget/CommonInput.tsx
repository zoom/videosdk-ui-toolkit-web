import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  disableAutofill?: boolean;
}

export const CommonInput: React.FC<InputProps> = ({ label, className = "", disableAutofill, ...props }) => {
  const autofillProps = disableAutofill ? { autoComplete: "off" } : {};

  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium text-theme-text">{label}</label>}
      <input
        className={`form-input px-3 py-2 border border-theme-border bg-theme-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        {...autofillProps}
        {...props}
      />
    </div>
  );
};

export default CommonInput;
