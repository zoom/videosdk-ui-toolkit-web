import React from "react";
import { useAppDispatch, useAppSelector, useChatSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { setReceiveMessage } from "./chatSlice";
import { setIsChatPoppedOut } from "@/store/uiSlice";
import DraggableToast from "@/components/widget/toast/Toast";
import { Avatar } from "./util";

const NewMessageNotification = () => {
  const dispatch = useAppDispatch();
  const { receiveMessage, isEnabledChatInSessionNotifications } = useAppSelector(useChatSelector);
  const sessionUI = useAppSelector(useSessionUISelector);

  if (!receiveMessage.message || sessionUI.isChatPoppedOut) {
    return null;
  }

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 top-full z-10 text-theme-text">
      <DraggableToast
        key="uikit-toast-new-message"
        type="chat"
        isVisible={isEnabledChatInSessionNotifications}
        icon={
          <div className="w-8 h-8">
            {<Avatar name={receiveMessage.sender.name} userId={receiveMessage.sender.userId} />}
          </div>
        }
        message={`${receiveMessage.message}`}
        duration={5000}
        onClose={() => {
          dispatch(setReceiveMessage());
        }}
        onClick={() => {
          dispatch(setIsChatPoppedOut(true));
          dispatch(setReceiveMessage());
        }}
      />
    </div>
  );
};

export default NewMessageNotification;
