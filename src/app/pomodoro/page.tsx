"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings, Coffee, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function PomodoroPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  
  const modes = {
    work: { time: 25 * 60, label: "Focus Time", icon: Brain, color: "text-cyan-400", bg: "bg-cyan-400" },
    shortBreak: { time: 5 * 60, label: "Short Break", icon: Coffee, color: "text-emerald-400", bg: "bg-emerald-400" },
    longBreak: { time: 15 * 60, label: "Long Break", icon: Coffee, color: "text-blue-400", bg: "bg-blue-400" },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Optional: play sound here
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modes[mode].time);
  };

  const switchMode = (newMode: keyof typeof modes) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(modes[newMode].time);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;
  const CurrentIcon = modes[mode].icon;

  return (
    <div className="p-6 md:p-10 min-h-full flex flex-col items-center justify-center relative">
      <div className="w-full max-w-2xl text-center mb-12 mt-10">
        <p className="uppercase tracking-[0.4em] text-cyan-400 text-sm font-semibold mb-2">
          Productivity
        </p>
        <h1 className="text-4xl md:text-5xl font-black">
          Pomodoro <span className="text-cyan-400">Timer</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Boost your focus and productivity with the Pomodoro technique.
        </p>
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-[40px] w-full max-w-md relative overflow-hidden border border-white/10 shadow-2xl">
        {/* Progress Background */}
        <div 
          className="absolute bottom-0 left-0 right-0 opacity-10 transition-all duration-1000 ease-linear"
          style={{ height: `${progress}%`, backgroundColor: modes[mode].color === 'text-cyan-400' ? '#22d3ee' : modes[mode].color === 'text-emerald-400' ? '#34d399' : '#60a5fa' }}
        />

        <div className="flex justify-center gap-2 md:gap-4 mb-10 relative z-10">
          {(Object.keys(modes) as Array<keyof typeof modes>).map((k) => (
            <button
              key={k}
              onClick={() => switchMode(k)}
              className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                mode === k 
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-md' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {modes[k].label}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center relative z-10 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <CurrentIcon className={`w-8 h-8 ${modes[mode].color}`} />
          </div>
          <div className="text-7xl md:text-8xl font-black tabular-nums tracking-tight">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 relative z-10">
          <button
            onClick={resetTimer}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isRunning 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 shadow-red-500/20 border border-red-500/30' 
                : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/25 border border-cyan-400/50'
            }`}
          >
            {isRunning ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all text-slate-300 hover:text-white">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
