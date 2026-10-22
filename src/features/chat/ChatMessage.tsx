import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Copy, Trash2 } from "lucide-react";
import { Avatar, FileDownload, parseMessageWithLinks } from "./util";
import { SessionChatMessage, ChatFileDownloadProgress } from "@/types";
import { useCurrentUser } from "../participant/hooks";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { setChatReceive } from "./chatSlice";
import { ChatPrivilege } from "@/constant";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";

interface ChatMessageProps {
  message: SessionChatMessage;
  downloadProgress?: ChatFileDownloadProgress;
  onImageClick: (image: string) => void;
  onClickLink: (link: string) => void;
  canDelete?: boolean;
  onDelete?: (messageId: string) => Promise<void>;
  measure?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  downloadProgress,
  onImageClick,
  onClickLink,
  canDelete = false,
  onDelete,
  measure,
}) => {
  const { t } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();

  const handleCopy = async () => {
    if (message.message) {
      await navigator.clipboard.writeText(message.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!message.id || !onDelete || isDeleting) return;
    setIsDeleteConfirmOpen(false);
    setIsDeleting(true);
    try {
      await onDelete(message.id);
    } catch {
      // The parent displays the SDK error.
    } finally {
      setIsDeleting(false);
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

  const isEveryoneReceiver = (receiver: { userId: number; name: string }) =>
    receiver.userId === ChatPrivilege.All ||
    receiver.userId === ChatPrivilege.EveryonePublicly ||
    receiver.name === "Everyone" ||
    receiver.name === t("chat.receiver_everyone");

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
              {isMe(message.sender) ? t("chat.message_me") : <NameDisplay name={message.sender.name} />}
            </button>

            <span className="font-medium">{t("chat.message_to")}</span>

            <button
              onClick={() => handleSenderClick(message.receiver)}
              className={`font-medium transition-colors ${
                isMe(message.receiver) ? " cursor-default" : "text-[#007AFF] hover:text-[#0051FF]"
              }`}
              disabled={isMe(message.receiver)}
              id={`uikit-chat-message-receiver-${message.id}`}
            >
              {isMe(message.receiver) ? (
                t("chat.message_me")
              ) : isEveryoneReceiver(message.receiver) ? (
                t("chat.receiver_everyone")
              ) : (
                <NameDisplay name={message.receiver.name} />
              )}
            </button>

            <span className="font-medium" id={`uikit-chat-message-timestamp-${message.id}`}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Message Content */}
          <div
            className="relative"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
          >
            {message.message && (
              <div className="relative group">
                <div
                  className="bg-gray-200 rounded-lg p-3 inline-block w-full break-words"
                  id={`uikit-chat-message-content-${message.id}`}
                >
                  <div className="text-sm text-gray-700 leading-relaxed break-words w-full break-all">
                    {parseMessageWithLinks(message.message, onClickLink, onImageClick)}
                  </div>
                </div>
              </div>
            )}

            {(message.message || (canDelete && message.id)) && (
              <div
                className={`uikit-chat-message-actions absolute right-0 top-0 flex transform transition-opacity duration-200 ${
                  showActions ? "uikit-chat-message-actions-visible" : ""
                }`}
              >
                {message.message && (
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors group-hover:opacity-100"
                    title={copied ? t("common.copied") : t("chat.copy_message_tooltip")}
                    id={`uikit-chat-message-copy-${message.id}`}
                  >
                    <Copy size={16} className={copied ? "text-green-500" : "text-gray-400"} />
                  </button>
                )}
                {canDelete && message.id && (
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="p-1.5 rounded-md hover:bg-red-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    title={t("common.delete")}
                    aria-label={t("common.delete")}
                    id={`uikit-chat-message-delete-${message.id}`}
                    disabled={isDeleting}
                  >
                    <Trash2 size={16} className="text-gray-400" />
                  </button>
                )}
              </div>
            )}

            {/* File Attachment */}
            {message.file && (
              <div className="mt-2">
                <FileDownload
                  message={message}
                  downloadProgress={downloadProgress}
                  onImageClick={onImageClick}
                  onMeasure={measure}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isDeleteConfirmOpen &&
        createPortal(
          <div className="zoom-ui-toolkit-root">
            <ConfirmDialog
              title={t("chat.delete_message_title")}
              message={t("chat.delete_message_confirmation")}
              onConfirm={handleDelete}
              confirmText={t("common.delete")}
              confirmVariant="danger"
              onCancel={() => setIsDeleteConfirmOpen(false)}
              cancelText={t("common.cancel")}
              id="uikit-chat-delete-message-dialog"
            />
          </div>,
          document.body,
        )}
    </div>
  );
};

export default ChatMessage;
