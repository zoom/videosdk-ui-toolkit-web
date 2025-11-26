import React, { useRef, useEffect, useMemo, DOMAttributes, DetailedHTMLProps, HTMLAttributes } from "react";
import { Participant } from "@/types";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { setCurrentPage } from "@/store/uiSlice";
import { type VideoPlayer, type VideoPlayerContainer } from "@zoom/videosdk";
import { useActive, useRenderVideo, useSpotlight } from "./hooks";
import { SessionState } from "@/store/sessionSlice";
import { isPortrait } from "@/components/util/service";
import AvatarMobile from "./components/AvatarMobile";
import { isShowAvatar } from "@/components/util/util";
type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["video-player"]: DetailedHTMLProps<HTMLAttributes<VideoPlayer>, VideoPlayer> & { className?: string };
      ["video-player-container"]: CustomElement<VideoPlayerContainer> & { className?: string };
    }
  }
}

interface GalleryViewMobileProps {
  mainContentWidth: number;
  mainContentHeight: number;
  currentPage: number;
  totalPages: number;
  currentParticipants: Participant[];
  currentUser: Participant;
  avatarUrl: string;
}

export const GalleryViewMobile = ({
  mainContentWidth,
  mainContentHeight,
  currentPage,
  totalPages,
  currentParticipants,
  currentUser,
  avatarUrl,
}: GalleryViewMobileProps) => {
  const dispatch = useAppDispatch();
  const videoPlayerRefList = useRef<Record<string, VideoPlayer>>({});
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { debug }: SessionState = useAppSelector(useSessionSelector);
  const { isReceivingScreenShare, isSendingScreenShare } = useAppSelector(useSessionSelector);

  const currentPageVideos = useMemo(() => currentParticipants.filter((p) => p?.bVideoOn), [currentParticipants]);

  const defaultGridClassName = useMemo(() => {
    if (currentParticipants?.length <= 1) {
      return `grid grid-cols-1 gap-2 p-2 w-full h-full justify-center content-center overflow-hidden`;
    } else {
      return `grid grid-cols-2 gap-2 p-2 w-full h-full justify-center content-center overflow-hidden`;
    }
  }, [currentParticipants]);

  useEffect(() => {
    if (isReceivingScreenShare || isSendingScreenShare) {
      dispatch(setCurrentPage(-1));
    } else {
      dispatch(setCurrentPage(0));
    }
  }, [dispatch, isReceivingScreenShare, isSendingScreenShare]);

  const updateVideoPlayerRefList = (userId: number, element: VideoPlayer | null) => {
    if (element) {
      videoPlayerRefList.current[`${userId}`] = element;
    }
  };

  const { updateVideoResolution } = useRenderVideo(currentPageVideos, videoPlayerRefList.current);
  const activeUserId = useActive();
  useSpotlight();

  useEffect(() => {
    if (videoContainerRef.current) {
      if (!isPortrait()) {
        const containerWidth = Math.min((mainContentHeight / 9) * 16 - 8 * 2, window.innerWidth - 8 * 2);
        videoContainerRef.current.style.width = `${containerWidth}px`;
        videoContainerRef.current.style.height = `${mainContentHeight}px`;
      } else {
        const containerHeight = mainContentHeight * 0.8;
        const containerWidth = Math.min((containerHeight / 4) * 3 - 8 * 2, window.innerWidth - 8 * 2);
        videoContainerRef.current.style.width = `${containerWidth}px`;
        videoContainerRef.current.style.height = `${containerHeight}px`;
      }
    }
  }, [mainContentHeight, mainContentWidth]);

  const aspectStyle = isPortrait() ? "aspect-[3/4]" : "aspect-video";

  return (
    <div
      className="flex flex-col justify-center items-center w-full h-full"
      style={{ visibility: currentPage === -1 ? "hidden" : "visible", height: currentPage === -1 ? "0" : "100%" }}
    >
      <video-player-container>
        <div className="relative w-full h-full" ref={videoContainerRef}>
          <div className={defaultGridClassName}>
            {currentParticipants.map((participant: Participant, index: number) => {
              return (
                <div
                  key={participant?.userId || 0}
                  className={`${participant?.bVideoOn ? "bg-transparent" : "bg-neutral-400"} ${aspectStyle} relative overflow-hidden flex justify-center items-center rounded-lg`}
                >
                  {participant?.bVideoOn ? (
                    // Recommend to wrap the <video-player> with a <div> to prevent issues with removeChild()
                    <div className={`w-full`}>
                      <div>
                        <video-player
                          className={`rounded-lg ${aspectStyle} relative overflow-hidden`}
                          style={{ aspectRatio: isPortrait() ? "3/4" : "16/9" }}
                          ref={(elm) => updateVideoPlayerRefList(participant.userId, elm)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-[80%] h-[80%] flex justify-center items-center">
                      {isShowAvatar(participant, currentUser, avatarUrl) ? (
                        <img
                          title={participant.displayName}
                          className="w-full h-full"
                          src={avatarUrl || participant?.avatar}
                        />
                      ) : (
                        <span className="font-semibold text-xl text-theme-text-button line-clamp-3">
                          {participant?.displayName}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className={`${defaultGridClassName} absolute top-0 left-0`}>
            {currentParticipants?.length === 0 && (
              <div className="flex justify-center items-center text-2xl font-semibold m-2 text-theme-text">
                <span>No other participants</span>
              </div>
            )}
            {currentParticipants.map((participant: Participant, index: number) => (
              <AvatarMobile
                key={participant?.userId || 0}
                participant={participant}
                bgColor={"bg-transparent"}
                isShowName={participant?.bVideoOn}
                isActiveSpeaker={participant?.userId === activeUserId && currentParticipants.length > 1}
                aspectStyle={aspectStyle}
                debug={debug}
                updateVideoResolution={updateVideoResolution}
              />
            ))}
          </div>
        </div>
      </video-player-container>
    </div>
  );
};

export default GalleryViewMobile;
