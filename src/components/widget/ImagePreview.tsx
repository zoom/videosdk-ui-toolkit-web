import React from "react";
import { X } from "lucide-react";

interface ImagePreviewProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative max-w-3xl max-h-[90vh] overflow-auto">
        <img src={src} alt={alt} className="max-w-full max-h-full object-contain" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-theme-text-button hover:text-gray-300 transition duration-150 ease-in-out"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};
