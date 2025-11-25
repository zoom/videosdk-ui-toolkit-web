import React, { useEffect, useState } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setThemeName } from "@/store/uiSlice";

const GeneralSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { themeName: theme } = useAppSelector(useSessionUISelector);

  useEffect(() => {
    document.documentElement.setAttribute("zoom-data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const themes = [
    { name: "light", icon: <Sun size={18} /> },
    { name: "dark", icon: <Moon size={18} /> },
    { name: "blue", icon: <Palette size={18} /> },
    { name: "green", icon: <Palette size={18} /> },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-theme-text text-lg font-medium">Theme</h3>
          <div className="flex gap-3">
            {themes.map(({ name, icon }) => (
              <div key={name} className="justify-center">
                <button
                  onClick={() => {
                    dispatch(setThemeName(name));
                  }}
                  className={`
                  flex items-center justify-center
                  w-10 h-10 rounded-lg
                  transition-all duration-200
                  ${
                    theme === name
                      ? "bg-theme-primary text-theme-background shadow-md"
                      : "bg-theme-surface hover:bg-theme-background text-theme-text hover:shadow-sm"
                  }
                `}
                  title={`${name.charAt(0).toUpperCase() + name.slice(1)} theme`}
                >
                  {icon}
                </button>
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
