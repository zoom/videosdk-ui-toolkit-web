import React, { useState, useRef, useEffect } from "react";
import { Subtitles } from "lucide-react";
import ToggleButton from "../../../components/widget/ToggleButton";
import { CaptionMenu } from "./CaptionMenu";
import { useAppSelector, useCaptionSelector, useSessionUISelector } from "@/hooks/useAppSelector";

interface CaptionButtonProps {
  isCaptionOn: boolean;
  handleCaptionClick: () => void;
  onViewTranscript: () => void;
  onCaptionSettings: () => void;
  orientation?: "horizontal" | "vertical";
}

export const CaptionButton: React.FC<CaptionButtonProps> = ({
  isCaptionOn,
  handleCaptionClick,
  onViewTranscript,
  onCaptionSettings,
  orientation = "horizontal",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { themeName } = useAppSelector(useSessionUISelector);

  const { isHostDisableCaptions } = useAppSelector(useCaptionSelector);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuContent = isMenuOpen && (
    <CaptionMenu
      setIsMenuOpen={setIsMenuOpen}
      onViewTranscript={() => {
        onViewTranscript();
        setIsMenuOpen(false);
      }}
      onCaptionSettings={() => {
        onCaptionSettings();
        setIsMenuOpen(false);
      }}
    />
  );

  const iconColor = themeName === "dark" ? "white" : "black";

  return (
    <ToggleButton
      id={"uikit-footer-caption"}
      isShowChevron={!isHostDisableCaptions}
      ref={menuRef}
      icon={Subtitles}
      themeName={themeName}
      isActive={isCaptionOn}
      onClick={handleCaptionClick}
      onChevronUpClick={() => setIsMenuOpen(!isMenuOpen)}
      menuContent={menuContent}
      title="show-captions"
      bgColor={isCaptionOn ? "bg-blue-500" : ""}
      iconColor={iconColor}
      chevronUpColor={iconColor}
      hoverColor={isCaptionOn ? "hover:bg-blue-600" : "hover:bg-theme-background"}
      orientation={orientation}
    />
  );
};

export default CaptionButton;
