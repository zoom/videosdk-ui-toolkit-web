import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const CommonCheckbox: React.FC<CheckboxProps> = ({ label, className = "", ...props }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        className={`form-checkbox h-5 w-5 bg-theme-surface text-blue-600 transition duration-150 ease-in-out ${className}`}
        {...props}
      />
      <span className="text-theme-text w-[95%]">{label}</span>
    </label>
  );
};

export default CommonCheckbox;
