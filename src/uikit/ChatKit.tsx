import ChatPanel from "@/features/chat/ChatPanel";
import { useChatMessage } from "@/features/chat/hook/useChatMessage";
import { SessionApp } from "@/features/session-app";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const ChatKit: React.FC<{ options: any }> = ({ options }) => {
  const handleImageClick = () => {
    // Image click handler
  };

  const { handleSendMessage, uploadFileCallback } = useChatMessage();

  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <ChatPanel
      handleImageClick={handleImageClick}
      handleSendMessage={handleSendMessage}
      uploadFileCallback={uploadFileCallback}
      isControlByCustomizeLayout={isChatOpen}
      onClose={() => setIsChatOpen(false)}
      isDraggable={options?.draggable || false}
      width={options?.width || 400}
      height={options?.height || 400}
    />
  );
};

export default ChatKit;
