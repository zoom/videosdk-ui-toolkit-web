export type ProcessorType = "share" | "audio" | "video";

export interface ProcessorConfig {
  url: string;
  type: ProcessorType;
  name: string;
  options: any;
  title: string;
}

export interface ProcessorState {
  share: ProcessorConfig[];
  audio: ProcessorConfig[];
  video: ProcessorConfig[];
}

export interface ActiveProcessor {
  name: string;
  type: ProcessorType;
  instance: any;
}
