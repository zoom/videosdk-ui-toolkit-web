import React from "react";
import { Key, Layout } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const themeName = useSelector((state: RootState) => state.ui.themeName);
  const isDark = themeName === "dark";

  return (
    <>
      {/* Mobile Header */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 h-[72px] ${
          isDark ? "bg-gray-900/80" : "bg-white/80"
        } backdrop-blur-xl border-b ${isDark ? "border-gray-700" : "border-gray-200"} z-50`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Layout className="w-6 h-6 text-[#007AFF]" />
            <h1 className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Zoom Video SDK</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`${isDark ? "text-gray-400" : "text-gray-600"} p-2`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed md:static w-64 min-w-[16rem] ${isDark ? "bg-gray-900/80" : "bg-white/80"} backdrop-blur-xl border-r ${
          isDark ? "border-gray-700" : "border-gray-200"
        } h-full z-40
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <div className="h-full flex flex-col md:p-6 p-6 pt-[88px] md:pt-6">
          <div className="hidden md:flex items-center space-x-2 mb-8">
            <Layout className="w-6 h-6 text-[#007AFF]" />
            <h1 className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Zoom Video SDK</h1>
          </div>

          <nav className="space-y-2 w-full">
            <button
              onClick={() => {
                setActiveTab("sdk");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${
                activeTab === "sdk"
                  ? "bg-[#007AFF]/10 text-[#007AFF]"
                  : `${isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-50"}`
              }`}
            >
              <Key className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">SDK</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("rooms");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${
                activeTab === "rooms"
                  ? "bg-[#007AFF]/10 text-[#007AFF]"
                  : `${isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-50"}`
              }`}
            >
              <Layout className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Rooms</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
