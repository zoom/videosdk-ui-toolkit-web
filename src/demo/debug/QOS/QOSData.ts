import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import UIToolkit from "../../../uikit/index.tsx";
import { AudioQosData, VideoQosData } from "@zoom/videosdk";
import { initAudioQosData, initVideoQosData, initSharingQosData } from "./initialQOS.ts";

export enum QosDataType {
  AudioData = "AUDIO_QOS_DATA",
  VideoData = "VIDEO_QOS_DATA",
  ShareData = "VIDEOSHARE_QOS_DATA",
}

const MAX_HISTORY_VIDEO_POINTS = 380;
const MAX_HISTORY_AUDIO_POINTS = 600;
const MAX_HISTORY_SHARE_POINTS = 600;

interface QoSMetric {
  timestamp: number;
  height: number;
  fullResolution: string;
  fps: number;
  sampleRate: number;
  rtt: number;
  jitter: number;
  loss: number;
  bandwidth: number;
  bitrate: number;
}

export function useQOSData() {
  const [audioEncodeHistory, setAudioEncodeHistory] = useState<QoSMetric[]>([]);
  const [audioDecodeHistory, setAudioDecodeHistory] = useState<QoSMetric[]>([]);
  const [sharingEncodeHistory, setSharingEncodeHistory] = useState<QoSMetric[]>([]);
  const [sharingDecodeHistory, setSharingDecodeHistory] = useState<QoSMetric[]>([]);
  const [encodeHistory, setEncodeHistory] = useState<QoSMetric[]>([]);
  const [decodeHistory, setDecodeHistory] = useState<QoSMetric[]>([]);

  const [audioStatisticsEncodeData, setAudioStatisticsEncodeData] = useState<AudioQosData>(initAudioQosData.encode);
  const [audioStatisticsDecodeData, setAudioStatisticsDecodeData] = useState<AudioQosData>(initAudioQosData.decode);
  const [videoStatisticsEncodeData, setVideoStatisticsEncodeData] = useState<VideoQosData>(initVideoQosData.encode);
  const [videoStatisticsDecodeData, setVideoStatisticsDecodeData] = useState<VideoQosData>(initVideoQosData.decode);
  const [shareStatisticsEncodeData, setShareStatisticsEncodeData] = useState<VideoQosData>(initSharingQosData.encode);
  const [shareStatisticsDecodeData, setShareStatisticsDecodeData] = useState<VideoQosData>(initSharingQosData.decode);

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
        const timestamp = Date.now();
        setAudioEncodeHistory((prev) => {
          const newPoint: QoSMetric = {
            timestamp,
            height: 0,
            fullResolution: "",
            fps: 0,
            sampleRate: payload.data.sample_rate,
            rtt: payload.data.rtt,
            jitter: payload.data.jitter,
            loss: payload.data.avg_loss,
            bandwidth: payload.data.bandwidth,
            bitrate: payload.data.bitrate,
          };
          return [...prev, newPoint].slice(-MAX_HISTORY_AUDIO_POINTS);
        });
      }
      if (payload.data && payload.data.encoding === false) {
        setAudioStatisticsDecodeData(payload.data);
        const timestamp = Date.now();
        setAudioDecodeHistory((prev) => {
          const newPoint: QoSMetric = {
            timestamp,
            height: 0,
            fullResolution: "",
            fps: 0,
            sampleRate: payload.data.sample_rate,
            rtt: payload.data.rtt,
            jitter: payload.data.jitter,
            loss: payload.data.avg_loss,
            bandwidth: payload.data.bandwidth,
            bitrate: payload.data.bitrate,
          };
          return [...prev, newPoint].slice(-MAX_HISTORY_AUDIO_POINTS);
        });
        clearAudioTimer();
        // Reset audio decode data if no data come in over 2 seconds
        audioDecodeTimerRef.current = window.setTimeout(() => {
          setAudioStatisticsDecodeData(initAudioQosData.decode);
        }, 2000);
      }
    }
  }, []);

  const onVideoStatisticDataChange = useCallback((payload: any) => {
    if (payload?.type === QosDataType.VideoData) {
      if (payload.data && payload.data.encoding === true) {
        setVideoStatisticsEncodeData(payload.data);
        const timestamp = Date.now();
        setEncodeHistory((prev) => {
          const newPoint: QoSMetric = {
            timestamp,
            height: payload.data.height,
            fullResolution: `${payload.data.width}x${payload.data.height}`,
            fps: payload.data.fps,
            sampleRate: payload.data.sample_rate,
            rtt: payload.data.rtt,
            jitter: payload.data.jitter,
            loss: payload.data.avg_loss,
            bandwidth: payload.data.bandwidth,
            bitrate: payload.data.bitrate,
          };
          return [...prev, newPoint].slice(-MAX_HISTORY_VIDEO_POINTS);
        });
      }
      if (payload.data && payload.data.encoding === false) {
        setVideoStatisticsDecodeData(payload.data);
        const timestamp = Date.now();
        setDecodeHistory((prev) => {
          const newPoint: QoSMetric = {
            timestamp,
            height: payload.data.height,
            fullResolution: `${payload.data.width}x${payload.data.height}`,
            fps: payload.data.fps,
            sampleRate: payload.data.sample_rate,
            rtt: payload.data.rtt,
            jitter: payload.data.jitter,
            loss: payload.data.avg_loss,
            bandwidth: payload.data.bandwidth,
            bitrate: payload.data.bitrate,
          };
          return [...prev, newPoint].slice(-MAX_HISTORY_VIDEO_POINTS);
        });
        clearVideoTimer();
        // Reset video decode data if no data come in over 2 seconds
        videoDecodeTimerRef.current = window.setTimeout(() => {
          setVideoStatisticsDecodeData(initVideoQosData.decode);
        }, 2000);
      }
    }
  }, []);

  const onShareStatisticDataChange = useCallback((payload: any) => {
    if (payload?.type === QosDataType.ShareData) {
      if (payload.data && payload.data.encoding === true) {
        setShareStatisticsEncodeData(payload.data);
        const timestamp = Date.now();
        setSharingEncodeHistory((prev) => {
          const newPoint: QoSMetric = {
            timestamp,
            height: payload.data.height,
            fullResolution: `${payload.data.width}x${payload.data.height}`,
            fps: payload.data.fps,
            sampleRate: payload.data.sample_rate,
            rtt: payload.data.rtt,
            jitter: payload.data.jitter,
            loss: payload.data.avg_loss,
            bandwidth: payload.data.bandwidth,
            bitrate: payload.data.bitrate,
          };
          return [...prev, newPoint].slice(-MAX_HISTORY_SHARE_POINTS);
        });
      }
      if (payload.data && payload.data.encoding === false) {
        setShareStatisticsDecodeData(payload.data);
        const timestamp = Date.now();
        setSharingDecodeHistory((prev) => {
          const newPoint: QoSMetric = {
            timestamp,
            height: payload.data.height,
            fullResolution: `${payload.data.width}x${payload.data.height}`,
            fps: payload.data.fps,
            sampleRate: payload.data.sample_rate,
            rtt: payload.data.rtt,
            jitter: payload.data.jitter,
            loss: payload.data.avg_loss,
            bandwidth: payload.data.bandwidth,
            bitrate: payload.data.bitrate,
          };
          return [...prev, newPoint].slice(-MAX_HISTORY_SHARE_POINTS);
        });
        clearShareTimer();
        // Reset share decode data if no data come in over 2 seconds
        shareDecodeTimerRef.current = window.setTimeout(() => {
          setShareStatisticsDecodeData(initSharingQosData.decode);
        }, 2000);
      }
    }
  }, []);

  useEffect(() => {
    async function subscribeQosData() {
      try {
        UIToolkit.subscribeVideoStatisticData({ decode: true, encode: true, detailed: true });
        UIToolkit.subscribeAudioStatisticData({ decode: true, encode: true });
        UIToolkit.subscribeShareStatisticData({ decode: true, encode: true });
      } catch (error) {
        console.log("error in subscribe");

        console.log(error);
      }
    }
    subscribeQosData();
    return () => {
      async function unsubscribeQosData() {
        UIToolkit.unsubscribeVideoStatisticData({ decode: true, encode: true, detailed: true });
        UIToolkit.unsubscribeAudioStatisticData({ decode: true, encode: true });
        UIToolkit.unsubscribeShareStatisticData({ decode: true, encode: true });
      }
      unsubscribeQosData();
      clearAudioTimer();
      clearVideoTimer();
      clearShareTimer();
    };
  }, [userSubscribeQos]);

  useEffect(() => {
    UIToolkit.on("audio-statistic-data-change", onAudioStatisticDataChange);
    UIToolkit.on("video-statistic-data-change", onVideoStatisticDataChange);
    UIToolkit.on("share-statistic-data-change", onShareStatisticDataChange);
    return () => {
      UIToolkit.off("audio-statistic-data-change", onAudioStatisticDataChange);
      UIToolkit.off("video-statistic-data-change", onVideoStatisticDataChange);
      UIToolkit.off("share-statistic-data-change", onShareStatisticDataChange);
    };
  }, [onAudioStatisticDataChange, onVideoStatisticDataChange, onShareStatisticDataChange]);

  // Reset the statistic data if not sending
  useEffect(() => {
    if (isMuted === true) {
      setAudioStatisticsEncodeData(initAudioQosData.encode);
    }
    if (isStartedVideo === false) {
      setVideoStatisticsEncodeData(initVideoQosData.encode);
    }
    if (isSendingScreenShare === false) {
      setShareStatisticsEncodeData(initSharingQosData.encode);
    }
  }, [isMuted, isStartedVideo, isSendingScreenShare]);

  return {
    audioStatisticsEncodeData,
    audioStatisticsDecodeData,
    videoStatisticsEncodeData,
    videoStatisticsDecodeData,
    shareStatisticsEncodeData,
    shareStatisticsDecodeData,
    audioEncodeHistory,
    audioDecodeHistory,
    sharingEncodeHistory,
    sharingDecodeHistory,
    encodeHistory,
    decodeHistory,
  };
}
