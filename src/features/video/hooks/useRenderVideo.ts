import { StreamContext } from "@/context/stream-context";
import { usePrevious } from "@/hooks";
import { useAppSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { Participant, type VideoPlayer } from "@zoom/videosdk";
import { useEffect, useContext, useCallback, useMemo } from "react";

export const useRenderVideo = (pageParticipants: Participant[], videoPlayerElements: Record<string, VideoPlayer>) => {
  const { stream } = useContext(StreamContext);
  const { viewType } = useAppSelector(useSessionUISelector);
  const videoParticipants = pageParticipants.map((p) => p.userId);
  const videoResolutions = useMemo(
    () =>
      pageParticipants.map((p, idx) => {
        return {
          id: p.userId,
          resolution: viewType === "speaker" && idx === 0 ? 3 : 2,
        };
      }),
    [pageParticipants, viewType],
  );

  const prevVideoParticipants = usePrevious(videoParticipants);
  const prevVideoResolutions = usePrevious(videoResolutions);

  useEffect(() => {
    const handleVideoParticipants = async () => {
      const addedVideoParticipants = videoParticipants.filter((id) => !(prevVideoParticipants || []).includes(id));
      const removedVideoParticipants = (prevVideoParticipants || []).filter((id) => !videoParticipants.includes(id));
      const unchangedVideoParticipants = videoParticipants.filter((id) => (prevVideoParticipants || []).includes(id));

      for (const id of removedVideoParticipants) {
        const videoElement = videoPlayerElements[`${id}`];
        if (videoElement && stream) {
          await stream.detachVideo(id);
        }
      }

      for (const id of unchangedVideoParticipants) {
        const videoElement = videoPlayerElements[`${id}`];
        if (videoElement && stream) {
          const currentParticipantVideoResolution = videoResolutions.find((item) => item.id === id).resolution;
          const prevParticipantVideoResolution = prevVideoResolutions.find((item) => item.id === id).resolution;
          if (currentParticipantVideoResolution !== prevParticipantVideoResolution) {
            await stream?.attachVideo(id, currentParticipantVideoResolution, videoElement);
          }
        }
      }

      for (const id of addedVideoParticipants) {
        const videoElement = videoPlayerElements[`${id}`];
        if (videoElement && stream) {
          const participantVideoResolution = videoResolutions.find((item) => item.id === id).resolution;
          await stream?.attachVideo(id, participantVideoResolution, videoElement);
        }
      }
    };

    handleVideoParticipants();
  }, [videoParticipants, prevVideoParticipants, videoPlayerElements, stream, videoResolutions, prevVideoResolutions]);

  const updateVideoResolution = useCallback(
    async (id: number, quality: number) => {
      const videoElement = videoPlayerElements[`${id}`];
      if (videoElement && stream) {
        await stream.attachVideo(id, quality, videoElement);
      }
    },
    [stream, videoPlayerElements],
  );

  return {
    updateVideoResolution,
  };
};
