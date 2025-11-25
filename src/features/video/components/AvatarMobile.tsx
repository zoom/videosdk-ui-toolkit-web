import React, { useCallback, useMemo, useState } from "react";
import { EllipsisVertical, Headphones, MicOff, Signal, SignalLow, SignalMedium, VideoOff } from "lucide-react";
import { Participant } from "@/types";
import Dropdown from "@/components/widget/Dropdown";
import { isPortrait } from "@/components/util/service";
import { useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
interface AvatarProps {
  participant: Participant;
  bgColor: string;
  isShowName: boolean;
  isActiveSpeaker: boolean;
  aspectStyle: string;
  debug?: boolean;
  updateVideoResolution?: (id: number, quality: number) => Promise<void>;
}

const VideoQualityMap = {
  // "90p": 0,
  "180p": 1,
  "360p": 2,
  "720p": 3,
  // "1080p": 4,
};

const AvatarMobile = ({
  participant,
  bgColor,
  isActiveSpeaker,
  isShowName,
  aspectStyle,
  debug,
  updateVideoResolution,
}: AvatarProps) => {
  const { isControlsVisible } = useAppSelector(useSessionUISelector);
  const { userId, networkQualityMap } = useAppSelector(useSessionSelector);
  const avatarWrapperClass = useMemo(() => {
    return isActiveSpeaker
      ? `${bgColor} rounded-lg ${aspectStyle} relative overflow-hidden border-2 border-green-500`
      : `${bgColor} rounded-lg ${aspectStyle} relative overflow-hidden`;
  }, [aspectStyle, bgColor, isActiveSpeaker]);
  // The below state is only for testing purpose only
  const [currentTestResolution, setCurrentTestResolution] = useState("");

  const adjustResolutionMenuItems = Object.keys(VideoQualityMap).map((key) => {
    return {
      label: key,
      className: "flex items-center",
      checked: currentTestResolution === key,
      onClick: async () => {
        const videoQuality = VideoQualityMap[key];
        if (debug && updateVideoResolution) {
          await updateVideoResolution(participant?.userId, videoQuality);
          setCurrentTestResolution(key);
        }
      },
    };
  });

  const getNetworkQualityIcon = useCallback((level: number) => {
    if (level < 2) {
      return <SignalLow size={16} className="text-red-500" />;
    } else if (level < 3) {
      return <SignalMedium size={16} className="text-yellow-500" />;
    } else {
      return <Signal size={16} className="text-green-500" />;
    }
  }, []);

  return (
    <div className={avatarWrapperClass}>
      {participant?.userId !== userId && participant?.bVideoOn && isPortrait() && isControlsVisible && debug && (
        <Dropdown
          menuItems={adjustResolutionMenuItems}
          wrapperClass={"absolute top-2 right-2 z-10 bg-blue-500 rounded-full p-1"}
          trigger={<EllipsisVertical color="white" size={14} />}
          position="bottom"
        />
      )}
      {participant?.userId && debug && <div className="text-red-500 text-md">{participant.userId}</div>}
      <div className="absolute bottom-0 left-0 right-0 text-theme-text-button ">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 px-2 py-1 bg-black bg-opacity-50 w-auto max-w-full rounded-lg">
            {/* {debug && participant.bVideoOn && <div className="bg-red-500 text-theme-text-button px-2 rounded">{"16:9"}</div>} */}
            {/* {debug && <div className="bg-red-500 text-theme-text-button px-2 rounded">{selectedQuality}</div>} */}
            <div className="flex items-center space-x-1">
              {participant?.bVideoOn && networkQualityMap[participant?.userId] !== undefined && (
                <div className="text-theme-text-button rounded">
                  {getNetworkQualityIcon(networkQualityMap[participant?.userId].level)}
                </div>
              )}
              {participant?.audio === "" && (
                <div className="text-theme-text-button rounded">
                  <Headphones size={16} className="text-red-500" />
                </div>
              )}
              {participant?.muted === true && (
                <div className="text-theme-text-button rounded">
                  <MicOff size={16} className="text-red-500 fill-red-500  " />
                </div>
              )}
              {!participant?.bVideoOn && (
                <div className="text-theme-text-button rounded">
                  <VideoOff size={16} className="text-red-500 fill-red-500" />
                </div>
              )}
            </div>

            <span className="text-md pl-1 truncate w-auto">{participant?.displayName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarMobile;
