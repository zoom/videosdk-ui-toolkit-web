import React, { useState } from "react";
import { Copy, Key, Trash2, Plus, RefreshCw, Layout } from "lucide-react";
import Sidebar from "./Sidebar";
import SDKKeySection from "./SDKKeySection";
import RoomManagement from "./RoomManagement";
// uikit no code solution
function WebApp() {
  const [activeTab, setActiveTab] = useState("sdk");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div
      className="zoom-ui-toolkit-root flex flex-col md:flex-row min-h-screen bg-[#f5f5f7]"
      style={{ display: "flex" }}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className="zoom-ui-toolkit-root uikit-app-main-content flex-1 p-4 md:p-8 pt-16 md:pt-8">
        {activeTab === "sdk" ? <SDKKeySection /> : <RoomManagement />}
      </main>
    </div>
  );
}

export default WebApp;
