import React, { useContext, useEffect, useState, useCallback } from "react";
import { StreamContext } from "@/context/stream-context";
import { useAppDispatch, useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";
import { setSharePrivilege } from "@/store/sessionSlice";
import { SharePrivilege } from "@zoom/videosdk";

type ShareStream = {
  deviceId?: string;
  displaySurface?: string;
  height?: number;
  width?: number;
};

const ShareSettings: React.FC = () => {
  const { stream } = useContext(StreamContext);
  const dispatch = useAppDispatch();
  const { sharePrivilege, isSendingScreenShare } = useAppSelector(useSessionSelector);
  const [info, setInfo] = useState<ShareStream | null>(null);

  const disabled = !stream?.setSharePrivilege;

  useEffect(() => {
    if (stream?.getShareStreamSettings) {
      const shareInfo = stream.getShareStreamSettings();
      setInfo(shareInfo);
    } else {
      setInfo(null);
    }
  }, [stream, isSendingScreenShare]);

  const handleSharePrivilegeClick = (newPrivilege: SharePrivilege) => {
    if (stream?.setSharePrivilege) {
      stream.setSharePrivilege(newPrivilege);
      dispatch(setSharePrivilege(newPrivilege));
    }
  };

  const renderStreamInfo = useCallback(() => {
    if (!info) {
      return null;
    }

    return (
      <div className="space-y-2">
        <h4 className="font-medium text-theme-text">Current Share Stream</h4>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 text-xs text-theme-text">Item</th>
              <th className="text-left p-2 text-xs text-theme-text">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme-divider">
              <td className="p-2 text-xs text-theme-text-secondary">Display surface</td>
              <td className="p-2 text-xs text-theme-text">{info.displaySurface ?? "—"}</td>
            </tr>
            <tr className="border-b border-theme-divider">
              <td className="p-2 text-xs text-theme-text-secondary">Device ID</td>
              <td className="p-2 text-xs text-theme-text truncate">{info.deviceId ?? "—"}</td>
            </tr>
            <tr className="border-b border-theme-divider">
              <td className="p-2 text-xs text-theme-text-secondary">Resolution</td>
              <td className="p-2 text-xs text-theme-text">
                {info.width && info.height ? `${info.width} × ${info.height}` : "—"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }, [info]);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h3 className="font-semibold text-lg text-theme-text">Share Screen Settings</h3>
        <p className="text-sm text-theme-text-secondary">Control who can share their screen in the meeting</p>
        <div className="grid gap-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="share-privilege"
              checked={sharePrivilege === SharePrivilege.Locked}
              onChange={() => handleSharePrivilegeClick(SharePrivilege.Locked)}
              className="h-4 w-4 text-theme-primary focus:ring-theme-primary border-theme-divider"
              disabled={disabled}
            />
            <span className="text-theme-text">Only the host or manager can share</span>
          </label>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="share-privilege"
              checked={sharePrivilege === SharePrivilege.MultipleShare}
              onChange={() => handleSharePrivilegeClick(SharePrivilege.MultipleShare)}
              className="h-4 w-4 text-theme-primary focus:ring-theme-primary border-theme-divider"
              disabled={disabled}
            />
            <span className="text-theme-text">Multiple participants can share simultaneously</span>
          </label>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="share-privilege"
              checked={sharePrivilege === SharePrivilege.Unlocked}
              onChange={() => handleSharePrivilegeClick(SharePrivilege.Unlocked)}
              className="h-4 w-4 text-theme-primary focus:ring-theme-primary border-theme-divider"
              disabled={disabled}
            />
            <span className="text-theme-text">One participant can share at a time</span>
          </label>
        </div>
      </section>

      {info && <section className="space-y-2">{renderStreamInfo()}</section>}
    </div>
  );
};

export default ShareSettings;
