import React, { useRef, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { CommonMenuButton } from "../../../components/widget/CommonMenuButton";
import { SharePrivilege } from "@zoom/videosdk";

interface ShareMenuOptionProps {
  title: string;
  privilege: SharePrivilege;
  onPrivilegeChange: (privilege: SharePrivilege) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orientation?: "horizontal" | "vertical";
  excludeRefs?: React.RefObject<HTMLElement>[];
}

export const ShareMenuOption: React.FC<ShareMenuOptionProps> = ({
  title,
  privilege,
  onPrivilegeChange,
  isOpen,
  setIsOpen,
  orientation = "horizontal",
  excludeRefs,
}) => {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !excludeRefs?.some((ref) => ref.current?.contains(event.target as Node))
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen, excludeRefs]);

  if (!isOpen) return null;

  const menuItems = [
    {
      label: t("settings.share_privilege_locked"),
      onClick: () => onPrivilegeChange(SharePrivilege.Locked),
      checked: privilege === SharePrivilege.Locked,
      id: "only-host-share",
      className: "w-full text-left px-4 py-2 whitespace-normal",
    },
    {
      label: t("settings.share_privilege_multiple"),
      onClick: () => onPrivilegeChange(SharePrivilege.MultipleShare),
      checked: privilege === SharePrivilege.MultipleShare,
      id: "multiple-participants-share",
      className: "w-full text-left px-4 py-2 whitespace-normal",
    },
    {
      label: t("settings.share_privilege_unlocked"),
      onClick: () => onPrivilegeChange(SharePrivilege.Unlocked),
      checked: privilege === SharePrivilege.Unlocked,
      id: "one-participant-share",
      className: "w-full text-left px-4 py-2 whitespace-normal",
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full left-0 mb-1 w-92 rounded-lg shadow-xl z-30 bg-theme-surface border border-theme-border text-theme-text"
    >
      <div className="p-2">
        <h3 className="font-semibold mb-2">{title}</h3>
        <hr className="border-gray-200" />

        {menuItems.map((item, index) => (
          <div className="" key={item.id}>
            <CommonMenuButton
              text={item.label}
              onClick={item.onClick}
              isActive={item.checked}
              className={item.className}
              id={item.id}
            />
            {index < menuItems.length - 1 && <div className="border-b border-theme-border"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShareMenuOption;
