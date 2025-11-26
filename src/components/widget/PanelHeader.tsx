import React from "react";
import { Users, MessageSquare, X } from "lucide-react";

interface PanelHeaderProps {
  title: string;
  onClose: () => void;
  onPopOut: () => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ title, onClose, onPopOut }) => (
  <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
      {title === "Participants" ? (
        <Users size={20} className="mr-2 text-blue-500" />
      ) : (
        <MessageSquare size={20} className="mr-2 text-green-500" />
      )}
      {title}
    </h2>
    <div className="flex items-center space-x-2">
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition duration-150 ease-in-out"
        title="Close"
      >
        <X size={18} />
      </button>
    </div>
  </div>
);
