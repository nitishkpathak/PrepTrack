import { useMemo } from "react";

function ContributionCalendar({ questions = [] }) {
  const { weeks, solveMap, totalSolvedLastYear } = useMemo(() => {
    // 1. Gather all solves and map to local YYYY-MM-DD
    const map = {};
    let solvedCount = 0;
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setDate(today.getDate() - 365);

    questions.forEach((q) => {
      if (q.status === "Solved") {
        const date = new Date(q.solvedAt || q.updatedAt);
        // Map to local date string YYYY-MM-DD
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;
        map[dateStr] = (map[dateStr] || 0) + 1;

        if (date >= oneYearAgo && date <= today) {
          solvedCount++;
        }
      }
    });

    // 2. Generate days starting from Sunday 365 days ago to Today
    const days = [];
    const startDate = new Date();
    startDate.setDate(today.getDate() - 365);
    // Align to the preceding Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const tempDate = new Date(startDate);
    // Set hours to noon to avoid daylight saving shifts issues
    tempDate.setHours(12, 0, 0, 0);

    // Generate up to today (including Sunday alignment)
    while (tempDate <= today || tempDate.toDateString() === today.toDateString()) {
      const yyyy = tempDate.getFullYear();
      const mm = String(tempDate.getMonth() + 1).padStart(2, "0");
      const dd = String(tempDate.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      days.push({
        dateStr,
        dayOfWeek: tempDate.getDay(),
        monthIndex: tempDate.getMonth(),
        monthName: months[tempDate.getMonth()],
        formattedDate: tempDate.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });

      tempDate.setDate(tempDate.getDate() + 1);
    }

    // 3. Group days into weeks of 7
    const groupedWeeks = [];
    for (let i = 0; i < days.length; i += 7) {
      groupedWeeks.push(days.slice(i, i + 7));
    }

    return {
      weeks: groupedWeeks,
      solveMap: map,
      totalSolvedLastYear: solvedCount,
    };
  }, [questions]);

  // Determine background color based on solve count
  const getColorClass = (count) => {
    if (count === 0) return "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700";
    if (count === 1) return "bg-green-200 dark:bg-green-900/60 text-green-800 border border-green-300/30";
    if (count === 2) return "bg-green-400 dark:bg-green-700/80 text-white";
    if (count === 3) return "bg-green-600 dark:bg-green-500 text-white";
    return "bg-green-800 dark:bg-green-300 text-white"; // 4+ solves
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-900 p-6 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-md transition duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
            📊 Coding Contribution Calendar
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {totalSolvedLastYear} question{totalSolvedLastYear === 1 ? "" : "s"} solved in the last year
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 select-none">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-800" />
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/60" />
          <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700/80" />
          <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
          <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-300" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="min-w-[720px] flex flex-col">
          {/* Months Header */}
          <div className="flex pl-8 mb-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 h-4 relative select-none">
            {weeks.map((week, wIdx) => {
              const firstDay = week[0];
              const prevWeek = weeks[wIdx - 1];
              // Show month label if it's the first week or the month changed from the previous week
              const showLabel = !prevWeek || firstDay.monthIndex !== prevWeek[0].monthIndex;
              if (showLabel) {
                return (
                  <div key={wIdx} className="absolute" style={{ left: `${wIdx * 14.5 + 32}px` }}>
                    {firstDay.monthName}
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="flex items-start">
            {/* Days labels */}
            <div className="flex flex-col justify-between text-[9px] font-bold text-gray-400 dark:text-gray-500 h-[98px] pr-3 pt-[2px] select-none w-8">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* Weeks Grid */}
            <div className="flex gap-[2.5px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[2.5px]">
                  {week.map((day) => {
                    const count = solveMap[day.dateStr] || 0;
                    const colorClass = getColorClass(count);
                    return (
                      <div
                        key={day.dateStr}
                        className={`w-[11.5px] h-[11.5px] rounded-[2px] ${colorClass} cursor-pointer hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all duration-150`}
                        title={`${count} solved on ${day.formattedDate}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContributionCalendar;
