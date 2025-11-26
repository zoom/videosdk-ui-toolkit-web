import { Download, Image, X, CheckCircle, File, FileText } from "lucide-react";
import { ChatFileDownloadProgress, ChatFileUploadProgress, SessionChatMessage } from "@/types";
import React, { useState, useContext, useEffect, useCallback } from "react";
import sessionAdditionalContext from "@/context/session-additional-context";
import { ChatFileDownloadStatus, ChatFileUploadStatus, Participant } from "@zoom/videosdk";
import { getInitialsFirstLetter } from "@/components/util/util";

export const ParseMessageImage = ({ imageUrl, onClick }: { imageUrl: string; onClick: (imageUrl: string) => void }) => {
  const [isPreview, setIsPreview] = useState(false);
  return (
    <div className="">
      {isPreview ? (
        <img
          src={imageUrl}
          alt="Shared image"
          className="rounded-lg max-h-[200px] w-auto cursor-pointer hover:opacity-90 transition-opacity shadow-md"
          onClick={() => onClick(imageUrl)}
        />
      ) : (
        <div className="rounded-lg hover:bg-gray-50 transition-colors">
          <button
            onClick={() => setIsPreview(true)}
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors"
          >
            <Image size={20} />
            <span>Preview image</span>
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
        <span
          key={index}
          className="text-blue-500 break-words cursor-pointer hover:underline"
          onClick={() => onClickLink(part)}
        >
          {part}
        </span>
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
}: {
  message: SessionChatMessage;
  downloadProgress: ChatFileDownloadProgress;
}) => {
  const { file } = message;
  const { chatClient } = useContext(sessionAdditionalContext);
  // const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const simulateDownload = useCallback(() => {
    setIsDownloaded(false);
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
    if (downloadProgress?.status === ChatFileDownloadStatus.Success) {
      setIsDownloaded(true);
    }
  }, [downloadProgress]);

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-3 mt-2" id={`uikit-chat-message-file-${message.id}`}>
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
      {!isDownloaded ? (
        downloadProgress?.progress === 0 || !downloadProgress ? (
          <button
            onClick={() => simulateDownload()}
            className="ml-3 bg-blue-500 text-theme-text-button rounded-full p-2 hover:bg-blue-600 transition duration-150 ease-in-out"
            id={`uikit-chat-message-file-download-${message.id}`}
          >
            <Download size={16} />
          </button>
        ) : (
          <div className="ml-3 w-16 bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 rounded-full h-4 transition-all duration-300 ease-in-out"
              style={{ width: `${downloadProgress?.progress}%` }}
              id={`uikit-chat-message-file-download-progress-${message.id}`}
            ></div>
          </div>
        )
      ) : (
        <div className="flex items-center">
          <CheckCircle
            size={24}
            className="ml-3 text-green-500"
            id={`uikit-chat-message-file-download-success-${message.id}`}
          />
          <button
            onClick={() => {
              setIsDownloaded(false);
              simulateDownload();
            }}
            className="ml-3 bg-blue-500 text-theme-text-button rounded-full p-2 hover:bg-blue-600 transition duration-150 ease-in-out"
            id={`uikit-chat-message-file-redownload-${message.id}`}
          >
            <Download size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export const FileUpload = ({
  file,
  cancelCallback,
}: {
  file: ChatFileUploadProgress;
  cancelCallback: () => void | null;
}) => {
  return (
    <div className="w-full bg-gray-50 rounded-lg p-3 mb-2 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-gray-500">
          <FileIcon size={20} fileType="" className="text-blue-600" />
          <span className="text-sm font-medium truncate max-w-[200px]">{file.fileName}</span>
          <span className="text-xs">{formatFileSize(file.fileSize)}</span>
        </div>
        {/* {typeof cancelCallback === "function" && (
          <button
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log("cancelCallback", file.fileName);
              cancelCallback();
            }}
          >
            <X size={16} className="text-gray-500" />
          </button>
        )} */}
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
