import { useMemo, useState, useEffect, useRef } from "react";

function ContributionCalendar({ questions = [] }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { weeks, monthLabels, solveMap, totalSolvedLastYear } = useMemo(() => {
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
    tempDate.setHours(12, 0, 0, 0);

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

    // 3. Group days into weeks of 7, breaking on month boundary
    const groupedWeeks = [];
    let currentWeek = Array(7).fill(null);
    let lastMonthIndex = null;

    days.forEach((day) => {
      const dayOfWeek = day.dayOfWeek;
      const monthIndex = day.monthIndex;

      const isNewMonth = lastMonthIndex !== null && monthIndex !== lastMonthIndex;
      const isNewCalendarWeek = dayOfWeek === 0 || currentWeek[dayOfWeek] !== null;
      const isCurrentWeekEmpty = currentWeek.every(val => val === null);

      if ((isNewMonth || isNewCalendarWeek) && !isCurrentWeekEmpty) {
        groupedWeeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }

      currentWeek[dayOfWeek] = day;
      lastMonthIndex = monthIndex;
    });

    if (currentWeek.some(day => day !== null)) {
      groupedWeeks.push(currentWeek);
    }

    // 4. Calculate month labels start week indices
    const rawLabels = [];
    let lastMonthName = "";
    groupedWeeks.forEach((week, wIdx) => {
      const firstDay = week.find(day => day !== null);
      const hasMonthStart = week.some(day => day !== null && parseInt(day.dateStr.split("-")[2], 10) === 1);

      let monthNameToShow = "";
      if (wIdx === 0 && firstDay) {
        monthNameToShow = firstDay.monthName;
      } else if (hasMonthStart) {
        const startDay = week.find(day => day !== null && parseInt(day.dateStr.split("-")[2], 10) === 1);
        if (startDay) {
          monthNameToShow = startDay.monthName;
        }
      }

      if (monthNameToShow && monthNameToShow !== lastMonthName) {
        rawLabels.push({
          name: monthNameToShow,
          weekIndex: wIdx,
        });
        lastMonthName = monthNameToShow;
      }
    });

    // Filter labels to prevent overlap (ensure at least 3 weeks gap between labels)
    const filteredLabels = [];
    for (let i = 0; i < rawLabels.length; i++) {
      const current = rawLabels[i];
      const next = rawLabels[i + 1];
      if (next && next.weekIndex - current.weekIndex < 3) {
        // Skip current to favor the next full month
        continue;
      }
      filteredLabels.push(current);
    }

    return {
      weeks: groupedWeeks,
      monthLabels: filteredLabels,
      solveMap: map,
      totalSolvedLastYear: solvedCount,
    };
  }, [questions]);

  // Auto-scroll to the rightmost side (current day/month) on mount or layout change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [weeks]);

  // Determine background color based on solve count
  const getColorClass = (count) => {
    if (count === 0) return "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700";
    if (count === 1) return "bg-green-200 dark:bg-green-900/60 text-green-800 border border-green-300/30";
    if (count === 2) return "bg-green-400 dark:bg-green-700/80 text-white";
    if (count === 3) return "bg-green-600 dark:bg-green-500 text-white";
    return "bg-green-800 dark:bg-green-300 text-white"; // 4+ solves
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-md transition duration-300 w-full max-w-full overflow-hidden">
      {/* Title section */}
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

      <div ref={scrollContainerRef} className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="w-max mx-auto flex items-start">
          {/* Days labels */}
          <div className="flex flex-col gap-[4px] text-[9px] font-bold text-gray-500 dark:text-gray-500 pr-2 select-none w-8 pt-[22px]">
            <div className="h-[12px] flex items-center justify-end">Sun</div>
            <div className="h-[12px] flex items-center justify-end"></div>
            <div className="h-[12px] flex items-center justify-end">Tue</div>
            <div className="h-[12px] flex items-center justify-end"></div>
            <div className="h-[12px] flex items-center justify-end">Thu</div>
            <div className="h-[12px] flex items-center justify-end"></div>
            <div className="h-[12px] flex items-center justify-end">Sat</div>
          </div>

          {/* Calendar Grid Container */}
          <div className="flex flex-col flex-1">
            {/* Month Labels Row */}
            <div className="relative h-4 mb-1.5 select-none w-full">
              {monthLabels.map((ml, idx) => (
                <div
                  key={idx}
                  style={{ left: `${ml.weekIndex * 16}px` }}
                  className="absolute text-[10px] font-bold text-gray-500 dark:text-gray-400 text-left pl-[2px] whitespace-nowrap overflow-visible"
                >
                  {ml.name}
                </div>
              ))}
            </div>

            {/* Weeks Grid */}
            <div className="flex gap-[4px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[4px]">
                  {week.map((day, dIdx) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${wIdx}-${dIdx}`}
                          className="w-[12px] h-[12px] bg-transparent pointer-events-none select-none"
                        />
                      );
                    }
                    const count = solveMap[day.dateStr] || 0;
                    const colorClass = getColorClass(count);
                    return (
                      <div
                        key={day.dateStr}
                        className={`w-[12px] h-[12px] rounded-[2px] ${colorClass} cursor-pointer hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all duration-150`}
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
