export type AccountConfig = {
  sdkKey: string;
  sdkSecret: string;
  webEndpoint: string;
  account: string;
  env: string;
};

export type FormData = {
  sdkKey: string;
  sdkSecret?: string;
  displayName: string;
  topic: string;
  password: string;
  channelId: string;
  version: any;
  role: any;
  language?: any;
  web: any;
  debug?: any;
  uiKit?: any;
  useVideoPlayer: any;
  cloudRecordingOption: any;
  cloudRecordingElection: any;
  customerKey: string;
  sessionKey: string;
  zlkJwtToken?: string;
  rc?: { value: string; label: string };
  autoTranscription?: string;
  enforceWebRtcAudio?: any;
  enforceWebRtcVideo?: any;
  geoRegions?: string[];
  telemetryId?: string;
  mediaVersion?: string;
  account: any;
  preview?: any;
  cdn?: any;
  corp?: any;
  enforceGalleryView?: any;
  enforceVirtualBackground?: any;
  signatureToken?: string;
  customizeLayout?: any;
  header?: any;
  footer?: any;
  iframeSize?: any;
  enforcePEPC: { value: string; label: string };
  selectedEvents: { value: string; label: string }[];
};

export type InputConfig = {
  name: string;
  placeholder: string;
  icon: React.ReactNode;
  readOnly?: boolean;
};
