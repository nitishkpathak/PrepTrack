import {

  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,

} from "recharts";

function ProgressChart({ questions }) {

  const solved =
    questions.filter(
      (q) => q.status === "Solved"
    ).length;

  const pending =
    questions.filter(
      (q) => q.status === "Pending"
    ).length;

  const revision =
    questions.filter(
      (q) => q.status === "Revision"
    ).length;

  const data = [

    {
      name: "Solved",
      value: solved,
    },

    {
      name: "Pending",
      value: pending,
    },

    {
      name: "Revision",
      value: revision,
    },

  ];

  const COLORS = [

    "#22c55e",

    "#eab308",

    "#a855f7",

  ];

  return (

    <div
      className="
        bg-gray-200
        dark:bg-gray-900

        border
        border-gray-300
        dark:border-gray-800

        rounded-xl
        p-6
        mt-8

        shadow-lg

        transition
        duration-300
      "
    >

      {/* Heading */}
      <h2
        className="
          text-2xl
          font-bold
          mb-6

          text-black
          dark:text-white
        "
      >

        Progress Analytics 📊

      </h2>

      {/* Chart */}
      <div
          className="
            w-full
            h-[350px]
            min-h-[350px]
          "
        >

        <ResponsiveContainer
            width="100%"
            height={350}
          >

          <PieChart>

            <Pie

              data={data}

              dataKey="value"

              outerRadius={120}

              label

            >

              {
                data.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell

                      key={index}

                      fill={
                        COLORS[index]
                      }

                    />

                  )
                )
              }

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* Custom Stats */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
          mt-6
        "
      >

        {/* Solved */}
        <div
          className="
            bg-white
            dark:bg-gray-800

            rounded-xl
            p-4

            text-center

            border
            border-gray-300
            dark:border-gray-700

            transition
            duration-300
          "
        >

          <div
            className="
              w-4
              h-4
              rounded-full
              bg-green-500
              mx-auto
              mb-2
            "
          />

          <p
            className="
              text-gray-700
              dark:text-gray-400
            "
          >

            Solved

          </p>

          <h3
            className="
              text-2xl
              font-bold
              text-green-400
            "
          >

            {solved}

          </h3>

        </div>

        {/* Pending */}
        <div
          className="
            bg-white
            dark:bg-gray-800

            rounded-xl
            p-4

            text-center

            border
            border-gray-300
            dark:border-gray-700

            transition
            duration-300
          "
        >

          <div
            className="
              w-4
              h-4
              rounded-full
              bg-yellow-500
              mx-auto
              mb-2
            "
          />

          <p
            className="
              text-gray-700
              dark:text-gray-400
            "
          >

            Pending

          </p>

          <h3
            className="
              text-2xl
              font-bold
              text-yellow-400
            "
          >

            {pending}

          </h3>

        </div>

        {/* Revision */}
        <div
          className="
            bg-white
            dark:bg-gray-800

            rounded-xl
            p-4

            text-center

            border
            border-gray-300
            dark:border-gray-700

            transition
            duration-300
          "
        >

          <div
            className="
              w-4
              h-4
              rounded-full
              bg-purple-500
              mx-auto
              mb-2
            "
          />

          <p
            className="
              text-gray-700
              dark:text-gray-400
            "
          >

            Revision

          </p>

          <h3
            className="
              text-2xl
              font-bold
              text-purple-400
            "
          >

            {revision}

          </h3>

        </div>

      </div>

    </div>
  );
}

export default ProgressChart;