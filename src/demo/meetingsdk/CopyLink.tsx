import { b64EncodeUnicode } from "@/components/util/util";
import React, { useState } from "react";
import { FormData } from "./types";
import axios from "axios";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const getJwtToken = async (data: FormData, sdkKey: string, sdkSecret: string) => {
  try {
    let responseUrl = "https://websdk.zoomdev.us/jwt/websdk.php";
    if (!isLocalhost) {
      responseUrl = `${window.location.origin}/jwt/websdk.php`;
    }
    const response = await axios.get(responseUrl, {
      params: {
        sdkKey: sdkKey ? sdkKey : data.account.value,
        sdksecret: sdkSecret ? sdkSecret : "",
        role: data.role.value,
        mn: data.meetingNumber,
        enforceWebRtcVideo: data.enforceWebRtcVideo.value,
      },
    });
    return response.data.signature;
  } catch (error) {
    console.error("Error fetching JWT token:", error);
    throw error;
  }
};

export const validateForm = (formData: FormData) => {
  const errors: { displayName?: string; meetingNumber?: string } = {};

  if (!formData.displayName.trim()) {
    errors.displayName = "Name is required";
  }

  if (!formData.meetingNumber.trim()) {
    errors.meetingNumber = "meetingNumber is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const getNewUrl = (formData: FormData, signature: string, sdkKey: string, sdkSecret: string) => {
  let joinUrl = "https://websdk.zoomdev.us/";
  if (!isLocalhost) {
    joinUrl = `${window.location.origin}/`;
  }
  const newFormatData = {
    name: b64EncodeUnicode(formData.displayName),
    password: b64EncodeUnicode(formData.password),
    sdkKey: sdkKey ? sdkKey : formData.account.value,
    sdkSecret: sdkSecret ? sdkSecret : "",
    role: formData.role.value,
    web: formData.web.value,
    lang: formData.language.value || "en-US",
    email: b64EncodeUnicode(formData.email), // Can be added if needed: b64EncodeUnicode(formData.email)
    signature: formData.meetingSignature,
    china: formData.china.value,
    meetingNumber: formData.meetingNumber,
    version: formData.version.value,
    buildVersion: formData.buildVersion,
    build: formData.build.value,
    tk: formData.accountTk,
    debug: formData.debug.value,
    webcodecs: formData.webcodecs.value,
    sab: formData.sab.value,
    customerKey: b64EncodeUnicode(formData.customerKey),
    mediasdk: formData.mediaVersion,
    jmak: formData.accountJmak,
    corp: formData.corp.value,
    rwc: formData.rwc.value,
    widget: formData.widget.value,
    externalLinkPage: formData.externalLink.value,
    prod: formData.cdn.value,
    preview: formData.meetingPreview.value,
    waitingRoomPreview: formData.waitingRoomPreview.value,
    hd: formData.hd.value,
    defaultView: formData.defaultView.value,
    recordingToken: formData.recordingToken,
    customerJoinId: b64EncodeUnicode(formData.telemetryId),
    hideShareAudioOption: formData.shareAudio.value,
    isShowReport: formData.report.value,
    vb: formData.customizeVB.value,
    zak: formData.meetingZak,
    test: formData.test.value,
    customizeJoin: formData.customizeJoin.value,
    enablePip: formData.pip.value,
    enablePhone: formData.invitePhone.value,
    enableMobileUI: formData.enableMobileUI.value,
    enableZoomLogo: formData.zoomLogo.value,
    leaveOnPageUnload: formData.leaveOnPageUnload.value,
    autoAdmit: formData.autoAdmit.value,
    exitRoomCallback: formData.exitRoomCallback.value,
    customizeLeaveBtn: formData.customizedLeave.value,
    leaveRedirect: formData.leaveRedirect.value,
    childToken: formData.childToken,
    geo_regions: formData.geoRegions.join(","),
    enforceWebRtcVideo: formData.enforceWebRtcVideo.value,
    pepc: formData.enforcePEPC.value,
    eventListeners: btoa(formData.selectedEvents.map((event) => event.value).join(",")),
    obfToken: formData.obfToken,
  };
  return `${joinUrl}${newFormatData.version}.html?` + new URLSearchParams(newFormatData).toString();
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
