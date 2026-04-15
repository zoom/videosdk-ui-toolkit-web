export const resourceLinks = {
  text: "Debug Resources",
  url: "#",
  title: "Debug Resources",
  subMenu: [
    {
      text: "LinkTrace",
      url: "https://linktrace.zoom.us/",
      title: "LinkTrace",
    },
    {
      text: "LinkTrace Dev",
      url: "https://linktrace.zoomdev.us/",
      title: "LinkTrace Dev",
    },
    {
      text: "DevOps(DEV)",
      url: "https://devop.zoomdev.us:8443/login",
      title: "DevOps Login",
    },
    {
      text: "Monitor Log(55VPN)",
      url: "https://happywork.zoomdev.us:8100/",
      title: "add many test attendee",
    },
    {
      text: "Monitor Log Doc",
      url: "https://zoomvideo.atlassian.net/wiki/spaces/PWA/pages/646715056/Monitor+Log+Descriptions",
      title: "Monitor Log",
    },
    {
      text: "Audio/Video Debug",
      url: "https://zoomvideo.atlassian.net/wiki/spaces/PWA/pages/2621873045/Poor+Audio+Video+Quality+Troubleshooting",
      title: "audio video troubleshooting",
    },
  ],
};

export const meetingToolLinks = {
  text: "Tool",
  url: "#",
  title: "tools",
  subMenu: [
    { text: "Join Tool(MeetingSDK)", url: "http://10.100.124.88:8000/", title: "MeetingSDK tool" },
    { text: "RestAPI tool(MeetingSDK)", url: "https://websdk.zoomdev.us/restapi/", title: "MeetingSDK restapi tool" },
    {
      text: "Monitor join feedback",
      url: "https://docs.zoom.us/doc/rXYuaM5wSgqcmpPLSLm1Pg",
      title: "Monitor Log",
    },
    { text: "Webhook", url: "https://docs.zoom.us/doc/1MKE12vOQGCIqj8qRJ6Pgg", title: "webhook" },
    { text: "OBFToken test", url: "https://websdk.zoomdev.us/indexObf.html", title: "OBFToken test" },
    { text: "OBFToken test case", url: "https://docs.zoom.us/doc/5vtq-xatR4WlCcm9me_-6w", title: "OBFToken Case" },
    { text: "opFlag", url: "https://videosdk.zoomdev.us/zwatools/opflag.html", title: "Media ABOption config" },
    {
      text: "L10n(i18n)",
      url: "https://l10n.zoom.us/",
      title: "L10n(i18n)",
    },
    { text: "RestAPI Developer", url: "https://developers.zoom.us/docs/api/", title: "RestAPI Developer Document" },
    {
      text: "open API owner",
      url: "https://docs.google.com/spreadsheets/d/10X0rpEzuzihCkIzhGb3msBb0CrN_XV_qNDH9VDOVXhQ/edit?gid=0#gid=0",
      title: "open API owner",
    },
    {
      text: "Native Client switch",
      url: "https://zoomvideo.atlassian.net/wiki/spaces/LYNX/pages/2953774275/Client",
      title: "Client ERD",
    },
    {
      text: "SIP/H323 Phone for Testing",
      url: "https://zoomvideo.atlassian.net/wiki/spaces/ZTP/pages/84353098/Configure+a+SIP+Phone+for+Testing",
      title: "SIP Phone for Testing",
    },
    {
      text: "ERD Generate",
      url: "https://websdk.zoomdev.us/erd/meetingsdk.html",
      title: "MeetingSDK/VideoSDK/UIKit ERD Generate",
    },
  ],
};

export const videoToolLinks = meetingToolLinks;

export const zfgLinks = {
  text: "marketplace",
  url: "#",
  title: "marketplace",
  subMenu: [
    {
      text: "Marketplace APP approve",
      url: "https://docs.zoom.us/doc/VytULjCnQw2BhGbmffefBg",
      title: "Marketplace APP approve",
    },
    { text: "dev marketplace", url: "https://devmp.zoomdev.us/", title: "dev marketplace" },
    { text: "devep marketplace", url: "https://devepmp.zoomdev.us/", title: "devep marketplace" },
    { text: "prod marketplace", url: "https://marketplace.zoom.us/", title: "prod marketplace" },
    { text: "zfg marketplace", url: "https://marketplace.zoomgov.com/", title: "zfg marketplace" },
    { text: "zfg marketplace dev", url: "https://marketplace.zoomgovdev.com/", title: "zfg marketplace dev" },
    { text: "mil marketplace", url: "https://marketplace.zoomgov.mil/", title: "mil marketplace" },
    { text: "mil marketplace dev", url: "https://marketplace.zoommildev.com/", title: "mil marketplace dev" },
    { text: "zfg meetingsdk", url: "https://websdk.zoomdev.us/zfg/", title: "zfg meetingsdk marketplace download" },
    { text: "zfg videosdk", url: "https://videosdk.zoomdev.us/zfg/", title: "zfg videosdk marketplace download" },
    {
      text: "LifeCycle",
      url: "https://support.zoom.com/hc/zh/article?id=zm_kb&sysparm_article=KB0061142",
      title: "Zoom Quarterly Lifecycle",
    },
    { text: "Release Owner", url: "https://docs.zoom.us/doc/QE1gy0orRxKlhHY45An9NA", title: "Release rotation" },
  ],
};

export const AILinks = {
  text: "AI Tools",
  url: "#",
  title: "AI Tools",
  subMenu: [
    { text: "AI Helper", url: "https://devhelper.zoomdev.us/", title: "AI Helper" },
    { text: "Fusion Demo", url: "https://agent.zoomdev.us/fusion/?tab=demos", title: "Fusion Demo" },
    { text: "Superpowers", url: "https://github.com/obra/superpowers", title: "Superpowers" },
    { text: "Gstack", url: "https://github.com/garrytan/gstack", title: "Gstack" },
    { text: "zoom-skill", url: "https://github.com/zoom/skills", title: "zoom/skills" },
    {
      text: "zoom-videosdk-skills",
      url: "https://github.com/zoom/zoom-videosdk-skills",
      title: "zoom-videosdk-skills",
    },
  ],
};
