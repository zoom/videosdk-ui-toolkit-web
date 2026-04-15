import { StylesConfig } from "react-select";

// Theme-aware styles for react-select
// Using the same classes as bg-theme-surface text-theme-text etc.
export const getReactSelectTheme = (): StylesConfig => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "var(--color-surface, #ffffff)",
    borderColor: state.isFocused
      ? "#3b82f6" // focus:ring-blue-500
      : "var(--color-divider, #e5e7eb)",
    "&:hover": {
      backgroundColor: "var(--color-background, #f9fafb)",
      borderColor: "var(--color-divider, #d1d5db)",
    },
    color: "var(--color-text, #111827)",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "var(--color-surface, #ffffff)",
    border: "1px solid var(--color-divider, #e5e7eb)",
    zIndex: 9999,
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: "var(--color-surface, #ffffff)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
        ? "var(--color-background, #f9fafb)"
        : "var(--color-surface, #ffffff)",
    color: state.isSelected ? "white" : "var(--color-text, #111827)",
    "&:hover": {
      backgroundColor: state.isSelected ? "#3b82f6" : "var(--color-background, #f9fafb)",
      color: state.isSelected ? "white" : "var(--color-text, #111827)",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--color-text, #111827)",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "var(--color-background, #f9fafb)",
    border: "1px solid var(--color-divider, #e5e7eb)",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "var(--color-text, #111827)",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "var(--color-text-secondary, #6b7280)",
    "&:hover": {
      backgroundColor: "var(--color-divider, #e5e7eb)",
      color: "var(--color-text, #111827)",
    },
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--color-text, #111827)",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--color-text-secondary, #6b7280)",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "var(--color-text-secondary, #6b7280)",
    "&:hover": {
      color: "var(--color-text, #111827)",
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "var(--color-text-secondary, #6b7280)",
    "&:hover": {
      color: "var(--color-text, #111827)",
    },
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: "var(--color-divider, #e5e7eb)",
  }),
});
