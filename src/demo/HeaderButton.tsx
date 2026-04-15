import React, { useState, useEffect, useRef } from "react";
import { ExternalLink, ChevronDown } from "lucide-react";

export interface HeaderLink {
  text: string;
  url: string;
  title: string;
  subMenu?: {
    text: string;
    url: string;
    title?: string;
  }[];
}

interface HeaderButtonProps {
  link: HeaderLink;
  buttonClass?: string;
}

export const HeaderButton: React.FC<HeaderButtonProps> = ({
  link,
  buttonClass = "group relative px-2 py-2.5 bg-theme-surface hover:bg-theme-background text-theme-text border border-theme-border rounded-md flex items-center gap-1.5 text-xs font-medium whitespace-nowrap transition-all duration-300 ease-in-out border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] cursor-pointer",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (link.subMenu) {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          className={buttonClass}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title={link.title}
        >
          <span>{link.text}</span>
          <ChevronDown
            className={`w-3 h-3 opacity-50 group-hover:opacity-100 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        <div
          className={`
            absolute top-[calc(100%+0.25rem)] left-0
            w-48
            bg-theme-surface hover:bg-theme-background text-theme-text border border-theme-border rounded-md shadow-lg
            border border-theme-border
            transition-all duration-200 ease-in-out
            ${isDropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-10px] pointer-events-none"}
            z-[9999]
            max-h-[80vh] overflow-y-auto
          `}
        >
          {link.subMenu.map((subItem, index) => (
            <button
              key={`${link.text}-sub-${index}`}
              onClick={() => {
                window.open(subItem.url, "_blank");
                setIsDropdownOpen(false);
              }}
              title={subItem.title || ""}
              className="
                w-full px-3 py-2 text-left
                text-xs font-medium text-theme-text
                hover:bg-theme-background hover:text-blue-600
                transition-colors duration-150
                first:rounded-t-md last:rounded-b-md
                relative
                group/item
              "
            >
              <span className="truncate">{subItem.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <button type="button" className={buttonClass} onClick={() => window.open(link.url, "_blank")} title={link.title}>
      <span>{link.text}</span>
      <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
