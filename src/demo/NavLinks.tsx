import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ExternalLink, ChevronDown } from "lucide-react";

type Category = "meeting" | "video" | "uikit";

interface NavLink {
  title: string;
  href: string;
  category: Category;
  isActive?: boolean;
  description?: string;
  subMenu?: {
    title: string;
    href: string;
    description?: string;
  }[];
}

const SmallButton = ({ link, onClick, id }: { link: NavLink; onClick: () => void; id: string }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (link.subMenu) {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          id={id}
          className="
            group relative px-2 py-1.5
            bg-theme-surface border border-theme-border rounded-md
            flex items-center gap-1.5
            text-xs font-medium
            transition-all duration-300 ease-in-out
            text-theme-text hover:border-blue-500 hover:text-blue-600 hover:shadow
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transform hover:scale-[1.02]
            cursor-pointer
            w-full
          "
        >
          <span>{link.title}</span>
          <ChevronDown
            className={`w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        <div
          className={`
            absolute top-[calc(100%+0.25rem)] left-0
            w-48
            bg-theme-surface rounded-md shadow-lg
            border border-theme-border
            transition-all duration-200 ease-in-out
            ${isDropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-10px] pointer-events-none"}
            z-[9999]
            max-h-[80vh] overflow-y-auto
          `}
        >
          {link.subMenu.map((subItem, index) => (
            <button
              key={`${id}-sub-${index}`}
              onClick={() => {
                window.open(subItem.href, "_blank");
                setIsDropdownOpen(false);
              }}
              title={subItem?.description || ""}
              className="
                w-full px-3 py-2 text-left
                text-xs font-medium text-theme-text
                hover:bg-theme-background hover:text-blue-600
                transition-colors duration-150
                first:rounded-t-md last:rounded-b-md
                relative
                group/item
                z-[9999]
              "
            >
              <span className="truncate">{subItem.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      id={id}
      className="
        group relative px-2 py-1.5
        bg-theme-surface border border-theme-border rounded-md
        flex items-center gap-1.5
        text-xs font-medium
        transition-all duration-300 ease-in-out
        text-theme-text hover:border-blue-500 hover:text-blue-600 hover:shadow
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transform hover:scale-[1.02]
        cursor-pointer
      "
    >
      <span>{link.title}</span>
      <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

const NavLinks = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const meetingSDKLinks: NavLink[] = [
    {
      title: "MeetingSDK",
      href: "https://websdk.zoomdev.us",
      category: "meeting" as Category,
    },
    {
      title: "MeetingSDK Version",
      href: "#",
      category: "meeting" as Category,
      subMenu: [
        { title: "design", href: "https://docs.zoom.us/doc/yX6TkAg7Tl-Q_OkA29v36w" },
        { title: "release note", href: "https://developers.zoom.us/changelog/meeting-sdk/web/" },
        {
          title: "6.1.0",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/74406/tab/release-report-all-issues",
        },
        {
          title: "6.0.0",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/63326/tab/release-report-all-issues",
        },
        {
          title: "7.0.0(ZWA)",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/62855/tab/release-report-all-issues",
        },
        {
          title: "7.0.10(ZWA)",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/62855/tab/release-report-all-issues",
        },
        {
          title: "ShortTermBacklog",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/34933/tab/release-report-all-issues",
        },
        {
          title: "events release note",
          href: "https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0066826",
        },
        {
          title: "Component View Figma",
          href: "https://www.figma.com/design/uSJQZdaAxL49KWFWcEBP4o/Websdk-Widget?node-id=9-13443&p=f&t=Szfq1luQxYPge4bO-0",
        },
        {
          title: "all released task",
          href: "https://docs.zoom.us/doc/2D3VrlYTS1mFO9q5I4MYkg",
        },
        {
          title: "all backlog task",
          href: "https://zoomvideo.atlassian.net/jira/software/c/projects/ZOOM/boards/1083/backlog?issueLimit=100&view=detail",
        },
        {
          title: "Feature Gap",
          href: "https://docs.zoom.us/doc/Hg8By-WoTTuBi5MGGYQ0hg?from=hub",
        },
        { title: "MeetingSDK Feature Option", href: "https://docs.zoom.us/doc/vY-B_t0kRSq3OdXULhxRhw" },
        { title: "CROS Demo Test", href: "https://websdk.qooeo.com" },
      ],
    },
    {
      title: "Client/Component View API",
      href: "#",
      category: "meeting" as Category,
      subMenu: [
        {
          title: "Client View API/Prod",
          href: "https://marketplacefront.zoom.us/sdk/meeting/web/index.html",
        },
        {
          title: "Client View API/Dev",
          href: "https://websdk.zoomdev.us/clientview/api/",
        },
        {
          title: "Component API/Prod",
          href: "https://marketplacefront.zoom.us/sdk/meeting/web/components/index.html",
        },
        {
          title: "Component API/Dev",
          href: "https://websdk.zoomdev.us/widget/api/",
        },
        {
          title: "API Legal Approval",
          href: "https://docs.google.com/spreadsheets/d/1Z304WgUtMiyWno6eoLM6ihnkl7HB2emgeMLsMXxka28/edit?gid=771471054#gid=771471054",
        },
      ],
    },
    {
      title: "Artifacts Package",
      href: "#",
      category: "meeting" as Category,
      subMenu: [
        {
          title: "@zoom/web-sdk-core",
          href: "https://artifacts.corp.zoom.us/ui/packages?name=%40zoom%2Fweb-sdk-core&type=packages",
          description: "Web SDK Core",
        },
        {
          title: "@zoom/webclientjs",
          href: "https://artifacts.corp.zoom.us/ui/packages?name=%40zoom%2Fwebclientjs&type=packages",
          description: "Client View",
        },
        {
          title: "@zoom/web-sdk-react-widgets",
          href: "https://artifacts.corp.zoom.us/ui/packages?name=%40zoom%2Fweb-sdk-react-widgets&type=packages",
          description: "Components View",
        },
        {
          title: "@zoom/zoom-webrtc-sdk",
          href: "https://artifacts.corp.zoom.us/ui/packages?name=%40zoom%2Fzoom-webrtc-sdk&type=packages",
          description: "jsmedia webrtc sdk",
        },
        {
          title: "@zoom/videosdk-internal",
          href: "https://artifacts.corp.zoom.us/ui/packages?name=%40zoom%2Fvideosdk-internal&type=packages",
          description: "Video SDK",
        },
      ],
    },
    {
      title: "NPM Package",
      href: "https://www.npmjs.com/package/@zoom/meetingsdk",
      category: "meeting" as Category,
      subMenu: [
        {
          title: "@zoom/meetingsdk",
          href: "https://www.npmjs.com/package/@zoom/meetingsdk",
        },
        {
          title: "@zoom/videosdk",
          href: "https://www.npmjs.com/package/@zoom/videosdk",
        },
        {
          title: "@zoom/videosdk-ui-toolkit",
          href: "https://www.npmjs.com/package/@zoom/videosdk-ui-toolkit",
        },
        {
          title: "@zoom/probesdk",
          href: "https://www.npmjs.com/package/@zoom/probesdk",
        },
      ],
    },

    {
      title: "MeetingSDK Developer",
      href: "https://developers.zoom.us/docs/meeting-sdk/web/",
      category: "meeting" as Category,
    },
  ];

  const videoSDKLinks: NavLink[] = [
    {
      title: "VideoSDK",
      href: "https://videosdk.zoomdev.us/",
      category: "video" as Category,
      isActive: false,
    },
    {
      title: "VideoSDK Version",
      href: "#",
      category: "video" as Category,
      subMenu: [
        { title: "design", href: "https://docs.zoom.us/doc/o5Aq1SXcRsC6Xv_E66EL9w" },
        { title: "release note", href: "https://developers.zoom.us/changelog/video-sdk/web/" },
        {
          title: "2.3.5",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/62684/tab/release-report-all-issues",
        },
        {
          title: "2.3.12",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/62806/tab/release-report-all-issues",
        },
        {
          title: "2.4.0",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/63563/tab/release-report-all-issues",
        },
        {
          title: "2.4.5",
          href: "https://zoomvideo.atlassian.net/projects/10202/versions/74407/tab/release-report-all-issues",
        },
        {
          title: "ShortTermBacklog",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/34935/tab/release-report-all-issues",
        },
        {
          title: "all released task",
          href: "https://docs.zoom.us/doc/m-Etm8Q5QEuvWO5I0FO4Ag",
        },
        {
          title: "ZCC release note",
          href: "https://developers.zoom.us/changelog/contact-center/web/",
        },
        {
          title: "Feature Gap",
          href: "https://docs.zoom.us/doc/NNGssQo8TZ6GFprxnGwf-w",
        },
      ],
    },
    {
      title: "VideoSDK API",
      href: "https://marketplacefront.zoom.us/sdk/custom/web/index.html",
      category: "video" as Category,
      subMenu: [
        {
          title: "VideoSDK API/Prod",
          href: "https://marketplacefront.zoom.us/sdk/custom/web/index.html",
        },
        {
          title: "VideoSDK API/Dev",
          href: "https://videosdk.zoomdev.us/api/",
        },
      ],
    },
    {
      title: "WebSDKCore API/Dev",
      href: "https://websdk.zoomdev.us/websdkcore/api/",
      category: "video" as Category,
    },
    {
      title: "ZCC & Events & BCV",
      href: "#",
      category: "video" as Category,
      subMenu: [
        {
          title: "ZCC-Jack",
          href: "https://livesdk.zoomdev.us/playground/video.html?env=qa&key=T2Vs_RLWTKmw3DX31V61vA",
        },
        {
          title: "ZCC-Jack-Prod",
          href: "https://livesdk.zoomdev.us/playground/video.html?env=us01&key=EbA7xWFbQvayRlyR62Lb0g",
        },
        {
          title: "BCV-Meeting",
          href: "https://cloudverification.corp.zoom.com/websdk/",
        },
        {
          title: "BCV-Full",
          href: "https://cloudverification.corp.zoom.com/websdk-full/",
        },
        {
          title: "BCV-Video(Coming Soon)",
          href: "#",
        },
        {
          title: "Events dev",
          href: "https://devevents.zoomdev.us/",
        },
        {
          title: "Events prod",
          href: "https://events.zoom.us/",
        },
      ],
    },
    {
      title: "VideoSDK Developer",
      href: "https://developers.zoom.us/docs/video-sdk/web/",
      category: "video" as Category,
    },
  ];

  const uikitLinks: NavLink[] = [
    {
      title: "UIKit",
      href: "#",
      category: "uikit" as Category,
      description: "UI Toolkit",
      subMenu: [
        {
          title: "UIKit SAB Dev",
          href: "https://videosdk.zoomdev.us/uikit/cdn.html",
        },
        {
          title: "UIKit prod",
          href: "https://sdk.zoom.com/videosdk-uitoolkit",
          description: "Public link for UIKit test",
        },
        {
          title: "UIKit us04st1",
          href: "https://us04st1.zoom.us/videosdk-uitoolkit/index.html",
          description: "Public link for UIKit test",
        },
        {
          title: "UIKit videosdk.dev(deprecated)",
          href: "https://videosdk.dev/uitoolkit/",
          description: "Public link for UIKit test",
        },
      ],
    },
    {
      title: "UIKit Version",
      href: "https://developers.zoom.us/changelog/ui-toolkit/web/",
      category: "uikit" as Category,
      subMenu: [
        { title: "design", href: "https://docs.zoom.us/doc/2WOpXSDYSlSHVHtS-ptV-A" },
        { title: "release note", href: "https://developers.zoom.us/changelog/ui-toolkit/web/" },
        {
          title: "2.3.5",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/62812/tab/release-report-all-issues",
        },
        {
          title: "2.3.12",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/62813/tab/release-report-all-issues",
        },
        {
          title: "2.4.0",
          href: "https://zoomvideo.atlassian.net/projects/ZOOM/versions/67016/tab/release-report-all-issues",
        },
        {
          title: "Figma Design",
          href: "https://www.figma.com/design/cJNLT8f6iiFF7BLa0ApqHF/Video-SDK-UI-Kit?node-id=1256-32520&p=f&t=oKsaGxhyGBiMMqz9-0",
        },
      ],
    },

    {
      title: "UIKit API",
      href: "#",
      category: "uikit" as Category,
      subMenu: [
        {
          title: "UIKit API/Prod",
          href: "https://marketplacefront.zoom.us/sdk/uitoolkit/web/index.html",
        },
        {
          title: "UIKit API/Dev",
          href: "https://videosdk.zoomdev.us/uikit/api.html",
        },
      ],
    },
    {
      title: "ProbeSDK",
      href: "https://developers.zoom.us/docs/probe-sdk/",
      category: "uikit" as Category,
      subMenu: [
        {
          title: "ProbeSDK(ZCP)",
          href: "https://sdk.zoom.com/probe",
          description: "ProbeSDK public link",
        },
        {
          title: "ProbeSDK Dev",
          href: "https://videosdk.zoomdev.us/probesdk/",
        },
        {
          title: "ProbeSDK App(Clever)",
          href: "https://probeapp.vercel.app/",
        },
        {
          title: "ProbeSDK API",
          href: "https://marketplacefront.zoom.us/sdk/probe/index.html",
        },
        {
          title: "ProbeSDK Developer",
          href: "https://developers.zoom.us/docs/probe-sdk/",
        },
      ],
    },

    {
      title: "Github Repository",
      href: "#",
      category: "uikit" as Category,
      subMenu: [
        {
          title: "MeetingSDK example",
          href: "https://github.com/zoom/meetingsdk-web-sample",
          description: "MeetingSDK Github sample",
        },
        {
          title: "MeetingSDK Web",
          href: "https://github.com/zoom/meetingsdk-web",
          description: "MeetingSDK Web",
        },
        {
          title: "VideoSDK example",
          href: "https://github.com/zoom/videosdk-web-sample",
          description: "VideoSDK Github sample",
        },
        {
          title: "VideoSDK Web",
          href: "https://github.com/zoom/videosdk-web",
          description: "VideoSDK Web",
        },
        {
          title: "UIKit example",
          href: "https://github.com/zoom/videosdk-ui-toolkit-react-sample",
          description: "UIKit Github sample",
        },
        {
          title: "UIKit Web",
          href: "https://github.com/zoom/videosdk-ui-toolkit-web",
          description: "UIKit Web",
        },
      ],
    },
    {
      title: "UIKit Developer",
      href: "https://developers.zoom.us/docs/video-sdk/web/ui-toolkit/",
      category: "uikit" as Category,
    },
  ];
  const handleClick = (href: string) => {
    window.open(href, "_blank");
  };

  return (
    <div className="w-full max-w-8xl mx-auto p-4 pt-1 relative z-20">
      <button
        className="md:hidden fixed top-4 right-4 z-50 bg-theme-surface p-2 rounded-full shadow-lg border border-theme-border
                   hover:shadow-xl transition-shadow duration-300"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="h-6 w-6 text-theme-text" /> : <Menu className="h-6 w-6 text-theme-text" />}
      </button>

      <nav
        className={`
        fixed md:relative top-0 left-0 w-full h-full md:h-auto
        transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        transition-all duration-300 ease-in-out
        bg-theme-surface md:bg-transparent
        z-30 md:z-auto
        p-2 md:p-0
        overflow-y-auto md:overflow-visible
        shadow-lg md:shadow-none
        backdrop-blur-lg md:backdrop-blur-none
      `}
      >
        <div className="space-y-1">
          {/* MeetingSDK Section */}
          <div className="bg-theme-surface/50 p-2 rounded-xl shadow-sm pt-1 border border-theme-border">
            {isMenuOpen && (
              <h2 className="text-lg font-semibold text-theme-text mb-1 flex items-center space-x-2">
                <span>MeetingSDK Links</span>
                <div className="h-px flex-1 bg-theme-border ml-4"></div>
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {meetingSDKLinks.map((link, index) => (
                <SmallButton
                  id={`meetingsdkButton-${index}`}
                  key={`meetingsdk-${index}`}
                  link={link}
                  onClick={() => handleClick(link.href)}
                />
              ))}
            </div>
          </div>

          {/* VideoSDK Section */}
          <div className="bg-theme-surface/50 p-2 rounded-xl shadow-sm pt-1 border border-theme-border">
            {isMenuOpen && (
              <h2 className="text-lg font-semibold text-theme-text mb-1 flex items-center space-x-2">
                <span>VideoSDK Links</span>
                <div className="h-px flex-1 bg-theme-border ml-4"></div>
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {videoSDKLinks.map((link, index) => (
                <SmallButton
                  id={`videosdkbutton-${index}`}
                  key={`videosdk-${index}`}
                  link={link}
                  onClick={() => handleClick(link.href)}
                />
              ))}
            </div>
          </div>

          {/* UIKit Section */}
          <div className="bg-theme-surface/50 p-2 rounded-xl shadow-sm pt-1 border border-theme-border">
            {isMenuOpen && (
              <h2 className="text-lg font-semibold text-theme-text mb-1 flex items-center space-x-2">
                <span>UIKit Links</span>
                <div className="h-px flex-1 bg-theme-border ml-4"></div>
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {uikitLinks.map((link, index) => (
                <SmallButton
                  id={`uikitbutton-${index}`}
                  key={`uikit-${index}`}
                  link={link}
                  onClick={() => handleClick(link.href)}
                />
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavLinks;
