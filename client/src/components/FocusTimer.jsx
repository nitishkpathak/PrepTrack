import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Award } from "lucide-react";

function FocusTimer() {
  const [preset, setPreset] = useState(45); // Default 45 minutes
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Sync timer when preset changes
  useEffect(() => {
    setSecondsLeft(preset * 60);
    setIsActive(false);
    setCompleted(false);
  }, [preset]);

  // Audio trigger using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Note 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.frequency.value = 587.33; // D5
      gain1.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.3);

      // Note 2 (slightly delayed)
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.value = 880; // A5
        gain2.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc2.start(audioCtx.currentTime);
        osc2.stop(audioCtx.currentTime + 0.5);
      }, 250);
    } catch (err) {
      console.warn("Web Audio API failed or blocked:", err);
    }
  };

  // Timer countdown hook
  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setCompleted(true);
      playBeep();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    setCompleted(false);
  };

  const resetTimer = () => {
    setSecondsLeft(preset * 60);
    setIsActive(false);
    setCompleted(false);
  };

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Circular progress dimensions
  const totalDuration = preset * 60;
  const progressRatio = secondsLeft / totalDuration;
  const strokeDash = 2 * Math.PI * 54; // Radius is 54
  const strokeDashoffset = strokeDash * (1 - progressRatio);

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-md transition duration-300 w-full text-center relative overflow-hidden">
      {/* Title */}
      <h3 className="text-lg font-bold text-black dark:text-white flex items-center justify-center gap-2 mb-1">
        ⏱️ DSA Practice Timer
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
        Practice questions under standard interview time limits
      </p>

      {/* Circle Countdown Display */}
      <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Inner grey track */}
          <circle
            cx="60"
            cy="60"
            r="54"
            className="stroke-gray-200 dark:stroke-gray-800"
            strokeWidth="5"
            fill="transparent"
          />
          {/* Active progress track */}
          <circle
            cx="60"
            cy="60"
            r="54"
            className="stroke-blue-600 dark:stroke-blue-500 transition-all duration-1000 ease-linear"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={strokeDash}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Time Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {completed ? (
            <div className="flex flex-col items-center animate-bounce">
              <Award className="text-green-500 w-8 h-8" />
              <span className="text-xs font-bold text-green-500 mt-1">Finished!</span>
            </div>
          ) : (
            <>
              <span className="text-3xl font-extrabold tracking-tight font-mono text-black dark:text-white">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-[10px] text-gray-450 dark:text-gray-500 uppercase font-semibold mt-0.5 tracking-wider">
                {isActive ? "Running" : "Paused"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Preset Selection Buttons */}
      <div className="flex justify-center gap-2.5 mb-6">
        {[15, 30, 45, 60].map((mins) => (
          <button
            key={mins}
            onClick={() => setPreset(mins)}
            disabled={isActive}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition cursor-pointer select-none ${
              preset === mins
                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {mins}m
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center items-center gap-4">
        {/* Reset */}
        <button
          onClick={resetTimer}
          className="p-2.5 rounded-xl bg-gray-150 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-gray-650 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer"
          title="Reset timer"
        >
          <RotateCcw size={18} />
        </button>

        {/* Start/Pause */}
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-md transition cursor-pointer ${
            isActive
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isActive ? (
            <>
              <Pause size={18} />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>Start</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default FocusTimer;
