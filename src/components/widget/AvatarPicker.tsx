import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./CommonButton";
import Select from "react-select";
import { LOCALSTORAGE_KEYS } from "@/constant";

interface Avatar {
  fileName: string;
  description: string;
  shape: string;
  directoryPath: string;
}

interface AvatarPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatar: Avatar) => void;
}

const LazyImage = ({ avatar }: { avatar: Avatar }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "200px 0px" },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentImg = imgRef.current;
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, []);

  return (
    <div ref={imgRef} className={`w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden`}>
      {isLoaded ? (
        <img
          src={`https://yourdomain/avatars/${avatar.directoryPath}/${avatar.fileName}`}
          alt={avatar.description}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 animate-pulse" />
      )}
    </div>
  );
};

const AvatarPicker: React.FC<AvatarPickerProps> = ({ isOpen, onClose, onSelect }) => {
  const { t } = useTranslation();

  const shapes = React.useMemo(
    () => [
      { value: "all", label: t("avatar.all_shapes") },
      { value: "square", label: t("avatar.shape_square") },
      { value: "portrait", label: t("avatar.shape_portrait") },
      { value: "landscape", label: t("avatar.shape_landscape") },
    ],
    [t],
  );

  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({ value: "all", label: t("avatar.all_categories") });
  const [selectedShape, setSelectedShape] = useState(shapes[0]);
  const [visibleAvatars, setVisibleAvatars] = useState<Avatar[]>([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);
  const PAGE_SIZE = 30;

  useEffect(() => {
    fetch("https://yourdomain/avatars/index.json")
      .then((response) => response.json())
      .then((data) => setAvatars(data));
  }, []);

  const categories = React.useMemo(() => {
    const cats = new Set(avatars.map((avatar) => avatar.directoryPath.split("/")[0]));

    const sortedCategories = Array.from(cats)
      .sort((a, b) => a.localeCompare(b))
      .map((cat) => ({ value: cat, label: cat }));

    return [{ value: "All", label: t("avatar.all_categories") }, ...sortedCategories];
  }, [avatars, t]);

  const filteredAvatars = React.useMemo(() => {
    return avatars.filter(
      (avatar) =>
        avatar.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory.value === "All" || avatar.directoryPath.startsWith(selectedCategory.value)) &&
        (selectedShape.value === "all" || avatar.shape === selectedShape.value),
    );
  }, [avatars, searchTerm, selectedCategory, selectedShape]);

  useEffect(() => {
    setVisibleAvatars(filteredAvatars.slice(0, page * PAGE_SIZE));
  }, [filteredAvatars, page]);

  const loadMore = useCallback(() => {
    if (page * PAGE_SIZE < filteredAvatars.length) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [filteredAvatars.length, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "20px" },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentLoader = loaderRef.current;
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMore]);

  const handleSearch = useCallback(
    (option: { value: string; label: string } | null) => {
      setSearchTerm(option ? option.value : "");
      setSelectedCategory({ value: "all", label: t("avatar.all_categories") });
      setSelectedShape(shapes[0]);
      setPage(1);
    },
    [shapes, t],
  );

  const handleCategorySelect = useCallback(
    (option: { value: string; label: string } | null) => {
      setSelectedCategory(option || { value: "all", label: t("avatar.all_categories") });
      setPage(1);
      setSearchTerm("");
    },
    [t],
  );

  const handleShapeSelect = useCallback(
    (option: { value: string; label: string } | null) => {
      setSelectedShape(option || shapes[0]);
      setPage(1);
      setSearchTerm("");
    },
    [shapes],
  );

  const handleAvatarSelect = useCallback(
    (avatar: Avatar) => {
      onSelect(avatar);
      localStorage.setItem(LOCALSTORAGE_KEYS.UIKIT_AVATAR, JSON.stringify(avatar));
      onClose();
    },
    [onSelect, onClose],
  );

  return (
    <div title="Select Avatar" className="w-full h-full">
      <div className="flex flex-col h-full">
        <div className="p-2 border-b border-gray-200 text-black">
          <div className="mb-2">
            <Select
              options={avatars.map((avatar) => ({ value: avatar.description, label: avatar.description }))}
              placeholder={t("avatar.search_placeholder")}
              onChange={handleSearch}
              isClearable
              classNamePrefix="uikit-custom-scrollbar"
            />
          </div>
          <div className="flex space-x-2 mb-2">
            <Select
              options={categories}
              value={selectedCategory}
              onChange={handleCategorySelect}
              className="w-1/2"
              classNamePrefix="uikit-custom-scrollbar"
            />
            <Select
              options={shapes}
              value={selectedShape}
              onChange={handleShapeSelect}
              className="w-1/2"
              classNamePrefix="uikit-custom-scrollbar"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-2 uikit-custom-scrollbar">
          <div className="grid grid-cols-3 gap-2">
            {visibleAvatars.map((avatar) => (
              <Button
                key={avatar.directoryPath + avatar.fileName}
                variant="light"
                className="p-1 hover:bg-gray-100 flex flex-col items-center w-full h-full rounded-lg"
                onClick={() => handleAvatarSelect(avatar)}
              >
                <LazyImage avatar={avatar} />
                <span className="mt-1 text-xs text-center truncate w-full">{avatar.description}</span>
              </Button>
            ))}
          </div>
          <div ref={loaderRef} className="h-10" />
        </div>
      </div>
    </div>
  );
};

export default AvatarPicker;
