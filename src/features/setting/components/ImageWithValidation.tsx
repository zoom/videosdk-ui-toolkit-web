import { Loader } from "lucide-react";
import { useState, useEffect } from "react";

interface ImageWithValidationProps {
  src: string;
  isActive: boolean;
  onSelect: () => void;
  name?: string;
}

enum LoadingStatus {
  LOADING = "loading",
  ERROR = "error",
  SUCCESS = "success",
}

const ImageWithValidation = ({ src, isActive, onSelect, name }: ImageWithValidationProps) => {
  const [imageStatus, setImageStatus] = useState(LoadingStatus.LOADING);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageStatus(LoadingStatus.SUCCESS);
    };
    img.onerror = () => {
      setImageStatus(LoadingStatus.ERROR);
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (imageStatus === LoadingStatus.ERROR) return null;

  if (imageStatus === LoadingStatus.LOADING) {
    return (
      <button className="rounded-lg w-full h-full bg-gray-300 flex justify-center items-center" disabled>
        <Loader size={20} className="animate-spin text-white" />
      </button>
    );
  }

  return (
    <button className="bg-gray-200 rounded-lg aspect-video cursor-pointer" onClick={onSelect}>
      <img
        src={src}
        title={name}
        className={`rounded-lg w-full h-full object-cover border-2 ${isActive ? "border-blue-500" : "border-gray-200"}`}
      />
    </button>
  );
};

export default ImageWithValidation;
