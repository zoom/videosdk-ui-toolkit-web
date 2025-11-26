import Dropdown from "@/components/widget/Dropdown";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsOriginalShareContentSize } from "@/store/uiSlice";
import { Monitor } from "lucide-react";
import { useMemo, useRef } from "react";
import Draggable from "react-draggable";

const ShareIndicatorBar = () => {
  const nodeRef = useRef(null);
  const { activeSharerName } = useAppSelector(useSessionSelector);
  const { isOriginalShareContentSize } = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();
  const viewOptionMenuItems = useMemo(
    () => [
      {
        label: "Fit to window",
        className: "text-sm font-medium text-theme-text",
        checked: !isOriginalShareContentSize,
        onClick: () => {
          dispatch(setIsOriginalShareContentSize(false));
        },
      },
      {
        label: "Original size",
        className: "text-sm font-medium text-theme-text",
        checked: isOriginalShareContentSize,
        onClick: () => {
          dispatch(setIsOriginalShareContentSize(true));
        },
      },
    ],
    [isOriginalShareContentSize, dispatch],
  );

  return (
    <div className="fixed z-40">
      <Draggable
        bounds="body"
        defaultPosition={{ x: (window.innerWidth - 400) / 2, y: 100 }}
        nodeRef={nodeRef}
        cancel=".uikit-share-bar-no-drag"
      >
        <div
          className="flex items-center gap-2 bg-theme-surface rounded-lg py-2 px-4 shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-opacity-70 backdrop-blur-sm border border-theme-border"
          ref={nodeRef}
        >
          <Monitor className="w-3 h-3 text-green-600" />
          <div className="flex text-sm font-medium text-theme-text">
            <span>You are viewing &nbsp;</span>
            <span className="whitespace-nowrap max-w-[150px] truncate" title={activeSharerName}>
              {activeSharerName}
            </span>
            <span>{"'s screen"}</span>
          </div>
          <Dropdown
            trigger={
              <div className="uikit-share-bar-no-drag rounded-lg bg-theme-surface px-2 py-1 text-sm font-medium text-theme-text hover:bg-theme-background border border-theme-border">
                View options
              </div>
            }
            menuItems={viewOptionMenuItems}
          />
        </div>
      </Draggable>
    </div>
  );
};

export default ShareIndicatorBar;
