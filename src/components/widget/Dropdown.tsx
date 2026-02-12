import { Check, MoreVertical } from "lucide-react";
import React, { useState, useRef } from "react";
import CommonDropdownWrap from "./CommonDropdownWrap";

interface DropdownProps {
  menuItems: {
    label: string;
    className?: string;
    checked?: boolean;
    onClick?: () => void | Promise<void>;
    group?: string;
    isHeader?: boolean;
  }[];
  title?: string;
  wrapperClass?: string;
  position?: "bottom" | "top" | "left" | "right" | "bottom-start" | "bottom-end" | "top-start" | "top-end" | string;
  trigger?: React.ReactNode;
  menuAlwaysOpen?: boolean;
  showIcon?: boolean;
  showCheckboxSpace?: boolean;
  defaultButtonRef?: React.RefObject<HTMLButtonElement>;
}

const Dropdown = ({
  menuItems,
  title,
  wrapperClass,
  position = "bottom",
  trigger,
  menuAlwaysOpen = false,
  showIcon = true,
  showCheckboxSpace = true,
  defaultButtonRef,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const internalRef = useRef(null);
  const buttonRef = defaultButtonRef || internalRef;

  const toggleDropdown = (e: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault();
    setIsOpen(!isOpen);
  };

  const renderMenuItems = () => {
    let currentGroup = null;

    return menuItems.map((item, index) => {
      if (!item) return null;

      const showDivider = currentGroup !== null && item.group !== currentGroup;
      currentGroup = item.group;

      const { isHeader } = item;

      if (isHeader) {
        return (
          <React.Fragment key={index}>
            {showDivider && <li className="border-b border-theme-border my-2" role="separator"></li>}
            <li className="p-1 flex items-center font-medium disabled:opacity-50">
              {showCheckboxSpace && (
                <div className="w-[20px] h-[20px] flex items-center justify-center">
                  {item.checked ? <Check size={16} /> : null}
                </div>
              )}
              <span className={`${showCheckboxSpace ? "ml-2" : "pl-2"} truncate max-w-[220px]`}>{item.label}</span>
            </li>
          </React.Fragment>
        );
      }

      return (
        <React.Fragment key={index}>
          {showDivider && <li className="border-b border-theme-border my-2" role="separator"></li>}
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className={`p-1 hover:bg-theme-background cursor-pointer justify-start flex items-center w-full text-left ${
                item.className ? item.className : "text-theme-text"
              }`}
              onClick={() => {
                setIsOpen(false);
                if (item.onClick) {
                  item.onClick();
                }
              }}
            >
              {showCheckboxSpace && (
                <div className="w-[20px] h-[20px] flex items-center justify-center">
                  {item.checked ? <Check size={16} /> : null}
                </div>
              )}
              <span className={`${showCheckboxSpace ? "ml-2" : "pl-2"} truncate max-w-[220px]`}>{item.label}</span>
            </button>
          </li>
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {showIcon && (
        <button ref={buttonRef} onClick={toggleDropdown} onTouchEnd={toggleDropdown} className={`${wrapperClass}`}>
          {trigger || title || <MoreVertical size={16} className="text-theme-text" />}
        </button>
      )}
      {(menuAlwaysOpen || isOpen) && (
        <CommonDropdownWrap
          isOpen={menuAlwaysOpen || isOpen}
          buttonRef={buttonRef}
          position={position}
          onClickOutside={() => setIsOpen(false)}
        >
          <ul className="pt-2 pb-2 max-h-[350px] overflow-y-auto uikit-custom-scrollbar scrollbar-track-transparent hover:scrollbar-thumb-theme-border/80 bg-theme-surface border border-theme-border rounded-lg">
            {renderMenuItems()}
          </ul>
        </CommonDropdownWrap>
      )}
    </>
  );
};

export default Dropdown;
