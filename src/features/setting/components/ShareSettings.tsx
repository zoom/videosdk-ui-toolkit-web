import React, { useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        <h4 className="font-medium text-theme-text">{t("settings.share_current_stream")}</h4>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 text-xs text-theme-text">{t("settings.share_table_item")}</th>
              <th className="text-left p-2 text-xs text-theme-text">{t("settings.share_table_value")}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme-divider">
              <td className="p-2 text-xs text-theme-text-secondary">{t("settings.share_display_surface")}</td>
              <td className="p-2 text-xs text-theme-text">{info.displaySurface ?? "—"}</td>
            </tr>
            <tr className="border-b border-theme-divider">
              <td className="p-2 text-xs text-theme-text-secondary">{t("settings.share_device_id")}</td>
              <td className="p-2 text-xs text-theme-text truncate">{info.deviceId ?? "—"}</td>
            </tr>
            <tr className="border-b border-theme-divider">
              <td className="p-2 text-xs text-theme-text-secondary">{t("settings.share_resolution")}</td>
              <td className="p-2 text-xs text-theme-text">
                {info.width && info.height ? `${info.width} × ${info.height}` : "—"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }, [info, t]);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h3 className="font-semibold text-lg text-theme-text">{t("settings.share_settings_title")}</h3>
        <p className="text-sm text-theme-text-secondary">{t("settings.share_settings_description")}</p>
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
            <span className="text-theme-text">{t("settings.share_privilege_locked")}</span>
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
            <span className="text-theme-text">{t("settings.share_privilege_multiple")}</span>
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
            <span className="text-theme-text">{t("settings.share_privilege_unlocked")}</span>
          </label>
        </div>
      </section>

      {info && <section className="space-y-2">{renderStreamInfo()}</section>}
    </div>
  );
};

export default ShareSettings;
