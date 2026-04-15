import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ExternalLink, Moon, Sun } from "lucide-react";
import { HeaderButton, HeaderLink } from "@/demo/HeaderButton";
import { meetingToolLinks, resourceLinks, zfgLinks, AILinks } from "../resource";
import { getBrowserTheme } from "@/components/util/platform";
import { setThemeName } from "@/store/uiSlice";
import useTheme from "@/components/theme/useTheme";

const buttonClass =
  "group relative px-2 py-2.5 bg-theme-surface hover:bg-theme-background text-theme-text border border-theme-border rounded-md flex items-center gap-1.5 text-xs font-medium whitespace-nowrap transition-all duration-300 ease-in-out border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] cursor-pointer";

const HeaderLinks: HeaderLink[] = [
  {
    text: "Old Nav",
    url: "https://websdk.zoomdev.us/indexOld.html",
    title: "MeetingSDK nav old",
  },
  {
    text: "WebClient Release",
    url: "https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0066432",
    title: "WebClient Release Notes",
  },
  { text: "Oauth", url: "https://websdk.zoomdev.us/oauthsdk/", title: "MeetingSDK oauth" },
  meetingToolLinks,
  resourceLinks,
  zfgLinks,
  AILinks,
];

export const NavHeader = ({
  sdkKey,
  sdkSecret,
  setSdkKey,
  setSdkSecret,
  toggleTheme,
  themeName,
}: {
  sdkKey: string;
  sdkSecret: string;
  setSdkKey: (sdkKey: string) => void;
  setSdkSecret: (sdkSecret: string) => void;
  toggleTheme: () => void;
  themeName: string;
}) => {
  return (
    <header className="bg-theme-surface text-theme-text border border-theme-border z-30 w-full shadow-md py-1 px-3 transition-colors duration-300">
      <div className="mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src="./logo.svg" alt="MeetingSDK" className="w-16 h-10 object-contain p-1" />
            <span className="text-lg text-theme-text ml-2">MeetingSDK-Web</span>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {HeaderLinks.map((link) => (
            <HeaderButton key={"header-link-" + link.text} link={link} buttonClass={buttonClass} />
          ))}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              placeholder="SDK Key"
              maxLength={100}
              className="border border-theme-border rounded-md px-3 py-2 w-full sm:w-auto text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-theme-text bg-theme-surface hover:bg-theme-background"
              id="sdkKey"
              value={sdkKey}
              onChange={(e) => setSdkKey(e.target.value)}
            />
            <input
              type="text"
              placeholder="SDK Secret"
              maxLength={100}
              className="border border-theme-border rounded-md px-3 py-2 w-full sm:w-auto text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-theme-text bg-theme-surface hover:bg-theme-background"
              id="sdkSecret"
              value={sdkSecret}
              onChange={(e) => setSdkSecret(e.target.value)}
            />
          </div>

          <button className={buttonClass} onClick={toggleTheme} title={`Switch theme`}>
            {themeName === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {themeName === "dark" ? <span className="sm:inline">Dark</span> : <span className="sm:inline">Light</span>}
          </button>

          <button
            className={buttonClass}
            onClick={() => {
              localStorage.clear();
              setSdkKey("");
              setSdkSecret("");
            }}
          >
            Clear
          </button>

          <button
            type="button"
            className={buttonClass}
            onClick={() => {
              window.open(
                "https://zoomvideo.atlassian.net/wiki/spaces/ZWC/pages/2399341718/MeetingSDK+VideoSDK+Get+SDK+Key+secret",
                "_blank",
              );
            }}
          >
            <span>Create App</span>
            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavHeader;
