import { useRef, useCallback, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import { CommonPopper } from "@/components/widget/CommonPopper";
import sessionAdditionalContext from "@/context/session-additional-context";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { StreamContext } from "@/context/stream-context";

declare global {
  interface Window {
    cocoSsd: any;
  }
}

const maskBackgroundList = [
  { key: "blur", url: `${window.location.origin}/image/blur.png` },
  { key: "grass", url: `${window.location.origin}/image/grass.jpg` },
  { key: "earth", url: `${window.location.origin}/image/earth.jpg` },
  { key: "SanFrancisco", url: `${window.location.origin}/image/SanFrancisco.jpg` },
];

// Add type for mask
type MaskClip = {
  type: "circle";
  radius: number;
  x: number;
  y: number;
};

type MaskOption = {
  imageUrl: string | null;
  cropped: boolean;
  rootWidth: number;
  rootHeight: number;
  clip: MaskClip | MaskClip[];
};

const DETECTION_INTERVAL = 200; // 5 times per second
const VIDEO_ELEMENT_ID = "ZOOM_SELF_VIDEO";
const MODEL_CONFIG = {
  baseScore: 0.5, // Minimum confidence score
  personClassLabel: "person",
};

const MOVEMENT_STEP = 10; // pixels to move per keypress

export const VideoMask = () => {
  const { t } = useTranslation();
  // Contexts and selectors
  const { stream } = useContext(StreamContext);

  const sessionStatus = useAppSelector(useSessionSelector);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<any>(null);
  const detectionRef = useRef<boolean>(true);

  // State
  const [clipPos, setClipPos] = useState({ x: 0, y: 0 });
  const [background, setBackground] = useState("blur");
  const [isConfiged, setIsConfiged] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoDetect, setIsAutoDetect] = useState(false);

  // Get video mirroring state from session
  const isMirrored = false; // sessionStatus?.isVideoMirrored ?? false;

  // Person detection setup
  const setupPersonDetection = useCallback(async () => {
    try {
      // Load COCO-SSD model
      if (!modelRef.current) {
        modelRef.current = await window.cocoSsd.load();
      }

      const video = document.getElementById(VIDEO_ELEMENT_ID) as HTMLVideoElement;
      if (!video) {
        // eslint-disable-next-line no-console
        console.error("Video element not found");
        return;
      }

      // Wait for video metadata
      await new Promise<void>((resolve) => {
        if (video.readyState >= 2) {
          resolve();
        } else {
          video.onloadedmetadata = () => resolve();
        }
      });

      // Start detection loop
      const detectFrame = async () => {
        if (!detectionRef.current || !isAutoDetect) return;

        try {
          const predictions = await modelRef.current.detect(video);
          const person = predictions.find(
            (p: any) => p.class === MODEL_CONFIG.personClassLabel && p.score > MODEL_CONFIG.baseScore,
          );

          if (person) {
            // Convert detection coordinates to mask coordinates
            const { bbox } = person;
            const [x, y, width, height] = bbox;

            // Calculate center position of detected person
            const centerX = x + width / 2;
            const centerY = y + height / 2;

            // Convert to relative position for the mask
            const scale = 32 / 13;
            const maskX = centerX * scale - 256;
            const maskY = centerY * scale - 256;

            // Update clip position
            setClipPos({ x: maskX, y: maskY });
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Detection error:", error);
        }

        // Schedule next detection
        setTimeout(detectFrame, DETECTION_INTERVAL);
      };

      detectFrame();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Setup error:", error);
    }
  }, [isAutoDetect]);

  // Effect to start/stop detection
  useEffect(() => {
    if (isAutoDetect) {
      detectionRef.current = true;
      setupPersonDetection();
    }
    return () => {
      detectionRef.current = false;
    };
  }, [isAutoDetect, setupPersonDetection]);

  // Handlers
  const onClipDrag = useCallback(
    (_event: any, data: any) => {
      if (!isAutoDetect) {
        setClipPos({ x: data.x, y: data.y });
      }
    },
    [isAutoDetect],
  );

  const onBackgroundClick = useCallback((key: string) => {
    setBackground(key);
  }, []);

  const onClose = useCallback(() => {
    detectionRef.current = false;
    stream?.stopPreviewVideoMask();
    setIsVisible(false);
    setIsConfiged(false);
  }, [stream]);

  // Effect to handle mask updates
  useEffect(() => {
    if (isVisible && canvasRef.current) {
      const bg = maskBackgroundList.find((item) => item.key === background)?.url ?? null;
      const scale = 32 / 13;
      let x = Math.floor(clipPos.x * scale) + 256;

      if (isMirrored) {
        x = 1280 - x;
      }

      const y = Math.floor(clipPos.y * scale) + 256;

      const mask = {
        imageUrl: bg,
        cropped: true,
        rootWidth: 1280,
        rootHeight: 720,
        clip: [
          {
            type: "circle",
            radius: 256,
            x,
            y,
          },
        ],
      };

      if (!isConfiged) {
        if (bg !== undefined) {
          stream?.previewVideoMask(canvasRef.current, mask as any);
          setIsConfiged(true);
        }
      } else {
        stream?.updateVideoMask(mask as any);
      }
    }
  }, [isVisible, stream, background, clipPos, isConfiged, isMirrored]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isAutoDetect) return;

      switch (e.key) {
        case "ArrowUp":
          setClipPos((prev) => ({ ...prev, y: prev.y - MOVEMENT_STEP }));
          break;
        case "ArrowDown":
          setClipPos((prev) => ({ ...prev, y: prev.y + MOVEMENT_STEP }));
          break;
        case "ArrowLeft":
          setClipPos((prev) => ({ ...prev, x: prev.x - MOVEMENT_STEP }));
          break;
        case "ArrowRight":
          setClipPos((prev) => ({ ...prev, x: prev.x + MOVEMENT_STEP }));
          break;
        default:
          break;
      }
    },
    [isAutoDetect],
  );

  useEffect(() => {
    if (!isAutoDetect) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown, isAutoDetect]);

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="relative flex-grow mb-4 bg-gray-100 rounded-lg overflow-hidden">
        <canvas className="w-full h-full" ref={canvasRef} />
        {background !== "none" && (
          <Draggable
            nodeRef={clipRef}
            bounds="parent"
            onDrag={onClipDrag}
            defaultPosition={clipPos}
            disabled={isAutoDetect}
          >
            <div
              ref={clipRef}
              role="slider"
              tabIndex={0}
              aria-label={t("video.mask_position")}
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`Position: ${clipPos.x}, ${clipPos.y}`}
              className={`absolute w-32 h-32 border-2 rounded-full ${
                isAutoDetect ? "border-green-500" : "border-white cursor-move"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </Draggable>
        )}
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2 text-black hover:cursor-pointer">
          <input
            type="checkbox"
            checked={isAutoDetect}
            onChange={(e) => setIsAutoDetect(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600 rounded"
          />
          <span className="select-none">{t("video.mask_auto_detect")}</span>
        </label>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3 text-black">{t("video.mask_choose_background")}</h3>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg border text-black transition-colors duration-200 ${
              background === "none" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onBackgroundClick("none")}
          >
            {t("video.mask_background_none")}
          </button>
          {maskBackgroundList.map((item) => (
            <button
              key={item.key}
              className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                background === item.key ? "border-blue-500 shadow-sm" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onBackgroundClick(item.key)}
            >
              <img src={item.url} alt={item.key} className="w-full h-full object-cover" />
              {item.key === "blur" && (
                <span className="absolute inset-0 flex items-center justify-center text-black bg-white/50 font-medium">
                  {t("video.mask_background_blur")}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoMask;
