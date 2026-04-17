interface IframeSizes {
  [key: string]: { width: number; height: number };
}

export const IFRAME_SIZES: IframeSizes = {
  ZE1: { width: 400, height: 300 },
  ZE2: { width: 400, height: 514 },
  SMALL: { width: 500, height: 281 },
  VGA: { width: 640, height: 480 },
  HVGA: { width: 480, height: 320 },
  WQVGA: { width: 360, height: 240 },
  FWQVGA: { width: 432, height: 240 },
  SVGA: { width: 800, height: 600 },
  XGA: { width: 1024, height: 768 },
};

// Store fullscreen change handler reference for cleanup
let currentFullscreenHandler: (() => void) | null = null;

export const createMeetingIframe = (joinUrl: string, iframeSize: string, newTitle?: string) => {
  const size = IFRAME_SIZES[iframeSize] || IFRAME_SIZES["ZE1"];
  let isFullscreen = false;

  const iframe = document.createElement("iframe");
  iframe.src = joinUrl;
  iframe.width = size.width.toString();
  iframe.height = size.height.toString();
  iframe.style.border = "none";
  iframe.setAttribute(
    "sandbox",
    "allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation",
  );
  iframe.setAttribute(
    "allow",
    "microphone; camera; fullscreen; speaker; display-capture; notifications; cross-origin-isolated; autoplay; midi; encrypted-media",
  );
  iframe.setAttribute("allowfullscreen", "true");
  iframe.setAttribute("loading", "lazy");
  iframe.setAttribute("title", newTitle || "Test iframe for cross-origin embedding");

  // Add custom styles for ZE1 and ZE2
  if (iframeSize === "ZE1" || iframeSize === "ZE2") {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .preview-root .preview-title { 
        display: none !important;
      }
      .preview-root .preview-agreement {
        display: none !important;
      }
      .preview-root .page-footer {
        display: none !important;
      }
      .preview-new-flow-content {
        width: 100% !important;
      }
    `;
    iframe.addEventListener("load", () => {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDocument) {
        iframeDocument.head.appendChild(styleElement);
      }
    });
  }

  const container = document.getElementById("meeting-iframe-container") || document.createElement("div");
  container.id = "meeting-iframe-container";
  container.style.position = "fixed";
  container.style.top = "50%";
  container.style.left = "50%";
  container.style.transform = "translate(-50%, -50%)";
  container.style.zIndex = "9999";
  container.style.backgroundColor = "white";
  container.style.borderRadius = "8px";
  container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  container.style.overflow = "hidden";
  container.innerHTML = "";

  // Create header
  const header = document.createElement("div");
  header.style.padding = "16px 20px";
  header.style.borderBottom = "1px solid #e5e7eb";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.backgroundColor = "white";
  header.style.position = "relative";
  header.style.zIndex = "10000";

  // Add title
  const title = document.createElement("h2");
  title.textContent = newTitle || "iFrame join";
  title.className = "m-0 text-lg font-medium text-gray-800";
  header.appendChild(title);

  // Add button container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "8px";
  buttonContainer.style.alignItems = "center";

  // Add fullscreen button
  const fullscreenButton = document.createElement("button");
  fullscreenButton.innerHTML = "⛶";
  fullscreenButton.className =
    "w-6 h-6 flex items-center justify-center text-lg text-gray-500 hover:text-gray-700 border-none bg-transparent cursor-pointer p-0 transition-colors duration-200";
  fullscreenButton.title = "Toggle fullscreen";

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // Handle fullscreen state changes
  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    );

    isFullscreen = isCurrentlyFullscreen;

    if (isFullscreen) {
      // Fullscreen styles for container
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100vw";
      container.style.height = "100vh";
      container.style.transform = "none";
      container.style.borderRadius = "0";
      container.style.margin = "0";
      container.style.padding = "0";
      container.style.backgroundColor = "black";
      container.style.zIndex = "999999";

      // Fullscreen styles for header
      header.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      header.style.borderBottom = "1px solid rgba(255, 255, 255, 0.2)";
      header.style.color = "white";
      header.style.position = "relative";
      header.style.zIndex = "1000000";

      // Update title color for dark background
      title.style.color = "white";

      // Fullscreen styles for content wrapper
      contentWrapper.style.height = "calc(100vh - 60px)";
      contentWrapper.style.width = "100vw";
      contentWrapper.style.overflow = "hidden";

      // Update iframe dimensions for fullscreen
      const fullscreenWidth = window.innerWidth;
      const fullscreenHeight = window.innerHeight - 60; // Account for header height

      iframe.width = fullscreenWidth.toString();
      iframe.height = fullscreenHeight.toString();
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.display = "block";
      iframe.style.margin = "0";
      iframe.style.padding = "0";

      fullscreenButton.innerHTML = "⛉";
      fullscreenButton.title = "Exit fullscreen";
    } else {
      // Normal styles for container
      container.style.position = "fixed";
      container.style.top = "50%";
      container.style.left = "50%";
      container.style.width = "auto";
      container.style.height = "auto";
      container.style.transform = "translate(-50%, -50%)";
      container.style.borderRadius = "8px";
      container.style.margin = "auto";
      container.style.padding = "0";
      container.style.backgroundColor = "white";
      container.style.zIndex = "9999";

      // Normal styles for header
      header.style.backgroundColor = "white";
      header.style.borderBottom = "1px solid #e5e7eb";
      header.style.color = "black";
      header.style.position = "relative";
      header.style.zIndex = "10000";

      // Reset title color for light background
      title.style.color = "#1f2937";

      // Normal styles for content wrapper
      contentWrapper.style.height = "auto";
      contentWrapper.style.width = "auto";
      contentWrapper.style.overflow = "hidden";

      // Restore original iframe dimensions
      iframe.width = size.width.toString();
      iframe.height = size.height.toString();
      iframe.style.width = size.width + "px";
      iframe.style.height = size.height + "px";
      iframe.style.display = "block";
      iframe.style.margin = "0";
      iframe.style.padding = "0";

      fullscreenButton.innerHTML = "⛶";
      fullscreenButton.title = "Toggle fullscreen";
    }
  };

  // Store handler reference for cleanup
  currentFullscreenHandler = handleFullscreenChange;

  // Add event listeners
  fullscreenButton.onclick = toggleFullscreen;
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("msfullscreenchange", handleFullscreenChange);

  // Add close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  closeButton.className =
    "w-6 h-6 flex items-center justify-center text-2xl text-gray-500 hover:text-gray-700 border-none bg-transparent cursor-pointer p-0 transition-colors duration-200";
  closeButton.onclick = removeMeetingIframe;

  buttonContainer.appendChild(fullscreenButton);
  buttonContainer.appendChild(closeButton);
  header.appendChild(buttonContainer);

  // Create content wrapper
  const contentWrapper = document.createElement("div");
  contentWrapper.style.padding = "0";
  contentWrapper.style.margin = "0";
  contentWrapper.style.display = "block";
  contentWrapper.appendChild(iframe);

  container.appendChild(header);
  container.appendChild(contentWrapper);

  if (!document.getElementById("meeting-iframe-container")) {
    document.body.appendChild(container);
  }
};

export const removeMeetingIframe = () => {
  const container = document.getElementById("meeting-iframe-container");
  if (container) {
    // Exit fullscreen if active
    if (document.fullscreenElement === container) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }

    // Remove event listeners
    if (currentFullscreenHandler) {
      document.removeEventListener("fullscreenchange", currentFullscreenHandler);
      document.removeEventListener("webkitfullscreenchange", currentFullscreenHandler);
      document.removeEventListener("msfullscreenchange", currentFullscreenHandler);
      currentFullscreenHandler = null;
    }

    container.remove();
  }
};
