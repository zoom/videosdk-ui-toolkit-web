import React, { useCallback, useContext, useMemo, useState } from "react";
import { EllipsisVertical, Headphones, MicOff, Signal, SignalLow, SignalMedium, VideoOff } from "lucide-react";
import { Participant } from "@/types";
import Dropdown from "@/components/widget/Dropdown";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { StreamContext } from "@/context/stream-context";
import { useCurrentUser, useParticipantMenu } from "@/features/participant/hooks";

interface AvatarProps {
  participant: Participant;
  bgColor: string;
  isActiveSpeaker: boolean;
  isSpeakerCell?: boolean;
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

const Avatar = ({
  participant,
  bgColor,
  isActiveSpeaker,
  isSpeakerCell,
  debug,
  updateVideoResolution,
}: AvatarProps) => {
  const [selectedQuality, setSelectedQuality] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const { userId, isHost, isManager, spotlightUserList, networkQualityMap } = useAppSelector(useSessionSelector);
  const { stream } = useContext(StreamContext);
  const currentUser = useCurrentUser();

  const isSelf = participant?.userId === userId;

  const avatarWrapperClass = useMemo(() => {
    return isActiveSpeaker
      ? `${bgColor} rounded-lg aspect-video relative overflow-hidden border-2 border-green-500 ${isSpeakerCell ? "col-span-2 row-span-2" : ""}`
      : `${bgColor} rounded-lg aspect-video relative overflow-hidden ${isSpeakerCell ? "col-span-2 row-span-2" : ""}`;
  }, [bgColor, isActiveSpeaker, isSpeakerCell]);

  const setVideoResolution = useCallback(
    async (id: number, quality: string) => {
      const videoQuality = VideoQualityMap[quality];
      if (debug && updateVideoResolution) {
        await updateVideoResolution(id, videoQuality);
      }
      setSelectedQuality(quality);
    },
    [debug, updateVideoResolution],
  );

  const isUserSpotlighted = useMemo(
    () => spotlightUserList.some((user) => user.userId === participant?.userId),
    [participant, spotlightUserList],
  );

  const removeSpotlight = useCallback(async () => {
    await stream?.removeSpotlightedVideo(participant?.userId);
  }, [participant, stream]);

  const getNetworkQualityIcon = useCallback((level: number) => {
    if (level < 2) {
      return <SignalLow size={16} className="text-red-500" />;
    } else if (level < 3) {
      return <SignalMedium size={16} className="text-yellow-500" />;
    } else {
      return <Signal size={16} className="text-green-500" />;
    }
  }, []);

  const { menuItems } = useParticipantMenu(participant, currentUser);

  return (
    <div
      className={avatarWrapperClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div className="absolute top-2 w-full px-2 flex justify-between items-center w-10">
        {(isHost || isManager) && isUserSpotlighted && (
          <button
            className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full px-3 py-1 text-theme-text-button text-sm"
            onClick={removeSpotlight}
          >
            Remove spotlight
          </button>
        )}

        {isHovered && menuItems.length > 0 && (
          <Dropdown
            menuItems={menuItems}
            wrapperClass="bg-blue-500 bg-opacity-90 hover:bg-opacity-70 rounded-full p-1 ml-auto"
            trigger={<EllipsisVertical color="white" size={14} />}
            position="bottom-start"
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 text-theme-text-button px-2 py-1">
        <div className="flex items-center justify-between">
          {/* Quality switch bar */}
          {debug && isHovered && participant?.bVideoOn && !isSelf && (
            <div className="absolute bottom-10 left-0 right-0 bg-gray-900 bg-opacity-75 p-2 bg-black bg-opacity-50">
              <div className="flex justify-center space-x-2">
                {Object.keys(VideoQualityMap).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setVideoResolution(participant?.userId, quality)}
                    className={`px-2 py-1 text-xs rounded ${
                      selectedQuality === quality
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-1 px-2 py-1 rounded-lg bg-black bg-opacity-50 w-auto max-w-full">
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
            {participant?.userId && debug && <div className="text-red-500 text-md">{participant.userId}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
