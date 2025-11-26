import React from "react";
import { MediaStream } from "../types";
interface MediaContext {
  audio: {
    encode: boolean;
    decode: boolean;
  };
  video: {
    encode: boolean;
    decode: boolean;
  };
  share: {
    encode: boolean;
    decode: boolean;
  };
  stream: MediaStream | undefined | null;
}
export const StreamContext = React.createContext<MediaContext>({
  audio: { encode: false, decode: false },
  video: { encode: false, decode: false },
  share: { encode: false, decode: false },
  stream: null,
});
