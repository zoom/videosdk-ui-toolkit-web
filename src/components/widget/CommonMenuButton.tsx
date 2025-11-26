import { Check } from "lucide-react";

const convertToId = (text: string) => text.replace(/ /g, "-");

export const CommonMenuButton: React.FC<{
  text: string;
  onClick: () => void;
  isActive: boolean;
  className?: string;
  id?: string;
  disabled?: boolean;
}> = ({ text, onClick, isActive, className = "", id, disabled = false }) => (
  <button
    className={`w-full text-left py-2 px-3 text-sm rounded flex items-center space-x-2 transition-colors duration-200 ${
      isActive ? "bg-theme-background text-theme-text" : "text-theme-text hover:bg-theme-background"
    } ${className}`}
    onClick={onClick}
    id={id ? convertToId(id) : undefined}
    disabled={disabled}
  >
    <span className="flex-shrink-0">{isActive && <Check size={14} className="text-blue-500" />}</span>
    <span className="truncate">{text}</span>
  </button>
);
