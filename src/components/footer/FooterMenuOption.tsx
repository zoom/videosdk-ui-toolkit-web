import React, { RefObject, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash-es";
import { useClickOutside } from "@/hooks/useClickOutside";
import { MediaDevice } from "@/types";
import Dropdown from "../widget/Dropdown";
import { CommonMenuButton } from "../widget/CommonMenuButton";

interface ButtonProps {
  text: string;
  click: () => void;
  key: string;
  id?: string;
  checked?: boolean;
  disabled?: boolean;
}

interface FooterMenuOptionProps {
  title: string;
  activeDevice: Record<string, string>;
  setSettings: (deviceId: string, type: string) => void;
  options: Record<string, MediaDevice[]>;
  labels: Record<string, string>;
  clickSettingsLink: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  otherButtons?: ButtonProps[];
  excludeRefs?: Array<any>;
  menuName?: string;
  orientation?: "horizontal" | "vertical";
  autoClose?: boolean;
}

export const FooterMenuOption: React.FC<FooterMenuOptionProps> = ({
  title,
  activeDevice,
  setSettings,
  options,
  clickSettingsLink,
  isOpen,
  setIsOpen,
  otherButtons = [],
  labels,
  excludeRefs,
  menuName,
  orientation = "horizontal",
  autoClose = true,
}) => {
  const { t } = useTranslation();
  const handleClickOutside = (isOutside: boolean) => {
    if (isOutside && autoClose) {
      setIsOpen(false);
    }
  };

  const menuRef = useClickOutside({ callback: handleClickOutside, excludeRefs });

  const otherButtonsComponent = useMemo(
    () =>
      otherButtons.map((button) => (
        <CommonMenuButton
          key={button.key}
          id={button.id}
          text={button.text}
          onClick={button.click}
          isActive={button.checked || false}
        />
      )),
    [otherButtons],
  );

  if (!isOpen) return null;

  if (orientation === "vertical") {
    const menuItems = Object.entries(options).flatMap(([key, values]) => [
      // Add header item for each section
      { label: labels[key], className: "text-sm", group: `${key}-header`, isHeader: true },
      // Map the devices
      ...values.map((option) => ({
        label: option.label === "Same as System" ? t("footer.same_as_system") : option.label,
        className: "text-sm",
        checked: activeDevice[key] === option.deviceId,
        onClick: () => setSettings(option.deviceId, key),
        group: key,
      })),
    ]);

    // Add other buttons if they exist
    if (!isEmpty(otherButtons)) {
      menuItems.push(
        ...otherButtons.map((button) => ({
          label: button.text,
          checked: button.checked,
          onClick: button.click,
          group: "other",
          className: "text-sm",
        })),
      );
    }

    // Add settings button
    menuItems.push({
      label: title,
      onClick: clickSettingsLink,
      group: "settings",
      checked: false,
      className: "text-sm",
    });

    return (
      <div ref={menuRef as RefObject<HTMLDivElement>}>
        <Dropdown
          menuItems={menuItems}
          menuAlwaysOpen={true}
          wrapperClass="w-full"
          position="bottom-end"
          showIcon={false}
          defaultButtonRef={menuRef as RefObject<HTMLButtonElement>}
        />
      </div>
    );
  }
  return (
    <div
      ref={menuRef as RefObject<HTMLDivElement>}
      className="absolute bottom-full left-0 mb-1 z-30 w-[16.5rem] max-w-[90vw] rounded-lg shadow-xl bg-theme-surface border border-theme-border text-theme-text"
    >
      <div className="p-4 max-h-[350px] overflow-y-auto pr-2 uikit-custom-scrollbar">
        {Object.entries(options).map(([key, values]) => (
          <div key={`footer-${key}-menu`} className="mb-4">
            <h4 className="text-sm font-medium mb-2">{labels[key]}</h4>
            <hr className="my-2 border-gray-200" />
            {values.map((option, idx) => (
              <CommonMenuButton
                key={option.deviceId}
                id={menuName ? `${labels[key]}-item${idx}` : option.label}
                text={option.label === "Same as System" ? t("footer.same_as_system") : option.label}
                onClick={() => setSettings(option.deviceId, key)}
                isActive={activeDevice[key] === option.deviceId}
              />
            ))}
            <hr className="my-2 border-gray-200" />
          </div>
        ))}

        {!isEmpty(otherButtons) && (
          <>
            {otherButtonsComponent}
            <hr className="my-2 border-gray-200" />
          </>
        )}
        <button
          className="w-full text-left py-2 px-3 text-sm rounded text-theme-text hover:bg-theme-background transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={(e) => {
            e.preventDefault();
            clickSettingsLink();
          }}
        >
          {title}
        </button>
      </div>
    </div>
  );
};

export default FooterMenuOption;
