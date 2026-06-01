import { useEffect, useState } from "react";

function StreakCard({ questions = [] }) {
  const [streak, setStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2);

  const loadStreak = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setStreak(user?.streak || 0);
    setDailyGoal(user?.dailyGoal || 2);
  };

  useEffect(() => {
    loadStreak();
    window.addEventListener("userUpdated", loadStreak);
    return () => {
      window.removeEventListener("userUpdated", loadStreak);
    };
  }, []);

  // Calculate solved count today
  const solvedTodayCount = questions.filter(
    (q) =>
      q.status === "Solved" &&
      new Date(q.updatedAt).toDateString() === new Date().toDateString()
  ).length;

  const solvedToday = solvedTodayCount > 0;
  const goalPercentage = Math.min(Math.round((solvedTodayCount / dailyGoal) * 100), 100);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 md:p-8 rounded-2xl shadow-lg text-white mb-8 transition duration-300">
      {/* Top Section - Daily Streak */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            Daily Streak 🔥
          </h2>
          <p className="text-5xl font-extrabold">
            {streak} {streak === 1 ? "Day" : "Days"}
          </p>
        </div>
        <div className="text-6xl animate-pulse">🔥</div>
      </div>

      {/* Bottom Text - Consistency */}
      <p className="mt-5 text-lg text-orange-100 font-medium">
        {streak === 0
          ? "Start your DSA journey today 💪"
          : solvedToday
          ? "Great job! You solved at least one question today to keep your streak alive 🎉"
          : "Solve at least 1 question today to continue your streak 🚀"}
      </p>

      {/* Streak Progress Line */}
      <div className="w-full h-2 bg-white/30 rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${Math.min(streak * 10, 100)}%` }}
        />
      </div>

      {/* Today's Goal Progress Section */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-orange-100">
            Today's Goal Tracker 🎯
          </h3>
          <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full text-white">
            {solvedTodayCount >= dailyGoal
              ? "Goal Achieved! 🏆"
              : `Progress: ${solvedTodayCount}/${dailyGoal} Solved`}
          </span>
        </div>

        {/* Goal Feedback Message */}
        <p className="text-base text-orange-50">
          {solvedTodayCount >= dailyGoal
            ? "Fantastic! You have successfully achieved your daily practice goal today! 🏆"
            : solvedTodayCount > 0
            ? `Keep going! You are at ${goalPercentage}% of your daily goal. Solve ${dailyGoal - solvedTodayCount} more to hit it! 💪`
            : `Solve ${dailyGoal} ${dailyGoal === 1 ? "question" : "questions"} today to achieve your study target! 🚀`}
        </p>

        {/* Goal Progress Bar */}
        <div className="w-full h-3 bg-white/20 rounded-full mt-4 overflow-hidden p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              solvedTodayCount >= dailyGoal ? "bg-green-300" : "bg-yellow-300"
            }`}
            style={{ width: `${goalPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default StreakCard;