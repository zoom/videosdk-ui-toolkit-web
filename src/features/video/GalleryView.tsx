import React, { useRef, useEffect, useMemo, DOMAttributes, DetailedHTMLProps, HTMLAttributes, useContext } from "react";
import { ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import Avatar from "./components/Avatar";
import { Participant, SuspensionViewType } from "@/types/index.d";
import {
  useAppDispatch,
  useAppSelector,
  useSessionSelector,
  useSessionUISelector,
  useWhiteboardSelector,
} from "@/hooks/useAppSelector";
import { setCurrentPage } from "@/store/uiSlice";
import { type VideoPlayer, type VideoPlayerContainer } from "@zoom/videosdk";
import { useActive, useRenderVideo, usePagination, useSpotlight } from "./hooks";
import { useCurrentUser } from "../participant/hooks";
import { isShowAvatar } from "@/components/util/util";
import { THEME_COLOR_CLASS } from "@/constant";
// import { useWhiteboard } from "../whiteboard/hooks/useWhiteboard";
type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["video-player"]: DetailedHTMLProps<HTMLAttributes<VideoPlayer>, VideoPlayer> & { className?: string };
      ["video-player-container"]: CustomElement<VideoPlayerContainer> & { className?: string };
    }
  }
}
interface GalleryViewPros {
  isSidePanelOpen: boolean;
  mainContentHeight: number;
}
const GalleryView = ({ isSidePanelOpen, mainContentHeight }: GalleryViewPros) => {
  const dispatch = useAppDispatch();
  const videoPlayerRefList = useRef<Record<string, VideoPlayer>>({});
  const { isSendingScreenShare, isReceivingScreenShare, avatarUrl, debug, activeSpeakerId } =
    useAppSelector(useSessionSelector);
  const { viewType } = useAppSelector(useSessionUISelector);
  const whiteboard = useAppSelector(useWhiteboardSelector);

  const isScreenSharing = useMemo(
    () => isSendingScreenShare || isReceivingScreenShare,
    [isReceivingScreenShare, isSendingScreenShare],
  );
  const isWhiteboardOpen = useMemo(
    () => whiteboard.isLoading || whiteboard.isWhiteboardOpen,
    [whiteboard.isLoading, whiteboard.isWhiteboardOpen],
  );

  const { currentPage, totalPages, currentParticipants, goToNextPage, goToPreviousPage } = usePagination();
  const currentUser = useCurrentUser();

  const currentPageVideos = useMemo(() => currentParticipants.filter((p) => p?.bVideoOn), [currentParticipants]);

  const defaultGridClassName = useMemo(() => {
    if (currentParticipants.length === 1) {
      return "grid gap-2 sm:gap-4 justify-center content-center auto-rows-min grid-cols-1";
    }
    if (viewType === "gallery") {
      if (currentParticipants.length <= 4) {
        return "grid gap-2 sm:gap-4 justify-center content-center auto-rows-min grid-cols-2";
      } else {
        return "grid gap-2 sm:gap-4 justify-center content-center auto-rows-min grid-cols-3";
      }
    }
    return "grid gap-2 sm:gap-4 justify-center content-center auto-rows-min grid-cols-3";
  }, [currentParticipants, viewType]);

  const shareGridClassName = "grid grid-cols-6 gap-4 justify-center content-center";

  const gridClassName = useMemo(
    () => (isScreenSharing || isWhiteboardOpen ? shareGridClassName : defaultGridClassName),
    [defaultGridClassName, isScreenSharing, isWhiteboardOpen],
  );
  const canvasWidth = (mainContentHeight / 9) * 16;

  const userIconSize = useMemo(() => {
    if (isScreenSharing || isWhiteboardOpen) {
      return 40;
    }
    if (currentParticipants.length === 1) {
      return 160;
    } else if (currentParticipants.length <= 4) {
      return 120;
    } else {
      return 80;
    }
  }, [currentParticipants, isScreenSharing, isWhiteboardOpen]);

  const hideNextPageButton = useMemo(() => {
    if (viewType === "speaker") {
      return currentParticipants.length === 1 || currentPage === totalPages - 1;
    } else {
      return currentPage === totalPages - 1 || totalPages === 0;
    }
  }, [currentPage, currentParticipants, totalPages, viewType]);

  useEffect(() => {
    dispatch(setCurrentPage(0));
  }, [dispatch, isScreenSharing, isWhiteboardOpen]);

  const updateVideoPlayerRefList = (userId: number, element: VideoPlayer | null) => {
    if (element) {
      videoPlayerRefList.current[`${userId}`] = element;
    }
  };

  const { updateVideoResolution } = useRenderVideo(currentPageVideos, videoPlayerRefList.current);
  useActive();
  useSpotlight();

  return (
    // Render gallery view
    <div
      className={`flex-grow flex items-center justify-between ${THEME_COLOR_CLASS} ${isSidePanelOpen ? "p-4" : "p-2"}`}
    >
      <div className="flex flex-col items-center" style={{ visibility: currentPage === 0 ? "hidden" : "visible" }}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className={`p-1 rounded-full shadow-md bg-theme-surface text-theme-text hover:bg-theme-background ${
            currentPage === 0 ? "cursor-not-allowed" : ""
          } transition duration-300 ease-in-out`}
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-xs text-theme-text mt-1">{`${currentPage + 1} / ${totalPages}`}</span>
      </div>
      <div className={`flex flex-col items-center ${isSidePanelOpen ? "w-4/5 max-w-4xl" : "w-full max-w-full"}`}>
        <div className="w-full overflow-hidden relative" style={{ maxWidth: `${canvasWidth - 50}px` }}>
          <video-player-container>
            <div className={gridClassName}>
              {currentParticipants.map((participant: Participant, idx: number) => {
                const isSpeakerCell = viewType === SuspensionViewType.Speaker && idx === 0;
                return (
                  <div
                    key={`${participant?.userId}`}
                    className={
                      participant?.bVideoOn
                        ? `bg-transparent rounded-lg aspect-video relative overflow-hidden ${isSpeakerCell ? "col-span-2 row-span-2" : ""}`
                        : `bg-neutral-400 rounded-lg aspect-video relative overflow-hidden flex justify-center items-center ${isSpeakerCell ? "col-span-2 row-span-2" : ""}`
                    }
                  >
                    {participant?.bVideoOn ? (
                      // Recommend to wrap the <video-player> with a <div> to prevent issues with removeChild()
                      <div>
                        <video-player
                          className="rounded-lg aspect-video relative overflow-hidden"
                          style={{ aspectRatio: "16/9" }}
                          ref={(elm) => updateVideoPlayerRefList(participant.userId, elm)}
                        />
                      </div>
                    ) : isShowAvatar(participant, currentUser, avatarUrl) ? (
                      <img
                        title={participant?.displayName}
                        alt={`${participant?.displayName}'s avatar`}
                        className="w-full h-full"
                        src={avatarUrl || participant?.avatar}
                      />
                    ) : (
                      <UserRound size={40} color="#ffffff" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className={`${gridClassName} absolute top-0 left-0 right-0`}>
              {currentParticipants.map((participant: Participant, idx: number) => (
                <Avatar
                  key={`${participant?.userId}-wrapper`}
                  participant={participant}
                  bgColor={"bg-transparent"}
                  isSpeakerCell={viewType === SuspensionViewType.Speaker && idx === 0}
                  isActiveSpeaker={participant?.userId === activeSpeakerId && currentParticipants.length > 1}
                  debug={debug}
                  updateVideoResolution={updateVideoResolution}
                />
              ))}
            </div>
          </video-player-container>
        </div>
      </div>

      <div
        className="flex flex-col items-center"
        style={{
          visibility: hideNextPageButton ? "hidden" : "visible",
        }}
      >
        <button
          onClick={goToNextPage}
          disabled={hideNextPageButton}
          className={`p-1 rounded-full shadow-md bg-theme-surface text-theme-text hover:bg-theme-background ${
            currentPage === totalPages - 1 ? "cursor-not-allowed" : ""
          } transition duration-300 ease-in-out`}
        >
          <ChevronRight size={24} />
        </button>
        <span className="text-xs text-theme-text mt-1">{`${currentPage + 1} / ${totalPages}`}</span>
      </div>
    </div>
  );
};

export default GalleryView;
