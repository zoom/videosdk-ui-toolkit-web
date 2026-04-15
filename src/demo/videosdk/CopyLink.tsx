import { b64EncodeUnicode } from "@/components/util/util";
import React, { useState } from "react";
import { FormData } from "./types";
import axios from "axios";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const getJwtToken = async (data: FormData, sdkKey: string, sdkSecret: string) => {
  try {
    let responseUrl = "https://websdk.zoomdev.us/jwt/index.php";
    if (!isLocalhost) {
      responseUrl = `${window.location.origin}/jwt/index.php`;
    }
    const response = await axios.get(responseUrl, {
      params: {
        sdkKey: sdkKey ? sdkKey : data.account.value,
        sdkSecret: sdkSecret ? sdkSecret : "",
        sdkPassword: b64EncodeUnicode(data.password),
        sdkTopic: b64EncodeUnicode(data.topic),
        user_identity: data.customerKey,
        session_key: b64EncodeUnicode(data.sessionKey),
        role: data.role.value,
        cloud_recording_option: data.cloudRecordingOption.value,
        cloud_recording_election: data.cloudRecordingElection.value,
        telemetry_id: b64EncodeUnicode(data.telemetryId),
        rc: data.rc?.value ?? "0",
        auto_transcription: 0,
        geo_regions: data.geoRegions.join(","),
        video_webrtc_mode: data.enforceWebRtcVideo.value,
        audio_compatible_mode: data.enforceWebRtcAudio.value,
        pepc: data.enforcePEPC.value,
      },
    });
    return response.data.signature;
  } catch (error) {
    console.error("Error fetching JWT token:", error);
    throw error;
  }
};

export const validateForm = (formData: FormData) => {
  const errors: { displayName?: string; topic?: string } = {};

  if (!formData.displayName.trim()) {
    errors.displayName = "Name is required";
  }

  if (!formData.topic.trim()) {
    errors.topic = "Topic is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const getNewUrl = (formData: FormData, signature: string, sdkKey: string, sdkSecret: string) => {
  let joinUrl = "https://videosdk.zoomdev.us/";
  if (!isLocalhost) {
    joinUrl = `${window.location.origin}/`;
  }
  const newFormatData = {
    ZoomDevepCert: "",
    auto_transcription: formData.autoTranscription,
    cdn: formData.cdn.value,
    cloud_recording_election: formData.cloudRecordingElection.value,
    cloud_recording_option: formData.cloudRecordingOption.value,
    corp: formData.corp.value,
    customerJoinId: b64EncodeUnicode(formData.telemetryId),
    enforceAB: formData.enforceWebRtcAudio.value,
    enforceGalleryView: formData.enforceGalleryView.value,
    enforceVB: formData.enforceVirtualBackground.value,
    enforceWebRtcVideo: formData.enforceWebRtcVideo.value,
    geo_regions: formData.geoRegions.join(","),
    lang: formData.language.value,
    mediasdk: formData.mediaVersion,
    name: b64EncodeUnicode(formData.displayName),
    password: b64EncodeUnicode(formData.password),
    preview: formData.preview.value,
    rc: formData.rc?.value ?? "0",
    role: formData.role.value,
    sdkKey: sdkKey ? sdkKey : formData.account.value,
    sdkSecret: sdkSecret ? sdkSecret : "",
    session_key: b64EncodeUnicode(formData.sessionKey),
    signature,
    topic: b64EncodeUnicode(formData.topic),
    uiKit: formData.uiKit.value,
    useVideoPlayer: formData.useVideoPlayer.value,
    user_identity: b64EncodeUnicode(formData.customerKey),
    version: formData.version.value,
    web: formData.web.value,
    debug: formData.debug.value,
    customizeLayout: formData.customizeLayout.value,
    header: formData.header.value,
    footer: formData.footer.value,
    iframeSize: formData.iframeSize.value,
    pepc: formData.enforcePEPC.value,
    eventListeners: btoa(formData.selectedEvents.map((event) => event.value).join(",")),
  };
  if (newFormatData.uiKit === "0") {
    return `${joinUrl}${newFormatData.version}/index.html?` + new URLSearchParams(newFormatData).toString();
  }
  return `${joinUrl}uikit/${newFormatData.version}/index.html?` + new URLSearchParams(newFormatData).toString();
};

// When UIKit is false legacy broadcast viewer lives at `/streaming.html`,
// so we reuse the normal flow and only swap the url pathname.
export const getWatchStreamingUrl = (formData: FormData, signature: string, sdkKey: string, sdkSecret: string) => {
  const baseUrl = getNewUrl(formData, signature, sdkKey, sdkSecret);
  if (formData.uiKit?.value !== "0") return baseUrl;
  try {
    const url = new URL(baseUrl);
    if (url.pathname.endsWith("/index.html")) {
      url.pathname = url.pathname.replace(/\/index\.html$/, "/streaming.html");
    } else {
      url.pathname = url.pathname.replace(/\/[^/]+\.html$/, "/streaming.html");
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
};

export function CopyLink({ isFormValid, formData }: { isFormValid: boolean; formData: any }) {
  const [linkCopied, setLinkCopied] = useState(false);

  const copyLinkToClipboard = () => {
    // Get the current URL with parameters
    const currentUrl = window.location.href;

    // Copy the URL to clipboard
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <button
      onClick={copyLinkToClipboard}
      className={`w-full ${isFormValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"} text-theme-text-button py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300`}
    >
      {linkCopied ? "Link Copied!" : "Copy Link"}
    </button>
  );
}
