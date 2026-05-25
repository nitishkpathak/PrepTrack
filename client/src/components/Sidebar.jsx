import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

function Sidebar({ handleLogout }) {

  const [open, setOpen] = useState(false);

  // Close Sidebar
  const closeSidebar = () => {
    setOpen(false);
  };

  return (
    <>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-5 left-5 z-50 bg-blue-600 p-2 rounded-lg shadow-lg"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[250px]
          bg-gray-900 border-r border-gray-800
          p-5 flex flex-col justify-between
          transition-transform duration-300

          ${open ? "translate-x-0" : "-translate-x-full"}

          md:translate-x-0 md:static
        `}
      >

        {/* Top */}
        <div>

          {/* Header */}
          <div className="flex items-center justify-between mb-10">

            <h1 className="text-3xl font-bold text-blue-500">
              PrepTrack
            </h1>

            {/* Close Button */}
            <button
              onClick={closeSidebar}
              className="md:hidden"
            >
              <X size={24} />
            </button>

          </div>

          {/* Menu */}
          <div className="space-y-3">

            <div
              onClick={closeSidebar}
              className="flex items-center gap-3 bg-blue-600 p-3 rounded-lg cursor-pointer"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>

            <div
              onClick={closeSidebar}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
            >
              <BookOpen size={20} />
              <span>Questions</span>
            </div>

            <div
              onClick={closeSidebar}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
            >
              <BarChart3 size={20} />
              <span>Stats</span>
            </div>

            <div
              onClick={closeSidebar}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
            >
              <Settings size={20} />
              <span>Settings</span>
            </div>

          </div>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 p-3 rounded-lg"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </>
  );
}

export default Sidebar;