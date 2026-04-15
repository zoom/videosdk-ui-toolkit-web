import { useCallback, useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import MoveIcon from "./move-icon.svg";
import BrowserPerformanceTest from "./BrowserPerformanceTest";
import { PerformanceCharts } from "./PerformanceCharts";
import UIToolkit from "../../uikit/index";
import "./DebugSettingDraggable.css";

const STATIC_RESOLUTIONS = {
  "360p": { width: 640, height: 360 },
  "720p": { width: 1280, height: 720 },
  "1080p": { width: 1920, height: 1080 },
  "1440p": { width: 2560, height: 1440 },
} as const;

const POSITIONS = {
  "top-left": { top: 0, left: 0 },
  "top-right": { top: 0, right: 0 },
  "bottom-left": { bottom: 0, left: 0 },
  "bottom-right": { bottom: 0, right: 0 },
};

interface DebugSettingDraggableProps {
  isDraggable: boolean;
  updateContainerSize: (resolution: keyof typeof STATIC_RESOLUTIONS | "fullscreen") => void;
  updateContainerPosition: (position: keyof typeof POSITIONS) => void;
  resetContainer: () => void;
  handleFullscreen: () => void;
  currentResolution: string;
  currentPosition: string;
  isCustomizeLayout: boolean;
}

const addDragParameter = (url: string, isDraggable: boolean): string => {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);

  if (params.has("drag")) {
    params.set("drag", isDraggable ? "1" : "0");
  } else {
    params.append("drag", isDraggable ? "1" : "0");
  }

  urlObj.search = params.toString();
  return urlObj.toString();
};

const addUrlParameters = (argName: string, argValue: string): string => {
  const urlObj = new URL(window.location.href);
  const params = new URLSearchParams(urlObj.search);

  if (!params.has(argName)) {
    params.append(argName, argValue);
  } else {
    params.set(argName, argValue);
  }
  if (argName === "video") {
    params.set("video", "1");
  }
  if (argName === "meeting") {
    params.set("meeting", "1");
  }
  if (argName === "preview") {
    params.set("preview", "1");
  }
  urlObj.search = params.toString();
  return urlObj.toString();
};

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

interface CommonApiButtonProps {
  feature: "chat" | "video" | "setting" | "footer" | "users";
  status: boolean;
  onToggle: (newStatus: boolean) => void;
  elementId?: string;
  orientation?: "horizontal" | "vertical";
  isDraggable?: boolean;
  width?: number;
  height?: number;
  size?: "small" | "medium" | "large";
}

const RenderCommonApiButton = ({
  feature,
  status,
  onToggle,
  elementId,
  orientation = "horizontal",
  isDraggable = true,
  width = 800,
  height = 600,
  size,
}: CommonApiButtonProps) => {
  const getDimensions = (size?: string) => {
    switch (size) {
      case "small":
        return { width: 400, height: 400 };
      case "medium":
        return { width: 600, height: 500 };
      case "large":
        return { width: 800, height: 800 };
      default:
        return { width, height };
    }
  };

  const handleClick = () => {
    const element = elementId ? document.getElementById(elementId) : null;
    const dimensions = getDimensions(size);

    switch (feature) {
      case "footer":
        if (status) {
          UIToolkit.hideControlsComponent(element);

          onToggle(false);
        } else {
          UIToolkit.showControlsComponent(element, { orientation });
          onToggle(true);
        }
        break;
      case "setting":
        if (status) {
          UIToolkit.hideSettingsComponent(element);
          onToggle(false);
        } else {
          UIToolkit.showSettingsComponent(element, {
            draggable: isDraggable,
            width: dimensions.width,
            height: dimensions.height,
          });
          onToggle(true);
        }
        break;

      case "chat":
        if (status) {
          UIToolkit.hideChatComponent(element);
          onToggle(false);
        } else {
          UIToolkit.showChatComponent(element, {
            draggable: isDraggable,
            width: dimensions.width,
            height: dimensions.height,
          });
          onToggle(true);
        }
        break;

      case "users":
        if (status) {
          UIToolkit.hideUsersComponent(element);
          onToggle(false);
        } else {
          UIToolkit.showUsersComponent(element, {
            draggable: isDraggable,
            width: dimensions.width,
            height: dimensions.height,
          });
          onToggle(true);
        }
        break;
      default:
        break;
    }
  };

  const capitalizedFeature = feature.charAt(0).toUpperCase() + feature.slice(1);

  return (
    <button onClick={handleClick} className="disabled:opacity-50 disabled:cursor-not-allowed">
      {status
        ? `Hide ${capitalizedFeature}${orientation === "vertical" ? "(Vertical)" : ""}`
        : `Show ${capitalizedFeature}${orientation === "vertical" ? "(Vertical)" : ""}`}
    </button>
  );
};

export default function DebugSettingDraggable({
  isDraggable,
  updateContainerSize,
  updateContainerPosition,
  resetContainer,
  handleFullscreen,
  currentResolution,
  currentPosition,
  isCustomizeLayout,
}: DebugSettingDraggableProps) {
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const hideTimeoutRef = useRef<number>();
  const controlPanelRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const settingNodeRef = useRef(null);
  const [settingPosition, setSettingPosition] = useState({ x: 30, y: 50 });
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [showCharts, setShowCharts] = useState(false);
  const handleSettingDrag = useCallback((_e: any, data: { x: number; y: number }) => {
    setSettingPosition({ x: data.x, y: data.y });
  }, []);

  const [uikitApiStatus, setuikitApiStatus] = useState({
    chat: false,
    video: false,
    setting: false,
    footer: false,
    users: false,
  });

  const [componentsDraggable, setComponentsDraggable] = useState(true);
  const [componentsSize, setComponentsSize] = useState<"small" | "medium" | "large">("small");
  const showControlsFunction = useCallback(() => {
    setIsControlsVisible(true);
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      controlPanelRef.current &&
      !controlPanelRef.current.contains(event.target as Node) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target as Node)
    ) {
      setIsControlsVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentTimeout = hideTimeoutRef.current;
      if (currentTimeout) {
        window.clearTimeout(currentTimeout);
      }
    };
  }, [handleClickOutside]);

  const toggleDraggable = () => {
    window.location.href = addDragParameter(window.location.href, !isDraggable);
  };

  const handlePerformanceTest = async () => {
    const performanceTest = new BrowserPerformanceTest();
    await performanceTest.runFullTest();
    setPerformanceMetrics(performanceTest.metrics);
    setShowCharts(true);
  };

  const customizeLayout = (
    <div className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        id="componentsDraggable"
        checked={componentsDraggable}
        onChange={(e) => setComponentsDraggable(e.target.checked)}
      />
      <label htmlFor="componentsDraggable">Draggable</label>
      <select
        value={componentsSize}
        className="bg-theme-surface text-theme-text rounded-md"
        onChange={(e) => setComponentsSize(e.target.value as "small" | "medium" | "large")}
      >
        <option value="small">Small(400x400) </option>
        <option value="medium">Medium(600x500) </option>
        <option value="large">Large(800x800) </option>
      </select>
    </div>
  );

  return (
    <>
      <Draggable
        position={settingPosition}
        onDrag={handleSettingDrag}
        bounds="body"
        handle=".uikit-demo-controls-icon-drag"
        nodeRef={settingNodeRef}
      >
        <div className="flex items-center" ref={settingNodeRef}>
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg flex items-center p-1.5 gap-2 border border-gray-200/50">
            <button className="text-gray-600 hover:text-gray-800 p-1.5 rounded-md hover:bg-gray-100/50 transition-colors uikit-demo-controls-icon-drag cursor-move">
              <svg className="w-4 h-4">
                <MoveIcon />
              </svg>
            </button>
            <button
              ref={toggleButtonRef}
              className="text-gray-600 hover:text-gray-800 p-1.5 rounded-md hover:bg-gray-100/50 transition-colors w-8 h-8"
              onClick={showControlsFunction}
              disabled={isControlsVisible}
            >
              <span className="text-lg">⚙️</span>
            </button>
            <button
              onClick={handlePerformanceTest}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-theme-text-button rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-sm w-8 h-8"
            >
              <span className="text-sm">📊</span>
            </button>
          </div>
        </div>
      </Draggable>

      <div
        ref={controlPanelRef}
        className={`uikit-demo-control-panel ${isControlsVisible ? "uikit-demo-expanded" : ""}`}
      >
        {!isCustomizeLayout && (
          <div className="uikit-demo-control-section">
            <h3>Controls</h3>
            {!isDraggable && <button onClick={() => toggleDraggable()}>Enable Draggable(Rejoin)</button>}
            {isDraggable && <button onClick={() => toggleDraggable()}>Disable Draggable</button>}
            <button onClick={resetContainer}>Reset Position / Size</button>
          </div>
        )}
        {!isCustomizeLayout && (
          <div className="uikit-demo-control-section">
            <h3>UIkit Size</h3>
            {[...Object.keys(STATIC_RESOLUTIONS), "fullscreen"].map((resolution) => (
              <button
                key={resolution}
                onClick={() => {
                  if (resolution === "fullscreen") {
                    handleFullscreen();
                  } else {
                    updateContainerSize(resolution as keyof typeof STATIC_RESOLUTIONS);
                    setTimeout(() => {
                      window.dispatchEvent(new Event("resize"));
                    }, 1000);
                  }
                }}
                className={currentResolution === resolution ? "uikit-demo-active" : ""}
              >
                {resolution}
              </button>
            ))}
          </div>
        )}
        {isDraggable && !isCustomizeLayout && (
          <div className="uikit-demo-control-section">
            <h3>Position</h3>
            {Object.keys(POSITIONS).map((position) => (
              <button
                key={position}
                onClick={() => updateContainerPosition(position as keyof typeof POSITIONS)}
                className={currentPosition === position ? "uikit-demo-active" : ""}
              >
                {position}
              </button>
            ))}
          </div>
        )}

        <div className="uikit-demo-control-section">
          {isLocalhost && (
            <>
              <h3>Local Test Tool</h3>
              <button
                onClick={() => {
                  window.location.href = addUrlParameters("video", "1");
                }}
              >
                Video Nav
              </button>
              <button
                onClick={() => {
                  window.location.href = addUrlParameters("meeting", "1");
                }}
              >
                Meeting Nav
              </button>
              <button
                onClick={() => {
                  window.location.href = addUrlParameters("preview", "1");
                }}
              >
                Preview
              </button>
              <button
                onClick={() => {
                  window.location.href = addUrlParameters("webapp", "1");
                }}
              >
                WebApp
              </button>
              <button
                onClick={() => {
                  window.location.href = addUrlParameters("probesdk", "1");
                }}
              >
                ProbeSDK
              </button>
              <button
                onClick={() => {
                  window.location.href = addUrlParameters("customizeVb", "1");
                }}
              >
                CustomizeVb
              </button>
              <button
                onClick={() => {
                  if (window.location.href.indexOf("&header=0&footer=0&preview=1") > 0) {
                    window.location.href = addUrlParameters("customizeLayout", "1");
                  } else {
                    window.location.href = addUrlParameters("customizeLayout", "1") + "&header=0&footer=0&preview=1";
                  }
                }}
              >
                CustomizeLayout
              </button>
              <br></br>
              <button
                onClick={() => {
                  window.location.href = addUrlParameters("env", "prod");
                }}
              >
                prod
              </button>
              <button
                onClick={() => {
                  window.location.href = addUrlParameters("env", "go");
                }}
              >
                go
              </button>

              <button
                onClick={() => {
                  window.location.href = addUrlParameters("env", "dev");
                }}
              >
                dev
              </button>

              <button
                onClick={() => {
                  window.location.href = addUrlParameters("debug", "0");
                }}
              >
                no debug
              </button>
              <button
                onClick={() => {
                  window.location.href = addUrlParameters("pepc", "1");
                }}
              >
                PEPC
              </button>
              <button
                onClick={() => {
                  window.location.href = addUrlParameters("lang", "zh-CN");
                }}
              >
                zh-CN
              </button>
            </>
          )}
        </div>

        <div className="uikit-demo-control-section">
          <h3>UIKIT API</h3>
          <button
            onClick={() => {
              UIToolkit.leaveSession();
            }}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Leave Session
          </button>
          <button
            onClick={() => {
              UIToolkit.closeSession();
            }}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close Session
          </button>

          {isCustomizeLayout && (
            <>
              <RenderCommonApiButton
                feature="footer"
                status={uikitApiStatus.footer}
                onToggle={(newStatus) => setuikitApiStatus({ ...uikitApiStatus, footer: newStatus })}
                elementId="uikit-container-customized-controls"
                orientation="horizontal"
              />
              <RenderCommonApiButton
                feature="footer"
                status={uikitApiStatus.footer}
                onToggle={(newStatus) => setuikitApiStatus({ ...uikitApiStatus, footer: newStatus })}
                elementId="uikit-container-customized-controls"
                orientation="vertical"
              />
              <br></br>
              <RenderCommonApiButton
                feature="setting"
                status={uikitApiStatus.setting}
                onToggle={(newStatus) => setuikitApiStatus({ ...uikitApiStatus, setting: newStatus })}
                elementId="uikit-container-customized-settings"
                isDraggable={componentsDraggable}
                size={componentsSize}
              />
              <RenderCommonApiButton
                feature="chat"
                status={uikitApiStatus.chat}
                onToggle={(newStatus) => setuikitApiStatus({ ...uikitApiStatus, chat: newStatus })}
                elementId="uikit-container-customized-chat"
                isDraggable={componentsDraggable}
                size={componentsSize}
              />
              <RenderCommonApiButton
                feature="users"
                status={uikitApiStatus.users}
                onToggle={(newStatus) => setuikitApiStatus({ ...uikitApiStatus, users: newStatus })}
                elementId="uikit-container-customized-users"
                isDraggable={componentsDraggable}
                size={componentsSize}
              />
              <br></br>
              {customizeLayout}
            </>
          )}
        </div>
      </div>

      {showCharts && performanceMetrics && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCharts(false);
          }}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-[90vw] max-w-[1200px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCharts(false)}
              className="performance-modal-close"
              aria-label="Close performance charts"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <PerformanceCharts metrics={performanceMetrics} />
          </div>
        </div>
      )}
    </>
  );
}
