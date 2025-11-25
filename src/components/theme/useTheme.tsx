import { useState, useEffect } from "react";
import { getBrowserTheme } from "../util/platform";

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // First check for zoom-data-theme attribute
    const zoomTheme = document.documentElement.getAttribute("zoom-data-theme");
    if (zoomTheme) {
      return zoomTheme;
    }
    // Then check localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme;
    }
    // Finally fall back to browser theme
    return getBrowserTheme();
  });

  useEffect(() => {
    const zoomTheme = document.documentElement.getAttribute("zoom-data-theme");
    if (zoomTheme && zoomTheme !== theme) {
      setTheme(zoomTheme);
    } else {
      const browserTheme = getBrowserTheme();
      if (browserTheme !== theme) {
        setTheme(browserTheme);
      }
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("zoom-data-theme", theme);
  }, [theme]);

  const themes = [
    "light",
    "dark",
    //  "blue",
    //  "green"
  ];

  return {
    theme,
    setTheme,
    themes,
  };
};

export default useTheme;
