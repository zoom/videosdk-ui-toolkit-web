import { CustomizationOptions } from "../types";

/**
 * Converts deprecated configuration options to the new featuresOptions format
 * @param config Old configuration object containing deprecated fields
 * @returns Updated configuration with deprecated fields migrated to featuresOptions
 */
export function migrateToNewConfig(config: Partial<CustomizationOptions>, warn = true): Partial<CustomizationOptions> {
  const newConfig = { ...config };

  // Initialize featuresOptions if it doesn't exist
  if (!newConfig.featuresOptions) {
    newConfig.featuresOptions = {};
  }

  // Migrate old features array to featuresOptions
  if (config?.features) {
    if (warn) {
      // eslint-disable-next-line no-console
      console.warn("deprecated features, please use featuresOptions instead");
    }

    config.features.forEach((feature) => {
      switch (feature) {
        case "video":
          newConfig.featuresOptions.video = { enable: true };
          break;
        case "audio":
          newConfig.featuresOptions.audio = { enable: true };
          break;
        case "share":
          newConfig.featuresOptions.share = { enable: true };
          break;
        case "chat":
          newConfig.featuresOptions.chat = { enable: true, enableEmoji: true };
          break;
        case "users":
          newConfig.featuresOptions.users = { enable: true };
          break;
        case "settings":
          newConfig.featuresOptions.settings = { enable: true };
          break;
        case "preview":
          newConfig.featuresOptions.preview = { enable: true };
          break;
        case "livestream":
          newConfig.featuresOptions.livestream = { enable: true };
          break;
        case "pstn":
          newConfig.featuresOptions.phone = { enable: true };
          break;
        case "crc":
          newConfig.featuresOptions.crc = { enable: true };
          break;
        case "ltt":
          newConfig.featuresOptions.caption = { enable: true };
          break;
        case "recording":
          newConfig.featuresOptions.recording = { enable: true };
          break;
        case "feedback":
          newConfig.featuresOptions.feedback = { enable: true };
          break;
        default:
          break;
      }
    });
  }

  // Migrate old options object
  if (config.options) {
    if (warn) {
      // eslint-disable-next-line no-console
      console.warn("deprecated options, please use featuresOptions instead");
    }

    // Init options
    if (config.options?.init) {
      if (newConfig.featuresOptions.video && config.options?.init?.enforceMultipleVideos !== undefined) {
        newConfig.featuresOptions.video.enforceMultipleVideos = config.options.init.enforceMultipleVideos;
      }

      if (config.options?.init?.webEndpoint) {
        newConfig.webEndpoint = config.options.init.webEndpoint;
      }

      if (config.options?.init?.enforceVirtualBackground !== undefined) {
        if (!newConfig.featuresOptions.virtualBackground) {
          newConfig.featuresOptions.virtualBackground = { enable: true };
        }
        newConfig.featuresOptions.virtualBackground.enforceVirtualBackground =
          config.options.init.enforceVirtualBackground;
      }
    }

    // Audio options
    if (config.options?.audio) {
      if (!newConfig.featuresOptions.audio) {
        newConfig.featuresOptions.audio = { enable: true };
      }

      const audioOptions = config.options?.audio;
      newConfig.featuresOptions.audio = {
        ...newConfig.featuresOptions.audio,
        backgroundNoiseSuppression: audioOptions?.backgroundNoiseSuppression,
        originalSound: audioOptions?.originalSound,
        syncButtonsOnHeadset: audioOptions?.syncButtonsOnHeadset,
      };
    }

    // Video options
    if (config.options?.video) {
      if (!newConfig.featuresOptions.video) {
        newConfig.featuresOptions.video = { enable: true };
      }

      const videoOptions = config.options?.video;
      newConfig.featuresOptions.video = {
        ...newConfig.featuresOptions.video,
        originalRatio: videoOptions?.originalRatio,
      };
    }

    // Share options
    if (config.options?.share) {
      if (!newConfig.featuresOptions.share) {
        newConfig.featuresOptions.share = { enable: true };
      }

      const shareOptions = config.options?.share;
      newConfig.featuresOptions.share = {
        ...newConfig.featuresOptions.share,
        controls: shareOptions?.controls,
        displaySurface: shareOptions?.displaySurface,
        hideShareAudioOption: shareOptions?.hideShareAudioOption,
        optimizedForSharedVideo: shareOptions?.optimizedForSharedVideo,
      };
    }
  }

  // Migrate virtualBackground options
  if (config?.virtualBackground) {
    if (warn) {
      // eslint-disable-next-line no-console
      console.warn("deprecated virtualBackground, please use featuresOptions.virtualBackground instead");
    }

    if (!newConfig.featuresOptions.virtualBackground) {
      newConfig.featuresOptions.virtualBackground = { enable: true };
    }

    const oldVBConfig = config?.virtualBackground;
    const backgrounds = oldVBConfig?.virtualBackgrounds
      ? oldVBConfig?.virtualBackgrounds?.map((url) => ({
          url,
          displayName: url.split("/").pop() || url,
        }))
      : [];

    newConfig.featuresOptions.virtualBackground = {
      ...newConfig.featuresOptions.virtualBackground,
      allowVirtualBackgroundUpload: oldVBConfig?.allowVirtualBackgroundUpload,
      virtualBackgrounds: backgrounds,
    };
  }

  // Remove deprecated fields
  delete newConfig.features;
  delete newConfig.options;
  delete newConfig.virtualBackground;

  return newConfig;
}

/**
 * Type guard to check if config uses deprecated fields
 */
export function hasDeprecatedFields(config: Partial<CustomizationOptions>): boolean {
  return !!(config.features || config.options || config.virtualBackground);
}

/**
 * Helper function to safely migrate config if it contains deprecated fields
 */
export function migrateConfig(config: Partial<CustomizationOptions>, warn = true): Partial<CustomizationOptions> {
  if (hasDeprecatedFields(config)) {
    if (config?.debug) {
      // eslint-disable-next-line no-console
      console.log("deprecated config, old config");
    }
    const newConfig = migrateToNewConfig(config, warn);
    if (config.debug) {
      // eslint-disable-next-line no-console
      console.log("update new config");
    }
    return newConfig;
  }
  return config;
}

// Deep merge function for nested objects
export const deepMerge = (target: any, source: any): any => {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};
