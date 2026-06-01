import React from "react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

function QuestionList({
  fetching,
  filteredQuestions,
  expandedQuestion,
  setExpandedQuestion,
  handleStatusChange,
  handleFavorite,
  handleEdit,
  handleDelete,
}) {
  return (
    <div>
      <h2
        className="
          text-2xl
          font-bold
          mb-4
        "
      >
        Your Questions
      </h2>

      <div className="grid gap-4">
        {fetching ? (
          <div className="text-center py-10 bg-gray-200 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-800 rounded-2xl animate-pulse">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              🔄 Loading questions from server...
            </h3>
            <p className="text-sm text-gray-400 mt-2">
              Please wait, initial load may take a moment if server is waking up
            </p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-10 bg-gray-200 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-800 rounded-2xl">
            <h3 className="text-xl font-bold mb-2">No Questions Found 😄</h3>
            <p className="text-gray-400">Add a new question above to start tracking!</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question._id}
              id={question._id}
              className="
                p-4
                rounded-xl
                border
                bg-gray-200
                dark:bg-gray-800
                border-gray-300
                dark:border-gray-700
                hover:border-blue-500
                transition
              "
            >
              <div
                className="
                  flex
                  flex-col
                  md:flex-row
                  justify-between
                  items-start
                  gap-4
                  mb-3
                "
              >
                {/* Title */}
                <h3 className="text-xl font-semibold">{question.title}</h3>

                {/* Topic */}
                <p className="text-gray-700 dark:text-gray-400 text-sm mt-1">
                  {question.topic}
                </p>

                {/* Difficulty */}
                <p className="mt-2">
                  Difficulty:
                  <span
                    className={`
                      ml-2
                      px-2
                      py-1
                      rounded-lg
                      text-sm
                      ${
                        question.difficulty === "Easy"
                          ? "bg-green-600"
                          : question.difficulty === "Medium"
                          ? "bg-yellow-700 text-white"
                          : "bg-red-600"
                      }
                    `}
                  >
                    {question.difficulty}
                  </span>
                </p>
              </div>

              {/* Status */}
              <div className="mt-3">
                <label className="mr-2 text-black dark:text-white">
                  Status:
                </label>
                <select
                  aria-label="Update Question Status"
                  value={question.status}
                  onChange={(e) => handleStatusChange(question, e.target.value)}
                  className={`
                    p-2
                    rounded-lg
                    outline-none
                    cursor-pointer
                    border
                    ${
                      question.status === "Solved"
                        ? "bg-green-600 text-white border-green-500"
                        : question.status === "Revision"
                        ? "bg-yellow-700 text-white border-yellow-400"
                        : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white border-gray-400 dark:border-gray-600"
                    }
                  `}
                >
                  <option value="Pending">Pending</option>
                  <option value="Solved">Solved</option>
                  <option value="Revision">Revision</option>
                </select>
              </div>

              {/* Notes */}
              <div className="mt-2">
                <p
                  className={`
                    text-gray-700
                    dark:text-gray-300
                    whitespace-pre-wrap
                    leading-7
                    ${expandedQuestion === question._id ? "" : "line-clamp-3"}
                  `}
                >
                  {question.notes}
                </p>

                {question.notes && question.notes.length > 150 && (
                  <button
                    aria-label="Expand Question Notes"
                    onClick={() =>
                      setExpandedQuestion(
                        expandedQuestion === question._id ? null : question._id
                      )
                    }
                    className="
                      mt-2
                      text-blue-300
                      hover:text-blue-200
                      text-sm
                      cursor-pointer
                    "
                  >
                    {expandedQuestion === question._id ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* Dates */}
              <div className="flex flex-wrap gap-2 mt-4">
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-lg
                    text-sm
                    bg-white
                    dark:bg-gray-700
                    text-gray-700
                    dark:text-gray-300
                    border
                    border-gray-300
                    dark:border-gray-600
                  "
                >
                  <span className="text-blue-300">Added:</span>
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    bg-gray-200
                    dark:bg-gray-700
                    px-3
                    py-2
                    rounded-lg
                    text-sm
                    text-gray-700
                    dark:text-gray-300
                    border
                    border-gray-300
                    dark:border-gray-600
                    transition
                    duration-300
                  "
                >
                  <span className="text-green-500">Updated:</span>
                  <span>
                    {formatDistanceToNow(new Date(question.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {/* Favorite Button */}
                <button
                  aria-label="Mark as Favorite"
                  onClick={() => handleFavorite(question)}
                  className="
                    mt-4
                    bg-yellow-700
                    hover:bg-yellow-800
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    cursor-pointer
                  "
                >
                  {question.favorite ? "⭐ Favorited" : "☆ Favorite"}
                </button>

                {/* Copy Notes Button */}
                <button
                  aria-label="Copy Notes"
                  onClick={() => {
                    navigator.clipboard.writeText(question.notes || "");
                    toast.success("Notes Copied 😄");
                  }}
                  className="
                    mt-4
                    bg-blue-600
                    hover:bg-blue-700
                    px-4
                    py-2
                    rounded-lg
                    cursor-pointer
                  "
                >
                  📋 Copy
                </button>

                {/* Edit Button */}
                <button
                  aria-label="Edit Question"
                  onClick={() => handleEdit(question)}
                  className="
                    mt-4
                    mr-3
                    bg-yellow-800
                    hover:bg-yellow-900
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    cursor-pointer
                  "
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  aria-label="Delete Question"
                  onClick={() => handleDelete(question._id)}
                  className="
                    mt-4
                    bg-red-600
                    hover:bg-red-700
                    px-4
                    py-2
                    rounded-lg
                    cursor-pointer
                  "
                >
                  Delete
                </button>

                {question.link && (
                  <a
                    href={question.link}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      mt-4
                      bg-blue-600
                      hover:bg-blue-700
                      px-4
                      py-2
                      rounded-lg
                      cursor-pointer
                      inline-block
                    "
                  >
                    🔗 Open Problem
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default QuestionList;
