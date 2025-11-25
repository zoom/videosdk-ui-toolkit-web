import { ChatFileDownloadStatus, ChatFileUploadStatus, FileInfo } from "@zoom/videosdk";

export const getFileExtension = (fileName: string) => {
  const [ext] = fileName.split(".").reverse();
  return ext;
};
export const isImageFile = (fileName: string) => {
  const [ext] = fileName.split(".").reverse();
  return ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);
};
export const isExcelFile = (fileName: string) => {
  const [ext] = fileName.split(".").reverse();
  return ["xls", "xlsx"].includes(ext);
};
export const isWordFile = (fileName: string) => {
  const [ext] = fileName.split(".").reverse();
  return ["doc", "docx"].includes(ext);
};
export const isPPTFile = (fileName: string) => {
  const [ext] = fileName.split(".").reverse();
  return ["ppt", "pptx"].includes(ext);
};
export const isPdfFile = (fileName: string) => {
  const [ext] = fileName.split(".").reverse();
  return ["pdf"].includes(ext);
};
export const isZipFile = (fileName: string) => {
  const [ext] = fileName.split(".").reverse();
  return ["zip", "gz", "rar"].includes(ext);
};
export const getFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} bytes`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};
export const getFileInProgress = (file: FileInfo, id?: string) => {
  let isInProgress = false;
  let progress = 0;
  if (
    !id &&
    file.upload &&
    [ChatFileUploadStatus.InProgress, ChatFileUploadStatus.Init].includes(file.upload?.status)
  ) {
    isInProgress = true;
    // eslint-disable-next-line prefer-destructuring
    progress = file.upload.progress;
  } else if (file.download?.status === ChatFileDownloadStatus.InProgress) {
    isInProgress = true;
    // eslint-disable-next-line prefer-destructuring
    progress = file.download.progress;
  }
  return [isInProgress, progress];
};
