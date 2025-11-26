import React from "react";

interface SelectionButtonProps {
  isSelected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  iconColor: string;
  name: string;
  description?: string;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  isSelected,
  onClick,
  icon: Icon,
  iconColor,
  name,
  description,
}) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all
      ${isSelected ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:bg-gray-50"}`}
  >
    <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500 text-white" : iconColor}`}>
      <Icon size={20} />
    </div>
    <div className="text-left">
      {/* <div className="font-medium text-gray-900">{name}</div> */}
      {description && <div className="text-xs text-gray-500">{description}</div>}
    </div>
  </button>
);

export default SelectionButton;
