import { useCallback, useContext, useEffect, useState } from "react";
import { ChatFileDownloadStatus, ChatFileUploadStatus, FileTransferSetting } from "@zoom/videosdk";
import { ChatFileDownloadProgress, ChatFileUploadProgress, SessionChatMessage } from "@/types";
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

export const useChatMessage = () => {
  const dispatch = useAppDispatch();
  const client = useContext(ClientContext);
  const [uploadFileCallback, setUploadFileCallback] = useState<any[]>([]);
  const { chatClient } = useContext(sessionAdditionalContext);

  const { messages, chatReceiver, unreadCount, chatFileDownloadProgress, chatFileUploadProgress } =
    useAppSelector(useChatSelector);
  const currentUser = useCurrentUser();

  const chatOnMessage = useCallback(
    (message: SessionChatMessage) => {
      if (message.sender.userId !== currentUser?.userId) {
        dispatch(setUnreadCount(unreadCount + 1));
      }
      if (message.receiver.userId === ChatPrivilege.All || message.receiver.userId === ChatPrivilege.EveryonePublicly) {
        dispatch(
          addMessage(
            Object.assign({}, message, { receiver: { name: "Everyone", userId: ChatPrivilege.All, userGuid: "" } }),
          ),
        );
      } else {
        dispatch(addMessage(message));
      }
    },
    [dispatch, unreadCount, currentUser?.userId],
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
    (fileProgress: ChatFileDownloadProgress) => {
      dispatch(updateChatFileDownloadProgress(fileProgress));
    },
    [dispatch],
  );
  const onChatFileUploadProgress = useCallback(
    (fileProgress: ChatFileUploadProgress) => {
      if (
        fileProgress.status === ChatFileUploadStatus.Success ||
        fileProgress.status === ChatFileDownloadStatus.Cancel ||
        fileProgress.status === ChatFileDownloadStatus.Fail
      ) {
        setUploadFileCallback((pre) => {
          const newArray = pre.filter((item) => {
            return (
              item?.fileName !== fileProgress.fileName &&
              item?.fileSize !== fileProgress.fileSize &&
              item?.receiverId !== fileProgress.receiverId &&
              item?.receiverGuid !== fileProgress.receiverGuid
            );
          });
          return newArray || [];
        });
        dispatch(removeChatFileUploadProgress(fileProgress));
      } else {
        dispatch(updateChatFileUploadProgress(fileProgress));
      }
    },
    [dispatch, setUploadFileCallback],
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
        const fileMessage = {
          fileName: file.name,
          fileSize: file.size,
          receiverId: chatReceiver.userId,
          receiverGuid: chatReceiver.userGuid,
          progress: 0,
          status: ChatFileUploadStatus.Init,
        };
        setUploadFileCallback((pre) => [...pre, { ...fileMessage, cancelCallback }]);
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

  return {
    handleSendMessage,
    uploadFileCallback,
  };
};
