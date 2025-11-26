import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { Tooltip } from "react-tooltip";
import { Pencil, Eraser, Circle, Square, Pen, Pipette, FileX, Undo, Redo, MousePointer2, Timer } from "lucide-react";
import { StreamContext } from "@/context/stream-context";
import { AnnotationToolType, AnnotationClearType } from "@zoom/videosdk";

import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import {
  setActiveAnnotationOption,
  setShowShapeMenu,
  setShowColorMenu,
  setShowClearMenu,
  setSelectedShape,
  setSelectedColorIdx,
  setSelectedWidthIdx,
  setIsToolBarExpanded,
  setShowPencilMenu,
  setShowTimerMenu,
  resetAnnotationStates,
  setAnnotationOptions,
} from "@/store/uiSlice";
import { setIsAnnotationStarted } from "@/store/sessionSlice";
import CircularSlider from "./CircularSlider";

interface AnnotationToolbarProps {
  position: string;
}

const AnnotationToolbar = ({ position }: AnnotationToolbarProps) => {
  const { stream } = useContext(StreamContext);
  const dispatch = useAppDispatch();

  // Check if annotation APIs are available
  const isAnnotationSupported = useMemo(() => {
    return Object.keys(AnnotationToolType).length > 0 && Object.keys(AnnotationClearType).length > 0;
  }, []);

  const {
    isToolBarExpanded,
    activeAnnotationOption,
    showShapeMenu,
    showColorMenu,
    showClearMenu,
    showTimerMenu,
    selectedShape,
    selectedColorIdx,
    selectedWidthIdx,
    canUndo,
    canRedo,
    showPencilMenu,
    annotationOptions,
  } = useAppSelector((state) => state.ui);
  const { isAnnotationStarted, isHost, userId, activeShareId, isScreenSharePaused, isSendingScreenShare } =
    useAppSelector((state) => state.session);

  const { displayTime, vanishingTime } = annotationOptions.vanishingToolTimer;

  const annotationController = useMemo(() => {
    try {
      // Check if stream has annotation methods
      if (stream && typeof stream.getAnnotationController === "function") {
        return stream.getAnnotationController();
      }
    } catch {
      // Annotation methods not available in this version
    }
    return null;
  }, [stream]);

  const shapeMenuRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const clearMenuRef = useRef<HTMLDivElement>(null);
  const pencilMenuRef = useRef<HTMLDivElement>(null);
  const timerMenuRef = useRef<HTMLDivElement>(null);

  const toolbarOptions = useMemo(
    () =>
      [
        { id: "mouse", anchorId: "uikit-annotation-mouse", icon: MousePointer2, label: "Mouse", color: "bg-gray-700" },
        { id: "eraser", anchorId: "uikit-annotation-eraser", icon: Eraser, label: "Erase", color: "bg-gray-700" },
        { id: "undo", anchorId: "uikit-annotation-undo", icon: Undo, label: "Undo", color: "bg-gray-500" },
        { id: "redo", anchorId: "uikit-annotation-redo", icon: Redo, label: "Redo", color: "bg-gray-500" },
        { id: "pencil", anchorId: "uikit-annotation-pencil", icon: Pencil, label: "Pen", color: "bg-green-500" },
        { id: "color", anchorId: "uikit-annotation-color", icon: Pipette, label: "Color", color: "bg-gray-100" },
        isSendingScreenShare && {
          id: "timer",
          anchorId: "uikit-annotation-timer",
          icon: Timer,
          label: "Vanishing tool timer",
          color: "bg-gray-600",
        },
        { id: "shape", anchorId: "uikit-annotation-shape", icon: Square, label: "Shapes", color: "bg-blue-500" },
        { id: "clear", anchorId: "uikit-annotation-clear", icon: FileX, label: "Clear", color: "bg-white" },
      ].filter(Boolean),
    [isSendingScreenShare],
  );

  const { shapeButtonIndex, colorButtonIndex, clearButtonIndex, timerButtonIndex } = useMemo(
    () => ({
      shapeButtonIndex: toolbarOptions.findIndex((option) => option.id === "shape"),
      colorButtonIndex: toolbarOptions.findIndex((option) => option.id === "color"),
      clearButtonIndex: toolbarOptions.findIndex((option) => option.id === "clear"),
      timerButtonIndex: toolbarOptions.findIndex((option) => option.id === "timer"),
    }),
    [toolbarOptions],
  );

  const shapeOptions = useMemo(() => {
    if (!isAnnotationSupported) return [];

    return [
      { id: "line", label: "Line", toolType: AnnotationToolType.Line },
      { id: "arrow", label: "Arrow", toolType: AnnotationToolType.Arrow1 },
      isSendingScreenShare && { id: "spotlight", label: "Spotlight", toolType: AnnotationToolType.Spotlight },
      { id: "arrow_name", label: "Name Arrow", toolType: AnnotationToolType.Arrow },
      { id: "rectangle", label: "Rectangle", toolType: AnnotationToolType.Rectangle },
      { id: "rectangle_semi_fill", label: "Rectangle (Semi Fill)", toolType: AnnotationToolType.RectangleSemiFill },
      { id: "ellipse", label: "Ellipse", toolType: AnnotationToolType.Ellipse },
      { id: "ellipse_semi_fill", label: "Ellipse (Semi Fill)", toolType: AnnotationToolType.EllipseSemiFill },
      { id: "double_arrow", label: "Double Arrow", toolType: AnnotationToolType.DoubleArrow },
      { id: "rectangle_fill", label: "Rectangle (Fill)", toolType: AnnotationToolType.RectangleFill },
      { id: "ellipse_fill", label: "Ellipse (Fill)", toolType: AnnotationToolType.EllipseFill },
      { id: "diamond", label: "Diamond", toolType: AnnotationToolType.Diamond },
      { id: "diamond_semi_fill", label: "Diamond (Semi Fill)", toolType: AnnotationToolType.DiamondSemiFill },
      { id: "diamond_fill", label: "Diamond (Fill)", toolType: AnnotationToolType.DiamondFill },
      { id: "stamp_arrow", label: "Stamp Arrow", toolType: AnnotationToolType.StampArrow },
      { id: "stamp_check", label: "Stamp Check", toolType: AnnotationToolType.StampCheck },
      { id: "stamp_x", label: "Stamp X", toolType: AnnotationToolType.StampX },
      { id: "stamp_star", label: "Stamp Star", toolType: AnnotationToolType.StampStar },
      { id: "stamp_heart", label: "Stamp Heart", toolType: AnnotationToolType.StampHeart },
      { id: "stamp_question", label: "Stamp Question", toolType: AnnotationToolType.StampQuestionMark },
      { id: "vanishing_pen", label: "Vanishing pen", toolType: AnnotationToolType.VanishingPen },
      { id: "vanishing_rectangle", label: "Vanishing rectangle", toolType: AnnotationToolType.VanishingRectangle },
      { id: "vanishing_ellipse", label: "Vanishing ellipse", toolType: AnnotationToolType.VanishingEllipse },
      { id: "vanishing_diamond", label: "Vanishing diamond", toolType: AnnotationToolType.VanishingDiamond },
      { id: "vanishing_arrow", label: "Vanishing arrow", toolType: AnnotationToolType.VanishingArrow },
      {
        id: "vanishing_double_arrow",
        label: "Vanishing double arrow",
        toolType: AnnotationToolType.VanishingDoubleArrow,
      },
    ].filter(Boolean);
  }, [isSendingScreenShare, isAnnotationSupported]);

  const clearOptions = useMemo(() => {
    if (!isAnnotationSupported) return [];

    const options = [{ id: "clear_mine", value: AnnotationClearType.Mine, label: "Clear mine" }];

    if (userId === activeShareId) {
      options.push({ id: "clear_viewer", value: AnnotationClearType.Viewer, label: "Clear viewer" });
    }

    if (isHost || userId === activeShareId) {
      options.push({ id: "clear_all", value: AnnotationClearType.All, label: "Clear all" });
    }

    return options;
  }, [isHost, userId, activeShareId, isAnnotationSupported]);

  const colorOptions = useMemo(
    () => [
      { id: "black", value: "0xff000000", displayColor: "#000000" },
      { id: "red", value: "0xffff1919", displayColor: "#ff1919" },
      { id: "blue", value: "0xff2e8cff", displayColor: "#2e8cff" },
      { id: "green", value: "0xff82c786", displayColor: "#82c786" },
      { id: "yellow", value: "0xffffde32", displayColor: "#ffde32" },
      { id: "orange", value: "0xffff8a00", displayColor: "#ff8a00" },
      { id: "pink", value: "0xffff38c7", displayColor: "#ff38c7" },
      { id: "light_purple", value: "0xffb479ff", displayColor: "#b479ff" },
    ],
    [],
  );

  const widthOptions = useMemo(
    () => [
      { id: "thin", value: 2 },
      { id: "medium", value: 8 },
      { id: "thick", value: 16 },
    ],
    [],
  );

  const handleToggleExpand = useCallback(async () => {
    try {
      // Don't allow any annotation actions if screen share is paused or annotation is not supported
      if (isScreenSharePaused || !isAnnotationSupported) {
        return;
      }

      if (isAnnotationStarted) {
        if (isToolBarExpanded) {
          if (stream && typeof stream.stopAnnotation === "function") {
            await stream.stopAnnotation();
          }
          //update other states
          dispatch(setIsToolBarExpanded(false));
          dispatch(setIsAnnotationStarted(false));
          dispatch(resetAnnotationStates());
        } else {
          // for the case of event viewer request draw
          dispatch(setIsToolBarExpanded(true));
        }
      } else {
        if (!isToolBarExpanded) {
          if (stream && typeof stream.startAnnotation === "function") {
            await stream.startAnnotation();
          }
          dispatch(setIsToolBarExpanded(true));
          dispatch(setIsAnnotationStarted(true));
        } else {
          // we should not make this happen. If this case happens, it's a bug
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, [isAnnotationStarted, isToolBarExpanded, stream, dispatch, isScreenSharePaused, isAnnotationSupported]);

  const handleOptionClick = useCallback(
    (option: string) => {
      dispatch(setActiveAnnotationOption(option));
      if (option !== "shape") {
        dispatch(setShowShapeMenu(false));
      }
      if (option !== "color") {
        dispatch(setShowColorMenu(false));
      }
    },
    [dispatch],
  );

  const handleShapeClick = useCallback(
    async (shape: string) => {
      const selectedShapeOption = shapeOptions.find((option) => option.id === shape);
      if (selectedShapeOption && annotationController) {
        await annotationController.setToolType(selectedShapeOption.toolType);
        const toolColor = await annotationController.getToolColor();
        const colorIdx = colorOptions.findIndex((option) => parseInt(option.value, 16) === toolColor);
        dispatch(setSelectedColorIdx(colorIdx));
        dispatch(setSelectedShape(shape));
        dispatch(setShowShapeMenu(false));
      }
    },
    [shapeOptions, annotationController, colorOptions, dispatch],
  );

  const handleColorClick = useCallback(
    async (colorIdx: number) => {
      if (annotationController) {
        const colorValue = parseInt(colorOptions[colorIdx].value, 16);
        await annotationController.setToolColor(colorValue);
        dispatch(setSelectedColorIdx(colorIdx));
        dispatch(setShowColorMenu(false));
      }
    },
    [colorOptions, annotationController, dispatch],
  );

  const handleClearClick = useCallback(
    async (clearType: any) => {
      try {
        if (!isAnnotationSupported || !annotationController) return;
        await annotationController.clear(clearType);
        dispatch(setShowClearMenu(false));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to clear annotation:", error);
      }
    },
    [annotationController, dispatch, isAnnotationSupported],
  );

  const handleWidthClick = useCallback(
    async (widthIdx: number) => {
      if (annotationController) {
        const widthValue = widthOptions[widthIdx].value;
        await annotationController.setToolWidth(widthValue);
        dispatch(setSelectedWidthIdx(widthIdx));
        dispatch(setShowPencilMenu(false));
      }
    },
    [widthOptions, annotationController, dispatch],
  );

  const handleUndo = useCallback(async () => {
    try {
      if (canUndo && annotationController) {
        await annotationController.undo();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to undo annotation:", error);
    }
  }, [annotationController, canUndo]);

  const handleRedo = useCallback(async () => {
    try {
      if (canRedo && annotationController) {
        await annotationController.redo();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to redo annotation:", error);
    }
  }, [annotationController, canRedo]);

  const handleToolbarButtonClick = useCallback(
    async (_event: React.MouseEvent, option: { id: string }) => {
      handleOptionClick(option.id);

      try {
        if (!isAnnotationSupported || !annotationController) {
          // eslint-disable-next-line no-console
          console.warn("Annotation is not supported in this VideoSDK version");
          return;
        }

        switch (option.id) {
          case "mouse":
            await annotationController.setToolType(AnnotationToolType.None);
            break;
          case "shape":
            dispatch(setShowShapeMenu(!showShapeMenu));
            break;
          case "color":
            dispatch(setShowColorMenu(!showColorMenu));
            break;
          case "pencil": {
            await annotationController.setToolType(AnnotationToolType.Pen);
            const toolColor = await annotationController.getToolColor();
            const colorIdx = colorOptions.findIndex((option) => parseInt(option.value, 16) === toolColor);
            dispatch(setSelectedColorIdx(colorIdx));
            dispatch(setSelectedShape(null));
            dispatch(setShowPencilMenu(!showPencilMenu));
            break;
          }
          case "clear":
            dispatch(setShowClearMenu(!showClearMenu));
            break;
          case "eraser":
            await annotationController.setToolType(AnnotationToolType.Eraser);
            break;
          case "undo":
            await handleUndo();
            break;
          case "redo":
            await handleRedo();
            break;
          case "timer":
            dispatch(setShowTimerMenu(!showTimerMenu));
            break;
          default:
            // No action needed for other options
            break;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error handling toolbar button click:", error);
      }
    },
    [
      handleOptionClick,
      showShapeMenu,
      showColorMenu,
      showPencilMenu,
      showClearMenu,
      showTimerMenu,
      annotationController,
      handleUndo,
      handleRedo,
      colorOptions,
      dispatch,
      isAnnotationSupported,
    ],
  );

  const handleVanishingToolTimerChange = useCallback(
    async (displayTime: number, vanishingTime: number) => {
      if (!annotationController) return;
      await annotationController?.setVanishingToolTimer({ displayTime, vanishingTime });
      dispatch(setAnnotationOptions({ vanishingToolTimer: { displayTime, vanishingTime } }));
    },
    [annotationController, dispatch],
  );

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shapeMenuRef.current && !shapeMenuRef.current.contains(event.target as Node)) {
        dispatch(setShowShapeMenu(false));
      }
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target as Node)) {
        dispatch(setShowColorMenu(false));
      }
      if (pencilMenuRef.current && !pencilMenuRef.current.contains(event.target as Node)) {
        dispatch(setShowPencilMenu(false));
      }
      if (clearMenuRef.current && !clearMenuRef.current.contains(event.target as Node)) {
        dispatch(setShowClearMenu(false));
      }
      if (timerMenuRef.current && !timerMenuRef.current.contains(event.target as Node)) {
        dispatch(setShowTimerMenu(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  // Don't render toolbar if annotation is not supported
  if (!isAnnotationSupported) {
    return null;
  }

  return (
    <div
      className={`uikit-annotation-toolbar flex items-end justify-center h-[280px] bg-transparent rounded-lg ${position}`}
    >
      <div className="relative">
        <button
          id="uikit-annotation-toolbar-button"
          onClick={handleToggleExpand}
          className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-500 z-10
            ${isToolBarExpanded ? "bg-red-500 rotate-45" : "bg-green-600"}
            ${isScreenSharePaused || !isAnnotationSupported ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"}`}
          style={{
            width: isToolBarExpanded ? "24px" : "28px",
            height: isToolBarExpanded ? "24px" : "28px",
            paddingBottom: isToolBarExpanded ? "4px" : "0px",
          }}
          disabled={isScreenSharePaused || !isAnnotationSupported}
        >
          {isToolBarExpanded ? (
            <span className="text-white text-2xl font-bold">+</span>
          ) : (
            <Pen className="w-3 h-3 text-white" />
          )}
        </button>
        <Tooltip
          anchorSelect="#uikit-annotation-toolbar-button"
          content={
            !isAnnotationSupported
              ? "Annotation not supported in this VideoSDK version"
              : isToolBarExpanded
                ? "Close"
                : "Annotate"
          }
          place="right"
          style={{ fontSize: "10px", padding: "0 5px" }}
          noArrow
        />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          {toolbarOptions.map((option, index) => (
            <div key={option.id} className="relative">
              <button
                id={option.anchorId}
                onClick={(event) => handleToolbarButtonClick(event, option)}
                className={`absolute left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full text-white shadow-md transition-all ${
                  option.color
                } ${activeAnnotationOption === option.id ? "ring-2 ring-white" : ""} ${
                  (option.id === "undo" && !canUndo) || (option.id === "redo" && !canRedo)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                style={{
                  width: "24px",
                  height: "24px",
                  opacity: isToolBarExpanded ? 1 : 0,
                  bottom: isToolBarExpanded ? `${(index + 1) * 30}px` : "0px",
                  pointerEvents: isToolBarExpanded ? "auto" : "none",
                }}
                disabled={(option.id === "undo" && !canUndo) || (option.id === "redo" && !canRedo)}
              >
                {option.id === "shape" ? (
                  <Square className="w-3 h-3" />
                ) : option.id === "color" ? (
                  <option.icon color={colorOptions[selectedColorIdx].displayColor} className="w-3 h-3" />
                ) : option.id === "clear" ? (
                  <option.icon color="red" className="w-3 h-3" />
                ) : (
                  <option.icon className="w-3 h-3" />
                )}
              </button>
              <Tooltip
                anchorSelect={`#${option.anchorId}`}
                content={option.label}
                place="right"
                style={{ fontSize: "10px", padding: "0 5px" }}
                noArrow
              />
              {option.id === "shape" && showShapeMenu && isToolBarExpanded && (
                <div
                  ref={shapeMenuRef}
                  className="absolute left-5 rounded-lg shadow-lg p-2 z-20 transition-all duration-300 bg-theme-surface"
                  style={{
                    bottom: `${(shapeButtonIndex + 1) * 30 - 200 + 24}px`,
                    opacity: 1,
                    transform: "scale(1)",
                    transformOrigin: "left center",
                  }}
                >
                  <div className="flex flex-col w-[200px] text-sm text-theme-text dark:text-gray-200 max-h-[200px] overflow-y-auto uikit-custom-scrollbar">
                    {shapeOptions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleShapeClick(item.id)}
                        className={`p-2 text-left rounded transition-colors ${
                          selectedShape === item.id
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                            : "hover:bg-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {option.id === "color" && showColorMenu && isToolBarExpanded && (
                <div
                  ref={colorMenuRef}
                  className="absolute left-5 rounded-lg shadow-lg p-2 z-20 transition-all duration-300 flex justify-center bg-theme-surface"
                  style={{
                    bottom: `${(colorButtonIndex + 1) * 30 - 64 + 24}px`,
                    opacity: 1,
                    transform: "scale(1)",
                    transformOrigin: "left center",
                  }}
                >
                  <div className="grid grid-cols-4 gap-4 w-[120px] text-theme-tex">
                    {colorOptions.map((item, idx) => (
                      <button key={item.id} onClick={() => handleColorClick(idx)}>
                        <Circle fill={item.displayColor} color={item.displayColor} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {option.id === "clear" && showClearMenu && isToolBarExpanded && (
                <div
                  ref={clearMenuRef}
                  className="absolute left-5 rounded-lg shadow-lg p-2 z-20 transition-all duration-300 bg-theme-surface"
                  style={{
                    bottom: `${(clearButtonIndex + 1) * 30 - (100 * clearOptions?.length) / 3 + 24}px`,
                    opacity: 1,
                    transform: "scale(1)",
                    transformOrigin: "left center",
                  }}
                >
                  <div className="flex flex-col w-[100px] text-sm text-theme-tex">
                    {clearOptions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleClearClick(item.value)}
                        className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {option.id === "pencil" && showPencilMenu && isToolBarExpanded && (
                <div
                  ref={pencilMenuRef}
                  className="absolute left-5 rounded-lg shadow-lg p-2 z-20 transition-all duration-300 bg-theme-surface"
                  style={{
                    bottom: `${(index + 1) * 30 - 36 + 24}px`,
                    opacity: 1,
                    transform: "scale(1)",
                    transformOrigin: "left center",
                  }}
                >
                  <div className="flex gap-2 items-center">
                    {widthOptions.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => handleWidthClick(idx)}
                        className={`p-1 rounded-md transition-colors ${
                          selectedWidthIdx === idx
                            ? "bg-blue-100 dark:bg-blue-900"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div
                          className={`rounded-full ${
                            selectedWidthIdx === idx ? "dark:bg-blue-400" : "dark:bg-gray-200"
                          }`}
                          style={{
                            width: `${item.value}px`,
                            height: `${item.value}px`,
                            backgroundColor: `${colorOptions[selectedColorIdx].displayColor}`,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {option.id === "timer" && showTimerMenu && isToolBarExpanded && (
                <div
                  ref={timerMenuRef}
                  className="absolute left-5 rounded-lg shadow-lg p-2 z-20 transition-all duration-300 bg-theme-surface"
                  style={{
                    bottom: `${(timerButtonIndex + 1) * 30 - 175 - 16 + 24}px`,
                    opacity: 1,
                    transform: "scale(1)",
                    transformOrigin: "left center",
                  }}
                >
                  <div className="flex flex-col justify-center items-center w-[130px] h-[175px] text-sm text-gray-700 dark:text-gray-200">
                    <span className="text-xs font-semibold text-theme-text">Vanishing Tool Timer</span>
                    <CircularSlider
                      width={120}
                      height={120}
                      min={0}
                      max={(displayTime + vanishingTime) / 1000}
                      knobRadius={8}
                      value={displayTime / 1000}
                      onChange={async (value) => {
                        await handleVanishingToolTimerChange(value * 1000, displayTime + vanishingTime - value * 1000);
                      }}
                      threshold={(displayTime + vanishingTime) / 1000 - 1}
                      showThreshold={true}
                      valueText={"Display time(s)"}
                    />
                    <span className="text-xs font-semibold text-theme-text mt-1">{"Total duration(s)"}</span>
                    <div className="flex items-center space-x-1 bg-theme-surface">
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={(displayTime + vanishingTime) / 1000}
                        onChange={async (e) => {
                          const value = parseInt(e.target.value || "1");
                          const totalDuration = Math.min(Math.max(value, 1), 15);
                          const vanishingTime = Math.max(totalDuration - displayTime / 1000, 1);
                          const newDisplayTime = totalDuration - vanishingTime;
                          await handleVanishingToolTimerChange(newDisplayTime * 1000, vanishingTime * 1000);
                        }}
                        className="w-[60px] px-2 py-1 border border-gray-300 rounded bg-theme-surface text-theme-text text-sm"
                        id={`uikit-annotation-vanishing-timer-input`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnotationToolbar;
