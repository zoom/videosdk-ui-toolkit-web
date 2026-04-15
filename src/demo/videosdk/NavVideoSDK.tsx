import React, { useState, useEffect, version } from "react";
import Select from "react-select";
import { User, Video, Lock, Mail, Key, Settings, Logs, Text } from "lucide-react";
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
        { value: "0", label: "Attendee" },
        { value: "1", label: "Host" },
        { value: "9", label: "no role type" },
      ],
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
        { value: "go.zoom.us", label: "go" },
        { value: "intuitive.zoomdev.us", label: "dev intuitive" },
        { value: "dev.zoomdev.us", label: "devMaster" },
        { value: "zoomdev.us", label: "dev" },
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
        { value: "2.3.5", label: "2.3.5(Nov)" },
        { value: "2.3.12", label: "2.3.12(Dec)" },
        { value: "2.4.0", label: "2.4.0(Jan)" },
        { value: "2.3.0", label: "2.3.0(Oct)" },
        { value: "2.2.12", label: "2.2.12(Sept)" },
        { value: "2.2.10", label: "2.2.10(August)" },
        { value: "2.2.5", label: "2.2.5(July)" },
        { value: "2.2.0", label: "2.2.0(May)" },
        { value: "2.1.10", label: "2.1.10(Mar)" },
        { value: "2.1.5", label: "2.1.5(Jan)" },
        { value: "2.1.0", label: "2.1.0(Dec)" },
        { value: "1.12.18", label: "1.12.18(Sept)" },
        { value: "1.12.17", label: "1.12.17(May)" },
        { value: "1.12.16", label: "1.12.16(Apr)" },
        { value: "1.12.15", label: "1.12.15(Apr)" },
        { value: "1.12.14", label: "1.12.14(Dec)" },
        { value: "1.12.12", label: "1.12.12(Nov)" },
        { value: "1.12.10", label: "1.12.10(Sept)" },
        { value: "1.12.5", label: "1.12.5(Sept)" },
        { value: "1.12.1", label: "1.12.1(August)" },
        { value: "1.12.0", label: "1.12.0(July)" },
        { value: "1.11.10", label: "1.11.10(June)" },
        { value: "1.11.6", label: "1.11.6(May Hotfix)" },
        { value: "1.11.5", label: "1.11.5(May)" },
        { value: "1.11.0", label: "1.11.0(April)" },
        { value: "1.10.11", label: "1.10.11" },
        { value: "1.10.10", label: "1.10.10" },
        { value: "1.10.9", label: "1.10.9" },
        { value: "1.10.8", label: "1.10.8" },
      ],
    },
    cloudRecordingOption: {
      id: "cloud_recording_option",
      options: [
        { value: "0", label: "Cloud Recording: False" },
        { value: "1", label: "Cloud Recording: True" },
      ],
    },
    cloudRecordingElection: {
      id: "cloud_recording_election",
      options: [
        { value: "0", label: "Cloud Recording Election: False" },
        { value: "1", label: "Cloud Recording Election: True" },
      ],
    },
    cdn: {
      id: "meeting_cdn",
      options: [
        isLocalhost
          ? { value: "videosdk.zoomdev.us", label: "videosdk.zoomdev.us" }
          : { value: window.location.host, label: window.location.host },
        { value: "source.zoom.us", label: "default" },
        { value: "source.zoomgovdev.com", label: "source.zoomgovdev.com" },
        { value: "source.zoomgov.com", label: "source.zoomgov.com" },
        { value: "source.zoommildev.com", label: "source.zoommildev.com(VPN)" },
        { value: "source.zoomgov.mil", label: "source.zoomgov.mil(VPN)" },
      ],
    },
    corp: {
      id: "meeting-corp",
      options: [
        { value: "0", label: "NO-SAB:disableCORP" },
        { value: "1", label: "SAB:require-corp" },
        { value: "2", label: "SAB:credentialless" },
      ],
    },
    enforceGalleryView: {
      id: "enforceGalleryView",
      options: [
        { value: "0", label: "Enforce Gallery View: False" },
        { value: "1", label: "Enforce Gallery View: True" },
      ],
    },
    enforceVirtualBackground: {
      id: "enforceVB",
      options: [
        { value: "1", label: "Enforce Virtual Background: True" },
        { value: "0", label: "Enforce Virtual Background: False" },
      ],
    },
    uiKit: {
      id: "meeting-ui",
      options: [
        { value: "2", label: "UIKit: True" },
        { value: "0", label: "UIKit: False" },
        // { value: "1", label: "UIKit(Angular)" },
      ],
    },
    rc: {
      id: "rc",
      options: [
        { value: "1", label: "Remote Control: True" },
        { value: "0", label: "Remote Control: False" },
      ],
    },
    autoTranscription: {
      id: "auto_transcription",
      options: [
        { value: "1", label: "Meeting Query: True" },
        { value: "0", label: "Meeting Query: False" },
      ],
    },
    enforceWebRtcAudio: {
      id: "enforceAB",
      options: [
        { value: "1", label: "Enforce WebRTC Audio: True" },
        { value: "0", label: "Enforce WebRTC Audio: False" },
      ],
    },
    enforcePEPC: {
      id: "enforcePEPC",
      title:
        "UIKit PEPC(Page Embedded Permission Control - Cam/Mic/Geolocation) https://developer.chrome.com/origintrials/#/trials/active ",
      options: [
        { value: "1", label: "Enforce PEPC: True" },
        { value: "0", label: "Enforce PEPC: False" },
      ],
    },
    enforceWebRtcVideo: {
      id: "enforceWebRtcVideo",
      options: [
        { value: "1", label: "Enforce WebRTC Video: True" },
        { value: "0", label: "Enforce WebRTC Video: False" },
      ],
    },
    useVideoPlayer: {
      id: "useVideoPlayer",
      options: [
        { value: "1", label: "VideoPlayer: True" },
        { value: "0", label: "VideoPlayer: False" },
      ],
    },
    preview: {
      id: "uikit_preview",
      options: [
        { value: "1", label: "Preview: True" },
        { value: "0", label: "Preview: False" },
      ],
    },
    debug: {
      id: "uikit_debug",
      options: [
        { value: "1", label: "Debug: True" },
        { value: "0", label: "Debug: False" },
      ],
    },
    customizeLayout: {
      id: "uikit_customizeLayout",
      options: [
        { value: "0", label: "Customize Layout: False" },
        { value: "1", label: "Customize Layout: True" },
      ],
    },
    header: {
      id: "uikit_header",
      options: [
        { value: "1", label: "Header: True" },
        { value: "0", label: "Header: False" },
      ],
    },
    footer: {
      id: "uikit_footer",
      options: [
        { value: "1", label: "Footer: True" },
        { value: "0", label: "Footer: False" },
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
  },
  inputs: {
    topic: { id: "meeting_topic", type: "text", placeholder: "Topic" },
    displayName: { id: "meeting_username", type: "text", placeholder: "Username" },
    channelId: { id: "channel_id", type: "text", placeholder: "Channel ID" },
    password: { id: "meeting_pwd", type: "text", placeholder: "Password" },
    sessionKey: { id: "session_key", type: "text", placeholder: "session_key" },
    customerKey: { id: "user_identity", type: "text", placeholder: "user_identity" },
    mediaVersion: { id: "mediasdk-version", type: "text", placeholder: "mediasdk version" },
    zlkJwtToken: { id: "zlkJwtToken", type: "text", placeholder: "zlkJwtToken" },
    ZoomDevepCert: { id: "ZoomDevepCert", type: "text", placeholder: "ZoomDevepCert" },
    telemetryId: { id: "meeting-logid", type: "text", placeholder: "customerJoinId/logid" },
  },
  iframeSize: {
    id: "iframe_size",
    options: [
      { value: "VGA", label: "640*480" },
      { value: "SMALL", label: "500*281" },
      { value: "HVGA", label: "480*320" },
      { value: "WQVGA", label: "360*240" },
      { value: "FWQVGA", label: "432*240" },
      { value: "SVGA", label: "800*600" },
      { value: "XGA", label: "1024*768" },
    ],
  },
};

const fetchVersionOptions = async () => {
  try {
    let responseUrl = "https://videosdk.zoomdev.us/version.json";
    if (!isLocalhost) {
      responseUrl = `${window.location.origin}/version.json`;
    }
    const response = await axios.get(responseUrl);
    return response.data.version;
  } catch (error) {
    console.error("Error fetching version options:", error);
    return null;
  }
};

const fetchEventsVersions = async () => {
  try {
    let responseUrl = "https://videosdk.zoomdev.us/events.json";
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

const useFormData = (initialState: FormData, setSdkKey: (sdkKey: string) => void) => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState({
    displayName: "",
    topic: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "zlkJwtToken") {
      setFormData((prev) => ({ ...prev, signatureToken: "" }));
      const decode = decodeJWTPlayload(value);
      if (decode?.telemetry_tracking_id) {
        setFormData((prev) => ({ ...prev, telemetryId: decode.telemetry_tracking_id }));
      }
      if (decode?.app_key) {
        setSdkKey(decode.app_key);
      }

      if (decode?.tpc) {
        setFormData((prev) => ({ ...prev, topic: decode.tpc }));
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
      const findAccount = Object.values(allAccountConfigs).find((account) => account.sdkKey === selectedOption.value);
      setSdkKey(findAccount.sdkKey);
      const webValue = options.selects.web.options.find((opt) => opt.value === findAccount.webEndpoint);
      setFormData((prev) => ({ ...prev, account: selectedOption, web: webValue }));
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
    let responseUrl = "https://videosdk.zoomdev.us/accountsdk.json";
    if (!isLocalhost && urlArgs?.nav !== "1") {
      responseUrl = `${window.location.origin}/accountsdk.json`;
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
  localStorage.setItem("topic", formData.topic);
  localStorage.setItem("password", formData.password);
  localStorage.setItem("web", formData.web.value);
  // localStorage.setItem("uiKit", formData.uiKit.value);
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
        topic: "",
        password: "",
        channelId: "",
        sdkKey: "",
        sdkSecret: "",
        version: options.selects.version.options[0],
        role: options.selects.role.options[0],
        language: options.selects.language.options[0],
        web: options.selects.web.options[0],
        debug: options.selects.debug.options[0],
        uiKit: options.selects.uiKit.options[0],
        customerKey: "",
        sessionKey: "",
        mediaVersion: "",
        zlkJwtToken: "",
        telemetryId: uuidv7(),
        enforceWebRtcVideo: options.selects.enforceWebRtcVideo.options[0],
        enforceWebRtcAudio: options.selects.enforceWebRtcAudio.options[0],
        useVideoPlayer: options.selects.useVideoPlayer.options[0],
        rc: options.selects.rc.options[0],
        autoTranscription: options.selects.autoTranscription.options[0].value,
        geoRegions: [],
        cloudRecordingOption: options.selects.cloudRecordingOption.options[0],
        cloudRecordingElection: options.selects.cloudRecordingElection.options[0],
        enforcePEPC: options.selects.enforcePEPC.options[0],
        account: options.selects.account.options[0],
        preview: options.selects.preview.options[0],
        cdn: options.selects.cdn.options[0],
        corp: options.selects.corp.options[0],
        enforceGalleryView: options.selects.enforceGalleryView.options[0],
        enforceVirtualBackground: options.selects.enforceVirtualBackground.options[0],
        signatureToken: "",
        customizeLayout: options.selects.customizeLayout.options[0],
        header: options.selects.header.options[0],
        footer: options.selects.footer.options[0],
        iframeSize: options.iframeSize.options[0],
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
    const savedTopic = localStorage.getItem("topic");
    const savedPassword = localStorage.getItem("password");
    const savedWeb = localStorage.getItem("web");
    // const savedUiKit = localStorage.getItem("uiKit");

    setTimeout(() => {
      if (savedWeb) {
        (document.getElementById(options.selects.web.id) as HTMLInputElement).value = savedWeb;
      }
      // if (savedUiKit) {
      //   (document.getElementById(options.selects.uiKit.id) as HTMLInputElement).value = savedUiKit;
      // }
    }, 500);

    // Check URL parameter for uiKit (case-insensitive check)
    // eslint-disable-next-line prefer-destructuring
    let uiKitOption = options.selects.uiKit.options[0]; // Default to UIKit(New)
    if (urlArgs.uikit === "0" || urlArgs.uiKit === "0") {
      uiKitOption = options.selects.uiKit.options.find((opt) => opt.value === "0") || uiKitOption;
    }

    setFormData((prev) => ({
      ...prev,
      displayName: savedDisplayName || getExploreName(),
      topic: savedTopic || "",
      password: savedPassword || "",
      web: options.selects.web.options.find((opt) => opt.value === savedWeb) || prev.web,
      uiKit: uiKitOption,
      // uiKit: savedUiKit || options.selects.uiKit.options[0],
    }));
  }, [setFormData]);

  useEffect(() => {
    const loadAccountConfigs = async () => {
      const configs = await fetchAccountConfigs();
      if (configs) {
        allAccountConfigs = configs;

        options.selects.account.options = [{ value: "", label: "Search Account" }];
        Object.keys(configs).forEach((key) => {
          const label = `${key.replace("Config", "")}/${configs[key].account}/${configs[key].env}`;
          if (configs[key].sdkKey) {
            options.selects.account.options.push({ value: configs[key].sdkKey, label: label });
          }
        });
        setAccountConfigs(configs);
      }
    };
    loadAccountConfigs();
  }, []);

  useEffect(() => {
    if (formData.uiKit.value === "0") {
      setFormData((prev) => ({
        ...prev,
        telemetryId: uuidv7(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        telemetryId: "uikit-" + uuidv7().slice(6),
      }));
    }
  }, [formData.uiKit, setFormData]);

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

  useEffect(() => {
    const loadVersionOptions = async () => {
      const versions = await fetchVersionOptions();

      if (versions) {
        // Filter versions based on UIKit selection
        let filteredVersions = versions;
        if (formData.uiKit.value === "2") {
          // Only show versions > 2.0.0 when UIKit is enabled (value="2")
          filteredVersions = versions.filter((version: any) => {
            return checkVersionGreater(version.value, "2.0.0");
          });
        }

        options.selects.version.options = filteredVersions;
        setFormData((prev) => ({
          ...prev,
          version: filteredVersions[0],
        }));
      }
    };
    loadVersionOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFormData]);

  useEffect(() => {
    const loadEventsVersions = async () => {
      const data = await fetchEventsVersions();
      if (data) setEventsVersions(data);
    };
    loadEventsVersions();
  }, []);

  // Effect to handle version filtering based on events
  useEffect(() => {
    if (options.selects.version.options.length > 0 && eventsVersions) {
      // Filter versions to only include those that have events
      let filteredEvents = [];
      if (formData.uiKit.value === "0") {
        filteredEvents = eventsVersions.videosdk;
      } else {
        filteredEvents = { ...eventsVersions.uikit, ...eventsVersions.videosdk };
      }
      const filteredEventsList = Object.keys(filteredEvents)
        .map((event) => {
          return checkVersionGreater(formData.version.value, filteredEvents[event], true)
            ? {
                value: event,
                label: event,
              }
            : null;
        })
        .filter((e) => e !== null);
      setEventOptions(filteredEventsList.map((e) => ({ value: e.value, label: e.value })));
    }
  }, [formData.version.value, eventsVersions, formData.uiKit]);

  // When version changes, update selectedEvents if needed
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedEvents: eventOptions,
    }));
  }, [formData.version.value, formData.uiKit.value, setFormData, eventOptions]);

  // Event listener select state and handlers
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
          if (key === "account") {
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
                isDisabled={(!!sdkKey && !!sdkSecret) || !!formData.zlkJwtToken}
                styles={getReactSelectTheme()}
              />
            );
          }
          if (key === "iframeSize") {
            return (
              <select
                key={key}
                id={options.iframeSize.id}
                className="react-select-container flex-1 w-full p-2 border border-theme-border bg-theme-background text-theme-text rounded-md hover:border-theme-border-hover focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData[key as keyof typeof formData]?.value || ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    [key]: { value: e.target.value, label: e.target.value },
                  }));
                }}
              >
                {options.iframeSize.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          }

          return (
            <select
              key={key}
              id={options.selects[key].id.replace("_value", "")}
              title={options.selects[key]?.title || ""}
              className="react-select-container flex-1 w-full p-2 border border-theme-border bg-theme-background text-theme-text rounded-md hover:border-theme-border-hover focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData[key as keyof typeof formData]?.value || ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [key]: { value: e.target.value, label: e.target.value },
                }));
              }}
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
  const disableClick = !formData.displayName.trim() || !formData.topic.trim() || emptySdkKey;
  let disableTitle = "";

  // Case 1: All fields empty
  if (!formData.displayName.trim() && !formData.topic.trim() && emptySdkKey) {
    disableTitle = "Please enter a topic and your name and select an account";
  }
  // Case 2: Only name missing
  else if (!formData.displayName.trim() && formData.topic.trim() && !emptySdkKey) {
    disableTitle = "Please enter your name";
  }
  // Case 3: Only topic missing
  else if (formData.displayName.trim() && !formData.topic.trim() && !emptySdkKey) {
    disableTitle = "Please enter a topic";
  }
  // Case 4: Only account missing
  else if (formData.displayName.trim() && formData.topic.trim() && emptySdkKey) {
    disableTitle = "Please select an account";
  }
  // Case 5: Name and topic missing
  else if (!formData.displayName.trim() && !formData.topic.trim() && !emptySdkKey) {
    disableTitle = "Please enter a topic and your name";
  }
  // Case 6: Name and account missing
  else if (!formData.displayName.trim() && formData.topic.trim() && emptySdkKey) {
    disableTitle = "Please enter your name and select an account";
  }
  // Case 7: Topic and account missing
  else if (formData.displayName.trim() && !formData.topic.trim() && emptySdkKey) {
    disableTitle = "Please enter a topic and select an account";
  }

  return (
    <div className="pt-1 pb-6 max-w-4xl mx-auto my-1 px-6 bg-theme-surface rounded-2xl shadow-lg uikit-custom-scrollbar overflow-y-auto max-h-[calc(100vh-5rem)] sm:h-auto border border-theme-border">
      {/* Add the hidden form */}
      {createHiddenForm(formData)}

      <p className="text-xl font-semibold text-theme-text mb-6">
        Session Args
        {disableTitle && <span className="text-red-500 text-sm mb-4 ml-2">{disableTitle}</span>}
      </p>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-secondary" size={18} />
            <input
              type="text"
              name="topic"
              id={options.inputs.topic.id}
              value={formData.topic}
              onChange={handleInputChange}
              className={`pl-10 w-full px-3 py-2 border ${
                errors.topic ? "border-red-500" : "border-theme-border"
              } bg-theme-background text-theme-text rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-theme-border-hover`}
              placeholder="Session Topic"
            />
            {errors.topic && <p className="text-red-500 text-sm mt-1">{errors.topic}</p>}
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
              placeholder="Session Password"
            />
          </div>
        </div>

        {/* Select Options */}

        {renderOptionRow(["role", "language", "web"])}
        {renderOptionRow(["account", "version"])}
        {renderOptionRow(["cloudRecordingOption", "cloudRecordingElection", "cdn"])}
        {renderOptionRow(["corp", "enforceGalleryView", "enforceVirtualBackground"])}
        {renderOptionRow(["uiKit", "rc", "autoTranscription"])}
        {renderOptionRow(["enforceWebRtcAudio", "enforceWebRtcVideo", "useVideoPlayer"])}
        {renderOptionRow(["preview", "geoRegions", "debug"])}
        {/* Authentication Inputs */}
        {renderInputRow(
          [
            { name: "sessionKey", placeholder: options.inputs.sessionKey.placeholder, icon: <Text size={18} /> },
            { name: "customerKey", placeholder: options.inputs.customerKey.placeholder, icon: <Text size={18} /> },
            { name: "mediaVersion", placeholder: options.inputs.mediaVersion.placeholder, icon: <Text size={18} /> },
          ],
          formData,
          handleInputChange,
        )}

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
        {renderOptionRow(["customizeLayout", "header", "footer"])}
        {renderOptionRow(["iframeSize", "enforcePEPC"])}

        {renderInputRow(
          [
            { name: "zlkJwtToken", placeholder: options.inputs.zlkJwtToken.placeholder, icon: <Text size={18} /> },
            { name: "telemetryId", placeholder: options.inputs.telemetryId.placeholder, icon: <Text size={18} /> },
          ],
          formData,
          handleInputChange,
        )}

        {renderInputRow(
          [
            { name: "ZoomDevepCert", placeholder: options.inputs.ZoomDevepCert.placeholder, icon: <Text size={18} /> },
            {
              name: "channelId",
              placeholder: options.inputs.channelId.placeholder,
              icon: <Text size={18} />,
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
                text: "VideoSDK Events API",
                link: "https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#on",
              },
              {
                text: "UIKit Events API",
                link: "https://marketplacefront.zoom.us/sdk/uitoolkit/web/interfaces/UIToolkit.html#on",
              },
              {
                text: "events.json",
                link: "https://videosdk.zoomdev.us/events.json",
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default NavVideoSDK;
