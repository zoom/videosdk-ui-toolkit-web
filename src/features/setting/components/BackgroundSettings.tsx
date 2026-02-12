import { StreamContext } from "@/context/stream-context";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setActiveVbImage, setIsMirrorVideo } from "@/store/uiSlice";
import { Loader } from "lucide-react";
import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
  DOMAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
} from "react";
import { type VideoPlayer, type VideoPlayerContainer } from "@zoom/videosdk";
import ImageWithValidation from "./ImageWithValidation";
import BlurThumbnailButton from "./BlurThumbnailButton";
type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["video-player"]: DetailedHTMLProps<HTMLAttributes<VideoPlayer>, VideoPlayer> & { className?: string };
      ["video-player-container"]: CustomElement<VideoPlayerContainer> & { className?: string };
    }
  }
}

interface BackgroundSettingsProps {
  isActive: boolean;
}

const BackgroundSettings = ({ isActive }: BackgroundSettingsProps) => {
  const { t } = useTranslation();
  const { vbImageList, activeVbImage, isSettingsOpen, isMirrorVideo } = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();
  const { stream } = useContext(StreamContext);

  const [isStartPreview, setIsStartPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewVideoRef = useRef<VideoPlayer>(null);

  const onSelectImage = useCallback(
    async (url: string) => {
      if (stream) {
        await stream.updateVirtualBackgroundImage(url);
        dispatch(setActiveVbImage(url));
      }
    },
    [dispatch, stream],
  );

  const startPreviewVB = useCallback(async () => {
    if (stream && !isStartPreview && previewVideoRef.current) {
      try {
        await stream.previewVirtualBackground(previewVideoRef.current as any, activeVbImage);
        setIsLoading(false);
        setIsStartPreview(true);
      } catch (e) {
        //console.error(e);
      }
    }
  }, [activeVbImage, isStartPreview, stream]);

  const handleMirrorVideo = useCallback(async () => {
    if (stream) {
      try {
        await stream.mirrorVideo(!isMirrorVideo);
        dispatch(setIsMirrorVideo(!isMirrorVideo));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }, [dispatch, isMirrorVideo, stream]);

  useEffect(() => {
    if (isSettingsOpen) {
      startPreviewVB();
    }
  }, [isSettingsOpen, startPreviewVB]);

  useEffect(() => {
    return () => {
      const stopPreview = async () => {
        try {
          if (stream) {
            await stream.stopPreviewVirtualBackground();
          }
        } catch (e) {
          // console.log(e);
        }
      };
      stopPreview();
    };
  }, [stream]);

  return (
    <div className="flex justify-center flex-col">
      <div className="flex justify-center relative">
        {isLoading && (
          <div className="absolute top-0 left-0 bg-black w-full aspect-video rounded-lg flex justify-center items-center">
            <Loader size={20} className="animate-spin text-white" />
          </div>
        )}
        {/* <canvas className="rounded-lg w-full bg-black" width={1280} height={720} ref={previewCanvasRef} /> */}
        <div className="rounded-lg w-full aspect-video">
          <video-player-container>
            <div>
              <video-player
                ref={previewVideoRef}
                className="rounded-lg aspect-video overflow-hidden"
                style={{ aspectRatio: "16/9", borderRadius: "8px" }}
              />
            </div>
          </video-player-container>
        </div>
      </div>
      <h3 className="text-lg font-semibold m-2 ">{t("settings.virtual_background")}</h3>
      <div className="grid grid-cols-4 gap-4">
        <button
          className={`border-2 ${activeVbImage === "" ? "border-blue-500" : "border-gray-200"} rounded-lg p-2 text-theme-text font-medium aspect-video text-theme-color`}
          onClick={() => onSelectImage("")}
        >
          {t("settings.vb_none")}
        </button>
        <BlurThumbnailButton
          isActive={activeVbImage === "blur"}
          label={t("settings.blur_text")}
          labelClassName="text-base font-medium text-white/95"
          onSelect={() => onSelectImage("blur")}
        />
        {vbImageList?.map((image, i) => (
          <ImageWithValidation
            key={i}
            src={image.url}
            name={image?.displayName}
            isActive={activeVbImage === image.url}
            onSelect={() => onSelectImage(image.url)}
          />
        ))}
      </div>
      <div className="my-2  flex items-center gap-2">
        <input
          className="form-checkbox h-4 w-4 text-blue-600"
          type="checkbox"
          id="mirror-video"
          checked={isMirrorVideo}
          onChange={handleMirrorVideo}
        />
        <label htmlFor="mirror-video">{t("settings.mirror_my_video")}</label>
      </div>
    </div>
  );
};

export default BackgroundSettings;
