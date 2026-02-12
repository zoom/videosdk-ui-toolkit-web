import { Send, Paperclip } from "lucide-react";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const MobileChatInput = ({
  isEnabledChatInSession,
  onSendMessage,
  onFileSelect,
  isFileTransferEnabled,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [inputHeight, setInputHeight] = useState(40);
  const [isFocused, setIsFocused] = useState(false);

  const handleInput = (e) => {
    const { target } = e;
    target.style.height = "auto";
    const newHeight = Math.min(Math.max(40, target.scrollHeight), 100);
    target.style.height = `${newHeight}px`;
    setInputHeight(newHeight);
    onChange(e);
  };

  const isEmpty = !value || value.trim().length === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center p-2 gap-3">
          {/* Input Area */}
          <div
            className={`flex-1 relative rounded-2xl overflow-hidden transition-shadow duration-200 ${
              isFocused ? "shadow-md" : "shadow-sm"
            }`}
          >
            <textarea
              ref={inputRef}
              value={value}
              onChange={handleInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isEnabledChatInSession ? t("chat.message_placeholder") : t("chat.disabled_message")}
              className={`w-full px-4 py-3 text-[17px] rounded-2xl resize-none transition-colors
                focus:outline-none
                ${!isEnabledChatInSession ? "bg-gray-100 text-gray-400" : "bg-white text-gray-900"}
              `}
              style={{
                height: `${inputHeight}px`,
                maxHeight: "100px",
                lineHeight: "1.3",
              }}
              disabled={!isEnabledChatInSession}
            />
          </div>

          {/* Buttons container - now uses items-center for vertical alignment */}
          <div className="flex items-center gap-2">
            {/* File Upload Button */}
            {isFileTransferEnabled && (
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform active:scale-90
                  ${!isEnabledChatInSession ? "text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                onClick={onFileSelect}
                disabled={!isEnabledChatInSession}
              >
                <Paperclip size={22} className="transform rotate-45" />
              </button>
            )}

            {/* Send Button */}
            <button
              onClick={onSendMessage}
              disabled={!isEnabledChatInSession || isEmpty}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 transform
                ${
                  !isEnabledChatInSession || isEmpty
                    ? "bg-gray-100 text-gray-400"
                    : "bg-blue-500 hover:bg-blue-600 text-theme-text-button active:scale-90"
                }
              `}
            >
              <Send size={20} className={isEmpty ? "opacity-50" : ""} style={{ marginRight: "-2px" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Safe area spacing for iOS */}
      <div className="h-[env(safe-area-inset-bottom)] bg-gray-50" />
    </div>
  );
};

export default MobileChatInput;
