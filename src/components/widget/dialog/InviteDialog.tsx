import React, { useEffect, useState } from "react";
import { X, Phone, ChevronDown, Globe } from "lucide-react";
import Select, { GroupBase } from "react-select";
import CommonTab from "../CommonTab";
import { CallInTab } from "../../../features/audio/phone/CallInTab";
import { CallOutTab } from "../../../features/audio/phone/CallOutTab";
import { RoomSystemTab } from "../../../features/audio/phone/RoomSystemTab";
import { useSessionSelector, useAppSelector } from "@/hooks/useAppSelector";
import { THEME_COLOR_CLASS } from "@/constant";

interface InviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteDialog: React.FC<InviteDialogProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"callIn" | "callOut" | "roomSystem">("callOut");
  const { callInInfo, callOutCountry, isEnablePhone, featuresOptions } = useAppSelector(useSessionSelector);
  const isUserDisablePhone = !featuresOptions?.phone?.enable;
  const isUserDisableCrc = !featuresOptions?.crc?.enable;

  const isDisabledCallIn = isUserDisablePhone || !callInInfo;
  const isDisabledCallOut = isUserDisablePhone || !callOutCountry;
  const isDisabledRoomSystem = isUserDisableCrc;

  useEffect(() => {
    // Set default active tab based on what's available
    if (!isDisabledCallIn) {
      setActiveTab("callIn");
    } else if (!isDisabledCallOut) {
      setActiveTab("callOut");
    } else if (!isDisabledRoomSystem) {
      setActiveTab("roomSystem");
    }
  }, [isDisabledCallOut, isDisabledCallIn, isDisabledRoomSystem]);

  if (!isOpen) return null;

  const inputClasses = "border-gray-600 text-theme-text-button focus:ring-blue-500 focus:border-blue-500";

  const darkModeTextClasses = "";

  if (isUserDisablePhone && isUserDisableCrc) {
    return (
      <div className={`p-4 w-full ${THEME_COLOR_CLASS}`}>
        <div>Room System(CRC) and Phone are not enabled</div>
      </div>
    );
  }

  return (
    <div className={`p-4 w-full ${THEME_COLOR_CLASS}`}>
      <CommonTab
        tabs={[
          { name: "callIn", title: "Call In", disabled: isDisabledCallIn },
          { name: "callOut", title: "Call Out", disabled: isDisabledCallOut },
          { name: "roomSystem", title: "Room System", disabled: isDisabledRoomSystem },
        ].filter((tab) => !tab.disabled)}
        orientation="horizontal"
        className="justify-center"
        activeTab={activeTab}
        setActiveTab={(tabName) => setActiveTab(tabName as "callIn" | "callOut" | "roomSystem")}
      />

      {activeTab === "callOut" && !isDisabledCallOut && (
        <CallOutTab inputClasses={inputClasses} darkModeTextClasses={darkModeTextClasses} />
      )}
      {activeTab === "roomSystem" && !isDisabledRoomSystem && <RoomSystemTab inputClasses={inputClasses} />}
      {activeTab === "callIn" && !isDisabledCallIn && <CallInTab inputClasses={inputClasses} />}
    </div>
  );
};

export default InviteDialog;
