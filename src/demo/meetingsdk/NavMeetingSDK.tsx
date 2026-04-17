import React, { useState, useEffect, version } from "react";
import Select from "react-select";
import { User, Video, Lock, Mail, Key, Settings, Logs, Text, Info } from "lucide-react";
import { getReactSelectTheme } from "../reactSelectTheme";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { b64EncodeUnicode, decodeJWTPlayload } from "@/components/util/util";
import { v7 as uuidv7 } from "uuid";
import ClickButton from "./ClickButton";
import { AccountConfig, FormData, InputConfig } from "./types";
import { getExploreName, getSystemInfo, isLocalhost } from "@/components/util/platform";
import EventListenerSelect, { EventListenerSelectRef } from "../EventListenerSelect";

let allAccountConfigs: { [key: string]: AccountConfig };
const options = {
  selects: {
    role: {
      id: "meeting_role",
      options: [
        { value: "0", label: "Attendee(role=0)" },
        { value: "1", label: "Host(role=1)" },
        {
          value: "5",
          label: "Assistant(role=5)",
        },
      ],
      tooltip:
        "1. Host and Assistant need clientId/sdkKey same account with MeetingNumber. 2. Assistant need enable Conf Control in OP Settings.",
    },
    language: {
      id: "meeting_lang",
      options: [
        { value: "en-US", label: "English" },
        { value: "zh-CN", label: "Chinese (简体中文)" },
        { value: "de-DE", label: "German (Deutsch)" },
        { value: "es-ES", label: "Spanish (Español)" },
        { value: "fr-FR", label: "French (Français)" },
        { value: "jp-JP", label: "Japanese (日本語) old" },
        { value: "ja-JP", label: "Japanese (日本語)" },
        { value: "pt-PT", label: "Portuguese (Português)" },
        { value: "ru-RU", label: "Russian (Русский)" },
        { value: "zh-TW", label: "Chinese (繁体中文)" },
        { value: "ko-KO", label: "Korean (한국어) old" },
        { value: "ko-KR", label: "Korean (한국어)" },
        { value: "vi-VN", label: "Vietnamese (Tiếng Việt)" },
        { value: "it-IT", label: "Italian (Italiano)" },
        { value: "tr-TR", label: "Turkish (Türkçe)" },
        { value: "pl-PL", label: "Polish (Polski)" },
        { value: "id-ID", label: "Indonesian (Bahasa Indonesia)" },
        { value: "nl-NL", label: "Dutch (Nederlands)" },
        { value: "sv-SE", label: "Swedish (Svenska)" },
      ],
    },
    web: {
      id: "meeting_web",
      options: [
        { value: "zoom.us", label: "webEndpoint(aw1)" },
        { value: "zoomdev.us", label: "dev" },

        { value: "go.zoom.us", label: "go" },
        { value: "intuitive.zoomdev.us", label: "dev intuitive" },
        { value: "dev.zoomdev.us", label: "devMaster" },
        { value: "intuitive-web.zoom.us", label: "intuitive-web" },
        { value: "eu01web.zoom.us", label: "eu01" },
        { value: "eu02web.zoom.us", label: "eu02" },
        { value: "us02web.zoom.us", label: "us02" },
        { value: "us03web.zoom.us", label: "us03" },
        { value: "us04web.zoom.us", label: "us04" },
        { value: "us05web.zoom.us", label: "us05" },
        { value: "us06web.zoom.us", label: "us06" },
        { value: "us07web.zoom.us", label: "us07" },
        { value: "ca01web.zoom.us", label: "ca01" },
        { value: "au01web.zoom.us", label: "au01" },
        { value: "sa01web.zoom.us", label: "sa01" },
        { value: "sg01web.zoom.us", label: "sg01" },
        { value: "in01web.zoom.us", label: "in01" },
        { value: "dg01web.zoom.us", label: "dg01" },
        { value: "www.zoomgov.com", label: "gov" },
        { value: "www.zoomgovdev.com", label: "govdev" },
        { value: "zoom.com.cn", label: "cn" },
        { value: "local.zoom.us", label: "local" },
        { value: "deva.zoomdev.us", label: "deva" },
        { value: "devb.zoomdev.us", label: "devb" },
        { value: "dev-integration.zoomdev.us", label: "devint" },
        { value: "zoomdev.com.cn", label: "devcn" },
        { value: "devep.zoomdev.us", label: "devep" },
        { value: "meeting.zomo.com.cn", label: "zomoprod" },
        { value: "dev.zomo.com.cn", label: "zomodev" },
        { value: "zoomgov.mil", label: "zoomgov.mil" },
        { value: "zoommildev.com", label: "zoommildev.com" },
        { value: "mdevmp.zoomdev.us", label: "mdevmp.zoomdev.us" },
      ],
    },
    version: {
      id: "websdk_version",
      options: [
        { value: "3.14.0", label: "3.14.0" },
        { value: "3.13.1", label: "3.13.1" },
        { value: "3.13.0", label: "3.13.0" },
        { value: "3.12.0", label: "3.12.0" },
        { value: "3.11.2", label: "3.11.2" },
        { value: "3.11.0", label: "3.11.0" },
        { value: "3.12.0", label: "3.12.0" },
        { value: "3.10.0", label: "3.10.0" },
        { value: "3.10.10", label: "3.10.10(test mediasdk)" },
        { value: "3.9.2", label: "3.9.2" },
        { value: "3.9.0", label: "3.9.0" },
        { value: "3.8.5", label: "3.8.5" },
        { value: "3.8.4", label: "3.8.5-bcv" },
        { value: "3.8.0", label: "3.8.0" },
        { value: "3.8.10", label: "3.8.10" },
        { value: "3.10.1", label: "3.10.1(TA)" },
        { value: "3.7.0", label: "3.7.0" },
        { value: "3.6.1", label: "3.6.1" },
        { value: "3.6.0", label: "3.6.0" },
        { value: "3.5.3", label: "3.5.3(events only)" },
        { value: "3.5.2", label: "3.5.2" },
        { value: "3.5.1", label: "3.5.1" },
        { value: "3.1.6", label: "3.1.6" },
      ],
    },
    widget: {
      id: "meeting-widget",
      options: [
        { value: "0", label: "Client View" },
        { value: "3", label: "Client View(dev)" },
        { value: "1", label: "Component View" },
        { value: "2", label: "Component View(dev)" },
        { value: "4", label: "UIToolkit(don't use)" },
        { value: "5", label: "Calander Nav(don't use)" },
      ],
    },
    china: {
      id: "meeting_china",
      options: [
        { value: "0", label: "Global" },
        { value: "1", label: "China" },
      ],
    },
    cdn: {
      id: "meeting_prod",
      options: [
        isLocalhost
          ? { value: "websdk.zoomdev.us", label: "websdk.zoomdev.us" }
          : { value: window.location.host, label: window.location.host },
        { value: "source.zoom.us", label: "default" },
        { value: "dev", label: "default(dev)" },
        { value: "source.zoomgovdev.com", label: "source.zoomgovdev.com" },
        { value: "source.zoomgov.com", label: "source.zoomgov.com" },
        { value: "source.zoommildev.com", label: "source.zoommildev.com(VPN)" },
        { value: "source.zoomgov.mil", label: "source.zoomgov.mil(VPN)" },
      ],
    },
    corp: {
      id: "meeting-corp",
      options: [
        { value: "1", label: "SAB:require-corp" },
        { value: "0", label: "NO-SAB:disableCORP" },
        { value: "2", label: "SAB:credentialless" },
      ],
    },
    enforceGalleryView: {
      id: "enforceGalleryView",
      options: [
        { value: "1", label: "Enforce Gallery View: True" },
        { value: "0", label: "Enforce Gallery View: False" },
      ],
    },
    enforceVirtualBackground: {
      id: "enforceVB",
      options: [
        { value: "1", label: "Enforce Virtual Background: True" },
        { value: "0", label: "Enforce Virtual Background: False" },
      ],
    },
    enforceWebRtcAudio: {
      id: "enforceAB",
      options: [
        { value: "1", label: "Enforce WebRTC Audio: True" },
        { value: "0", label: "Enforce WebRTC Audio: False" },
      ],
    },
    enforceWebRtcVideo: {
      id: "enforceWebRtcVideo",
      options: [
        { value: "1", label: "Enforce WebRTC Video: True" },
        { value: "0", label: "Enforce WebRTC Video: False" },
        { value: "2", label: "Enforce WebRTC Video: Auto" },
      ],
    },
    useVideoPlayer: {
      id: "useVideoPlayer",
      options: [
        { value: "1", label: "VideoPlayer: True" },
        { value: "0", label: "VideoPlayer: False" },
      ],
    },
    debug: {
      id: "meeting-debug",
      options: [
        { value: "1", label: "Debug: True" },
        { value: "0", label: "Debug: False" },
      ],
    },
    geoRegions: {
      id: "geo-region_value",
      options: [
        { value: "US", label: "United States of America" },
        { value: "AU", label: "Australia" },
        { value: "CA", label: "Canada" },
        { value: "IN", label: "India" },
        { value: "CN", label: "China" },
        { value: "BR", label: "Brazil" },
        { value: "MX", label: "Mexico" },
        { value: "HK", label: "Hong Kong" },
        { value: "SG", label: "Singapore" },
        { value: "JP", label: "Japan" },
        { value: "DE", label: "Germany" },
        { value: "NL", label: "Netherlands" },
      ],
    },
    account: {
      id: "meeting_account_value",
      options: [{ value: "", label: "Search Account" }],
    },
    report: {
      id: "meeting-report",
      options: [
        { value: "1", label: "enableReport" },
        { value: "0", label: "disableReport" },
      ],
    },
    waitingRoomPreview: {
      id: "waiting-room-preview",
      options: [
        { value: "1", label: "enableWaitingRoomPreview" },
        { value: "0", label: "disableWaitingRoomPreview" },
      ],
    },
    meetingPreview: {
      id: "meeting-preview",
      options: [
        { value: "0", label: "enablePreview" },
        { value: "1", label: "disablePreview" },
        { value: "2", label: "Disable Preview But Auto A/V" },
      ],
    },
    hd: {
      id: "meeting-hd",
      options: [
        { value: "1", label: "HD(720P) Send" },
        { value: "0", label: "SD(360P) Send" },
      ],
    },
    webcodecs: {
      id: "meeting-webcodecs",
      options: [
        { value: "1", label: "WebCodecs: True" },
        { value: "0", label: "WebCodecs: False" },
      ],
    },
    sab: {
      id: "meeting-sab",
      options: [
        { value: "0", label: "SharedArrayBuffers OT: False" },
        { value: "1", label: "SharedArrayBuffers OT: True" },
      ],
    },
    externalLink: {
      id: "meeting-external-link",
      options: [
        { value: "1", label: "externalLinkPage: True" },
        { value: "0", label: "externalLinkPage: False" },
      ],
    },
    iframeSize: {
      id: "iframe_size",
      options: [
        { value: "ZE1", label: "iFrame 400*300 ZE1" },
        { value: "ZE2", label: "400*514 ZE2" },
        { value: "SMALL", label: "500*281" },
        { value: "VGA", label: "640*480" },
        { value: "HVGA", label: "480*320" },
        { value: "WQVGA", label: "360*240" },
        { value: "FWQVGA", label: "432*240" },
        { value: "SVGA", label: "800*600" },
        { value: "XGA", label: "1024*768" },
      ],
    },
    defaultView: {
      id: "meeting-default-view",
      options: [
        { value: "", label: "client/component: default" },
        { value: "speaker", label: "speaker view" },
        { value: "gallery", label: "gallery view" },
        { value: "multiSpeaker", label: "client: multi speaker" },
        { value: "ribbon", label: "component: ribbon" },
        { value: "active", label: "component: active" },
        { value: "minimized", label: "component: minimized" },
      ],
    },
    shareAudio: {
      id: "meeting-share-audio",
      options: [
        { value: "", label: "Share Audio(default)" },
        { value: "1", label: "disable" },
        { value: "0", label: "enable" },
      ],
    },
    test: {
      id: "meeting-test",
      options: [
        { value: "", label: "Join Test Meeting(No)" },
        { value: "1", label: "Join Test Meeting(Yes)" },
      ],
    },
    customizeVB: {
      id: "meeting-vb",
      options: [
        { value: "0", label: "CustomizeVB: Off" },
        { value: "1", label: "CustomizeVB: On" },
      ],
    },
    customizeJoin: {
      id: "customize-join",
      options: [
        { value: "0", label: "CustomizeJoin: Off" },
        { value: "1", label: "CustomizeJoin: On" },
      ],
    },
    pip: {
      id: "meeting-pip",
      options: [
        { value: "1", label: "PIP: ON" },
        { value: "0", label: "PIP: OFF" },
      ],
    },
    invitePhone: {
      id: "meeting-invite-phone",
      options: [
        { value: "1", label: "ZoomPhone: ON" },
        { value: "0", label: "ZoomPhone: OFF" },
      ],
    },
    enableMobileUI: {
      id: "meeting-enable-mobile-ui",
      options: [
        { value: "1", label: "MobileUI: ON" },
        { value: "0", label: "MobileUI: OFF" },
      ],
      tooltip: "enableMobileUI: True will use mobile more menu items, only >= 6.0.0",
    },
    zoomLogo: {
      id: "meeting-zoom-logo",
      options: [
        { value: "1", label: "ZoomLogo: ON" },
        { value: "0", label: "ZoomLogo: OFF" },
      ],
    },
    leaveOnPageUnload: {
      id: "leaveOnPageUnload",
      options: [
        { value: "0", label: "leaveOnPageUnload: Off" },
        { value: "1", label: "leaveOnPageUnload: On" },
      ],
    },
    autoAdmit: {
      id: "meeting-autoAdmit",
      options: [
        { value: "0", label: "AutoAdmit: Off" },
        { value: "1", label: "AutoAdmit: On" },
      ],
    },
    customizedLeave: {
      id: "meeting-customized-leave",
      options: [
        { value: "0", label: "CustomizeLeaveBtn: Off" },
        { value: "1", label: "CustomizeLeaveBtn: On" },
      ],
    },
    exitRoomCallback: {
      id: "meeting-exitRoomCallback",
      options: [
        { value: "0", label: "ExitCallback: Off" },
        { value: "1", label: "ExitCallback: On" },
      ],
    },
    leaveRedirect: {
      id: "meeting-leaveRedirect",
      options: [
        { value: "0", label: "LeaveRedirect: Off" },
        { value: "1", label: "LeaveRedirect: On" },
      ],
    },
    enforcePEPC: {
      id: "enforcePEPC",
      options: [
        { value: "1", label: "Enforce PEPC: True" },
        { value: "0", label: "Enforce PEPC: False" },
      ],
    },
    rwc: {
      id: "meeting-rwc",
      options: [
        { value: "", label: "default empty" },
        { value: "intuitive-rwcor.cloud.zoom.us", label: "intuitive-rwcor.cloud.zoom.us-美国(OR)" },
        { value: "intuitive-rwcoh.cloud.zoom.us", label: "intuitive-rwcoh.cloud.zoom.us-美国(OH)" },
        { value: "rwciad.iad.zoom.us", label: "rwciad.iad.zoom.us-美国-华盛顿(IAD)" },
        { value: "rwcsjc.sjc.zoom.us", label: "rwcsjc.sjc.zoom.us-美国-圣何塞(SJC)" },
        { value: "rwciad2.iad.zoom.us", label: "rwciad2.iad.zoom.us-美国-华盛顿(IAD2)" },
        { value: "rwcsjc2.sjc.zoom.us", label: "rwcsjc2.sjc.zoom.us-美国-圣何塞(SJC2)" },
        { value: "rwcsjcgo.sjc.zoom.us", label: "rwcsjcgo.sjc.zoom.us-美国-圣何塞(SJC-GO)" },
        { value: "rwcdg.cloud.zoom.us", label: "rwcdg.cloud.zoom.us-美国" },
        { value: "rwciad3.iad.zoom.us", label: "rwciad3.iad.zoom.us-美国-华盛顿(IAD3)" },
        { value: "rwcsjc3.sjc.zoom.us", label: "rwcsjc3.sjc.zoom.us-美国-圣何塞(SJC3)" },
        { value: "rwcyyz.yyz.zoom.us", label: "rwcyyz.yyz.zoom.us-加拿大-多伦多(YYZ)" },
        { value: "rwcyvr.yvr.zoom.us", label: "rwcyvr.yvr.zoom.us-加拿大-温哥华(YVR)" },
        { value: "rwcsyd.syd.zoom.us", label: "rwcsyd.syd.zoom.us-澳大利亚-悉尼(SYD)" },
        { value: "rwcmel.mel.zoom.us", label: "rwcmel.mel.zoom.us-澳大利亚-墨尔本(MEL)" },
        { value: "rwcmb.cloud.zoom.us", label: "rwcmb.cloud.zoom.us-印度-孟买" },
        { value: "rwchy.cloud.zoom.us", label: "rwchy.cloud.zoom.us-印度-海得拉巴" },
        { value: "rwchkg.hkg.zoom.us", label: "rwchkg.hkg.zoom.us-香港" },
        { value: "rwcnrt.nrt.zoom.us", label: "rwcnrt.nrt.zoom.us-东京(NRT)" },
        { value: "rwcsp.cloud.zoom.us", label: "rwcsp.cloud.zoom.us-拉丁美洲" },
        { value: "intuitive-rwcff.cloud.zoom.us", label: "intuitive-rwcff.cloud.zoom.us-欧洲-德国-法兰克福" },
        { value: "intuitive-rwcff2.cloud.zoom.us", label: "intuitive-rwcff2.cloud.zoom.us-欧洲-德国-法兰克福" },
        { value: "rwcfra.fra.zoom.us", label: "rwcfra.fra.zoom.us-欧洲-德国-法兰克福(FRA)" },
        { value: "rwcgofra.fra.zoom.us", label: "rwcgofra.fra.zoom.us-欧洲-德国-法兰克福(GO)" },
        { value: "rwcams.ams.zoom.us", label: "rwcams.ams.zoom.us-荷兰-阿姆斯特丹(AMS)" },
        { value: "rwcprod.tj.zoom.com.cn", label: "rwcprod.tj.zoom.com.cn-天津" },
        { value: "rwcdgtj.tj.zoom.com.cn", label: "rwcdgtj.tj.zoom.com.cn-天津" },
        { value: "rwcsin.sin.zoom.us", label: "rwcsin.sin.zoom.us-新加坡(SIN)" },
        { value: "rwctw.cloud.zoom.us", label: "rwctw.cloud.zoom.us-中国台湾" },
        { value: "rwcjed.jed.zoom.us", label: "rwcjed.jed.zoom.us-沙特-吉达(JED)" },
        { value: "rwcruh.ruh.zoom.us", label: "rwcruh.ruh.zoom.us-沙特-利雅得(RUH)" },
        { value: "rwcksa1.ksa.zoom.us", label: "rwcksa1.ksa.zoom.us-沙特" },
        { value: "rwcksa2.ksa.zoom.us", label: "rwcksa2.ksa.zoom.us-沙特" },
        { value: "rwclhr.lhr.zoom.us", label: "rwclhr.lhr.zoom.us-英国-伦敦(LHR)" },
        { value: "gorwcdv.dv.zoom.us", label: "gorwcdv.dv.zoom.us-GO" },
        { value: "rwcdev2.zoomdev.us", label: "rwcdev2.zoomdev.us-DEV" },
        { value: "rwcdevep.zoomdev.us", label: "rwcdevep.zoomdev.us-DEVEP" },
      ],
    },
    build: {
      id: "meeting_build",
      options: [
        { value: "", label: "not build" },
        { value: "builddev", label: "builddev" },
        { value: "buildprod", label: "buildprod" },
      ],
    },
  },
  inputs: {
    meetingNumber: { id: "meeting_mn", type: "text", placeholder: "meetingNumber" },
    displayName: { id: "meeting_username", type: "text", placeholder: "Username" },
    password: { id: "meeting_pwd", type: "text", placeholder: "Password" },
    email: { id: "meeting_email", type: "text", placeholder: "Email" },
    customerKey: { id: "customer_key", type: "text", placeholder: "customer_key" },
    mediaVersion: { id: "mediasdk-version", type: "text", placeholder: "mediasdk version" },
    ZoomDevepCert: { id: "ZoomDevepCert", type: "text", placeholder: "ZoomDevepCert" },
    telemetryId: { id: "meeting-logid", type: "text", placeholder: "customerJoinId/logid" },
    recordingToken: { id: "recording-token", type: "text", placeholder: "recording token" },
    buildVersion: { id: "buildVersion", type: "text", placeholder: "Build Version" },
    accountTk: { id: "account_tk", type: "text", placeholder: "tk" },
    accountJmak: { id: "account_jmak", type: "text", placeholder: "events jmak" },
    meetingSignature: { id: "meeting-signature", type: "text", placeholder: "signature" },
    meetingZak: { id: "meeting-zak", type: "text", placeholder: "zak" },
    obfToken: { id: "obf-token", type: "text", placeholder: "obfToken" },
    childToken: { id: "child-token", type: "text", placeholder: "child token", maxLength: 800 },
  },
};

let devVersion = "4.0.0";
let nextVersion = "4.0.0";
let prodVersion = "3.13.2";

const checkVersionGreater = (version1: string, version2: string, isEq = false) => {
  const v1parts = version1.split(".");
  const v2parts = version2.split(".");

  for (let i = 0; i < v1parts.length; ++i) {
    if (v2parts.length === i) {
      return true;
    }

    if (v1parts[i] === v2parts[i]) {
      continue;
    }
    if (parseInt(v1parts[i]) > parseInt(v2parts[i])) {
      return true;
    }
    return false;
  }

  if (v1parts.length !== v2parts.length) {
    return false;
  }

  return isEq;
};

const fetchVersionOptions = async () => {
  try {
    let responseUrl = "https://websdk.zoomdev.us/version.json";
    if (!isLocalhost) {
      responseUrl = `${window.location.origin}/version.json`;
    }
    const response = await axios.get(responseUrl);
    // eslint-disable-next-line prefer-destructuring
    nextVersion = response.data.nextVersion;
    // eslint-disable-next-line prefer-destructuring
    devVersion = response.data.devVersion;
    // eslint-disable-next-line prefer-destructuring
    prodVersion = response.data.prodVersion;
    return response.data.version;
  } catch (error) {
    console.error("Error fetching version options:", error);
    return null;
  }
};

const parseZoomInviteLink = (
  link: string,
  setSdkKey: (sdkKey: string) => void,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
) => {
  try {
    const url = new URL(link);
    const meetingNumber = url.pathname.split("/").pop();
    const pwd = url.searchParams.get("pwd");

    // Set SDK key based on domain
    if (url.hostname.includes("zoom.us")) {
      setSdkKey("I9Rjx6qSz5dQTgukqbFQTj7t91dUnsB8TDCH");
      // Set web endpoint to zoom.us
      setFormData((prev) => ({
        ...prev,
        web: options.selects.web.options.find((opt) => opt.value === "zoom.us") || prev.web,
      }));
    } else if (url.hostname.includes("zoomdev.us")) {
      setSdkKey("oqiiUrVnrMycTLbC3cOmmTvQKkqsKvraeEY8");
      // Set web endpoint to zoomdev.us
      setFormData((prev) => ({
        ...prev,
        web: options.selects.web.options.find((opt) => opt.value === "zoomdev.us") || prev.web,
      }));
    }

    return { meetingNumber, pwd };
  } catch (error) {
    console.error("Invalid Zoom invite link:", error);
    return null;
  }
};

const fetchEventsVersions = async () => {
  try {
    let responseUrl = "https://websdk.zoomdev.us/events.json";
    if (!isLocalhost) {
      responseUrl = `${window.location.origin}/events.json`;
    }
    const response = await axios.get(responseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching events versions:", error);
    return null;
  }
};

const useFormData = (initialState: FormData, setSdkKey: (sdkKey: string) => void) => {
  const [formData, setFormData] = useState<FormData>({
    displayName: "",
    meetingNumber: "",
    password: "",
    email: "",
    sdkKey: "",
    sdkSecret: "",
    version: options.selects.version.options[0],
    role: options.selects.role.options[0],
    language: options.selects.language.options[0],
    web: options.selects.web.options[0],
    debug: options.selects.debug.options[0],
    customerKey: "",
    mediaVersion: "",
    telemetryId: uuidv7(),
    enforceWebRtcVideo: options.selects.enforceWebRtcVideo.options[0],
    enforceWebRtcAudio: options.selects.enforceWebRtcAudio.options[0],
    useVideoPlayer: options.selects.useVideoPlayer.options[0],
    geoRegions: [],
    account: options.selects.account.options[0],
    cdn: options.selects.cdn.options[0],
    corp: options.selects.corp.options[0],
    enforceGalleryView: options.selects.enforceGalleryView.options[0],
    enforceVirtualBackground: options.selects.enforceVirtualBackground.options[0],
    signatureToken: "",
    widget: options.selects.widget.options[0],
    china: options.selects.china.options[0],
    report: options.selects.report.options[0],
    waitingRoomPreview: options.selects.waitingRoomPreview.options[0],
    meetingPreview: options.selects.meetingPreview.options[0],
    hd: options.selects.hd.options[0],
    webcodecs: options.selects.webcodecs.options[0],
    sab: options.selects.sab.options[0],
    externalLink: options.selects.externalLink.options[0],
    iframeSize: options.selects.iframeSize.options[0],
    defaultView: options.selects.defaultView.options[0],
    shareAudio: options.selects.shareAudio.options[0],
    test: options.selects.test.options[0],
    customizeVB: options.selects.customizeVB.options[0],
    customizeJoin: options.selects.customizeJoin.options[0],
    pip: options.selects.pip.options[0],
    invitePhone: options.selects.invitePhone.options[0],
    enableMobileUI: options.selects.enableMobileUI.options[0],
    zoomLogo: options.selects.zoomLogo.options[0],
    leaveOnPageUnload: options.selects.leaveOnPageUnload.options[0],
    autoAdmit: options.selects.autoAdmit.options[0],
    customizedLeave: options.selects.customizedLeave.options[0],
    exitRoomCallback: options.selects.exitRoomCallback.options[0],
    leaveRedirect: options.selects.leaveRedirect.options[0],
    enforcePEPC: options.selects.enforcePEPC.options[0],
    recordingToken: "",
    buildVersion: "",
    accountTk: "",
    accountJmak: "",
    meetingSignature: "",
    meetingZak: "",
    obfToken: "",
    childToken: "",
    rwc: options.selects.rwc.options[0],
    build: "",
    selectedEvents: [],
  });
  const [errors, setErrors] = useState({
    displayName: "",
    meetingNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle Zoom invite link pasting
    if (name === "meetingNumber" && (value.includes("zoom.us/j/") || value.includes("zoomdev.us/j/"))) {
      const parsed = parseZoomInviteLink(value, setSdkKey, setFormData);
      if (parsed) {
        setFormData((prev) => ({
          ...prev,
          meetingNumber: parsed.meetingNumber || "",
          password: parsed.pwd || "",
        }));
        return;
      }
    }

    // Handle Zoom link with tk parameter
    if (name === "accountTk" && value.includes("tk=")) {
      try {
        const url = new URL(value);
        const tk = url.searchParams.get("tk");
        const pwd = url.searchParams.get("pwd");
        if (tk) {
          setFormData((prev) => ({
            ...prev,
            accountTk: tk,
            password: pwd || "",
          }));
          const parsed = parseZoomInviteLink(value, setSdkKey, setFormData);
          if (parsed) {
            setFormData((prev) => ({
              ...prev,
              meetingNumber: parsed.meetingNumber || "",
              password: parsed.pwd || "",
            }));
          }
          return;
        }
      } catch (error) {
        console.error("Invalid URL:", error);
      }
    }

    // Handle Zoom invite link pasting
    if (name === "meetingNumber" && (value.includes("zoom.us/j/") || value.includes("zoomdev.us/j/"))) {
      const parsed = parseZoomInviteLink(value, setSdkKey, setFormData);
      if (parsed) {
        setFormData((prev) => ({
          ...prev,
          meetingNumber: parsed.meetingNumber || "",
          password: parsed.pwd || "",
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "meetingSignature") {
      setFormData((prev) => ({ ...prev, signatureToken: "" }));
      const decode = decodeJWTPlayload(value);
      if (decode?.telemetry_tracking_id) {
        setFormData((prev) => ({ ...prev, telemetryId: decode.telemetry_tracking_id }));
      }
      if (decode?.app_key) {
        setSdkKey(decode.app_key);
      }

      if (decode?.tpc) {
        setFormData((prev) => ({ ...prev, meetingNumber: decode.tpc }));
      }
      if (decode?.role_type) {
        setFormData((prev) => ({ ...prev, role: decode.role_type }));
      }
    }
  };

  const handleSelectChange = (name: string, selectedOption: any) => {
    if (name === "geoRegions") {
      setFormData((prev) => ({ ...prev, geoRegions: selectedOption.map((option: any) => option.value) }));
    } else if (name === "account") {
      const [sdkKey, meetingNumber, email, password] = selectedOption.value.split("/");
      const findAccount = Object.values(allAccountConfigs).find((account) => account.sdkKey === sdkKey);
      if (findAccount) {
        setSdkKey(findAccount.sdkKey);
        const webValue = options.selects.web.options.find((opt) => opt.value === findAccount.webEndpoint);
        setFormData((prev) => ({ ...prev, account: selectedOption, web: webValue, meetingNumber, email, password }));
      } else {
        console.warn("can't find account sdkKey", sdkKey);
      }
    } else if (name === "version") {
      const widgetValue = checkVersionGreater(selectedOption.value, nextVersion)
        ? options.selects.widget.options.find((opt) => opt.value === "3")
        : options.selects.widget.options.find((opt) => opt.value === "0");

      const cdnValue =
        selectedOption.label?.includes("bcv") || checkVersionGreater(selectedOption.value, prodVersion)
          ? options.selects.cdn.options.find((opt) => opt.value === "websdk.zoomdev.us")
          : options.selects.cdn.options.find((opt) => opt.value === "source.zoom.us");

      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption,
        widget: widgetValue,
        cdn: cdnValue,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: selectedOption }));
    }
  };

  const setSelectedEvents = (events: { value: string; label: string }[]) => {
    setFormData((prev) => ({ ...prev, selectedEvents: events }));
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleInputChange,
    handleSelectChange,
    setSelectedEvents,
  };
};

const renderInputRow = (
  inputs: InputConfig[],
  formData: FormData,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
) => (
  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
    {inputs.map((input) => {
      const inputConfig = options.inputs[input.name];

      return (
        <div key={input.name} className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-secondary">
            {input.icon}
          </div>
          <input
            id={options.inputs[input.name].id}
            type="text"
            name={input.name}
            value={formData[input.name as keyof FormData] || ""}
            onChange={handleInputChange}
            className="pl-10 w-full px-3 py-2 border border-theme-border bg-theme-background text-theme-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-theme-border-hover"
            placeholder={input.placeholder}
            readOnly={input.readOnly}
          />
        </div>
      );
    })}
  </div>
);

const urlArgs: any = Object.fromEntries(new URLSearchParams(location.search));

const fetchAccountConfigs = async () => {
  try {
    const useObfuscatedAccountConfig =
      window.location.href.includes("indexObf.html") || window.location.pathname.includes("indexObf.html");
    const accountConfigFileName = useObfuscatedAccountConfig ? "accountObf.json" : "account.json";

    let responseUrl = `https://websdk.zoomdev.us/${accountConfigFileName}`;
    if (!isLocalhost) {
      responseUrl = `${window.location.origin}/${accountConfigFileName}`;
    }
    const response = await axios.get(responseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching account configs:", error);
    return null;
  }
};

const createHiddenForm = (formData: FormData) => {
  // Get all select IDs
  const selectIds = [
    {
      originalId: options.selects.account.id,
      mappedId: options.selects.account.id.replace("_value", ""),
    },
    {
      originalId: options.selects.geoRegions.id,
      mappedId: options.selects.geoRegions.id.replace("_value", ""),
    },
  ];

  const findSelectValue = (selectId: string) => {
    const selectKey = Object.keys(options.selects).find((key) => options.selects[key].id === selectId);
    if (selectKey === "geoRegions") {
      return formData.geoRegions.join(",");
    }
    return formData[selectKey as keyof FormData].value;
  };

  return (
    <form id="hidden-form" className="hidden">
      {/* Create hidden inputs for selects */}
      {selectIds.map(({ originalId, mappedId }) => (
        <input key={originalId} type="hidden" id={mappedId} name={mappedId} value={findSelectValue(originalId)} />
      ))}
    </form>
  );
};

const saveFormDataToLocalStorage = (formData: FormData) => {
  localStorage.setItem("displayName", formData.displayName);
  localStorage.setItem("meetingNumber", formData.meetingNumber);
  localStorage.setItem("password", formData.password);
  localStorage.setItem("web", formData.web.value);
};

export const NavVideoSDK = ({
  sdkKey,
  sdkSecret,
  setSdkKey,
}: {
  sdkKey: string;
  sdkSecret: string;
  setSdkKey: (sdkKey: string) => void;
}) => {
  const { formData, setFormData, errors, setErrors, handleInputChange, handleSelectChange, setSelectedEvents } =
    useFormData(
      {
        displayName: "",
        meetingNumber: "",
        password: "",
        email: "",
        sdkKey: "",
        sdkSecret: "",
        version: options.selects.version.options[0],
        role: options.selects.role.options[0],
        language: options.selects.language.options[0],
        web: options.selects.web.options[0],
        debug: options.selects.debug.options[0],
        customerKey: "",
        mediaVersion: "",
        telemetryId: uuidv7(),
        enforceWebRtcVideo: options.selects.enforceWebRtcVideo.options[0],
        enforceWebRtcAudio: options.selects.enforceWebRtcAudio.options[0],
        useVideoPlayer: options.selects.useVideoPlayer.options[0],
        geoRegions: [],
        account: options.selects.account.options[0],
        cdn: options.selects.cdn.options[0],
        corp: options.selects.corp.options[0],
        enforceGalleryView: options.selects.enforceGalleryView.options[0],
        enforceVirtualBackground: options.selects.enforceVirtualBackground.options[0],
        signatureToken: "",
        widget: options.selects.widget.options[0],
        china: options.selects.china.options[0],
        report: options.selects.report.options[0],
        waitingRoomPreview: options.selects.waitingRoomPreview.options[0],
        meetingPreview: options.selects.meetingPreview.options[0],
        hd: options.selects.hd.options[0],
        webcodecs: options.selects.webcodecs.options[0],
        sab: options.selects.sab.options[0],
        externalLink: options.selects.externalLink.options[0],
        iframeSize: options.selects.iframeSize.options[0],
        defaultView: options.selects.defaultView.options[0],
        shareAudio: options.selects.shareAudio.options[0],
        test: options.selects.test.options[0],
        customizeVB: options.selects.customizeVB.options[0],
        customizeJoin: options.selects.customizeJoin.options[0],
        pip: options.selects.pip.options[0],
        invitePhone: options.selects.invitePhone.options[0],
        enableMobileUI: options.selects.enableMobileUI.options[0],
        zoomLogo: options.selects.zoomLogo.options[0],
        leaveOnPageUnload: options.selects.leaveOnPageUnload.options[0],
        autoAdmit: options.selects.autoAdmit.options[0],
        customizedLeave: options.selects.customizedLeave.options[0],
        exitRoomCallback: options.selects.exitRoomCallback.options[0],
        leaveRedirect: options.selects.leaveRedirect.options[0],
        enforcePEPC: options.selects.enforcePEPC.options[0],
        recordingToken: "",
        buildVersion: "",
        accountTk: "",
        accountJmak: "",
        meetingSignature: "",
        meetingZak: "",
        obfToken: "",
        childToken: "",
        rwc: options.selects.rwc.options[0],
        build: "",
        selectedEvents: [],
      },
      setSdkKey,
    );

  const [accountConfigs, setAccountConfigs] = useState<any>(null);
  const [eventsVersions, setEventsVersions] = useState<any>(null);
  const [eventOptions, setEventOptions] = useState<any>([]);
  useEffect(() => {
    // Load saved data from localStorage
    const savedDisplayName = localStorage.getItem("displayName");
    const savedmeetingNumber = localStorage.getItem("meetingNumber");
    const savedPassword = localStorage.getItem("password");
    const savedWeb = localStorage.getItem("web");
    const savedLanguage = localStorage.getItem("client_view_lang");

    setTimeout(() => {
      if (savedWeb) {
        (document.getElementById(options.selects.web.id) as HTMLInputElement).value = savedWeb;
      }
    }, 500);

    setFormData((prev) => ({
      ...prev,
      displayName: savedDisplayName || getExploreName(),
      meetingNumber: savedmeetingNumber || "",
      password: savedPassword || "",
      web: options.selects.web.options.find((opt) => opt.value === savedWeb) || prev.web,
      language: savedLanguage
        ? options.selects.language.options.find((opt) => opt.value === savedLanguage) || prev.language
        : prev.language,
    }));
  }, [setFormData]);

  useEffect(() => {
    const loadAccountConfigs = async () => {
      const configs = await fetchAccountConfigs();
      if (configs) {
        allAccountConfigs = configs;

        options.selects.account.options = [{ value: "", label: "Search Account" }];
        Object.keys(configs).forEach((key) => {
          const label = `${key.replace("Config", "")}/${configs[key].meetingNumber}/${configs[key].topic}/${configs[key].env}`;
          if (configs[key].sdkKey) {
            options.selects.account.options.push({
              value: `${configs[key].sdkKey}/${configs[key].meetingNumber}/${configs[key].account}/${configs[key].passWord}`,
              label: label,
            });
          }
        });
        setAccountConfigs(configs);
      }
    };
    loadAccountConfigs();
  }, []);

  useEffect(() => {
    const loadEventsVersions = async () => {
      const data = await fetchEventsVersions();
      if (data) setEventsVersions(data);
    };
    loadEventsVersions();
  }, []);

  useEffect(() => {
    const loadVersionOptions = async () => {
      const versions = await fetchVersionOptions();
      if (versions) {
        options.selects.version.options = versions;
        const widgetValue = checkVersionGreater(versions[0].value, devVersion)
          ? options.selects.widget.options.find((opt) => opt.value === "3")
          : options.selects.widget.options.find((opt) => opt.value === "0");
        setFormData((prev) => ({
          ...prev,
          version: versions[0],
          widget: widgetValue,
        }));
      }
    };
    loadVersionOptions();
  }, [setFormData]);

  // Separate effect to handle version filtering based on events
  useEffect(() => {
    if (options.selects.version.options.length > 0 && eventsVersions) {
      // Get the appropriate events based on widget type
      let clientViewEvents = eventsVersions?.ClientView || {};
      if (formData.widget.value === "1" || formData.widget.value === "2") {
        clientViewEvents = eventsVersions?.ComponentView || {};
      } else if (formData.widget.value === "3" || formData.widget.value === "0") {
        clientViewEvents = eventsVersions?.ClientView || {};
      } else {
        clientViewEvents = {};
      }
      // Filter versions to only include those that have events
      const filteredEvents = Object.keys(clientViewEvents)
        .map((event) => {
          return checkVersionGreater(formData.version.value, clientViewEvents[event], true)
            ? {
                value: event,
                label: event,
              }
            : null;
        })
        .filter((e) => e !== null);

      console.log(filteredEvents);
      setEventOptions(filteredEvents.map((e) => ({ value: e.value, label: e.value })));
    }
  }, [formData.widget.value, eventsVersions, formData.version.value]);

  useEffect(() => {
    if (accountConfigs && formData.account.value !== "none") {
      const selectedConfig = accountConfigs[formData.account.value];
      if (selectedConfig) {
        setFormData((prev) => ({
          ...prev,
          sdkKey: selectedConfig.sdkKey,
          sdkSecret: selectedConfig.sdkSecret,
          web: options.selects.web.options.find((opt) => opt.value === selectedConfig.webEndpoint) || prev.web,
        }));
        setSdkKey(selectedConfig.sdkKey);
      }
    }
  }, [formData.account, accountConfigs, setSdkKey, setFormData]);

  useEffect(() => {
    if (sdkKey && sdkSecret) {
      setFormData((prev) => ({
        ...prev,
        account: { value: "", label: "You can't change account after setting sdkKey and sdkSecret" },
      }));
    } else {
      if (formData.account.value === "") {
        setFormData((prev) => ({
          ...prev,
          account: { value: "", label: "Search Account" },
        }));
      }
    }
  }, [sdkKey, sdkSecret, formData.account.value, setFormData]);

  // Event listener select state and handlers (moved to top-level to fix hook error)
  const eventListenerRef = React.useRef<EventListenerSelectRef>(null);
  const handleEventsChange = React.useCallback((eventsString: string) => {
    // No-op or use for side effects only
  }, []);

  const renderOptionRow = (optionKeys: string[]) => {
    return (
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4 text-theme-text">
        {optionKeys.map((key) => {
          if (key === "geoRegions") {
            return (
              <Select
                key={key}
                id={options.selects[key].id}
                options={options.selects[key].options}
                value={formData.geoRegions.map((region) =>
                  options.selects[key].options.find((option) => option.value === region),
                )}
                defaultValue={[]}
                onChange={(selectedOption) => handleSelectChange(key, selectedOption)}
                className="react-select-container flex-1"
                classNamePrefix="react-select uikit-custom-scrollbar"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                isMulti={true}
                styles={getReactSelectTheme()}
              />
            );
          }
          if (key === "account" || key === "version") {
            return (
              <Select
                key={key}
                id={options.selects[key].id}
                options={options.selects[key].options}
                value={formData[key as keyof typeof formData]}
                defaultValue={options.selects[key].options[0]}
                onChange={(selectedOption) => handleSelectChange(key, selectedOption)}
                className="react-select-container flex-1"
                classNamePrefix="react-select uikit-custom-scrollbar"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                isDisabled={(!!sdkKey && !!sdkSecret) || !!formData.meetingSignature}
                styles={getReactSelectTheme()}
              />
            );
          }
          return (
            <select
              key={key}
              id={options.selects[key].id.replace("_value", "")}
              className="react-select-container flex-1 w-full p-2 border border-theme-border bg-theme-background text-theme-text rounded-md hover:border-theme-border-hover focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData[key as keyof typeof formData]?.value || ""}
              onChange={(e) => {
                if (key === "language") {
                  localStorage.setItem("client_view_lang", e.target.value);
                }
                setFormData((prev) => ({
                  ...prev,
                  [key]: { value: e.target.value, label: "" },
                }));
              }}
              title={options.selects[key]?.tooltip || ""}
            >
              {options.selects[key].options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        })}
      </div>
    );
  };

  const emptySdkKey = formData.account.value === "" && sdkKey === "";
  const disableClick = !formData.displayName.trim() || !formData.meetingNumber.trim() || emptySdkKey;
  let disableTitle = "";

  // Case 1: All fields empty
  if (!formData.displayName.trim() && !formData.meetingNumber.trim() && emptySdkKey) {
    disableTitle = "Please enter a meetingNumber and your name and select an account";
  }
  // Case 2: Only name missing
  else if (!formData.displayName.trim() && formData.meetingNumber.trim() && !emptySdkKey) {
    disableTitle = "Please enter your name";
  }
  // Case 3: Only meetingNumber missing
  else if (formData.displayName.trim() && !formData.meetingNumber.trim() && !emptySdkKey) {
    disableTitle = "Please enter a meetingNumber";
  }
  // Case 4: Only account missing
  else if (formData.displayName.trim() && formData.meetingNumber.trim() && emptySdkKey) {
    disableTitle = "Please select an account";
  }
  // Case 5: Name and meetingNumber missing
  else if (!formData.displayName.trim() && !formData.meetingNumber.trim() && !emptySdkKey) {
    disableTitle = "Please enter a meetingNumber and your name";
  }
  // Case 6: Name and account missing
  else if (!formData.displayName.trim() && formData.meetingNumber.trim() && emptySdkKey) {
    disableTitle = "Please enter your name and select an account";
  }
  // Case 7: meetingNumber and account missing
  else if (formData.displayName.trim() && !formData.meetingNumber.trim() && emptySdkKey) {
    disableTitle = "Please enter a meetingNumber and select an account";
  }
  // When version changes, update selectedEvents if needed
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedEvents: eventOptions,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.version.value, formData.widget.value, eventOptions]);

  return (
    <div className="pt-1 pb-6 max-w-4xl mx-auto my-1 px-6 bg-theme-surface rounded-2xl shadow-lg uikit-custom-scrollbar overflow-y-auto max-h-[calc(100vh-5rem)] sm:h-auto relative z-10 border border-theme-border">
      {/* Add the hidden form */}
      {createHiddenForm(formData)}

      <p className="text-xl font-semibold text-theme-text mb-6">
        Meeting Args
        {disableTitle && <span className="text-red-500 text-sm mb-4 ml-2">{disableTitle}</span>}
      </p>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-secondary" size={18} />
            <input
              type="text"
              name="meetingNumber"
              id={options.inputs.meetingNumber.id}
              value={formData.meetingNumber}
              onChange={handleInputChange}
              className={`pl-10 w-full px-3 py-2 border ${
                errors.meetingNumber ? "border-red-500" : "border-theme-border"
              } bg-theme-background text-theme-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-theme-border-hover`}
              placeholder="Meeting Number or Past link"
            />
            {errors.meetingNumber && <p className="text-red-500 text-sm mt-1">{errors.meetingNumber}</p>}
          </div>

          <div className="relative flex-1">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-secondary" size={18} />
            <input
              type="text"
              name="displayName"
              id={options.inputs.displayName.id}
              value={formData.displayName}
              onChange={handleInputChange}
              className={`pl-10 w-full px-3 py-2 border ${
                errors.displayName ? "border-red-500" : "border-theme-border"
              } bg-theme-background text-theme-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-theme-border-hover`}
              placeholder="Your Name"
            />
            {errors.displayName && <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>}
          </div>

          <div className="relative flex-1">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-secondary" size={18} />
            <input
              type="text"
              name="password"
              value={formData.password}
              id={options.inputs.password.id}
              onChange={handleInputChange}
              className="pl-10 w-full px-3 py-2 border border-theme-border bg-theme-background text-theme-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-theme-border-hover"
              placeholder="Meeting Password"
            />
          </div>
        </div>

        {/* Select Options */}

        {renderOptionRow(["role", "language", "web"])}
        {renderOptionRow(["account", "version", "widget"])}
        {renderOptionRow(["cdn", "corp", "build"])}
        {/* {renderOptionRow(["enforceGalleryView", "enforceVirtualBackground"])} */}
        {renderOptionRow(["hd", "enforcePEPC", "enforceWebRtcVideo"])}
        {renderInputRow(
          [
            { name: "customerKey", placeholder: options.inputs.customerKey.placeholder, icon: <Text size={18} /> },
            { name: "mediaVersion", placeholder: options.inputs.mediaVersion.placeholder, icon: <Text size={18} /> },
            { name: "email", placeholder: options.inputs.email.placeholder, icon: <Text size={18} /> },
          ],
          formData,
          handleInputChange,
        )}
        {renderOptionRow(["debug", "rwc", "china"])}
        {renderOptionRow(["report", "waitingRoomPreview", "meetingPreview"])}

        {/* Authentication Inputs */}

        <ClickButton
          formData={formData}
          setFormData={setFormData}
          setErrors={setErrors}
          sdkKey={sdkKey}
          sdkSecret={sdkSecret}
          disableClick={disableClick}
          disableTitle={disableTitle}
          saveFormDataToLocalStorage={saveFormDataToLocalStorage}
        />
        {renderOptionRow(["externalLink", "iframeSize", "defaultView"])}
        {renderOptionRow(["shareAudio", "test", "customizeVB"])}
        {renderOptionRow(["customizeJoin", "pip", "invitePhone"])}
        {renderOptionRow(["enableMobileUI", "zoomLogo", "leaveOnPageUnload"])}
        {renderOptionRow(["autoAdmit", "customizedLeave"])}
        {renderOptionRow(["exitRoomCallback", "leaveRedirect"])}

        {renderInputRow(
          [
            { name: "telemetryId", placeholder: options.inputs.telemetryId.placeholder, icon: <Text size={18} /> },
            { name: "ZoomDevepCert", placeholder: options.inputs.ZoomDevepCert.placeholder, icon: <Text size={18} /> },
          ],
          formData,
          handleInputChange,
        )}

        {renderInputRow(
          [
            {
              name: "recordingToken",
              placeholder: options.inputs.recordingToken.placeholder,
              icon: <Text size={18} />,
            },
            { name: "buildVersion", placeholder: options.inputs.buildVersion.placeholder, icon: <Text size={18} /> },
          ],
          formData,
          handleInputChange,
        )}

        {renderInputRow(
          [
            { name: "accountTk", placeholder: options.inputs.accountTk.placeholder, icon: <Text size={18} /> },
            { name: "accountJmak", placeholder: options.inputs.accountJmak.placeholder, icon: <Text size={18} /> },
          ],
          formData,
          handleInputChange,
        )}

        {renderInputRow(
          [
            {
              name: "meetingSignature",
              placeholder: options.inputs.meetingSignature.placeholder,
              icon: <Text size={18} />,
            },
            {
              name: "meetingZak",
              placeholder: options.inputs.meetingZak.placeholder,
              icon: <Text size={18} />,
            },
            {
              name: "obfToken",
              placeholder: options.inputs.obfToken.placeholder,
              icon: <Text size={18} />,
            },
          ],
          formData,
          handleInputChange,
        )}

        {renderInputRow(
          [
            {
              name: "childToken",
              placeholder: options.inputs.childToken.placeholder,
              icon: <Key size={18} />,
            },
          ],
          formData,
          handleInputChange,
        )}

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="relative">
              <textarea
                id="signatureToken"
                value={formData.signatureToken}
                onChange={() => {}}
                className="w-full p-2 border border-theme-border bg-theme-background text-theme-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
              {formData.signatureToken && (
                <button
                  onClick={async () => {
                    if (formData.signatureToken) {
                      await navigator.clipboard.writeText(formData.signatureToken);
                      const button = document.querySelector("#copyButton");
                      if (button) {
                        button.classList.add("copied");
                        setTimeout(() => {
                          button.classList.remove("copied");
                        }, 1500);
                      }
                    }
                  }}
                  id="copyButton"
                  className="absolute right-2 top-2 p-2 text-theme-text-secondary hover:text-theme-text-button hover:bg-blue-500 
                           bg-theme-background rounded-md transition-all duration-200 ease-in-out
                           disabled:opacity-50 disabled:cursor-not-allowed
                           before:content-['Copied!'] before:absolute before:top-[-25px] before:right-0
                           before:bg-gray-800 before:text-theme-text-button before:px-2 before:py-1 before:rounded
                           before:text-sm before:opacity-0 before:transition-opacity before:duration-200
                           copied:before:opacity-100"
                  disabled={!formData.signatureToken}
                  title={formData.signatureToken ? "Copy to clipboard" : "Nothing to copy"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-200 group-hover:scale-110"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Event listener select UI */}
        {eventOptions.length > 0 && (
          <EventListenerSelect
            ref={eventListenerRef}
            eventOptions={eventOptions}
            selectedEvents={formData.selectedEvents}
            setSelectedEvents={setSelectedEvents}
            onEventsChange={handleEventsChange}
            apiLink={[
              {
                text: "ClientView Events API",
                link: "https://marketplacefront.zoom.us/sdk/meeting/web/functions/ZoomMtg.inMeetingServiceListener.html",
              },
              {
                text: "ComponentView Events API",
                link: "https://marketplacefront.zoom.us/sdk/meeting/web/components/functions/EmbeddedClient.on.html",
              },
              {
                text: "events.json",
                link: "https://websdk.zoomdev.us/events.json",
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default NavVideoSDK;
