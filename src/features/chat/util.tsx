import { Download, Image, Eye, EyeOff, X, File, FileText } from "lucide-react";
import { ChatFileDownloadProgress, ChatFileUploadProgress, SessionChatMessage } from "@/types";
import React, { useState, useContext, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import sessionAdditionalContext from "@/context/session-additional-context";
import { ChatFileDownloadStatus, ChatFileUploadStatus, Participant } from "@zoom/videosdk";
import { getInitialsFirstLetter } from "@/components/util/util";
import { isImageFile } from "./chat-utils";

export const ParseMessageImage = ({ imageUrl, onClick }: { imageUrl: string; onClick: (imageUrl: string) => void }) => {
  const [isPreview, setIsPreview] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="">
      {isPreview ? (
        <button
          type="button"
          onClick={() => onClick(imageUrl)}
          className="rounded-lg max-h-[200px] w-auto cursor-pointer hover:opacity-90 transition-opacity shadow-md bg-transparent border-0 p-0"
        >
          <img src={imageUrl} alt={t("chat.preview_shared_content_alt")} className="rounded-lg max-h-[200px] w-auto" />
        </button>
      ) : (
        <div className="rounded-lg hover:bg-gray-50 transition-colors">
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors"
          >
            <Image size={20} />
            <span>{t("chat.preview_image")}</span>
          </button>
          <span className="block mt-1 text-xs text-gray-500 truncate max-w-[300px]">{imageUrl}</span>
        </div>
      )}
    </div>
  );
};

export const parseMessageWithLinks = (
  text: string,
  onClickLink: (link: string) => void,
  onImageClick: (imageUrl: string) => void,
) => {
  // Basic URL regex pattern
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  // Image URL regex pattern (common image extensions)
  const imageRegex = /\.(jpg|jpeg|png|gif|webp)$/i;

  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      // Check if the URL is an image
      if (part.match(imageRegex)) {
        return <ParseMessageImage key={`uikit-preview-chat-image-${index}`} imageUrl={part} onClick={onImageClick} />;
      }
      // Regular URL link
      return (
        <button
          type="button"
          key={index}
          className="text-blue-500 break-words cursor-pointer hover:underline bg-transparent border-0 p-0 text-left inline"
          onClick={() => onClickLink(part)}
        >
          {part}
        </button>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export const FileIcon = ({ fileType, size, className }: { fileType: string; size: number; className?: string }) => {
  switch (fileType) {
    case "pdf":
      return <FileText size={size} className={className} />;
    case "txt":
      return <FileText size={size} className={className} />;
    default:
      return <File size={size} className={className} />;
  }
};

export const formatFileSize = (size: number) => {
  return size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : `${(size / 1024).toFixed(1)} KB`;
};

export const FileDownload = ({
  message,
  downloadProgress,
  onImageClick,
  onMeasure,
}: {
  message: SessionChatMessage;
  downloadProgress: ChatFileDownloadProgress;
  onImageClick?: (imageUrl: string) => void;
  onMeasure?: () => void;
}) => {
  const { t } = useTranslation();
  const { file } = message;
  const { chatClient } = useContext(sessionAdditionalContext);
  // const [downloadProgress, setDownloadProgress] = useState(0);
  const [isImagePreview, setIsImagePreview] = useState(false);

  const isImageAttachment = isImageFile(file?.name || "");
  const previewUrl = downloadProgress?.previewUrl || null;
  const isDownloadInProgress = downloadProgress?.status === ChatFileDownloadStatus.InProgress;
  const shouldShowImagePreview = isImageAttachment && !!file?.fileUrl && isImagePreview && !!previewUrl;
  const triggerMeasure = useCallback(() => {
    if (!onMeasure) return;
    requestAnimationFrame(() => onMeasure());
  }, [onMeasure]);

  const simulateDownload = useCallback(() => {
    chatClient
      .downloadFile(message.id, file.fileUrl)
      .then(() => {
        // File download successful
      })
      .catch(() => {
        // File download failed
      });
  }, [chatClient, message.id, file.fileUrl]);

  useEffect(() => {
    triggerMeasure();
  }, [isDownloadInProgress, isImagePreview, previewUrl, triggerMeasure]);

  useEffect(() => {
    if (!isImagePreview) return;
    if (previewUrl) return;
    if (
      downloadProgress?.status === ChatFileDownloadStatus.Fail ||
      downloadProgress?.status === ChatFileDownloadStatus.Cancel
    ) {
      setIsImagePreview(false);
      triggerMeasure();
    }
  }, [downloadProgress?.status, isImagePreview, previewUrl, triggerMeasure]);

  const handleTogglePreview = useCallback(async () => {
    if (!isImageAttachment || !file?.fileUrl) return;

    if (isImagePreview) {
      setIsImagePreview(false);
      triggerMeasure();
      return;
    }

    setIsImagePreview(true);
    triggerMeasure();
    if (previewUrl) return;

    try {
      const result = await chatClient.downloadFile(message.id, file.fileUrl, true);
      if (result instanceof Error) {
        throw result;
      }
    } catch {
      setIsImagePreview(false);
      triggerMeasure();
    }
  }, [chatClient, file?.fileUrl, isImageAttachment, isImagePreview, message.id, previewUrl, triggerMeasure]);

  return (
    <div className="bg-gray-100 rounded-lg p-3" id={`uikit-chat-message-file-${message.id}`}>
      <div className="flex items-center">
        <FileIcon fileType={file.type} size={20} className="text-blue-600" />
        <div className="ml-3 flex-grow">
          <p
            className="text-sm font-medium text-gray-900 max-w-[150px] truncate overflow-hidden text-ellipsis whitespace-nowrap"
            title={file.name}
            id={`uikit-chat-message-file-name-${message.id}`}
          >
            {file.name}
          </p>
          <p className="text-xs text-gray-500" id={`uikit-chat-message-file-size-${message.id}`}>
            {formatFileSize(file.size)}
          </p>
        </div>
        <div className="ml-3 flex items-center gap-2">
          {isDownloadInProgress ? (
            <div className="w-24 bg-gray-200 rounded-full h-2" aria-label={t("chat.file_download_progress_aria")}>
              <div
                className="bg-blue-500 rounded-full h-2 transition-all duration-300 ease-in-out"
                style={{ width: `${downloadProgress.progress}%` }}
                id={`uikit-chat-message-file-download-progress-${message.id}`}
              />
            </div>
          ) : (
            <>
              {isImageAttachment && file?.fileUrl && (
                <button
                  type="button"
                  onClick={handleTogglePreview}
                  className="bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300 transition duration-150 ease-in-out"
                  aria-label={isImagePreview ? t("chat.hide_preview") : t("chat.preview_image")}
                  id={`uikit-chat-message-file-preview-${message.id}`}
                >
                  {isImagePreview ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
              <button
                type="button"
                onClick={() => simulateDownload()}
                className="bg-blue-500 text-theme-text-button rounded-full p-2 hover:bg-blue-600 transition duration-150 ease-in-out"
                aria-label={t("chat.file_download_aria")}
                id={`uikit-chat-message-file-download-${message.id}`}
              >
                <Download size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {shouldShowImagePreview && (
        <button
          type="button"
          onClick={() => onImageClick?.(previewUrl)}
          className="mt-2 w-full rounded-md overflow-hidden bg-white border border-gray-200 cursor-pointer hover:opacity-95 transition-opacity"
        >
          <img
            src={previewUrl}
            alt={file?.name || t("chat.preview_shared_content_alt")}
            className="w-full max-h-[200px] object-contain"
            onLoad={triggerMeasure}
          />
        </button>
      )}
    </div>
  );
};

export const FileUpload = ({ file, onCancel }: { file: ChatFileUploadProgress; onCancel?: (() => void) | null }) => {
  const { t } = useTranslation();
  const canCancel =
    typeof onCancel === "function" &&
    [ChatFileUploadStatus.Init, ChatFileUploadStatus.InProgress].includes(
      file.status as unknown as ChatFileUploadStatus,
    );
  return (
    <div className="w-full bg-gray-50 rounded-lg p-3 mb-2 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-gray-500">
          <FileIcon size={20} fileType="" className="text-blue-600" />
          <span className="text-sm font-medium truncate max-w-[200px]">{file.fileName}</span>
          <span className="text-xs">{formatFileSize(file.fileSize)}</span>
        </div>
        {canCancel && (
          <button
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            onClick={() => {
              onCancel?.();
            }}
            aria-label={t("chat.cancel_upload_aria")}
            id={`uikit-chat-file-upload-cancel-${file.clientUploadId || `${file.receiverId}-${file.fileName}`}`}
          >
            <X size={16} className="text-gray-500" />
          </button>
        )}
      </div>

      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300 rounded-full"
          style={{ width: `${file.progress}%` }}
        />
      </div>
      <div className="mt-1 text-right text-xs text-gray-500">{file.progress}%</div>
    </div>
  );
};

export const getAvatarColor = (userId: number, participant?: Participant) => {
  // if (participant) {
  //   if (participant?.isHost) return "bg-red-500";
  //   if (participant?.isManager) return "bg-blue-500";
  // }
  const colors = [
    "bg-purple-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-sky-500",
    "bg-orange-500",
  ];
  return colors[userId % colors.length];
};

export const Avatar: React.FC<{ name: string; userId: number; className?: string }> = ({ name, userId, className }) => {
  return (
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-theme-text-button text-sm font-medium ${getAvatarColor(userId)} ${className}`}
    >
      {getInitialsFirstLetter(name)}
    </div>
  );
};
