export const ActiveMediaFailedCode = {
  AudioConnectionFailed: "101" as const,
  AudioStreamEnded: "102" as const,
  MicrophonePermissionReset: "103" as const,
  AudioStreamFailed: "104" as const,
  MicrophoneMuted: "105" as const,
  AudioStreamMuted: "106" as const,
  AudioPlaybackInterrupted: "107" as const,
  VideoConnectionFailed: "201" as const,
  VideoStreamEnded: "202" as const,
  CameraPermissionReset: "203" as const,
  WebGLContextInvalid: "204" as const,
  WasmOutOfMemory: "205" as const,
  VideoStreamFailed: "206" as const,
  SharingStreamFailed: "301" as const,
} as const;

export type ActiveMediaFailedCodeType = (typeof ActiveMediaFailedCode)[keyof typeof ActiveMediaFailedCode];
