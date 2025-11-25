export const defaultSessionConfig: any = {
  virtualBackground: {
    allowVirtualBackground: true,
    allowVirtualBackgroundUpload: true,
    virtualBackgrounds: [],
  },
  options: {
    init: {
      enforceMultipleVideos: false,
      enforceVirtualBackground: false,
      webEndpoint: "zoom.us",
    },
    audio: {
      backgroundNoiseSuppression: true,
      originalSound: false,
      syncButtonsOnHeadset: false,
    },
    video: {
      originalRatio: true,
      virtualBackground: null,
    },
    share: {
      controls: null,
      displaySurface: null,
      hideShareAudioOption: false,
      optimizedForSharedVideo: false,
    },
  },
};

export default defaultSessionConfig;
