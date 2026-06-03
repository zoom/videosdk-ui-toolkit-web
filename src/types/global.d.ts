import type { DOMAttributes, DetailedHTMLProps, HTMLAttributes, ReactNode, Ref } from "react";
import type { VideoPlayer, VideoPlayerContainer } from "@zoom/videosdk";
import type { LiveVideo, LiveVideoContainer } from "@zoom/videosdk/broadcast-streaming";

type CustomElement<T> = Partial<Omit<T, "children"> & DOMAttributes<T> & { children?: ReactNode; ref?: Ref<T> }>;

declare global {
  interface Window {
    JsMediaSDK_Instance: any;
  }

  namespace JSX {
    interface IntrinsicElements {
      ["video-player"]: DetailedHTMLProps<HTMLAttributes<VideoPlayer>, VideoPlayer> & { className?: string };
      ["video-player-container"]: CustomElement<VideoPlayerContainer> & { className?: string };
      ["live-video"]: DetailedHTMLProps<HTMLAttributes<LiveVideo>, LiveVideo> & { class?: string };
      ["live-video-container"]: CustomElement<LiveVideoContainer> & { class?: string; webEndpoint?: string };
    }
  }
}

export {};
