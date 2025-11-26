export interface AudioQosData {
  avg_loss: number;
  encoding: boolean;
  jitter: number;
  max_loss: number;
  rtt: number;
  sample_rate: number;
}

export interface VideoQosData {
  avg_loss: number;
  encoding: boolean;
  fps: number;
  height: number;
  jitter: number;
  max_loss: number;
  rtt: number;
  width: number;
}

export interface ShareQosData {
  avg_loss: number;
  encoding: boolean;
  jitter: number;
  max_loss: number;
  rtt: number;
  sample_rate?: number;
  width: number;
  height: number;
  fps: number;
}
