import React, { useState, useRef, useEffect, CSSProperties } from "react";
import { LucideIcon } from "lucide-react";
import { THEME_COLOR_CLASS } from "@/constant";

interface Tab {
  name: string;
  id?: string;
  title?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

interface CommonTabProps {
  tabs: Tab[];
  orientation?: "vertical" | "horizontal";
  maxSize?: number;
  activeTab?: string;
  setActiveTab?: (tabName: string) => void;
  className?: string;
}

const CommonTab: React.FC<CommonTabProps> = ({
  tabs,
  orientation = "vertical",
  maxSize,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  className,
}) => {
  const availableTabs = tabs.filter((item: Tab) => !item?.disabled);
  const [internalActiveTab, setInternalActiveTab] = useState(availableTabs[0]?.name || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = externalSetActiveTab || setInternalActiveTab;

  useEffect(() => {
    const checkScrollable = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth, scrollHeight, clientHeight } = containerRef.current;
        setIsScrollable(
          (orientation === "horizontal" && scrollWidth > clientWidth) ||
            (orientation === "vertical" && scrollHeight > clientHeight),
        );
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [orientation]);

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: orientation === "vertical" ? "column" : "row",
    maxHeight: orientation === "vertical" ? `${maxSize ? `w-${maxSize}px` : "h-full"}` : undefined,
    maxWidth: orientation === "horizontal" ? `${maxSize ? `h-${maxSize}px` : "w-full"}` : undefined,
    overflowY: orientation === "vertical" && isScrollable ? "auto" : "visible",
    overflowX: orientation === "horizontal" && isScrollable ? "auto" : "visible",
  };

  const buttonBaseStyle = `
    
    ${orientation === "vertical" ? "w-full" : "h-full"}
    py-3 px-6
    ${orientation === "vertical" ? "text-left" : "text-center"}
    flex ${orientation === "vertical" ? "items-center" : "flex-col items-center justify-center"}
  `;

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={`border h-full ${THEME_COLOR_CLASS} rounded-lg ${className ? className : ""} mb-2`}
    >
      {availableTabs.map((tab) => (
        <button
          key={tab.name}
          id={tab?.id ? tab.id : ""}
          className={`${buttonBaseStyle} ${
            activeTab === tab.name ? "bg-blue-50 text-blue-600 font-medium" : ""
          } ${tab.className ? tab.className : ""}`}
          onClick={() => setActiveTab(tab.name)}
        >
          {tab?.icon && <tab.icon className={orientation === "vertical" ? "mr-3" : "mb-2"} size={18} />}
          <span className="capitalize">{tab?.title || tab.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CommonTab;
