import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";
import Sidebar from "../components/Sidebar";

import {
  getQuestions,
} from "../services/questionService";

function Questions() {

  const [questions,
    setQuestions] =
    useState([]);

  const [sidebarOpen,
    setSidebarOpen] =
    useState(false);

  // Fetch Questions
  const fetchQuestions =
    async () => {

      try {

        const data =
          await getQuestions();

        setQuestions(data);

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    fetchQuestions();

  }, []);

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

              Questions

            </h1>

          </div>

        {/* Questions Grid */}
        <div className="grid gap-6">

          {
            questions.map(
              (question) => (

                <div

                  key={question._id}

                  className="
                    bg-gray-200
                    dark:bg-gray-800

                    p-6
                    rounded-xl

                    border
                    border-gray-300
                    dark:border-gray-700

                    shadow-md

                    transition
                    duration-300
                  "
                >

                  {/* Top */}
                  <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        justify-between
                        items-start
                        gap-4
                      "
                  >

                    <div>

                      {/* Title */}
                      <h2
                        className="
                          text-2xl
                          font-semibold

                          text-black
                          dark:text-white
                        "
                      >

                        {question.title}

                      </h2>

                      {/* Topic */}
                      <p
                        className="
                          text-gray-700
                          dark:text-gray-300
                          mt-1
                        "
                      >

                        {question.topic}

                      </p>

                    </div>

                    {/* Difficulty */}
                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        self-start
                        text-sm
                        text-white

                        ${
                          question.difficulty ===
                          "Easy"

                            ? "bg-green-500"

                          : question.difficulty ===
                            "Medium"

                            ? "bg-yellow-500"

                            : "bg-red-500"
                        }
                      `}
                    >

                      {question.difficulty}

                    </span>

                  </div>

                  {/* Status */}
                  <div className="mt-4">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-lg
                        text-sm
                        text-white

                        ${
                          question.status ===
                          "Solved"

                            ? "bg-green-600"

                          : question.status ===
                            "Pending"

                            ? "bg-yellow-600"

                            : "bg-purple-600"
                        }
                      `}
                    >

                      {question.status}

                    </span>

                  </div>

                  {/* Open Problem */}
                  {
                    question.link && (

                      <a

                        href={question.link}

                        target="_blank"

                        rel="noreferrer"

                        className="
                          inline-block
                          mt-4

                          text-blue-500
                          hover:text-blue-700

                          font-medium

                          transition
                          duration-300
                        "
                      >

                        🔗 Open Problem

                      </a>

                    )
                  }

                </div>

              )
            )
          }

        </div>

      </div>

    </div>
    
  );
}

export default Questions;