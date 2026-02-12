import { useCallback, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChatFileUploadStatus, FileTransferSetting } from "@zoom/videosdk";
import {
  ChatFileDownloadProgress,
  ChatFileDownloadProgressEvent,
  ChatFileUploadProgress,
  SessionChatMessage,
} from "@/types";
import { useAppSelector, useAppDispatch, useChatSelector } from "@/hooks/useAppSelector";
import {
  addMessage,
  setNewMessage,
  setUnreadCount,
  setChatPrivilege,
  setReceiveMessage,
  setChatFileUploadProgress,
  setFileTransferEnabled,
  setFileSetting,
  removeChatFileUploadProgress,
  updateChatFileUploadProgress,
  updateChatFileDownloadProgress,
} from "../chatSlice";
import { ClientContext } from "@/context/client-context";
import { useCurrentUser } from "@/features/participant/hooks";
import sessionAdditionalContext from "@/context/session-additional-context";
import { ChatPrivilege } from "@/constant";
import { isSameUpload } from "../chat-utils";

const createUploadId = () => {
  const cryptoObj = globalThis.crypto as Crypto | undefined;
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useChatMessage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const client = useContext(ClientContext);
  const uploadCancelMapRef = useRef<Map<string, () => void>>(new Map());
  const uploadProgressRef = useRef<ChatFileUploadProgress[]>([]);
  const downloadPreviewUrlMapRef = useRef<Map<string, string>>(new Map());
  const { chatClient } = useContext(sessionAdditionalContext);

  const { messages, chatReceiver, unreadCount, chatFileDownloadProgress, chatFileUploadProgress } =
    useAppSelector(useChatSelector);
  const currentUser = useCurrentUser();

  useEffect(() => {
    uploadProgressRef.current = chatFileUploadProgress;
  }, [chatFileUploadProgress]);

  const chatOnMessage = useCallback(
    (message: SessionChatMessage) => {
      if (message.sender.userId !== currentUser?.userId) {
        dispatch(setUnreadCount(unreadCount + 1));
      }
      if (message.receiver.userId === ChatPrivilege.All || message.receiver.userId === ChatPrivilege.EveryonePublicly) {
        dispatch(
          addMessage(
            Object.assign({}, message, {
              receiver: { name: t("chat.receiver_everyone"), userId: ChatPrivilege.All, userGuid: "" },
            }),
          ),
        );
      } else {
        dispatch(addMessage(message));
      }
    },
    [dispatch, unreadCount, currentUser?.userId, t],
  );
  const chatPrivilegeChange = useCallback(
    (payload: { chatPrivilege: ChatPrivilege }) => {
      dispatch(setChatPrivilege(payload?.chatPrivilege));
      if (payload?.chatPrivilege === ChatPrivilege.NoOne) {
        dispatch(setUnreadCount(0));
        dispatch(setReceiveMessage());
        dispatch(setNewMessage(""));
      }
    },
    [dispatch],
  );
  const onChatFileDownloadProgress = useCallback(
    (fileProgress: ChatFileDownloadProgressEvent) => {
      const { fileBlob, ...payload } = fileProgress;

      if (fileBlob instanceof Blob && payload?.id) {
        const existingUrl = downloadPreviewUrlMapRef.current.get(payload.id);
        if (existingUrl) {
          URL.revokeObjectURL(existingUrl);
        }
        const previewUrl = URL.createObjectURL(fileBlob);
        downloadPreviewUrlMapRef.current.set(payload.id, previewUrl);
        dispatch(updateChatFileDownloadProgress({ ...payload, previewUrl }));
        return;
      }

      dispatch(updateChatFileDownloadProgress(payload));
    },
    [dispatch],
  );
  const onChatFileUploadProgress = useCallback(
    (fileProgress: ChatFileUploadProgress) => {
      if (
        fileProgress.status === ChatFileUploadStatus.Success ||
        fileProgress.status === ChatFileUploadStatus.Cancel ||
        fileProgress.status === ChatFileUploadStatus.Fail
      ) {
        const existing = uploadProgressRef.current.find((item) => isSameUpload(item, fileProgress));
        if (existing?.clientUploadId) {
          uploadCancelMapRef.current.delete(existing.clientUploadId);
        }
        dispatch(removeChatFileUploadProgress(fileProgress));
      } else {
        dispatch(updateChatFileUploadProgress(fileProgress));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (chatClient) {
      if (chatClient.isFileTransferEnabled()) {
        dispatch(setFileTransferEnabled(true));
        const fileSetting: FileTransferSetting = chatClient.getFileTransferSetting();
        dispatch(setFileSetting(fileSetting));
      }
    }
  }, [chatClient, dispatch]);

  useEffect(() => {
    client.on("chat-on-message", chatOnMessage);
    client.on("chat-privilege-change", chatPrivilegeChange);
    client.on("chat-file-download-progress", onChatFileDownloadProgress);
    client.on("chat-file-upload-progress", onChatFileUploadProgress);
    return () => {
      client.off("chat-on-message", chatOnMessage);
      client.off("chat-privilege-change", chatPrivilegeChange);
      client.off("chat-file-download-progress", onChatFileDownloadProgress);
      client.off("chat-file-upload-progress", onChatFileUploadProgress);
    };
  }, [client, chatOnMessage, chatPrivilegeChange, onChatFileDownloadProgress, onChatFileUploadProgress]);

  useEffect(() => {
    const urlMap = downloadPreviewUrlMapRef.current;
    return () => {
      for (const url of urlMap.values()) {
        URL.revokeObjectURL(url);
      }
      urlMap.clear();
    };
  }, []);

  const handleSendMessage = async (newMessage: string, file?: File) => {
    if (newMessage.trim()) {
      const newMessageObj = {
        index: messages.length + 1,
        sender: {
          userId: currentUser?.userId,
          name: currentUser?.displayName,
        },
        receiver: {
          userId: chatReceiver.userId,
          name: chatReceiver.name,
        },
        file: { type: "text", url: "" },
        message: newMessage.trim(),
        timestamp: new Date().getTime(),
      } as SessionChatMessage;

      if (file) {
        const cancelCallback = await chatClient.sendFile(file, newMessageObj.receiver.userId);
        const clientUploadId = createUploadId();
        if (typeof cancelCallback === "function") {
          uploadCancelMapRef.current.set(clientUploadId, cancelCallback);
        }
        const fileMessage = {
          fileName: file.name,
          fileSize: file.size,
          receiverId: chatReceiver.userId,
          receiverGuid: chatReceiver.userGuid,
          progress: 0,
          status: ChatFileUploadStatus.Init,
          clientUploadId,
        };
        dispatch(setChatFileUploadProgress(fileMessage));
        dispatch(setNewMessage(""));
      } else {
        chatClient
          .send(newMessageObj.message, newMessageObj.receiver.userId)
          .then((message) => {
            dispatch(setNewMessage(""));
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error("Error sending message:", error);
          });
      }
    }
  };

  const cancelUpload = useCallback(
    (file: ChatFileUploadProgress) => {
      if (file.clientUploadId) {
        const cancelFn = uploadCancelMapRef.current.get(file.clientUploadId);
        cancelFn?.();
        uploadCancelMapRef.current.delete(file.clientUploadId);
      }
      dispatch(removeChatFileUploadProgress(file));
    },
    [dispatch],
  );

  return {
    handleSendMessage,
    cancelUpload,
  };
};
