import { useState, useEffect, useRef, HTMLProps, useCallback, useMemo } from "react";
import { usePopupFocus } from "../../hooks";

interface NotificationPanelProps extends Omit<HTMLProps<HTMLDivElement>, "open"> {
  /** Time after which the notification panel will close. If not passed, the component will never close on its own */
  timeout?: number;
  /** JSX for modifying the styling of the container element */
  className?: string;
  /** Optional: whether the panel shows or not. If not passed, this component will handle its own open/close lifecycle with a timeout */
  isOpen?: boolean;
  /** Optional: called when the panel closes. If not passed, this component will handle its own open/close lifecycle with a timeout */
  onClose?: () => void;
}

/**
 * Functional component for showing notifications. There are two primary use-cases; (1) for notifications that close after a timeout, and
 * (2) as a permanent notification that the consumer has to close themselves
 *
 * @param {NotificationPanelProps} props
 * @returns a notification panel functional component
 */
const NotificationsPanel = ({ timeout, isOpen, onClose }: NotificationPanelProps) => {
  const [localIsOpen, setLocalIsOpen] = useState(true);
  const timerRef = useRef(0);
  const isPanelOpen = useMemo(
    () => (isOpen !== undefined && isOpen !== null ? isOpen : localIsOpen),
    [isOpen, localIsOpen],
  );

  const onPanelClose = useCallback(
    () => (onClose !== undefined && onClose !== null ? onClose() : setLocalIsOpen(false)),
    [onClose],
  );

  const { refCallback } = usePopupFocus(isPanelOpen);

  useEffect(() => {
    if (isPanelOpen && timeout) {
      timerRef.current = window.setTimeout(() => onPanelClose(), timeout);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = 0;
      }
    };
  }, [isPanelOpen, onPanelClose, timeout]);

  return isPanelOpen ? <div role="dialog" tabIndex={0} ref={refCallback} /> : null;
};

export default NotificationsPanel;
