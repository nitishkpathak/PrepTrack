import { useEffect, useState } from "react";
import { Menu } from "lucide-react";


import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCards";
import ProgressChart from "../components/ProgressChart";
import StreakCard from "../components/StreakCard";

import {
  getQuestions,
} from "../services/questionService";

function Stats() {

  const [questions,
  setQuestions] =
    useState([]);

  // Fetch Questions
const fetchQuestions =
  async () => {

    try {

      const data =
        await getQuestions();

      console.log(
        "Stats Questions:",
        data
      );

      setQuestions(data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchQuestions();

  }, []);

  const [sidebarOpen,
    setSidebarOpen] =
    useState(false);

  return (

    <div
      className="
        flex
        min-h-screen

        bg-white
        dark:bg-black

        text-black
        dark:text-white

        transition
        duration-300
      "
    >
      <ThemeToggle />

      {/* Sidebar */}
      <Sidebar
          open={sidebarOpen}
          closeSidebar={() =>
            setSidebarOpen(false)
          }
        />

      {/* Main */}
      <div
        className="
            flex-1
            p-4
            md:p-6
            md:ml-[260px]
          "
        >

            {/* Sticky Header */}
            <div
              className="
                sticky
                top-0
                z-20

                bg-white
                dark:bg-gray-950

                border-b
                border-gray-300
                dark:border-gray-800

                py-5
                mb-8

                backdrop-blur-md

                transition
                duration-300
              "
            >

            {/* Mobile Menu Button */}
            <button
              aria-label="Open Sidebar"
              onClick={() =>
                setSidebarOpen(true)
              }

              className="
                md:hidden

                p-2
                mb-4

                bg-blue-600
                text-white

                rounded-lg
                cursor-pointer
              "
            >

              <Menu size={20} />

            </button>

            <h1
              className="
                text-2xl
                md:text-3xl
                font-bold

                text-black
                dark:text-white
              "
            >

              Stats

            </h1>

          </div>

        {/* Streak */}
        <StreakCard questions={questions} />

        {/* Analytics Cards */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-6
            mb-10
          "
        >

          {/* Easy */}
          <div
            className="
              bg-gray-200
              dark:bg-gray-900

              p-6
              rounded-xl

              border
              border-green-500

              shadow-md

              transition
              duration-300
            "
          >

            <h2
              className="
                text-gray-700
                dark:text-gray-400
              "
            >

              Easy

            </h2>

            <p
              className="
                text-4xl
                font-bold
                text-green-400
                mt-3
              "
            >

              {
                questions.filter(
                  (q) =>
                    q.difficulty ===
                    "Easy"
                ).length
              }

            </p>

          </div>

          {/* Medium */}
          <div
            className="
              bg-gray-200
              dark:bg-gray-900

              p-6
              rounded-xl

              border
              border-yellow-500

              shadow-md

              transition
              duration-300
            "
          >

            <h2
              className="
                text-gray-700
                dark:text-gray-400
              "
            >

              Medium

            </h2>

            <p
              className="
                text-4xl
                font-bold
                text-yellow-400
                mt-3
              "
            >

              {
                questions.filter(
                  (q) =>
                    q.difficulty ===
                    "Medium"
                ).length
              }

            </p>

          </div>

          {/* Hard */}
          <div
            className="
              bg-gray-200
              dark:bg-gray-900

              p-6
              rounded-xl

              border
              border-red-500

              shadow-md

              transition
              duration-300
            "
          >

            <h2
              className="
                text-gray-700
                dark:text-gray-400
              "
            >

              Hard

            </h2>

            <p
              className="
                text-4xl
                font-bold
                text-red-400
                mt-3
              "
            >

              {
                questions.filter(
                  (q) =>
                    q.difficulty ===
                    "Hard"
                ).length
              }

            </p>

          </div>

          {/* Favorites */}
          <div
            className="
              bg-gray-200
              dark:bg-gray-900

              p-6
              rounded-xl

              border
              border-blue-500

              shadow-md

              transition
              duration-300
            "
          >

            <h2
              className="
                text-gray-700
                dark:text-gray-400
              "
            >

              Favorites

            </h2>

            <p
              className="
                text-4xl
                font-bold
                text-blue-400
                mt-3
              "
            >

              {
                questions.filter(
                  (q) =>
                    q.favorite
                ).length
              }

            </p>

          </div>

        </div>

        {/* Stats Cards */}
        <StatsCards
          questions={questions}
        />

        {/* Chart */}
        <ProgressChart
          questions={questions}
        />

      </div>

    </div>
  );
}

export default Stats;