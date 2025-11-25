import { CellMeasurer, ListRowProps, AutoSizer, List, CellMeasurerCache } from "react-virtualized";
import React, { useRef, useEffect, useState, useCallback, useContext, useMemo } from "react";
import Select from "react-select";
import ChatMessage from "./ChatMessage";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

import { Send, Paperclip, SmileIcon, ChevronDown, MoreHorizontalIcon } from "lucide-react";
import { ChatFileDownloadProgress, Participant, SessionChatMessage } from "@/types";
import { isImageType, isMobileDevice } from "@/components/util/service";
import { CommonPopper } from "@/components/widget/CommonPopper";
import { setChatLinkUrl, setIsChatPoppedOut } from "@/store/uiSlice";
import {
  useAppDispatch,
  useAppSelector,
  useChatSelector,
  useParticipantSelector,
  useSessionSelector,
  useSessionUISelector,
} from "@/hooks/useAppSelector";
import { useChatMessage } from "./hook/useChatMessage";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  setChatReceive,
  setIsEnabledChatInSessionNotifications,
  setNewMessage,
  setNewMessageTip,
  setReceiveMessage,
  setUnreadCount,
} from "./chatSlice";
import { useCurrentUser } from "../participant/hooks";
import { FileDownload, FileIcon, FileUpload, formatFileSize } from "./util";
import { usePrevious } from "@/hooks/usePrevious";
import Dropdown from "@/components/widget/Dropdown";
import sessionAdditionalContext from "@/context/session-additional-context";
import { ChatMsgType, ChatPrivilege } from "@zoom/videosdk";
import { useSnackbar } from "notistack";

const maxMessageLength = 1000;

const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    border: "1px solid #e2e2e2",
    borderRadius: "6px",
    boxShadow: "none",
    minHeight: "20px",
    height: "20px",
    "&:hover": {
      borderColor: "#2684FF",
    },
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "0 8px",
    height: "20px",
  }),
  singleValue: (base: any) => ({
    ...base,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "calc(100% - 8px)",
  }),
  input: (base: any) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: "20px",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    padding: "0 4px",
  }),
  option: (base: any, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    padding: "2px 8px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  menu: (base: any) => ({
    ...base,
    boxShadow: "0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)",
    position: "absolute",
    zIndex: 9999,
    width: "100%",
    color: "rgb(31, 41, 55)",
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: isMobileDevice() ? "130px" : "200px",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "4px",
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};

export const ChatPanel: React.FC<{
  handleImageClick: (image: string) => void;
  handleSendMessage: (message: string, file?: File) => void;
  uploadFileCallback: any[];
  width?: number;
  height?: number;
  isDraggable?: boolean;
  isControlByCustomizeLayout?: boolean;
  onClose?: () => void;
}> = ({
  handleImageClick,
  handleSendMessage,
  uploadFileCallback,
  width = 400,
  height = 600,
  isDraggable,
  isControlByCustomizeLayout,
  onClose,
}) => {
  const listRef = useRef<List>(null);
  const scrollPositionRef = useRef(0);
  const { participants } = useAppSelector(useParticipantSelector);
  const { isHost, isManager, config } = useAppSelector(useSessionSelector);
  const { chatClient } = useContext(sessionAdditionalContext);
  const { isChatPoppedOut, activeSidePanel, customizeLayout } = useAppSelector(useSessionUISelector);
  const {
    messages,
    newMessage,
    unreadCount,
    chatReceiver,
    chatPrivilege,
    isEnabledChatInSessionNotifications,
    fileSetting,
    isFileTransferEnabled,
    chatFileUploadProgress,
    chatFileDownloadProgress,
  } = useAppSelector(useChatSelector);
  const currentUser = useCurrentUser();
  const dispatch = useAppDispatch();

  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 80,
      defaultHeight: 120,
    }),
  ).current;

  const prevIsChatPoppedOut = usePrevious(isChatPoppedOut);
  const prevActiveSidePanel = usePrevious(activeSidePanel);
  const prevMessagesLength = usePrevious(messages.length);
  const isHostOrManager = isHost || isManager;
  const isEnabledChatInSession = chatPrivilege !== ChatPrivilege.NoOne;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isAtBottomRef = useRef(true);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const prevNewMessages = usePrevious(newMessage);

  const optionsRef = useRef<HTMLDivElement>(null);

  const { enqueueSnackbar } = useSnackbar();

  const onEmojiClick = (emojiData: EmojiClickData) => {
    dispatch(setNewMessage(newMessage + emojiData.emoji));
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (listRef.current && prevMessagesLength !== undefined) {
      if (messages.length > prevMessagesLength) {
        for (let i = prevMessagesLength; i < messages.length; i++) {
          cache.clear(i, 0);
        }
        listRef.current.recomputeRowHeights(prevMessagesLength);
        if (isScrolledToBottom) {
          listRef.current.scrollToRow(messages.length - 1);
          dispatch(setNewMessageTip(false));
          dispatch(setUnreadCount(0));
        } else {
          dispatch(setNewMessageTip(true));
        }
      } else if (messages.length < prevMessagesLength) {
        cache.clearAll();
        listRef.current.recomputeRowHeights();
      }
    }
  }, [messages, prevMessagesLength, dispatch, isScrolledToBottom, cache]);

  useEffect(() => {
    if (
      (prevIsChatPoppedOut === false && isChatPoppedOut === true) ||
      (prevActiveSidePanel !== "chat" && activeSidePanel === "chat")
    ) {
      // scroll to bottom
      if (listRef.current) {
        setTimeout(() => {
          listRef.current.scrollToRow(messages.length - 1);
          dispatch(setNewMessageTip(false));
          dispatch(setUnreadCount(0));
        }, 50);
      }
    }
  }, [prevIsChatPoppedOut, isChatPoppedOut, prevActiveSidePanel, activeSidePanel, dispatch, messages]);

  useEffect(() => {
    if (prevNewMessages && !newMessage) {
      // jump to the bottom of the chat
      if (listRef.current) {
        listRef.current.scrollToRow(messages.length - 1);
        dispatch(setNewMessageTip(false));
        dispatch(setUnreadCount(0));
      }
    }
  }, [prevNewMessages, newMessage, dispatch, messages]);

  const handleClickLink = (link: string) => {
    dispatch(setChatLinkUrl(link));
  };

  const rowRenderer = ({ index, key, parent, style }: ListRowProps) => {
    const message = messages[index];
    // eslint-disable-next-line prefer-destructuring
    const tmpDownloadProgress = chatFileDownloadProgress.filter((item) => item.id === message.id)[0];
    return (
      <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        {({ measure, registerChild }) => (
          <div ref={registerChild as any} style={style} onLoadCapture={measure}>
            <ChatMessage
              message={message}
              onImageClick={handleImageClick}
              onClickLink={handleClickLink}
              downloadProgress={tmpDownloadProgress || null}
            />
          </div>
        )}
      </CellMeasurer>
    );
  };

  const receiverOptions = [
    {
      label: "Everyone",
      value: ChatMsgType.All,
      userGuid: "",
      id: "uikit-chat-receiver-everyone",
    },
  ];
  if (chatPrivilege === ChatPrivilege.All) {
    receiverOptions.push(
      ...participants
        .filter((p: Participant) => p.userId !== currentUser?.userId)
        .map((p: Participant) => ({
          label: p.displayName,
          value: p.userId,
          userGuid: p.userGuid,
          id: `uikit-chat-receiver-${p.userId}`,
        })),
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(newMessage);
    }
  };

  const onScroll = ({
    scrollTop,
    scrollHeight,
    clientHeight,
  }: {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  }) => {
    scrollPositionRef.current = scrollTop;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 20; // 10px threshold
    isAtBottomRef.current = isBottom;
    setIsScrolledToBottom(isBottom);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (!files?.length) {
        setSelectedFile(null);
        setImagePreview(null);
        return;
      }

      // eslint-disable-next-line prefer-destructuring
      const file = files[0];
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

      if (fileSetting.typeLimit !== "*" && !fileSetting.typeLimit.split(",").includes(fileExtension)) {
        // eslint-disable-next-line no-console
        console.warn("File type not allowed");
        enqueueSnackbar("File size exceeds limit", {
          variant: "error",
          autoHideDuration: 5000,
        });
        return;
      }

      if (file.size > fileSetting.sizeLimit) {
        // eslint-disable-next-line no-console
        console.warn("File size exceeds limit");
        enqueueSnackbar("File size exceeds limit", {
          variant: "error",
          autoHideDuration: 5000,
        });

        return;
      }

      setSelectedFile(file);
      dispatch(setNewMessage(`[File: ${file.name}]`));

      if (isImageType(file.type)) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        setImagePreview(null);
      }

      e.target.value = "";
    },
    [dispatch, fileSetting.typeLimit, fileSetting.sizeLimit, enqueueSnackbar],
  );

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleUnreadCountClick = () => {
    if (listRef.current) {
      listRef.current.scrollToRow(messages.length - 1);
      dispatch(setNewMessageTip(false));
    }
  };

  const optionsClassName = "text-sm w-full";
  const optionsMenuItems = [
    {
      label: "Everyone",
      onClick: () => {
        chatClient?.setPrivilege(ChatPrivilege.All);
      },
      enabled: isHostOrManager,
      checked: chatPrivilege === ChatPrivilege.All,
      className: optionsClassName,
      id: "uikit-chat-option-everyone",
      group: "chat-privilege",
    },
    {
      label: "Public",
      onClick: () => {
        chatClient?.setPrivilege(ChatPrivilege.EveryonePublicly);
        dispatch(setChatReceive({ userId: ChatPrivilege.All, name: "Everyone", userGuid: "" }));
      },
      enabled: isHostOrManager,
      checked: chatPrivilege === ChatPrivilege.EveryonePublicly,
      className: optionsClassName,
      id: "uikit-chat-option-public",
      group: "chat-privilege",
    },
    {
      label: "Disable Chat",
      onClick: () => {
        chatClient?.setPrivilege(ChatPrivilege.NoOne);
      },
      enabled: isHostOrManager,
      checked: chatPrivilege === ChatPrivilege.NoOne,
      className: optionsClassName,
      id: "uikit-chat-option-no-one",
      group: "chat-privilege",
    },

    {
      label: "Notifications",
      onClick: () => {
        dispatch(setIsEnabledChatInSessionNotifications(!isEnabledChatInSessionNotifications));
      },
      enabled: true,
      checked: isEnabledChatInSessionNotifications,
      className: optionsClassName,
      id: "uikit-chat-option-notifications",
      group: "chat-notifications",
    },
  ].filter((item) => item.enabled);

  return (
    <CommonPopper
      isOpen={isControlByCustomizeLayout ? isControlByCustomizeLayout : isChatPoppedOut || activeSidePanel === "chat"}
      title="Chat"
      onClose={
        onClose ||
        (() => {
          dispatch(setIsChatPoppedOut(false));
          dispatch(setReceiveMessage());
        })
      }
      sidePanel={activeSidePanel === "chat"}
      height={height}
      width={width}
      id={"zoom-ui-toolkit-chat-popper"}
      isDraggable={onClose ? isDraggable : true}
    >
      <div className="h-full flex flex-col uikit-custom-scrollbar">
        <div className="flex-grow h-full">
          <AutoSizer>
            {({ width, height }) => (
              <List
                id="uikit-chat-message-list"
                ref={listRef}
                width={width}
                height={height - 10} // Adjust for input area
                rowCount={messages.length}
                rowHeight={cache.rowHeight}
                deferredMeasurementCache={cache}
                rowRenderer={rowRenderer}
                scrollToAlignment="end"
                overscanRowCount={5}
                onScroll={onScroll}
              />
            )}
          </AutoSizer>
        </div>

        {chatFileUploadProgress?.length > 0 && (
          <div className="px-3 py-1.5 w-full">
            {chatFileUploadProgress.map((file, index) => (
              <FileUpload
                key={`file-upload-${index}`}
                file={file}
                cancelCallback={() => {
                  if (uploadFileCallback?.length) {
                    return uploadFileCallback.filter(
                      (item: any) =>
                        item.fileName === file.fileName &&
                        item.fileSize === file.fileSize &&
                        item.fileType === file.fileType &&
                        item.receiverId === file.receiverId,
                    )[0];
                  }
                  return null;
                }}
              />
            ))}
          </div>
        )}

        <div className="py-2 px-3 border-b">
          <div className="flex w-full">
            {isEnabledChatInSession && (
              <>
                <div className={`flex justify-start gap-2 w-4/5`}>
                  <span className="text-sm  w-1/10">To:</span>
                  <Select
                    id="uikit-chat-receiver-select"
                    options={receiverOptions}
                    value={receiverOptions.find((opt) => opt.value === chatReceiver.userId)}
                    onChange={(e: any) =>
                      dispatch(
                        setChatReceive({
                          userId: e.value,
                          name: e.label,
                          userGuid: e.userGuid,
                        }),
                      )
                    }
                    styles={customSelectStyles}
                    isSearchable={true}
                    className="text-sm w-3/5"
                    classNamePrefix="react-select uikit-custom-scrollbar uikit-chat-receiver-select"
                    menuPlacement="auto"
                    menuPortalTarget={document.body}
                    components={{
                      IndicatorSeparator: null,
                    }}
                    noOptionsMessage={() => "No participants found"}
                  />
                </div>
                <div className="flex justify-end w-1/5" ref={optionsRef} id="uikit-chat-option-dropdown">
                  <Dropdown menuItems={optionsMenuItems} wrapperClass="uikit-chat-option-dropdown" />
                </div>
              </>
            )}
            {!isEnabledChatInSession && isHostOrManager && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 
                    text-red-600 font-medium rounded-lg cursor-pointer transition-colors duration-200
                    border border-red-200 hover:border-red-300 justify-center"
                onClick={() => {
                  chatClient?.setPrivilege(ChatPrivilege.All);
                }}
                id="uikit-chat-enable-chat"
              >
                <span className="text-sm">Enable Chat</span>
              </div>
            )}
          </div>
        </div>

        <div className={`w-full h-[120px] ${selectedFile ? "hidden" : ""}`}>
          <textarea
            value={newMessage}
            onChange={(e) => dispatch(setNewMessage(e.target.value))}
            onKeyDown={handleKeyDown}
            placeholder={
              isEnabledChatInSession
                ? selectedFile
                  ? "File selected for upload"
                  : "Type message here..."
                : "Chat is currently disabled by the host"
            }
            className={`w-full px-3 py-2 text-sm bg-theme-background border border-theme-border text-theme-text focus:outline-none resize-none uikit-custom-scrollbar ${
              !isEnabledChatInSession ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            style={{
              minHeight: "60px",
              maxHeight: "120px",
              height: "auto",
            }}
            rows={3}
            disabled={!isEnabledChatInSession}
            id="uikit-chat-message-input"
          />
        </div>

        {selectedFile && (
          <div className="mx-3 my-2 p-2 bg-gray-50 rounded-lg border flex items-center justify-between">
            <div className="flex items-center gap-2">
              {imagePreview ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileIcon size={20} fileType={selectedFile.type} className="text-blue-600" />
                </div>
              )}
              <div className="flex flex-col text-gray-500">
                <span className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                <span className="text-xs">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setImagePreview(null);
                dispatch(setNewMessage(""));
              }}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={fileSetting.typeLimit}
        />

        <div className="flex items-center justify-between px-2 py-1 border-t-0 bg-theme-surface rounded-b-lg">
          <div className="flex items-center gap-1">
            <div className="relative">
              {!isMobileDevice() && config?.featuresOptions?.chat?.enableEmoji && (
                <button
                  id="uikit-chat-emoji-picker"
                  className={`p-1.5 hover:bg-theme-background rounded-lg transition-colors ${
                    !isEnabledChatInSession ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => isEnabledChatInSession && setShowEmojiPicker(!showEmojiPicker)}
                  disabled={!isEnabledChatInSession}
                >
                  <SmileIcon size={20} className="text-theme-text" />
                </button>
              )}

              {showEmojiPicker && config?.featuresOptions?.chat?.enableEmoji && (
                <div
                  className="absolute bottom-full left-0 mb-2 bg-theme-surface border border-theme-border text-theme-text rounded-lg shadow-lg overflow-hidden"
                  id="uikit-chat-emoji-picker-content"
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                    width={300}
                    height={400}
                    className="uikit-custom-scrollbar text-theme-text bg-theme-surface"
                  />
                </div>
              )}
            </div>
            {isFileTransferEnabled && (
              <button
                className={`p-1.5 hover:bg-theme-background rounded-lg transition-colors ${
                  !isEnabledChatInSession ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleFileClick}
                disabled={!isEnabledChatInSession}
                id="uikit-chat-file-select"
              >
                <Paperclip size={20} className="text-theme-text" />
              </button>
            )}
          </div>
          {/* TODO: if text length large than 1000, show a message like 1233/1000 with red color */}
          {newMessage.length > maxMessageLength && (
            <div className="text-red-500 text-xs">
              {newMessage.length}/{maxMessageLength}
            </div>
          )}
          <button
            onClick={() => {
              if (isEnabledChatInSession) {
                handleSendMessage(newMessage, selectedFile);
                setSelectedFile(null);
                // jump to the bottom of the chat
              }
            }}
            className={`${
              isEnabledChatInSession ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            } text-theme-text-button p-2 transition duration-150 ease-in-out rounded-lg
              ${newMessage.length > maxMessageLength ? "opacity-50 cursor-not-allowed" : ""}
            `}
            disabled={!isEnabledChatInSession || newMessage.length > maxMessageLength}
            id="uikit-chat-send-message"
          >
            <Send size={18} />
          </button>
        </div>

        {unreadCount > 0 && (
          <div
            className={`absolute bottom-40 right-5 bg-red-500 text-theme-text-button text-xs rounded-lg w-8 h-5 flex items-center justify-center cursor-pointer hover:bg-red-600`}
            onClick={handleUnreadCountClick}
            id="uikit-chat-unread-count"
          >
            {unreadCount}
          </div>
        )}
      </div>
    </CommonPopper>
  );
};

export default ChatPanel;
