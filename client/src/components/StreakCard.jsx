import {
  useEffect,
  useState,
} from "react";

function StreakCard({ questions = [] }) {

  const [streak,
  setStreak] =
    useState(0);

  useEffect(() => {

    const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      setStreak(
        user?.streak || 0
      );

  }, []);

  const solvedToday = questions.some(
        (q) =>
          q.status === "Solved" &&
          new Date(q.updatedAt).toDateString() ===
            new Date().toDateString()
      );

  return (

    <div
      className="
        bg-gradient-to-r
        from-orange-500
        to-red-500

        p-6
        rounded-2xl

        shadow-lg

        text-white

        mb-8

        transition
        duration-300
      "
    >

      {/* Top */}
      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-bold
              mb-2
            "
          >

            Daily Streak 🔥

          </h2>

          <p
            className="
              text-5xl
              font-extrabold
            "
          >

            {streak} {streak === 1 ? "Day" : "Days"}

          </p>

        </div>

        {/* Fire Emoji */}
        <div
          className="
            text-6xl
            animate-pulse
          "
        >

          🔥

        </div>

      </div>

      {/* Bottom Text */}
      <p
  className="
    mt-5
    text-lg
    text-orange-100
  "
>
  {
    streak === 0

      ? "Start your DSA journey today 💪"

      : solvedToday

      ? "Great job! You solved a question today 🎉"

      : "Solve at least 1 question today to continue your streak 🚀"
  }
</p>

      {/* Progress Line */}
      <div
        className="
          w-full
          h-2

          bg-white/30

          rounded-full

          mt-5
          overflow-hidden
        "
      >

        <div

          className="
            h-full
            bg-white

            rounded-full

            transition-all
            duration-500
          "

          style={{
            width:
              `${Math.min(
                streak * 10,
                100
              )}%`
          }}

        />

      </div>

    </div>
  );
}

export default StreakCard;