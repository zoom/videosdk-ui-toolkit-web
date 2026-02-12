import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CustomizationOptions } from "./types";
import UIToolkit from "./uikit";
import PEPCHandler from "./demo/PEPC";
import "./i18n";

const CustomizeLayout = ({
  config,
  containerIds,
  urlArgs,
  getJwtToken,
  setShowJoinFlow,
  setShowControls,
}: {
  config: CustomizationOptions;
  containerIds: {
    parent: string;
    preview: string;
    chat: string;
    users: string;
    main: string;
    video: string;
    settings: string;
    controls: string;
  };
  urlArgs: any;
  getJwtToken: (urlArgs: any) => Promise<string>;
  setShowJoinFlow: (showJoinFlow: boolean) => void;
  setShowControls: (showControls: boolean) => void;
}) => {
  const { t } = useTranslation();
  const {
    parent: parentId,
    preview: previewId,
    chat: chatId,
    users: usersId,
    main: mainId,
    video: videoId,
    settings: settingsId,
    controls: controlsId,
  } = containerIds;

  useEffect(() => {
    setShowJoinFlow(false);
  }, [setShowJoinFlow]);

  const [isPreview, setIsPreview] = useState(true);
  const [isSessionJoined, setIsSessionJoined] = useState(false);
  const [isSessionLeft, setIsSessionLeft] = useState(false);
  const [showCustomJoinFlow, setShowCustomJoinFlow] = useState(true);

  const clickCustomJoinSession = useCallback(async () => {
    setShowCustomJoinFlow(false);

    if (config.videoSDKJWT === "") {
      const signature = await getJwtToken(urlArgs);
      config.videoSDKJWT = signature;
    }
    setShowControls(true);
    const newConfig = UIToolkit.migrateConfig(config as CustomizationOptions);
    const previewContainer = document.getElementById(previewId);
    if (previewContainer) {
      if (urlArgs.preview === "1") {
        setIsPreview(true);
        UIToolkit.openPreview(previewContainer, newConfig, {
          onClickJoin: () => {
            UIToolkit.closePreview(previewContainer);
            setIsPreview(false);
            const mainContainer = document.getElementById(videoId);
            if (mainContainer) {
              UIToolkit.joinSession(mainContainer, newConfig);
            }
          },
        });
      } else {
        const mainContainer = document.getElementById(videoId);
        UIToolkit.joinSession(mainContainer, newConfig);
      }
      UIToolkit.onSessionJoined(() => {
        setIsSessionJoined(true);
        setTimeout(() => {
          UIToolkit.showControlsComponent(document.getElementById(controlsId), { orientation: "vertical" });
        }, 3000);
      });

      UIToolkit.onSessionClosed(() => {
        setIsSessionJoined(false);
      });
      UIToolkit.onSessionDestroyed(() => {
        UIToolkit.destroy();
        setShowCustomJoinFlow(true);
      });
      UIToolkit.onViewTypeChange(() => {
        // View type changed
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (urlArgs.customizeLayout) {
        clickCustomJoinSession();
      }
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [urlArgs.customizeLayout, clickCustomJoinSession]);

  if (urlArgs.pepc === "1") {
    return <PEPCHandler />;
  }

  return (
    <div id={parentId}>
      {showCustomJoinFlow && (
        <div id="join-flow" className="uikit-demo-join-flow">
          <h1 className="uikit-demo-join-title">{t("demo.join_flow_custom_title")}</h1>
          <p className="uikit-demo-join-description">{t("demo.join_flow_description")}</p>
          <button onClick={clickCustomJoinSession} className="uikit-demo-join-button">
            {t("demo.join_flow_join_uikit_button")}
          </button>
        </div>
      )}
      <div id={previewId}></div>
      <div id={mainId}>
        <div id={chatId}></div>
        <div id={usersId}></div>
        <div id={videoId}></div>
        <div id={settingsId}></div>
        <div id={controlsId} className="w-full h-20 absolute bottom-0"></div>
      </div>
    </div>
  );
};

export default CustomizeLayout;
