import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

function Sidebar({

  open,
  closeSidebar,

}) {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  // Profile State
  const [profile,
  setProfile] =
    useState({

      name: "",
      role: "",
      profilePic: "",

    });

// Load Profile
useEffect(() => {

  const loadUser = () => {

    const savedUser =
      localStorage.getItem(
        "user"
      );

    if (savedUser) {

      setProfile(
        JSON.parse(savedUser)
      );

    }
  };

  loadUser();

  // Listen to custom 'userUpdated' event from Settings page
  window.addEventListener("userUpdated", loadUser);

  return () => {
    window.removeEventListener("userUpdated", loadUser);
  };

}, []);

  // Handle Logout
  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    navigate("/login");
  };

  return (

    <>

      {/* Overlay */}
      {
        open && (

          <div
            onClick={closeSidebar}
            className="
              fixed
              inset-0
              bg-black/50
              z-40
              md:hidden
            "
          />

        )
      }

      {/* Sidebar */}
      <div
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-[260px]

          bg-gray-200
          dark:bg-gray-900

          text-black
          dark:text-white

          border-r
          border-gray-300
          dark:border-gray-800

          flex
          flex-col
          justify-between

          transition-transform
          duration-300

          ${
            open

              ? "translate-x-0"

              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >

        {/* Top */}
        <div>

          {/* Header */}
          <div
            className="
              flex
              items-center
              justify-between
              p-5

              border-b
              border-gray-300
              dark:border-gray-800
            "
          >

            <h1
              className="
                text-3xl
                font-bold
                text-blue-500
              "
            >

              PrepTrack

            </h1>

            {/* Close Button */}
            <button
              aria-label="Close Sidebar"
              onClick={closeSidebar}
              className="
                md:hidden
                cursor-pointer
              "
            >

              <X size={24} />

            </button>

          </div>

          {/* Profile */}
          <div
            className="
              flex
              flex-col
              items-center
              p-5

              border-b
              border-gray-300
              dark:border-gray-800
            "
          >

            <img

              src={
                  profile.profilePic
                    ? profile.profilePic
                    : "/default-profile.png"
                }

              alt="Profile"

              className="
                w-20
                h-20
                rounded-full
                object-cover
                border-4
                border-blue-500
                mb-3
              "
            />

            <h2
              className="
                text-lg
                font-semibold
              "
            >

              {
                profile.name ||

                "Your Name"
              }

            </h2>

            <p
              className="
                text-sm
                text-gray-700
                dark:text-gray-400
                mt-1
              "
            >

              {
                profile.role ||

                "Developer"
              }

            </p>

          </div>

          {/* Menu */}
          <div className="p-5 space-y-3">

            {/* Dashboard */}
            <Link to="/dashboard">

              <div
                className={`
                  flex
                  items-center
                  gap-3
                  p-3
                  rounded-lg
                  cursor-pointer
                  transition

                  ${
                    location.pathname ===
                    "/dashboard"

                      ? "bg-blue-600 text-white"

                      : "hover:bg-gray-300 dark:hover:bg-gray-800"
                  }
                `}
              >

                <LayoutDashboard
                  size={20}
                />

                <span>
                  Dashboard
                </span>

              </div>

            </Link>

            {/* Questions */}
            <Link to="/questions">

              <div
                className={`
                  flex
                  items-center
                  gap-3
                  p-3
                  rounded-lg
                  cursor-pointer
                  transition

                  ${
                    location.pathname ===
                    "/questions"

                      ? "bg-blue-600 text-white"

                      : "hover:bg-gray-300 dark:hover:bg-gray-800"
                  }
                `}
              >

                <BookOpen
                  size={20}
                />

                <span>
                  Questions
                </span>

              </div>

            </Link>

            {/* Stats */}
            <Link to="/stats">

              <div
                className={`
                  flex
                  items-center
                  gap-3
                  p-3
                  rounded-lg
                  cursor-pointer
                  transition

                  ${
                    location.pathname ===
                    "/stats"

                      ? "bg-blue-600 text-white"

                      : "hover:bg-gray-300 dark:hover:bg-gray-800"
                  }
                `}
              >

                <BarChart3
                  size={20}
                />

                <span>
                  Stats
                </span>

              </div>

            </Link>

            {/* Settings */}
            <Link to="/settings">

              <div
                className={`
                  flex
                  items-center
                  gap-3
                  p-3
                  rounded-lg
                  cursor-pointer
                  transition

                  ${
                    location.pathname ===
                    "/settings"

                      ? "bg-blue-600 text-white"

                      : "hover:bg-gray-300 dark:hover:bg-gray-800"
                  }
                `}
              >

                <Settings
                  size={20}
                />

                <span>
                  Settings
                </span>

              </div>

            </Link>

          </div>

        </div>

        {/* Logout & Theme Toggle */}
        <div
          className="
            p-5
            border-t
            border-gray-300
            dark:border-gray-800
            space-y-4
          "
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Theme Mode
            </span>
            <ThemeToggle className="p-2 rounded-lg bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 text-black dark:text-white transition duration-300 cursor-pointer" />
          </div>

          <button
            onClick={() => {
              closeSidebar?.();
              handleLogout();
            }}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-red-600
              hover:bg-red-700
              text-white
              p-3
              rounded-lg
              cursor-pointer
            "
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

      </div>

    </>
  );
}

export default Sidebar;