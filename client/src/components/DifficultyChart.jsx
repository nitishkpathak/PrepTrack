import {

  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,

} from "recharts";

function DifficultyChart({
  questions,
}) {

  const easy =
    questions.filter(
      (q) =>
        q.difficulty === "Easy"
    ).length;

  const medium =
    questions.filter(
      (q) =>
        q.difficulty === "Medium"
    ).length;

  const hard =
    questions.filter(
      (q) =>
        q.difficulty === "Hard"
    ).length;

  const data = [

    {
      name: "Easy",
      value: easy,
    },

    {
      name: "Medium",
      value: medium,
    },

    {
      name: "Hard",
      value: hard,
    },

  ];

  return (

    <div
      className="
        bg-gray-200
        dark:bg-gray-900

        border
        border-gray-300
        dark:border-gray-800

        rounded-2xl
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

        Difficulty Analytics 📊

      </h2>

      {/* Chart */}
      <div
        className="
          h-[300px]
        "
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart data={data}>

            <XAxis

              dataKey="name"

              stroke="#9ca3af"
            />

            <YAxis
              stroke="#9ca3af"
            />

            <Tooltip />

            <Bar

              dataKey="value"

              fill="#3b82f6"

              radius={[
                10,
                10,
                0,
                0
              ]}

            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}

export default DifficultyChart;