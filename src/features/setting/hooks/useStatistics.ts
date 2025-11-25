import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { StreamContext } from "../../../context/stream-context";
import { ClientContext } from "../../../context/client-context";

import { AudioQosData, VideoQosData, ShareQosData } from "../qosData-types";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";

export enum QosDataType {
  AudioData = "AUDIO_QOS_DATA",
  VideoData = "VIDEO_QOS_DATA",
  ShareData = "VIDEOSHARE_QOS_DATA",
}

const AudioQosDataShape: AudioQosData = {
  avg_loss: 0,
  encoding: false,
  jitter: 0,
  max_loss: 0,
  rtt: 0,
  sample_rate: 0,
};

const VideoQosDataShape: VideoQosData = {
  avg_loss: 0,
  encoding: false,
  fps: 0,
  height: 0,
  jitter: 0,
  max_loss: 0,
  rtt: 0,
  width: 0,
};

const ShareQoSDataShape: ShareQosData = {
  avg_loss: 0,
  encoding: false,
  jitter: 0,
  max_loss: 0,
  rtt: 0,
  sample_rate: 0,
  width: 0,
  height: 0,
  fps: 0,
};

export function useStatistics() {
  const [audioStatisticsEncodeData, setAudioStatisticsEncodeData] = useState<AudioQosData>(AudioQosDataShape);
  const [audioStatisticsDecodeData, setAudioStatisticsDecodeData] = useState<AudioQosData>(AudioQosDataShape);
  const [videoStatisticsEncodeData, setVideoStatisticsEncodeData] = useState<VideoQosData>(VideoQosDataShape);
  const [videoStatisticsDecodeData, setVideoStatisticsDecodeData] = useState<VideoQosData>(VideoQosDataShape);
  const [shareStatisticsEncodeData, setShareStatisticsEncodeData] = useState<ShareQosData>(ShareQoSDataShape);
  const [shareStatisticsDecodeData, setShareStatisticsDecodeData] = useState<ShareQosData>(ShareQoSDataShape);

  const client = useContext(ClientContext);

  const { stream } = useContext(StreamContext);
  const { isMuted, isStartedVideo, isSendingScreenShare, isReceivingScreenShare, userSubscribeQos } =
    useAppSelector(useSessionSelector);

  const audioDecodeTimerRef = useRef(0);
  const videoDecodeTimerRef = useRef(0);
  const shareDecodeTimerRef = useRef(0);

  const clearAudioTimer = () => {
    if (audioDecodeTimerRef.current) {
      clearTimeout(audioDecodeTimerRef.current);
      audioDecodeTimerRef.current = 0;
    }
  };

  const clearVideoTimer = () => {
    if (videoDecodeTimerRef.current) {
      clearTimeout(videoDecodeTimerRef.current);
      videoDecodeTimerRef.current = 0;
    }
  };

  const clearShareTimer = () => {
    if (shareDecodeTimerRef.current) {
      clearTimeout(shareDecodeTimerRef.current);
      shareDecodeTimerRef.current = 0;
    }
  };

  const onAudioStatisticDataChange = useCallback((payload: any) => {
    if (payload?.type === QosDataType.AudioData) {
      if (payload.data && payload.data.encoding === true) {
        setAudioStatisticsEncodeData(payload.data);
      }
      if (payload.data && payload.data.encoding === false) {
        setAudioStatisticsDecodeData(payload.data);
        clearAudioTimer();
        // Reset audio decode data if no data come in over 2 seconds
        audioDecodeTimerRef.current = window.setTimeout(() => {
          setAudioStatisticsDecodeData(AudioQosDataShape);
        }, 2000);
      }
    }
  }, []);

  const onVideoStatisticDataChange = useCallback((payload: any) => {
    if (payload?.type === QosDataType.VideoData) {
      if (payload.data && payload.data.encoding === true) {
        setVideoStatisticsEncodeData(payload.data);
      }
      if (payload.data && payload.data.encoding === false) {
        setVideoStatisticsDecodeData(payload.data);
        clearVideoTimer();
        // Reset video decode data if no data come in over 2 seconds
        videoDecodeTimerRef.current = window.setTimeout(() => {
          setVideoStatisticsDecodeData(VideoQosDataShape);
        }, 2000);
      }
    }
  }, []);

  const onShareStatisticDataChange = useCallback((payload: any) => {
    if (payload?.type === QosDataType.ShareData) {
      if (payload.data && payload.data.encoding === true) {
        setShareStatisticsEncodeData(payload.data);
      }
      if (payload.data && payload.data.encoding === false) {
        setShareStatisticsDecodeData(payload.data);
        clearShareTimer();
        // Reset share decode data if no data come in over 2 seconds
        shareDecodeTimerRef.current = window.setTimeout(() => {
          setShareStatisticsDecodeData(ShareQoSDataShape);
        }, 2000);
      }
    }
  }, []);

  useEffect(() => {
    async function subscribeQosData() {
      if (stream) {
        await stream.subscribeAudioStatisticData();
        await stream.subscribeVideoStatisticData();
        await stream.subscribeShareStatisticData();
      }
    }
    subscribeQosData();
    return () => {
      async function unsubscribeQosData() {
        if (stream) {
          if (!userSubscribeQos.audio) {
            await stream.unsubscribeAudioStatisticData();
          }
          if (!userSubscribeQos.video) {
            await stream.unsubscribeVideoStatisticData();
          }
          if (!userSubscribeQos.share) {
            await stream.unsubscribeShareStatisticData();
          }
        }
      }
      unsubscribeQosData();
      clearAudioTimer();
      clearVideoTimer();
      clearShareTimer();
    };
  }, [stream, userSubscribeQos]);

  useEffect(() => {
    client.on("audio-statistic-data-change", onAudioStatisticDataChange);
    client.on("video-statistic-data-change", onVideoStatisticDataChange);
    client.on("share-statistic-data-change", onShareStatisticDataChange);
    return () => {
      client.off("audio-statistic-data-change", onAudioStatisticDataChange);
      client.off("video-statistic-data-change", onVideoStatisticDataChange);
      client.off("share-statistic-data-change", onShareStatisticDataChange);
    };
  }, [client, onAudioStatisticDataChange, onVideoStatisticDataChange, onShareStatisticDataChange]);

  // Reset the statistic data if not sending
  useEffect(() => {
    if (isMuted === true) {
      setAudioStatisticsEncodeData(AudioQosDataShape);
    }
    if (isStartedVideo === false) {
      setVideoStatisticsEncodeData(VideoQosDataShape);
    }
    if (isSendingScreenShare === false) {
      setShareStatisticsEncodeData(ShareQoSDataShape);
    }
  }, [isMuted, isStartedVideo, isSendingScreenShare]);

  return {
    audioStatisticsEncodeData,
    audioStatisticsDecodeData,
    videoStatisticsEncodeData,
    videoStatisticsDecodeData,
    shareStatisticsEncodeData,
    shareStatisticsDecodeData,
  };
}
