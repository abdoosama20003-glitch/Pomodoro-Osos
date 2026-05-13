"use client";

import { useState } from "react";
import { defaultWorkoutDays } from "@/lib/defaultData";
import { Play, CheckCircle2, Circle, PlayCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Stopwatch from "@/components/Stopwatch";

export default function WorkoutsPage() {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  const toggleExercise = (dayIndex: number, exerciseIndex: number) => {
    const key = `${dayIndex}-${exerciseIndex}`;
    setCompletedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="p-6 md:p-10 relative">
      <div className="mb-10">
        <p className="uppercase tracking-[0.4em] text-cyan-400 text-sm font-semibold mb-2">
          Training Plan
        </p>
        <h1 className="text-4xl md:text-5xl font-black">
          Workout <span className="text-cyan-400">Programs</span>
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl">
          Complete your daily workouts to maintain your streak. Watch the technique videos if you're unsure about the form.
        </p>
      </div>

      <div className="space-y-8">
        {defaultWorkoutDays.map((day, dayIndex) => {
          const isExpanded = expandedDay === dayIndex;
          
          // Calculate progress for this day
          const totalExercises = day.exercises.length;
          const completedCount = day.exercises.filter((_, i) => completedExercises[`${dayIndex}-${i}`]).length;
          const progressPercentage = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;
          const isDayComplete = progressPercentage === 100;

          return (
            <motion.div 
              key={dayIndex}
              initial={false}
              className={`rounded-[32px] overflow-hidden border transition-all duration-500 ${
                isExpanded ? 'border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]' : 'border-white/10 glass-card'
              }`}
            >
              {/* Card Header (Always visible) */}
              <div 
                className="relative cursor-pointer group min-h-[200px] flex flex-col justify-end p-8"
                onClick={() => setExpandedDay(isExpanded ? null : dayIndex)}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${day.image})` }}
                ></div>
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                  isExpanded 
                    ? 'bg-gradient-to-t from-[#060816] via-[#060816]/90 to-[#060816]/40' 
                    : 'bg-gradient-to-t from-[#060816] via-[#060816]/70 to-[#060816]/20'
                }`}></div>
                
                <div className="relative z-10 flex items-end justify-between w-full">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-cyan-400 font-semibold tracking-[0.2em] uppercase text-sm">
                        {day.day}
                      </span>
                      {isDayComplete && (
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold flex items-center border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                        </span>
                      )}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black">{day.title}</h2>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform group-hover:bg-white/20">
                      {isExpanded ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-white" />}
                    </div>
                    {progressPercentage > 0 && !isExpanded && (
                      <div className="mt-3 w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body (Expandable) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#060816]/95 backdrop-blur-xl"
                  >
                    <div className="p-6 md:p-8 space-y-4">
                      {/* Progress bar inside expanded state */}
                      <div className="mb-8">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Workout Progress</span>
                          <span className="text-cyan-400 font-bold">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" 
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {day.exercises.map((exercise, i) => {
                        const isCompleted = completedExercises[`${dayIndex}-${i}`];
                        return (
                          <div
                            key={i}
                            className={`rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 border ${
                              isCompleted 
                                ? 'bg-cyan-900/10 border-cyan-500/30' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-start md:items-center gap-4 flex-1">
                              <button 
                                onClick={() => toggleExercise(dayIndex, i)}
                                className="mt-1 md:mt-0 flex-shrink-0 focus:outline-none"
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                                ) : (
                                  <Circle className="w-8 h-8 text-slate-500 hover:text-cyan-400 transition-colors" />
                                )}
                              </button>

                              <div className="flex-1">
                                <h3 className={`text-xl font-bold ${isCompleted ? 'text-slate-300 line-through decoration-cyan-500/50' : 'text-white'}`}>
                                  {exercise.name}
                                </h3>
                                {exercise.description && (
                                  <p className="text-slate-400 text-sm mt-1 mb-3">
                                    {exercise.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {exercise.sets && (
                                    <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-semibold text-slate-300">
                                      {exercise.sets} Sets
                                    </span>
                                  )}
                                  {exercise.reps && (
                                    <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-semibold text-slate-300">
                                      {exercise.reps} Reps
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <a
                              href={exercise.video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#282828] hover:bg-[#3f3f3f] text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm flex-shrink-0"
                            >
                              <PlayCircle className="w-5 h-5 text-[#ff0000]" />
                              شرح التمرين
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      
      {/* Floating Stopwatch Component */}
      <Stopwatch />
    </div>
  );
}
