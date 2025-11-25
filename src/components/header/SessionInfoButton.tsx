import React from "react";
import { Info } from "lucide-react";
import { useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { THEME_COLOR_CLASS } from "@/constant";

interface InfoButtonProps {
  onClick: () => void;
}

export default function SessionInfoButton({ onClick }: InfoButtonProps) {
  const { themeName } = useAppSelector(useSessionUISelector);
  const iconColor = themeName === "dark" ? "white" : "black";
  return (
    <button
      className={`p-2 rounded-full transition-colors duration-200 ${THEME_COLOR_CLASS}`}
      style={{ zIndex: 50 }}
      onClick={onClick}
    >
      <Info size={24} color={iconColor} />
    </button>
  );
}
