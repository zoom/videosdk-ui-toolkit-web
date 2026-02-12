import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import ImageWithValidation from "@/features/setting/components/ImageWithValidation";
import BlurThumbnailButton from "@/features/setting/components/BlurThumbnailButton";

export const PreviewVB = ({
  isOpen,
  onClose,
  activeVbImage,
  onSelectImage,
  vbImageList,
  isMirrorVideo,
  handleMirrorVideo,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeVbImage: string;
  onSelectImage: (image: string) => void;
  vbImageList: { url: string; displayName?: string }[];
  isMirrorVideo: boolean;
  handleMirrorVideo: () => void;
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Dialog */}
      <div className="flex min-h-screen items-center justify-center mt-14 ">
        <div
          className="relative w-[400px] transform rounded-xl bg-theme-surface shadow-2xl transition-all border border-theme-border"
          style={{ marginTop: "300px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-base font-semibold">{t("preview.vb_title")}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-theme-text hover:bg-theme-background transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              <button
                className={`aspect-video rounded-lg border-2 ${
                  activeVbImage === "" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                } p-2 text-xs font-medium text-theme-text hover:bg-theme-background transition-colors bg-theme-surface`}
                onClick={() => onSelectImage("")}
              >
                {t("preview.vb_none")}
              </button>

              <BlurThumbnailButton
                isActive={activeVbImage === "blur"}
                label={t("preview.vb_blur")}
                labelClassName="text-xs font-medium text-white/95"
                className="hover:bg-theme-background transition-colors"
                onSelect={() => onSelectImage("blur")}
              />
              {vbImageList?.map((image, i) => (
                <ImageWithValidation
                  key={i}
                  name={image?.displayName}
                  src={image.url}
                  isActive={activeVbImage === image.url}
                  onSelect={() => onSelectImage(image.url)}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                type="checkbox"
                id="uikit-preview-vb-mirror"
                checked={isMirrorVideo}
                onChange={handleMirrorVideo}
              />
              <label htmlFor="mirror-video" className="text-sm select-none cursor-pointer">
                {t("preview.vb_mirror")}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewVB;
