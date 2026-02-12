import Dropdown from "@/components/widget/Dropdown";
import { useAppDispatch, useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setIsOriginalShareContentSize } from "@/store/uiSlice";
import { Monitor } from "lucide-react";
import { useMemo, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";

type ShareIndicatorBarBaseProps = {
  actions?: ReactNode;
  onBeforeSetOriginalSize?: () => boolean | void;
};

const ShareIndicatorBarBase = ({ actions, onBeforeSetOriginalSize }: ShareIndicatorBarBaseProps) => {
  const { t } = useTranslation();
  const nodeRef = useRef(null);
  const { activeSharerName } = useAppSelector(useSessionSelector);
  const { isOriginalShareContentSize } = useAppSelector(useSessionUISelector);
  const dispatch = useAppDispatch();
  const viewOptionMenuItems = useMemo(
    () => [
      {
        label: t("share.view_fit_to_window"),
        className: "text-sm font-medium text-theme-text",
        checked: !isOriginalShareContentSize,
        onClick: () => {
          dispatch(setIsOriginalShareContentSize(false));
        },
      },
      {
        label: t("share.view_original_size"),
        className: "text-sm font-medium text-theme-text",
        checked: isOriginalShareContentSize,
        onClick: () => {
          const shouldProceed = onBeforeSetOriginalSize?.();
          if (shouldProceed === false) return;
          dispatch(setIsOriginalShareContentSize(true));
        },
      },
    ],
    [isOriginalShareContentSize, dispatch, t, onBeforeSetOriginalSize],
  );

  return (
    <div className="fixed z-40">
      <Draggable
        bounds="body"
        defaultPosition={{ x: window.innerWidth / 2, y: 100 }}
        positionOffset={{ x: "-50%", y: 0 }}
        nodeRef={nodeRef}
        cancel=".uikit-share-bar-no-drag"
      >
        <div
          className="flex items-center gap-2 bg-theme-surface rounded-lg py-2 px-4 shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-opacity-70 backdrop-blur-sm border border-theme-border"
          ref={nodeRef}
        >
          <Monitor className="w-3 h-3 text-green-600" />
          <div className="flex text-sm font-medium text-theme-text">
            <span>{t("share.viewing_screen")} &nbsp;</span>
            <span className="whitespace-nowrap max-w-[150px] truncate" title={activeSharerName}>
              {activeSharerName}
            </span>
            <span>{t("share.viewing_screen_suffix")}</span>
          </div>
          <Dropdown
            trigger={
              <div className="uikit-share-bar-no-drag rounded-lg bg-theme-surface px-2 py-1 text-sm font-medium text-theme-text hover:bg-theme-background border border-theme-border">
                {t("share.view_options")}
              </div>
            }
            menuItems={viewOptionMenuItems}
          />
          {actions}
        </div>
      </Draggable>
    </div>
  );
};

export default ShareIndicatorBarBase;
