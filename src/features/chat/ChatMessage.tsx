import React, { useState } from "react";
import { Copy } from "lucide-react";
import { Avatar, FileDownload, parseMessageWithLinks } from "./util";
import { SessionChatMessage, ChatFileDownloadProgress } from "@/types";
import { useCurrentUser } from "../participant/hooks";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { setChatReceive } from "./chatSlice";

interface ChatMessageProps {
  message: SessionChatMessage;
  downloadProgress?: ChatFileDownloadProgress;
  onImageClick: (image: string) => void;
  onClickLink: (link: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, downloadProgress, onImageClick, onClickLink }) => {
  const [showCopy, setShowCopy] = useState(false);
  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();

  const handleCopy = async () => {
    if (message.message) {
      await navigator.clipboard.writeText(message.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSenderClick = (sender: { userId: number; name: string; userGuid: string }) => {
    if (sender.userId !== 0) {
      dispatch(
        setChatReceive({
          userId: sender.userId,
          name: sender.name,
          userGuid: sender.userGuid,
        }),
      );
    }
  };

  const isMe = (user: { userId: number }) => user.userId === currentUser?.userId;

  // Add a styled wrapper for the sender/receiver names
  const NameDisplay = ({ name }: { name: string }) => (
    <span
      className="max-w-[120px] inline-block overflow-hidden text-ellipsis whitespace-nowrap"
      title={name} // Shows full name on hover
    >
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </span>
  );

  return (
    <div className="group relative py-2 px-4" id={`uikit-chat-message-${message.id}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 pt-7">
          <Avatar name={message.sender.name} userId={message.sender.userId} />
        </div>

        <div className="flex-grow">
          {/* Message Header */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSenderClick(message.sender)}
              className={`font-medium transition-colors ${
                isMe(message.sender) ? "cursor-default" : "text-[#007AFF] hover:text-[#0051FF]"
              }`}
              disabled={isMe(message.sender)}
              id={`uikit-chat-message-sender-${message.id}`}
            >
              {isMe(message.sender) ? "Me" : <NameDisplay name={message.sender.name} />}
            </button>

            <span className="font-medium">To</span>

            <button
              onClick={() => handleSenderClick(message.receiver)}
              className={`font-medium mt-1.5 transition-colors ${
                isMe(message.receiver) ? " cursor-default" : "text-[#007AFF] hover:text-[#0051FF]"
              }`}
              disabled={isMe(message.receiver)}
              id={`uikit-chat-message-receiver-${message.id}`}
            >
              {isMe(message.receiver) ? "Me" : <NameDisplay name={message.receiver.name} />}
            </button>

            <span className="font-medium" id={`uikit-chat-message-timestamp-${message.id}`}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Message Content */}
          <div className="relative">
            {message.message && (
              <div
                className="relative group"
                onMouseEnter={() => setShowCopy(true)}
                onMouseLeave={() => setShowCopy(false)}
              >
                <div
                  className="bg-gray-200 rounded-lg p-3 inline-block w-full break-words"
                  id={`uikit-chat-message-content-${message.id}`}
                >
                  <div className="text-sm text-gray-700 leading-relaxed break-words w-full break-all">
                    {parseMessageWithLinks(message.message, onClickLink, onImageClick)}
                  </div>
                </div>

                {/* Copy Button */}
                <div
                  className={`absolute right-0 top-0 transform transition-opacity duration-200 ${
                    showCopy ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors group-hover:opacity-100"
                    title={copied ? "Copied!" : "Copy message"}
                    id={`uikit-chat-message-copy-${message.id}`}
                  >
                    <Copy size={16} className={copied ? "text-green-500" : "text-gray-400"} />
                  </button>
                </div>
              </div>
            )}

            {/* File Attachment */}
            {message.file && (
              <div className="mt-2">
                <FileDownload message={message} downloadProgress={downloadProgress} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
