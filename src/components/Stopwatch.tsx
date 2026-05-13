"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, TimerReset, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  // Fixed floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-50 w-14 h-14 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-transform hover:scale-105 active:scale-95"
      >
        <TimerReset className="w-6 h-6" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={cn(
            "fixed z-50 glass-card rounded-3xl border border-white/20 shadow-2xl overflow-hidden",
            isCompact 
              ? "bottom-24 right-6 md:bottom-10 md:right-10 w-64 p-4" 
              : "inset-x-6 top-1/4 max-w-sm mx-auto md:right-10 md:left-auto md:top-auto md:bottom-10 p-6"
          )}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <TimerReset className="w-4 h-4 text-cyan-400" />
              Stopwatch
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsCompact(!isCompact)}
                className="text-slate-400 hover:text-white"
              >
                {isCompact ? <Square className="w-4 h-4" /> : <Square className="w-4 h-4 opacity-50" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-center mb-6">
            <span className="font-mono text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              {formatTime(time)}
            </span>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleReset}
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
            >
              <Square className="w-5 h-5 text-slate-400" />
            </button>
            <button
              onClick={handleStartPause}
              className={cn(
                "w-16 h-12 rounded-2xl flex items-center justify-center transition-colors font-bold",
                isRunning 
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30" 
                  : "bg-cyan-400 text-black hover:bg-cyan-300 shadow-lg shadow-cyan-400/20"
              )}
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
