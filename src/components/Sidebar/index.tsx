"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Home, AlertTriangle, Settings, LogOut, Users, FileText, LayoutGrid } from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// Define menu structure
const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <LayoutGrid size={18} />,
        label: "Dashboard",
        route: "/",
        children: [
          { label: "Home Page", route: "/" },
          { label: "Landing", route: "/landing" },
          { label: "Exhibit Upload", route: "/exhibit" },
          { label: "All Exhibits", route: "/exhibit/all" }
        ],
      },
      {
        icon: <AlertTriangle size={18} />,
        label: "Details",
        route: "/ExhibitLogs",
        children: [
          { label: "Exhibit Logs", route: "/ExhibitLogs" },
          { label: "Visitors", route: "/client/VisitorDetails" },
        ],
      },
    ],
  },
  {
    name: "OTHERS",
    menuItems: [
      {
        icon: <Settings size={18} />,
        label: "Change Password",
        route: "/auth/forgot-password",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-4 border-b border-gray-700">
          <Link href="/" className="flex items-center">
            <Image
              width={150}
              height={30}
              src={"/images/logo/logo.png"}
              alt="Logo"
              priority
              className="w-auto h-8"
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden text-white hover:text-gray-300"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          <nav className="mt-5 px-4 py-3">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                <h3 className="mb-3 ml-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.name}
                </h3>

                <ul className="flex flex-col gap-1">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;