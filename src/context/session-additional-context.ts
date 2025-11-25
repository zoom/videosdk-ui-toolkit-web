import React from "react";
import {
  ChatClient,
  RecordingClient,
  CaptionClient,
  SubsessionClient,
  LiveStreamClient,
  WhiteboardClient,
} from "@/types";

interface SessionAdditionalClientContext {
  chatClient?: ChatClient;
  recordingClient?: RecordingClient;
  captionClient?: CaptionClient;
  subsessionClient?: SubsessionClient;
  liveStreamClient?: LiveStreamClient;
  whiteboardClient?: WhiteboardClient;
}

export default React.createContext<SessionAdditionalClientContext>(null as any);
