import React from "react";
import {
  ChatClient,
  RecordingClient,
  CaptionClient,
  SubsessionClient,
  LiveStreamClient,
  WhiteboardClient,
  RealTimeMediaStreamsClient,
  BroadcastStreamingClient,
} from "@/types";

interface SessionAdditionalClientContext {
  chatClient?: ChatClient;
  recordingClient?: RecordingClient;
  captionClient?: CaptionClient;
  subsessionClient?: SubsessionClient;
  liveStreamClient?: LiveStreamClient;
  whiteboardClient?: WhiteboardClient;
  realTimeMediaStreamsClient?: RealTimeMediaStreamsClient;
  broadcastStreamingClient?: BroadcastStreamingClient;
}

export default React.createContext<SessionAdditionalClientContext>(null as any);
