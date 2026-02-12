import { ChatMsgType, ChatPrivilege } from "@/constant";
import { ChatFileDownloadProgress, ChatFileUploadProgress, SessionChatMessage } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileTransferSetting } from "@zoom/videosdk";
import { isSameUpload } from "./chat-utils";

export interface ChatReceive {
  name: string;
  userId: number;
  userGuid: string;
}

export interface ChatState {
  messages: SessionChatMessage[];
  newMessage: string;
  chatReceiver: ChatReceive;
  receiveMessage: SessionChatMessage;
  newMessageTip: boolean;
  isEnabledChatInSessionNotifications: boolean;
  unreadCount: number;
  chatPrivilege: ChatPrivilege;
  chatFileDownloadProgress: ChatFileDownloadProgress[];
  chatFileUploadProgress: ChatFileUploadProgress[];
  isFileTransferEnabled: boolean;
  fileSetting: FileTransferSetting;
}

const emptyMessage: SessionChatMessage = {
  sender: {
    name: "",
  },
  message: "",
};
const initialState: ChatState = {
  messages: [],
  receiveMessage: emptyMessage,
  newMessage: "",
  chatReceiver: {
    name: "Everyone",
    userId: ChatMsgType.All,
    userGuid: "",
  },
  newMessageTip: false,
  isEnabledChatInSessionNotifications: true,
  unreadCount: 0,
  chatPrivilege: ChatPrivilege.All,
  chatFileDownloadProgress: [],
  chatFileUploadProgress: [],
  isFileTransferEnabled: false,
  fileSetting: {
    sizeLimit: 2 * 1024 * 1024 * 1024, // 2GB default
    typeLimit: "*",
  },
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<SessionChatMessage>) => {
      state.receiveMessage = action.payload;
      state.messages.push(action.payload);
    },
    setChatReceive: (state, action: PayloadAction<ChatReceive>) => {
      state.chatReceiver = action.payload;
    },
    setNewMessage: (state, action: PayloadAction<string>) => {
      state.newMessage = action.payload;
    },
    setReceiveMessage: (state, action: PayloadAction<SessionChatMessage>) => {
      if (action.payload) {
        state.receiveMessage = action.payload;
      } else {
        state.receiveMessage = emptyMessage;
      }
    },
    setNewMessageTip: (state, action: PayloadAction<boolean>) => {
      state.newMessageTip = action.payload;
      if (!action.payload) {
        state.unreadCount = 0;
      }
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setChatPrivilege: (state, action: PayloadAction<ChatPrivilege>) => {
      if (action.payload) {
        state.chatPrivilege = action.payload;
      }
    },
    setIsEnabledChatInSessionNotifications: (state, action: PayloadAction<boolean>) => {
      state.isEnabledChatInSessionNotifications = action.payload;
    },

    updateChatFileDownloadProgress: (state, action: PayloadAction<ChatFileDownloadProgress>) => {
      if (state.chatFileDownloadProgress.find((item) => item.id === action.payload.id)) {
        state.chatFileDownloadProgress = state.chatFileDownloadProgress.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item,
        );
      } else {
        state.chatFileDownloadProgress.push(action.payload);
      }
    },
    setChatFileUploadProgress: (state, action: PayloadAction<ChatFileUploadProgress>) => {
      const existingIndex = state.chatFileUploadProgress.findIndex((item) => isSameUpload(item, action.payload));
      if (existingIndex >= 0) {
        const existing = state.chatFileUploadProgress[existingIndex];
        state.chatFileUploadProgress[existingIndex] = {
          ...existing,
          clientUploadId: action.payload.clientUploadId ?? existing.clientUploadId,
        };
        return;
      }

      state.chatFileUploadProgress.push(action.payload);
    },
    updateChatFileUploadProgress: (state, action: PayloadAction<ChatFileUploadProgress>) => {
      if (state.chatFileUploadProgress.some((item) => isSameUpload(item, action.payload))) {
        state.chatFileUploadProgress = state.chatFileUploadProgress.map((item) =>
          isSameUpload(item, action.payload)
            ? { ...action.payload, clientUploadId: item.clientUploadId ?? action.payload.clientUploadId }
            : item,
        );
      } else {
        state.chatFileUploadProgress.push(action.payload);
      }
    },
    removeChatFileUploadProgress: (state, action: PayloadAction<ChatFileUploadProgress>) => {
      state.chatFileUploadProgress = state.chatFileUploadProgress.filter(
        (item: ChatFileUploadProgress) => !isSameUpload(item, action.payload),
      );
    },
    setFileTransferEnabled: (state, action: PayloadAction<boolean>) => {
      state.isFileTransferEnabled = action.payload;
    },
    setFileSetting: (state, action: PayloadAction<FileTransferSetting>) => {
      if (action.payload.typeLimit) {
        state.fileSetting.typeLimit = action.payload.typeLimit;
      } else {
        state.fileSetting.typeLimit = "*";
      }
      state.fileSetting.sizeLimit = action.payload.sizeLimit;
    },
  },
});

export const {
  addMessage,
  setNewMessage,
  setReceiveMessage,
  setChatReceive,
  setNewMessageTip,
  setUnreadCount,
  setIsEnabledChatInSessionNotifications,
  setChatPrivilege,
  updateChatFileDownloadProgress,
  setChatFileUploadProgress,
  updateChatFileUploadProgress,
  setFileTransferEnabled,
  setFileSetting,
  removeChatFileUploadProgress,
} = chatSlice.actions;
export default chatSlice.reducer;
