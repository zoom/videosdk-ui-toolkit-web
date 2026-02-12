import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  onClose: () => void;
}

interface Position {
  x: number;
  y: number;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onClose }) => {
  const { t } = useTranslation();
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    setPosition({
      x: newX,
      y: newY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    setScale((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragStart]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full h-full flex items-center justify-center" ref={containerRef}>
        {/* Control buttons */}
        <div className="absolute top-4 right-4 flex gap-2 bg-black/20 backdrop-blur-md rounded-full p-1">
          <button
            onClick={handleZoomIn}
            className="p-2 text-white/90 hover:bg-white/10 rounded-full transition-colors"
            title={t("image.preview_zoom_in")}
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-white/90 hover:bg-white/10 rounded-full transition-colors"
            title={t("image.preview_zoom_out")}
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 text-white/90 hover:bg-white/10 rounded-full transition-colors"
            title={t("image.preview_rotate")}
          >
            <RotateCcw size={20} />
          </button>
          <div className="w-px bg-white/20 my-2" /> {/* Divider */}
          <button
            onClick={onClose}
            className="p-2 text-white/90 hover:bg-white/10 rounded-full transition-colors"
            title={t("image.preview_close")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Image container */}
        <div
          className="max-w-[90vw] max-h-[90vh] overflow-visible select-none"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <img
            src={imageUrl}
            alt="Preview"
            className="object-contain transition-transform duration-200 ease-out"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
              maxWidth: "100%",
              maxHeight: "100%",
              userSelect: "none",
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};
