// initialQOS.ts

import { AudioQosData, VideoQosData } from "@zoom/videosdk";

export const MB_TO_B = 1000 * 1000;
export const KB_TO_B = 1000;

export const initAudioQosData: { encode: AudioQosData; decode: AudioQosData } = {
  encode: {
    sample_rate: 0,
    rtt: 0,
    jitter: 0,
    avg_loss: 0,
    max_loss: 0,
    bandwidth: 0,
    bitrate: 0,
  },
  decode: {
    sample_rate: 0,
    rtt: 0,
    jitter: 0,
    avg_loss: 0,
    max_loss: 0,
    bandwidth: 0,
    bitrate: 0,
  },
};

export const initVideoQosData: { encode: VideoQosData; decode: VideoQosData } = {
  encode: {
    sample_rate: 0,
    rtt: 0,
    jitter: 0,
    avg_loss: 0,
    max_loss: 0,
    width: 0,
    height: 0,
    fps: 0,
    bandwidth: 0,
    bitrate: 0,
  },
  decode: {
    sample_rate: 0,
    rtt: 0,
    jitter: 0,
    avg_loss: 0,
    max_loss: 0,
    width: 0,
    height: 0,
    fps: 0,
    bandwidth: 0,
    bitrate: 0,
  },
};

export const initSharingQosData: { encode: VideoQosData; decode: VideoQosData } = {
  encode: {
    sample_rate: 0,
    rtt: 0,
    jitter: 0,
    avg_loss: 0,
    max_loss: 0,
    width: 0,
    height: 0,
    fps: 0,
    bandwidth: 0,
    bitrate: 0,
  },
  decode: {
    sample_rate: 0,
    rtt: 0,
    jitter: 0,
    avg_loss: 0,
    max_loss: 0,
    width: 0,
    height: 0,
    fps: 0,
    bandwidth: 0,
    bitrate: 0,
  },
};
