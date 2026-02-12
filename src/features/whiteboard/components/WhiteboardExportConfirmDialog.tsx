import React, { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Download, Image, FileText, AlertCircle } from "lucide-react";
import {
  useAppDispatch,
  useAppSelector,
  useSessionUISelector,
  useSessionSelector,
  useWhiteboardSelector,
} from "@/hooks/useAppSelector";
import { setIsWhiteboardExportConfirmOpen, setWhiteboardExportOptions } from "@/store/uiSlice";
import { setIsExporting } from "@/features/whiteboard/whiteboardSlice";
import SessionAdditionalClientContext from "@/context/session-additional-context";
import ConfirmDialog from "@/components/widget/dialog/ConfirmDialog";
import { useCurrentUser } from "@/features/participant/hooks/useCurrentUser";
import { WHITEBOARD_EXPORT_FORMAT } from "@/features/whiteboard/constant";

// Hook for opening export dialog
export const useWhiteboardExportDialog = () => {
  const dispatch = useAppDispatch();
  const { sessionInfo } = useAppSelector(useSessionSelector);

  const openExportDialog = useCallback(
    (exportAndClose = true) => {
      const defaultExportOptions = {
        format: WHITEBOARD_EXPORT_FORMAT.PDF,
        name: `${sessionInfo.topic}-whiteboard-${new Date().toISOString().split("T")[0]}`,
        includeComments: true,
        shouldCloseAfterExport: exportAndClose,
      };
      dispatch(setWhiteboardExportOptions(defaultExportOptions));
      dispatch(setIsWhiteboardExportConfirmOpen(true));
    },
    [dispatch, sessionInfo.topic],
  );

  return { openExportDialog };
};

const WhiteboardExportConfirmDialog: React.FC = () => {
  const { t } = useTranslation();
  const { whiteboardClient } = useContext(SessionAdditionalClientContext);
  const dispatch = useAppDispatch();
  const sessionUI = useAppSelector(useSessionUISelector);
  const currentUser = useCurrentUser();
  const whiteboard = useAppSelector(useWhiteboardSelector);
  const { isWhiteboardExportConfirmOpen, whiteboardExportOptions } = sessionUI;

  const handleExportAndClose = useCallback(async () => {
    dispatch(setIsWhiteboardExportConfirmOpen(false));
    if (whiteboardExportOptions) {
      try {
        dispatch(setIsExporting(true));
        await whiteboardClient.exportWhiteboard(
          WHITEBOARD_EXPORT_FORMAT.PDF,
          whiteboardExportOptions.name,
          whiteboardExportOptions.includeComments,
        );
        if (whiteboardExportOptions.shouldCloseAfterExport) {
          await whiteboardClient.stopWhiteboardScreen();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to export whiteboard:", error);
        if (whiteboardExportOptions.shouldCloseAfterExport) {
          await whiteboardClient.stopWhiteboardScreen().catch(() => {});
        }
      } finally {
        dispatch(setIsExporting(false));
      }
    }
    dispatch(setWhiteboardExportOptions(null));
  }, [whiteboardClient, whiteboardExportOptions, dispatch]);

  const handleExportOnly = useCallback(async () => {
    dispatch(setIsWhiteboardExportConfirmOpen(false));
    if (whiteboardExportOptions) {
      try {
        dispatch(setIsExporting(true));
        await whiteboardClient.exportWhiteboard(
          WHITEBOARD_EXPORT_FORMAT.PDF,
          whiteboardExportOptions.name,
          whiteboardExportOptions.includeComments,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to export whiteboard:", error);
      } finally {
        dispatch(setIsExporting(false));
      }
    }
    dispatch(setWhiteboardExportOptions(null));
  }, [whiteboardClient, whiteboardExportOptions, dispatch]);

  const handleCloseWithoutExport = useCallback(async () => {
    dispatch(setIsWhiteboardExportConfirmOpen(false));
    dispatch(setWhiteboardExportOptions(null));
    try {
      await whiteboardClient.stopWhiteboardScreen();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to close whiteboard:", error);
    }
  }, [whiteboardClient, dispatch]);

  const handleCancel = useCallback(() => {
    dispatch(setIsWhiteboardExportConfirmOpen(false));
    dispatch(setWhiteboardExportOptions(null));
  }, [dispatch]);

  const handleUpdateExportOptions = useCallback(
    (updates: Partial<NonNullable<typeof whiteboardExportOptions>>) => {
      if (whiteboardExportOptions) {
        dispatch(setWhiteboardExportOptions({ ...whiteboardExportOptions, ...updates }));
      }
    },
    [whiteboardExportOptions, dispatch],
  );

  // Check if this is export-only (no close) dialog
  const isExportOnly = whiteboardExportOptions?.shouldCloseAfterExport === false;

  const isPresenter = whiteboard.presenterID === currentUser?.userId;

  if (!isWhiteboardExportConfirmOpen || !whiteboardExportOptions) {
    return null;
  }

  return (
    <ConfirmDialog
      icon={<Download size={26} className="text-blue-500 drop-shadow-sm" strokeWidth={1.5} />}
      iconClassName="bg-blue-50 dark:bg-blue-950/30"
      onCancel={handleCancel}
      cancelText={t("common.cancel")}
      onClose={isExportOnly ? handleExportOnly : handleExportAndClose}
      closeText={isExportOnly ? t("whiteboard.export_button") : t("whiteboard.export_and_close")}
      closeVariant="primary"
      closeIcon={<Download />}
      title={isExportOnly ? t("whiteboard.export_title") : t("whiteboard.export_question_title")}
      message={isExportOnly ? t("whiteboard.export_message") : t("whiteboard.export_close_warning")}
      confirmText={!isPresenter ? "" : isExportOnly ? t("common.cancel") : t("common.close")}
      onConfirm={isExportOnly ? handleCancel : handleCloseWithoutExport}
      confirmVariant={isExportOnly ? "secondary" : "danger"}
      id="uikit-whiteboard-export-confirm-dialog"
    >
      <div className="space-y-4 mt-4">
        {/* Format Selection */}
        <div>
          <div className="flex gap-2">
            {/* <button
              type="button"
              onClick={() => handleUpdateExportOptions({ format: WHITEBOARD_EXPORT_FORMAT.PNG })}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                whiteboardExportOptions.format === "png"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-theme-surface hover:bg-theme-background text-theme-text border border-theme-border"
              }`}
            >
              <Image size={16} />
              PNG
            </button> */}
            <button
              type="button"
              onClick={() => handleUpdateExportOptions({ format: WHITEBOARD_EXPORT_FORMAT.PDF })}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                whiteboardExportOptions.format === "pdf"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-theme-surface hover:bg-theme-background text-theme-text border border-theme-border"
              }`}
            >
              <FileText size={16} />
              {t("whiteboard.format_pdf")}
            </button>
          </div>
        </div>

        {/* File Name Input */}
        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">{t("whiteboard.filename_label")}</label>
          <input
            type="text"
            value={whiteboardExportOptions.name}
            onChange={(e) => handleUpdateExportOptions({ name: e.target.value })}
            className="w-full px-3 py-2 border border-theme-border rounded-md bg-theme-surface text-theme-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t("whiteboard.filename_placeholder")}
          />
        </div>

        {/* Include Comments Checkbox */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeComments"
              checked={
                whiteboardExportOptions.includeComments &&
                whiteboardExportOptions.format === WHITEBOARD_EXPORT_FORMAT.PDF
              }
              disabled={whiteboardExportOptions.format !== WHITEBOARD_EXPORT_FORMAT.PDF}
              onChange={(e) => handleUpdateExportOptions({ includeComments: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-theme-surface border-theme-border rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label
              htmlFor="includeComments"
              className={`text-sm font-medium ${whiteboardExportOptions.format !== WHITEBOARD_EXPORT_FORMAT.PDF ? "text-theme-text" : "text-theme-text/50"}`}
            >
              {t("whiteboard.include_comments")}
            </label>
          </div>
        </div>
      </div>
    </ConfirmDialog>
  );
};

export default WhiteboardExportConfirmDialog;
