import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

function ThemeToggle({ className }) {

  const [darkMode,
  setDarkMode] =
    useState(

      localStorage.getItem(
        "theme"
      ) === "dark"

    );

  // Apply Theme
  useEffect(() => {

    if (darkMode) {

      document.documentElement
        .classList.add(
          "dark"
        );

      localStorage.setItem(
        "theme",
        "dark"
      );

    } else {

      document.documentElement
        .classList.remove(
          "dark"
        );

      localStorage.setItem(
        "theme",
        "light"
      );
    }

  }, [darkMode]);

  return (

    <button

      aria-label="Toggle Theme"

      onClick={() =>
        setDarkMode(
          !darkMode
        )
      }

      className={
        className ||
        "fixed top-4 md:top-6 right-4 md:right-6 z-[100] p-3 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow-lg transition duration-300"
      }
    >

          {
            darkMode

              ? <Sun size={22} />

              : <Moon size={22} />
          }
   
    </button>
      );
}

export default ThemeToggle;