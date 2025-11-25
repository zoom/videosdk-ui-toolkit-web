import React from "react";
import Select, { SelectInstance, Props as SelectProps } from "react-select";

interface CustomSelectColors {
  // Base colors
  background: string;
  backgroundHover: string;
  backgroundActive: string;
  text: string;
  border: string;
  // Menu specific
  menuBackground: string;
  menuShadow: string;
  // Option specific
  optionBackground: string;
  optionBackgroundHover: string;
  optionBackgroundActive: string;
  // Placeholder
  placeholder: string;
}

interface CustomSelectProps extends Omit<SelectProps, "theme"> {
  isDarkMode?: boolean;
  colors?: Partial<CustomSelectColors>;
  ref?: React.Ref<SelectInstance>;
}

const defaultLightColors: CustomSelectColors = {
  background: "#ffffff",
  backgroundHover: "#f2f2f7",
  backgroundActive: "#e5e5ea",
  text: "#000000",
  border: "#e5e5ea",
  menuBackground: "#ffffff",
  menuShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  optionBackground: "#ffffff",
  optionBackgroundHover: "#f2f2f7",
  optionBackgroundActive: "#e5e5ea",
  placeholder: "rgba(0, 0, 0, 0.4)",
};

const defaultDarkColors: CustomSelectColors = {
  background: "#1c1c1e",
  backgroundHover: "#2c2c2e",
  backgroundActive: "#3a3a3c",
  text: "#ffffff",
  border: "#2c2c2e",
  menuBackground: "#1c1c1e",
  menuShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
  optionBackground: "#1c1c1e",
  optionBackgroundHover: "#2c2c2e",
  optionBackgroundActive: "#3a3a3c",
  placeholder: "rgba(255, 255, 255, 0.6)",
};

// not use currently
export const CustomSelect: React.FC<CustomSelectProps> = ({ isDarkMode = false, colors = {}, ref, ...props }) => {
  const baseColors = isDarkMode ? defaultDarkColors : defaultLightColors;
  const mergedColors = { ...baseColors, ...colors };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: mergedColors.background,
      borderColor: mergedColors.border,
      borderRadius: "14px",
      boxShadow: "none",
      padding: "2px",
      "&:hover": {
        borderColor: mergedColors.border,
      },
    }),
    menu: (base: any) => ({
      ...base,
      position: "absolute",
      zIndex: 9999,
      width: "100%",
      backgroundColor: mergedColors.menuBackground,
      color: mergedColors.text,
      border: "none",
      borderRadius: "14px",
      marginTop: "4px",
      boxShadow: mergedColors.menuShadow,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: "8px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? mergedColors.backgroundHover : mergedColors.optionBackground,
      color: mergedColors.text,
      padding: "10px 12px",
      borderRadius: "10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: mergedColors.optionBackgroundHover,
      },
      "&:active": {
        backgroundColor: mergedColors.optionBackgroundActive,
      },
    }),
    input: (base: any) => ({
      ...base,
      color: mergedColors.text,
    }),
    singleValue: (base: any) => ({
      ...base,
      color: mergedColors.text,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: mergedColors.placeholder,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return <Select {...props} ref={ref} styles={customStyles} />;
};

export default CustomSelect;
