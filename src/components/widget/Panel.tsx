import React from "react";
import { X } from "lucide-react";

interface PanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ title, onClose, children }) => (
  <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-xl z-10 overflow-hidden">
    <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X size={20} />
      </button>
    </div>
    <div className="p-4 h-[calc(100%-44px)] overflow-y-auto">{children}</div>
  </div>
);
