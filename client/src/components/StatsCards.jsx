function StatsCards({ questions }) {

  // Total
  const totalQuestions =
    questions.length;

  // Solved
  const solvedQuestions =
    questions.filter(
      (q) => q.status === "Solved"
    ).length;

  // Pending
  const pendingQuestions =
    questions.filter(
      (q) => q.status === "Pending"
    ).length;

  // Revision
  const revisionQuestions =
    questions.filter(
      (q) => q.status === "Revision"
    ).length;

  // Progress %
  const progressPercentage =
    totalQuestions === 0

      ? 0

      : Math.round(

          (
            solvedQuestions
            /
            totalQuestions
          ) * 100

        );

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-6
        mb-8
      "
    >

      {/* Total */}
      <div
        className="
          bg-gray-200
          dark:bg-gray-900

          p-6
          rounded-xl

          border
          border-gray-300
          dark:border-gray-800

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

          Total Questions

        </h2>

        <p
          className="
            text-4xl
            font-bold
            mt-3

            text-black
            dark:text-white
          "
        >

          {totalQuestions}

        </p>

      </div>

      {/* Solved */}
      <div
        className="
          bg-gray-200
          dark:bg-gray-900

          p-6
          rounded-xl

          border
          border-gray-300
          dark:border-gray-800

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

          Solved

        </h2>

        <p
          className="
            text-4xl
            font-bold
            mt-3
            text-green-400
          "
        >

          {solvedQuestions}

        </p>

      </div>

      {/* Pending */}
      <div
        className="
          bg-gray-200
          dark:bg-gray-900

          p-6
          rounded-xl

          border
          border-gray-300
          dark:border-gray-800

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

          Pending

        </h2>

        <p
          className="
            text-4xl
            font-bold
            mt-3
            text-yellow-400
          "
        >

          {pendingQuestions}

        </p>

      </div>

      {/* Revision */}
      <div
        className="
          bg-gray-200
          dark:bg-gray-900

          p-6
          rounded-xl

          border
          border-gray-300
          dark:border-gray-800

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

          Revision

        </h2>

        <p
          className="
            text-4xl
            font-bold
            mt-3
            text-purple-400
          "
        >

          {revisionQuestions}

        </p>

      </div>

      {/* Progress Section */}
      <div
        className="
          bg-gray-200
          dark:bg-gray-900

          p-6
          rounded-xl

          border
          border-gray-300
          dark:border-gray-800

          mt-6
          md:col-span-2

          shadow-md

          transition
          duration-300
        "
      >

        {/* Top */}
        <div
          className="
            flex
            justify-between
            mb-3
          "
        >

          <h2
            className="
              text-lg
              font-bold
              text-blue-500
            "
          >

            Overall Progress

          </h2>

          <span
            className="
              text-blue-500
              font-semibold
            "
          >

            {progressPercentage}%

          </span>

        </div>

        {/* Progress Bar */}
        <div
          className="
            w-full
            h-4

            bg-gray-300
            dark:bg-gray-700

            rounded-full
            overflow-hidden
          "
        >

          <div

            className="
              h-full
              bg-blue-500

              transition-all
              duration-500
            "

            style={{
              width:
                `${progressPercentage}%`
            }}

          />

        </div>

      </div>

    </div>
  );
}

export default StatsCards;