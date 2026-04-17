(function () {
  const logger = {
    info: (message, ...args) => {
      console.log(`%c[INFO] %c${message}`, "color: #007AFF; font-weight: bold;", "color: inherit;", ...args);
    },
    event: (message, ...args) => {
      console.log(
        `%c[eventListener] %c${message}`,
        "color:rgb(255, 179, 0); font-weight: bold;",
        "color: inherit;",
        ...args,
      );
    },
    warn: (message, ...args) => {
      console.warn(`%c[WARN] %c${message}`, "color: #FF9500; font-weight: bold;", "color: inherit;", ...args);
    },
    error: (message, ...args) => {
      console.error(`%c[ERROR] %c${message}`, "color: #FF3B30; font-weight: bold;", "color: inherit;", ...args);
    },
    success: (message, ...args) => {
      console.log(`%c[SUCCESS] %c${message}`, "color: #34C759; font-weight: bold;", "color: inherit;", ...args);
    },
    json: (label, data) => {
      console.log(`%c[JSON] %c${label}`, "color: #5856D6; font-weight: bold;", "color: inherit;");
      try {
        console.log(JSON.stringify(data, null, 2));
      } catch (e) {
        console.log(data);
      }
    },
  };
  window.socketDebug = true;
  var testTool = window.testTool;
  var tmpArgs = testTool.parseQuery();
  window.isZoomDevEnv = true;
  const exampleMetaTags = [
    {
      "http-equiv": "origin-trial",
      content:
        "AkDBFR3IGFFbXopB0e/7AZHFGAxGs36SjLwcFo+FzPWGYAWm86NNP3nriR7yd0VpFktGvgq2CT+DwWuUZafoPgoAAABoeyJvcmlnaW4iOiJodHRwczovL3pvb21kZXYudXM6NDQzIiwiZmVhdHVyZSI6IlBlcm1pc3Npb25FbGVtZW50IiwiZXhwaXJ5IjoxNzcxODkxMjAwLCJpc1N1YmRvbWFpbiI6dHJ1ZX0=",
    }, // zoomdev.us PEPC(Page Embedded Permission Control - Cam/Mic/Geolocation)
    {
      "http-equiv": "origin-trial",
      content:
        "A+RMjfSbMNCa7MJl5ucFwulBzJYYCcEHkRi2t4NHpdyuZPaUKLZsN2OB0swr5Tc3Y21e1LdDIisN4aFpMAZcmH8AAABoeyJvcmlnaW4iOiJodHRwczovL3pvb21kZXYudXM6NDQzIiwiZmVhdHVyZSI6IlBlcm1pc3Npb25FbGVtZW50IiwiZXhwaXJ5IjoxNzY0MzcwNzA5LCJpc1N1YmRvbWFpbiI6dHJ1ZX0=",
    }, // zoomdev.us PEPC(Page Embedded Permission Control - Cam/Mic/Geolocation) edge
  ];
  var meetConfig = {
    apiKey: tmpArgs.apiKey,
    apiSecret: tmpArgs.apiSecret || "",
    sdkKey: tmpArgs.sdkKey,
    sdkSecret: tmpArgs.sdkSecret || "",
    meetingNumber: tmpArgs.meetingNumber,
    version: testTool.extractVersion(window.location.pathname) || tmpArgs.version,
    customizeJoin: tmpArgs.customizeJoin === "1",
    enablePEPC: tmpArgs.pepc === "1",
    userName: (function () {
      if (tmpArgs.name) {
        try {
          return testTool.b64DecodeUnicode(tmpArgs.name);
        } catch (e) {
          return tmpArgs.name;
        }
      }
      return tmpArgs.version + testTool.detectOS() + testTool.getBrowserInfo()[0].split(".")[0].replace("/", "_");
    })(),
    passWord: (function () {
      if (tmpArgs.password) {
        if (tmpArgs.pwdDecode) {
          return tmpArgs.password;
        } else {
          try {
            return testTool.b64DecodeUnicode(tmpArgs.password);
          } catch (e) {
            return tmpArgs.password;
          }
        }
      }
      return "";
    })(),
    leaveUrl: tmpArgs.leaveUrl ? decodeURIComponent(tmpArgs.leaveUrl) : "/index.html",
    role: parseInt(tmpArgs.role, 10),
    webEndpoint: tmpArgs.web,
    userEmail: (function () {
      try {
        if (tmpArgs.email) return testTool.b64DecodeUnicode(tmpArgs.email);
        else return testTool.generateEmail();
      } catch (e) {
        if (tmpArgs.email) {
          return tmpArgs.email;
        }
        return testTool.generateEmail();
      }
    })(),
    lang: tmpArgs.lang,
    signature: tmpArgs.signature || "",
    china: tmpArgs.china === "1",
    buildVersion: tmpArgs.buildVersion,
    prod: tmpArgs.prod === "source.zoom.us",
    cdn: tmpArgs.prod,
    tk: tmpArgs.tk || "",
    customerKey: tmpArgs.customerKey || "",
    corp: tmpArgs.corp === "1",
    isSupportSimulive: tmpArgs.simulive === "1",
    rwc: tmpArgs.rwc || "",
    debug: tmpArgs.debug === "1",
    sab: tmpArgs.sab === "1",
    preview: tmpArgs.preview || "",
    waitingRoomPreview: tmpArgs.waitingRoomPreview === "1",
    webcodecs: tmpArgs.webcodecs === "1",
    widget: tmpArgs.widget,
    simd: tmpArgs.simd === "1",
    zak: tmpArgs.zak,
    obfToken: tmpArgs.obfToken,
    enableHD: tmpArgs.hd === "1",
    externalLinkPage: tmpArgs.externalLinkPage === "1",
    jmak: "",
    defaultView: tmpArgs.defaultView,
    customerJoinId: tmpArgs.customerJoinId || crypto.randomUUID(),
    hideShareAudioOption: tmpArgs.hideShareAudioOption === "1",
    isShowReport: tmpArgs.isShowReport === "1",
    recordingToken: tmpArgs.recordingToken,
    vb: tmpArgs.vb === "1",
    disablePictureInPicture: tmpArgs.enablePip === "0",
    disableZoomPhone: tmpArgs.enablePhone === "0",
    leaveOnPageUnload: tmpArgs.leaveOnPageUnload === "1",
    autoAdmit: tmpArgs.autoAdmit === "1",
    exitRoomCallback: tmpArgs.exitRoomCallback === "1",
    customizeLeaveBtn: tmpArgs.customizeLeaveBtn === "1",
    leaveRedirect: tmpArgs.leaveRedirect === "1",
    disableZoomLogo: tmpArgs.enableZoomLogo === "0",
    childToken: tmpArgs.childToken,
    enforceWebRtcVideo: tmpArgs.enforceWebRtcVideo || "",
    listenEvents: tmpArgs?.eventListeners ? atob(tmpArgs.eventListeners).split(",") : [],
  };
  console.log("meetConfig====>", meetConfig);
  if (meetConfig.enablePEPC) {
    testTool.injectHeadElements(exampleMetaTags);
  }
  function createFooterLeaveDropdown() {
    if (document.getElementById("host-controls")) {
      return;
    }
    const hostControls = document.createElement("div");
    hostControls.id = "host-controls";
    hostControls.className = "dropdown-host";

    const leaveButton = document.createElement("button");
    leaveButton.id = "host-move-patient-and-leave";
    leaveButton.className =
      "dropbtn show-host-controls zmu-btn footer__leave-btn ax-outline ellipsis zmu-btn--danger zmu-btn__outline--blue";
    leaveButton.addEventListener("click", function () {
      ZoomMtg.getAttendeeslist({
        success: function (e) {
          const othersAttendee = e.result.attendeesList.filter(function (item) {
            return !item.isHost;
          });
          console.log(othersAttendee);
          othersAttendee.forEach(function (otherAttendee) {
            ZoomMtg.putOnHold({
              userId: otherAttendee.userId,
              hold: true,
            });
          });

          ZoomMtg.leaveMeeting({});
        },
      });
    });
    leaveButton.textContent = "Leave meeting customized";

    const zoomLeaveBtn = document.getElementsByClassName("footer__leave-btn")[0];
    if (zoomLeaveBtn) {
      zoomLeaveBtn.style.display = "none";
    }
    const wcFooter = document.getElementsByClassName("footer__leave-btn-container")[0];
    console.log(wcFooter);

    if (wcFooter && !document.getElementById("host-controls")) {
      hostControls.prepend(leaveButton);
      wcFooter.prepend(hostControls);
    }
  }

  function callSideBarUpdate() {
    const intervalContent = setInterval(() => {
      ZoomMtg.getCurrentUser({
        success: function (tmpResult) {
          const currentUser = tmpResult.result.currentUser;
          if (currentUser.isHost || currentUser.isCoHost) {
            createFooterLeaveDropdown();
          }
        },
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(intervalContent);
    }, 5000);
  }

  var vbList = [
    {
      id: "jackyang",
      displayName: "JackYang",
      fileName: "JackYang.png",
      url: "https://websdk.zoomdev.us/image/vb/JackYang.png",
    },
    {
      id: "Zoom photo Logo",
      displayName: "Zoom photo Logo",
      fileName: "Zoom photo Logo.png",
      url: "https://websdk.zoomdev.us/image/vb/Zoom photo Logo.png",
    },
    {
      id: "Zoom_2022-Hispanic-Heritage-Month_VB",
      displayName: "Zoom_2022-Hispanic-Heritage-Month_VB",
      fileName: "Zoom_2022-Hispanic-Heritage-Month_VB.png",
      url: "https://websdk.zoomdev.us/image/vb/Zoom_2022-Hispanic-Heritage-Month_VB.png",
    },
    {
      id: "Zoom Beach Holiday",
      displayName: "Zoom Beach Holiday",
      fileName: "Zoom Beach Holiday.jpg",
      url: "https://websdk.zoomdev.us/image/vb/Zoom Beach Holiday.jpg",
    },
    {
      id: "Zoom-care",
      displayName: "Zoom-care",
      fileName: "Zoom-care.jpg",
      url: "https://websdk.zoomdev.us/image/vb/Zoom-care.jpg",
    },
    {
      id: "Zoom-Rebrand_VB_w_label_Option1",
      displayName: "Zoom-Rebrand_VB_w_label_Option1",
      fileName: "Zoom-Rebrand_VB_w_label_Option1.jpg",
      url: "https://websdk.zoomdev.us/image/vb/Zoom-Rebrand_VB_w_label_Option1.jpg",
    },
    {
      id: "Zoom Holiday",
      displayName: "Zoom Holiday",
      fileName: "Zoom Holiday.jpg",
      url: "https://websdk.zoomdev.us/image/vb/Zoom Holiday.jpg",
    },
    {
      id: "Zoom-Rebrand_VB_w_label_Option2",
      displayName: "Zoom-Rebrand_VB_w_label_Option2",
      fileName: "Zoom-Rebrand_VB_w_label_Option2.jpg",
      url: "https://websdk.zoomdev.us/image/vb/Zoom-Rebrand_VB_w_label_Option2.jpg",
    },
    {
      id: "Zoom_Ukraine",
      displayName: "Zoom_Ukraine",
      fileName: "Zoom_Ukraine.jpg",
      url: "https://websdk.zoomdev.us/image/vb/Zoom_Ukraine.jpg",
    },
    {
      id: "Zoom-Rebrand_VB_w_label_Option3",
      displayName: "Zoom-Rebrand_VB_w_label_Option3",
      fileName: "Zoom-Rebrand_VB_w_label_Option3.jpg",
      url: "https://websdk.zoomdev.us/image/vb/Zoom-Rebrand_VB_w_label_Option3.jpg",
    },
  ];
  // for websdk ta
  var TAvbList = [
    {
      id: "wcta2",
      displayName: "wcta2",
      fileName: "wcta2",
      url: "https://websdk.zoomdev.us/image/vb/wcta2.jpg",
    },
    {
      id: "wcta3",
      displayName: "wcta3",
      fileName: "wcta3",
      url: "https://websdk.zoomdev.us/image/vb/wcta3.jpg",
    },
    {
      id: "woox.jpg",
      displayName: "woox",
      fileName: "woox",
      url: "https://websdk.zoomdev.us/image/vb/woox.jpg",
    },
  ];
  if (tmpArgs.isShowReport) window.isShowZmReport = true;

  if (tmpArgs.jmak) {
    var tmpJson = JSON.parse(testTool.b64DecodeUnicode(tmpArgs.jmak));
    meetConfig.jmak = tmpJson.jmak || "";
    meetConfig.signature = tmpJson.signature || "";
    meetConfig.meetingNumber = tmpJson.meetingNumber || "";
    meetConfig.passWord = tmpJson.passWord || "";
    meetConfig.apiKey = tmpJson.apiKey || "";
    console.log("event Json", tmpJson);
    // meetConfig.userEmail = 'devajackyang@gmail.com';
  }
  var zoomloginData = sessionStorage.getItem("zoomloginData");

  if (meetConfig.rwc) {
    sessionStorage.setItem("websdkRwcDomain", meetConfig.rwc);
  }
  var isIpadOS = function () {
    return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
  };
  function appendChild(parrent, child) {
    if (typeof parrent.append === "function") {
      parrent.append(child);
    } else {
      parrent.appendChild(child);
    }
  }
  if (testTool.isMobileDevice() || isIpadOS()) {
    vConsole = new VConsole();
  } else {
    console.log("checkSystemRequirements");
    //console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));
  }

  var beginJoin = null;
  var version = meetConfig.version;

  function receiveMessage(event) {
    if (event.data.hasOwnProperty("source") && event.data.source.indexOf("react-devtools") > -1) return;
    // console.log("websdk recieve", event);
  }
  window.addEventListener("message", receiveMessage, false);
  // component view start
  if (meetConfig.widget === "1" || meetConfig.widget === "2") {
    var embeddedUrl = "https://" + meetConfig.cdn + "/" + version + "/zoom-meeting-embedded-" + version + ".min.js";

    if (meetConfig.widget === "2") {
      embeddedUrl = "/" + version + "/widget.js";
    }
    console.log(embeddedUrl);
    testTool.loadScript(embeddedUrl, function () {
      var rootElement = document.getElementById("widgetApp");
      document.getElementById("testQos").classList.add("hidden");
      document.getElementById("testQosCancel").classList.add("hidden");

      var ZoomMtgEmbedded;
      if (meetConfig.widget === "2") {
        window.ZoomMtgEmbedded = ReactWidgets;
        ZoomMtgEmbedded = ReactWidgets;
      } else {
        ZoomMtgEmbedded = window.ZoomMtgEmbedded;
      }
      if (!ZoomMtgEmbedded) {
        console.log("IE not support widget");
        return;
      }

      var client = ZoomMtgEmbedded.createClient();

      beginJoin = function (signature) {
        client
          .init({
            debug: meetConfig.debug,
            zoomAppRoot: rootElement,
            assetPath: meetConfig.prod ? "Global" : "https://" + meetConfig.cdn + "/" + version + "/lib/av",
            webEndpoint: meetConfig.webEndpoint,
            language: meetConfig.lang,
            isShowJoiningErrorDialog: false,
            leaveOnPageUnload: meetConfig.leaveOnPageUnload,
            customize: {
              meetingInfo: ["topic", "host", "mn", "pwd", "telPwd", "invite", "participant", "dc", "enctype"],
              // inviteUrlFormat: 'https://yourdomain/j/{0}?pwd={1}',
              toolbar: {
                buttons: [
                  {
                    text: "CustomizeButton",
                    className: "CustomizeButton",
                    onClick: function () {
                      console.log("click Customer Button");
                    },
                  },
                ],
              },
              video: {
                defaultViewType: meetConfig.defaultView,
              },
              sharing: {
                options: {
                  hideShareAudioOption: meetConfig.hideShareAudioOption,
                },
              },
              preview: {
                enable: meetConfig.preview,
              },
            },
          })
          .then(function (e) {
            console.log("success", e);
          })
          .catch(function (e) {
            console.log("error", e);
          });

        client
          .join({
            //apiKey: meetConfig.apiKey,
            sdkKey: meetConfig.sdkKey,
            signature: signature,
            meetingNumber: meetConfig.meetingNumber,
            userName: meetConfig.userName,
            password: meetConfig.passWord,
            userEmail: meetConfig.userEmail,
            tk: meetConfig.tk,
            zak: meetConfig.zak,
            obfToken: meetConfig.obfToken,
            customerKey: meetConfig.customerKey,
            // customerJoinId: meetConfig.customerJoinId
            recordingToken: meetConfig.recordingToken,
            jack: "dd",
          })
          .then(function (e) {
            window.zmClientWidget = client;
            if (meetConfig.vb) zmClientWidget.updateVirtualBackgroundList(vbList);
            var joinBtn = document.getElementById("userButtonJoin");
            var leaveBtn = document.getElementById("userButtonLeave");
            var clickFullUI = document.getElementById("useFullUI");
            var clickComponent = document.getElementById("useComponent");
            // var clickComponentDev = document.getElementById("useComponentDev");
            var backHome = document.getElementById("backHome");
            var resetPosition = document.getElementById("resetPosition");
            var userLeftTop = document.getElementById("userLeftTop");
            var userRightTop = document.getElementById("userRightTop");
            var userCenter = document.getElementById("userCenter");
            var userLeftBottom = document.getElementById("userLeftBottom");
            var userRightBottom = document.getElementById("userRightBottom");

            joinBtn.addEventListener("click", function () {
              console.log("meetConfig.customerKey====>", meetConfig.customerKey);
              client
                .join({
                  sdkKey: meetConfig.sdkKey,
                  signature: signature,
                  meetingNumber: meetConfig.meetingNumber,
                  userName: meetConfig.userName,
                  password: meetConfig.passWord,
                  userEmail: meetConfig.userEmail,
                  customerKey: meetConfig.customerKey,
                  obfToken: meetConfig.obfToken,
                })
                .then(function (e) {});
            });

            leaveBtn.addEventListener("click", function () {
              client.leaveMeeting().then(function (e) {});
            });

            clickFullUI.addEventListener("click", function () {
              window.location.href = window.location.href
                .replace("widget=1", "widget=0")
                .replace("widget=2", "widget=0");
            });

            clickComponent.addEventListener("click", function () {
              window.location.href = window.location.href
                .replace("widget=0", "widget=1")
                .replace("widget=2", "widget=1");
            });

            // clickComponentDev.addEventListener("click", function () {
            //   window.location.href = window.location.href
            //     .replace("widget=0", "widget=2")
            //     .replace("widget=1", "widget=2");
            // });
            backHome.addEventListener("click", function () {
              window.location.href = "/";
            });

            if (meetConfig.debug) {
              for (const event of meetConfig.listenEvents) {
                if (event) logger.success(`listenEvent: ${event}`);
                if (event === "join-speed") {
                  client.on("join-speed", (data) => {
                    console.log("join-speed", data);
                    const speedData = {
                      tag: data.eventType,
                      level: data.tagId,
                      text: data.desc,
                      time: data.time,
                      timeStr: data.timeStr,
                    };
                    testTool.setJoinTime(data);

                    let tmpCheckJoin = true;
                    [
                      testTool.joinSpeedTag.userAudioDecodeSuccess,
                      testTool.joinSpeedTag.userVideoDecodeSuccess,
                      testTool.joinSpeedTag.userAudioEncodeSuccess,
                      testTool.joinSpeedTag.userVideoEncodeSuccess,
                      testTool.joinSpeedTag.userStartJoinAudio,
                      testTool.joinSpeedTag.userJoinAudioSuccess,
                      testTool.joinSpeedTag.userStartJoinVideo,
                      testTool.joinSpeedTag.userJoinVideoSuccess,
                    ].forEach((item) => {
                      if (!testTool.joinSpeed[item].time) {
                        tmpCheckJoin = tmpCheckJoin & false;
                      }
                    });
                    if (tmpCheckJoin) {
                      if (!testTool.joinSpeed[testTool.joinSpeedTag.userAudioVideoSuccess].time) {
                        testTool.setJoinTimeOld(testTool.joinSpeedTag.userAudioVideoSuccess);
                        console.log("onJoinSpeed user audio and video on(join finish)", data);
                        window.testTool.printJoinTime();
                      }
                    }
                  });
                } else if (event) {
                  client.on(event, (data) => {
                    logger.event(`${event}`, data);
                  });
                }
              }
            }
          })
          .catch(function (e) {
            console.log("error", e);
          });

        // client.renderUnifiedView(rootElement);

        // client.joinMeeting(meetConfig.apiKey, signature, meetConfig.meetingNumber, meetConfig.passWord, meetConfig.userName, meetConfig.userEmail, 'https://websdk.zoomdev.us/2.1.0/lib/core', meetConfig.webEndpoint, meetConfig.lang);
      };

      if (!meetConfig.signature) {
        axios({
          method: "get",
          responseType: "json",
          url:
            "/jwt/websdk.php?sdkKey=" +
            meetConfig.sdkKey +
            "&sdksecret=" +
            meetConfig.sdkSecret +
            "&role=" +
            meetConfig.role +
            "&mn=" +
            meetConfig.meetingNumber +
            "&enforceWebRtcVideo=" +
            meetConfig.enforceWebRtcVideo,
        }).then(function (response) {
          var res = response.data;
          meetConfig.geo = res.ip;
          meetConfig.signature = res.signature;

          if (res.signature === "" || !res.signature) {
            console.log("cant's get signature", res.signature);
            return;
          }
          beginJoin(res.signature);
        });
      } else {
        beginJoin(res.signature);
      }

      var tmpjsMediaRoot = document.getElementsByTagName("body")[0];
      tmpjsMedia = document.createElement("div");
      tmpjsMedia.id = "jsmediaversion";
      setTimeout(function () {
        tmpjsMedia.textContent = "jsmedia" + JsMediaSDK_Instance.version;
        appendChild(tmpjsMediaRoot, tmpjsMedia);
      }, 5000);
    });
  }

  //component view end

  // client view start
  if (meetConfig.widget === "0" || meetConfig.widget === "3") {
    // testTool.loadCSS("/" + meetConfig.version + "/css/bootstrap.css");
    // testTool.loadCSS("/" + meetConfig.version + "/css/react-select.css");
    var clientViewUrl = "https://" + meetConfig.cdn + "/" + version + "/zoom-meeting-" + version + ".min.js";

    if (meetConfig.widget === "3") {
      //testTool.loadCSS("/" + meetConfig.version + "/webclient/ui/zoom-meetingsdk.css");
      clientViewUrl = "https://" + meetConfig.cdn + "/" + version + "/webclient/zoom-meeting-" + version + ".min.js";
    }

    testTool.loadScript(clientViewUrl, function () {
      console.log(clientViewUrl);
      // console.log('checkFeatureRequirements====>');
      // android error JS media instance not defined, if use it here
      // console.log(JSON.stringify(ZoomMtg.checkFeatureRequirements()));

      beginJoin = function (signature) {
        // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
        // test auto update mediasdk
        if (meetConfig.widget === "3") {
          ZoomMtg.setZoomJSLib("https://" + meetConfig.cdn + "/" + meetConfig.version + "/webclient/lib", "/av");
        } else {
          ZoomMtg.setZoomJSLib("https://" + meetConfig.cdn + "/" + meetConfig.version + "/lib", "/av");
        }
        // prod
        // ZoomMtg.setZoomJSLib(
        //   'https://source.zoom.us/3.8.0/lib',
        //   '/av',
        // );

        //   ZoomMtg.setZoomJSLib(
        //     "https://" + meetConfig.cdn + "/" + meetConfig.version + "/lib",
        //     "/av"
        //   );
        ZoomMtg.preLoadWasm();
        // test auto update mediasdk
        ZoomMtg.prepareWebSDK();
        // ZoomMtg.prepareWebSDKUseAutoPatchJsMedia(otArray);
        if (meetConfig.lang === "dev") {
          ZoomMtg.i18n.load("dev", "./cn-en-jp.json");
        }
        window.qosTest = {
          tmpAudoData: {},
          tmpVideoData: {},
          tmpSharingData: {
            latency: 0,
            jitter: 0,
            avg_loss: 0,
            resolution: 0,
            fps: 0,
            encoding: false,
            timestamp: 0,
          },
          qosMid: "",
          qosMyZoomid: "",
          qosTestid: "",
        };

        console.log("websdk: start join", new Date().toLocaleString());
        console.log("debug: ", meetConfig.debug);
        if (meetConfig.preview === "2") {
          function setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
            let expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
          }
          localStorage.setItem("isFirstVisit", "false");
          setCookie("zm_previewVal", "7", 90);
        }
        ZoomMtg.i18n.load(meetConfig.lang).then((res) => {
          console.log("load lang success", res);

          ZoomMtg.init({
            //manualRwc: meetConfig.rwc,
            defaultView: meetConfig.defaultView,
            hideShareAudioOption: meetConfig.hideShareAudioOption,
            debug: meetConfig.debug,
            patchJsMedia: false,
            leaveUrl: meetConfig.leaveRedirect ? meetConfig.leaveUrl : "",
            // leaveUrl: "about:blank",
            webEndpoint: meetConfig.webEndpoint,
            // inviteUrlFormat: 'https://yourdomain/j/{0}?pwd={1}',
            disablePreview: meetConfig.preview !== "0",
            enableWaitingRoomPreview: meetConfig.waitingRoomPreview,
            disableCORP: !window.crossOriginIsolated || false,
            //isShowJoiningErrorDialog: true,
            enableHD: meetConfig.enableHD,
            enableCustomizeJoin: meetConfig.customizeJoin,
            disableZoomPhone: meetConfig.disableZoomPhone,
            disablePictureInPicture: meetConfig.disablePictureInPicture,
            leaveOnPageUnload: meetConfig.leaveOnPageUnload,
            //enableFullHD: meetConfig.enableHD,
            // isSupportSharing: false,
            disableZoomLogo: meetConfig.disableZoomLogo,
            leaveRedirect: meetConfig.leaveRedirect,
            externalLinkPage: meetConfig.externalLinkPage ? "/externalLinkPage.html" : "",
            // disableCORP: !meetConfig.corp,
            //isSupportSimulive: meetConfig.isSupportSimulive,
            onRetryCallback: function (mids) {
              console.log("onRetryCallback", mids);
            },
            onInviteSearchZoomPhoneCallback: function (e) {
              var searchResult = [
                {
                  firstName: "honeybeeyyh",
                  lastName: "dev1",
                  displayName: "honeybeeyyh dev1",
                  snsEmail: "honeybeeyyh+dev1@gmail.com",
                  pbx: { dn: ["+12095805810"], ext: 800 },
                  isSameAccount: true,
                },
                {
                  firstName: "jackyang",
                  lastName: "cci",
                  displayName: "jackyang cci",
                  snsEmail: "jack.yang+us01.admin1@test.zoom.us",
                  pbx: { dn: ["+12093404200"], ext: 1960 },
                  isSameAccount: false,
                },
                {
                  firstName: "nemoling",
                  lastName: "cci",
                  displayName: "nemoling cci",
                  snsEmail: "nemo.ling+123@test.zoom.us",
                  pbx: { dn: ["+12094187914"], ext: 802 },
                  isSameAccount: false,
                },
                {
                  firstName: "yanhong",
                  lastName: "cci",
                  displayName: "yanhong cci",
                  snsEmail: "yanhong.xu+QA+meeting+sdk_acc1@grr.la",
                  pbx: { dn: ["+12095122663"], ext: 800 },
                  isSameAccount: false,
                },
              ];
              console.log("e===>, onInviteSearchZoomPhoneCallback", e, searchResult);
              var tmpSearchResult = searchResult.filter((item) => JSON.stringify(item).indexOf(e.key) > 1);
              tmpSearchResult.push({
                firstName: "emergency phone",
                lastName: "test",
                displayName: "emergency zoom phone for test",
                snsEmail: "emergency@zoom.us",
                pbx: { dn: ["933"], ext: 800 },
                isSameAccount: false,
              });
              return Promise.resolve(tmpSearchResult);
            },
            success: function () {
              console.log(meetConfig);
              console.log("signature", signature);
              console.log("join email", meetConfig.userEmail);
              console.log("meetConfig.customerKey====>", meetConfig.customerKey);
              var tmpJoinArgs = {
                meetingNumber: meetConfig.meetingNumber,
                userName: meetConfig.userName,
                signature: signature,
                //apiKey: meetConfig.apiKey,
                sdkKey: meetConfig.sdkKey,
                userEmail: meetConfig.userEmail,
                passWord: meetConfig.passWord,
                customerKey: meetConfig.customerKey,
                participantId: meetConfig.customerKey.substring(0, 36),
                tk: meetConfig.tk,
                zak: meetConfig.zak,
                obfToken: meetConfig.obfToken,
                jmak: meetConfig.jmak,
                customerJoinId: tmpArgs.customerJoinId,
                recordingToken: meetConfig.recordingToken,
                childToken: meetConfig.childToken,
                success: function (res) {
                  // test auto update mediasdk
                  // move to join success load mediasdk file
                  // ZoomMtg.prepareWebSDK(otArray);

                  if (meetConfig.vb)
                    // ZoomMtg.updateVirtualBackgroundList({ vbList: vbList });
                    ZoomMtg.updateVirtualBackgroundList({ vbList: TAvbList });
                  console.log("websdk: call join success", new Date().toLocaleString());
                  console.log("join meeting success");
                  console.log("get attendeelist");
                  if (meetConfig.customizeLeaveBtn) {
                    callSideBarUpdate();
                  }
                  // ZoomMtg.getAttendeeslist({
                  //   success: function (e) {
                  //     console.log(e);
                  //   },
                  // });
                  // ZoomMtg.getCurrentUser({
                  //   success: function (e) {
                  //     console.log(e);
                  //   },
                  // });

                  ZoomMtg.getAttendeeslist({});
                  ZoomMtg.getCurrentUser({
                    success: function (res) {
                      console.log("success getCurrentUser", res.result.currentUser.userId);
                      var wasmVersion = ZoomMtg.getWebSDKVersion()[2] || "";
                      var tmpName =
                        testTool.detectOS() +
                        "#" +
                        testTool.getBrowserInfo() +
                        "#" +
                        res.result.currentUser.userId +
                        "#" +
                        wasmVersion;
                      if (!meetConfig.geo.isLocal) {
                        tmpName =
                          tmpName +
                          "#" +
                          meetConfig.geo.ip +
                          "#" +
                          meetConfig.geo.city +
                          "/" +
                          meetConfig.geo.country_code;
                      }
                      console.log({
                        userId: res.result.currentUser.userId,
                        oldName: res.result.currentUser.userName,
                        newName: tmpName,
                      });
                      // ZoomMtg.rename({
                      //     userId: res.result.currentUser.userId,
                      //     oldName: res.result.currentUser.userName,
                      //     newName: tmpName
                      // });
                    },
                  });

                  ZoomMtg.setLogLevel("info");

                  // network
                  ZoomMtg.inMeetingServiceListener("onNetworkQualityChange", function (data) {
                    console.log("inMeetingServiceListener onNetworkQualityChange", data);
                  });

                  // ActiveSpeaker
                  // ZoomMtg.inMeetingServiceListener(
                  //   'onActiveSpeaker',
                  //   function (data) {
                  //     // [{userId: number, userName: string}]
                  //     console.log(data);
                  //   },
                  // );

                  // ZoomMtg.changeRedirectUrl({leaveUrl: 'https://baidu.com'});
                },
                error: function (res) {
                  console.log("join Error", res);
                },
              };
              console.log("join args", tmpJoinArgs);
              ZoomMtg.join(tmpJoinArgs);
            },
            error: function (res) {
              console.log(res);
            },
          });

          if (meetConfig.debug) {
            for (const event of meetConfig.listenEvents) {
              if (event) logger.success(`listenEvent: ${event}`);
              if (event === "onUserIsInWaitingRoom") {
                ZoomMtg.inMeetingServiceListener("onUserIsInWaitingRoom", function (data) {
                  logger.event("onUserIsInWaitingRoom", data);
                  if (!meetConfig.autoAdmit) return;
                  setTimeout(function () {
                    ZoomMtg.getCurrentUser({
                      success: function (tmpResult) {
                        const currentUser = tmpResult.result.currentUser;
                        if (currentUser.isHost || currentUser.isCoHost) {
                          if (data.isInWaitingRoom) {
                            ZoomMtg.admitAll({});
                            logger.info("admitAll", data);
                          }
                        }
                      },
                    });
                  }, 0);
                });
              } else if (event === "onJoinSpeed") {
                ZoomMtg.inMeetingServiceListener("onJoinSpeed", function (data) {
                  logger.event("onJoinSpeed", data);
                  testTool.setJoinTime(data);

                  var tmpCheckJoin = true;
                  [
                    testTool.joinSpeedTag.userAudioDecodeSuccess,
                    testTool.joinSpeedTag.userVideoDecodeSuccess,
                    testTool.joinSpeedTag.userAudioEncodeSuccess,
                    testTool.joinSpeedTag.userVideoEncodeSuccess,
                    testTool.joinSpeedTag.userStartJoinAudio,
                    testTool.joinSpeedTag.userJoinAudioSuccess,
                    testTool.joinSpeedTag.userStartJoinVideo,
                    testTool.joinSpeedTag.userJoinVideoSuccess,
                  ].forEach((item) => {
                    if (!testTool.joinSpeed[item].time) {
                      tmpCheckJoin = tmpCheckJoin & false;
                    }
                  });
                  if (tmpCheckJoin) {
                    if (!testTool.joinSpeed[testTool.joinSpeedTag.userAudioVideoSuccess].time) {
                      testTool.setJoinTimeOld(testTool.joinSpeedTag.userAudioVideoSuccess);
                      logger.event("onJoinSpeed user audio and video on(join finish)", data);
                      window.testTool.printJoinTime();
                    }
                  }
                });
              } else if (event === "onShareQos") {
                ZoomMtg.inMeetingServiceListener("onShareQos", function (data) {
                  if (!("payload" in data)) return;
                  console.log("onShareQos response", data);
                });
              } else if (event) {
                ZoomMtg.inMeetingServiceListener(event, function (data) {
                  logger.event(`${event}`, data);
                });
              }
            }
          }

          var qosIndex = 1;
          document.getElementById("testQosCancel").addEventListener("click", function () {
            document.getElementById("testQosCancel").classList.add("hidden");
            document.getElementById("testQos").classList.remove("hidden");
            ZoomMtg.unSubscribeStatisticData({
              success: function () {
                console.log("unSubscribeStatisticData success");
              },
            });
          });
          document.getElementById("testQos").addEventListener("click", function () {
            document.getElementById("testQosCancel").classList.remove("hidden");
            document.getElementById("testQos").classList.add("hidden");
            ZoomMtg.inMeetingServiceListener("onQos", function (data) {
              if (!("payload" in data)) return;
              // console.log('onQos response', data);
              // audio
              // avg_loss: 0
              // encoding: true
              // jitter: 12
              // max_loss: 0
              // rtt: 101
              // sample_rate: 24
              // timestamp: 1655115356770

              // video
              // avg_loss: 0
              // encoding: false
              // fps: 1
              // height: 360
              // jitter: 17
              // max_loss: 0
              // rtt: 87
              // timestamp: 1655115356797
              // width: 640

              switch (data.type) {
                case "AUDIO_DATA_ENCODING": {
                  window.qosTest = Object.assign({}, window.qosTest, {
                    tmpAudoData: data.payload,
                  });
                  break;
                }
                case "AUDIO_DATA_DECODING": {
                  window.qosTest = Object.assign({}, window.qosTest, {
                    tmpAudoData: data.payload,
                  });
                  break;
                }
                case "VIDEO_DATA_ENCODING": {
                  window.qosTest = Object.assign({}, window.qosTest, {
                    tmpVideoData: data.payload,
                  });
                  break;
                }
                case "VIDEO_DATA_DECODING": {
                  window.qosTest = Object.assign({}, window.qosTest, {
                    tmpVideoData: data.payload,
                  });
                  break;
                }
                default:
                  return;
              }
              var postQosData = {
                audio: window.qosTest.tmpAudoData,
                video: window.qosTest.tmpVideoData,
                sharing: window.qosTest.tmpSharingData,
                mid: window.qosTest.qosMid,
                myZoomId: window.qosTest.qosMyZoomid,
                type: "websdk",
                testid: window.qosTest.qosTestid,
              };
              if (qosIndex % 200 === 0) console.log(postQosData);
              qosIndex += 1;

              axios
                .post("https://websdkes.zoomdev.us/websdk/_doc", {
                  data: postQosData,
                })
                .then((res) => {
                  // console.log(data.type);
                });
            });

            ZoomMtg.subscribeStatisticData({
              audio: false,
              video: false,
              share: true,
              success: function (e) {
                console.log("subscribeStatisticData===>", e);

                // window.qosTest = Object.assign({}, window.qosTest, {
                //   qosMid: '', //e.result.mid,
                //   qosMyZoomid: '', // e.result.myZoomId,
                //   qosTestid: testTool.randomNum(100000, 999999) + testTool.detectOS() + testTool.getBrowserInfo()[0]
                // })
                // axios.post('https://websdkes.zoomdev.us/websdkdevice/_doc', {
                //   data: JSON.stringify({
                //     testid: window.qosTest.qosTestid,
                //     userAgent: navigator.userAgent,
                //     os: testTool.detectOS(),
                //     browser: testTool.getBrowserInfo()[0],
                //     corp: window.crossOriginIsolated
                //   }),
                // }).then((res) => {
                //   console.log(res);
                // });
              },
            });
          });
        });
      };
      if (!meetConfig.signature) {
        axios({
          method: "get",
          responseType: "json",
          url:
            "/jwt/websdk.php?sdkKey=" +
            meetConfig.sdkKey +
            "&sdksecret=" +
            meetConfig.sdkSecret +
            "&role=" +
            meetConfig.role +
            "&mn=" +
            meetConfig.meetingNumber +
            "&enforceWebRtcVideo=" +
            meetConfig.enforceWebRtcVideo,
        }).then(function (response) {
          var res = response.data;
          meetConfig.geo = res.ip;
          meetConfig.signature = res.signature;

          if (res.signature === "" || !res.signature) {
            console.log("cant's get signature", res.signature);
            return;
          }
          beginJoin(res.signature);
        });
      } else {
        beginJoin(res.signature);
      }

      var tmpjsMediaRoot = document.getElementsByTagName("body")[0];
      tmpjsMedia = document.createElement("div");
      tmpjsMedia.id = "jsmediaversion";
      setTimeout(function () {
        if (JsMediaSDK_Instance) {
          // tmpjsMedia.textContent =
          //   JsMediaSDK_Instance.version + '|' + tmpArgs.customerJoinId;
          tmpjsMedia.textContent = JsMediaSDK_Instance.version;
          appendChild(tmpjsMediaRoot, tmpjsMedia);
        }
      }, 60000);
    });
  }
  // client view end

  // uitoolkit start
  if (meetConfig.widget === "4") {
    testTool.loadCSS("https://videosdk.zoomdev.us/uikit/meeting/videosdk-ui-toolkit.css");
    testTool.loadCSS("/demo-uitoolkit.css");
    const videosdkVersion = "2.1.0";
    const toolkitLib = "https://videosdk.zoomdev.us/" + videosdkVersion + "/lib";
    // testTool.loadScript(
    //   '/' + meetConfig.version + '/uikit/index.js',
    //   function () {},
    //   true,
    // );
    testTool.loadScript(
      "https://videosdk.zoomdev.us/uikit/meeting/videosdk-ui-toolkit.min.umd.js",
      function () {
        function beginJoinToolkit(signature) {
          meetConfig.signature = signature;
          sessionStorage.setItem("meetingConfig", JSON.stringify(meetConfig));
          const UIToolkitConfig = {
            videoSDKJWT: meetConfig.VideoSignature,
            sessionName: meetConfig.meetingNumber,
            userName: meetConfig.userName,
            sessionPasscode: "",
            webEndpoint: meetConfig.webEndpoint || meetConfig.web,
            features: ["video", "audio", "share", "chat", "users", "settings", "preview"],
            dependentAssets: toolkitLib,
            options: {
              useVideoPlayer: true,
              enforceGalleryView: true,
              enforceVB: true,
              enforceAB: true,
            },
          };

          let sessionContainer = document.getElementById("UIToolkit");
          var uitoolkit = window.UIToolkit;

          uitoolkit.joinSession(sessionContainer, uitoolkit.migrateConfig(UIToolkitConfig));

          document.getElementById("userButtons").style.display = "none";
        }

        const queryObj = {
          sdkKey: "0SeiFE8I9UpuTDSeE2j4V8ZZno0lPdKLBhw2",
          sdkSecret: "",
          sdkPassword: "",
          sdkTopic: btoa(meetConfig.meetingNumber),
          user_identity: meetConfig.customerKey,
          session_key: meetConfig.session_key || "",
          role: meetConfig.role,
          cloud_recording_option: 0,
          cloud_recording_election: 0,
          telemetry_id: btoa(meetConfig.customerJoinId),
          rc: 0,
          auto_transcription: 0,
          // enforce_web_rtc_audio: meetingConfig.enforceAB,
          audio_compatible_mode: 1,
          video_webrtc_mode: 1,
          geo_regions: "",
        };
        axios({
          method: "get",
          responseType: "json",
          url: `https://websdk.zoomdev.us/jwt/index.php?${new URLSearchParams(queryObj).toString()}`,
        }).then(function (response) {
          var res = response.data;
          // meetingConfig.geo = res.ip;
          meetConfig.VideoSignature = res.signature;

          if (res.signature === "" || !res.signature) {
            console.log("cant's get signature", res.signature);
            return;
          }

          if (!meetConfig.signature) {
            axios({
              method: "get",
              responseType: "json",
              url:
                "/jwt/websdk.php?sdkKey=" +
                meetConfig.sdkKey +
                "&sdksecret=" +
                meetConfig.sdkSecret +
                "&role=" +
                meetConfig.role +
                "&mn=" +
                meetConfig.meetingNumber +
                "&enforceWebRtcVideo=" +
                meetConfig.enforceWebRtcVideo,
            }).then(function (response) {
              var res = response.data;
              meetConfig.geo = res.ip;
              meetConfig.signature = res.signature;

              if (res.signature === "" || !res.signature) {
                console.log("cant's get signature", res.signature);
                return;
              }
              beginJoinToolkit(res.signature);
            });
          } else {
            console.log("no signature for uikit");
          }
        });
      },
      true,
    );
  }

  if (meetConfig.widget === "5") {
    testTool.loadCSS("/demo-uitoolkit.css");
    var dialog = document.getElementById("dialogOverlayDemo");

    function openDialog() {
      dialog.style.display = "block";
    }

    function closeDialog() {
      dialog.style.display = "none";
    }

    let countdown = 3;
    const countdownElement = document.getElementById("democountdown");
    function updateCountdown() {
      countdownElement.textContent = countdown;
      countdown--;

      if (countdown >= 0) {
        setTimeout(updateCountdown, 1000);
      } else {
        debugger;
        countdownElement.style.display = "none";
        document.getElementById("click-clientview").click();
      }
    }

    updateCountdown();
    openDialog();

    const generateRedirectUrl = function (widgetNumber) {
      const params = new URLSearchParams(window.location.search);
      const paramsObject = Object.fromEntries(params.entries());
      params.set("widget", widgetNumber.toString());
      return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    };

    const searchArgs = new URLSearchParams(window.location.href);
    function redirectTo() {
      window.location.href = window.location;
    }
    const NavDict = {
      clientView: 0,
      componentView: 1,
      toolkit: 4,
    };
    document.getElementById("click-uitoolkit").addEventListener("click", function () {
      window.location.href = generateRedirectUrl(NavDict.toolkit);
    });

    document.getElementById("click-clientview").addEventListener("click", function () {
      window.location.href = generateRedirectUrl(NavDict.clientView);
    });
    // document
    //   .getElementById('click-componentview')
    //   .addEventListener('click', function () {
    //     window.location.href = generateRedirectUrl(NavDict.componentView);
    //   });
  }
  // uitoolkit start
})();
