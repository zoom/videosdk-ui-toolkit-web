import React, { useRef, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { CommonMenuButton } from "../../../components/widget/CommonMenuButton";
import { useAppSelector, useWhiteboardSelector } from "@/hooks/useAppSelector";
import { useCurrentUser } from "@/features/participant/hooks";
import SessionAdditionalClientContext from "@/context/session-additional-context";

interface WhiteboardMenuOptionProps {
  title: string;
  orientation?: "horizontal" | "vertical";
  isLock: boolean;
  onPrivilegeChange: (isLock: boolean) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  excludeRefs?: React.RefObject<HTMLElement>[];
}

export const WhiteboardMenuOption: React.FC<WhiteboardMenuOptionProps> = ({
  title,
  isLock,
  onPrivilegeChange,
  isOpen,
  setIsOpen,
  orientation = "horizontal",
  excludeRefs,
}) => {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { whiteboardClient } = useContext(SessionAdditionalClientContext);
  const whiteboard = useAppSelector(useWhiteboardSelector);
  const currentUser = useCurrentUser();

  // Check if user can manage whiteboard lock (only host/manager)
  const canManageLock = () => {
    if (!currentUser) return false;
    return currentUser?.isHost || currentUser?.isManager;
  };

  const handleLockToggle = async () => {
    if (!whiteboardClient || !canManageLock()) return;

    try {
      const newLockState = !whiteboard.isLock;
      // todo: toggle whiteboard lock
      // Note: The lock state will be updated via whiteboard events
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to toggle whiteboard lock:", error);
    }
  };

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
      label: t("whiteboard.privilege_only_host"),
      onClick: () => onPrivilegeChange(true),
      checked: isLock,
      id: "only-host-whiteboard",
      className: "w-full text-left px-4 py-2 whitespace-normal",
    },
    {
      label: t("whiteboard.privilege_all_participants"),
      onClick: () => onPrivilegeChange(false),
      checked: !isLock,
      id: "one-participant-whiteboard",
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
